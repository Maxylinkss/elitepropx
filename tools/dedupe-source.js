'use strict';

/**
 * Source-level duplicate cleanup.
 *
 * Walks src/pages in canonical order (hand-written pages first, then the
 * generated pages that survived consolidation), and removes a prose element
 * when the same text already appears on an earlier page. The first page keeps
 * the paragraph, the later copy loses it, so every paragraph has exactly one
 * home. List wrappers and callouts left empty by a removal are removed too.
 *
 * Run: node tools/dedupe-source.js [--dry]
 */

const fs = require('fs');
const path = require('path');
const walk = require('../src/lib/walk');

const SRC = path.join(__dirname, '..', 'src', 'pages');
const QUEUE = path.join(__dirname, 'gsc', 'queue.json');
const DRY = process.argv.includes('--dry');

const strip = (html) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#\d+;/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const norm = (html) =>
  strip(html)
    .toLowerCase()
    .replace(/[“”‘’]/g, "'")
    .replace(/[–—]/g, '-');

const PROSE_RE = /<(p|li|h2|h3|h4|summary|figcaption)([^>]*)>([\s\S]*?)<\/\1>/g;

function cleanEmpty(html) {
  return html
    .replace(/<ul>\s*<\/ul>/g, '')
    .replace(/<ol>\s*<\/ol>/g, '')
    .replace(/<div class="callout">\s*<\/div>/g, '')
    .replace(/<div class="keypoints">\s*<\/div>/g, '');
}

const queue = JSON.parse(fs.readFileSync(QUEUE, 'utf8')).map((i) => i.path);
const queueSet = new Set(queue);

const files = walk(SRC)
  .map((file) => ({
    file,
    rel: '/' + path.relative(SRC, file).split(path.sep).join('/'),
  }))
  .sort((a, b) => {
    const ag = queueSet.has(a.rel) ? 1 : 0;
    const bg = queueSet.has(b.rel) ? 1 : 0;
    if (ag !== bg) return ag - bg;
    return a.rel.localeCompare(b.rel);
  });

// Listing pages reproduce short summaries by design; they are handled by the
// build from each page's unique meta description, not from article prose.
const SKIP = new Set(['/index.html', '/blog/index.html']);

const used = new Map();
let removed = 0;
const touched = [];

for (const { file, rel } of files) {
  if (SKIP.has(rel)) continue;
  const raw = fs.readFileSync(file, 'utf8');
  if (/\nredirect:/.test(raw)) continue;
  const fmEnd = raw.indexOf('\n---', 4);
  if (fmEnd < 0) continue;
  const head = raw.slice(0, fmEnd + 4);
  let body = raw.slice(fmEnd + 4);

  if (body.includes('<details')) {
    body = body.replace(/<details class="faq">[\s\S]*?<\/details>/g, (block) => {
      const summary = (block.match(/<summary>([\s\S]*?)<\/summary>/) || [])[1] || '';
      const text = norm(summary);
      if (text.split(' ').length >= 10 && used.has(text)) {
        removed++;
        return '';
      }
      return block;
    });
  }

  const next = body.replace(PROSE_RE, (m, tag, attrs, inner) => {
    const text = norm(inner);
    if (text.split(' ').length < 10) return m;
    if (used.has(text)) {
      removed++;
      return '';
    }
    used.set(text, rel);
    return m;
  });

  const cleaned = cleanEmpty(next);
  if (cleaned !== body) {
    touched.push(rel);
    if (!DRY) fs.writeFileSync(file, head + cleaned, 'utf8');
  }
}

console.log(`${DRY ? 'Would remove' : 'Removed'} ${removed} duplicate block(s) across ${touched.length} page(s).`);
for (const rel of touched) console.log(`  ${rel}`);
