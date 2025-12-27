import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { eq } from 'drizzle-orm';
import { mysqlTable, varchar, decimal, text, int } from 'drizzle-orm/mysql-core';
import fs from 'fs';

// Define products table schema inline
const products = mysqlTable('products', {
  id: int('id').primaryKey().autoincrement(),
  sku: varchar('sku', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 500 }),
  description: text('description'),
  collection: varchar('collection', { length: 255 }),
  finish: varchar('finish', { length: 255 }),
  price: decimal('price', { precision: 10, scale: 2 }),
  imageUrl: varchar('image_url', { length: 1000 }),
});

// Read the scraped images
const scrapedData = JSON.parse(fs.readFileSync('/home/ubuntu/topknobs_top_sellers.json', 'utf8'));

// Create database connection
const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

let updated = 0;
let notFound = 0;

for (const item of scrapedData) {
  if (item.image_url) {
    try {
      // Update product by SKU
      await db.update(products)
        .set({ imageUrl: item.image_url })
        .where(eq(products.sku, item.sku));
      
      updated++;
      if (updated <= 10 || updated % 10 === 0) {
        console.log(`✓ Updated ${item.sku}`);
      }
    } catch (error) {
      console.error(`✗ Error updating ${item.sku}:`, error.message);
      notFound++;
    }
  }
}

console.log(`\n=== Update Complete ===`);
console.log(`Updated: ${updated} products`);
console.log(`Skipped (no image): ${scrapedData.length - updated - notFound} products`);
console.log(`Errors: ${notFound} products`);

await connection.end();
