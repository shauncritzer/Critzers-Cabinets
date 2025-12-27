#!/usr/bin/env node
/**
 * Update product images in database from scraped data
 * This script reads the scraped image URLs and updates the database
 */

import mysql from 'mysql2/promise';
import fs from 'fs';

const SCRAPED_DATA_PATH = '/home/ubuntu/topknobs_images_full.json';

async function updateProductImages() {
  console.log('Loading scraped image data...');
  const scrapedData = JSON.parse(fs.readFileSync(SCRAPED_DATA_PATH, 'utf8'));
  
  console.log(`Found ${scrapedData.length} SKUs in scraped data`);
  
  // Connect to database
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  let updated = 0;
  let notFound = 0;
  let alreadyHasImage = 0;
  let noImageAvailable = 0;
  
  console.log('Updating database...');
  
  for (const item of scrapedData) {
    const { sku, image_url } = item;
    
    if (!image_url) {
      noImageAvailable++;
      continue;
    }
    
    try {
      // Check if product exists and if it already has an image
      const [rows] = await connection.execute(
        'SELECT id, image_url FROM products WHERE sku = ?',
        [sku]
      );
      
      if (rows.length === 0) {
        notFound++;
        console.log(`SKU not found in database: ${sku}`);
        continue;
      }
      
      const product = rows[0];
      
      if (product.image_url) {
        alreadyHasImage++;
        continue;
      }
      
      // Update the image URL
      await connection.execute(
        'UPDATE products SET image_url = ?, updated_at = NOW() WHERE sku = ?',
        [image_url, sku]
      );
      
      updated++;
      
      if (updated % 100 === 0) {
        console.log(`Progress: ${updated} products updated`);
      }
    } catch (error) {
      console.error(`Error updating SKU ${sku}:`, error.message);
    }
  }
  
  await connection.end();
  
  console.log('\n=== Update Summary ===');
  console.log(`Total SKUs processed: ${scrapedData.length}`);
  console.log(`Products updated: ${updated}`);
  console.log(`Products already had images: ${alreadyHasImage}`);
  console.log(`SKUs not found in database: ${notFound}`);
  console.log(`No image available: ${noImageAvailable}`);
  console.log(`Success rate: ${(100 * (scrapedData.length - noImageAvailable) / scrapedData.length).toFixed(1)}%`);
}

// Run the update
updateProductImages().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
