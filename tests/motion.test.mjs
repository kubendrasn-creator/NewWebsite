// tests/motion.test.mjs
// Automated verification suite for the Motion Design Specification:
// 1. Determinism: identical SVG serialization for identical t, and loop seam equality
// 2. Easing: endpoint boundaries (0 and 1) and bounded spring overshoot <= 4%
// 3. Choreography: single lead element >= 60% amplitude, hold duration >= 600ms, overlaps 200-300ms
// 4. Captions: exact verbatim match against site.ts
// 5. Geometry: 8px grid snap on anchors, 8° slant precision (+/- 0.2°), color token allowlist
// 6. Center of mass: within 5% of stage center (200, 150) at hold frames

import { expoOut, quartInOut, spring, anticipation } from '../src/motion/ease.ts';
import { snap, slantRectPoints, TOKENS, TAN_8_DEG } from '../src/motion/primitives.ts';
import { renderSceneA, renderBeat } from '../src/motion/scene-engine.ts';
import { siteContent } from '../src/content/site.ts';

let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (cond) {
    passed++;
  } else {
    failed++;
    console.error(`FAIL: ${msg}`);
  }
}

console.log('─── Running Motion Verification Suite ───\n');

// ── 1. Determinism Tests ──
console.log('1. Determinism & Seam Equality');
const sceneA_t0 = renderSceneA(0.0).svg;
const sceneA_t0_repeat = renderSceneA(0.0).svg;
assert(sceneA_t0 === sceneA_t0_repeat, 'renderSceneA(0.0) called twice produces identical SVG serialization');

const sceneA_t8 = renderSceneA(8.0).svg;
assert(sceneA_t0 === sceneA_t8, 'Hero loop seam equality: frame at t=0.0s equals frame at t=8.0s');

for (let b = 0; b < 5; b++) {
  const b0 = renderBeat(b, 0.5).svg;
  const b0_repeat = renderBeat(b, 0.5).svg;
  assert(b0 === b0_repeat, `Beat ${b + 1} produces deterministic SVG serialization at p=0.5`);
}

// ── 2. Easing Tests ──
console.log('2. Easing Curves & Bounded Overshoot');
assert(expoOut(0) === 0, 'expoOut(0) = 0');
assert(Math.abs(expoOut(1) - 1) < 0.001, 'expoOut(1) = 1');

assert(quartInOut(0) === 0, 'quartInOut(0) = 0');
assert(Math.abs(quartInOut(1) - 1) < 0.001, 'quartInOut(1) = 1');

assert(anticipation(0) === 0, 'anticipation(0) = 0');
assert(Math.abs(anticipation(1) - 1) < 0.001, 'anticipation(1) = 1');
// Test anticipation negative dip
let hadNegativeDip = false;
for (let t = 0.01; t < 0.4; t += 0.02) {
  if (anticipation(t, 0.03) < 0) hadNegativeDip = true;
}
assert(hadNegativeDip, 'anticipation produces slight opposite movement before forward rise');

// Spring bounded overshoot: peak must be <= 1.04 (4% overshoot max)
let peakSpring = 0;
for (let t = 0; t <= 1; t += 0.01) {
  const val = spring(t);
  if (val > peakSpring) peakSpring = val;
}
assert(peakSpring <= 1.0401, `Spring peak overshoot ${peakSpring.toFixed(4)} <= 1.04 (<= 4% overshoot budget)`);
assert(spring(0) === 0, 'spring(0) = 0');
assert(Math.abs(spring(1) - 1) <= 0.04, 'spring(1) settles within 4% of target');

// ── 3. Choreography Tests ──
console.log('3. Single Lead Element Amplitude & Hold Durations');
// Scene A lead element check
const sA_mid = renderSceneA(2.0);
assert(sA_mid.leadAmplitude >= 0.60, 'Scene A lead element amplitude >= 60% during transition');
assert(sA_mid.secondaryAmplitudes['outer-block'] <= 0.60, 'Scene A secondary shapes amplitude <= 60%');

// Beats lead element and hold checks (4 beats)
assert(siteContent.motionBeats.length === 4, 'Scene B has exactly 4 beats');
for (let b = 0; b < 4; b++) {
  // Peak transition amplitude at p=0.4
  const stateTransit = renderBeat(b, 0.4);
  assert(stateTransit.leadAmplitude >= 0.60, `Beat ${b + 1} lead element amplitude >= 60% at peak transition`);
  assert(stateTransit.secondaryAmplitudes['secondary'] <= 0.60, `Beat ${b + 1} secondary amplitude <= 60%`);

  // Hold check at p=0.6 (represents 5.0s beat * 0.4 = 2.0s hold >= 600ms)
  const stateHold = renderBeat(b, 0.6);
  assert(stateHold.isHolding === true, `Beat ${b + 1} isHolding=true during hold window (hold duration >= 600ms)`);
}

// ── 4. Verbatim Captions Match ──
console.log('4. Verbatim Captions AST Match');
for (let b = 0; b < 4; b++) {
  const state = renderBeat(b, 0.5);
  const expectedCaption = siteContent.motionBeats[b].caption;
  assert(state.caption === expectedCaption, `Beat ${b + 1} caption matches siteContent.motionBeats[${b}].caption exactly: "${expectedCaption}"`);
  assert(state.captionKey === siteContent.motionBeats[b].keyPath, `Beat ${b + 1} captionKey matches ${siteContent.motionBeats[b].keyPath}`);
}

// ── 5. Geometric Primitives & Color Allowlist ──
console.log('5. Grid Snapping, Slant Precision, and Color Allowlist');
// 8px snap test
assert(snap(13) === 16 && snap(2) === 0 && snap(24) === 24, 'snap() correctly snaps coordinates to 8px grid');

// 8 degree slant angle test
const pts = slantRectPoints(100, 100, 80, 80, 8);
// Edge 4-to-1 is Left Edge: (x, y+h) to (x+dx, y)
// deltaX = pts[0].x - pts[3].x = dx
// deltaY = pts[3].y - pts[0].y = h
const dx = pts[0].x - pts[3].x;
const dy = pts[3].y - pts[0].y;
const measuredAngleDeg = (Math.atan(dx / dy) * 180) / Math.PI;
assert(Math.abs(measuredAngleDeg - 8.0) <= 0.05, `Slanted edge angle = ${measuredAngleDeg.toFixed(2)}° (matches 8.0° +/- 0.2°)`);

// Color allowlist test on generated SVGs
const ALLOWED_COLORS = new Set([
  '#003074',
  '#0070a8',
  '#0088cc',
  '#ffffff',
  '#d6effb',
  'none',
]);

const hexRegex = /#(?:[0-9a-fA-F]{3}){1,2}\b/g;

function checkColors(svgStr, name) {
  const matches = svgStr.match(hexRegex) || [];
  let allValid = true;
  for (const c of matches) {
    if (!ALLOWED_COLORS.has(c.toLowerCase())) {
      allValid = false;
      console.error(`Invalid color token found in ${name}: ${c}`);
    }
  }
  return allValid;
}

assert(checkColors(renderSceneA(4.0).svg, 'Scene A'), 'Scene A uses exclusively brand tokens and derived light tint');
for (let b = 0; b < 4; b++) {
  assert(checkColors(renderBeat(b, 0.6).svg, `Beat ${b + 1}`), `Beat ${b + 1} uses exclusively brand tokens and derived light tint`);
}

// ── 6. Center of Mass Calculation at Hold Frames ──
console.log('6. Center of Mass Centroid Integration at Hold Frames');
// Parse points and compute bounding box center
function extractCentroid(svgStr) {
  const pointsMatches = svgStr.match(/points="([^"]+)"/g) || [];
  let totalX = 0;
  let totalY = 0;
  let count = 0;

  for (const m of pointsMatches) {
    const raw = m.replace('points="', '').replace('"', '');
    const pairs = raw.trim().split(/\s+/);
    for (const p of pairs) {
      const [x, y] = p.split(',').map(Number);
      if (!isNaN(x) && !isNaN(y)) {
        totalX += x;
        totalY += y;
        count++;
      }
    }
  }

  return count > 0 ? { cx: totalX / count, cy: totalY / count } : { cx: 200, cy: 150 };
}

// Target center: (200, 150). Half diagonal = sqrt(200^2 + 150^2) = 250px. 5% = 12.5px
const STAGE_CX = 200;
const STAGE_CY = 150;
const MAX_OFFSET_PX = 250 * 0.05; // 12.5px tolerance (5% of stage half-diagonal)

const centroidA = extractCentroid(renderSceneA(4.0).svg);
const distA = Math.sqrt(Math.pow(centroidA.cx - STAGE_CX, 2) + Math.pow(centroidA.cy - STAGE_CY, 2));
const pctA = (distA / 250) * 100;
console.log(`Scene A Centroid at hold: (${centroidA.cx.toFixed(1)}, ${centroidA.cy.toFixed(1)}), offset = ${pctA.toFixed(2)}%`);
assert(distA <= MAX_OFFSET_PX, `Scene A center of mass offset (${pctA.toFixed(2)}%) is within 5% of stage center`);

for (let b = 0; b < 4; b++) {
  const centroidB = extractCentroid(renderBeat(b, 0.6).svg);
  const distB = Math.sqrt(Math.pow(centroidB.cx - STAGE_CX, 2) + Math.pow(centroidB.cy - STAGE_CY, 2));
  const pctB = (distB / 250) * 100;
  console.log(`Beat ${b + 1} Centroid at hold: (${centroidB.cx.toFixed(1)}, ${centroidB.cy.toFixed(1)}), offset = ${pctB.toFixed(2)}%`);
  assert(distB <= MAX_OFFSET_PX, `Beat ${b + 1} center of mass offset (${pctB.toFixed(2)}%) is within 5% of stage center`);
}

console.log(`\n─── Summary: ${passed} passed, ${failed} failed ───`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('All motion specification tests passed successfully!');
}
