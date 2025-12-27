# Top Knobs SKU Mapping Notes

## Price List Structure (TopKnobsJanuary2026PriceList.xlsx)
- **Total rows: 7,358** (matches our database!)
- **Key columns:**
  - `Item #` - The SKU code (e.g., M1, M2, M3, M5H, M5V, M6, etc.)
  - `Finish` - Finish code (e.g., PTA, OEC, GBZ, RST, PTL, DAB)
  - `Collection` - Collection name (e.g., Britannia)
  - `Catalog Page` - Page number in catalog (e.g., 69, "Not Shown")
  - `Retail` - Price (e.g., 18.30, 13.05)
  - `Description` - Full product description with size
  - `Width`, `Length`, `Projection` - Dimensions
  - `Center to Center` - For pulls
  - `Base Diameter` - For knobs
  - `Screw Size` - M4
  - `Weight` - In pounds
  - `Material` - Brass, Zinc Alloy
  - `UPC` - Barcode number

## SKU Pattern
- SKUs like M1, M2, M3... are the base product codes
- Finish codes are suffixes or separate column
- Some SKUs have letter suffixes like M5H (horizontal), M5V (vertical), M18AP

## Image Matching Strategy
Since the dealer portal shows product NAMES not SKUs, we need to:
1. Extract the product name from the Description column
2. Match to dealer portal product name
3. Download image and associate with SKU

## Example Mappings
| SKU | Description | Portal Product Name |
|-----|-------------|---------------------|
| M6 | Devon Knob 1 1/4" - Pewter Antique | Devon Knob |
| M7 | Devon Knob 1 1/4" - Old English Copper | Devon Knob |
| M10 | Empress Knob 1 3/8" - Pewter Antique | Empress Knob |

Note: Multiple SKUs share the same base product image (different finishes)
