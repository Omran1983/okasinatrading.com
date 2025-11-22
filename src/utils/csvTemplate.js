// Sample Indian Ladies Fashionwear Products for CSV Template (with Size Variants)
export const sampleProducts = [
    {
        sku: 'BNS-001',
        design_no: 'D2025-001',
        name: 'Banarasi Silk Saree - Royal Blue',
        category: 'Sarees',
        subcategory: 'Banarasi Silk',
        fabric: 'Pure Silk',
        color: 'Royal Blue',
        sizes: 'Free Size',
        stock_by_size: 'Free Size:15',
        cost_price: 3500,
        selling_price: 5999,
        mrp: 7999,
        description: '',  // Will be AI-generated
        care_instructions: '',  // Will be AI-generated
        image_url_1: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c',
        image_url_2: '',
        image_url_3: ''
    },
    {
        sku: 'ANK-002',
        design_no: 'D2025-002',
        name: 'Anarkali Suit - Emerald Green',
        category: 'Suits',
        subcategory: 'Anarkali',
        fabric: 'Georgette',
        color: 'Emerald Green',
        sizes: 'S,M,L,XL,XXL',
        stock_by_size: 'S:5,M:10,L:8,XL:2,XXL:0',
        cost_price: 1800,
        selling_price: 3299,
        mrp: 4999,
        description: '',
        care_instructions: '',
        image_url_1: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2',
        image_url_2: '',
        image_url_3: ''
    },
    {
        sku: 'KRT-003',
        design_no: 'D2025-003',
        name: 'Cotton Kurti - Floral Print',
        category: 'Kurtis',
        subcategory: 'Casual',
        fabric: 'Cotton',
        color: 'Multi',
        sizes: 'S,M,L,XL',
        stock_by_size: 'S:12,M:15,L:18,XL:5',
        cost_price: 450,
        selling_price: 899,
        mrp: 1299,
        description: '',
        care_instructions: '',
        image_url_1: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f',
        image_url_2: '',
        image_url_3: ''
    },
    {
        sku: 'LHG-004',
        design_no: 'D2025-004',
        name: 'Lehenga Choli - Bridal Red',
        category: 'Lehengas',
        subcategory: 'Bridal',
        fabric: 'Velvet',
        color: 'Red',
        sizes: 'S,M,L,XL',
        stock_by_size: 'S:2,M:3,L:2,XL:1',
        cost_price: 8500,
        selling_price: 14999,
        mrp: 19999,
        description: '',
        care_instructions: '',
        image_url_1: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8',
        image_url_2: '',
        image_url_3: ''
    },
    {
        sku: 'PLZ-005',
        design_no: 'D2025-005',
        name: 'Palazzo Set - Pastel Pink',
        category: 'Sets',
        subcategory: 'Palazzo',
        fabric: 'Rayon',
        color: 'Pastel Pink',
        sizes: 'S,M,L,XL,XXL',
        stock_by_size: 'S:7,M:10,L:12,XL:4,XXL:2',
        cost_price: 650,
        selling_price: 1299,
        mrp: 1899,
        description: '',
        care_instructions: '',
        image_url_1: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf',
        image_url_2: '',
        image_url_3: ''
    },
    {
        sku: 'CHR-006',
        design_no: 'D2025-006',
        name: 'Churidar Suit - Navy Blue',
        category: 'Suits',
        subcategory: 'Churidar',
        fabric: 'Cotton Blend',
        color: 'Navy Blue',
        sizes: 'S,M,L,XL',
        stock_by_size: 'S:5,M:8,L:5,XL:2',
        cost_price: 950,
        selling_price: 1799,
        mrp: 2499,
        description: '',
        care_instructions: '',
        image_url_1: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb',
        image_url_2: '',
        image_url_3: ''
    },
    {
        sku: 'SLW-007',
        design_no: 'D2025-007',
        name: 'Salwar Kameez - Mustard Yellow',
        category: 'Suits',
        subcategory: 'Salwar',
        fabric: 'Chanderi',
        color: 'Mustard Yellow',
        sizes: 'S,M,L,XL,XXL',
        stock_by_size: 'S:3,M:6,L:5,XL:3,XXL:1',
        cost_price: 1200,
        selling_price: 2199,
        mrp: 3299,
        description: '',
        care_instructions: '',
        image_url_1: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c',
        image_url_2: '',
        image_url_3: ''
    },
    {
        sku: 'DUP-008',
        design_no: 'D2025-008',
        name: 'Designer Dupatta - Gold Zari',
        category: 'Accessories',
        subcategory: 'Dupatta',
        fabric: 'Silk',
        color: 'Gold',
        sizes: 'Free Size',
        stock_by_size: 'Free Size:40',
        cost_price: 450,
        selling_price: 899,
        mrp: 1299,
        description: '',
        care_instructions: '',
        image_url_1: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c',
        image_url_2: '',
        image_url_3: ''
    }
];

// CSV Headers (updated with stock_by_size)
export const csvHeaders = [
    'sku',
    'design_no',
    'name',
    'category',
    'subcategory',
    'fabric',
    'color',
    'sizes',
    'stock_by_size',
    'cost_price',
    'selling_price',
    'mrp',
    'description',
    'care_instructions',
    'image_url_1',
    'image_url_2',
    'image_url_3'
];

// Generate CSV content
export function generateCSVTemplate() {
    const rows = [csvHeaders.join(',')];

    sampleProducts.forEach(product => {
        const row = csvHeaders.map(header => {
            const value = product[header] || '';
            // Escape commas and quotes in values
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        rows.push(row.join(','));
    });

    return rows.join('\n');
}

// Download CSV file
export function downloadCSV(content, filename = 'okasina_product_template.csv') {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
