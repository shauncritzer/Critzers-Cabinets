/**
 * Fix Gallery Duplicates on Railway Production Database
 * This script connects to the actual Railway production database
 * and removes duplicate gallery entries
 */

import mysql from 'mysql2/promise';

// Railway production database URL
// This should be the actual production DATABASE_URL from Railway environment
const RAILWAY_DB_URL = process.env.DATABASE_URL;

async function fixRailwayGallery() {
  console.log('🔗 Connecting to Railway production database...\n');
  
  if (!RAILWAY_DB_URL) {
    console.error('❌ DATABASE_URL not found in environment');
    console.log('Please ensure DATABASE_URL is set to Railway production database');
    process.exit(1);
  }
  
  const conn = await mysql.createConnection(RAILWAY_DB_URL);
  
  try {
    // First, check current state
    console.log('📊 Current gallery state:');
    const [current] = await conn.query('SELECT id, title FROM gallery ORDER BY id');
    console.log(`Total items: ${current.length}\n`);
    
    if (current.length === 0) {
      console.log('⚠️  Gallery is empty! No items to fix.');
      await conn.end();
      return;
    }
    
    // Show all items
    current.forEach(item => {
      console.log(`  ID ${item.id}: ${item.title}`);
    });
    
    // Identify duplicates (IDs 1-8 are duplicates of 9-16)
    const duplicateIds = [1, 2, 3, 4, 5, 6, 7, 8];
    const duplicatesToDelete = current.filter(item => duplicateIds.includes(item.id));
    
    if (duplicatesToDelete.length === 0) {
      console.log('\n✨ No duplicates found! Gallery is already clean.');
      await conn.end();
      return;
    }
    
    console.log(`\n🗑️  Found ${duplicatesToDelete.length} duplicates to delete:`);
    duplicatesToDelete.forEach(item => {
      console.log(`  - ID ${item.id}: ${item.title}`);
    });
    
    // Delete duplicates
    console.log('\n⚙️  Deleting duplicates...');
    const placeholders = duplicateIds.map(() => '?').join(',');
    const [result] = await conn.query(
      `DELETE FROM gallery WHERE id IN (${placeholders})`,
      duplicateIds
    );
    
    console.log(`✅ Deleted ${result.affectedRows} duplicate entries\n`);
    
    // Verify final state
    const [final] = await conn.query('SELECT id, title FROM gallery ORDER BY id');
    console.log(`📊 Final gallery state:`);
    console.log(`Total items: ${final.length}\n`);
    final.forEach(item => {
      console.log(`  ✓ ID ${item.id}: ${item.title}`);
    });
    
    console.log('\n✨ Gallery duplication fixed successfully!');
    console.log('🔄 Refresh https://critzerscabinets.com/gallery to see changes');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await conn.end();
  }
}

fixRailwayGallery().catch(console.error);
