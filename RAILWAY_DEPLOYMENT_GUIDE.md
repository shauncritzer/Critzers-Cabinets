# Railway Deployment Guide for Critzer's Cabinets

**Last Updated:** December 22, 2024
**Status:** Code fixed and ready for deployment
**Estimated Time:** 30-45 minutes

---

## Overview

This guide will help you deploy Critzer's Cabinet quote system to Railway at **critzerscabinets.com**.

### What's Fixed ✅

1. **OAuth made optional** - Site no longer crashes without Manus environment variables
2. **Gallery import updated** - Uses correct image filenames from client/public/images/gallery/
3. **Admin import page** - Available at `/admin/data-import` for easy database population

---

## Prerequisites

- Railway account with access to project: **keen-manifestation**
- GitHub repository: **shauncritzer/Critzers-Cabinets**
- Domain: **critzerscabinets.com** (should be configured in Railway)

---

## Step 1: Configure Railway Environment Variables

### Via Railway Web Dashboard

1. Go to [Railway Dashboard](https://railway.app)
2. Select project: **keen-manifestation**
3. Click **Variables** tab
4. Add the following variables:

```bash
DATABASE_URL=<copy from Railway MySQL service - see below>
JWT_SECRET=<generate random secret - see below>
NODE_ENV=production
PORT=8080
```

### Get DATABASE_URL from MySQL Service

1. In Railway dashboard, find the **MySQL** service
2. Click on it → **Variables** tab
3. Copy the value of `DATABASE_URL` (starts with `mysql://`)
4. Paste it into your main service's `DATABASE_URL` variable

### Generate JWT_SECRET

Option 1 - Use online generator:
- Go to https://randomkeygen.com/
- Copy a "Fort Knox Password" (256-bit)

Option 2 - Use terminal:
```bash
openssl rand -base64 32
```

### Important Notes

- **DO NOT** set `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL`, or `VITE_APP_ID` unless you have Manus OAuth credentials
- The site will work without OAuth (public access to shop, gallery, cart)

---

## Step 2: Verify Railway Build Settings

In Railway Dashboard → **Settings** → **Build**:

- **Build Command:** `pnpm install && pnpm run build`
- **Start Command:** `pnpm db:push && pnpm start`
- **Root Directory:** `/`
- **Node Version:** 18.x or higher (Railway auto-detects from package.json)

---

## Step 3: Verify GitHub Integration

In Railway Dashboard → **Settings** → **Source**:

- **Repository:** shauncritzer/Critzers-Cabinets
- **Branch:** `claude/fix-production-deployment-RXuOY` (or `main` after PR is merged)
- **Auto Deploy:** ✅ Enabled

---

## Step 4: Deploy to Railway

### Option A: Automatic Deployment (Recommended)

If auto-deploy is enabled, Railway will automatically deploy when you push to the connected branch.

### Option B: Manual Deployment

1. In Railway dashboard, click **Deployments** tab
2. Click **Deploy** button
3. Wait 3-5 minutes for build to complete

### Monitor Deployment

1. Click on the active deployment to see logs
2. Look for:
   - ✅ "Build succeeded"
   - ✅ "Deployment live"
   - ✅ "Server running on http://localhost:8080/"

---

## Step 5: Populate Database with Admin Import Page

### Access the Admin Import Page

1. Once deployed, visit: `https://critzerscabinets.com/admin/data-import`

### Import Gallery (8 Items)

1. Click **"Import Gallery"** button
2. Wait for confirmation: "✓ Imported 8 gallery items successfully!"
3. Verify by visiting: `https://critzerscabinets.com/gallery`

### Import Products (7,358 Items)

**Important:** The product import requires the Excel file `TopKnobsJanuary2026PriceList.xlsx` to be in the project root.

#### If you have the Excel file:

1. Copy the Excel file to the project root:
   ```bash
   cp /path/to/TopKnobsJanuary2026PriceList.xlsx /home/user/Critzers-Cabinets/
   ```

2. Commit and push to GitHub:
   ```bash
   git add TopKnobsJanuary2026PriceList.xlsx
   git commit -m "Add Top Knobs product catalog for import"
   git push origin claude/fix-production-deployment-RXuOY
   ```

3. Wait for Railway to redeploy (auto-deploy)

4. Visit `https://critzerscabinets.com/admin/data-import`

5. Click **"Import Products"** button

6. Wait for confirmation (may take 2-5 minutes)

7. Verify by visiting: `https://critzerscabinets.com/shop`

#### If you don't have the Excel file:

You have two options:

**Option 1:** Get the file from Manus sandbox
- File location on Manus: `/home/ubuntu/upload/TopKnobsJanuary2026PriceList.xlsx`
- Download and follow steps above

**Option 2:** Use the SQL import script (manual)
- Connect to Railway MySQL directly
- Run the SQL script at: `scripts/insert-products.sql` (if you create it)
- This requires creating a Node.js script to generate INSERT statements

---

## Step 6: Verify Deployment

### Test Homepage
```bash
curl -I https://critzerscabinets.com
# Expected: HTTP/2 200 OK
```

### Test Gallery API
```bash
curl https://critzerscabinets.com/api/trpc/gallery.getAll
# Should return JSON with 8 gallery items
```

### Test Products API (after import)
```bash
curl 'https://critzerscabinets.com/api/trpc/shop.getProducts?input=%7B%22limit%22%3A10%7D'
# Should return JSON with 10 products
```

### Visual Verification

Open these URLs in browser:

- ✅ **Homepage:** https://critzerscabinets.com
  - Should show hero image, navigation, services

- ✅ **Shop Hardware:** https://critzerscabinets.com/shop
  - Should show products with search/filter
  - After import: "Showing X of 7,358 products"
  - Before import: "Showing 0 of 0 products"

- ✅ **Gallery:** https://critzerscabinets.com/gallery
  - Should show 8 Omega Cabinetry kitchen images
  - Before import: "Gallery Coming Soon"

- ✅ **About:** https://critzerscabinets.com/about
  - Company history, team, contact info

- ✅ **Quote:** https://critzerscabinets.com/quote
  - AI chatbot consultation works

- ✅ **Cart:** https://critzerscabinets.com/cart
  - Add items from shop, cart updates correctly

---

## Step 7: SSL Certificate

Railway should automatically provision an SSL certificate for your custom domain.

### Verify SSL Status

1. Railway Dashboard → **Settings** → **Domains**
2. Find `critzerscabinets.com`
3. Check **SSL Status** column
   - ✅ **Active** - Good to go!
   - ⏳ **Pending** - Wait 5-10 minutes
   - ❌ **Failed** - Click "Regenerate Certificate"

### Test HTTPS

```bash
curl -I https://critzerscabinets.com
# Should return HTTP/2 200

# HTTP should redirect to HTTPS
curl -I http://critzerscabinets.com
# Should return HTTP/1.1 301 Moved Permanently
# Location: https://critzerscabinets.com
```

---

## Troubleshooting

### Build Fails

**Check logs:**
- Railway Dashboard → Deployments → Click on failed deployment → View logs

**Common issues:**
- Missing dependencies in package.json
- TypeScript compilation errors
- Node version mismatch

**Solution:**
```bash
# Test locally first
pnpm install
pnpm run build

# If successful, commit and push
git add .
git commit -m "Fix build issues"
git push
```

### Database Connection Fails

**Error:** "Cannot connect to database"

**Check:**
1. Verify `DATABASE_URL` is set correctly in Railway variables
2. Ensure MySQL service is running (Railway Dashboard → Services → MySQL)
3. Check format: `mysql://user:password@host:port/database`

### Gallery/Products Empty After Import

**Verify data exists:**
```bash
# Use Railway's MySQL shell or a MySQL client
SELECT COUNT(*) FROM gallery;
SELECT COUNT(*) FROM products;
```

**If counts are 0:**
- Re-run the import from `/admin/data-import` page
- Check server logs for errors during import

### OAuth Errors

**Error:** OAuth-related crashes

**Solution:**
These should be fixed by the OAuth patches. If still occurring:
1. Verify you did NOT set `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL`, or `VITE_APP_ID`
2. Check Railway logs for specific error messages
3. Verify latest code is deployed (check commit hash in logs)

---

## File Locations Reference

### Gallery Images
- **Location:** `client/public/images/gallery/`
- **Files:**
  - 3HrP0H3BuW7m.jpg
  - 53H0NAM0eSvE.webp
  - 7nAUkEFBXEaf.jpg
  - FbkkkCWXInZS.jpg
  - KL9ldeZDUcbT.jpg
  - RHHoKWmplcBC.jpg
  - bt6Vi4lpCf4B.jpg
  - ubBFg9QkproG.jpg

### Admin Pages
- **Data Import:** https://critzerscabinets.com/admin/data-import
- **Product Images:** https://critzerscabinets.com/admin/product-images
- **Admin Dashboard:** https://critzerscabinets.com/admin

### Database Schema
- **File:** `drizzle/schema.ts`
- **Tables:** users, products, cart_items, orders, quotes, gallery, projects, pricing_formulas

---

## Success Criteria Checklist

### Code & Deployment
- [x] OAuth patches committed to GitHub
- [ ] Railway build succeeded (green checkmark)
- [ ] Railway deployment is live
- [ ] No errors in Railway logs

### Database
- [ ] Gallery table has 8 rows
- [ ] Products table has 7,358 rows (after Excel import)
- [ ] Gallery API returns 8 items
- [ ] Products API returns data

### Website Features
- [ ] Homepage loads with hero and navigation
- [ ] Shop page displays products (7,358 after import)
- [ ] Gallery page shows 8 kitchen images
- [ ] Search and filter work on shop page
- [ ] Add to cart works
- [ ] Cart page calculates totals correctly
- [ ] Quote/chatbot accessible
- [ ] About page loads

### Security & Performance
- [ ] HTTPS enabled (padlock icon)
- [ ] Valid SSL certificate
- [ ] No mixed content warnings
- [ ] Page load times < 3 seconds

---

## Next Steps After Deployment

1. **Test all features thoroughly**
   - Try the quote system
   - Add products to cart
   - Test on mobile devices

2. **Monitor Railway logs for errors**
   ```bash
   # If you have Railway CLI
   railway logs --tail
   ```

3. **Set up monitoring**
   - Consider adding error tracking (Sentry, LogRocket, etc.)
   - Monitor Railway metrics (CPU, memory, requests)

4. **Prepare for production traffic**
   - Review Railway pricing plan
   - Consider CDN for images (Cloudflare, etc.)
   - Set up database backups

---

## Contact & Support

- **GitHub Issues:** https://github.com/shauncritzer/Critzers-Cabinets/issues
- **Railway Docs:** https://docs.railway.app
- **Project Repository:** https://github.com/shauncritzer/Critzers-Cabinets

---

**End of Railway Deployment Guide**
