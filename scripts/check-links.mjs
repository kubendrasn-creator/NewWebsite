// scripts/check-links.mjs
// Crawls dist/ directory to verify all internal links, assets, redirects, and meta references.

import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.resolve('dist');
const BASE_PATH = '/NewWebsite';

if (!fs.existsSync(DIST_DIR)) {
  console.error(`Dist directory ${DIST_DIR} does not exist. Run build first.`);
  process.exit(1);
}

function getAllFiles(dir, exts = ['.html']) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, exts));
    } else {
      if (exts.includes(path.extname(fullPath))) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

const htmlFiles = getAllFiles(DIST_DIR, ['.html']);
console.log(`Checking ${htmlFiles.length} HTML files in ${DIST_DIR}...`);

let checkedLinks = 0;
let checkedAssets = 0;
let checkedRedirects = 0;
let errors = [];

// Legacy redirects that must exist in dist/
const REQUIRED_REDIRECTS = [
  'product-engineering-services.html',
  'custom-application-development.html',
  'saas.html',
  'cloud-based-deployment.html',
  'application-modernization.html',
  'testing-services.html',
  'software-testing.html',
  'business-analytics.html',
  'about-us.html',
  'software-engineer.html',
  'contact-us.php',
  'contact-us.html',
  'Flexibility.html',
  'Reliability-and-Scalability.html',
  'Efficiency.html',
];

for (const redir of REQUIRED_REDIRECTS) {
  const redirPath = path.join(DIST_DIR, redir);
  if (!fs.existsSync(redirPath)) {
    errors.push(`Missing legacy redirect file: ${redir}`);
  } else {
    checkedRedirects++;
  }
}

// Critical assets that must exist in dist/
const REQUIRED_ASSETS = [
  'og-image.png',
  'favicon.svg',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'apple-touch-icon.png',
  'site.webmanifest',
  'robots.txt',
  '404.html',
];

for (const asset of REQUIRED_ASSETS) {
  const assetPath = path.join(DIST_DIR, asset);
  if (!fs.existsSync(assetPath)) {
    errors.push(`Missing critical asset: ${asset}`);
  } else {
    checkedAssets++;
  }
}

// Inspect internal links in every HTML file
const linkRegex = /href=["']([^"']+)["']/g;
const srcRegex = /src=["']([^"']+)["']/g;

for (const htmlFile of htmlFiles) {
  const content = fs.readFileSync(htmlFile, 'utf-8');
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const rawHref = match[1];
    if (rawHref.startsWith('#') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:') || rawHref.startsWith('http://') || rawHref.startsWith('https://')) {
      // Validate mailto / tel syntax
      if (rawHref.startsWith('mailto:') && !rawHref.includes('@')) {
        errors.push(`Invalid mailto link in ${path.relative(DIST_DIR, htmlFile)}: ${rawHref}`);
      }
      if (rawHref.startsWith('tel:') && rawHref.length < 5) {
        errors.push(`Invalid tel link in ${path.relative(DIST_DIR, htmlFile)}: ${rawHref}`);
      }
      continue;
    }

    // Must start with base path
    if (rawHref.startsWith(BASE_PATH)) {
      const subPath = rawHref.slice(BASE_PATH.length);
      const cleanSub = subPath.split('?')[0].split('#')[0];
      const targetHtml = path.join(DIST_DIR, cleanSub, 'index.html');
      const targetDirect = path.join(DIST_DIR, cleanSub);

      if (!fs.existsSync(targetHtml) && !fs.existsSync(targetDirect)) {
        errors.push(`Broken internal link in ${path.relative(DIST_DIR, htmlFile)}: ${rawHref}`);
      } else {
        checkedLinks++;
      }
    }
  }

  while ((match = srcRegex.exec(content)) !== null) {
    const rawSrc = match[1];
    if (rawSrc.startsWith('http://') || rawSrc.startsWith('https://') || rawSrc.startsWith('data:')) {
      continue;
    }
    if (rawSrc.startsWith(BASE_PATH)) {
      const subPath = rawSrc.slice(BASE_PATH.length);
      const target = path.join(DIST_DIR, subPath);
      if (!fs.existsSync(target)) {
        errors.push(`Broken asset src in ${path.relative(DIST_DIR, htmlFile)}: ${rawSrc}`);
      } else {
        checkedAssets++;
      }
    }
  }
}

console.log(`Verified ${checkedLinks} internal links, ${checkedAssets} assets, and ${checkedRedirects} redirects.`);

if (errors.length > 0) {
  console.error(`Found ${errors.length} link/asset errors:`);
  errors.slice(0, 15).forEach((e) => console.error(` - ${e}`));
  process.exit(1);
} else {
  console.log('All links, assets, and legacy redirects verified successfully!');
}
