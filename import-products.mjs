import { drizzle } from 'drizzle-orm/mysql2';
import { products } from './drizzle/schema.ts';
import * as XLSX from 'xlsx';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function importProducts() {
  console.log('Starting Top Knobs product import...');
  
  // Read the Excel file
  const workbook = XLSX.readFile('/home/ubuntu/upload/TopKnobsJanuary2026PriceList.xlsx');
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);
  
  console.log(`Found ${data.length} products in Excel file`);
  
  // Connect to database
  const db = drizzle(process.env.DATABASE_URL);
  
  // Process products in batches
  const batchSize = 100;
  let imported = 0;
  let skipped = 0;
  
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const productsToInsert = [];
    
    for (const row of batch) {
      const sku = row['Part Number'] || row['SKU'] || row['Item #'];
      if (!sku) {
        skipped++;
        continue;
      }
      
      const listPrice = row['List Price'] || row['List'] || row['Price'];
      const retailPrice = listPrice; // Sell at list price
      
      productsToInsert.push({
        sku: String(sku).trim(),
        name: String(row['Description'] || row['Product Name'] || sku).trim(),
        description: row['Long Description'] || row['Details'] || null,
        collection: row['Collection'] || row['Series'] || null,
        finish: row['Finish'] || row['Color'] || null,
        category: row['Category'] || 'Hardware',
        listPrice: listPrice ? String(listPrice) : null,
        dealerPrice: null, // Will be calculated as 50% off list
        retailPrice: retailPrice ? String(retailPrice) : null,
        dimensions: row['Dimensions'] || row['Size'] || null,
        weight: row['Weight'] ? String(row['Weight']) : null,
        upc: row['UPC'] || row['Barcode'] || null,
        imageUrl: null, // Will be populated later
        inStock: 'unknown',
        featured: 'no',
      });
    }
    
    if (productsToInsert.length > 0) {
      try {
        await db.insert(products).values(productsToInsert).onDuplicateKeyUpdate({
          set: { updatedAt: new Date() }
        });
        imported += productsToInsert.length;
        console.log(`Imported batch ${Math.floor(i / batchSize) + 1}: ${imported} total products`);
      } catch (error) {
        console.error(`Error importing batch:`, error.message);
      }
    }
  }
  
  console.log(`\n✅ Import complete!`);
  console.log(`   Imported: ${imported} products`);
  console.log(`   Skipped: ${skipped} products (missing SKU)`);
}

importProducts().catch(console.error).finally(() => process.exit(0));
