'use strict';

const fs = require('fs');
const path = require('path');
const walk = require('../../src/lib/walk');

const BACK = path.join(__dirname, '..', '..', '.backup', 'pages-20261019-054623');
const SRC = path.join(__dirname, '..', '..', 'src', 'pages');
const strip = (h) =>
  h
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
const norm = (h) => strip(h).toLowerCase().replace(/[“”‘’]/g, "'").replace(/[–—]/g, '-');
const words = (s) => s.split(' ').filter(Boolean).length;
const inv = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'gsc', 'inventory.json'), 'utf8'));
const indexed = inv.entries.filter((e) => e.buckets.includes('indexed')).map((e) => e.path);

const DROP = new Set([
  'drawdown', 'sizing', 'target-math', 'targetmath', 'plan', 'mistakes', 'psychology',
  'journal', 'glossary', 'weekend', 'news', 'consistency', 'payout', 'cost',
  'after-pass', 'afterpass', 'platform', 'tax', 'service', 'verify', 'checklist',
  'alternatives', 'faq',
]);

function trimBody(body) {
  const chunks = body.split(/(?=<h2 id=")/);
  const out = [];
  const keptIds = new Set();
  for (const c of chunks) {
    const m = c.match(/^<h2 id="([^"]+)"/);
    if (m && DROP.has(m[1].toLowerCase())) continue;
    out.push(c);
    if (m) keptIds.add(m[1]);
  }
  let html = out.join('');
  const s = html.indexOf('<div class="toc">');
  if (s >= 0) {
    const e = html.indexOf('</div>', s);
    if (e >= 0) {
      const toc = html
        .slice(s, e)
        .replace(/\s*<li><a href="#([^"]+)">[\s\S]*?<\/a><\/li>/g, (m, id) =>
          keptIds.has(id) ? m : ''
        );
      html = html.slice(0, s) + toc + html.slice(e);
    }
  }
  return html;
}

const seeded = new Set();
for (const f of walk(SRC)) {
  if (!f.endsWith('.html')) continue;
  const raw = fs.readFileSync(f, 'utf8');
  if (/\nredirect:/.test(raw)) continue;
  const body = raw.replace(/^---[\s\S]*?---/, '');
  for (const m of body.matchAll(/<(p|li|h2|h3|h4|summary|figcaption)[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const t = norm(m[2]);
    if (words(t) >= 10) seeded.add(t);
  }
}

const rows = [];
for (const p of indexed) {
  const rel = p === '/' ? 'index.html' : p.replace(/^\//, '').replace(/\/$/, 'index.html');
  const bf = path.join(BACK, rel);
  if (!fs.existsSync(bf)) continue;
  const raw = fs.readFileSync(bf, 'utf8');
  const body = raw.replace(/^---[\s\S]*?---/, '');
  let trimmed = trimBody(body);
  trimmed = trimmed.replace(/<(p|li|h2|h3|h4|summary|figcaption)[^>]*>([\s\S]*?)<\/\1>/gi, (m, tag, inner) => {
    const t = norm(inner);
    if (words(t) >= 10 && seeded.has(t)) return '';
    return m;
  });
  rows.push({ p, wc: words(trimmed), trimmed });
}

rows.sort((a, b) => b.wc - a.wc);
console.log('indexed pages', rows.length);
const buckets = { zero: 0, '1-299': 0, '300-599': 0, '600+': 0 };
for (const r of rows) {
  if (r.wc === 0) buckets.zero++;
  else if (r.wc < 300) buckets['1-299']++;
  else if (r.wc < 600) buckets['300-599']++;
  else buckets['600+']++;
}
console.log(buckets);
rows.forEach((r) => console.log(String(r.wc).padStart(5), r.p));
fs.writeFileSync(path.join(__dirname, 'trim-analysis.json'), JSON.stringify(rows, null, 2));
