'use strict';

/**
 * QA pass over docs/ before deploy.
 * Checks: word count floor, title/description length, single H1, canonical,
 * JSON-LD validity, internal links, image references, sitemap and CNAME.
 *
 * Run: node tools/check.js
 */

const fs = require('fs');
const path = require('path');
const walk = require('../src/lib/walk');

const ROOT = path.join(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');
// Focused pages carry only content that appears nowhere else on the site, so
// the floor is a focus check rather than a padding target. Duplicate padding is
// rejected by tools/duplicates.js instead.
const MIN_WORDS = 600;
// Legal pages are boilerplate, not ranking targets: they are excluded from the
// editorial floor but still have to be substantive documents.
const LEGAL_PAGES = new Set(['/privacy.html', '/terms.html']);
const LEGAL_MIN_WORDS = 800;

let errors = 0;
let warnings = 0;
const fail = (m) => { console.log(`  ✗ ${m}`); errors++; };
const warn = (m) => { console.log(`  ! ${m}`); warnings++; };

const stripTags = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/&#\d+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const words = (html) => stripTags(html).split(' ').filter(Boolean).length;
const attr = (html, re) => { const m = html.match(re); return m ? m[1] : null; };

const files = walk(DOCS);
const pages = files.filter((f) => path.basename(f) === 'index.html' || true);

console.log(`\nChecking ${files.length} HTML files in docs/\n`);

const exists = (urlPath) => {
  let p = urlPath.split('#')[0].split('?')[0];
  if (!p || p.startsWith('mailto:') || p.startsWith('http') || p.startsWith('tel:')) return true;
  if (p.endsWith('/')) p += 'index.html';
  return fs.existsSync(path.join(DOCS, p.replace(/^\//, '')));
};

const allLinks = new Map();

for (const file of files) {
  const rel = '/' + path.relative(DOCS, file).split(path.sep).join('/');
  const html = fs.readFileSync(file, 'utf8');
  const is404 = rel === '/404.html';
  const isRedirect = /http-equiv="refresh"/i.test(html);
  const issues = [];

  // Redirect stubs are intentionally thin: they must point at a page that
  // exists, be noindex, and use a refresh plus a canonical to the target.
  if (isRedirect) {
    const target = attr(html, /http-equiv="refresh" content="0; url=([^"]+)"/i);
    if (!target) issues.push('redirect without a refresh target');
    else if (!exists(target)) issues.push(`redirect target missing: ${target}`);
    if (!/name="robots" content="noindex/.test(html)) issues.push('redirect is indexable');
    const canon = attr(html, /<link rel="canonical" href="([^"]+)"/i);
    if (!canon || !canon.endsWith(target)) issues.push('redirect canonical does not match target');
    if (issues.length) {
      console.log(`${rel}  (redirect)`);
      for (const i of issues) fail(i);
    } else {
      console.log(`${rel}  (redirect → ${target})  ✓`);
    }
    continue;
  }

  // 1. Word count
  const wc = words(html.match(/<main[\s\S]*?<\/main>/i) ? html.match(/<main[\s\S]*?<\/main>/i)[0] : html);
  if (LEGAL_PAGES.has(rel)) {
    if (wc < LEGAL_MIN_WORDS) issues.push(`word count ${wc} < ${LEGAL_MIN_WORDS} (legal minimum)`);
  } else if (!is404 && wc < MIN_WORDS) {
    issues.push(`word count ${wc} < ${MIN_WORDS}`);
  }

  // 2. Title and description
  const title = attr(html, /<title>([\s\S]*?)<\/title>/i);
  if (!title) issues.push('missing <title>');
  else if (title.length > 70) issues.push(`title ${title.length} chars (>70)`);
  else if (title.length < 20) issues.push(`title ${title.length} chars (<20)`);

  const desc = attr(html, /<meta name="description" content="([^"]*)"/i);
  if (!desc) issues.push('missing meta description');
  else if (desc.length > 165) issues.push(`description ${desc.length} chars (>165)`);
  else if (desc.length < 70) issues.push(`description ${desc.length} chars (<70)`);

  // 3. Headings and canonical
  const h1s = (html.match(/<h1[\s>]/gi) || []).length;
  if (h1s !== 1 && !is404) issues.push(`${h1s} H1 tags (expected 1)`);

  if (!/<link rel="canonical" href="https:\/\/elitepropx\.com/i.test(html)) issues.push('missing absolute canonical');

  // 4. JSON-LD
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (blocks.length < 3 && !is404) issues.push(`${blocks.length} JSON-LD blocks (expected >=3)`);
  for (const b of blocks) {
    try {
      JSON.parse(b[1]);
    } catch (e) {
      issues.push(`invalid JSON-LD: ${e.message}`);
    }
  }

  // 5. Links and images
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (!exists(href)) issues.push(`broken internal link: ${href}`);
    allLinks.set(href, (allLinks.get(href) || 0) + 1);
  }
  for (const m of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
    const src = m[1];
    if (!/^https?:/.test(src) && !fs.existsSync(path.join(DOCS, src.replace(/^\//, '')))) {
      issues.push(`missing image: ${src}`);
    }
    if (!/alt="/.test(html.slice(html.indexOf(m[0]), html.indexOf(m[0]) + m[0].length + 200))) {
      warn(`${rel}: image without alt near ${src}`);
    }
  }
  for (const m of html.matchAll(/<img[^>]*>/g)) {
    if (!/alt=/.test(m[0])) issues.push(`image without alt attribute: ${m[0].slice(0, 70)}`);
    if (!/width=|loading=/.test(m[0])) warn(`${rel}: image missing width/lazy attributes`);
    // Declared dimensions must match the SVG's intrinsic size, otherwise the
    // reserved box has the wrong aspect ratio and the page shifts on load.
    const src = attr(m[0], /src="([^"]+)"/);
    const w = Number(attr(m[0], /width="(\d+)"/));
    const h = Number(attr(m[0], /height="(\d+)"/));
    if (src && w && h && /^\/assets\/img\/.+\.svg$/.test(src) && !/logo/.test(src)) {
      const svgFile = path.join(DOCS, src.replace(/^\//, ''));
      if (fs.existsSync(svgFile)) {
        const head = fs.readFileSync(svgFile, 'utf8').slice(0, 400);
        const iw = Number(attr(head, /width="(\d+)"/));
        const ih = Number(attr(head, /height="(\d+)"/));
        if (iw && ih && (iw !== w || ih !== h)) {
          issues.push(
            `image size mismatch: ${src} declared ${w}x${h}, intrinsic ${iw}x${ih}`
          );
        }
      }
    }
  }

  // 6. Structured data completeness on articles
  if (html.includes('"@type":"BlogPosting"')) {
    if (!/"datePublished"/.test(html)) issues.push('article missing datePublished');
    if (!/"wordCount"/.test(html)) issues.push('article missing wordCount');
  }

  // 7. Internal linking: every article should route readers to the commercial
  // pages (start an evaluation, proof of passes, what buyers report, pricing).
  // Only links inside <main> count — header and footer navigation is on every
  // page and would otherwise satisfy this rule without the copy linking out.
  const MONEY = [
    '/contact.html',
    '/passed-challenges.html',
    '/blog/best-prop-firm-passing-services.html',
    '/reviews/best-prop-firm-passing-service-2026.html',
    '/reviews/prop-firm-passing-service-reviews.html',
    '/index.html',
  ];
  const mainHtml = html.match(/<main[\s\S]*?<\/main>/i);
  const hrefs = [...(mainHtml ? mainHtml[0] : '').matchAll(/href="(\/[^"]*)"/g)].map(
    (m) => m[1]
  );
  const moneyLinks = hrefs.filter((h) => MONEY.includes(h));
  if (html.includes('"@type":"BlogPosting"')) {
    const uniqueMoney = new Set(moneyLinks).size;
    if (uniqueMoney === 0) issues.push('article links to no commercial page in <main>');
    else if (uniqueMoney < 2) warn(`${rel}: only ${uniqueMoney} commercial link(s) in <main>`);
  }

  if (issues.length) {
    console.log(`${rel}  (${wc} words)`);
    for (const i of issues) fail(i);
  } else {
    console.log(`${rel}  (${wc} words)  ✓`);
  }
}

// Sitemap + CNAME
console.log('');
const sitemap = fs.readFileSync(path.join(DOCS, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!locs.length) fail('sitemap has no <loc> entries');
for (const loc of locs) {
  const p = loc.replace('https://elitepropx.com', '') || '/';
  if (!exists(p === '/' ? '/' : p)) fail(`sitemap URL not built: ${loc}`);
}
const cname = fs.readFileSync(path.join(DOCS, 'CNAME'), 'utf8').trim();
if (cname !== 'elitepropx.com') fail(`CNAME is "${cname}"`);
console.log(`sitemap: ${locs.length} urls · CNAME: ${cname}`);

console.log(`\n${errors} error(s), ${warnings} warning(s)\n`);
process.exit(errors ? 1 : 0);
