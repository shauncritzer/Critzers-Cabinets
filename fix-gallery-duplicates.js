/**
 * Fix Gallery Duplicates
 * Removes duplicate gallery entries keeping only the first occurrence of each title
 */

import mysql from 'mysql2/promise';
import 'dotenv/config';

async function fixDuplicates() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  try {
    console.log('🔍 Checking for duplicate gallery entries...\n');
    
    // Get all gallery items
    const [items] = await conn.query('SELECT id, title FROM gallery ORDER BY id');
    console.log(`Found ${items.length} total gallery items`);
    
    // Find duplicates
    const seen = new Map();
    const duplicates = [];
    
    items.forEach(item => {
      if (seen.has(item.title)) {
        duplicates.push(item.id);
        console.log(`❌ Duplicate found: "${item.title}" (ID: ${item.id})`);
      } else {
        seen.set(item.title, item.id);
        console.log(`✅ Keeping: "${item.title}" (ID: ${item.id})`);
      }
    });
    
    if (duplicates.length === 0) {
      console.log('\n✨ No duplicates found! Gallery is clean.');
      await conn.end();
      return;
    }
    
    console.log(`\n🗑️  Found ${duplicates.length} duplicate(s) to remove`);
    console.log('Duplicate IDs:', duplicates);
    
    // Delete duplicates
    if (duplicates.length > 0) {
      const placeholders = duplicates.map(() => '?').join(',');
      const [result] = await conn.query(
        `DELETE FROM gallery WHERE id IN (${placeholders})`,
        duplicates
      );
      
      console.log(`\n✅ Deleted ${result.affectedRows} duplicate entries`);
    }
    
    // Verify final count
    const [finalItems] = await conn.query('SELECT COUNT(*) as count FROM gallery');
    console.log(`\n📊 Final gallery count: ${finalItems[0].count} items`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await conn.end();
  }
}

fixDuplicates();
