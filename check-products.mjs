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

async function checkProducts() {
    console.log('Checking active products in database...\n');
    const { data, error } = await supabase
        .from('products')
        .select('id, name, status, image_url, price_mur, category, created_at')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(15);

    if (error) {
        console.error('Error:', error);
    } else {
        console.log(`Total active products: ${data.length}\n`);
        console.log('Recent products:');
        data.forEach((p, i) => {
            console.log(`${i + 1}. ${p.name}`);
            console.log(`   Status: ${p.status}`);
            console.log(`   Category: ${p.category || 'NULL'}`);
            console.log(`   Image: ${p.image_url ? 'YES' : 'NO'}`);
            console.log(`   Price MUR: ${p.price_mur || 'NULL'}`);
            console.log(`   Created: ${p.created_at}`);
            console.log('');
        });
    }
}

checkProducts();
