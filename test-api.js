
async function testEndpoints() {
    console.log('Testing API endpoints...');

    // 1. Test /api/test
    try {
        console.log('\n--- Testing /api/test ---');
        const res = await fetch('http://localhost:3001/api/test');
        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Body:', text);
    } catch (e) {
        console.error('Error testing /api/test:', e.message);
    }

    // 2. Test /api/delete-product
    try {
        console.log('\n--- Testing /api/delete-product ---');
        const res = await fetch('http://localhost:3001/api/delete-product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: 'test-id' })
        });
        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Body:', text);
    } catch (e) {
        console.error('Error testing /api/delete-product:', e.message);
    }
}

testEndpoints();
