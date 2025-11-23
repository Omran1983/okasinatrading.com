# 🚨 CRITICAL: Update Vercel Supabase Configuration

The website is empty because Vercel is trying to connect to the **OLD** Supabase project. We need to update it to the **NEW** one where we just added the products.

## 1. Get Your Credentials

**Supabase URL:**
```
https://drnqpbyptyyuacmrvdrr.supabase.co
```

**Supabase Anon Key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRybnFwYnlwdHl5dWFjbXJ2ZHJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyODE4NzIsImV4cCI6MjA3MTg1Nzg3Mn0.7lECyzHEhzVlOaBbOWBWwOygFCG1KAkSlE-ucs4Dozw
```

## 2. Update Vercel (Do this NOW)

1. Go to **[Vercel Dashboard](https://vercel.com/dashboard)**
2. Select your project (**okasina-fashion-store-fresh**)
3. Go to **Settings** > **Environment Variables**
4. Update these two variables:
   - `VITE_SUPABASE_URL` → Paste the **URL** above
   - `VITE_SUPABASE_ANON_KEY` → Paste the **Key** above
5. Make sure to check **Production**, **Preview**, and **Development** for both.
6. Click **Save**.

## 3. Redeploy

**I am pushing the code fixes right now.** 

Once you have updated the variables above:
1. Go to **Deployments**
2. You should see a new deployment starting (from my push)
3. If not, click **Redeploy** on the latest one.

**The website will NOT show products until you do this!**
