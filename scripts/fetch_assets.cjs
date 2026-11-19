const https = require('https');
const fs = require('fs');
const path = require('path');

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('Failed ' + res.statusCode + ' for ' + url));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', reject);
  });
}

async function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchText(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  if (!fs.existsSync('scripts/live_css')) {
    fs.mkdirSync('scripts/live_css', { recursive: true });
  }
  console.log('Fetching live home page...');
  const html = await fetchText('https://aptinfosoft.com/');
  fs.writeFileSync('scripts/live_css/index.html', html);
  console.log('Saved index.html');

  // Find linked css
  const cssMatches = [...html.matchAll(/href=["']([^"']+\.css[^"']*)["']/g)].map(m => m[1]);
  console.log('Found CSS links:', cssMatches);
  for (const cssUrl of cssMatches) {
    const full = cssUrl.startsWith('http') ? cssUrl : 'https://aptinfosoft.com/' + cssUrl.replace(/^\//, '');
    try {
      const cssContent = await fetchText(full);
      const filename = path.basename(cssUrl.split('?')[0]);
      fs.writeFileSync(path.join('scripts/live_css', filename), cssContent);
      console.log('Saved', filename, 'from', full);
    } catch(e) {
      console.error('Error fetching', cssUrl, e.message);
    }
  }

  // Also check if there's any style tag in html
  // Download images to public/ and src/assets/
  if (!fs.existsSync('src/assets')) {
    fs.mkdirSync('src/assets', { recursive: true });
  }
  const images = ['1.jpg', '2.jpg', '3.jpg', 'main_logo2.png'];
  for (const img of images) {
    const publicDest = path.join('public', img);
    const assetDest = path.join('src/assets', img);
    try {
      await download('https://aptinfosoft.com/images/' + img, publicDest);
      fs.copyFileSync(publicDest, assetDest);
      console.log('Downloaded', img, 'to public/ and src/assets/');
    } catch(e) {
      console.error('Error downloading', img, e.message);
    }
  }
}

main().catch(err => { console.error(err); process.exit(1); });
