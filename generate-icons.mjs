import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Use the HD Kite app icon as source
const sourceIconPath = './public/icons/zerodha-kite-app-icon-hd.png';

// Generate icons
const generateIcons = async () => {
  const iconsDir = './public/icons';
  
  // Ensure icons directory exists
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  // Check if source icon exists
  if (!fs.existsSync(sourceIconPath)) {
    console.error(`Source icon not found: ${sourceIconPath}`);
    return;
  }

  for (const size of iconSizes) {
    try {
      await sharp(sourceIconPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 } // Transparent background
        })
        .png()
        .toFile(path.join(iconsDir, `icon-${size}x${size}.png`));
        
      console.log(`Generated icon-${size}x${size}.png from HD source`);
    } catch (error) {
      console.error(`Error generating icon-${size}x${size}.png:`, error);
    }
  }
  
  console.log('All icons generated successfully from HD source!');
};

generateIcons();