#!/usr/bin/env node
/**
 * Download product images and upload to S3
 * This script downloads images from Top Knobs and uploads them to S3 for faster loading
 */

import fs from 'fs';
import https from 'https';
import { storagePut } from './server/storage.js';

const SCRAPED_DATA_PATH = '/home/ubuntu/topknobs_images_full.json';
const TEMP_DIR = '/tmp/topknobs_images';

// Create temp directory
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

async function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

async function uploadImagesToS3() {
  console.log('Loading scraped image data...');
  const scrapedData = JSON.parse(fs.readFileSync(SCRAPED_DATA_PATH, 'utf8'));
  
  const withImages = scrapedData.filter(item => item.image_url);
  console.log(`Found ${withImages.length} products with images`);
  
  let uploaded = 0;
  let failed = 0;
  
  for (const item of withImages) {
    const { sku, image_url } = item;
    
    try {
      console.log(`Downloading ${sku}...`);
      const imageBuffer = await downloadImage(image_url);
      
      // Determine file extension
      const ext = image_url.match(/\.(jpg|jpeg|png|gif)$/i)?.[1] || 'jpg';
      
      // Upload to S3 with SKU-based path
      const s3Key = `products/${sku}.${ext}`;
      const result = await storagePut(s3Key, imageBuffer, `image/${ext}`);
      
      console.log(`Uploaded ${sku}: ${result.url}`);
      uploaded++;
      
      if (uploaded % 50 === 0) {
        console.log(`Progress: ${uploaded}/${withImages.length} uploaded`);
      }
      
      // Small delay to avoid overwhelming S3
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`Failed to process ${sku}:`, error.message);
      failed++;
    }
  }
  
  console.log('\n=== Upload Summary ===');
  console.log(`Total images: ${withImages.length}`);
  console.log(`Successfully uploaded: ${uploaded}`);
  console.log(`Failed: ${failed}`);
}

// Run the upload
uploadImagesToS3().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
