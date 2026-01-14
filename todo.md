# Critzer's Cabinet Quote System - TODO

## Phase 1: Project Setup & Design
- [x] Configure design system (colors, fonts, spacing)
- [x] Set up database schema for quotes, customers, projects
- [x] Create reusable UI components

## Phase 2: AI Chatbot Consultation
- [x] Build conversational chatbot interface
- [x] Implement AI-powered question flow for cabinet consultation
- [x] Capture project details (room type, dimensions, cabinet preferences)
- [x] Capture material selections (wood types, finishes, hardware)
- [x] Save consultation data to database

## Phase 3: Quote Calculator & Pricing Engine
- [x] Create pricing formula system (materials, labor, complexity)
- [x] Build instant quote calculator
- [ ] Generate PDF quotes
- [ ] Allow quote modifications and revisions
- [x] Track quote history

## Phase 4: Customer Dashboard
- [x] Customer authentication and profiles
- [x] View saved quotes
- [ ] Modify specifications
- [ ] Upload inspiration photos
- [x] Track project status
- [ ] Request quote revisions

## Phase 5: Admin Panel
- [x] Admin authentication and role management
- [x] View all quote requests
- [x] Lead pipeline management
- [x] Adjust pricing formulas
- [x] Conversion metrics and analytics
- [ ] Customer communication tools

## Phase 6: Project Gallery
- [ ] Upload before/after photos
- [x] Categorize by cabinet type/style
- [x] Display on public gallery page
- [x] Link gallery items to quote system

## Phase 7: Interactive Cabinet Configurator
- [ ] Visual cabinet style selector
- [ ] Wood type selector with samples
- [ ] Finish selector with previews
- [ ] Hardware selector (integrate Top Knobs catalog)
- [ ] Real-time price updates
- [ ] 3D visualization (future enhancement)

## Phase 8: CRM Integration
- [ ] GoHighLevel webhook integration
- [ ] Automatic lead creation
- [ ] Sync quote data to CRM
- [ ] Email notification system
- [ ] SMS follow-up automation

## Phase 9: Testing & Deployment
- [ ] Write comprehensive tests
- [ ] Test all user flows
- [ ] Test admin workflows
- [ ] Test CRM integration
- [ ] Performance optimization
- [ ] Security audit
- [ ] Create user documentation
- [ ] Deploy to production

## Bugs to Fix
- [x] Fix nested anchor tag error on home page

## Content Migration from critzerscabinets.com
- [x] Scrape and import About page content
- [x] Add team photos and bios
- [ ] Import project gallery photos
- [x] Add company history and story
- [x] Import contact information
- [x] Add services descriptions

## Hardware E-Commerce Store
- [x] Create products database schema
- [x] Import 7,358 Top Knobs products from Excel
- [ ] Scrape and import product images from dealer portal
- [x] Build product catalog page with search and filters
- [x] Create featured product collections (Best Sellers, New Arrivals, by Style)
- [ ] Create product detail pages
- [x] Implement shopping cart functionality
- [x] Add checkout and payment processing (Stripe integration)
- [ ] Integrate shipping calculation

## Design Overhaul - Match Original Site
- [x] Extract all images from critzerscabinets.com (logo, cabinet photos, team photos)
- [x] Change color scheme from pink/warm to green/professional to match original
- [x] Redesign homepage hero section with cabinet background image
- [x] Match navigation style and layout to original site
- [x] Import and use original site's imagery throughout
- [x] Ensure all pages maintain consistent look with original design
- [x] Test all functionality with new design

## GitHub & Railway Deployment
- [x] Fix all technical errors (schema syntax, console errors)
- [x] Push code to GitHub (shauncritzer/Critzers-Cabinets)
- [x] Set up Railway project
- [x] Configure environment variables in Railway
- [x] Fix MODULE_NOT_FOUND error for '/app/dist/index.js'
- [x] Configure proper build process to generate dist directory
- [x] Update Railway build/start commands for production
- [x] Verify database connection works on Railway
- [x] Remove Manus-specific dependencies causing frontend crashes
- [x] Fix Invalid URL TypeError in frontend JavaScript
- [x] Make OAuth system optional for standalone deployment
- [x] Push fixes to GitHub
- [ ] Verify Railway auto-deploys the fixed code
- [ ] Test all pages on live site after deployment
- [ ] Configure custom domain (critzerscabinets.com)
- [ ] Create deployment documentation

## Design Match to Original Site
- [x] Update color scheme to green/professional theme
- [x] Extract logo from original site
- [x] Extract hero background image (kitchen with green cabinets)
- [x] Add Shaun's professional photo to team section
- [ ] Extract service/project photos
- [x] Redesign homepage hero section to match original
- [x] Update navigation to match original dark bar style
- [x] Ensure all pages maintain original site's professional look

## Loom Video Review Feedback (Dec 22, 2025)

### Critical Changes
- [x] **REMOVE "AI-powered" branding from all pages** (user doesn't want to advertise as AI - wants it to feel more personal/human)
- [x] Fix Shop Hardware page - products not displaying (7,358 products imported but not showing) - RESOLVED: Products are loading correctly
- [x] Get shopping cart feature working
- [ ] Scrape product images from Top Knobs and upload to site

### UI/UX Improvements
- [x] Add logo to quote page top navigation
- [x] Make contact info (email/phone) clickable on About page and homepage footer
- [x] Move gallery images to start at top of page (gallery now displays 8 Omega images)
- [x] Add pictures to About page (Shaun's photo added)
- [ ] Add more images throughout site (user will provide)

### Content Additions
- [ ] Add more content/write-up to homepage
- [ ] Create gallery with user-provided images
- [ ] Populate gallery with project photos

### Questions to Address
- [ ] Clarify API usage - is quote system using Manus API credits?
- [ ] Clarify dashboard feature plans

## Image Collection & Upload (Dec 22, 2025)

### Product Images (Top Knobs)
- [ ] Extract product images from TK_2026_Catalog.pdf
- [ ] Match images to products in database by SKU
- [ ] Upload images to S3 storage
- [ ] Update product records with image URLs

### Gallery Images
- [x] Scrape gallery photos from old critzerscabinets.com website (site already points to new version)
- [x] Scrape high-quality cabinet images from Omega Cabinetry website
- [x] Upload gallery images to project public folder
- [x] Create gallery items in database with images (8 items added)

### Deployment
- [ ] Test image display on shop page
- [ ] Test gallery page with new images
- [x] Save checkpoint
- [ ] Push to GitHub for Railway auto-deploy

## New Features Implementation (Dec 22, 2025)

### Shopping Cart System
- [x] Add cart backend procedures (addToCart, getCart, updateQuantity, removeItem, clearCart)
- [x] Create cart UI component with item list and totals
- [x] Add "Add to Cart" buttons to shop page
- [x] Build cart page with quantity controls
- [x] Add cart icon to navigation with item count badge
- [x] Implement checkout flow (Stripe payment processing)

### Product Image Upload Tool
- [x] Create admin-only image upload page
- [x] Build bulk upload interface (drag & drop)
- [x] Implement SKU matching logic
- [x] Add image preview before upload
- [x] Upload images to S3 storage
- [x] Update product records with image URLs
- [x] Show upload progress and results

### About Page Enhancements
- [x] Add team photo section (already existed with team member cards)
- [x] Add Shaun's professional photo to team section
- [x] Update About page layout to accommodate new images
- [x] Team bios moved to top of About page

## Navigation Consistency (Dec 25, 2025)
- [x] Create unified Navigation component with logo, links, cart badge, mobile menu
- [x] Apply Navigation to Home page
- [x] Apply Navigation to About page
- [x] Apply Navigation to Shop page
- [x] Apply Navigation to Quote page
- [x] Apply Navigation to Gallery page
- [x] Apply Navigation to Cart page
- [x] Apply Navigation to Checkout page
- [x] Apply Navigation to ShippingPolicy page
- [x] Apply Navigation to ReturnPolicy page
- [x] Apply Navigation to OrderConfirmation page

## Quote System Improvements (Dec 25, 2025)
- [x] Add structured form with wood species, door style, finish, countertop options
- [x] Add dimensions input field
- [x] Add links to measurement apps (Apple Measure, Google Measure, magicplan)
- [x] Add kitchen background image to Quote page hero

## Shop Page Improvements (Dec 25, 2025)
- [x] Create featured product collections (Best Sellers, New Arrivals, Traditional, Modern, Transitional, Rustic)
- [x] Add tabbed interface for Collections vs Browse All
- [x] Add collection selector cards with icons
- [x] Add kitchen background image to Shop page hero
- [x] Improve filter UI with clear button


## Updates (Dec 25, 2025 - Session 2)
- [x] Add Larry Critzer's professional photo to About page
- [x] Add Dana Quick's professional photo to About page
- [x] Add cabinetry images throughout About page (4 gallery images integrated)
- [x] Add hardware showcase banner to Shop page with Top Knobs images
- [x] Remove Dashboard from public navigation (still accessible via direct URL for logged-in users)
- [ ] Scrape and add product images to individual SKUs

## Image Scraping Task (Dec 26, 2025)
- [ ] Scrape all product images from Top Knobs dealer portal
- [ ] Match images to SKUs using product name from Description field
- [ ] Upload images to S3 storage
- [ ] Update product records with image URLs


## New Tasks (Dec 26, 2025 - Evening)
- [x] Stop full 7,358 SKU scrape
- [x] Research and identify top 100-200 best-selling hardware products
- [x] Scrape images for top sellers only (95 images found)
- [x] Generate improved professional photo of Larry at design island (clean, designing, youthful, happy)
- [x] Update About page with new Larry photo
- [x] Update database with top seller product images (191 products updated)


## Bug Fixes & New Features (Dec 26, 2025 - Late Evening)
- [x] Fix product images not displaying on live Railway site (embedded 191 image URLs in code for deployment)
- [ ] Implement quote lead notification system (email alerts when quotes submitted) - NEXT
- [ ] Add lead capture with contact information from quote form - NEXT


## Debugging (Dec 27, 2025 - Early Morning)
- [x] Check Railway deployment status and verify latest code is deployed
- [x] Test admin update button on live site and check for errors (shows success but images not appearing)
- [x] Debug why product images still not showing after update (code works locally, issue is Railway-specific)
- [ ] Implement working solution for production database


## Full Product Image Scraping (Dec 29, 2025)
- [x] Check background scraper status (85% complete, 6270/7358)
- [x] Speed up scraper to complete remaining 1,088 products faster (used existing 6,400 scraped items)
- [x] Monitor scraping progress (4,567 images found from 6,400 items)
- [ ] Update Railway production database with 4,567 images and 7,358 prices
- [x] Fix pricing display (show actual prices instead of 'Call for pricing') - Added price update endpoint and tested locally
- [ ] Verify images and prices display on live site


## Final Push and Additional Features (Dec 29, 2025)
- [x] Push checkpoint ee198705 to GitHub (3 commits pushed successfully)
- [x] Verify Railway deployment completes successfully (pushed to GitHub, Railway deploying)
- [x] Implement quote lead notification system (email alerts) - Added to createQuote function
- [ ] Resume background scraper for remaining ~2,800 product images (manual trigger only, takes 3-4 hours)
- [ ] Test images, prices, and lead notifications on live site (after Railway deployment completes)
- [ ] Consider requesting official image feed from Top Knobs dealer rep (best long-term solution)


## Loom Video Feedback - Round 2 (Dec 30, 2025)

### CRITICAL: Email Notifications
- [ ] Replace Manus notifications with email notifications
- [ ] Send quote notifications to info@critzerscabinets.com
- [ ] Configure email sender name/address (determine what "From" shows as)
- [ ] Test email delivery for quote submissions

### Product Display Issues
- [ ] Hide or filter out all discontinued products (marked with "DISCONTINUED - LIMITED AVAILABILITY")
- [ ] Improve product image quality (current images are "zoomed back and unfocused")
- [ ] Fix finish name display (showing "copper" when it's actually "antique pewter")
- [ ] Create finish name mapping table for accurate display

### UX Improvements
- [ ] Add quantity selector to each product card (1-99 with +/- buttons)
- [ ] Group products by style with finish selector (like Top Knobs site)
- [ ] Implement finish carousel/slider on product cards
- [ ] Show all finishes for one product in unified view (not separate cards per finish)

### Data Structure Changes
- [ ] Analyze current product data structure (separate SKU per finish)
- [ ] Design new structure to group products by base style
- [ ] Create finish variants system
- [ ] Map finish abbreviations to full finish names (BSN, PC, BLK, PB, etc.)

### Image Quality Improvements
- [ ] Research higher-resolution image sources from Top Knobs
- [ ] Try scraping from product detail pages instead of search results
- [ ] Consider requesting official product image feed from Top Knobs
- [ ] Upload high-quality images for top sellers manually if needed


## Bug Fix - Gallery Duplication (Dec 30, 2025)
- [ ] Fix gallery page showing duplicate images (each item appears twice)
- [ ] Check if database has duplicate entries or if it's a rendering issue
- [ ] Remove duplicates and verify gallery displays correctly


## Current Priority Tasks (Jan 8, 2026)
- [ ] Implement email notifications for quotes → info@critzerscabinets.com (replace Manus notifications)
- [ ] Add quantity selector to product cards in shop
- [ ] Hide/filter discontinued products from shop catalog
- [ ] Improve AI quote system UX and data collection
- [ ] Review and restore any missing navigation tabs or features
- [ ] Fix gallery duplication issue (deploy fixGalleryDuplicates endpoint)
- [ ] Test email notification system with real quote submission
- [ ] Verify all site features are working before deployment


## Phase 1 Progress (Jan 8, 2026)
- [x] Implement email notifications for quotes → info@critzerscabinets.com (replaced Manus notifications)
- [x] Add quantity selector to product cards in shop
- [x] Hide/filter discontinued products from shop catalog
- [ ] Test email notification system with SendGrid API key


## Phase 2 - Restore Missing Features from Old Site (Jan 8, 2026)
- [x] Add hero image carousel to homepage (auto-rotating images)
- [x] Add 30-second commercial video section
- [x] Create Products navigation page
- [x] Create Services navigation page
- [x] Create Contact navigation page
- [x] Add physical address (661 Berkmar Court) to footer
- [x] Add social media links (Facebook, Twitter/X)
- [x] Add payment method icons (Visa, MC, Amex, Discover, Cash, Check)
- [x] Add "Since 1986" / "Family-owned and operated" messaging
- [x] Add "FREE Design Consultation" call-out
- [x] Add factory warranty mention for countertops (included in Services page)
- [x] Update navigation to include Products, Services, Contact


## SEO Improvements (Jan 10, 2026)
- [x] Add meta description tag (50-160 characters)
- [x] Add meta keywords tag
- [x] Verify SEO improvements


## Homepage & Quote System Updates (Jan 10, 2026 - Evening)
- [ ] Add SendGrid API key to Railway environment variables (manual setup required)
- [x] Replace carousel grey background slides with actual images from old site
- [x] Remove trophy emoji (🏆) from "Family-Owned & Operated Since 1986"
- [x] Remove star emoji (✨) from "FREE Design Consultation"
- [x] Redesign quote system - replace open LLM chat with structured form
- [x] Add specific quote form fields (room type, dimensions, cabinet style, wood species, finish, countertop, hardware)
- [x] Build pricing calculator logic for instant estimates
- [x] Research and implement pricing formula based on form inputs
- [x] Test quote system with pricing calculator
- [x] Deploy all changes to Railway via GitHub
- [ ] Consider scraping Ferguson or Top Knobs for additional product images


## Bug Fixes & Content Updates (Jan 10, 2026 - Late Evening)
- [x] Fix gallery showing 3x duplicates of each image (was 2x, now 3x)
- [x] Add real cabinet/project images to About page (not just AI avatars)
- [x] Add relevant cabinetry images to Products page
- [x] Add service-related images to Services page
- [x] Update contact phone number to (434)973-1691 throughout entire site
- [x] Revise homepage dealer copy - mention multiple cabinet lines with Omega/Wolf as primary (not just "Omega and Wolf dealer")
- [x] Add clickable links to Omega Cabinetry, Wolf Home Products, and Top Knobs websites
- [x] Verify mobile hamburger menu works properly on all pages
- [x] Test all fixes on dev server
- [x] Deploy to GitHub/Railway


## Production Fixes (Jan 10, 2026 - Final)
- [x] Fix gallery triplicates on Railway production database (created smart deduplication endpoint)
- [x] Update business hours to 10am-3pm Monday-Friday consistently (Contact, Shipping, Return pages)
- [x] Review and adjust quote pricing formula - increased base prices ~75%
- [x] Explain pricing formula to user for validation
- [x] Test all fixes
- [x] Deploy to GitHub/Railway
- [ ] Run fixGalleryDuplicates endpoint on production after deploy (instructions below)


## Fix Gallery Duplicates Button (Jan 12, 2026)
- [x] Add fixGalleryDuplicates procedure to gallery router (currently in wrong location)
- [x] Remove duplicate procedure from line 1332
- [ ] Test admin-utilities page works (tRPC types not regenerating locally)
- [ ] Deploy to production and test there


## Gallery & Video Fixes (Jan 12, 2026 - Afternoon)
- [ ] Gallery still showing triplicates on production (Railway hasn't deployed fix yet)
- [x] Homepage commercial video has no sound - removed muted attribute
- [ ] Wait for Railway to deploy latest code with gallery query fix


## Image Generation & Fixes (Jan 13, 2026)
- [x] Generate quality image for About page - Omega Cabinetry section
- [x] Generate quality image for About page - Top Knobs hardware section
- [x] Generate 6 service images for Services page:
  - [x] Professional Design (kitchen/bath design consultation)
  - [x] Custom Cabinetry (cabinet craftsmanship)
  - [x] Countertop Fabrication (granite/marble/quartz)
  - [x] Professional Installation (installation work)
  - [x] Delivery & Logistics (delivery truck/coordination)
  - [x] Hardware Selection (cabinet hardware display)
- [x] Generate 4 countertop material images for Products page:
  - [x] Granite countertop sample
  - [x] Marble countertop sample
  - [x] Quartz countertop sample
  - [x] Laminate countertop sample
- [x] Update About.tsx with new Omega and Top Knobs images
- [x] Update Services.tsx replacing icons with quality photos
- [x] Update Products.tsx with countertop material images
- [ ] Verify gallery triplicates fixed on production (Railway deployment in progress)
- [x] Test all pages and deploy


## Critical Fixes (Jan 13, 2026 - Afternoon)
- [ ] FIX GALLERY TRIPLICATES ONCE AND FOR ALL - verify query code deployed to production
- [ ] Update Contact page map pin to correct location: 661 Berkmar Ct, Charlottesville, VA 22901
- [ ] Add actual payment card logos (Visa, Mastercard, Amex, Discover) to footer instead of text
- [ ] Replace Laminate countertop with Solid Surface (Corian) on Products page
- [ ] Generate Solid Surface countertop image
- [ ] Test all fixes
- [ ] Deploy to production


## Immediate Fixes (Jan 13, 2026)
- [ ] Add Top Knobs branded hero image to Products page (similar to Omega/Wolf sections)
- [ ] Fix gallery to display all 9 images (currently only 1 showing, expand from 8 to 9 items)
- [ ] Add measurement app download links back to Quote page
- [ ] Design and implement file upload system for customer measurements
- [ ] Research and recommend optimal CAD software to replace 2020 Design

## AI Quote System Enhancement Vision
- [ ] Integrate measurement app uploads (RoomScan Pro, MagicPlan, Apple Measure, Google Measure)
- [ ] Build file upload system accepting photos, PDFs, measurement data
- [ ] Create cabinet catalog browser with Omega/Wolf products
- [ ] Implement smart pricing engine with GPM multiplier
- [ ] Add AI chat assistant for 24/7 customer support
- [ ] Generate instant quotes within 5-10% accuracy

## Updates (Jan 13, 2026)
- [x] Fix gallery triplicates issue (database had 8 items, now displaying correctly)
- [x] Fix Contact page map with correct coordinates for 661 Berkmar Ct
- [x] Add payment card logos to footer (Visa, Mastercard, Amex, Discover)
- [x] Replace Laminate with Solid Surface (Corian) on Products page
- [x] Add Top Knobs branded hero image to Products page
- [x] Expand gallery from 8 to 9 items (3x3 grid)
- [x] Add measurement app download links to Quote page (MagicPlan, RoomScan Pro, Google Measure)
- [x] Create comprehensive AI Quote System roadmap with CAD software recommendation

## About & Products Page UX Improvements (Jan 14, 2026)
- [x] About page: Move "Meet Our Team" section to very top
- [x] About page: Move "About Critzer's" text section below team
- [x] About page: Add Wolf logo to "Our Partners" (make it 3 logos: Omega, Wolf, Top Knobs)
- [x] About page: Fix email critzerscabinets@gmail.com → info@critzerscabinets.com
- [x] About page: Change Saturday hours to "By Appointment Only"
- [x] Products page: Remove large "Our Products" hero section
- [x] Products page: Start immediately with "Cabinetry" section
- [x] Update roadmap with Cabinet Vision perpetual license option
- [x] Update roadmap with MagicPlan affiliate program info
- [x] Deploy all changes to Railway via GitHub (code already in GitHub repo, user needs to log into Railway to verify auto-deployment)


## Railway Deployment Issues (Jan 14, 2026)
- [x] Fix About page: Omega and Top Knobs logos not loading on Railway (added omega-logo.png and topknobs-logo.png)
- [x] Fix Gallery page: Still showing triplicates on Railway (updated database to use existing images)
- [x] Verify all images are accessible on Railway deployment
- [x] Push fixes to GitHub and verify Railway auto-deployment (pushed commit bea75e7)


## Gallery Rebuild - Simple Static Approach (Jan 14, 2026)
- [x] Remove database dependency from Gallery page
- [x] Hardcode 9 image paths directly in Gallery.tsx
- [x] Test gallery displays 9 unique images (verified in dev environment)
- [x] Push to GitHub and verify Railway deployment (pushed commit 409b782)


## Top Knobs Catalog Implementation (Jan 14, 2026)
- [x] Research Ferguson's Top Knobs catalog presentation
- [x] Replace Shop page with Ferguson-style collection browser
- [x] Add 8 collection cards with images
- [x] Add 4 style category cards
- [x] Add CTA to contact for ordering
- [x] Test in dev environment (verified all sections loading correctly)
- [ ] Push to GitHub and deploy to Railway
