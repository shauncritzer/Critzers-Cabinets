// Temporary debug endpoint to check database imageUrl values
import { getDb } from './db';
import { products } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

export async function checkImageUrls() {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');

  // Check a few specific SKUs that should have images
  const testSkus = ['M371', 'M372', 'M373', 'M6', 'M390'];
  
  const results = [];
  for (const sku of testSkus) {
    const result = await db.select({
      sku: products.sku,
      name: products.name,
      imageUrl: products.imageUrl
    })
    .from(products)
    .where(eq(products.sku, sku))
    .limit(1);
    
    results.push(result[0] || { sku, error: 'Not found' });
  }
  
  return results;
}
