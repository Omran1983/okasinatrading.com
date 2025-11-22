# 📸 Bulk Image Upload Tool - Setup & Usage Guide

## 🎉 What You Just Got

A **premium bulk image upload tool** that will save you HOURS of manual work!

### Features:
✅ **Drag-and-drop multiple images** at once  
✅ **Auto-upload to Supabase Storage** with organized folder structure  
✅ **SKU-based organization** (`products/ANK-002/image-1.jpg`)  
✅ **Generate CSV with URLs** ready to paste into your product import  
✅ **Live preview gallery** of all uploaded images  
✅ **Copy individual URLs** with one click  
✅ **Progress tracking** during upload  

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Supabase Storage Bucket

1. Go to your **Supabase Dashboard**
2. Navigate to **Storage** in the left sidebar
3. Click **"New Bucket"**
4. Name it: `product-images`
5. **Make it PUBLIC** (toggle the "Public bucket" option)
6. Click **Create**

### Step 2: Set Storage Policies

In the Supabase Storage settings for `product-images`:

```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- Allow authenticated uploads (for admin)
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );
```

### Step 3: Access the Tool

Navigate to: **http://localhost:5173/admin/media**

---

## 📝 How to Use

### Workflow:

1. **Prepare Your Images**
   - Name them with SKU prefix: `ANK-002-1.jpg`, `ANK-002-2.jpg`, `BNS-001-1.jpg`
   - You can have multiple images per SKU
   - Supported formats: JPG, PNG, WEBP

2. **Upload**
   - Click **"Select Images"**
   - Choose all your product images (Ctrl+A to select all)
   - Wait for upload to complete (progress bar shows status)

3. **Download CSV**
   - Click **"Download CSV"** button
   - You'll get a file like this:
     ```csv
     sku,image_url_1,image_url_2,image_url_3
     ANK-002,https://...supabase.co/.../ANK-002-1.jpg,https://.../ANK-002-2.jpg,https://.../ANK-002-3.jpg
     BNS-001,https://...supabase.co/.../BNS-001-1.jpg,https://.../BNS-001-2.jpg
     ```

4. **Merge with Product CSV**
   - Open the downloaded CSV
   - Copy the image URL columns
   - Paste into your main product import CSV
   - Import products with images!

---

## 🎯 File Naming Convention

### ✅ Good Examples:
```
ANK-002-1.jpg          → SKU: ANK-002, Image 1
ANK-002-2.jpg          → SKU: ANK-002, Image 2
ANK-002-front.jpg      → SKU: ANK-002, Front view
BNS-001-main.png       → SKU: BNS-001, Main image
KRT-003-detail.webp    → SKU: KRT-003, Detail shot
```

### ❌ Bad Examples:
```
image1.jpg             → No SKU (will be marked as "UNKNOWN")
photo.png              → No SKU
my-product.jpg         → No clear SKU pattern
```

**Pattern:** `{SKU}-{anything}.{ext}`  
The tool extracts everything before the first dash as the SKU.

---

## 📂 Storage Structure

Images are organized in Supabase Storage like this:

```
product-images/
├── products/
│   ├── ANK-002/
│   │   ├── ANK-002-1.jpg
│   │   ├── ANK-002-2.jpg
│   │   └── ANK-002-3.jpg
│   ├── BNS-001/
│   │   ├── BNS-001-1.jpg
│   │   └── BNS-001-2.jpg
│   └── KRT-003/
│       └── KRT-003-main.jpg
```

**Benefits:**
- Easy to find images by SKU
- Clean organization
- Can add more images later
- Easy to delete/replace images

---

## 💡 Pro Tips

### 1. Batch Processing
Upload 50-100 images at a time for best performance. If you have 1000+ images, do them in batches.

### 2. Image Optimization
Before uploading:
- Resize to 1200x1600px (3:4 ratio) for product images
- Compress to reduce file size (use TinyPNG or similar)
- Use WEBP format for better compression

### 3. Multiple Images Per Product
Upload as many images as you want per SKU:
- `ANK-002-1.jpg` - Front view
- `ANK-002-2.jpg` - Back view
- `ANK-002-3.jpg` - Detail shot
- `ANK-002-4.jpg` - Model wearing
- `ANK-002-5.jpg` - Close-up

The CSV will include up to 5 images per SKU.

### 4. Updating Images
To replace an image:
1. Upload the new file with the same name
2. The tool uses `upsert: true`, so it will overwrite
3. Old URL stays the same (no need to update CSV)

---

## 🔧 Troubleshooting

### "Upload failed" errors
- **Check Supabase Storage bucket exists** (`product-images`)
- **Verify bucket is PUBLIC**
- **Check RLS policies** allow uploads
- **Check file size** (Supabase free tier: 1GB total, 50MB per file)

### Images not showing in preview
- **Check browser console** for errors
- **Verify public URL** is accessible (try opening in new tab)
- **Check file format** is supported (JPG, PNG, WEBP)

### CSV has wrong SKUs
- **Check file naming** follows pattern: `{SKU}-{anything}.{ext}`
- **Use consistent SKU format** (e.g., all uppercase)
- **Avoid special characters** in SKU

---

## 🎨 Next Steps

After uploading images:

1. **Download the CSV** with image URLs
2. **Open your product import CSV**
3. **Add columns**: `image_url_1`, `image_url_2`, `image_url_3`
4. **Copy URLs** from the generated CSV
5. **Import products** via Stock Manager

Your products will now have beautiful images!

---

## 📊 Example Workflow

```bash
# 1. Prepare images
ANK-002-1.jpg
ANK-002-2.jpg
BNS-001-1.jpg
KRT-003-1.jpg

# 2. Upload via Media Manager
→ Go to /admin/media
→ Select all 4 images
→ Wait for upload

# 3. Download CSV
→ Click "Download CSV"
→ Get: product_images_urls.csv

# 4. Merge with products CSV
sku,name,category,price,image_url_1,image_url_2
ANK-002,Anarkali Suit,Suits,3299,https://.../ANK-002-1.jpg,https://.../ANK-002-2.jpg
BNS-001,Banarasi Saree,Sarees,5999,https://.../BNS-001-1.jpg,
KRT-003,Cotton Kurti,Kurtis,899,https://.../KRT-003-1.jpg,

# 5. Import via Stock Manager
→ Go to /admin/stock-manager
→ Upload merged CSV
→ Import products with images!
```

---

## 🎉 You're All Set!

The Media Manager is now ready to use. Upload your first batch of images and see how easy it is!

**Access it at:** [http://localhost:5173/admin/media](http://localhost:5173/admin/media)

---

**Questions?** Check the in-app instructions or refer back to this guide.
