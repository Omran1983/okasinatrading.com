# 🔑 Facebook Access Token Refresh Guide

## ⚠️ Your Token Has Expired!

**Error Message:**
```
Session has expired on Sunday, 23-Nov-25 06:00:00 PST
```

**Solution:** Generate a new long-lived token (takes 2 minutes)

---

## 🚀 Quick Fix (2 Steps)

### Step 1: Get a New Short-Lived Token

1. Go to **Facebook Graph API Explorer**:
   ```
   https://developers.facebook.com/tools/explorer/
   ```

2. **Select Your App:**
   - Click the dropdown at top (currently shows "Graph API Explorer")
   - Select: **"Okasina Trading"** (App ID: 870341192189921)

3. **Select Your Page:**
   - Click "Get Token" → "Get Page Access Token"
   - Select your page: **"Okasina Trading"**

4. **Grant Permissions:**
   Check these permissions:
   - ✅ `pages_show_list`
   - ✅ `pages_read_engagement`
   - ✅ `pages_read_user_content`
   - ✅ `pages_manage_posts`
   - ✅ `pages_manage_metadata`

5. **Copy the Token:**
   - Copy the token shown in the "Access Token" field
   - It should be a long string starting with "EAA..."

---

### Step 2: Convert to Long-Lived Token

**Option A: Using PowerShell Script (Recommended)**

1. Open the file: `get-long-lived-token.ps1`

2. **Replace line 1** with your new short-lived token:
   ```powershell
   $shortToken = "PASTE_YOUR_NEW_TOKEN_HERE"
   ```

3. **Run the script** in PowerShell:
   ```powershell
   .\get-long-lived-token.ps1
   ```

4. **Copy the output** - this is your new long-lived page token!

**Option B: Manual Method**

Run these commands in PowerShell (replace `YOUR_SHORT_TOKEN`):

```powershell
# Step 1: Get long-lived user token
$shortToken = "YOUR_SHORT_TOKEN"
$appId = "870341192189921"
$appSecret = "0b414443ca659ddf094aa7c84549960a"

$url1 = "https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=$appId&client_secret=$appSecret&fb_exchange_token=$shortToken"
$response1 = Invoke-RestMethod -Uri $url1
$longUserToken = $response1.access_token

# Step 2: Get page token
$url2 = "https://graph.facebook.com/v19.0/me/accounts?access_token=$longUserToken"
$response2 = Invoke-RestMethod -Uri $url2
$pageToken = $response2.data[0].access_token

# Display the token
Write-Host "Your long-lived page token:"
Write-Host $pageToken
```

---

## 🔄 Update Your Environment Variables

### For Local Development (.env file)

1. Open your `.env` file
2. Update the `FB_ACCESS_TOKEN` line:
   ```
   FB_ACCESS_TOKEN=YOUR_NEW_LONG_LIVED_TOKEN
   ```
3. Save the file
4. Restart your dev server (`npm run dev`)

### For Vercel Production

1. Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**
   ```
   https://vercel.com/dashboard
   ```

2. Find `FB_ACCESS_TOKEN`

3. Click **Edit** (pencil icon)

4. Paste your new long-lived token

5. Click **Save**

6. **Redeploy** your site:
   - Go to Deployments tab
   - Click on latest deployment
   - Click **Redeploy**

---

## ✅ Verify It's Working

### Test Locally
1. Go to: `http://localhost:5173/admin/album-import`
2. Click "Refresh Album List"
3. Should see your Facebook albums!

### Test on Vercel
1. Go to: `https://okasinatrading.com/admin/album-import`
2. Click "Refresh Album List"
3. Should see your Facebook albums!

### Test API Endpoint
```
https://okasinatrading.com/api/facebook/debug-token
```

Should return:
```json
{
  "valid": true,
  "expires_at": <timestamp>,
  "scopes": [...]
}
```

---

## 🔍 Understanding Token Types

### Short-Lived Token
- **Lifespan:** 1-2 hours
- **Where:** Graph API Explorer
- **Use:** Convert to long-lived token

### Long-Lived User Token
- **Lifespan:** ~60 days
- **Where:** Exchange from short-lived token
- **Use:** Get page token

### Long-Lived Page Token ⭐ (What You Need)
- **Lifespan:** Never expires (unless you change password/permissions)
- **Where:** Exchange from long-lived user token
- **Use:** Your app's API calls

---

## 📅 Token Expiry Prevention

### Set a Reminder
Facebook tokens can expire if:
- ❌ You change your Facebook password
- ❌ You revoke app permissions
- ❌ Facebook security review
- ❌ 60 days pass (for user tokens)

**Best Practice:**
- Set a calendar reminder for 50 days from now
- Refresh your token before it expires
- Keep the `get-long-lived-token.ps1` script handy

### Monitor Token Health
Check token status regularly:
```
https://developers.facebook.com/tools/debug/accesstoken/
```
Paste your token to see:
- Expiry date
- Permissions granted
- Any issues

---

## 🆘 Troubleshooting

### Error: "Invalid OAuth access token"
**Solution:** Your short-lived token expired. Get a fresh one from Graph API Explorer.

### Error: "App not set up for this user"
**Solution:** Make sure you selected the correct app in Graph API Explorer.

### Error: "No pages found"
**Solution:** 
1. Ensure you're an admin of the Facebook page
2. Grant `pages_show_list` permission

### Script doesn't run
**Solution:**
```powershell
# Enable script execution
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

# Then run
.\get-long-lived-token.ps1
```

---

## 📝 Quick Checklist

- [ ] Get new short-lived token from Graph API Explorer
- [ ] Update `get-long-lived-token.ps1` with new token
- [ ] Run the script to get long-lived page token
- [ ] Update `.env` file locally
- [ ] Update Vercel environment variable
- [ ] Redeploy Vercel
- [ ] Test album import page
- [ ] Set reminder to refresh in 50 days

---

## 🎯 Expected Timeline

- Get short-lived token: **1 minute**
- Run script: **30 seconds**
- Update .env: **30 seconds**
- Update Vercel: **1 minute**
- Redeploy: **2-3 minutes**
- Test: **1 minute**

**Total: ~6 minutes** ⏰

---

**Last Updated:** 2025-11-23 20:34 UTC  
**Status:** 🔴 Token Expired - Action Required  
**Next Action:** Get new token from Graph API Explorer
