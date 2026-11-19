const fs = require('fs');
const path = require('path');

function extractHexColors(cssText, filename) {
  const lines = cssText.split('\n');
  const results = [];
  let currentSelector = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.includes('{')) {
      currentSelector = line.split('{')[0].trim();
    }
    const colorMatches = line.match(/(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))/g);
    if (colorMatches) {
      for (const col of colorMatches) {
        results.push({
          file: filename,
          selector: currentSelector || 'root',
          line: line,
          color: col.toLowerCase()
        });
      }
    }
  }
  return results;
}

const lightBlue = fs.readFileSync('scripts/live_css/light-blue.css', 'utf8');
const styleCss = fs.readFileSync('scripts/live_css/style.css', 'utf8');

console.log('=== LIGHT-BLUE.CSS COLORS ===');
const lbColors = extractHexColors(lightBlue, 'css/skins/light-blue.css');
const uniqueLb = [...new Set(lbColors.map(c => c.color))];
console.log('Unique colors in light-blue.css:', uniqueLb);

// Detailed occurrences in light-blue.css
lbColors.slice(0, 30).forEach(c => {
  console.log(`${c.color.padEnd(10)} | ${c.file.padEnd(25)} | ${c.selector.padEnd(30)} | ${c.line}`);
});

console.log('\n=== STYLE.CSS PRIMARY/ACCENT OCCURRENCES ===');
const styleColors = extractHexColors(styleCss, 'css/style.css');
const brandColorsInStyle = styleColors.filter(c => c.color.startsWith('#007') || c.color.startsWith('#00a') || c.color.startsWith('#006') || c.color.startsWith('#005') || c.color.startsWith('#1') || c.color.startsWith('#2'));
console.log('Brand-like colors in style.css:', [...new Set(brandColorsInStyle.map(c => c.color))]);

// Also examine image stats
const img1 = fs.statSync('public/1.jpg');
const img2 = fs.statSync('public/2.jpg');
const img3 = fs.statSync('public/3.jpg');
const logo = fs.statSync('public/main_logo2.png');
console.log('\n=== IMAGES STATS ===');
console.log('1.jpg size:', img1.size);
console.log('2.jpg size:', img2.size);
console.log('3.jpg size:', img3.size);
console.log('main_logo2.png size:', logo.size);
