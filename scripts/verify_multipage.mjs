// scripts/verify_multipage.mjs
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as chromeLauncher from 'chrome-launcher';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

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

function createStaticServer(port = 4322) {
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
    } catch {
      res.statusCode = 500;
      res.end('Server Error');
    }
  });

  return new Promise((resolve) => {
    server.listen(port, () => {
      resolve(server);
    });
  });
}

async function run() {
  const server = await createStaticServer(4322);
  const baseUrl = 'http://localhost:4322/NewWebsite';

  const chrome = await chromeLauncher.launch({
    chromePath,
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
  });

  const browser = await puppeteer.connect({
    browserURL: `http://localhost:${chrome.port}`,
  });

  const page = await browser.newPage();

  console.log('\n--- 1. Testing Viewport Centering Across Resolutions ---');
  const viewports = [
    { width: 1366, height: 768 },
    { width: 1440, height: 900 },
    { width: 1920, height: 1080 },
    { width: 2560, height: 1440 },
  ];

  for (const vp of viewports) {
    await page.setViewport(vp);
    await page.goto(`${baseUrl}/why-apt/`, { waitUntil: 'networkidle0' });
    const centering = await page.evaluate(() => {
      const scene = document.querySelector('.scene-full');
      const box = document.querySelector('.scene-content-box');
      if (!scene || !box) return null;
      const sRect = scene.getBoundingClientRect();
      const bRect = box.getBoundingClientRect();
      const sCenter = sRect.top + sRect.height / 2;
      const bCenter = bRect.top + bRect.height / 2;
      return {
        sceneH: sRect.height,
        boxH: bRect.height,
        deltaCenter: Math.abs(sCenter - bCenter),
      };
    });
    console.log(`Viewport ${vp.width}x${vp.height}: Scene height = ${centering?.sceneH}px, center delta = ${centering?.deltaCenter.toFixed(1)}px`);
  }

  console.log('\n--- 2. Testing Bug Fix A: Independently Expandable Accordion on /about/ ---');
  await page.goto(`${baseUrl}/about/`, { waitUntil: 'networkidle0' });
  const accordionResult = await page.evaluate(async () => {
    const buttons = Array.from(document.querySelectorAll('.benefit-card-toggle'));
    const panels = buttons.map(b => document.getElementById(b.getAttribute('aria-controls')));

    // Initially all closed
    const initialStates = buttons.map(b => b.getAttribute('aria-expanded'));

    // Click Card 0
    buttons[0].click();
    await new Promise(r => setTimeout(r, 400));
    const card0OpenState = buttons.map(b => b.getAttribute('aria-expanded'));
    const card0PanelOpen = panels[0].classList.contains('is-open');

    // Click Card 1 without closing Card 0 (both should be open)
    buttons[1].click();
    await new Promise(r => setTimeout(r, 400));
    const bothOpenState = buttons.map(b => b.getAttribute('aria-expanded'));

    // Close Card 0 (Card 1 remains open)
    buttons[0].click();
    await new Promise(r => setTimeout(r, 400));
    const card0ClosedCard1Open = buttons.map(b => b.getAttribute('aria-expanded'));

    return {
      totalCards: buttons.length,
      initialStates,
      card0OpenState,
      card0PanelOpen,
      bothOpenState,
      card0ClosedCard1Open,
    };
  });
  console.log('Accordion test result:', JSON.stringify(accordionResult, null, 2));

  console.log('\n--- 3. Testing Navigation & Direction Attributes ---');
  // Navigate from Home -> Services
  await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle0' });
  const homeToServices = await page.evaluate(async () => {
    const servicesLink = document.querySelector('header a[href*="/services"]');
    servicesLink.click();
    await new Promise(r => setTimeout(r, 600));
    return {
      pathname: window.location.pathname,
      direction: document.documentElement.getAttribute('data-direction'),
    };
  });
  console.log('Nav Home -> Services:', homeToServices);

  console.log('\n--- 4. Testing Cursor Singleton ---');
  const cursorCheck = await page.evaluate(() => {
    const dots = document.querySelectorAll('#cursor-dot');
    const rings = document.querySelectorAll('#cursor-ring');
    return {
      dotsCount: dots.length,
      ringsCount: rings.length,
    };
  });
  console.log('Cursor Singleton Count:', cursorCheck);

  await page.close();
  await browser.close();
  await chrome.kill();
  server.close();
  console.log('\nVerification complete!');
}

run().catch(console.error);
