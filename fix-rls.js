// fix-rls.js - Script to fix RLS policies for products table
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function fixRLS() {
    console.log('🔧 Fixing RLS policies for products table...\n');

    try {
        // Option 1: Disable RLS completely (simpler, less secure)
        console.log('Option 1: Disabling RLS...');
        const { error: disableError } = await supabase.rpc('exec_sql', {
            sql: 'ALTER TABLE products DISABLE ROW LEVEL SECURITY;'
        });

        if (disableError) {
            console.log('⚠️  Could not disable RLS directly. Trying alternative method...\n');

            // Option 2: Create permissive policy
            console.log('Option 2: Creating permissive "Allow All" policy...');

            // Drop existing policies
            await supabase.rpc('exec_sql', {
                sql: `
          DROP POLICY IF EXISTS "Enable read access for all users" ON products;
          DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON products;
          DROP POLICY IF EXISTS "Enable update for authenticated users only" ON products;
          DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON products;
          DROP POLICY IF EXISTS "Allow all operations" ON products;
        `
            });

            // Create new permissive policy
            const { error: policyError } = await supabase.rpc('exec_sql', {
                sql: `
          CREATE POLICY "Allow all operations" ON products
          FOR ALL
          USING (true)
          WITH CHECK (true);
        `
            });

            if (policyError) {
                console.error('❌ Error creating policy:', policyError);
                console.log('\n📝 Please run this SQL manually in Supabase Dashboard > SQL Editor:\n');
                console.log(`
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- OR if you want to keep RLS enabled:

DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON products;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON products;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON products;

CREATE POLICY "Allow all operations" ON products
FOR ALL
USING (true)
WITH CHECK (true);
        `);
                process.exit(1);
            }

            console.log('✅ Successfully created permissive policy!');
        } else {
            console.log('✅ Successfully disabled RLS!');
        }

        console.log('\n🎉 Done! You can now update and delete products from the admin panel.');
        console.log('   Try refreshing the admin products page and testing again.\n');

    } catch (error) {
        console.error('❌ Unexpected error:', error);
        console.log('\n📝 Please run this SQL manually in Supabase Dashboard > SQL Editor:\n');
        console.log('ALTER TABLE products DISABLE ROW LEVEL SECURITY;');
    }
}

fixRLS();
