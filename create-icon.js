// Simple script to create placeholder SVG icons
const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, 'public', 'icons');

// Ensure the directory exists
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// Create a simple SVG icon
function createSvgIcon(size, color = '#ef4444') {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${color}" />
  <circle cx="${size/2}" cy="${size/2}" r="${size/4}" fill="white" />
  <text x="${size/2}" y="${size/2 + 5}" font-family="Arial" font-size="${size/8}" fill="${color}" text-anchor="middle">FP</text>
</svg>`;
}

// Create icons of different sizes
const sizes = [192, 512];

sizes.forEach(size => {
  const iconPath = path.join(ICONS_DIR, `icon-${size}x${size}.svg`);
  fs.writeFileSync(iconPath, createSvgIcon(size));
  console.log(`Created icon: ${iconPath}`);
});

console.log('Icon creation complete!'); 