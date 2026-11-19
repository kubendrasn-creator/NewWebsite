const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const astroDir = 'dist/_astro';
if (!fs.existsSync(astroDir)) {
  console.log('No _astro dir found');
  process.exit(1);
}

const files = fs.readdirSync(astroDir);
const jsFiles = files.filter(f => f.endsWith('.js'));

console.log('=== CLIENT JS ASSETS IN DIST ===');
let totalRaw = 0;
let totalGzip = 0;

jsFiles.forEach(file => {
  const filePath = path.join(astroDir, file);
  const content = fs.readFileSync(filePath);
  const rawSize = content.length;
  const gzipSize = zlib.gzipSync(content).length;
  totalRaw += rawSize;
  totalGzip += gzipSize;
  console.log(`${file.padEnd(45)}: ${(rawSize / 1024).toFixed(2)} KB (raw), ${(gzipSize / 1024).toFixed(2)} KB (gzip)`);
});

console.log('----------------------------------------------------');
console.log(`TOTAL JS BUNDLE ACROSS ALL ISLANDS: ${(totalRaw / 1024).toFixed(2)} KB (raw), ${(totalGzip / 1024).toFixed(2)} KB (gzip)`);
