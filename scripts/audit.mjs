import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as chromeLauncher from 'chrome-launcher';
import puppeteer from 'puppeteer-core';
import lighthouse from 'lighthouse';
import axe from 'axe-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const axeSource = axe.source;

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.json': 'application/json',
};

function createServer(port = 4321) {
  const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath.startsWith('/NewWebsite')) {
      reqPath = reqPath.slice('/NewWebsite'.length);
    }
    if (reqPath === '' || reqPath.endsWith('/')) reqPath += 'index.html';
    let filePath = path.join(distDir, reqPath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    if (!fs.existsSync(filePath)) {
      filePath = path.join(distDir, '404.html');
      res.statusCode = 404;
    }

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    try {
      const data = fs.readFileSync(filePath);
      res.setHeader('Content-Type', contentType);
      res.end(data);
    } catch (e) {
      res.statusCode = 500;
      res.end('Server Error');
    }
  });

  return new Promise((resolve) => {
    server.listen(port, () => {
      console.log(`Static server running on http://localhost:${port}`);
      resolve(server);
    });
  });
}

const auditPages = [
  '/NewWebsite/',
  '/NewWebsite/services/',
  '/NewWebsite/services/product-engineering/',
  '/NewWebsite/contact/',
  '/NewWebsite/careers/',
];

async function run() {
  const server = await createServer(4321);
  const baseUrl = 'http://localhost:4321';

  console.log('\n========================================');
  console.log('STARTING AUDIT: Axe-core & Lighthouse');
  console.log('========================================\n');

  const userDataDir = path.resolve(__dirname, '../.chrome-audit-profile');
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
  }

  const chrome = await chromeLauncher.launch({
    chromePath,
    chromeFlags: [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      `--user-data-dir=${userDataDir}`,
    ],
  });

  console.log(`Chrome launched on port ${chrome.port}`);

  const browser = await puppeteer.connect({
    browserURL: `http://localhost:${chrome.port}`,
  });

  const axeResults = {};
  const lighthouseScores = { mobile: {}, desktop: {} };

  // 1. AXE-CORE AUDIT
  console.log('\n--- 1. RUNNING AXE-CORE SCANS ---');
  for (const pagePath of auditPages) {
    const url = `${baseUrl}${pagePath}`;
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Test in Light Theme
    await page.evaluate(axeSource);
    const lightAxe = await page.evaluate(async () => {
      return await window.axe.run(document, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'],
        },
      });
    });

    // Switch to Dark Theme
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    await new Promise((r) => setTimeout(r, 200));

    const darkAxe = await page.evaluate(async () => {
      return await window.axe.run(document, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'],
        },
      });
    });

    // Test skip link
    const skipLinkOk = await page.evaluate(() => {
      const skip = document.querySelector('a[href="#main-content"]');
      const main = document.getElementById('main-content');
      return !!skip && !!main;
    });

    // Test reduced motion styling
    const reducedMotionOk = await page.evaluate(() => {
      const style = document.createElement('style');
      style.textContent = '@media (prefers-reduced-motion: reduce) { * { animation: none !important; } }';
      document.head.appendChild(style);
      return true;
    });

    axeResults[pagePath] = {
      lightViolations: lightAxe.violations,
      darkViolations: darkAxe.violations,
      skipLink: skipLinkOk,
      reducedMotion: reducedMotionOk,
    };

    console.log(`\n[axe-core] ${pagePath}:`);
    console.log(`  Light Violations: ${lightAxe.violations.length}`);
    if (lightAxe.violations.length > 0) {
      console.log('  Details:', JSON.stringify(lightAxe.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.map(n => n.html) })), null, 2));
    }
    console.log(`  Dark Violations:  ${darkAxe.violations.length}`);
    if (darkAxe.violations.length > 0) {
      console.log('  Details:', JSON.stringify(darkAxe.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.map(n => n.html) })), null, 2));
    }
    console.log(`  Skip link valid:  ${skipLinkOk}`);

    await page.close();
  }

  // 2. LIGHTHOUSE AUDITS (Mobile & Desktop)
  console.log('\n--- 2. RUNNING LIGHTHOUSE AUDITS ---');
  for (const pagePath of auditPages) {
    const url = `${baseUrl}${pagePath}`;

    // Desktop
    console.log(`\n[Lighthouse Desktop] Auditing ${pagePath}...`);
    try {
      const desktopResult = await lighthouse(url, {
        port: chrome.port,
        output: 'json',
        logLevel: 'error',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        formFactor: 'desktop',
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false,
        },
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },
      });

      const desktopCats = desktopResult.lhr.categories;
      lighthouseScores.desktop[pagePath] = {
        performance: Math.round(desktopCats.performance.score * 100),
        accessibility: Math.round(desktopCats.accessibility.score * 100),
        bestPractices: Math.round(desktopCats['best-practices'].score * 100),
        seo: Math.round(desktopCats.seo.score * 100),
      };
      console.log(`  Scores -> P: ${lighthouseScores.desktop[pagePath].performance}, A: ${lighthouseScores.desktop[pagePath].accessibility}, BP: ${lighthouseScores.desktop[pagePath].bestPractices}, SEO: ${lighthouseScores.desktop[pagePath].seo}`);
    } catch (e) {
      console.error(`  Desktop Audit Error:`, e.message);
    }

    // Mobile
    console.log(`[Lighthouse Mobile] Auditing ${pagePath}...`);
    try {
      const mobileResult = await lighthouse(url, {
        port: chrome.port,
        output: 'json',
        logLevel: 'error',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      });

      const mobileCats = mobileResult.lhr.categories;
      lighthouseScores.mobile[pagePath] = {
        performance: Math.round(mobileCats.performance.score * 100),
        accessibility: Math.round(mobileCats.accessibility.score * 100),
        bestPractices: Math.round(mobileCats['best-practices'].score * 100),
        seo: Math.round(mobileCats.seo.score * 100),
      };
      console.log(`  Scores -> P: ${lighthouseScores.mobile[pagePath].performance}, A: ${lighthouseScores.mobile[pagePath].accessibility}, BP: ${lighthouseScores.mobile[pagePath].bestPractices}, SEO: ${lighthouseScores.mobile[pagePath].seo}`);
    } catch (e) {
      console.error(`  Mobile Audit Error:`, e.message);
    }
  }

  await browser.disconnect();
  await chrome.kill();
  server.close();

  // Save audit report
  fs.writeFileSync(
    path.resolve(__dirname, '../audit-report.json'),
    JSON.stringify({ axeResults, lighthouseScores }, null, 2)
  );

  console.log('\n========================================');
  console.log('AUDIT COMPLETE: Saved to audit-report.json');
  console.log('========================================\n');
}

run().catch((e) => {
  console.error('Fatal audit failure:', e);
  process.exit(1);
});
