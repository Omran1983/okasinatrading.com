import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env');
const envConfig = fs.readFileSync(envPath, 'utf8');
const env = {};
envConfig.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function compareProducts() {
    const { data: allProducts } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: true });

    console.log('=== PRODUCT COMPARISON ===\n');
    console.log(`Total active products: ${allProducts.length}\n`);

    // Group by creation date
    const oldProducts = allProducts.filter(p => p.created_at < '2025-11-24');
    const newProducts = allProducts.filter(p => p.created_at >= '2025-11-24');

    console.log(`Old products (before today): ${oldProducts.length}`);
    console.log(`New products (imported today): ${newProducts.length}\n`);

    console.log('=== NEW PRODUCTS (Imported) ===');
    newProducts.forEach(p => {
        console.log(`\nID: ${p.id}`);
        console.log(`Name: ${p.name}`);
        console.log(`Category: ${p.category}`);
        console.log(`Image URL: ${p.image_url ? p.image_url.substring(0, 60) + '...' : 'NULL'}`);
        console.log(`Price MUR: ${p.price_mur}`);
        console.log(`Stock: ${p.stock_qty || p.stock || 'NULL'}`);
        console.log(`Created: ${p.created_at}`);
    });

    console.log('\n\n=== OLD PRODUCTS (Original) ===');
    oldProducts.forEach(p => {
        console.log(`\nID: ${p.id}`);
        console.log(`Name: ${p.name}`);
        console.log(`Category: ${p.category}`);
        console.log(`Image URL: ${p.image_url ? p.image_url.substring(0, 60) + '...' : 'NULL'}`);
        console.log(`Price MUR: ${p.price_mur}`);
    });
}

compareProducts();
