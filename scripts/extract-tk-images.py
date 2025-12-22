#!/usr/bin/env python3
"""
Extract product images from Top Knobs PDF catalog
"""
import os
import sys
from pdf2image import convert_from_path
from PIL import Image
import re

def extract_images_from_pdf(pdf_path, output_dir):
    """Extract images from PDF pages"""
    print(f"Processing PDF: {pdf_path}")
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Convert PDF pages to images
    print("Converting PDF pages to images...")
    pages = convert_from_path(pdf_path, dpi=150)
    
    print(f"Extracted {len(pages)} pages from PDF")
    
    # Save each page as an image
    for i, page in enumerate(pages):
        output_path = os.path.join(output_dir, f"catalog_page_{i+1:04d}.jpg")
        page.save(output_path, "JPEG", quality=85)
        print(f"Saved page {i+1}/{len(pages)}: {output_path}")
    
    return len(pages)

if __name__ == "__main__":
    pdf_path = "/home/ubuntu/upload/TK_2026_Catalog.pdf"
    output_dir = "/home/ubuntu/critzers-quote-system/temp/tk_catalog_pages"
    
    if not os.path.exists(pdf_path):
        print(f"Error: PDF not found at {pdf_path}")
        sys.exit(1)
    
    pages_extracted = extract_images_from_pdf(pdf_path, output_dir)
    print(f"\nCompleted! Extracted {pages_extracted} pages to {output_dir}")
