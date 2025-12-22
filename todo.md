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
- [ ] Create product detail pages
- [ ] Implement shopping cart functionality
- [ ] Add checkout and payment processing
- [ ] Integrate shipping calculation

## Design Overhaul - Match Original Site
- [ ] Extract all images from critzerscabinets.com (logo, cabinet photos, team photos)
- [ ] Change color scheme from pink/warm to green/professional to match original
- [ ] Redesign homepage hero section with cabinet background image
- [ ] Match navigation style and layout to original site
- [ ] Import and use original site's imagery throughout
- [ ] Ensure all pages maintain consistent look with original design
- [ ] Test all functionality with new design

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
- [ ] Extract team photos (Larry, Dana, Shaun)
- [ ] Extract service/project photos
- [x] Redesign homepage hero section to match original
- [x] Update navigation to match original dark bar style
- [ ] Ensure all pages maintain original site's professional look

## Loom Video Review Feedback (Dec 22, 2025)

### Critical Changes
- [x] **REMOVE "AI-powered" branding from all pages** (user doesn't want to advertise as AI - wants it to feel more personal/human)
- [x] Fix Shop Hardware page - products not displaying (7,358 products imported but not showing) - RESOLVED: Products are loading correctly
- [ ] Get shopping cart feature working
- [ ] Scrape product images from Top Knobs and upload to site

### UI/UX Improvements
- [x] Add logo to quote page top navigation
- [x] Make contact info (email/phone) clickable on About page and homepage footer
- [x] Move gallery images to start at top of page (gallery now displays 8 Omega images)
- [ ] Add pictures to About page
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
- [ ] Save checkpoint
- [ ] Push to GitHub for Railway auto-deploy

## New Features Implementation (Dec 22, 2025)

### Shopping Cart System
- [x] Add cart backend procedures (addToCart, getCart, updateQuantity, removeItem, clearCart)
- [x] Create cart UI component with item list and totals
- [x] Add "Add to Cart" buttons to shop page
- [x] Build cart page with quantity controls
- [x] Add cart icon to navigation with item count badge
- [ ] Implement checkout flow (payment processing)

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
- [x] Add workshop/fabrication photos section (4 placeholder sections added)
- [x] Update About page layout to accommodate new images
- [x] Add placeholder images with upload instructions

## Railway Deployment Issues (Loom Review #2 - Dec 22, 2025)

### Navigation Bar
- [ ] Fix logo disappearing on About Us and other pages
- [ ] Make navigation consistent across all pages (show full menu everywhere)
- [ ] Ensure "Critzer's Cabinets" logo shows on all pages

### Gallery Images
- [ ] Fix gallery images not loading on Railway (work in Manus preview but not Railway)
- [ ] Investigate static asset deployment from `/client/public/images/gallery/`
- [ ] Verify image paths are correct for production build

### Shop Hardware
- [ ] Fix shop hardware page not working on Railway
- [ ] Verify database connection to MySQL from Railway
- [ ] Check if products are accessible from Railway deployment

### Dashboard
- [ ] Fix dashboard not working on Railway
- [ ] Investigate why it works in Manus preview but not Railway

### Database Connection
- [ ] Verify Railway can connect to MySQL database
- [ ] Check if gallery_items table is accessible
- [ ] Check if products table is accessible
- [ ] Verify DATABASE_URL environment variable is correct
