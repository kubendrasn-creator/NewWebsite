// scripts/generate_storyboard_preview.mjs
// Generates SVG key-frame thumbnails using strict geometric primitives
// (snap to 8px grid, slant by exactly 8 degrees, brand tokens only)
// and renders docs/contact-sheets/storyboard-preview.png via Playwright.

import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const OUT_DIR = path.resolve('docs/contact-sheets');
fs.mkdirSync(OUT_DIR, { recursive: true });

// ── 1. Brand Tokens & Derived Palette ───────────────────────────────────────
const TOKENS = {
  navy: '#003074',
  blueInk: '#0070a8',
  blue: '#0088cc',
  white: '#ffffff',
  lightTint: '#d6effb', // color-mix(in srgb, #0088cc 16%, #ffffff)
};

// ── 2. Geometric Primitives ────────────────────────────────────────────────
// Grid snap helper
export function snap(val, grid = 8) {
  return Math.round(val / grid) * grid;
}

// 8-degree forward slant helper
// theta = 8 deg => tan(8 deg) = 0.140540838
const TAN_8_DEG = Math.tan((8 * Math.PI) / 180);

export function slantRect(x, y, w, h, deg = 8) {
  const sx = snap(x);
  const sy = snap(y);
  const sw = snap(w);
  const sh = snap(h);
  const dx = sh * Math.tan((deg * Math.PI) / 180);

  // Return SVG polygon points string: Top-Left, Top-Right, Bottom-Right, Bottom-Left
  const p1 = `${(sx + dx).toFixed(2)},${sy}`;
  const p2 = `${(sx + sw + dx).toFixed(2)},${sy}`;
  const p3 = `${(sx + sw).toFixed(2)},${sy + sh}`;
  const p4 = `${sx.toFixed(2)},${sy + sh}`;
  return `${p1} ${p2} ${p3} ${p4}`;
}

// ── 3. SVG Key Frame Generators (viewBox 0 0 400 300) ──────────────────────

function wrapSvg(content) {
  return `<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; font-family:'Plus Jakarta Sans', system-ui, sans-serif;">
  <rect x="0" y="0" width="400" height="300" fill="#ffffff"/>
  ${content}
</svg>`;
}

// SCENE A: Hero Loop (Slanted blocks drift in, assemble into traced "i" mark, hold, drift apart)
export const sceneA_start = wrapSvg(`
  <!-- Disassembled drifting slanted blocks -->
  <polygon points="${slantRect(120, 72, 48, 64)}" fill="${TOKENS.lightTint}" stroke="${TOKENS.blueInk}" stroke-width="2"/>
  <polygon points="${slantRect(208, 160, 48, 72)}" fill="${TOKENS.blueInk}"/>
  <polygon points="${slantRect(160, 120, 32, 48)}" fill="${TOKENS.navy}" opacity="0.4"/>
  <circle cx="272" cy="72" r="16" fill="${TOKENS.blue}"/>
`);

export const sceneA_mid = wrapSvg(`
  <!-- Assembled traced swoosh "i" mark hold -->
  <polygon points="${slantRect(176, 112, 48, 128)}" fill="${TOKENS.blueInk}"/>
  <polygon points="${slantRect(160, 160, 32, 80)}" fill="${TOKENS.navy}"/>
  <circle cx="210" cy="80" r="16" fill="${TOKENS.blue}"/>
`);

export const sceneA_end = sceneA_start; // Exact seam equality: frame 0 equals frame 1

// BEAT 1 (Apt): Mismatched slanted pieces fit into one block
export const beat1_start = wrapSvg(`
  <!-- Mismatched slanted pieces separated horizontally -->
  <polygon points="${slantRect(88, 104, 40, 96)}" fill="${TOKENS.lightTint}" stroke="${TOKENS.blueInk}" stroke-width="2"/>
  <polygon points="${slantRect(168, 120, 48, 80)}" fill="${TOKENS.blueInk}"/>
  <polygon points="${slantRect(256, 96, 40, 104)}" fill="${TOKENS.navy}"/>
`);

export const beat1_mid = wrapSvg(`
  <!-- Pieces sliding together along 8° vectors -->
  <polygon points="${slantRect(136, 104, 40, 96)}" fill="${TOKENS.lightTint}" stroke="${TOKENS.blueInk}" stroke-width="2"/>
  <polygon points="${slantRect(176, 104, 48, 96)}" fill="${TOKENS.blueInk}"/>
  <polygon points="${slantRect(224, 104, 40, 96)}" fill="${TOKENS.navy}"/>
`);

export const beat1_end = wrapSvg(`
  <!-- Unified seamless rectangular block hold -->
  <polygon points="${slantRect(136, 104, 128, 96)}" fill="${TOKENS.navy}"/>
  <polygon points="${slantRect(136, 104, 64, 96)}" fill="${TOKENS.blueInk}"/>
  <polygon points="${slantRect(136, 104, 32, 96)}" fill="${TOKENS.lightTint}"/>
`);

// BEAT 2 (Product Engineering): Spark grows into a block
export const beat2_start = wrapSvg(`
  <!-- Concept spark at stage center -->
  <polygon points="200,120 206,144 230,150 206,156 200,180 194,156 170,150 194,144" fill="${TOKENS.blue}"/>
  <circle cx="200" cy="150" r="4" fill="${TOKENS.navy}"/>
`);

export const beat2_mid = wrapSvg(`
  <!-- Spark expanding into 8° structural envelope -->
  <polygon points="${slantRect(160, 112, 80, 80)}" fill="${TOKENS.lightTint}" stroke="${TOKENS.blueInk}" stroke-width="2"/>
  <polygon points="200,128 206,146 224,150 206,154 200,172 194,154 176,150 194,146" fill="${TOKENS.blue}"/>
`);

export const beat2_end = wrapSvg(`
  <!-- Robust slanted engineering block hold -->
  <polygon points="${slantRect(152, 104, 96, 96)}" fill="${TOKENS.blueInk}"/>
  <polygon points="${slantRect(168, 120, 64, 64)}" fill="${TOKENS.navy}"/>
`);

// BEAT 3 (Modernization): Fragmented old block morphs into clean new block with flat brand-blue core
export const beat3_start = wrapSvg(`
  <!-- Fragmented legacy block with disjointed segments -->
  <polygon points="${slantRect(136, 104, 40, 40)}" fill="${TOKENS.navy}"/>
  <polygon points="${slantRect(192, 104, 32, 40)}" fill="${TOKENS.lightTint}" stroke="${TOKENS.navy}" stroke-width="2"/>
  <polygon points="${slantRect(144, 160, 80, 40)}" fill="${TOKENS.blueInk}"/>
  <polygon points="${slantRect(232, 144, 32, 56)}" fill="${TOKENS.navy}" opacity="0.6"/>
`);

export const beat3_mid = wrapSvg(`
  <!-- Coalescing into unified 8° boundary -->
  <polygon points="${slantRect(144, 104, 112, 96)}" fill="${TOKENS.lightTint}" stroke="${TOKENS.blueInk}" stroke-width="2"/>
  <polygon points="${slantRect(168, 128, 64, 48)}" fill="${TOKENS.blue}"/>
`);

export const beat3_end = wrapSvg(`
  <!-- Clean new modular block with flat brand-blue core hold (no glow) -->
  <polygon points="${slantRect(144, 104, 112, 96)}" fill="${TOKENS.blueInk}"/>
  <polygon points="${slantRect(168, 128, 64, 48)}" fill="${TOKENS.blue}"/>
`);

// BEAT 4 (Delivery): Static route line draws once between "US" and "Bengaluru, India" with one traveling marker
export const beat4_start = wrapSvg(`
  <!-- Origin node US -->
  <circle cx="80" cy="152" r="12" fill="${TOKENS.navy}"/>
  <text x="80" y="184" text-anchor="middle" font-size="12" font-weight="700" fill="${TOKENS.navy}">US</text>
  <circle cx="320" cy="152" r="12" fill="${TOKENS.lightTint}" stroke="${TOKENS.blueInk}" stroke-width="2"/>
  <text x="320" y="184" text-anchor="middle" font-size="12" font-weight="700" fill="${TOKENS.navy}">Bengaluru, India</text>
`);

export const beat4_mid = wrapSvg(`
  <!-- Route line drawn with single marker traveling -->
  <path d="M 80,152 C 160,88 240,88 320,152" fill="none" stroke="${TOKENS.lightTint}" stroke-width="4"/>
  <path d="M 80,152 C 140,104 180,104 200,107" fill="none" stroke="${TOKENS.blueInk}" stroke-width="3"/>
  <!-- Traveling marker -->
  <circle cx="200" cy="107" r="8" fill="${TOKENS.blue}"/>
  <circle cx="80" cy="152" r="12" fill="${TOKENS.navy}"/>
  <text x="80" y="184" text-anchor="middle" font-size="12" font-weight="700" fill="${TOKENS.navy}">US</text>
  <circle cx="320" cy="152" r="12" fill="${TOKENS.lightTint}" stroke="${TOKENS.blueInk}" stroke-width="2"/>
  <text x="320" y="184" text-anchor="middle" font-size="12" font-weight="700" fill="${TOKENS.navy}">Bengaluru, India</text>
`);

export const beat4_end = wrapSvg(`
  <!-- Completed static route line, marker arrived and resting -->
  <path d="M 80,152 C 160,88 240,88 320,152" fill="none" stroke="${TOKENS.blueInk}" stroke-width="3"/>
  <circle cx="80" cy="152" r="12" fill="${TOKENS.navy}"/>
  <text x="80" y="184" text-anchor="middle" font-size="12" font-weight="700" fill="${TOKENS.navy}">US</text>
  <circle cx="320" cy="152" r="12" fill="${TOKENS.blue}"/>
  <circle cx="320" cy="152" r="6" fill="${TOKENS.white}"/>
  <text x="320" y="184" text-anchor="middle" font-size="12" font-weight="700" fill="${TOKENS.navy}">Bengaluru, India</text>
`);

// BEAT 5 (Testing): Two parallel lanes ("Manual" and "Automated") with check marks merging into one passing line
export const beat5_start = wrapSvg(`
  <!-- Two parallel lanes -->
  <line x1="80" y1="112" x2="240" y2="112" stroke="${TOKENS.lightTint}" stroke-width="3"/>
  <text x="72" y="116" text-anchor="end" font-size="11" font-weight="700" fill="${TOKENS.blueInk}">Manual</text>
  <line x1="80" y1="184" x2="240" y2="184" stroke="${TOKENS.lightTint}" stroke-width="3"/>
  <text x="72" y="188" text-anchor="end" font-size="11" font-weight="700" fill="${TOKENS.blueInk}">Automated</text>
`);

export const beat5_mid = wrapSvg(`
  <!-- Check marks appearing in both parallel lanes -->
  <line x1="80" y1="112" x2="240" y2="112" stroke="${TOKENS.blueInk}" stroke-width="3"/>
  <text x="72" y="116" text-anchor="end" font-size="11" font-weight="700" fill="${TOKENS.blueInk}">Manual</text>
  <!-- Check mark Lane 1 -->
  <path d="M 136,112 L 144,120 L 160,104" fill="none" stroke="${TOKENS.blue}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 184,112 L 192,120 L 208,104" fill="none" stroke="${TOKENS.blue}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>

  <line x1="80" y1="184" x2="240" y2="184" stroke="${TOKENS.blueInk}" stroke-width="3"/>
  <text x="72" y="188" text-anchor="end" font-size="11" font-weight="700" fill="${TOKENS.blueInk}">Automated</text>
  <!-- Check mark Lane 2 -->
  <path d="M 136,184 L 144,192 L 160,176" fill="none" stroke="${TOKENS.blue}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 184,184 L 192,192 L 208,176" fill="none" stroke="${TOKENS.blue}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
`);

export const beat5_end = wrapSvg(`
  <!-- Lanes merged into one passing line with final verified check mark -->
  <path d="M 80,112 C 160,112 180,148 240,148 L 320,148" fill="none" stroke="${TOKENS.blueInk}" stroke-width="3"/>
  <path d="M 80,184 C 160,184 180,148 240,148" fill="none" stroke="${TOKENS.blueInk}" stroke-width="3"/>
  <circle cx="280" cy="148" r="16" fill="${TOKENS.blue}"/>
  <path d="M 272,148 L 278,154 L 290,142" fill="none" stroke="${TOKENS.white}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="72" y="116" text-anchor="end" font-size="11" font-weight="700" fill="${TOKENS.blueInk}">Manual</text>
  <text x="72" y="188" text-anchor="end" font-size="11" font-weight="700" fill="${TOKENS.blueInk}">Automated</text>
`);

// ── 4. Render Contact Sheet PNG using Playwright ───────────────────────────
async function renderContactSheet() {
  const cards = [
    { title: 'Scene A (Hero Loop) – Start (0.0s)', svg: sceneA_start },
    { title: 'Scene A (Hero Loop) – Mid / Hold (4.0s)', svg: sceneA_mid },
    { title: 'Scene A (Hero Loop) – End (8.0s)', svg: sceneA_end },
    { title: 'Beat 1 (Apt) – Start', svg: beat1_start },
    { title: 'Beat 1 (Apt) – Mid', svg: beat1_mid },
    { title: 'Beat 1 (Apt) – End / Hold', svg: beat1_end },
    { title: 'Beat 2 (Product Engineering) – Start', svg: beat2_start },
    { title: 'Beat 2 (Product Engineering) – Mid', svg: beat2_mid },
    { title: 'Beat 2 (Product Engineering) – End / Hold', svg: beat2_end },
    { title: 'Beat 3 (Modernization) – Start', svg: beat3_start },
    { title: 'Beat 3 (Modernization) – Mid', svg: beat3_mid },
    { title: 'Beat 3 (Modernization) – End / Hold', svg: beat3_end },
    { title: 'Beat 4 (Delivery) – Start', svg: beat4_start },
    { title: 'Beat 4 (Delivery) – Mid', svg: beat4_mid },
    { title: 'Beat 4 (Delivery) – End / Hold', svg: beat4_end },
    { title: 'Beat 5 (Testing) – Start', svg: beat5_start },
    { title: 'Beat 5 (Testing) – Mid', svg: beat5_mid },
    { title: 'Beat 5 (Testing) – End / Hold', svg: beat5_end },
  ];

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      margin: 0;
      padding: 32px;
      background: #f5fafe;
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      color: #003074;
    }
    h1 {
      text-align: center;
      margin-bottom: 24px;
      font-size: 24px;
      font-weight: 800;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, 400px);
      gap: 24px;
      justify-content: center;
    }
    .card {
      background: #ffffff;
      border: 1px solid #d4e8f7;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,48,116,0.06);
    }
    .card-title {
      padding: 10px 16px;
      font-size: 12px;
      font-weight: 700;
      background: #eef7fd;
      border-bottom: 1px solid #d4e8f7;
      color: #0070a8;
    }
  </style>
</head>
<body>
  <h1>Apt Infosoft – Motion Design Storyboard Key Frames</h1>
  <div class="grid">
    ${cards.map(c => `
      <div class="card">
        <div class="card-title">${c.title}</div>
        <div>${c.svg}</div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1360, height: 2150 } });
  await page.setContent(html, { waitUntil: 'load' });
  const previewPath = path.join(OUT_DIR, 'storyboard-preview.png');
  await page.screenshot({ path: previewPath, fullPage: true });
  await browser.close();
  console.log(`Rendered contact sheet to: ${previewPath}`);
}

renderContactSheet().catch(err => {
  console.error(err);
  process.exit(1);
});
