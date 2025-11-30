# Cloudinary AI Image Enhancement

## Overview
All product images uploaded through the **Media Manager** are automatically enhanced using Cloudinary's AI-powered transformations before being stored. This ensures every image looks professional, regardless of the original quality.

## Features

### Automatic Enhancements Applied
1. **Quality Optimization** (`quality: auto`)
   - Automatically adjusts compression for optimal file size without visible quality loss
   
2. **Format Optimization** (`fetch_format: auto`)
   - Delivers images in the most efficient format (WebP, AVIF) based on browser support
   
3. **AI Lighting & Color Enhancement** (`effect: improve:outdoor`)
   - Corrects poor lighting conditions
   - Enhances color vibrancy and saturation
   - Balances exposure and contrast
   
4. **Sharpening** (`effect: sharpen:100`)
   - Adds crisp detail to images
   - Makes blurry photos appear clearer

## How It Works

### Upload Flow
```
User selects images → Media Manager → Backend API → Cloudinary (with AI) → Enhanced URL returned
```

### Technical Implementation

#### Backend Endpoint: `/api/upload-image`
Located in `server.js`, this endpoint:
- Accepts image files via multipart/form-data
- Converts to base64 for Cloudinary upload
- Applies AI transformations on upload
- Returns enhanced image URL

```javascript
// Example transformation config
{
  folder: 'okasina-products',
  transformation: [
    { quality: "auto", fetch_format: "auto" },
    { effect: "improve:outdoor" },
    { effect: "sharpen:100" }
  ]
}
```

#### Frontend Integration
`MediaManagerPage.jsx` uploads images to the backend endpoint instead of directly to Supabase Storage.

## Usage

### For Administrators
1. Navigate to **Admin → Media Manager**
2. Click **"Select Images"**
3. Choose product images (name them with SKU prefix: `ANK-002-1.jpg`)
4. Wait for upload to complete
5. Download the CSV with enhanced image URLs
6. Use these URLs in your product import CSV

### Benefits
- **No manual editing required** - Poor quality images are automatically improved
- **Faster page loads** - Optimized formats and compression
- **Professional appearance** - All images have consistent, high quality
- **Future-proof** - Cloudinary serves the best format for each browser

## Configuration

### Cloudinary Credentials
Stored in `server.js` (lines 48-52):
```javascript
cloudinary.config({
  cloud_name: 'dw86lrpv6',
  api_key: '121943449379972',
  api_secret: 'uVWGCQ4jKjQWo5xZMCdRMs7rdLo'
});
```

> **Security Note**: These credentials are server-side only and never exposed to the browser.

### Customizing Enhancements
To adjust the AI enhancement settings, modify the `transformation` array in `server.js` (line 70):

```javascript
transformation: [
  { quality: "auto", fetch_format: "auto" },
  { effect: "improve:indoor" },  // Change to 'indoor' for indoor lighting
  { effect: "sharpen:50" }       // Reduce sharpening intensity
]
```

## Testing
A test script is included: `test-upload-endpoint.mjs`
```bash
node test-upload-endpoint.mjs
```

This uploads a sample image and verifies the enhancement pipeline.

## Dependencies
- `cloudinary` (v2.7.0)
- `multer` (for file uploads)

## Next Steps
To enable AI enhancement for other upload points:
1. Import the Cloudinary service: `import { uploadToCloudinary } from '../services/cloudinary'`
2. Replace direct Supabase uploads with `uploadToCloudinary(file)`
3. Store the returned enhanced URL in the database
