# 🚀 AI Smart Import - Quick Start Guide

## ✅ What's Ready NOW

### 1. AI-Powered Product Import
- **Analyzes photos** from Facebook/Instagram
- **Auto-generates** product names, descriptions, categories, prices
- **Creates products** directly in your database
- **Works 24/7** with or without Ollama

### 2. How to Use

#### Step 1: Start Ollama (Optional but Recommended)
```bash
# In a terminal, run:
ollama serve
```
Leave this running in the background for best AI quality.

#### Step 2: Import Album
1. Go to: `https://okasinatrading.com/admin/album-import`
2. Click **"Refresh Album List"**
3. Select an album (Facebook or Instagram)
4. **Toggle Options:**
   - ✅ **Use AI Analysis** - ON for smart generation
   - ✅ **Auto-Create Products** - ON to add to database
5. Click **"Import Selected Album"**

#### Step 3: Review Products
- Products are created as **DRAFTS** (not visible on site yet)
- Go to `/admin/products` to review and publish
- Edit names, prices, descriptions as needed
- Click "Publish" to make them live

---

## 🎯 What Happens During Import

### With Ollama Running:
1. Downloads photos from Facebook/Instagram
2. Uploads to Supabase Storage
3. **Sends to Ollama** (`qwen2.5:7b`) for analysis
4. Generates smart product details
5. Creates products in database
6. Shows preview + CSV

**Speed:** ~3-5 seconds per product

### Without Ollama (Fallback):
1. Downloads photos
2. Uploads to Supabase
3. **Uses smart rules** (filename patterns, keywords)
4. Generates good product details
5. Creates products in database

**Speed:** ~1 second per product

---

## 📊 Import Options Explained

| Option | What it does | Recommended |
|--------|--------------|-------------|
| **Use AI Analysis** | Uses Ollama for smarter names/descriptions | ✅ ON (if Ollama running) |
| **Auto-Create Products** | Adds products to database automatically | ✅ ON (saves time) |

**Both OFF:** Just downloads images + CSV (original behavior)

---

## 🔧 Troubleshooting

### "AI Status: ○ Offline"
- Ollama is not running
- Products still created with fallback (good quality)
- To fix: Run `ollama serve` in terminal

### Products not showing on website
- They're created as **DRAFTS**
- Go to `/admin/products`
- Click "Publish" on each product

### Import is slow
- Normal! Processing 40+ photos takes 2-5 minutes
- Don't close the page
- Watch the progress in browser console (F12)

---

## 🎨 Next: Instagram + Feedback Import

Coming in next deployment:
- ✅ Instagram photo import (same UI)
- ✅ Facebook/Instagram comments import
- ✅ Auto-post new products to social media
- ✅ Real-time metrics dashboard

---

## 💡 Pro Tips

1. **Test with small albums first** (5-10 photos)
2. **Keep Ollama running** for best results
3. **Review drafts before publishing**
4. **Use CSV export** for bulk editing in Excel
5. **Import during off-hours** for faster processing

---

**Ready to test?** Go to `/admin/album-import` now! 🚀
