-- Sample products to understand structure
SELECT sku, name, description, finish, collection
FROM products
WHERE sku IN ('M371', 'M372', 'M373', 'M376', 'M377', 'M378')
LIMIT 10;

-- Count discontinued products
SELECT COUNT(*) as discontinued_count
FROM products
WHERE description LIKE '%DISCONTINUED%';

-- Check finish abbreviations used
SELECT DISTINCT finish
FROM products
ORDER BY finish
LIMIT 50;

-- Check if products share base names
SELECT 
  SUBSTRING_INDEX(name, ' - ', 1) as base_name,
  COUNT(*) as variant_count,
  GROUP_CONCAT(DISTINCT finish ORDER BY finish) as finishes
FROM products
GROUP BY base_name
HAVING variant_count > 1
ORDER BY variant_count DESC
LIMIT 20;
