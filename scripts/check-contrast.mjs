// scripts/check-contrast.mjs
// Programmatically compute WCAG 2.1 relative luminance and contrast ratios
// for brand tokens. Fails if normal text < 4.5:1 or large text < 3.0:1 for approved pairings.

const TOKENS = {
  white: '#ffffff',
  ice: '#eef7fd',
  blue: '#0088cc',
  blueInk: '#0070a8',
  navy: '#003074',
};

// Convert hex to linear sRGB channel
function sRGBtoLinear(c) {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

// Relative luminance per WCAG 2.1 definition
function getLuminance(hex) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const R = sRGBtoLinear(r);
  const G = sRGBtoLinear(g);
  const B = sRGBtoLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

// Contrast ratio: (L1 + 0.05) / (L2 + 0.05)
function getContrastRatio(hex1, hex2) {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Permitted brand text/background pairings in the Apt Infosoft design system:
const PAIRS = [
  { fg: 'navy', fgHex: TOKENS.navy, bg: 'white', bgHex: TOKENS.white, role: 'Body / Heading text on white', isNormal: true },
  { fg: 'navy', fgHex: TOKENS.navy, bg: 'ice', bgHex: TOKENS.ice, role: 'Body / Heading text on ice background', isNormal: true },
  { fg: 'blueInk', fgHex: TOKENS.blueInk, bg: 'white', bgHex: TOKENS.white, role: 'Ink buttons / subheads on white', isNormal: true },
  { fg: 'blueInk', fgHex: TOKENS.blueInk, bg: 'ice', bgHex: TOKENS.ice, role: 'Ink badges / accents on ice', isNormal: true },
  { fg: 'white', fgHex: TOKENS.white, bg: 'navy', bgHex: TOKENS.navy, role: 'White text on navy badge/button', isNormal: true },
  { fg: 'white', fgHex: TOKENS.white, bg: 'blueInk', bgHex: TOKENS.blueInk, role: 'White text on blue-ink button', isNormal: true },
  { fg: 'blue', fgHex: TOKENS.blue, bg: 'white', bgHex: TOKENS.white, role: 'Large decorative hero headline italic accent', isNormal: false },
  { fg: 'blue', fgHex: TOKENS.blue, bg: 'ice', bgHex: TOKENS.ice, role: 'Large decorative title accent on ice', isNormal: false },
];

console.log('------------------------------------------------------------------------------------------------------');
console.log('| Foreground | Background | Ratio    | Normal (>=4.5:1) | Large (>=3.0:1) | Usage / Role                 |');
console.log('------------------------------------------------------------------------------------------------------');

let hasFailure = false;

for (const pair of PAIRS) {
  const ratio = getContrastRatio(pair.fgHex, pair.bgHex);
  const passNormal = ratio >= 4.5;
  const passLarge = ratio >= 3.0;

  const normalStatus = passNormal ? 'PASS' : 'FAIL';
  const largeStatus = passLarge ? 'PASS' : 'FAIL';

  console.log(
    `| ${pair.fgHex.padEnd(10)} | ${pair.bgHex.padEnd(10)} | ${ratio.toFixed(2).padEnd(8)} | ${normalStatus.padEnd(16)} | ${largeStatus.padEnd(15)} | ${pair.role.padEnd(28)} |`
  );

  // If designated as normal text role, must pass normal 4.5:1
  if (pair.isNormal && !passNormal) {
    console.error(`ERROR: Pair ${pair.fg} (${pair.fgHex}) on ${pair.bg} (${pair.bgHex}) fails normal text contrast (got ${ratio.toFixed(2)})`);
    hasFailure = true;
  }
  // If large text role, must pass large 3.0:1
  if (!pair.isNormal && !passLarge) {
    console.error(`ERROR: Pair ${pair.fg} (${pair.fgHex}) on ${pair.bg} (${pair.bgHex}) fails large text contrast (got ${ratio.toFixed(2)})`);
    hasFailure = true;
  }
}

console.log('------------------------------------------------------------------------------------------------------');

if (hasFailure) {
  process.exit(1);
} else {
  console.log('Contrast check passed: All token pairs comply with WCAG 2.1 requirements.');
}
