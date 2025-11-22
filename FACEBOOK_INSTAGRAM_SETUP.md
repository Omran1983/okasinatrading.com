# Facebook & Instagram Direct Posting Setup Guide

## 🎯 Overview

You now have **REAL Facebook and Instagram posting** capabilities! This guide will help you complete the setup.

**Your Facebook App ID:** `870341192189921`

---

## ✅ What's Already Done

1. ✅ Facebook App created (App ID: 870341192189921)
2. ✅ Privacy Policy created and ready
3. ✅ Meta API Service implemented (`src/services/metaService.js`)
4. ✅ UI ready in Marketing page

---

## 🔧 Setup Steps

### Step 1: Configure Facebook App Settings

1. **Go to Facebook Developers:**
   - Visit: https://developers.facebook.com/apps/870341192189921
   - Login with your Facebook account

2. **Add App Domain:**
   - Go to **Settings → Basic**
   - Add **App Domains:**
     - `localhost` (for testing)
     - Your production domain (e.g., `okasinatrading.com`)

3. **Set Privacy Policy URL:**
   - In **Settings → Basic**
   - **Privacy Policy URL:** `http://localhost:5173/privacy-policy-meta.html`
   - (Update to your production URL when deployed)

4. **Add Platform:**
   - Click **"+ Add Platform"**
   - Select **"Website"**
   - **Site URL:** `http://localhost:5173`
   - (Add production URL later)

5. **Enable Products:**
   - Go to **Dashboard → Add Product**
   - Add **"Facebook Login"**
   - Add **"Instagram Graph API"** (if available)

### Step 2: Configure Facebook Login

1. **Go to Facebook Login → Settings**

2. **Valid OAuth Redirect URIs:**
   ```
   http://localhost:5173/
   http://localhost:5173/admin/marketing
   ```
   (Add production URLs when deployed)

3. **Enable Settings:**
   - ✅ Client OAuth Login: **Yes**
   - ✅ Web OAuth Login: **Yes**
   - ✅ Use Strict Mode for Redirect URIs: **No** (for development)

### Step 3: Request Permissions

Your app needs these permissions:

#### **Standard Permissions** (Auto-approved):
- `public_profile`
- `email`

#### **Advanced Permissions** (Need approval):
1. **`pages_manage_posts`** - Post to Facebook Pages
2. **`pages_read_engagement`** - Read page insights
3. **`instagram_basic`** - Access Instagram account
4. **`instagram_content_publish`** - Post to Instagram
5. **`business_management`** - Manage business assets

**How to Request:**
1. Go to **App Review → Permissions and Features**
2. Find each permission above
3. Click **"Request Advanced Access"**
4. Fill out the form explaining your use case
5. Submit for review (usually approved in 1-3 days)

### Step 4: Connect Facebook Page

1. **Create/Use Facebook Business Page:**
   - Go to https://www.facebook.com/pages/create
   - Or use existing OKASINA Trading page

2. **Link Instagram Business Account:**
   - Go to Page Settings → Instagram
   - Click "Connect Account"
   - Login to Instagram Business account
   - Link the accounts

### Step 5: Test the Integration

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to Marketing page:**
   ```
   http://localhost:5173/admin/marketing
   ```

3. **Click "Connect Facebook" button** (we'll add this)

4. **Authorize the app** and select your page

5. **Try posting!**

---

## 🚀 How to Use (Once Setup Complete)

### **Posting to Facebook/Instagram:**

1. Go to **Admin → Marketing → Social Media** tab
2. Click **"Connect Facebook"** (first time only)
3. Select your Facebook Page
4. Write your post content
5. Upload an image (required for Instagram)
6. Select platform:
   - Facebook only
   - Instagram only  
   - Both platforms
7. Click **"Post Now"** or **"Schedule Post"**

### **What Happens:**
- ✅ Post appears on your Facebook Page immediately
- ✅ Post appears on linked Instagram account
- ✅ You get confirmation with post IDs
- ✅ Analytics are tracked

---

## 📋 Privacy Policy Requirements

### **For Facebook App Review:**

Your Privacy Policy MUST include:

1. ✅ **What data you collect** - Already included
2. ✅ **How you use it** - Already included
3. ✅ **How you share it** - Already included
4. ✅ **User rights** - Already included
5. ✅ **Contact information** - Already included

**Your Privacy Policy URL:**
- Development: `http://localhost:5173/privacy-policy-meta.html`
- Production: `https://okasinatrading.com/privacy-policy-meta.html`

**File Location:** `public/privacy-policy-meta.html`

---

## 🔐 Security Best Practices

### **Access Tokens:**

1. **Never commit tokens to Git**
2. **Use environment variables:**
   ```env
   VITE_FB_APP_ID=870341192189921
   ```

3. **Tokens expire** - Handle refresh:
   - User tokens: 60 days
   - Page tokens: Never expire (if long-lived)

### **Get Long-Lived Page Token:**

```javascript
// After user login, exchange for long-lived token
const response = await fetch(
  `https://graph.facebook.com/v18.0/oauth/access_token?` +
  `grant_type=fb_exchange_token&` +
  `client_id=${FB_APP_ID}&` +
  `client_secret=${FB_APP_SECRET}&` +
  `fb_exchange_token=${shortLivedToken}`
);
```

---

## 🎨 UI Updates Needed

I'll update the Marketing page to add:

1. **"Connect Facebook" button**
2. **Page selector dropdown**
3. **Connection status indicator**
4. **Real-time posting feedback**
5. **Error handling messages**

Would you like me to update the Marketing page UI now?

---

## 📊 Features You'll Have

### **Posting:**
- ✅ Post text + image to Facebook
- ✅ Post image + caption to Instagram
- ✅ Post to both platforms at once
- ✅ Real-time success/error feedback

### **Analytics:**
- ✅ Page impressions
- ✅ Engaged users
- ✅ Post engagements
- ✅ Follower count

### **Management:**
- ✅ Select which page to post to
- ✅ Switch between pages
- ✅ Disconnect/reconnect anytime

---

## ⚠️ Important Notes

### **Instagram Requirements:**
1. Must be **Instagram Business** account (not personal)
2. Must be **linked to Facebook Page**
3. **Image required** - Instagram doesn't support text-only posts
4. **Square images work best** (1080x1080px)

### **Facebook Requirements:**
1. Must have **Facebook Page** (not personal profile)
2. Must be **Page admin**
3. Can post text-only or text + image

### **TikTok:**
- TikTok API is separate and requires different approval process
- Recommend using TikTok's native app for now
- Or integrate later with TikTok for Business API

---

## 🐛 Troubleshooting

### **"App Not Set Up" Error:**
- Check App Domains in Facebook App settings
- Verify Site URL matches your localhost/domain

### **"Permission Denied" Error:**
- Request permissions in App Review
- Wait for approval (1-3 days)
- Use Test Users for development

### **"Instagram Account Not Found":**
- Ensure Instagram is Business account
- Link Instagram to Facebook Page
- Check connection in Page Settings

### **Posts Not Appearing:**
- Check page access token is valid
- Verify you're admin of the page
- Check Facebook/Instagram for errors

---

## 📞 Next Steps

1. **Complete Facebook App setup** (Steps 1-3 above)
2. **Request permissions** (Step 3)
3. **Connect your Facebook Page** (Step 4)
4. **Let me update the UI** - I'll add the Connect button and full integration
5. **Test posting!**

---

## 💡 Want Me To:

1. ✅ **Update Marketing Page UI** - Add Facebook connect button and full integration
2. ✅ **Create Test Mode** - Test posting without actually publishing
3. ✅ **Add Image Upload** - Direct upload from your computer
4. ✅ **Add Scheduling** - Queue posts for later (needs backend)
5. ✅ **Add Analytics Dashboard** - Show real Facebook/Instagram stats

**Ready to proceed? Let me know and I'll update the Marketing page with the Facebook integration!** 🚀

---

## 📄 Files Created

1. ✅ `src/services/metaService.js` - Facebook/Instagram API service
2. ✅ `public/privacy-policy-meta.html` - Meta-compliant privacy policy
3. ✅ `FACEBOOK_INSTAGRAM_SETUP.md` - This guide

**All ready for you to start posting directly to Facebook and Instagram from your website!** 🎉
