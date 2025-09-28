import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconColor = '#387adf';

// Create a simple icon SVG template
const createIconSVG = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${iconColor}" rx="${size * 0.1}"/>
  <text x="${size / 2}" y="${size / 2 + size * 0.05}" 
        font-family="Arial, sans-serif" 
        font-size="${size * 0.3}" 
        font-weight="bold"
        fill="white" 
        text-anchor="middle" 
        dominant-baseline="middle">K</text>
</svg>`;

// Generate icons
const generateIcons = async () => {
  const iconsDir = './public/icons';
  
  // Ensure icons directory exists
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  for (const size of iconSizes) {
    try {
      const svgContent = createIconSVG(size);
      const svgBuffer = Buffer.from(svgContent);
      
      await sharp(svgBuffer)
        .png()
        .toFile(path.join(iconsDir, `icon-${size}x${size}.png`));
        
      console.log(`Generated icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`Error generating icon-${size}x${size}.png:`, error);
    }
  }
  
  console.log('All icons generated successfully!');
};

generateIcons();