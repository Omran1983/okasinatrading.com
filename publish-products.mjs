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

async function publishAndCheck() {
    console.log('Publishing draft products...');
    const { data, error } = await supabase
        .from('products')
        .update({ status: 'active' })
        .eq('status', 'draft')
        .select();

    if (error) {
        console.error('Error:', error);
    } else {
        console.log(`✅ Published ${data.length} products!`);
    }

    // Check total active products
    const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

    console.log(`📊 Total active products: ${count}`);
}

publishAndCheck();
