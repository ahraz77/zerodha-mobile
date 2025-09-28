import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Read the Kite logo SVG
const kiteLogoPath = './public/icons/kite-logo.svg';
const kiteLogoSVG = fs.readFileSync(kiteLogoPath, 'utf8');

// Create icon SVG template with Kite logo
const createIconSVG = (size) => {
  const padding = size * 0.15; // 15% padding
  const logoSize = size - (padding * 2);
  
  return `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#ffffff" rx="${size * 0.15}"/>
  <g transform="translate(${padding}, ${padding}) scale(${logoSize/90})">
    <defs><style>.cls-1{fill:#f6461a;}.cls-2{fill:#db342c;}</style></defs>
    <polygon class="cls-1" points="30 0 0 30 30 60 60 30 90 0 30 0"/>
    <polygon class="cls-2" points="30 60 60 30 90 60 30 60"/>
  </g>
</svg>`;
};

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