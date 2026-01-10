/**
 * Restore Gallery Items
 * Re-creates the 8 gallery items that were accidentally deleted
 */

import mysql from 'mysql2/promise';
import 'dotenv/config';

const galleryItems = [
  {
    title: 'Modern White Kitchen Transformation',
    description: 'Complete kitchen remodel featuring clean white cabinetry with modern hardware and sleek countertops',
    afterImageUrl: '/images/gallery/3HrP0H3BuW7m.jpg',
    cabinetType: 'full_kitchen',
    style: 'modern',
    roomType: 'Kitchen',
    featured: 1,
    displayOrder: 1,
  },
  {
    title: 'Elegant Gray Kitchen Design',
    description: 'Sophisticated gray cabinet installation with professional-grade finishes and contemporary styling',
    afterImageUrl: '/images/gallery/53H0NAM0eSvE.webp',
    cabinetType: 'full_kitchen',
    style: 'contemporary',
    roomType: 'Kitchen',
    featured: 1,
    displayOrder: 2,
  },
  {
    title: 'Custom Kitchen Island',
    description: 'Beautiful custom island with extensive storage, seating area, and coordinating cabinetry',
    afterImageUrl: '/images/gallery/7nAUkEFBXEaf.jpg',
    cabinetType: 'island',
    style: 'transitional',
    roomType: 'Kitchen',
    featured: 1,
    displayOrder: 3,
  },
  {
    title: 'Traditional Wood Kitchen',
    description: 'Classic wood cabinetry with traditional styling and timeless appeal',
    afterImageUrl: '/images/gallery/FbkkkCWXInZS.jpg',
    cabinetType: 'full_kitchen',
    style: 'traditional',
    roomType: 'Kitchen',
    featured: 0,
    displayOrder: 4,
  },
  {
    title: 'Contemporary Open Kitchen',
    description: 'Open-concept kitchen with modern cabinetry and integrated appliances',
    afterImageUrl: '/images/gallery/KL9ldeZDUcbT.jpg',
    cabinetType: 'full_kitchen',
    style: 'modern',
    roomType: 'Kitchen',
    featured: 0,
    displayOrder: 5,
  },
  {
    title: 'Luxury Kitchen Remodel',
    description: 'High-end kitchen featuring premium cabinetry, custom finishes, and designer hardware',
    afterImageUrl: '/images/gallery/RHHoKWmplcBC.jpg',
    cabinetType: 'full_kitchen',
    style: 'luxury',
    roomType: 'Kitchen',
    featured: 1,
    displayOrder: 6,
  },
  {
    title: 'Farmhouse Style Kitchen',
    description: 'Charming farmhouse-style kitchen with rustic elements and practical design',
    afterImageUrl: '/images/gallery/bt6Vi4lpCf4B.jpg',
    cabinetType: 'full_kitchen',
    style: 'farmhouse',
    roomType: 'Kitchen',
    featured: 0,
    displayOrder: 7,
  },
  {
    title: 'Transitional Kitchen Design',
    description: 'Perfectly balanced transitional design blending classic and contemporary elements',
    afterImageUrl: '/images/gallery/ubBFg9QkproG.jpg',
    cabinetType: 'full_kitchen',
    style: 'transitional',
    roomType: 'Kitchen',
    featured: 0,
    displayOrder: 8,
  },
];

async function restoreGallery() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  try {
    console.log('🔄 Restoring gallery items...\n');
    
    for (const item of galleryItems) {
      const [result] = await conn.query(
        `INSERT INTO gallery 
        (title, description, afterImageUrl, cabinetType, style, roomType, featured, displayOrder) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.title,
          item.description,
          item.afterImageUrl,
          item.cabinetType,
          item.style,
          item.roomType,
          item.featured,
          item.displayOrder,
        ]
      );
      console.log(`✅ Inserted: ${item.title} (ID: ${result.insertId})`);
    }
    
    const [count] = await conn.query('SELECT COUNT(*) as count FROM gallery');
    console.log(`\n✨ Gallery restored! Total items: ${count[0].count}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await conn.end();
  }
}

restoreGallery();
