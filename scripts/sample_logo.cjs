const fs = require('fs');
const puppeteer = require('puppeteer-core');
const chromeLauncher = require('chrome-launcher');

async function main() {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const browser = await puppeteer.connect({ browserURL: `http://localhost:${chrome.port}` });
  const page = await browser.newPage();
  
  const logoBase64 = fs.readFileSync('public/main_logo2.png').toString('base64');
  const html = `
    <html>
      <body>
        <canvas id="c"></canvas>
        <script>
          const img = new Image();
          img.src = "data:image/png;base64,${logoBase64}";
          img.onload = () => {
            const canvas = document.getElementById('c');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const imgData = ctx.getImageData(0, 0, img.width, img.height).data;
            const colorCounts = {};
            for (let i = 0; i < imgData.length; i += 4) {
              const r = imgData[i];
              const g = imgData[i+1];
              const b = imgData[i+2];
              const a = imgData[i+3];
              if (a > 50) {
                // Ignore pure white or transparent
                if (r > 245 && g > 245 && b > 245) continue;
                const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
                colorCounts[hex] = (colorCounts[hex] || 0) + 1;
              }
            }
            const sorted = Object.entries(colorCounts).sort((a,b) => b[1] - a[1]);
            window.topColors = sorted.slice(0, 20);
          };
        </script>
      </body>
    </html>
  `;
  await page.setContent(html);
  await new Promise(r => setTimeout(r, 1000));
  const colors = await page.evaluate(() => window.topColors);
  console.log('Top Logo Colors:');
  console.log(colors);
  
  await browser.close();
  await chrome.kill();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
