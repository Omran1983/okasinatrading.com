# Vercel Deployment Guide for OKASINA Trading

## 🚀 Overview
Since you have the domain and email on GoDaddy but no hosting plan, **Vercel** is the perfect solution. It's free, fast, and designed for React apps like yours.

This guide covers:
1.  Deploying your code to Vercel.
2.  Connecting your `okasinatrading.com` domain.
3.  **Crucially:** Updating DNS correctly so your Titan email (`info@okasinatrading.com`) stays working.

---

## 🛠️ Step 1: Deploy to Vercel
You have two ways to do this. **Option A (GitHub)** is recommended for easier updates, but **Option B (CLI)** is faster if you don't use GitHub.

### Option A: Connect via GitHub (Recommended)
1.  Push your code to a GitHub repository.
2.  Go to [vercel.com](https://vercel.com) and sign up/login.
3.  Click **"Add New..."** -> **"Project"**.
4.  Import your `okasina-fashion-store-vite` repository.
5.  **Framework Preset:** It should auto-detect "Vite".
6.  **Root Directory:** `./` (default).
7.  **Environment Variables:** Add any secrets if you have them (e.g., `VITE_SUPABASE_URL`).
8.  Click **Deploy**.

### Option B: Deploy from Command Line (Fastest right now)
1.  Open your terminal in VS Code.
2.  Install Vercel CLI globally:
    ```bash
    npm i -g vercel
    ```
3.  Run the deploy command:
    ```bash
    vercel
    ```
4.  Follow the prompts:
    *   Set up and deploy? **Y**
    *   Which scope? (Select your account)
    *   Link to existing project? **N**
    *   Project name? **okasina-fashion-store**
    *   Directory? **./**
    *   Want to modify settings? **N**
5.  It will build and give you a `https://okasina-fashion-store-....vercel.app` URL.

---

## 🔗 Step 2: Connect Your Domain
1.  Go to your **Vercel Dashboard** -> Select your project.
2.  Go to **Settings** -> **Domains**.
3.  Enter `okasinatrading.com` and click **Add**.
4.  Select the option recommended (usually adds both root and `www`).
5.  Vercel will show you a **Invalid Configuration** error with the DNS records you need to add. **Keep this page open.**

---

## ⚙️ Step 3: Update GoDaddy DNS (Carefully!)
**⚠️ CRITICAL:** We are only changing **A** and **CNAME** records. Do **NOT** touch any **MX** or **TXT** records related to Titan Email.

1.  Log in to **GoDaddy**.
2.  Go to **My Products** -> **Domains** -> `okasinatrading.com` -> **DNS**.
3.  **Delete** (or Edit) the existing **A** record with name `@` (Parked).
4.  **Add/Edit** the following records based on what Vercel showed you:

### Record 1: The Root Domain (@)
*   **Type:** `A`
*   **Name:** `@`
*   **Value:** `76.76.21.21` (Vercel's IP)
*   **TTL:** `1 Hour` (or default)

### Record 2: The Subdomain (www)
*   **Type:** `CNAME`
*   **Name:** `www`
*   **Value:** `cname.vercel-dns.com`
*   **TTL:** `1 Hour`

### 🛑 STOP & CHECK:
*   **Do NOT touch:** Any record with Type `MX` (these control your email).
*   **Do NOT touch:** Any record with Type `TXT` that mentions `spf` or `titan` (these verify your email).

---

## ✅ Step 4: Verify
1.  Go back to **Vercel Settings > Domains**.
2.  It might take a few minutes (up to 24h, but usually fast) for the error to turn into a green checkmark.
3.  Once green, visit `https://okasinatrading.com`.
4.  **Test Email:** Send an email to `info@okasinatrading.com` to confirm it still works.

---

## 🔄 Future Updates
To update your site:
*   **If using GitHub:** Just push your changes (`git push`). Vercel auto-deploys.
*   **If using CLI:** Run `vercel --prod` in your terminal.
