import test from 'node:test';
import assert from 'node:assert/strict';

if (process.env.MYSQL_INTEGRATION !== '1') {
  test('real MySQL integration suite (opt-in)', { skip: 'Set MYSQL_INTEGRATION=1 to run against commercehub_test' }, () => {});
} else {
  process.env.DB_NAME = process.env.TEST_DB_NAME || 'commercehub_test';
  process.env.NODE_ENV = 'development';
  process.env.JWT_ACCESS_SECRET ||= '12345678901234567890123456789012';
  process.env.JWT_REFRESH_SECRET ||= 'abcdefghijklmnopqrstuvwxyz123456';

  const { app } = await import('../src/app.js');
  const { pool } = await import('../src/database/connection.js');

  async function request(baseUrl, path, options = {}) {
    const response = await fetch(`${baseUrl}${path}`, { headers: { 'content-type': 'application/json', ...(options.token ? { authorization: `Bearer ${options.token}` } : {}), ...(options.idempotencyKey ? { 'idempotency-key': options.idempotencyKey } : {}) }, method: options.method || 'GET', body: options.body === undefined ? undefined : JSON.stringify(options.body) });
    const json = await response.json();
    return { response, json };
  }

  test('real MySQL commerce workflow and tenant isolation', async () => {
    const server = app.listen(0);
    const baseUrl = `http://127.0.0.1:${server.address().port}`;
    const suffix = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    try {
      const register = async (name, slug) => request(baseUrl, '/api/auth/register', { method: 'POST', body: { storeName: name, storeSlug: `${slug}-${suffix}`, email: `${slug}-${suffix}@example.test`, password: 'Password123!', firstName: 'Integration', lastName: 'User' } });
      const tenantA = await register('Integration Ali Tech', 'ali-test');
      const tenantB = await register('Integration Zee Scents', 'zee-test');
      assert.equal(tenantA.response.status, 201);
      assert.equal(tenantB.response.status, 201);
      const tokenA = tenantA.json.data.accessToken;
      const tokenB = tenantB.json.data.accessToken;
      assert.ok(tokenA && tokenB);

      const me = await request(baseUrl, '/api/auth/me', { token: tokenA });
      assert.equal(me.response.status, 200);
      const forgot = await request(baseUrl, '/api/auth/forgot-password', { method: 'POST', body: { email: `ali-test-${suffix}@example.test` } });
      assert.equal(forgot.response.status, 200);
      assert.ok(forgot.json.data.resetToken);
      const reset = await request(baseUrl, '/api/auth/reset-password', { method: 'POST', body: { token: forgot.json.data.resetToken, password: 'Password456!' } });
      assert.equal(reset.response.status, 200);
      const logout = await request(baseUrl, '/api/auth/logout', { method: 'POST', body: { refreshToken: tenantA.json.data.refreshToken } });
      assert.equal(logout.response.status, 200);
      const revokedRefresh = await request(baseUrl, '/api/auth/refresh', { method: 'POST', body: { refreshToken: tenantA.json.data.refreshToken } });
      assert.equal(revokedRefresh.response.status, 401);

      const product = await request(baseUrl, '/api/catalog/products', { method: 'POST', token: tokenA, body: { name: 'Integration Product', slug: `integration-product-${suffix}`, price: 100, sku: `INT-${suffix}` } });
      assert.equal(product.response.status, 201);
      const productId = product.json.data.id;
      const category = await request(baseUrl, '/api/catalog/categories', { method: 'POST', token: tokenA, body: { name: 'Integration Category', slug: `integration-category-${suffix}` } });
      assert.equal(category.response.status, 201);
      const brand = await request(baseUrl, '/api/catalog/brands', { method: 'POST', token: tokenA, body: { name: 'Integration Brand', slug: `integration-brand-${suffix}` } });
      assert.equal(brand.response.status, 201);
      const variant = await request(baseUrl, `/api/catalog/products/${productId}/variants`, { method: 'POST', token: tokenA, body: { sku: `INT-V-${suffix}`, price: 100, attributes: { size: 'M' } } });
      assert.equal(variant.response.status, 201);
      const image = await request(baseUrl, `/api/catalog/products/${productId}/images`, { method: 'POST', token: tokenA, body: { imageUrl: 'https://example.test/integration.png', altText: 'Integration image', isPrimary: true } });
      assert.equal(image.response.status, 201);
      const crossTenant = await request(baseUrl, `/api/catalog/products/${productId}`, { token: tokenB });
      assert.equal(crossTenant.response.status, 404);

      const published = await request(baseUrl, `/api/catalog/products/${productId}/publish`, { method: 'POST', token: tokenA });
      assert.equal(published.response.status, 200);
      const stock = await request(baseUrl, `/api/inventory/${productId}/adjust`, { method: 'POST', token: tokenA, body: { delta: 2, reason: 'integration stock' } });
      assert.equal(stock.response.status, 200);

      const add = await request(baseUrl, '/api/cart/items', { method: 'POST', token: tokenA, body: { productId, quantity: 1 } });
      assert.equal(add.response.status, 201);
      const key = `integration-checkout-${suffix}`;
      const checkout = await request(baseUrl, '/api/orders', { method: 'POST', token: tokenA, idempotencyKey: key, body: { paymentMethod: 'COD' } });
      assert.equal(checkout.response.status, 201);
      assert.equal(checkout.json.data.idempotent, false);
      const repeat = await request(baseUrl, '/api/orders', { method: 'POST', token: tokenA, idempotencyKey: key, body: { paymentMethod: 'COD' } });
      assert.equal(repeat.response.status, 201);
      assert.equal(repeat.json.data.idempotent, true);
      assert.equal(repeat.json.data.order.id, checkout.json.data.order.id);

      const paymentId = checkout.json.data.payment.id;
      const confirmation = await request(baseUrl, `/api/payments/${paymentId}/confirm`, { method: 'POST', token: tokenA });
      assert.equal(confirmation.response.status, 200);
      const wishlist = await request(baseUrl, '/api/wishlist', { method: 'POST', token: tokenA, body: { productId } });
      assert.equal(wishlist.response.status, 201);
      const duplicateWishlist = await request(baseUrl, '/api/wishlist', { method: 'POST', token: tokenA, body: { productId } });
      assert.equal(duplicateWishlist.response.status, 201);
      const otherTenantWishlist = await request(baseUrl, '/api/wishlist', { method: 'POST', token: tokenB, body: { productId } });
      assert.equal(otherTenantWishlist.response.status, 404);
      const wishlistRead = await request(baseUrl, '/api/wishlist', { token: tokenA });
      assert.equal(wishlistRead.response.status, 200);
      assert.equal(wishlistRead.json.data.length, 1);
      const settings = await request(baseUrl, '/api/settings', { token: tokenA });
      assert.equal(settings.response.status, 200);
      const promotion = await request(baseUrl, '/api/promotions', { method: 'POST', token: tokenA, body: { code: `INT${suffix}`, name: 'Integration Discount', type: 'percentage', value: 10 } });
      assert.equal(promotion.response.status, 201);
      const promotionCheck = await request(baseUrl, '/api/promotions/validate', { method: 'POST', token: tokenA, body: { code: `INT${suffix}`, subtotal: 100 } });
      assert.equal(promotionCheck.response.status, 200);
      const adminOrders = await request(baseUrl, '/api/admin/orders', { token: tokenA });
      assert.equal(adminOrders.response.status, 200);
    } finally {
      await new Promise((resolve) => server.close(resolve));
      await pool.end();
    }
  });
}
