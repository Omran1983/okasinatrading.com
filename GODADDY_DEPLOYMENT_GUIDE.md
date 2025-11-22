# GoDaddy Deployment Guide for OKASINA Trading

## 🚀 Overview
You can absolutely host your React/Vite application directly on GoDaddy. This allows you to go live immediately and continue improving the site while it's online.

## 📋 Prerequisites
1.  **GoDaddy Hosting Account** (Linux/cPanel hosting recommended).
2.  **Domain Name** (`okasinatrading.com`) connected to your hosting.
3.  **File Manager Access** (via GoDaddy cPanel) or **FTP Client** (like FileZilla).

---

## 🛠️ Step 1: Build Your Project
First, we need to generate the production-ready files from your code.

1.  Open your terminal in VS Code.
2.  Run the build command:
    ```bash
    npm run build
    ```
3.  This will create a **`dist`** folder in your project directory. This folder contains everything you need to upload (HTML, CSS, JavaScript, images).

---

## 📤 Step 2: Prepare for Upload
1.  Go to the `dist` folder.
2.  **Important:** You need a configuration file to handle routing (so users can go to `/shop` or `/cart` directly without getting a 404 error).
3.  Create a new file inside the `dist` folder named **`.htaccess`** (if you are on Linux/cPanel) or **`web.config`** (if you are on Windows hosting).

### Option A: For Linux Hosting (cPanel) - Recommended
Create a file named `.htaccess` in the `dist` folder with this content:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Option B: For Windows Hosting (Plesk)
Create a file named `web.config` in the `dist` folder with this content:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

---

## ☁️ Step 3: Upload to GoDaddy
1.  Log in to your **GoDaddy Account**.
2.  Go to **My Products** > **Web Hosting** > **Manage**.
3.  Open **cPanel Admin**.
4.  Open **File Manager**.
5.  Navigate to **`public_html`** (or the root folder for your domain).
6.  **Delete** any default files (like `default.html` or `coming_soon.html`) if they exist.
7.  **Upload** the **contents** of your `dist` folder (including the `.htaccess` file).
    *   *Tip: You can zip the contents of `dist`, upload the zip, and then extract it in File Manager to be faster.*

---

## 🔄 Step 4: Continuous Improvement
**"Can we keep improving from there?"**
**YES!**

1.  **Develop Locally:** Continue making changes, adding features, and fixing bugs on your computer (localhost).
2.  **Test:** Verify everything works locally.
3.  **Re-deploy:** When you are ready to update the live site:
    *   Run `npm run build` again.
    *   Upload the new files from `dist` to GoDaddy, overwriting the old ones.

### 💡 Pro Tip: Automating Updates
Later, we can set up **GitHub Actions** to automatically build and upload your site to GoDaddy via FTP whenever you push changes to your code. This makes "improving from there" seamless!

---

## ⚠️ Important Checks
1.  **API Connections:** Ensure your `src/config.js` or API URLs point to your live backend (if you have one) or are set up correctly. Since we are currently using Supabase and some mock data, it should work fine as a static site.
2.  **Routing:** If you click "Refresh" on a page like `/shop` and get a 404 error, your `.htaccess` file is missing or incorrect.

---

## 🏁 Summary
You do **not** need to wait to complete everything.
1.  **Build** (`npm run build`)
2.  **Upload** to GoDaddy
3.  **Live!** 🚀
