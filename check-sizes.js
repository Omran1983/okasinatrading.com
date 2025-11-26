import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://drnqpbyptyyuacmrvdrr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRybnFwYnlwdHl5dWFjbXJ2ZHJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5MjI3OTAsImV4cCI6MjA0NzQ5ODc5MH0.5iNmxVCjqQXwFiMqKvPYBIgEKCKNhPLpRsNOEYkBZcU'
);

async function checkSizes() {
    const { data, error } = await supabase
        .from('products')
        .select('id, name, sizes, category, status')
        .eq('status', 'active')
        .limit(20);

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('\n=== PRODUCTS WITH SIZES ===\n');
    const withSizes = data.filter(p => p.sizes);
    console.log(`Products with sizes: ${withSizes.length}`);
    withSizes.forEach(p => {
        console.log(`- ${p.name}: ${p.sizes}`);
    });

    console.log('\n=== PRODUCTS WITHOUT SIZES ===\n');
    const withoutSizes = data.filter(p => !p.sizes);
    console.log(`Products without sizes: ${withoutSizes.length}`);
    withoutSizes.forEach(p => {
        console.log(`- ${p.name} (${p.category})`);
    });

    console.log(`\nTotal active products checked: ${data.length}`);
}

checkSizes();
