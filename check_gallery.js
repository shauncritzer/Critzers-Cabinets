import { getDb } from './server/db.js';
import { gallery } from './drizzle/schema.js';

const db = await getDb();
const items = await db.select().from(gallery);

console.log('Total gallery items:', items.length);
console.log('\nGallery items:');
items.forEach(item => {
  console.log(`ID: ${item.id}, Title: ${item.title}`);
});

// Check for duplicate titles
const titles = items.map(i => i.title);
const duplicates = titles.filter((title, index) => titles.indexOf(title) !== index);
if (duplicates.length > 0) {
  console.log('\n⚠️  DUPLICATE TITLES FOUND:', [...new Set(duplicates)]);
}

process.exit(0);
