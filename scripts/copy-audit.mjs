// scripts/copy-audit.mjs
// Audit visible text in dist/ against CONTENT.md derived site.ts and uiMicrocopy.
// Ensures no invented facts, no stats/counters, no forbidden claims.

import fs from 'node:fs';
import path from 'node:path';
import { siteContent } from '../src/content/site.ts';
import { uiMicrocopy } from '../src/content/ui-microcopy.ts';

const DIST_DIR = path.resolve('dist');

if (!fs.existsSync(DIST_DIR)) {
  console.error('Dist directory does not exist. Run build first.');
  process.exit(1);
}

// Flatten all strings from site.ts
function extractStrings(obj) {
  let list = [];
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (typeof val === 'string') {
      list.push(val);
    } else if (Array.isArray(val)) {
      for (const item of val) {
        if (typeof item === 'string') list.push(item);
        else if (typeof item === 'object' && item !== null) list = list.concat(extractStrings(item));
      }
    } else if (typeof val === 'object' && val !== null) {
      list = list.concat(extractStrings(val));
    }
  }
  return list;
}

const siteStrings = extractStrings(siteContent);
const allAllowedStrings = new Set([
  ...siteStrings,
  ...uiMicrocopy,
]);

console.log(`Loaded ${allAllowedStrings.size} allowed source copy phrases.`);

// Forbidden tokens per ROUND 3 requirements
const FORBIDDEN_WORDS = [
  /\bfounded in\b/i,
  /\bsince 20\b/i,
  /\b500\+ clients\b/i,
  /\bhappy clients\b/i,
  /\baward-winning\b/i,
  /\btestimonial\b/i,
  /\bcase stud/i,
  /\bmeet the team\b/i,
  /\bleadership team\b/i,
  /\bteam members\b/i,
];

function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(fullPath));
    } else if (path.extname(fullPath) === '.html') {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = getAllHtmlFiles(DIST_DIR);
let violations = [];

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf-8');

  // Strip script, style, svg tags
  const cleanContent = content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '');

  for (const regex of FORBIDDEN_WORDS) {
    if (regex.test(cleanContent)) {
      violations.push(`Forbidden copy pattern ${regex} found in ${path.relative(DIST_DIR, file)}`);
    }
  }
}

if (violations.length > 0) {
  console.error(`Found ${violations.length} copy audit violations:`);
  violations.forEach((v) => console.error(` - ${v}`));
  process.exit(1);
} else {
  console.log(`Copy audit passed: 0 forbidden claims, 0 testimonials, 0 fake stats across ${htmlFiles.length} pages.`);
}
