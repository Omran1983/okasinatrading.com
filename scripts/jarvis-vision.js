#!/usr/bin/env node
/**
 * JARVIS Vision AI - Image Text Extraction
 * Extracts text and numbers from product images to auto-populate descriptions
 */

import { createClient } from '@supabase/supabase-js';
import vision from '@google-cloud/vision';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

// Initialize Google Cloud Vision client (if credentials available)
let visionClient;
try {
    visionClient = new vision.ImageAnnotatorClient();
    console.log('✅ Google Cloud Vision initialized');
} catch (error) {
    console.log('⚠️  Google Cloud Vision not configured, using fallback OCR');
}

console.log('🤖 JARVIS Vision AI - Image Text Extraction\n');

/**
 * Extract text from image URL using Google Cloud Vision
 */
async function extractTextFromImage(imageUrl) {
    try {
        if (!visionClient) {
            return await fallbackOCR(imageUrl);
        }

        console.log(`🔍 Analyzing image: ${imageUrl.substring(0, 50)}...`);

        const [result] = await visionClient.textDetection(imageUrl);
        const detections = result.textAnnotations;

        if (detections && detections.length > 0) {
            const fullText = detections[0].description;
            console.log(`✅ Extracted text (${fullText.length} chars)`);
            return {
                fullText,
                lines: fullText.split('\n').filter(line => line.trim()),
                success: true
            };
        }

        return { fullText: '', lines: [], success: false };
    } catch (error) {
        console.error(`❌ Vision API error: ${error.message}`);
        return await fallbackOCR(imageUrl);
    }
}

/**
 * Fallback OCR using Gemini Vision (if available)
 */
async function fallbackOCR(imageUrl) {
    try {
        const geminiKey = process.env.GOOGLE_AI_KEY || process.env.VITE_GEMINI_API_KEY;

        if (!geminiKey) {
            console.log('⚠️  No OCR service available');
            return { fullText: '', lines: [], success: false };
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: 'Extract ALL text from this image. Include prices, sizes, product names, and descriptions. Format as plain text.' },
                            {
                                inline_data: {
                                    mime_type: 'image/jpeg',
                                    data: await imageToBase64(imageUrl)
                                }
                            }
                        ]
                    }]
                })
            }
        );

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        return {
            fullText: text,
            lines: text.split('\n').filter(line => line.trim()),
            success: true
        };
    } catch (error) {
        console.error(`❌ Fallback OCR error: ${error.message}`);
        return { fullText: '', lines: [], success: false };
    }
}

/**
 * Convert image URL to base64
 */
async function imageToBase64(url) {
    const response = await fetch(url);
    const buffer = await response.buffer();
    return buffer.toString('base64');
}

/**
 * Parse extracted text to identify product details
 */
function parseProductDetails(extractedText) {
    const { fullText, lines } = extractedText;

    const details = {
        name: '',
        description: '',
        price: null,
        sizes: [],
        colors: [],
        materials: [],
        brand: ''
    };

    // Extract prices (Rs, $, EUR, etc.)
    const pricePatterns = [
        /Rs\.?\s*(\d+(?:,\d+)*(?:\.\d{2})?)/gi,
        /\$\s*(\d+(?:,\d+)*(?:\.\d{2})?)/gi,
        /(\d+(?:,\d+)*(?:\.\d{2})?)\s*(?:Rs|USD|EUR|MUR)/gi
    ];

    for (const pattern of pricePatterns) {
        const match = fullText.match(pattern);
        if (match) {
            const priceStr = match[0].replace(/[^\d.]/g, '');
            details.price = parseFloat(priceStr);
            break;
        }
    }

    // Extract sizes
    const sizePatterns = [
        /\b(XS|S|M|L|XL|XXL|XXXL)\b/gi,
        /\bSize[s]?:\s*([^\n]+)/gi,
        /\b(\d{2,3})\s*(?:cm|inch)/gi
    ];

    for (const pattern of sizePatterns) {
        const matches = fullText.matchAll(pattern);
        for (const match of matches) {
            if (match[1] && !details.sizes.includes(match[1].toUpperCase())) {
                details.sizes.push(match[1].toUpperCase());
            }
        }
    }

    // Extract colors
    const colorKeywords = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'pink', 'purple', 'brown', 'gray', 'beige', 'navy', 'maroon'];
    for (const color of colorKeywords) {
        const regex = new RegExp(`\\b${color}\\b`, 'gi');
        if (regex.test(fullText)) {
            details.colors.push(color.charAt(0).toUpperCase() + color.slice(1));
        }
    }

    // Extract materials
    const materials = ['cotton', 'silk', 'polyester', 'wool', 'leather', 'denim', 'linen', 'chiffon', 'satin'];
    for (const material of materials) {
        const regex = new RegExp(`\\b${material}\\b`, 'gi');
        if (regex.test(fullText)) {
            details.materials.push(material.charAt(0).toUpperCase() + material.slice(1));
        }
    }

    // Use first meaningful line as name (if not too long)
    for (const line of lines) {
        if (line.length > 5 && line.length < 100 && !line.match(/^\d+$/)) {
            details.name = line.trim();
            break;
        }
    }

    // Create description from extracted text
    const descriptionLines = lines.filter(line =>
        line.length > 10 &&
        !line.match(/^(Rs|Price|Size|Color)/i)
    ).slice(0, 5);

    details.description = descriptionLines.join('. ');

    // Add extracted details to description
    if (details.materials.length > 0) {
        details.description += ` Made from ${details.materials.join(', ')}.`;
    }
    if (details.colors.length > 0) {
        details.description += ` Available in ${details.colors.join(', ')}.`;
    }

    return details;
}

/**
 * Process a single product image
 */
async function processProductImage(productId, imageUrl) {
    console.log(`\n📸 Processing product ${productId}`);

    const extractedText = await extractTextFromImage(imageUrl);

    if (!extractedText.success || !extractedText.fullText) {
        console.log('⚠️  No text extracted from image');
        return null;
    }

    const details = parseProductDetails(extractedText);

    console.log('📝 Extracted Details:');
    console.log(`   Name: ${details.name || 'N/A'}`);
    console.log(`   Price: ${details.price ? 'Rs ' + details.price : 'N/A'}`);
    console.log(`   Sizes: ${details.sizes.join(', ') || 'N/A'}`);
    console.log(`   Colors: ${details.colors.join(', ') || 'N/A'}`);
    console.log(`   Materials: ${details.materials.join(', ') || 'N/A'}`);
    console.log(`   Description: ${details.description.substring(0, 100)}...`);

    return details;
}

/**
 * Update product in database with extracted details
 */
async function updateProductWithExtractedData(productId, details) {
    const updates = {};

    if (details.name && details.name.length > 5) {
        updates.name = details.name;
    }
    if (details.description && details.description.length > 20) {
        updates.description = details.description;
    }
    if (details.price && details.price > 0) {
        updates.price = details.price;
        updates.price_mur = details.price; // Assuming price is in MUR
    }
    if (details.sizes && details.sizes.length > 0) {
        updates.sizes = details.sizes;
    }

    if (Object.keys(updates).length === 0) {
        console.log('⚠️  No updates to apply');
        return false;
    }

    const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', productId);

    if (error) {
        console.error(`❌ Failed to update product: ${error.message}`);
        return false;
    }

    console.log(`✅ Updated product ${productId} with ${Object.keys(updates).length} fields`);
    return true;
}

/**
 * Process all products with images but missing descriptions
 */
async function processAllProducts() {
    console.log('🔍 Finding products with images but incomplete data...\n');

    const { data: products, error } = await supabase
        .from('products')
        .select('id, name, description, image_url, image')
        .or('description.is.null,description.eq.')
        .not('image_url', 'is', null);

    if (error) {
        console.error('❌ Failed to fetch products:', error.message);
        return;
    }

    console.log(`📦 Found ${products.length} products to process\n`);

    let processed = 0;
    let updated = 0;

    for (const product of products.slice(0, 10)) { // Limit to 10 for testing
        const imageUrl = product.image_url || product.image;
        if (!imageUrl) continue;

        const details = await processProductImage(product.id, imageUrl);
        if (details) {
            const success = await updateProductWithExtractedData(product.id, details);
            if (success) updated++;
        }
        processed++;

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`\n✨ Processed ${processed} products, updated ${updated}`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    processAllProducts().catch(console.error);
}

export { extractTextFromImage, parseProductDetails, processProductImage, updateProductWithExtractedData };
