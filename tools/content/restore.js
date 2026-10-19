'use strict';

/**
 * Restore the full articles saved in .backup/pages-* for every URL that is
 * currently a noindex redirect stub.
 *
 * The backup pages were generated before a dedupe pass collapsed most of them
 * into redirects. They contain roughly 5,000 words each, but many paragraphs
 * are shared across pages. This script:
 *
 *   1. seeds the "already published" paragraph set from the live source pages;
 *   2. walks the redirect stubs in priority order (GSC-indexed first);
 *   3. keeps only paragraphs that no other page has claimed;
 *   4. writes the cleaned page with noindex/redirect removed.
 *
 * Pages that fall below the 600-word floor are reported, not written, so they
 * can be augmented with unique sections instead of shipping thin content.
 *
 * Run: node tools/content/restore.js [--apply] [--all]
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const SRC = path.join(ROOT, 'src', 'pages');
const BACKUP = path.join(ROOT, '.backup', 'pages-20261019-054623');
const INVENTORY = path.join(ROOT, 'tools', 'gsc', 'inventory.json');
const APPLY = process.argv.includes('--apply');
const INCLUDE_LOW = process.argv.includes('--all');
const MIN_WORDS = 600;

const stripTags = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#\d+;/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const words = (html) => stripTags(html).split(' ').filter(Boolean).length;
const norm = (html) =>
  stripTags(html)
    .toLowerCase()
    .replace(/[“”‘’]/g, "'")
    .replace(/[–—]/g, '-');

/** Elements the duplicate audit treats as prose. */
const ELEMENT_RE = /<(p|li|h2|h3|h4|summary|figcaption)([^>]*)>([\s\S]*?)<\/\1>/gi;

function proseTexts(html) {
  const out = [];
  for (const m of html.matchAll(ELEMENT_RE)) {
    const text = norm(m[3]);
    if (text.split(' ').length >= 10) out.push(text);
  }
  return out;
}

/** Mirror tools/duplicates.js: CTA, nav and related-reading blocks are ignored. */
function dedupeScope(html) {
  return html
    .replace(/<section class="cta-band[\s\S]*?<\/section>/gi, ' ')
    .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
    .replace(
      /<section class="section tight">\s*<div class="wrap narrow">\s*<h2>Related reading[\s\S]*?<\/section>/gi,
      ' '
    );
}

/* ------------------------------- front matter ------------------------------ */

function readFrontMatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { data: {}, body: raw };
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i < 0) continue;
    data[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { data, body: raw.slice(m[0].length) };
}

function writeFrontMatter(data) {
  const order = [
    'title',
    'desc',
    'path',
    'type',
    'h1',
    'kicker',
    'crumb',
    'section',
    'sectionUrl',
    'date',
    'updated',
    'priority',
    'schemaService',
    'generator',
  ];
  const keys = [...order.filter((k) => data[k] !== undefined), ...Object.keys(data).filter((k) => !order.includes(k))];
  return `---\n${keys.map((k) => `${k}: ${data[k]}`).join('\n')}\n---\n`;
}

/* ------------------------------- cleanup ---------------------------------- */

function cleanupSection(chunk) {
  let out = chunk;

  // Drop empty keypoint boxes.
  out = out.replace(/<div class="keypoints">([\s\S]*?)<\/div>/gi, (m, inner) =>
    /<li>/.test(inner) ? m : ''
  );

  // Drop list containers that no longer hold items.
  out = out.replace(/<ul>\s*<\/ul>/gi, '');

  // Drop sections that have no prose, list, table, figure, details or image.
  out = out.replace(
    /<section class="section tight">\s*<div class="wrap narrow">([\s\S]*?)<\/div>\s*<\/section>/gi,
    (m, inner) => (/<(p|li|table|figure|details|img)\b/i.test(inner) ? m : '')
  );

  // Collapse whitespace left behind.
  return out.replace(/\n{3,}/g, '\n\n');
}

function filterToc(html, keptIds) {
  const start = html.indexOf('<div class="toc">');
  if (start < 0) return html;
  const end = html.indexOf('</div>', start);
  if (end < 0) return html;
  const toc = html
    .slice(start, end)
    .replace(/\s*<li><a href="#([^"]+)">[\s\S]*?<\/a><\/li>/g, (m, id) =>
      keptIds.has(id) ? m : ''
    );
  return html.slice(0, start) + toc + html.slice(end);
}

/**
 * Remove every prose element whose text is already claimed. Tables are left
 * alone: duplicates.js treats table cells as data, not prose.
 */
function dedupe(body, used) {
  const claimed = new Set();
  const removedIds = new Set();
  const keptIds = new Set();

  // Track section ids as we walk so the table of contents can be pruned.
  let currentId = null;
  const sections = body.split(/(?=<h2 id=")/);
  const out = [];

  for (const chunk of sections) {
    const idMatch = chunk.match(/^<h2 id="([^"]+)"/);
    currentId = idMatch ? idMatch[1] : null;
    let keptAny = false;
    const cleaned = chunk.replace(ELEMENT_RE, (m, tag, attrs, inner) => {
      const text = norm(inner);
      const wc = text.split(' ').filter(Boolean).length;
      if (wc < 10) return m;
      if (used.has(text) || claimed.has(text)) return '';
      claimed.add(text);
      keptAny = true;
      return m;
    });
    if (currentId) {
      if (keptAny || /<(table|figure|details|img)\b/i.test(cleaned)) keptIds.add(currentId);
      else removedIds.add(currentId);
    }
    out.push(cleaned);
  }

  let html = out.join('');
  html = filterToc(html, keptIds);
  html = cleanupSection(html);

  for (const t of claimed) used.add(t);
  return { html, claimed: claimed.size, removedIds: [...removedIds] };
}

/* --------------------------------- main ----------------------------------- */

const inventory = JSON.parse(fs.readFileSync(INVENTORY, 'utf8'));
const entries = inventory.entries;

const sourceFor = (p) =>
  p === '/'
    ? path.join(SRC, 'index.html')
    : path.join(SRC, p.replace(/^\//, '').replace(/\/$/, 'index.html'));

function isStub(p) {
  const file = sourceFor(p);
  if (!fs.existsSync(file)) return false;
  return /\nredirect:\s*/.test(fs.readFileSync(file, 'utf8'));
}

// Seed with every live page that is not a redirect.
const used = new Set();
let seeded = 0;
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      walk(p);
      continue;
    }
    if (!p.endsWith('.html')) continue;
    const raw = fs.readFileSync(p, 'utf8');
    if (/\nredirect:\s*/.test(raw)) continue;
    const { body } = readFrontMatter(raw);
    for (const t of proseTexts(dedupeScope(body))) used.add(t);
    seeded++;
  }
})(SRC);

const stubs = entries
  .filter((e) => isStub(e.path) && fs.existsSync(path.join(BACKUP, e.path.replace(/^\//, ''))))
  .map((e) => {
    const raw = fs.readFileSync(path.join(BACKUP, e.path.replace(/^\//, '')), 'utf8');
    const { data, body } = readFrontMatter(raw);
    const own = proseTexts(dedupeScope(body));
    let uniqueWords = 0;
    for (const t of new Set(own)) if (!used.has(t)) uniqueWords += t.split(' ').filter(Boolean).length;
    return { ...e, data, body, uniqueWords };
  })
  .sort(
    (a, b) =>
      Number(b.buckets.includes('indexed')) - Number(a.buckets.includes('indexed')) ||
      b.uniqueWords - a.uniqueWords ||
      a.path.localeCompare(b.path)
  );

const results = [];
for (const page of stubs) {
  const { html, claimed } = dedupe(page.body, used);
  const wc = words(html);
  const data = { ...page.data };
  delete data.noindex;
  delete data.redirect;
  data.generator = 'content-system';
  delete data.titlePending;
  results.push({ ...page, html, wc, claimed, data });
}

const ready = results.filter((r) => r.wc >= MIN_WORDS);
const low = results.filter((r) => r.wc < MIN_WORDS);

if (APPLY) {
  for (const r of INCLUDE_LOW ? results : ready) {
    const out = path.join(SRC, r.path.replace(/^\//, ''));
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, writeFrontMatter(r.data) + r.html, 'utf8');
  }
}

console.log(`\nRestored candidates: ${results.length}`);
console.log(`  at/above ${MIN_WORDS} words: ${ready.length}`);
console.log(`  below ${MIN_WORDS} words: ${low.length}`);
console.log(`  seeded prose blocks from live pages: ${seeded}`);
console.log(`  indexed stubs: ${results.filter((r) => r.buckets.includes('indexed')).length}`);
console.log(
  `  indexed ready: ${ready.filter((r) => r.buckets.includes('indexed')).length} / ${results.filter((r) => r.buckets.includes('indexed')).length}`
);
if (APPLY) console.log(`  wrote ${INCLUDE_LOW ? results.length : ready.length} source page(s)`);
else console.log('\nDry run. Pass --apply to write pages at/above the floor.');

console.log('\nBelow floor:');
for (const r of low.sort((a, b) => b.wc - a.wc)) {
  console.log(`${r.wc.toString().padStart(5)}  ${r.buckets.includes('indexed') ? 'IDX' : '   '}  ${r.path}`);
}
