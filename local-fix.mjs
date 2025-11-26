import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env manually
const envPath = path.resolve('.env');
const envConfig = fs.readFileSync(envPath, 'utf8');
const env = {};
envConfig.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        env[key.trim()] = value.trim();
    }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixProducts() {
    console.log('Connecting to:', supabaseUrl);

    // Check current status
    const { data: counts, error: countError } = await supabase
        .from('products')
        .select('status, count');
    // .select('status', { count: 'exact' }); // count not supported in select like this easily without group

    // Simple select to see what we have
    const { data: products, error: selectError } = await supabase
        .from('products')
        .select('id, status')
        .eq('status', 'draft')
        .limit(5);

    console.log('Found drafts:', products?.length);

    if (products?.length > 0) {
        console.log('Attempting update...');
        const { data, error } = await supabase
            .from('products')
            .update({ status: 'active' })
            .eq('status', 'draft')
            .select();

        if (error) {
            console.error('Update Error:', error);
        } else {
            console.log('Updated:', data.length);
        }
    } else {
        console.log('No drafts found to update.');
    }
}

console.log('Starting script...');
fixProducts().then(() => console.log('Script finished.')).catch(e => console.error('Script failed:', e));
