'use strict';

/**
 * Build one rebuild queue from the Google Search Console exports in this folder.
 *
 * Input: gsc-indexed.txt, gsc-discovered.txt, gsc-crawled.txt, gsc-404.txt,
 * gsc-redirect.txt — each is a newline-joined list copied straight out of the
 * GSC Page indexing drilldown (URL followed by a private-use glyph and the
 * crawl date, so both have to be stripped).
 *
 * Output: inventory.json (every URL, its GSC bucket and whether we already
 * have a source page for it) and a readable summary on stdout.
 *
 * Run: node tools/gsc/inventory.js
 */

const fs = require('fs');
const path = require('path');

const HERE = __dirname;
const ROOT = path.join(HERE, '..', '..');
const SRC = path.join(ROOT, 'src', 'pages');
const OUT = path.join(HERE, 'inventory.json');

const BUCKETS = [
  ['indexed', 'gsc-indexed.txt'],
  ['discovered', 'gsc-discovered.txt'],
  ['crawled', 'gsc-crawled.txt'],
  ['notfound', 'gsc-404.txt'],
  ['redirect', 'gsc-redirect.txt'],
];

// Build order agreed with the owner: pages Google already indexes come first,
// then crawled-canonical pages, then the discovered backlog, then dead URLs.
const BUILD_ORDER = ['indexed', 'crawled', 'notfound', 'discovered', 'redirect'];

/** Files hold a JSON string literal (quotes + \n escapes); accept plain text too. */
function readList(file) {
  const raw = fs.readFileSync(file, 'utf8').trim();
  const text = raw.startsWith('"') ? JSON.parse(raw) : raw;
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/**
 * Rows read "https://elitepropx.com/blog/x.html<glyph>Oct 13, 2026" (and "N/A"
 * when the URL was never crawled). Cut at the glyph, then at any whitespace, so
 * a year inside a slug ("...-2026.html") is never mistaken for the crawl date.
 */
function clean(raw) {
  const candidate = raw
    .split(/[\uE000-\uF8FF]+/)[0]
    .trim()
    .split(/\s+/)[0];
  const m = candidate.match(/^https:\/\/elitepropx\.com(\/[A-Za-z0-9._~%/-]*)?$/);
  if (!m) return null;
  const p = m[1] || '/';
  return p === '/index.html' ? '/' : p;
}

function sourceFor(urlPath) {
  if (urlPath === '/') return path.join(SRC, 'index.html');
  const rel = urlPath.replace(/^\//, '');
  return urlPath.endsWith('/')
    ? path.join(SRC, rel, 'index.html')
    : path.join(SRC, rel);
}

const stripTags = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const seen = new Map();
let skipped = 0;

for (const [bucket, file] of BUCKETS) {
  const full = path.join(HERE, file);
  if (!fs.existsSync(full)) continue;
  readList(full).forEach((raw, i) => {
    const p = clean(raw);
    if (!p) {
      skipped++;
      return;
    }
    const entry = seen.get(p) || { path: p, buckets: [], order: {} };
    if (!entry.buckets.includes(bucket)) entry.buckets.push(bucket);
    if (entry.order[bucket] === undefined) entry.order[bucket] = i;
    seen.set(p, entry);
  });
}

const entries = [...seen.values()].map((e) => {
  const src = sourceFor(e.path);
  const exists = fs.existsSync(src);
  let words = 0;
  if (exists) words = stripTags(fs.readFileSync(src, 'utf8')).split(' ').filter(Boolean).length;
  return { ...e, exists, words };
});

const missing = entries.filter((e) => !e.exists);
const section = (p) => {
  if (p === '/') return '(home)';
  const parts = p.split('/').filter(Boolean);
  return parts.length > 1 ? '/' + parts[0] + '/' : '/(root)';
};

const report = {
  generatedAt: new Date().toISOString().slice(0, 10),
  totals: {
    urls: entries.length,
    haveSource: entries.length - missing.length,
    missing: missing.length,
    skipped,
  },
  byBucket: BUCKETS.reduce((acc, [bucket]) => {
    acc[bucket] = entries.filter((e) => e.buckets.includes(bucket)).length;
    return acc;
  }, {}),
  bySection: {},
  entries: entries.sort((a, b) => a.path.localeCompare(b.path)),
};

for (const e of entries) {
  const key = section(e.path);
  report.bySection[key] = report.bySection[key] || { total: 0, missing: 0 };
  report.bySection[key].total++;
  if (!e.exists) report.bySection[key].missing++;
}

fs.writeFileSync(OUT, JSON.stringify(report, null, 2), 'utf8');

// Build queue: missing pages, strongest signal first.
const rank = (e) => BUILD_ORDER.findIndex((b) => e.buckets.includes(b));
const queue = missing
  .map((e) => ({ path: e.path, bucket: e.buckets[rank(e)] || e.buckets[0], order: e.order[e.buckets[rank(e)]] ?? 1e9 }))
  .sort((a, b) => {
    const ra = BUILD_ORDER.indexOf(a.bucket);
    const rb = BUILD_ORDER.indexOf(b.bucket);
    return ra - rb || a.order - b.order || a.path.localeCompare(b.path);
  });
fs.writeFileSync(path.join(HERE, 'queue.json'), JSON.stringify(queue, null, 2), 'utf8');

console.log(`\nNext 10 in the queue:`);
for (const q of queue.slice(0, 10)) console.log(`  ${q.bucket.padEnd(10)} ${q.path}`);

console.log(`\nGSC inventory: ${entries.length} unique URLs`);
console.log(`  already have a source page: ${report.totals.haveSource}`);
console.log(`  still to build:             ${missing.length}`);
if (skipped) console.log(`  unparsed lines skipped:     ${skipped}`);
console.log('\nBy bucket:');
for (const [k, v] of Object.entries(report.byBucket)) console.log(`  ${k.padEnd(11)} ${v}`);
console.log('\nBy section (missing / total):');
for (const [k, v] of Object.entries(report.bySection).sort())
  console.log(`  ${k.padEnd(14)} ${String(v.missing).padStart(3)} / ${v.total}`);
console.log(`\nWrote ${path.relative(ROOT, OUT)}\n`);
