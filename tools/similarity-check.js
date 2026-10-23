'use strict';

/**
 * Pairwise 5-word-shingle similarity across every indexable page in src/pages.
 * Redirect stubs and noindex pages are excluded. Prints pairs above the
 * threshold so a merge decision is based on measured overlap, not file names.
 * Run: node tools/similarity-check.js [threshold]
 */

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'src', 'pages');
const THRESHOLD = Number(process.argv[2] || 0.1);

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

const pages = [];
for (const file of walk(SRC)) {
  const raw = fs.readFileSync(file, 'utf8');
  const fm = raw.split('---')[1] || '';
  if (/^redirect:/m.test(fm) || /^noindex:/m.test(fm)) continue;

  const body = raw
    .split('---')
    .slice(2)
    .join('---')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = body.split(' ').filter(Boolean);
  const set = new Set();
  for (let i = 0; i + 5 <= words.length; i++) set.add(words.slice(i, i + 5).join(' '));
  pages.push({ file: path.relative(SRC, file).split(path.sep).join('/'), set, size: set.size });
}

const pairs = [];
for (let i = 0; i < pages.length; i++) {
  for (let j = i + 1; j < pages.length; j++) {
    const a = pages[i];
    const b = pages[j];
    const [small, large] = a.size < b.size ? [a, b] : [b, a];
    let inter = 0;
    for (const k of small.set) if (large.set.has(k)) inter++;
    const jac = inter / (small.size + large.size - inter);
    if (jac > THRESHOLD) pairs.push({ jac: +jac.toFixed(3), a: a.file, b: b.file });
  }
}

pairs.sort((x, y) => y.jac - x.jac);
console.log(`live indexable pages compared: ${pages.length}`);
console.log(`pairs above ${THRESHOLD}: ${pairs.length}`);
pairs.forEach((p) => console.log(`  ${p.jac}  ${p.a}  <->  ${p.b}`));
