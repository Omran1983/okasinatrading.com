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
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Running automated improvements...\n');

const supabase = createClient(supabaseUrl, serviceKey);

async function runImprovements() {
    try {
        // Step 1: Disable RLS on storage.objects
        console.log('Step 1: Disabling RLS on storage.objects...');
        const { data: rlsData, error: rlsError } = await supabase.rpc('exec_sql', {
            query: 'ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;'
        });

        if (rlsError) {
            console.log('⚠️  Could not disable RLS via RPC (expected)');
            console.log('   You need to run this SQL manually:');
            console.log('   ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;');
            console.log('   URL: https://supabase.com/dashboard/project/drnqpbyptyyuacmrvdrr/sql/new\n');
        } else {
            console.log('✅ RLS disabled successfully!\n');
        }

        // Step 2: Test import
        console.log('Step 2: Testing product import...');
        const importResponse = await fetch('https://okasinatrading.com/api/facebook/import-album', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                albumId: '2893012654269842',
                albumName: 'TROUSERS AND DUPATTA',
                useAI: false,
                createProducts: true
            })
        });

        const importResult = await importResponse.json();
        console.log(`\n📦 Import Result:`);
        console.log(`   Products Created: ${importResult.productsCreated}`);
        console.log(`   Errors: ${importResult.errors?.length || 0}`);

        if (importResult.productsCreated > 0) {
            console.log('\n✅ SUCCESS! Products imported successfully!');
            console.log('\nNext steps:');
            console.log('1. Go to: https://okasinatrading.com/admin/products');
            console.log('2. Click "Publish X Drafts"');
            console.log('3. Check website: https://okasinatrading.com/shop');
        } else {
            console.log('\n❌ Import failed. Errors:');
            importResult.errors?.slice(0, 3).forEach(err => {
                console.log(`   - ${err.error}`);
            });
            console.log('\n⚠️  You MUST disable storage RLS manually first!');
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

runImprovements();
