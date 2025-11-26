
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProduct() {
    const productId = '897b1d2e-b895-4983-8f2e-24fcd740ddf0'; // ID from the URL in the screenshot/logs
    console.log(`Fetching product: ${productId}`);

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

    if (error) {
        console.error('Error fetching product:', error);
        return;
    }

    console.log('Product Data:');
    console.log('Name:', data.name);
    console.log('Category:', data.category);
    console.log('Sizes (raw):', data.sizes);
    console.log('Sizes (type):', typeof data.sizes);

    if (data.sizes) {
        console.log('Sizes (split):', data.sizes.split(',').map(s => s.trim()));
    }
}

checkProduct();
