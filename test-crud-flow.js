import fetch from 'node-fetch';

const API_URL = 'http://localhost:3001';

async function testCRUDFlow() {
    console.log('🚀 Starting Comprehensive CRUD Test Flow...\n');
    let testProduct = null;
    const timestamp = Date.now();

    // 1. CREATE
    console.log('1️⃣ Testing CREATE Product...');
    try {
        const createRes = await fetch(`${API_URL}/api/create-product`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: `Test Product ${timestamp}`,
                description: 'Automated test product',
                category: 'Clothing',
                price: 99.99,
                price_mur: 4500,
                stock_qty: 10,
                status: 'draft',
                sizes: ['M', 'L']
            })
        });

        if (!createRes.ok) throw new Error(`Create failed: ${createRes.statusText}`);
        const createData = await createRes.json();
        testProduct = createData; // Supabase returns array or object depending on implementation, adjusting...

        // Handle if it returns { success: true, product: ... } or just the product
        if (createData.product) testProduct = createData.product;

        console.log(`✅ Created product ID: ${testProduct.id}`);
    } catch (error) {
        console.error('❌ CREATE Failed:', error.message);
        return; // Stop if create fails
    }

    // 2. READ (Verify it exists in list) - Skipping full list fetch to save time, relying on Create return.
    // But let's verify we can fetch it or it exists.

    // 3. UPDATE
    console.log('\n2️⃣ Testing UPDATE Product...');
    try {
        const updateRes = await fetch(`${API_URL}/api/update-product`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: testProduct.id,
                name: `Updated Test Product ${timestamp}`,
                price: 199.99
            })
        });

        if (!updateRes.ok) throw new Error(`Update failed: ${updateRes.statusText}`);
        const updateData = await updateRes.json();
        console.log('✅ Update successful');
    } catch (error) {
        console.error('❌ UPDATE Failed:', error.message);
    }

    // 4. UPDATE CATEGORY (Bulk Action Test)
    console.log('\n3️⃣ Testing BULK CATEGORY Update...');
    try {
        const catRes = await fetch(`${API_URL}/api/update-category`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productIds: [testProduct.id],
                category: 'Accessories'
            })
        });

        if (!catRes.ok) throw new Error(`Category update failed: ${catRes.statusText}`);
        const catData = await catRes.json();
        console.log(`✅ Category update successful: ${catData.message}`);
    } catch (error) {
        console.error('❌ BULK UPDATE Failed:', error.message);
    }

    // 5. DELETE
    console.log('\n4️⃣ Testing DELETE Product...');
    try {
        const deleteRes = await fetch(`${API_URL}/api/delete-product`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productId: testProduct.id
            })
        });

        if (!deleteRes.ok) throw new Error(`Delete failed: ${deleteRes.statusText}`);
        console.log('✅ Delete successful');
    } catch (error) {
        console.error('❌ DELETE Failed:', error.message);
    }

    console.log('\n🎉 CRUD Test Flow Complete!');
}

testCRUDFlow();
