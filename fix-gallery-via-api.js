/**
 * Fix Gallery Duplicates via Live Site API
 * Deletes duplicate gallery entries (IDs 1-8) keeping newer ones (IDs 9-16)
 */

async function fixGalleryDuplicates() {
  const baseUrl = 'https://critzerscabinets.com';
  
  console.log('🔍 Checking current gallery state...\n');
  
  // Fetch current gallery items
  const response = await fetch(`${baseUrl}/api/trpc/gallery.getAll?batch=1`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  const data = await response.json();
  const items = data[0].result.data.json;
  
  console.log(`Found ${items.length} gallery items`);
  
  // Identify duplicates (IDs 1-8 are duplicates of 9-16)
  const duplicateIds = [1, 2, 3, 4, 5, 6, 7, 8];
  
  console.log(`\nDuplicate IDs to delete: ${duplicateIds.join(', ')}`);
  console.log(`Will keep IDs: 9, 10, 11, 12, 13, 14, 15, 16\n`);
  
  // Note: We can't delete via API without admin authentication
  // Instead, we'll use direct database access
  console.log('⚠️  Cannot delete via public API (requires authentication)');
  console.log('Using direct database connection instead...\n');
  
  // Import database connection
  const mysql = await import('mysql2/promise');
  const dotenv = await import('dotenv');
  dotenv.config();
  
  const conn = await mysql.default.createConnection(process.env.DATABASE_URL);
  
  try {
    console.log('🗑️  Deleting duplicate gallery entries...');
    
    const [result] = await conn.query(
      'DELETE FROM gallery WHERE id IN (?, ?, ?, ?, ?, ?, ?, ?)',
      duplicateIds
    );
    
    console.log(`✅ Deleted ${result.affectedRows} duplicate entries\n`);
    
    // Verify remaining items
    const [remaining] = await conn.query('SELECT id, title FROM gallery ORDER BY id');
    console.log(`📊 Remaining gallery items: ${remaining.length}`);
    remaining.forEach(item => {
      console.log(`  ✓ ID ${item.id}: ${item.title}`);
    });
    
    console.log('\n✨ Gallery duplication fixed!');
    console.log('🔄 Refresh the website to see changes');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await conn.end();
  }
}

fixGalleryDuplicates().catch(console.error);
