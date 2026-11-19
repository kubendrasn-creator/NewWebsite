// scripts/scroll-perf.mjs
// Scroll Performance Profiler using chrome-launcher + Puppeteer-core
// Opens page at 1440x900 viewport, wheel-scrolls over ~12s, samples rAF deltas,
// and outputs p50/p95, % >16.7ms, % >33ms, and section breakdown.
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

function createStaticServer(port = 4321) {
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
    server.listen(port, () => resolve(server));
  });
}

async function runScrollPerf() {
  console.log('🚀 Starting local preview server on port 4321...');
  const server = await createStaticServer(4321);

  const userDataDir = path.resolve(__dirname, '../.chrome-scroll-profile');
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
  }

  console.log('🌐 Launching Chrome at 1440x900...');
  const chrome = await chromeLauncher.launch({
    chromePath,
    chromeFlags: [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      `--user-data-dir=${userDataDir}`,
      '--window-size=1440,900',
    ],
  });

  const browser = await puppeteer.connect({
    browserURL: `http://localhost:${chrome.port}`,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('📄 Navigating to http://localhost:4321/NewWebsite/ ...');
  await page.goto('http://localhost:4321/NewWebsite/', { waitUntil: 'networkidle0' });

  // Wait for initial hydration & fonts
  await new Promise((r) => setTimeout(r, 1500));

  console.log('⏱️  Injecting rAF frame delta sampler...');
  await page.evaluate(() => {
    window.__perfData = {
      deltas: [],
      longFrames: [],
      sectionsHit: {},
    };

    let lastTime = performance.now();
    let isSampling = true;

    function sample(now) {
      if (!isSampling) return;
      const delta = now - lastTime;
      lastTime = now;
      window.__perfData.deltas.push(delta);

      if (delta > 33.3) {
        const sections = ['top', 'pillars', 'services', 'delivery', 'why-apt', 'about', 'careers', 'contact'];
        let activeSection = 'top';
        for (const secId of sections) {
          const el = document.getElementById(secId);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= 0) {
              activeSection = secId;
            }
          }
        }
        window.__perfData.longFrames.push({
          delta: Math.round(delta * 10) / 10,
          section: activeSection,
        });
        window.__perfData.sectionsHit[activeSection] = (window.__perfData.sectionsHit[activeSection] || 0) + 1;
      }

      requestAnimationFrame(sample);
    }

    requestAnimationFrame(sample);
    window.__stopSampling = () => { isSampling = false; };
  });

  console.log('📜 Smooth wheel-scrolling page over ~12s...');
  const totalScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);

  const durationMs = 12000;
  const steps = 180;
  const stepInterval = durationMs / steps;
  const scrollIncrement = totalScroll / steps;

  for (let i = 0; i < steps; i++) {
    await page.evaluate((inc) => {
      window.scrollBy({ top: inc, behavior: 'auto' });
    }, scrollIncrement);
    await new Promise((r) => setTimeout(r, stepInterval));
  }

  await new Promise((r) => setTimeout(r, 600));

  const results = await page.evaluate(() => {
    window.__stopSampling();
    // Drop first 5 warmup frames
    const deltas = window.__perfData.deltas.slice(5);
    deltas.sort((a, b) => a - b);

    const count = deltas.length;
    if (count === 0) return null;

    const p50 = deltas[Math.floor(count * 0.5)];
    const p95 = deltas[Math.floor(count * 0.95)];
    const p99 = deltas[Math.floor(count * 0.99)];

    const over16 = deltas.filter((d) => d > 16.7).length;
    const over33 = deltas.filter((d) => d > 33.3).length;

    return {
      totalFrames: count,
      p50: Math.round(p50 * 10) / 10,
      p95: Math.round(p95 * 10) / 10,
      p99: Math.round(p99 * 10) / 10,
      pctOver16: Math.round((over16 / count) * 1000) / 10,
      pctOver33: Math.round((over33 / count) * 1000) / 10,
      longFramesCount: window.__perfData.longFrames.length,
      sectionsWithLongFrames: window.__perfData.sectionsHit,
    };
  });

  await browser.close();
  await chrome.kill();
  server.close();

  console.log('\n=============================================');
  console.log('       SCROLL PERFORMANCE REPORT (1440x900)   ');
  console.log('=============================================');
  console.log(`Total Frames Sampled : ${results.totalFrames}`);
  console.log(`p50 Frame Time       : ${results.p50} ms`);
  console.log(`p95 Frame Time       : ${results.p95} ms (Target: <= 20 ms)`);
  console.log(`p99 Frame Time       : ${results.p99} ms`);
  console.log(`% Frames > 16.7 ms   : ${results.pctOver16} %`);
  console.log(`% Frames > 33.3 ms   : ${results.pctOver33} % (Target: < 3 %)`);
  console.log(`Slow Frames Count    : ${results.longFramesCount}`);
  console.log('Slow Frames by Section:');
  console.table(results.sectionsWithLongFrames);
  console.log('Note: Headless Chrome is only a proxy; real GPU composite is typically faster.');
  console.log('=============================================\n');

  fs.writeFileSync(
    path.resolve(__dirname, '../scroll-perf-result.json'),
    JSON.stringify(results, null, 2)
  );

  return results;
}

runScrollPerf().catch((err) => {
  console.error(err);
  process.exit(1);
});
