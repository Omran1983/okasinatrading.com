// AI Product Enrichment Utility
// Generates missing product details based on available information

/**
 * Generate product description based on category, fabric, color
 */
export function generateDescription(product) {
    const { name, category, subcategory, fabric, color, sizes } = product;

    // If description already exists, return it
    if (product.description && product.description.length > 20) {
        return product.description;
    }

    // Category-specific templates
    const templates = {
        'Sarees': {
            prefix: 'Exquisite',
            features: ['intricate weaving', 'elegant drape', 'traditional craftsmanship'],
            occasions: ['weddings', 'festive celebrations', 'special occasions']
        },
        'Suits': {
            prefix: 'Elegant',
            features: ['comfortable fit', 'beautiful embroidery', 'flowing silhouette'],
            occasions: ['parties', 'festive events', 'casual outings']
        },
        'Kurtis': {
            prefix: 'Stylish',
            features: ['comfortable design', 'versatile styling', 'modern cut'],
            occasions: ['daily wear', 'office', 'casual gatherings']
        },
        'Lehengas': {
            prefix: 'Stunning',
            features: ['heavy embellishment', 'luxurious fabric', 'intricate detailing'],
            occasions: ['weddings', 'grand celebrations', 'bridal events']
        },
        'Sets': {
            prefix: 'Trendy',
            features: ['coordinated pieces', 'effortless style', 'contemporary design'],
            occasions: ['casual wear', 'weekend outings', 'everyday comfort']
        }
    };

    const template = templates[category] || templates['Suits'];

    let description = `${template.prefix} ${subcategory || category.toLowerCase()}`;

    if (fabric) {
        description += ` crafted in premium ${fabric.toLowerCase()} fabric`;
    }

    if (color) {
        description += `. The ${color.toLowerCase()} color adds a touch of sophistication`;
    }

    description += `. Features ${template.features[0]} and ${template.features[1]}`;
    description += `. Perfect for ${template.occasions[0]} and ${template.occasions[1]}`;

    if (sizes && sizes !== 'Free Size') {
        description += `. Available in multiple sizes for the perfect fit`;
    }

    description += '.';

    return description;
}

/**
 * Generate care instructions based on fabric type
 */
export function generateCareInstructions(fabric) {
    const careGuide = {
        'Silk': 'Dry clean only. Store in a cool, dry place away from direct sunlight. Avoid contact with perfume or deodorant.',
        'Pure Silk': 'Dry clean recommended. Can be hand washed in cold water with mild detergent. Iron on low heat while damp.',
        'Cotton': 'Machine wash cold with similar colors. Tumble dry low or line dry. Iron on medium heat if needed.',
        'Georgette': 'Hand wash or dry clean. Use cold water and mild detergent. Iron on low heat. Avoid wringing.',
        'Velvet': 'Dry clean only. Handle with care to avoid crushing the pile. Store hanging to prevent creases.',
        'Rayon': 'Hand wash or machine wash on gentle cycle. Use cold water. Hang to dry. Iron on low heat.',
        'Chanderi': 'Dry clean preferred. Can be hand washed gently in cold water. Iron on low heat. Store in muslin cloth.',
        'Cotton Blend': 'Machine wash cold. Tumble dry low. Iron on medium heat. Wash dark colors separately.',
        'Chiffon': 'Hand wash in cold water with mild detergent. Do not wring. Hang to dry. Iron on low heat with cloth.',
        'Crepe': 'Dry clean recommended. Can be hand washed in cold water. Hang to dry. Iron on low heat if needed.'
    };

    return careGuide[fabric] || 'Hand wash or dry clean recommended. Iron on low heat. Store in a cool, dry place.';
}

/**
 * Generate SEO-friendly title
 */
export function generateSEOTitle(product) {
    const { name, category, subcategory, fabric, color } = product;

    let title = name;

    // Add category if not in name
    if (!name.toLowerCase().includes(category.toLowerCase())) {
        title += ` - ${category}`;
    }

    // Add fabric if premium
    const premiumFabrics = ['Silk', 'Velvet', 'Chanderi', 'Banarasi'];
    if (fabric && premiumFabrics.includes(fabric) && !name.includes(fabric)) {
        title += ` in ${fabric}`;
    }

    // Add "for Women" for better SEO
    title += ' for Women';

    // Limit to 60 characters for SEO
    if (title.length > 60) {
        title = title.substring(0, 57) + '...';
    }

    return title;
}

/**
 * Generate product tags for search
 */
export function generateTags(product) {
    const { category, subcategory, fabric, color, name } = product;
    const tags = new Set();

    // Category tags
    if (category) tags.add(category.toLowerCase());
    if (subcategory) tags.add(subcategory.toLowerCase());

    // Fabric tags
    if (fabric) {
        tags.add(fabric.toLowerCase());
        // Add fabric type tags
        if (fabric.includes('Silk')) tags.add('silk');
        if (fabric.includes('Cotton')) tags.add('cotton');
    }

    // Color tags
    if (color) {
        tags.add(color.toLowerCase());
        // Add color family tags
        const colorFamilies = {
            'Red': ['red', 'maroon', 'crimson'],
            'Blue': ['blue', 'navy', 'royal blue'],
            'Green': ['green', 'emerald', 'olive'],
            'Yellow': ['yellow', 'mustard', 'golden'],
            'Pink': ['pink', 'rose', 'blush'],
            'Black': ['black', 'dark'],
            'White': ['white', 'ivory', 'cream']
        };

        Object.entries(colorFamilies).forEach(([family, variants]) => {
            if (variants.some(v => color.toLowerCase().includes(v))) {
                tags.add(family.toLowerCase());
            }
        });
    }

    // Occasion tags based on category
    const occasionTags = {
        'Sarees': ['wedding', 'festive', 'traditional', 'ethnic'],
        'Lehengas': ['bridal', 'wedding', 'party', 'festive'],
        'Suits': ['casual', 'party', 'ethnic', 'festive'],
        'Kurtis': ['casual', 'daily wear', 'office', 'comfortable'],
        'Sets': ['casual', 'trendy', 'modern', 'comfortable']
    };

    if (occasionTags[category]) {
        occasionTags[category].forEach(tag => tags.add(tag));
    }

    // Style tags
    tags.add('indian wear');
    tags.add('ethnic');
    tags.add('women');

    return Array.from(tags);
}

/**
 * Enrich product with AI-generated content
 */
export function enrichProduct(product) {
    const enriched = { ...product };

    // Generate description if missing
    if (!enriched.description || enriched.description.length < 20) {
        enriched.description = generateDescription(product);
        enriched.ai_generated = true;
    }

    // Generate care instructions if missing
    if (!enriched.care_instructions && enriched.fabric) {
        enriched.care_instructions = generateCareInstructions(enriched.fabric);
    }

    // Generate SEO title
    if (!enriched.seo_title) {
        enriched.seo_title = generateSEOTitle(product);
    }

    // Generate tags
    if (!enriched.tags || enriched.tags.length === 0) {
        enriched.tags = generateTags(product);
    }

    // Set AI confidence (simple heuristic)
    const fieldsGenerated = [
        !product.description,
        !product.care_instructions,
        !product.seo_title,
        !product.tags || product.tags.length === 0
    ].filter(Boolean).length;

    enriched.ai_confidence = Math.max(0.6, 1 - (fieldsGenerated * 0.1));

    return enriched;
}

/**
 * Parse size and stock data from CSV format
 * Input: sizes="S,M,L,XL", stock_by_size="S:5,M:10,L:8,XL:2"
 * Output: [{ size: 'S', stock: 5 }, { size: 'M', stock: 10 }, ...]
 */
export function parseSizeStock(sizesStr, stockBySizeStr) {
    const variants = [];

    // Handle "Free Size" case
    if (sizesStr === 'Free Size' || !sizesStr.includes(',')) {
        const stock = parseInt(stockBySizeStr) || 0;
        return [{ size: sizesStr || 'Free Size', stock }];
    }

    // Parse sizes
    const sizes = sizesStr.split(',').map(s => s.trim()).filter(Boolean);

    // Parse stock by size
    const stockMap = {};
    if (stockBySizeStr) {
        stockBySizeStr.split(',').forEach(pair => {
            const [size, stock] = pair.split(':').map(s => s.trim());
            if (size && stock) {
                stockMap[size] = parseInt(stock) || 0;
            }
        });
    }

    // Create variants
    sizes.forEach(size => {
        variants.push({
            size,
            stock: stockMap[size] || 0
        });
    });

    return variants;
}

/**
 * Generate variant SKU
 * Input: baseSKU="ANK-002", size="M"
 * Output: "ANK-002-M"
 */
export function generateVariantSKU(baseSKU, size, color = null) {
    let variantSKU = baseSKU;

    if (size && size !== 'Free Size') {
        variantSKU += `-${size.toUpperCase()}`;
    }

    if (color) {
        const colorCode = color.substring(0, 3).toUpperCase();
        variantSKU += `-${colorCode}`;
    }

    return variantSKU;
}
