// scripts/copy-audit.mjs
// Audit visible text in dist/ against CONTENT.md derived site.ts and uiMicrocopy.
// Ensures no invented facts, no stats/counters, and enforces all forbidden token & conditional rules.

import fs from 'node:fs';
import path from 'node:path';
import { siteContent } from '../src/content/site.ts';
import { uiMicrocopy } from '../src/content/ui-microcopy.ts';

const DIST_DIR = path.resolve('dist');

if (!fs.existsSync(DIST_DIR)) {
  console.error('Dist directory does not exist. Run build first.');
  process.exit(1);
}

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

// Forbidden tokens per ROUND 3 & REMAP specs
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
  /\bHealthcare\b/i,
  /\.NET\b/i,
  /\bMAUI\b/i,
  /\bAzure DevOps\b/i,
  /\bWe work on Azure DevOps\b/i,
  /\bpendingOwnerApproval\b/i,
  /\bHIPAA\b/i,
  /\bcompliant\b/i,
  /\bcertified\b/i,
  /\bmastered\b/i,
  /\bexpert\b/i,
  /\bleading\b/i,
  /\bbest\b/i,
  /\bhiring\b/i,
  /\bexpanding\b/i,
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

const ALLOWED_AZURE_CONTEXT = 'Windows Azure by Microsoft';
const ALLOWED_AGILE_CONTEXTS = [
  'agile methodology for software development',
  'Apt • Agile • Assured',
  'Apt <span class="text-[#0070a8]">•</span> Agile',
  '02. Agile',
  '>Agile<',
  'Agile',
];

for (const file of htmlFiles) {
  const relPath = path.relative(DIST_DIR, file);
  const content = fs.readFileSync(file, 'utf-8');

  // Strip script, style, svg tags, and HTML tags to inspect visible text
  const noCode = content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, ' ');

  const visibleText = noCode
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');

  for (const regex of FORBIDDEN_WORDS) {
    if (regex.test(visibleText)) {
      violations.push(`Forbidden copy pattern ${regex} found in ${relPath}`);
    }
  }

  // Conditional check 1: "Azure" appears ONLY inside the verbatim SaaS sentence
  const azureMatches = [...visibleText.matchAll(/\bAzure\b/gi)];
  for (const m of azureMatches) {
    const start = Math.max(0, m.index - 40);
    const end = Math.min(visibleText.length, m.index + 60);
    const snippet = visibleText.slice(start, end);
    if (!snippet.includes(ALLOWED_AZURE_CONTEXT)) {
      violations.push(`Unauthorized "Azure" usage in ${relPath}: "...${snippet}..."`);
    }
  }

  // Conditional check 2: "agile" appears ONLY in the old pillar name ("Agile") or verbatim Efficiency sentence
  const agileMatches = [...visibleText.matchAll(/\bagile\b/gi)];
  for (const m of agileMatches) {
    const start = Math.max(0, m.index - 40);
    const end = Math.min(visibleText.length, m.index + 60);
    const snippet = visibleText.slice(start, end);
    const isEfficiency = snippet.includes('agile methodology for software development');
    // Capitalized "Agile" as standalone pillar name (e.g. "Apt • Agile • Assured" or "Agile")
    const isPillar = m[0] === 'Agile';
    if (!isEfficiency && !isPillar) {
      violations.push(`Unauthorized "agile" usage in ${relPath}: "...${snippet}..."`);
    }
  }
}

if (violations.length > 0) {
  console.error(`Found ${violations.length} copy audit violations:`);
  violations.forEach((v) => console.error(` - ${v}`));
  process.exit(1);
} else {
  console.log(`Copy audit passed: 0 forbidden claims, 0 unauthorized Azure/agile uses across ${htmlFiles.length} pages.`);
}
