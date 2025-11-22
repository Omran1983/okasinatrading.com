# Bulk Import Feature - User Guide

## Overview
The Bulk Import feature allows you to quickly add or update hundreds of products at once using a CSV file. This is perfect for:
- Initial product catalog setup
- Seasonal inventory updates
- Price adjustments across multiple products
- Stock quantity updates

## Getting Started

### Step 1: Run the Database Migration
Before using the bulk import feature, you need to run the database migration to create the necessary tables.

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/001_bulk_import_schema.sql`
4. Paste and run the SQL script

This will create the following tables:
- Extended `products` table with new fields (sku, fabric, sizes, etc.)
- `product_media` - for storing multiple images per product
- `stock_movements` - audit trail for stock changes
- `bulk_jobs` - tracking import/export operations

### Step 2: Access the Stock Manager
1. Navigate to **http://localhost:5173/admin**
2. Click the **"Bulk Import Products"** button
3. You'll be redirected to the Stock Manager page

### Step 3: Download the CSV Template
1. Click **"Download CSV Template"**
2. This will download a file called `okasina_product_template.csv`
3. The template includes 8 sample products (Banarasi Saree, Anarkali Suit, etc.) to show you the format

## CSV File Format

### Required Columns
- `sku` - Unique product code (e.g., BNS-001)
- `name` - Product name
- `category` - Main category (Sarees, Suits, Kurtis, etc.)
- `selling_price` - Price customers pay
- `stock_qty` - Current stock quantity

### Optional Columns
- `design_no` - Internal design reference
- `subcategory` - More specific category (e.g., Banarasi Silk, Anarkali)
- `fabric` - Material (Cotton, Silk, Georgette, etc.)
- `color` - Color name
- `sizes` - Comma-separated sizes (S,M,L,XL,XXL)
- `cost_price` - Your cost (for profit tracking)
- `mrp` - Maximum Retail Price
- `description` - Full product description
- `care_instructions` - Washing/care guidelines
- `image_url_1` - Primary image URL
- `image_url_2` - Second image URL
- `image_url_3` - Third image URL

### Example Row
```csv
sku,design_no,name,category,subcategory,fabric,color,sizes,cost_price,selling_price,mrp,stock_qty,description,care_instructions,image_url_1,image_url_2,image_url_3
BNS-001,D2025-001,Banarasi Silk Saree - Royal Blue,Sarees,Banarasi Silk,Pure Silk,Royal Blue,Free Size,3500,5999,7999,15,"Exquisite Banarasi silk saree with intricate zari work. Perfect for weddings and festive occasions.","Dry clean only. Store in a cool, dry place.",https://images.unsplash.com/photo-1610030469983-98e550d6193c,,
```

## Import Process

### Step 1: Upload Your CSV
1. Click **"Upload CSV File"**
2. Select your prepared CSV file
3. The system will automatically parse and preview the data

### Step 2: Review Preview
- You'll see a preview of the first 10 products
- Each row is validated for:
  - Required fields (SKU, name, category, price, stock)
  - Valid numbers for prices and quantities
  - Proper formatting

### Step 3: Fix Validation Errors (if any)
- If there are errors, they'll be highlighted in red
- The error panel shows exactly what's wrong with each row
- Fix the errors in your CSV and re-upload

### Step 4: Import
1. Once validation passes, click **"Import Products"**
2. The system will:
   - Check if each SKU already exists
   - **Update** existing products
   - **Create** new products
   - Log stock movements for new products
   - Save additional images to `product_media` table

### Step 5: Review Results
- Success message shows how many products were imported
- If any rows failed, you'll see detailed error messages
- Failed rows can be fixed and re-imported

## Tips & Best Practices

### 1. Start Small
- Test with 5-10 products first
- Once you're comfortable, import your full catalog

### 2. Use Consistent SKUs
- SKUs are unique identifiers
- Use a consistent format (e.g., CAT-001, CAT-002)
- Never change a SKU once it's in use

### 3. Image URLs
- Use publicly accessible image URLs
- Unsplash, Cloudinary, or your own CDN work well
- For Supabase Storage: upload images first, then use the public URLs

### 4. Sizes Format
- For multiple sizes: `S,M,L,XL,XXL`
- For single size: `Free Size`
- No spaces after commas

### 5. Updating Existing Products
- The system uses SKU to match products
- If SKU exists: product is updated
- If SKU is new: product is created
- Stock movements are only logged for new products

### 6. Backup Before Bulk Updates
- Export your current products before major updates
- Keep a copy of your CSV files

## Troubleshooting

### "SKU is required" error
- Every product must have a unique SKU
- Check for empty SKU cells in your CSV

### "Valid selling price is required"
- Price must be a number
- Don't include currency symbols (Rs, $)
- Use decimal point for cents (e.g., 1999.99)

### "Valid stock quantity is required"
- Stock must be a whole number
- Can't be negative

### Images not showing
- Check if image URLs are publicly accessible
- Try opening the URL in a browser
- Use HTTPS URLs (not HTTP)

### Import stuck at "Importing..."
- Check your internet connection
- Large imports (500+ products) may take 2-3 minutes
- Don't close the browser tab

## Advanced Features (Coming Soon)

- **AI-Powered Data Enrichment**: Auto-generate descriptions and tags
- **Bulk Export**: Download current products to Excel
- **Stock Health Dashboard**: AI suggestions for reordering
- **Image Upload**: Drag-and-drop bulk image upload

## Need Help?

If you encounter issues:
1. Check the browser console for errors (F12)
2. Verify your Supabase connection
3. Ensure RLS policies allow admin access
4. Check that all migrations ran successfully

---

**Last Updated**: November 22, 2025
**Version**: 1.0.0
