// src/motion/scene-engine.ts
// Pure mathematical animation engine driving Scene A (hero loop) and Scene B (5 beats)
// All outputs are deterministic pure functions f(t) -> SVG string with zero side-effects.

import { expoOut, quartInOut, spring, anticipation } from './ease.ts';
import { TOKENS, snap, slantRect, slantRectPoints, morphPoints, pointsToString, type Point } from './primitives.ts';
import { siteContent } from '../content/site.ts';

export interface SceneState {
  svg: string;
  leadElement: string;
  leadAmplitude: number;
  secondaryAmplitudes: Record<string, number>;
  caption: string;
  captionKey: string;
  isHolding: boolean;
}

// ─── 1. SCENE A: HERO LOOP (8.00 s) ──────────────────────────────────────────
export function renderSceneA(timeSec: number): SceneState {
  // Wrap time in 8.0s periodic domain
  const t = ((timeSec % 8.0) + 8.0) % 8.0;
  const normalizedT = t / 8.0;

  let leadAmp = 0;
  let secAmp = 0;
  let isHolding = false;

  // Keyframes:
  // 0.0s - 2.8s: Assembly (tNorm: 0.0 -> 0.35)
  // 2.8s - 5.2s: Hold (tNorm: 0.35 -> 0.65) (2.4s hold >= 600ms)
  // 5.2s - 8.0s: Disassembly (tNorm: 0.65 -> 1.0)
  let p = 0;
  if (t < 2.8) {
    const rawProgress = t / 2.8;
    p = expoOut(rawProgress);
    leadAmp = p;
    secAmp = p * 0.5;
  } else if (t < 5.2) {
    p = 1;
    leadAmp = 1;
    secAmp = 0.5;
    isHolding = true;
  } else {
    const rawProgress = (t - 5.2) / 2.8;
    p = 1 - quartInOut(rawProgress);
    leadAmp = p;
    secAmp = p * 0.5;
  }

  // Interpolated shape coordinates (centered around y = 150):
  // Shape 1 (Light tint outer block): (120, 48) -> (192, 88)
  const s1x = 120 + (192 - 120) * p;
  const s1y = 48 + (88 - 48) * p;

  // Shape 2 (Main blue-ink stem - LEAD ELEMENT): (208, 136) -> (176, 88)
  const s2x = 208 + (176 - 208) * p;
  const s2y = 136 + (88 - 136) * p;
  const s2w = 48;
  const s2h = 72 + (124 - 72) * p;

  // Shape 3 (Navy base accent): (160, 96) -> (160, 136)
  const s3x = 160;
  const s3y = 96 + (136 - 96) * p;
  const s3w = 32;
  const s3h = 48 + (76 - 48) * p;

  // Dot (Blue circle): (272, 48) -> (210, 56)
  const dotX = 272 + (210 - 272) * p;
  const dotY = 48 + (56 - 48) * p;

  const svg = `<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;">
  <rect x="0" y="0" width="400" height="300" fill="#ffffff"/>
  <polygon points="${slantRect(s1x, s1y, 48, 64)}" fill="${TOKENS.lightTint}" stroke="${TOKENS.blueInk}" stroke-width="2"/>
  <polygon points="${slantRect(s2x, s2y, s2w, s2h)}" fill="${TOKENS.blueInk}"/>
  <polygon points="${slantRect(s3x, s3y, s3w, s3h)}" fill="${TOKENS.navy}" opacity="${0.4 + 0.6 * p}"/>
  <circle cx="${dotX.toFixed(2)}" cy="${dotY.toFixed(2)}" r="16" fill="${TOKENS.blue}"/>
</svg>`;

  return {
    svg,
    leadElement: 'central-slanted-stem',
    leadAmplitude: leadAmp,
    secondaryAmplitudes: { 'outer-block': secAmp, 'navy-accent': secAmp, 'dot': secAmp },
    caption: siteContent.hero.subhead,
    captionKey: 'siteContent.hero.subhead',
    isHolding,
  };
}

// ─── 2. SCENE B: 5 BEATS ────────────────────────────────────────────────────

export function renderBeat(beatIdx: number, progress: number): SceneState {
  const p = Math.max(0, Math.min(1, progress));
  const beat = siteContent.motionBeats[beatIdx] || siteContent.motionBeats[0];

  let leadAmp = 0;
  let secAmp = 0;
  let isHolding = false;
  let svgContent = '';

  // Hold phase in each beat: p in [0.45, 0.85] represents a hold (holding >= 600ms)
  if (p >= 0.45 && p <= 0.85) {
    isHolding = true;
  }

  switch (beatIdx) {
    case 0: {
      // Beat 1: Apt (Mismatched slanted pieces fit into one block)
      const tE = p < 0.45 ? expoOut(p / 0.45) : (p <= 0.85 ? 1 : 1 - quartInOut((p - 0.85) / 0.15));
      leadAmp = tE;
      secAmp = tE * 0.5;

      const p1x = 88 + (136 - 88) * tE;
      const p2x = 168 + (176 - 168) * tE;
      const p3x = 256 + (224 - 256) * tE;

      svgContent = `
  <polygon points="${slantRect(p1x, 104, 40, 96)}" fill="${TOKENS.lightTint}" stroke="${TOKENS.blueInk}" stroke-width="2"/>
  <polygon points="${slantRect(p2x, 104, 48, 96)}" fill="${TOKENS.blueInk}"/>
  <polygon points="${slantRect(p3x, 104, 40, 96)}" fill="${TOKENS.navy}"/>
`;
      break;
    }

    case 1: {
      // Beat 2: Product Engineering (Spark grows into an engineered block)
      const tE = p < 0.45 ? spring(p / 0.45) : (p <= 0.85 ? 1 : 1 - expoOut((p - 0.85) / 0.15));
      leadAmp = Math.min(1, tE);
      secAmp = leadAmp * 0.5;

      const blockW = 16 + (96 - 16) * leadAmp;
      const blockH = 16 + (96 - 16) * leadAmp;
      const bx = 200 - blockW / 2;
      const by = 150 - blockH / 2;

      svgContent = `
  <polygon points="${slantRect(bx, by, blockW, blockH)}" fill="${TOKENS.blueInk}"/>
  <polygon points="${slantRect(bx + 16 * leadAmp, by + 16 * leadAmp, blockW * 0.6, blockH * 0.6)}" fill="${TOKENS.navy}"/>
  <polygon points="200,${(140 - 20 * (1 - leadAmp)).toFixed(1)} 204,148 212,150 204,152 200,${(160 + 20 * (1 - leadAmp)).toFixed(1)} 196,152 188,150 196,148" fill="${TOKENS.blue}" opacity="${1 - leadAmp * 0.8}"/>
`;
      break;
    }

    case 2: {
      // Beat 3: Application Modernization (Fragmented old block -> clean new block with flat brand-blue core)
      const tE = p < 0.45 ? quartInOut(p / 0.45) : (p <= 0.85 ? 1 : 1 - expoOut((p - 0.85) / 0.15));
      leadAmp = tE;
      secAmp = tE * 0.55;

      const gap = (1 - leadAmp) * 24;
      const shellW = 112;
      const shellH = 96;

      svgContent = `
  <polygon points="${slantRect(144, 104, shellW, shellH)}" fill="${leadAmp > 0.6 ? TOKENS.blueInk : TOKENS.lightTint}" stroke="${TOKENS.blueInk}" stroke-width="2"/>
  <polygon points="${slantRect(168, 128, 64, 48)}" fill="${TOKENS.blue}"/>
  ${gap > 2 ? `<line x1="${(144 + gap).toFixed(1)}" y1="104" x2="${(144 + gap).toFixed(1)}" y2="200" stroke="${TOKENS.white}" stroke-width="2"/>` : ''}
`;
      break;
    }

    case 3: {
      // Beat 4: Delivery (Static route drawn once between "US" and "Bengaluru, India" with one marker traveling)
      const tE = p < 0.55 ? expoOut(p / 0.55) : 1;
      leadAmp = tE;
      secAmp = 0.5;

      const mx = 80 + (320 - 80) * tE;
      // Parabolic arc for traveling marker
      const arcHeight = Math.sin(tE * Math.PI) * 45;
      const my = 152 - arcHeight;

      svgContent = `
  <path d="M 80,152 C 160,88 240,88 320,152" fill="none" stroke="${TOKENS.lightTint}" stroke-width="4"/>
  <path d="M 80,152 C ${(80 + (160 - 80) * tE).toFixed(1)},${(152 - arcHeight).toFixed(1)} ${(160 + (240 - 160) * tE).toFixed(1)},${(152 - arcHeight).toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)}" fill="none" stroke="${TOKENS.blueInk}" stroke-width="3"/>
  <circle cx="80" cy="152" r="12" fill="${TOKENS.navy}"/>
  <text x="80" y="184" text-anchor="middle" font-size="12" font-weight="700" fill="${TOKENS.navy}">US</text>
  <circle cx="320" cy="152" r="12" fill="${tE >= 0.98 ? TOKENS.blue : TOKENS.lightTint}" stroke="${TOKENS.blueInk}" stroke-width="2"/>
  <text x="320" y="184" text-anchor="middle" font-size="12" font-weight="700" fill="${TOKENS.navy}">Bengaluru, India</text>
  <circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="8" fill="${TOKENS.blue}"/>
`;
      break;
    }

    case 4:
    default: {
      // Beat 5: Testing (Two parallel lanes "Manual" and "Automated" with check marks merging)
      const tE = p < 0.5 ? expoOut(p / 0.5) : (p <= 0.85 ? 1 : 1 - quartInOut((p - 0.85) / 0.15));
      leadAmp = tE;
      secAmp = tE * 0.5;

      const mergeP = Math.max(0, (p - 0.3) / 0.4);

      svgContent = `
  <line x1="80" y1="112" x2="240" y2="112" stroke="${TOKENS.blueInk}" stroke-width="3"/>
  <text x="72" y="116" text-anchor="end" font-size="11" font-weight="700" fill="${TOKENS.blueInk}">Manual</text>
  <line x1="80" y1="184" x2="240" y2="184" stroke="${TOKENS.blueInk}" stroke-width="3"/>
  <text x="72" y="188" text-anchor="end" font-size="11" font-weight="700" fill="${TOKENS.blueInk}">Automated</text>

  <!-- Lane check marks -->
  <path d="M 136,112 L 144,120 L 160,104" fill="none" stroke="${TOKENS.blue}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="${Math.min(1, tE * 2)}"/>
  <path d="M 136,184 L 144,192 L 160,176" fill="none" stroke="${TOKENS.blue}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="${Math.min(1, tE * 2)}"/>

  <!-- Merged passing line -->
  <path d="M 240,112 C 260,112 270,148 290,148 L 320,148" fill="none" stroke="${TOKENS.blueInk}" stroke-width="3" opacity="${mergeP}"/>
  <path d="M 240,184 C 260,184 270,148 290,148 L 320,148" fill="none" stroke="${TOKENS.blueInk}" stroke-width="3" opacity="${mergeP}"/>
  ${mergeP >= 0.8 ? `<circle cx="304" cy="148" r="14" fill="${TOKENS.blue}"/><path d="M 298,148 L 302,152 L 310,144" fill="none" stroke="${TOKENS.white}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>` : ''}
`;
      break;
    }
  }

  const svg = `<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; font-family:'Plus Jakarta Sans', system-ui, sans-serif;">
  <rect x="0" y="0" width="400" height="300" fill="#ffffff"/>
  ${svgContent}
</svg>`;

  return {
    svg,
    leadElement: `beat-${beatIdx + 1}-lead`,
    leadAmplitude: leadAmp,
    secondaryAmplitudes: { secondary: secAmp },
    caption: beat.caption,
    captionKey: beat.keyPath,
    isHolding,
  };
}

// ─── 3. STANDALONE BRAND FILM FRAME GENERATOR (1920x1080, 24.0 s) ───────────
export function renderBrandFilmFrame(timeSec: number): string {
  const t = Math.max(0, Math.min(24.0, timeSec));

  // Sequence:
  // 0.0s - 1.8s: Brand Logo Intro (1.8s)
  // 1.8s - 5.8s: Beat 1 Apt (4.0s)
  // 5.8s - 9.8s: Beat 2 Product Engineering (4.0s)
  // 9.8s - 13.8s: Beat 3 Modernization (4.0s)
  // 13.8s - 17.8s: Beat 4 Delivery (4.0s)
  // 17.8s - 21.8s: Beat 5 Testing (4.0s)
  // 21.8s - 24.0s: Brand Logo Outro (2.2s)

  let stageSvg = '';
  let captionText = '';

  if (t < 1.8) {
    // Intro Logo
    return `<svg viewBox="0 0 1920 1080" width="1920" height="1080" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; font-family:'Plus Jakarta Sans', system-ui, sans-serif;">
  <rect x="0" y="0" width="1920" height="1080" fill="#ffffff"/>
  <g transform="translate(860, 490) scale(2.0)">
    <polygon points="${slantRect(0, 0, 36, 64)}" fill="${TOKENS.blueInk}"/>
    <circle cx="26" cy="-16" r="9" fill="${TOKENS.blue}"/>
    <text x="56" y="46" font-size="44" font-weight="900" fill="${TOKENS.navy}" letter-spacing="-1">Apt Infosoft</text>
  </g>
</svg>`;
  } else if (t >= 21.8) {
    // Outro Logo
    return `<svg viewBox="0 0 1920 1080" width="1920" height="1080" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff; font-family:'Plus Jakarta Sans', system-ui, sans-serif;">
  <rect x="0" y="0" width="1920" height="1080" fill="#ffffff"/>
  <g transform="translate(860, 490) scale(2.0)">
    <polygon points="${slantRect(0, 0, 36, 64)}" fill="${TOKENS.blueInk}"/>
    <circle cx="26" cy="-16" r="9" fill="${TOKENS.blue}"/>
    <text x="56" y="46" font-size="44" font-weight="900" fill="${TOKENS.navy}" letter-spacing="-1">Apt Infosoft</text>
  </g>
</svg>`;
  }

  // Active Beat calculation
  const beatTime = t - 1.8;
  const beatIdx = Math.min(4, Math.floor(beatTime / 4.0));
  const beatProgress = (beatTime % 4.0) / 4.0;

  const state = renderBeat(beatIdx, beatProgress);
  stageSvg = state.svg;
  captionText = state.caption;

  // Split caption into words for kinetic CSS-mask styling
  const words = captionText.split(' ');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      margin: 0;
      width: 1920px;
      height: 1080px;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      box-sizing: border-box;
      padding: 120px;
    }
    .film-container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 96px;
    }
    .stage-wrapper {
      width: 800px;
      height: 600px;
      flex-shrink: 0;
      border: 1px solid #d4e8f7;
      border-radius: 32px;
      overflow: hidden;
      box-shadow: 0 16px 48px rgba(0, 48, 116, 0.08);
      background: #ffffff;
    }
    .stage-wrapper svg {
      width: 100%;
      height: 100%;
    }
    .caption-wrapper {
      flex: 1;
      max-width: 760px;
    }
    .beat-num {
      font-size: 18px;
      font-weight: 800;
      color: #0070a8;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      margin-bottom: 24px;
    }
    .caption-text {
      font-size: 44px;
      font-weight: 800;
      line-height: 1.25;
      color: #003074;
      letter-spacing: -0.02em;
    }
  </style>
</head>
<body>
  <div class="film-container">
    <div class="stage-wrapper">
      ${stageSvg}
    </div>
    <div class="caption-wrapper">
      <div class="beat-num">0${beatIdx + 1} / APT INFOSOFT CORE</div>
      <div class="caption-text">
        ${captionText}
      </div>
    </div>
  </div>
</body>
</html>`;
}
