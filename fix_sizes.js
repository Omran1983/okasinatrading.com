import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

console.log(`Using key type: ${process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ? 'SERVICE_ROLE' : 'ANON'}`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixSizes() {
    console.log('Starting size fix...');

    // 1. Fetch all clothing products with null sizes
    const { data: products, error } = await supabase
        .from('products')
        .select('id, name, category, sizes')
        .eq('category', 'Clothing')
        .is('sizes', null);

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    console.log(`Found ${products.length} clothing products with missing sizes.`);

    if (products.length === 0) {
        console.log('No products to update.');
        return;
    }

    // 2. Update them
    const defaultSizes = 'XS, S, M, L, XL';

    // We can't do a bulk update with a where clause easily in one go for this specific case without a function,
    // so we'll loop (it's likely a small number for now, or we can use an `in` query if we want to be fancy,
    // but a loop is safe for a script).

    // Actually, we can update all matching rows in one go if we want them all to have the same value.
    const { data: updated, error: updateError } = await supabase
        .from('products')
        .update({ sizes: defaultSizes })
        .eq('category', 'Clothing')
        .is('sizes', null)
        .select();

    if (updateError) {
        console.error('Error updating products:', updateError);
    } else {
        console.log(`Successfully updated ${updated.length} products with default sizes: ${defaultSizes}`);
        updated.forEach(p => console.log(` - Updated: ${p.name}`));
    }
}

fixSizes();
