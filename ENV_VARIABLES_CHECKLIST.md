# Environment Variables Checklist for Vercel

## 📋 Copy-Paste Ready Format

### Supabase Configuration
```
VITE_SUPABASE_URL=https://drnqpbyptyyuacmrvdrr.supabase.co
VITE_SUPABASE_ANON_KEY=<your_anon_key_here>
SUPABASE_STORAGE_BUCKET=product-images
```

### Facebook Integration
```
FB_PAGE_ID=1616933558544431
FB_ACCESS_TOKEN=<your_long_lived_token_here>
FB_APP_ID=870341192189921
FB_APP_SECRET=<your_app_secret_here>
```

### Optional - AI Features
```
OLLAMA_API_URL=http://localhost:11434
```

---

## 🔍 Where to Find These Values

### Supabase Values
1. Go to: https://supabase.com/dashboard/project/drnqpbyptyyuacmrvdrr
2. Click **Settings** → **API**
3. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

### Facebook Values
1. **FB_PAGE_ID**: Already set (1616933558544431)
2. **FB_ACCESS_TOKEN**: 
   - Go to: https://developers.facebook.com/tools/explorer/
   - Select your app
   - Generate long-lived token (or use existing)
   - OR run: `.\get-long-lived-token.ps1`
3. **FB_APP_ID**: Already set (870341192189921)
4. **FB_APP_SECRET**:
   - Go to: https://developers.facebook.com/apps/870341192189921/settings/basic/
   - Copy "App Secret"

---

## ⚙️ How to Add in Vercel

### Method 1: Via Dashboard (Recommended)
1. Go to: https://vercel.com/dashboard
2. Select your project
3. Click **Settings** → **Environment Variables**
4. For each variable:
   - Click **Add New**
   - Enter **Key** (e.g., `VITE_SUPABASE_URL`)
   - Enter **Value**
   - Select environments: ✅ Production ✅ Preview ✅ Development
   - Click **Save**

### Method 2: Via CLI
```bash
# Install Vercel CLI (if not already)
npm i -g vercel

# Add variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add SUPABASE_STORAGE_BUCKET
vercel env add FB_PAGE_ID
vercel env add FB_ACCESS_TOKEN
vercel env add FB_APP_ID
vercel env add FB_APP_SECRET
```

---

## ✅ Verification

After adding all variables:

1. **Redeploy**: Vercel Dashboard → Deployments → Latest → **Redeploy**
2. **Check**: Go to Settings → Environment Variables
3. **Count**: Should have 7 variables (or 8 with OLLAMA_API_URL)

### Test Variables Are Working
```bash
# Visit this URL (replace with your domain)
https://your-domain.vercel.app/api/facebook/debug-connection

# Should return:
{
  "status": "ok",
  "hasPageId": true,
  "hasAccessToken": true,
  "hasAppId": true,
  "hasAppSecret": true
}
```

---

## 🚨 Important Notes

### Security
- ❌ **Never commit** `.env` files to Git
- ✅ **Always use** Vercel's environment variables
- ✅ **Regenerate tokens** if accidentally exposed

### Token Expiry
- Facebook access tokens expire (usually 60 days for long-lived)
- Set a reminder to refresh your token before expiry
- Use `get-long-lived-token.ps1` script to refresh

### Environments
- **Production**: Live site (okasinatrading.com)
- **Preview**: Branch deployments (for testing)
- **Development**: Local development (localhost)

**Best Practice**: Add variables to all three environments

---

## 🔄 Updating Variables

If you need to change a variable:

1. Go to: Settings → Environment Variables
2. Find the variable
3. Click **Edit** (pencil icon)
4. Update the value
5. Click **Save**
6. **Redeploy** for changes to take effect

---

## 📞 Quick Reference

| Variable | Required | Where Used |
|----------|----------|------------|
| `VITE_SUPABASE_URL` | ✅ Yes | Database, Storage, Auth |
| `VITE_SUPABASE_ANON_KEY` | ✅ Yes | Database, Storage, Auth |
| `SUPABASE_STORAGE_BUCKET` | ✅ Yes | Image uploads |
| `FB_PAGE_ID` | ✅ Yes | Facebook API calls |
| `FB_ACCESS_TOKEN` | ✅ Yes | Facebook API calls |
| `FB_APP_ID` | ✅ Yes | Facebook App config |
| `FB_APP_SECRET` | ✅ Yes | Facebook App security |
| `OLLAMA_API_URL` | ⚪ Optional | AI product analysis |

---

**Last Updated:** 2025-11-23 20:21 UTC
