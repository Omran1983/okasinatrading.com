import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:3001';

const routes = [
    '/',
    '/shop',
    '/about',
    '/contact',
    '/admin/dashboard',
    '/admin/products',
    '/admin/orders',
    '/admin/customers',
    '/admin/analytics',
    '/admin/automation',
    '/admin/album-import',
    '/admin/stock-manager'
];

const apiEndpoints = [
    '/api/test',
    // '/api/create-product', // POST only
    // '/api/update-product', // POST only
    // '/api/delete-product', // POST only
    // '/api/update-category' // POST only
];

async function checkUrl(url, description) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            console.log(`✅ [${response.status}] ${description}: ${url}`);
            return true;
        } else {
            console.error(`❌ [${response.status}] ${description}: ${url}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ [ERROR] ${description}: ${url} - ${error.message}`);
        return false;
    }
}

async function runVerification() {
    console.log('🚀 Starting Full Site Verification...\n');
    let passed = 0;
    let failed = 0;

    console.log('--- Checking Frontend Routes ---');
    for (const route of routes) {
        const success = await checkUrl(`${BASE_URL}${route}`, `Route ${route}`);
        if (success) passed++; else failed++;
    }

    console.log('\n--- Checking Backend API ---');
    for (const endpoint of apiEndpoints) {
        const success = await checkUrl(`${API_URL}${endpoint}`, `API ${endpoint}`);
        if (success) passed++; else failed++;
    }

    console.log('\n--- Verification Summary ---');
    console.log(`Total Checks: ${passed + failed}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);

    if (failed === 0) {
        console.log('\n✅ All checks passed! The site structure is healthy.');
    } else {
        console.log('\n⚠️ Some checks failed. Please investigate.');
    }
}

runVerification();
