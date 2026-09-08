const fs = require('fs');
const TEST_API_URL = 'http://127.0.0.1:4000/api';

async function request(endpoint, method = 'GET', body = null, token = null, domain = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    let url = `${TEST_API_URL}${endpoint}`;
    if (domain) {
        url += (url.includes('?') ? '&' : '?') + `domain=${domain}`;
    }

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(url, options);
    let data;
    try {
        data = await res.json();
    } catch {
        data = await res.text();
    }
    return { status: res.status, data };
}

async function runTests() {
    let report = [];
    const log = (msg) => { console.log(msg); report.push(msg); };
    
    log("=== E2E Test Suite ===");
    
    let res = await request('/domains/resolve', 'GET', null, null, 'ali-tech.localhost');
    log(`Resolve ali-tech: ${res.status}`);
    
    res = await request('/domains/resolve', 'GET', null, null, 'zee-scents.localhost');
    log(`Resolve zee-scents: ${res.status}`);
    
    const aliOwner = { email: `owner_ali_${Date.now()}@example.com`, password: 'Password123!', firstName: 'Ali', lastName: 'Owner', storeName: 'Ali Tech Test', storeSlug: `ali-${Date.now()}` };
    res = await request('/auth/register', 'POST', aliOwner);
    log(`Register Ali Owner: ${res.status}`);
    const aliOwnerToken = res.data?.data?.accessToken;
    
    const zeeOwner = { email: `owner_zee_${Date.now()}@example.com`, password: 'Password123!', firstName: 'Zee', lastName: 'Owner', storeName: 'Zee Scents Test', storeSlug: `zee-${Date.now()}` };
    res = await request('/auth/register', 'POST', zeeOwner);
    log(`Register Zee Owner: ${res.status}`);
    const zeeOwnerToken = res.data?.data?.accessToken;
    
    const aliCustomer = { email: `cust_ali_${Date.now()}@example.com`, password: 'Password123!', firstName: 'Ali', lastName: 'Customer' };
    res = await request('/auth/register', 'POST', aliCustomer, null, aliOwner.storeSlug + '.localhost');
    log(`Register Ali Customer: ${res.status}`);
    let aliCustomerToken = res.status === 201 ? res.data?.data?.accessToken : null;

    let p = await request('/catalog/products', 'POST', { name: 'Ali Product', slug: 'ali-prod', type: 'physical', price: 100, status: 'published' }, aliOwnerToken, aliOwner.storeSlug + '.localhost');
    log(`Create Ali Product: ${p.status}`);
    const aliProdId = p.data?.data?.id;

    if (aliProdId) {
        let z = await request(`/catalog/products/${aliProdId}`, 'GET', null, zeeOwnerToken, zeeOwner.storeSlug + '.localhost');
        log(`Zee Owner access Ali Product: ${z.status} (Expected 404/403)`);
    }

    console.log("Done");
}

runTests().catch(console.error);
