-- Gallery Items for Critzer's Cabinet Creations
-- 8 Omega Cabinetry Kitchen Images
-- Schema: drizzle/schema.ts lines 198-219

-- Clear existing gallery data (optional - uncomment if needed)
-- DELETE FROM gallery;

-- Insert 8 gallery items using actual image filenames from client/public/images/gallery/
INSERT INTO gallery (
  title,
  description,
  beforeImageUrl,
  afterImageUrl,
  cabinetType,
  style,
  roomType,
  featured,
  displayOrder,
  createdAt,
  updatedAt
) VALUES
(
  'Modern White Kitchen Transformation',
  'Complete kitchen remodel featuring clean white cabinetry with modern hardware and sleek countertops',
  NULL,
  '/images/gallery/3HrP0H3BuW7m.jpg',
  'full_kitchen',
  'modern',
  'Kitchen',
  1,
  1,
  NOW(),
  NOW()
),
(
  'Elegant Gray Kitchen Design',
  'Sophisticated gray cabinet installation with professional-grade finishes and contemporary styling',
  NULL,
  '/images/gallery/53H0NAM0eSvE.webp',
  'full_kitchen',
  'contemporary',
  'Kitchen',
  1,
  2,
  NOW(),
  NOW()
),
(
  'Custom Kitchen Island',
  'Beautiful custom island with extensive storage, seating area, and coordinating cabinetry',
  NULL,
  '/images/gallery/7nAUkEFBXEaf.jpg',
  'island',
  'transitional',
  'Kitchen',
  1,
  3,
  NOW(),
  NOW()
),
(
  'Traditional Wood Kitchen',
  'Classic wood cabinetry with traditional styling and timeless appeal',
  NULL,
  '/images/gallery/FbkkkCWXInZS.jpg',
  'full_kitchen',
  'traditional',
  'Kitchen',
  0,
  4,
  NOW(),
  NOW()
),
(
  'Contemporary Open Kitchen',
  'Open-concept kitchen with modern cabinetry and integrated appliances',
  NULL,
  '/images/gallery/KL9ldeZDUcbT.jpg',
  'full_kitchen',
  'modern',
  'Kitchen',
  0,
  5,
  NOW(),
  NOW()
),
(
  'Luxury Kitchen Remodel',
  'High-end kitchen featuring premium cabinetry, custom finishes, and designer hardware',
  NULL,
  '/images/gallery/RHHoKWmplcBC.jpg',
  'full_kitchen',
  'luxury',
  'Kitchen',
  1,
  6,
  NOW(),
  NOW()
),
(
  'Farmhouse Style Kitchen',
  'Charming farmhouse-style kitchen with rustic elements and practical design',
  NULL,
  '/images/gallery/bt6Vi4lpCf4B.jpg',
  'full_kitchen',
  'farmhouse',
  'Kitchen',
  0,
  7,
  NOW(),
  NOW()
),
(
  'Transitional Kitchen Design',
  'Perfectly balanced transitional design blending classic and contemporary elements',
  NULL,
  '/images/gallery/ubBFg9QkproG.jpg',
  'full_kitchen',
  'transitional',
  'Kitchen',
  0,
  8,
  NOW(),
  NOW()
);

-- Verify the insert
SELECT COUNT(*) as total_gallery_items FROM gallery;
SELECT id, title, roomType, featured, displayOrder FROM gallery ORDER BY displayOrder;
