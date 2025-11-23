// Quick Product Seeder - Adds sample products to your store
// Run with: node scripts/seed-products-simple.js

import 'dotenv/config';
import pkg from '@supabase/supabase-js';
const { createClient } = pkg;

// Load from .env file
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing Supabase credentials in .env file');
    console.error('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const sampleProducts = [
    {
        name: "Elegant Summer Dress",
        description: "Beautiful floral summer dress perfect for any occasion. Made with high-quality breathable fabric.",
        price: 65.00,
        category: "Clothing",
        image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
        stock_qty: 15,
        status: "active",
        tags: ["dress", "summer", "floral", "elegant"]
    },
    {
        name: "Classic Denim Jacket",
        description: "Timeless denim jacket that goes with everything. Durable and stylish.",
        price: 85.00,
        category: "Clothing",
        image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
        stock_qty: 20,
        status: "active",
        tags: ["jacket", "denim", "classic", "casual"]
    },
    {
        name: "Stylish Leather Handbag",
        description: "Premium leather handbag with multiple compartments. Perfect for daily use.",
        price: 120.00,
        category: "Accessories",
        image_url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
        stock_qty: 10,
        status: "active",
        tags: ["bag", "leather", "handbag", "accessories"]
    },
    {
        name: "Casual White Sneakers",
        description: "Comfortable white sneakers for everyday wear. Classic design that never goes out of style.",
        price: 75.00,
        category: "Accessories",
        image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
        stock_qty: 25,
        status: "active",
        tags: ["shoes", "sneakers", "white", "casual"]
    },
    {
        name: "Bohemian Maxi Skirt",
        description: "Flowing maxi skirt with beautiful patterns. Perfect for summer evenings.",
        price: 55.00,
        category: "Clothing",
        image_url: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800",
        stock_qty: 12,
        status: "active",
        tags: ["skirt", "maxi", "bohemian", "summer"]
    },
    {
        name: "Designer Sunglasses",
        description: "Trendy sunglasses with UV protection. Stylish and functional.",
        price: 45.00,
        category: "Accessories",
        image_url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800",
        stock_qty: 30,
        status: "active",
        tags: ["sunglasses", "accessories", "designer", "trendy"]
    },
    {
        name: "Cozy Knit Sweater",
        description: "Warm and comfortable knit sweater. Perfect for cooler weather.",
        price: 70.00,
        category: "Clothing",
        image_url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800",
        stock_qty: 18,
        status: "active",
        tags: ["sweater", "knit", "cozy", "winter"]
    },
    {
        name: "Statement Necklace",
        description: "Bold statement necklace to elevate any outfit. Eye-catching design.",
        price: 35.00,
        category: "Accessories",
        image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800",
        stock_qty: 15,
        status: "active",
        tags: ["jewelry", "necklace", "statement", "accessories"]
    },
    {
        name: "High-Waisted Jeans",
        description: "Classic high-waisted jeans with a perfect fit. Versatile and comfortable.",
        price: 80.00,
        category: "Clothing",
        image_url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800",
        stock_qty: 22,
        status: "active",
        tags: ["jeans", "denim", "high-waisted", "classic"]
    },
    {
        name: "Silk Scarf",
        description: "Luxurious silk scarf with elegant patterns. Adds sophistication to any look.",
        price: 40.00,
        category: "Accessories",
        image_url: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800",
        stock_qty: 20,
        status: "active",
        tags: ["scarf", "silk", "luxury", "accessories"]
    },
    {
        name: "Formal Blazer",
        description: "Professional blazer perfect for business or formal occasions. Tailored fit.",
        price: 95.00,
        category: "Clothing",
        image_url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
        stock_qty: 14,
        status: "active",
        tags: ["blazer", "formal", "professional", "tailored"]
    },
    {
        name: "Crossbody Bag",
        description: "Compact crossbody bag perfect for hands-free convenience. Stylish and practical.",
        price: 60.00,
        category: "Accessories",
        image_url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
        stock_qty: 16,
        status: "active",
        tags: ["bag", "crossbody", "compact", "practical"]
    }
];

async function seedProducts() {
    console.log('🌱 Starting product seeding...\n');

    try {
        // Insert products
        console.log(`📦 Inserting ${sampleProducts.length} products...`);

        const productsToInsert = sampleProducts.map(p => ({
            ...p,
            price_mur: p.price * 45, // Approximate conversion
        }));

        const { data, error } = await supabase
            .from('products')
            .insert(productsToInsert)
            .select();

        if (error) {
            console.error('❌ Error inserting products:', error.message);
            console.error('Details:', error);
            process.exit(1);
        }

        console.log(`\n✅ Successfully added ${data.length} products!\n`);
        console.log('📊 Products added:');
        data.forEach((product, index) => {
            console.log(`   ${index + 1}. ${product.name} - $${product.price} (${product.category})`);
        });

        console.log('\n🎉 Your store is now populated!');
        console.log('🌐 Visit: https://okasinatrading.com/shop\n');

    } catch (error) {
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    }
}

// Run the seeder
seedProducts();
