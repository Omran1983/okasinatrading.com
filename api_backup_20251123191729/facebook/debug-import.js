import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    res.setHeader('Content-Type', 'application/json');

    const {
        FB_ACCESS_TOKEN,
        VITE_SUPABASE_URL,
        VITE_SUPABASE_ANON_KEY,
        SUPABASE_STORAGE_BUCKET
    } = process.env;

    const COVER_ALBUM_ID = '480369384124723';
    const logs = [];
    const log = (msg) => logs.push(`${new Date().toISOString()} - ${msg}`);

    const results = {
        steps: {
            env: false,
            fbFetch: false,
            imageDownload: false,
            supabaseUpload: false,
            dbInsert: false
        },
        details: {},
        logs
    };

    try {
        // 1. Check Env
        log('Checking environment variables...');
        if (!FB_ACCESS_TOKEN || !VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY || !SUPABASE_STORAGE_BUCKET) {
            throw new Error('Missing environment variables');
        }
        results.steps.env = true;

        // 2. Fetch 1 Photo from FB
        log('Fetching 1 photo from Facebook...');
        const fbUrl = `https://graph.facebook.com/v19.0/${COVER_ALBUM_ID}/photos?fields=images,id&limit=1&access_token=${FB_ACCESS_TOKEN}`;
        const fbRes = await fetch(fbUrl);
        const fbData = await fbRes.json();

        if (fbData.error) throw new Error(`FB API Error: ${fbData.error.message}`);
        if (!fbData.data || fbData.data.length === 0) throw new Error('No photos found in album');

        const photo = fbData.data[0];
        const imageUrl = photo.images[0].source;
        results.steps.fbFetch = true;
        results.details.photoId = photo.id;

        // 3. Download Image
        log(`Downloading image: ${imageUrl.substring(0, 50)}...`);
        const imgRes = await fetch(imageUrl);
        if (!imgRes.ok) throw new Error(`Failed to download image: ${imgRes.status}`);
        const imgBuffer = await imgRes.arrayBuffer();
        const buffer = Buffer.from(imgBuffer);
        results.steps.imageDownload = true;

        // 4. Upload to Supabase
        log('Initializing Supabase...');
        const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);
        const filename = `debug-test-${Date.now()}.jpg`;

        log(`Uploading to bucket: ${SUPABASE_STORAGE_BUCKET}, file: ${filename}`);
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(SUPABASE_STORAGE_BUCKET)
            .upload(filename, buffer, {
                contentType: 'image/jpeg',
                upsert: true
            });

        if (uploadError) throw new Error(`Supabase Upload Error: ${uploadError.message}`);
        results.steps.supabaseUpload = true;

        const { data: urlData } = supabase.storage
            .from(SUPABASE_STORAGE_BUCKET)
            .getPublicUrl(filename);

        results.details.publicUrl = urlData.publicUrl;

        // 5. Insert into DB (Corrected Fields)
        log('Inserting test product into DB...');

        // Using 'stock_qty' instead of 'stock' based on schema file
        const productPayload = {
            name: '[DEBUG] Test Product ' + Date.now(),
            description: 'Debug test',
            price: 100,
            category: 'Accessories',
            image_url: urlData.publicUrl,
            stock_qty: 1, // Changed from stock to stock_qty
            status: 'draft' // Re-added status as it should exist
        };

        const { data: product, error: dbError } = await supabase
            .from('products')
            .insert(productPayload)
            .select()
            .single();

        if (dbError) {
            results.details.dbError = dbError;
            throw new Error(`DB Error: ${dbError.code} - ${dbError.message}`);
        }

        results.steps.dbInsert = true;
        results.details.productId = product.id;

        return res.status(200).json(results);

    } catch (error) {
        results.error = error.message;
        results.stack = error.stack;
        return res.status(500).json(results);
    }
}
