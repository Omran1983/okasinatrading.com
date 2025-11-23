# 🚨 ACTION REQUIRED - Update Vercel Token

## Current Status

✅ **Local Environment:** Token updated and working  
❌ **Production (Vercel):** Still using expired token  

**Error on Production:**
```
Session has expired on Sunday, 23-Nov-25 06:00:00 PST
```

---

## 🎯 What You Need to Do NOW (5 minutes)

### Your new token is ready:
```
EAAlP9BVLIK8BQF8p2XUo4TRTjLKMLvgKZBktGm27dfEs2pSnIAlsviapklWLHLFZCZAvw2yaTQDMR195YpJCPtOUWZAB4iPrEtpXN8XnV9NosSjvshiB5AxPsRFEv9CdqZAWmDsDfMeiIS1ZAwujBWpYeprDPIyU8xZACxJufvIyUNaWd89n2cr26CxCW66DfnNDmQzIgQIZBTplhoLZCEPCbyAZDZD
```

### Step-by-Step Instructions:

#### 1. Copy the Token Above ⬆️
   - Select the entire token
   - Copy it (Ctrl+C)

#### 2. Go to Vercel Dashboard
   ```
   https://vercel.com/dashboard
   ```

#### 3. Navigate to Your Project
   - Click on your project name (likely "okasina-fashion-store-fresh" or similar)

#### 4. Update Environment Variable
   - Click **Settings** (in the top menu)
   - Click **Environment Variables** (in the left sidebar)
   - Find `FB_ACCESS_TOKEN` in the list
   - Click the **⋮** (three dots) or **Edit** button
   - **Delete the old value**
   - **Paste the new token** (Ctrl+V)
   - Make sure these are checked:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
   - Click **Save**

#### 5. Redeploy
   - Click **Deployments** (in the top menu)
   - Find the latest deployment
   - Click the **⋮** (three dots) menu
   - Click **Redeploy**
   - Wait 2-3 minutes for deployment to complete

---

## ✅ How to Verify It Worked

After redeployment completes (you'll see "Ready" status):

### Test 1: Debug Endpoint
Visit this URL:
```
https://okasinatrading.com/api/facebook/debug-connection
```

**Should show:**
```json
{
  "env": {
    "hasToken": true,
    "hasPageId": true
  },
  "tests": {
    "albumPhotos": {
      "status": 200,  ← Should be 200, not 400!
      ...
    }
  }
}
```

### Test 2: Album Import Page
Visit:
```
https://okasinatrading.com/admin/album-import
```

- Click **"Refresh Album List"**
- Should see your Facebook albums (no error!)

---

## 📊 Current Website Status

| Component | Status | Notes |
|-----------|--------|-------|
| Website Loading | ✅ Working | Site loads correctly |
| Local Dev (.env) | ✅ Updated | New token in place |
| Vercel Production | ❌ Needs Update | Still has expired token |
| Facebook API | ❌ Failing | Due to expired token on Vercel |

---

## ⏱️ Time Estimate

- Update Vercel env var: **2 minutes**
- Redeploy: **2-3 minutes**
- Verify: **1 minute**

**Total: ~6 minutes**

---

## 🆘 If You Need Help

### Can't Find Environment Variables?
1. Make sure you're in the right project
2. Look for "Settings" in the top navigation
3. "Environment Variables" should be in the left sidebar

### Don't See FB_ACCESS_TOKEN?
If it's not there, add it:
1. Click "Add New"
2. Key: `FB_ACCESS_TOKEN`
3. Value: (paste the token above)
4. Environments: Check all three
5. Click "Save"

### Deployment Fails?
Check the build logs:
1. Go to Deployments
2. Click on the failed deployment
3. Look for error messages

---

## 📞 Quick Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Your Website:** https://okasinatrading.com
- **Debug Endpoint:** https://okasinatrading.com/api/facebook/debug-connection
- **Album Import:** https://okasinatrading.com/admin/album-import

---

**Status:** 🟡 Waiting for Vercel Update  
**Priority:** 🔴 HIGH - Required for Facebook integration  
**Action:** Update FB_ACCESS_TOKEN in Vercel and Redeploy
