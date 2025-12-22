#!/usr/bin/env node
/**
 * Seed gallery with Omega Cabinetry images
 */
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../drizzle/schema.js';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const galleryItems = [
  {
    title: "Classic White Kitchen with Island",
    description: "Elegant white shaker cabinets with a contrasting dark island, featuring glass-front upper cabinets and marble countertops.",
    roomType: "Kitchen",
    style: "Traditional",
    cabinetType: "Base and Wall",
    afterImageUrl: "/images/gallery/bt6Vi4lpCf4B.jpg",
    featured: 1
  },
  {
    title: "Warm Cherry Kitchen",
    description: "Rich cherry wood cabinets with raised panel doors, creating a warm and inviting traditional kitchen space.",
    roomType: "Kitchen",
    style: "Traditional",
    cabinetType: "Base and Wall",
    afterImageUrl: "/images/gallery/ubBFg9QkproG.jpg",
    featured: 1
  },
  {
    title: "Sophisticated White Kitchen",
    description: "Bright white kitchen featuring decorative glass cabinet doors, marble backsplash, and professional-grade appliances.",
    roomType: "Kitchen",
    style: "Traditional",
    cabinetType: "Base and Wall",
    afterImageUrl: "/images/gallery/KL9ldeZDUcbT.jpg",
    featured: 1
  },
  {
    title: "Modern Two-Tone Kitchen",
    description: "Contemporary kitchen design with white upper cabinets and dark lower cabinets, stainless steel appliances.",
    roomType: "Kitchen",
    style: "Contemporary",
    cabinetType: "Base and Wall",
    afterImageUrl: "/images/gallery/7nAUkEFBXEaf.jpg",
    featured: 0
  },
  {
    title: "Espresso Contemporary Kitchen",
    description: "Sleek dark espresso cabinets with modern hardware and stainless steel appliances for a contemporary look.",
    roomType: "Kitchen",
    style: "Contemporary",
    cabinetType: "Base and Wall",
    afterImageUrl: "/images/gallery/RHHoKWmplcBC.jpg",
    featured: 0
  },
  {
    title: "Casual Modern Kitchen",
    description: "Open and airy kitchen with natural wood tones and modern design elements, perfect for everyday living.",
    roomType: "Kitchen",
    style: "Casual",
    cabinetType: "Base and Wall",
    afterImageUrl: "/images/gallery/53H0NAM0eSvE.webp",
    featured: 0
  },
  {
    title: "Bold Blue Bathroom",
    description: "Stunning bathroom vanity in rich blue finish with brass hardware, creating a luxurious spa-like atmosphere.",
    roomType: "Bathroom",
    style: "Contemporary",
    cabinetType: "Vanity",
    afterImageUrl: "/images/gallery/FbkkkCWXInZS.jpg",
    featured: 1
  },
  {
    title: "Cherry Bathroom Vanity",
    description: "Elegant double vanity in warm cherry wood with traditional styling and ample storage space.",
    roomType: "Bathroom",
    style: "Traditional",
    cabinetType: "Vanity",
    afterImageUrl: "/images/gallery/3HrP0H3BuW7m.jpg",
    featured: 0
  }
];

async function seedGallery() {
  console.log('Connecting to database...');
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection, { schema, mode: 'default' });

  console.log('Clearing existing gallery items...');
  await connection.query('DELETE FROM gallery');

  console.log('Inserting gallery items...');
  for (const item of galleryItems) {
    await db.insert(schema.gallery).values(item);
    console.log(`✓ Added: ${item.title}`);
  }

  console.log(`\n✅ Successfully seeded ${galleryItems.length} gallery items!`);
  await connection.end();
}

seedGallery().catch(error => {
  console.error('Error seeding gallery:', error);
  process.exit(1);
});
