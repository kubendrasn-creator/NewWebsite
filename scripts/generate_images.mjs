// scripts/generate_images.mjs
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public');

async function generate() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 1. Generate Favicon SVG (logo's signature 'i' motif: slanted body + dot)
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="16" fill="#0070a8"/>
  <circle cx="39" cy="14" r="5" fill="#eef7fd"/>
  <path d="M25 46L36 22H44L33 46H25Z" fill="#ffffff"/>
</svg>`;
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg, 'utf8');
  console.log('Generated public/favicon.svg');

  // 2. Render Favicon PNGs from SVG
  await page.setContent(`<!DOCTYPE html><html><body style="margin:0;padding:0;display:flex;align-items:center;justify-content:center;background:transparent;">${faviconSvg}</body></html>`);

  // 16x16
  await page.setViewportSize({ width: 16, height: 16 });
  await page.screenshot({ path: path.join(publicDir, 'favicon-16x16.png'), omitBackground: true });
  console.log('Generated public/favicon-16x16.png');

  // 32x32
  await page.setViewportSize({ width: 32, height: 32 });
  await page.screenshot({ path: path.join(publicDir, 'favicon-32x32.png'), omitBackground: true });
  console.log('Generated public/favicon-32x32.png');

  // 180x180 (Apple Touch Icon)
  await page.setViewportSize({ width: 180, height: 180 });
  await page.screenshot({ path: path.join(publicDir, 'apple-touch-icon.png'), omitBackground: true });
  console.log('Generated public/apple-touch-icon.png');

  // 3. Render 1200x630 OG Image (PNG) with brand tokens, logo, and tagline "Apt, Agile and Assured Solutions"
  const logoDataUri = 'data:image/png;base64,' + fs.readFileSync(path.join(publicDir, 'logo.png')).toString('base64');
  
  const ogHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1200px;
      height: 630px;
      background: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #003074;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 72px 88px;
      position: relative;
      overflow: hidden;
    }
    .ice-bg {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 90% 15%, rgba(0, 136, 204, 0.08) 0%, transparent 60%),
                  radial-gradient(circle at 10% 85%, rgba(0, 112, 168, 0.06) 0%, transparent 50%),
                  #ffffff;
      z-index: 1;
    }
    .border-frame {
      position: absolute;
      inset: 24px;
      border: 2px solid #d4e8f7;
      border-radius: 28px;
      pointer-events: none;
      z-index: 2;
    }
    .content {
      position: relative;
      z-index: 3;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .logo-img {
      height: 52px;
      width: auto;
      object-fit: contain;
    }
    .domain-badge {
      padding: 8px 18px;
      border-radius: 9999px;
      background: #eef7fd;
      border: 1px solid #d4e8f7;
      color: #0070a8;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .main {
      margin-top: 36px;
    }
    .tagline-eyebrow {
      color: #0070a8;
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    .hero-title {
      font-size: 58px;
      font-weight: 900;
      line-height: 1.08;
      letter-spacing: -0.03em;
      color: #003074;
      max-width: 900px;
    }
    .hero-title span {
      color: #0088cc;
    }
    .subhead {
      margin-top: 18px;
      font-size: 22px;
      color: rgba(0, 48, 116, 0.82);
      line-height: 1.4;
      max-width: 820px;
    }
    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 28px;
      border-top: 1px solid #d4e8f7;
    }
    .services-pill {
      display: flex;
      gap: 16px;
      font-size: 14px;
      font-weight: 700;
      color: #0070a8;
    }
    .location {
      font-size: 14px;
      font-weight: 700;
      color: #003074;
    }
  </style>
</head>
<body>
  <div class="ice-bg"></div>
  <div class="border-frame"></div>
  <div class="content header">
    <img class="logo-img" src="${logoDataUri}" alt="Apt Infosoft" />
    <div class="domain-badge">Global Delivery Model</div>
  </div>
  <div class="content main">
    <div class="tagline-eyebrow">Apt, Agile and Assured Solutions</div>
    <h1 class="hero-title">Engineering software that fits your business, <span>built to last.</span></h1>
    <p class="subhead">Product engineering, custom application development, cloud SaaS, modernization, QA & testing, and analytics for SMEs.</p>
  </div>
  <div class="content footer">
    <div class="services-pill">
      <span>Product Engineering</span> •
      <span>Custom Apps</span> •
      <span>Cloud SaaS</span> •
      <span>Modernization</span> •
      <span>Testing & QA</span>
    </div>
    <div class="location">Bengaluru, India • Atlanta, USA</div>
  </div>
</body>
</html>`;

  await page.setViewportSize({ width: 1200, height: 630 });
  await page.setContent(ogHtml, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(publicDir, 'og-image.png'), type: 'png' });
  console.log('Generated public/og-image.png (1200x630)');

  await browser.close();
  console.log('All image assets generated successfully!');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
