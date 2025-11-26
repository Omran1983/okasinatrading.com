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

// Use Service Role Key if available
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(env.VITE_SUPABASE_URL, supabaseKey);

async function publishAllDrafts() {
    console.log('Publishing ALL draft products...\n');

    // First, check how many drafts exist
    const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft');

    console.log(`Found ${count} draft products`);

    if (count === 0) {
        console.log('No drafts to publish!');
        return;
    }

    // Publish them
    const { data, error } = await supabase
        .from('products')
        .update({ status: 'active' })
        .eq('status', 'draft')
        .select();

    if (error) {
        console.error('Error publishing:', error);
    } else {
        console.log(`✅ Successfully published ${data.length} products!`);
    }

    // Check final count
    const { count: activeCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

    console.log(`\n📊 Total active products now: ${activeCount}`);
}

publishAllDrafts();
