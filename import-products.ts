import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { products } from './drizzle/schema.js';
import { read, utils } from 'xlsx';
import { readFileSync } from 'fs';

async function importProducts() {
  console.log('Starting Top Knobs product import...');
  
  // Read the Excel file
  const file = readFileSync('/home/ubuntu/upload/TopKnobsJanuary2026PriceList.xlsx');
  const workbook = read(file, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = utils.sheet_to_json(worksheet);
  
  console.log(`Found ${data.length} products in Excel file`);
  
  // Connect to database
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  const db = drizzle(connection);
  
  // Process products in batches
  const batchSize = 100;
  let imported = 0;
  let skipped = 0;
  
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const productsToInsert: any[] = [];
    
    for (const row of batch as any[]) {
      const sku = row['Part Number'] || row['SKU'] || row['Item #'];
      if (!sku) {
        skipped++;
        continue;
      }
      
      const listPrice = row['List Price'] || row['List'] || row['Price'];
      const retailPrice = listPrice;
      
      productsToInsert.push({
        sku: String(sku).trim(),
        name: String(row['Description'] || row['Product Name'] || sku).trim(),
        description: row['Long Description'] || row['Details'] || null,
        collection: row['Collection'] || row['Series'] || null,
        finish: row['Finish'] || row['Color'] || null,
        category: row['Category'] || 'Hardware',
        listPrice: listPrice ? String(listPrice) : null,
        dealerPrice: null,
        retailPrice: retailPrice ? String(retailPrice) : null,
        dimensions: row['Dimensions'] || row['Size'] || null,
        weight: row['Weight'] ? String(row['Weight']) : null,
        upc: row['UPC'] || row['Barcode'] || null,
        imageUrl: null,
        inStock: 'unknown' as const,
        featured: 'no' as const,
      });
    }
    
    if (productsToInsert.length > 0) {
      try {
        await db.insert(products).values(productsToInsert).onDuplicateKeyUpdate({
          set: { updatedAt: new Date() }
        });
        imported += productsToInsert.length;
        console.log(`Imported batch ${Math.floor(i / batchSize) + 1}: ${imported} total products`);
      } catch (error: any) {
        console.error(`Error importing batch:`, error.message);
      }
    }
  }
  
  await connection.end();
  
  console.log(`\n✅ Import complete!`);
  console.log(`   Imported: ${imported} products`);
  console.log(`   Skipped: ${skipped} products (missing SKU)`);
}

importProducts().catch(console.error).finally(() => process.exit(0));
