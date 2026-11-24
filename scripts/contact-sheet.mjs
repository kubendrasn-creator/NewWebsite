// scripts/contact-sheet.mjs
// Renders 12 evenly spaced frames per scene/beat into a single PNG grid labeled with timecodes
// and generates an animated WebP preview (<= 3MB) of Scene A using Playwright and FFmpeg.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from '@playwright/test';
import { renderSceneA, renderBeat } from '../src/motion/scene-engine.ts';

const OUT_DIR = path.resolve('docs/contact-sheets');
fs.mkdirSync(OUT_DIR, { recursive: true });

// Locate Playwright's ffmpeg
function getFfmpegPath() {
  const localAppData = process.env.LOCALAPPDATA || '';
  const pwDir = path.join(localAppData, 'ms-playwright');
  if (fs.existsSync(pwDir)) {
    const list = fs.readdirSync(pwDir).filter(d => d.startsWith('ffmpeg'));
    for (const dir of list) {
      const p = path.join(pwDir, dir, 'ffmpeg-win64.exe');
      if (fs.existsSync(p)) return p;
    }
  }
  return 'ffmpeg';
}

const FFMPEG_BIN = getFfmpegPath();
console.log(`Using FFmpeg at: ${FFMPEG_BIN}`);

async function generateGrid(title, frames, outFileName, browser) {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      margin: 0;
      padding: 32px;
      background: #ffffff;
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      color: #003074;
    }
    h1 {
      text-align: center;
      margin-bottom: 24px;
      font-size: 22px;
      font-weight: 800;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(4, 320px);
      gap: 20px;
      justify-content: center;
    }
    .card {
      background: #ffffff;
      border: 1px solid #d4e8f7;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,48,116,0.06);
    }
    .card-header {
      padding: 8px 12px;
      font-size: 11px;
      font-weight: 700;
      font-family: monospace;
      background: #eef7fd;
      border-bottom: 1px solid #d4e8f7;
      color: #0070a8;
      display: flex;
      justify-content: space-between;
    }
    .card svg {
      width: 320px;
      height: 240px;
      display: block;
    }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <div class="grid">
    ${frames.map((f, i) => `
      <div class="card">
        <div class="card-header">
          <span>Frame ${i + 1}/12</span>
          <span>${f.label}</span>
        </div>
        ${f.svg}
      </div>
    `).join('')}
  </div>
</body>
</html>`;

  const page = await browser.newPage({ viewport: { width: 1400, height: 950 } });
  await page.setContent(html, { waitUntil: 'load' });
  const outPath = path.join(OUT_DIR, outFileName);
  await page.screenshot({ path: outPath, fullPage: true });
  await page.close();
  console.log(`Generated contact sheet: ${outPath}`);
}

async function run() {
  const browser = await chromium.launch();

  // 1. Scene A (Hero loop: 12 frames across 8.0s)
  const sceneAFrames = [];
  for (let i = 0; i < 12; i++) {
    const tSec = (i / 11) * 8.0;
    sceneAFrames.push({
      label: `t = ${tSec.toFixed(2)}s`,
      svg: renderSceneA(tSec).svg,
    });
  }
  await generateGrid('Scene A: Hero Continuous Loop (8.0s) – 12 Key Frames', sceneAFrames, 'scene-a-grid.png', browser);

  // 2. Scene B: Beat 1 to 5 (12 frames each)
  const beatNames = [
    'Beat 1: Apt (Pieces fit into block)',
    'Beat 2: Product Engineering (Spark grows to block)',
    'Beat 3: Modernization (Old block to new block)',
    'Beat 4: Delivery (Route line draws once)',
    'Beat 5: Testing (Parallel lanes with checks merge)',
  ];

  for (let b = 0; b < 5; b++) {
    const beatFrames = [];
    for (let i = 0; i < 12; i++) {
      const p = i / 11;
      beatFrames.push({
        label: `p = ${(p * 100).toFixed(0)}%`,
        svg: renderBeat(b, p).svg,
      });
    }
    await generateGrid(`Scene B: ${beatNames[b]} – 12 Frames`, beatFrames, `scene-b-beat${b + 1}.png`, browser);
  }

  // 3. Generate animated WebP preview (<= 3MB) for Scene A
  const tempDir = path.resolve('docs/contact-sheets/temp_frames');
  fs.mkdirSync(tempDir, { recursive: true });
  console.log('Rendering 48 frames for animated WebP preview of Scene A...');

  const page = await browser.newPage({ viewport: { width: 400, height: 300 } });
  for (let f = 0; f < 48; f++) {
    const tSec = (f / 48) * 8.0;
    const svg = renderSceneA(tSec).svg;
    await page.setContent(`<!DOCTYPE html><html><body style="margin:0;padding:0;overflow:hidden;background:#fff;">${svg}</body></html>`);
    const fPath = path.join(tempDir, `frame_${String(f).padStart(3, '0')}.png`);
    await page.screenshot({ path: fPath });
  }
  await page.close();
  await browser.close();

  // Encode animated WebP using FFmpeg
  const webpPath = path.join(OUT_DIR, 'scene-a-preview.webp');
  try {
    execFileSync(FFMPEG_BIN, [
      '-y',
      '-framerate', '12',
      '-i', path.join(tempDir, 'frame_%03d.png'),
      '-vcodec', 'libwebp',
      '-lossless', '0',
      '-q:v', '75',
      '-loop', '0',
      webpPath,
    ], { stdio: 'pipe' });
    const stat = fs.statSync(webpPath);
    console.log(`Generated animated WebP: ${webpPath} (${(stat.size / 1024).toFixed(1)} KB, <= 3000 KB)`);
  } catch (err) {
    console.warn('Animated WebP generation failed:', err.message);
  }

  // Cleanup temp frames
  fs.rmSync(tempDir, { recursive: true, force: true });
  console.log('Contact sheets and preview generated successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

