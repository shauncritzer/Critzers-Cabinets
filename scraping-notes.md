# Top Knobs Dealer Portal Scraping Notes

## Portal Structure
- URL: https://dealers.topknobs.com/
- Products page: https://dealers.topknobs.com/products.html
- Product detail URL pattern: https://dealers.topknobs.com/collections/{product-slug}.html

## Product Page Structure
- Item Number: "Brixton Rimmed Knob" (this appears to be the product name, not SKU)
- Collection: Devon
- Finish options shown as swatches (e.g., Sable, Umbrio)
- Images are displayed on the left side of product detail page
- Related products shown at bottom

## Key Observations
1. The "Item Number" field shows product name, not the actual SKU code
2. Need to find where actual SKU codes (like TK1000, M1234, etc.) are displayed
3. Products have multiple finish variants - each finish likely has its own SKU
4. Need to check if there's a bulk export or API available

## Image URL Pattern Discovered!
Images are served from: `https://dealers.topknobs.com/media/catalog/product/`

Example URLs:
- `https://dealers.topknobs.com/media/catalog/product/B/r/Brixton_Rimmed_Knob_0_2e1439.jpg`
- `https://dealers.topknobs.com/media/catalog/product/H/e/Henderson_Knob_0_63a336.jpg`

Pattern: `/media/catalog/product/{First Letter}/{Second Letter}/{Product_Name_0_hash}.jpg`

The images have query params for sizing:
- `?width=220&height=220&canvas=220,220&quality=80&bg-color=255,255,255&fit=bounds`

We can remove these params to get full-size images.

## Products Page Structure
- 523 total products (collections)
- 30 products per page
- 18 pages total
- Each product links to a collection page with finish variants

## Next Steps
1. Check uploaded catalog/price list files for SKU codes
2. Match product names to SKUs in database
3. Build scraper to download all product images
