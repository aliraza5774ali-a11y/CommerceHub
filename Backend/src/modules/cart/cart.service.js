import { cartRepository } from './cart.repository.js';
import { AppError, assertFound } from '../../utils/errors.js';

function priceOf(item) { return Number(item.salePrice ?? item.price); }
function present(cart, items) {
  const mapped = items.map((item) => ({ ...item, unitPrice: priceOf(item), subtotal: priceOf(item) * item.quantity, availableQuantity: Math.max(0, Number(item.stockQuantity || 0) - Number(item.reservedQuantity || 0)) }));
  const subtotal = mapped.reduce((sum, item) => sum + item.subtotal, 0);
  return { ...cart, items: mapped, subtotal, discount: 0, shipping: 0, tax: 0, total: subtotal };
}
async function load(userId, tenantId) { const cart = await cartRepository.findOrCreate(userId, tenantId); return present(cart, await cartRepository.items(cart.id, tenantId)); }
function validateQuantity(quantity) { if (!Number.isInteger(quantity) || quantity <= 0) throw new AppError('Quantity must be a positive integer', 422, 'INVALID_QUANTITY'); }
function validateStock(item, quantity) { if (item.status !== 'published') throw new AppError('Product is unavailable', 409, 'PRODUCT_UNAVAILABLE'); const available = Number(item.stockQuantity || 0) - Number(item.reservedQuantity || 0); if (quantity > available) throw new AppError('Requested quantity is not available', 409, 'INSUFFICIENT_STOCK'); }

export const cartService = {
  get: load,
  async add(userId, tenantId, { productId, quantity }) {
    validateQuantity(quantity);
    const cart = await cartRepository.findOrCreate(userId, tenantId);
    const product = assertFound(await cartRepository.productForCart(productId, tenantId), 'Product not found');
    const [existing] = (await cartRepository.items(cart.id, tenantId)).filter((item) => String(item.productId) === String(productId));
    const item = { ...product };
    validateStock(item, Number(existing?.quantity || 0) + quantity);
    await cartRepository.addItem(cart.id, tenantId, productId, quantity);
    return load(userId, tenantId);
  },
  async update(userId, tenantId, itemId, quantity) {
    validateQuantity(quantity);
    const cart = await cartRepository.findOrCreate(userId, tenantId);
    const item = assertFound((await cartRepository.items(cart.id, tenantId)).find((entry) => String(entry.id) === String(itemId)), 'Cart item not found');
    validateStock(item, quantity);
    if (!(await cartRepository.updateItem(itemId, cart.id, tenantId, quantity))) throw new AppError('Cart item not found', 404, 'CART_ITEM_NOT_FOUND');
    return load(userId, tenantId);
  },
  async remove(userId, tenantId, itemId) { const cart = await cartRepository.findOrCreate(userId, tenantId); if (!(await cartRepository.removeItem(itemId, cart.id, tenantId))) throw new AppError('Cart item not found', 404, 'CART_ITEM_NOT_FOUND'); return load(userId, tenantId); },
  async clear(userId, tenantId) { const cart = await cartRepository.findOrCreate(userId, tenantId); await cartRepository.clear(cart.id, tenantId); return load(userId, tenantId); }
};
