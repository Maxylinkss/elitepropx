'use strict';

/**
 * Restore the unindexed GSC stubs that already contain enough page-specific
 * material in the recovered backup article. Shared template sections are
 * dropped, so only copy that belongs to the URL survives.
 *
 * Run: node tools/content/restore-unindexed.js [--apply] [--min 600]
 */

const fs = require('fs');
const path = require('path');
const walk = require('../../src/lib/walk');

const ROOT = path.join(__dirname, '..', '..');
const SRC = path.join(ROOT, 'src', 'pages');
const BACKUP = path.join(ROOT, '.backup', 'pages-20261019-054623');
const INVENTORY = path.join(ROOT, 'tools', 'gsc', 'inventory.json');
const APPLY = process.argv.includes('--apply');
const MIN = process.argv.includes('--min')
  ? Number(process.argv[process.argv.indexOf('--min') + 1])
  : 600;

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
const words = (h) => strip(h).split(' ').filter(Boolean).length;

const DROP = new Set([
  'drawdown', 'sizing', 'target-math', 'targetmath', 'plan', 'mistakes',
  'psychology', 'journal', 'glossary', 'weekend', 'news', 'consistency',
  'payout', 'cost', 'after-pass', 'afterpass', 'platform', 'tax', 'service',
  'verify', 'checklist', 'alternatives', 'faq',
]);

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

function fm(data) {
  const order = ['title', 'desc', 'path', 'type', 'h1', 'kicker', 'crumb', 'section', 'sectionUrl', 'date', 'updated', 'priority', 'schemaService', 'generator'];
  const keys = [...order.filter((k) => data[k] !== undefined), ...Object.keys(data).filter((k) => !order.includes(k))];
  return `---\n${keys.map((k) => `${k}: ${data[k]}`).join('\n')}\n---\n`;
}

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
        .replace(/\s*<li><a href="#([^"]+)">[\s\S]*?<\/a><\/li>/g, (m, id) => (keptIds.has(id) ? m : ''));
      html = html.slice(0, s) + toc + html.slice(e);
    }
  }
  return html;
}

const inv = JSON.parse(fs.readFileSync(INVENTORY, 'utf8'));
const used = new Set();
for (const f of walk(SRC)) {
  if (!f.endsWith('.html')) continue;
  const raw = fs.readFileSync(f, 'utf8');
  if (/\nredirect:/.test(raw)) continue;
  const { body } = readFrontMatter(raw);
  for (const m of body.matchAll(/<(p|li|h2|h3|h4|summary|figcaption)[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const t = norm(m[2]);
    if (words(t) >= 10) used.add(t);
  }
}

const candidates = [];
for (const e of inv.entries) {
  if (e.buckets.includes('indexed')) continue;
  const src = e.path === '/' ? path.join(SRC, 'index.html') : path.join(SRC, e.path.replace(/^\//, '').replace(/\/$/, 'index.html'));
  if (!fs.existsSync(src) || !/\nredirect:/.test(fs.readFileSync(src, 'utf8'))) continue;
  const bf = path.join(BACKUP, e.path.replace(/^\//, ''));
  if (!fs.existsSync(bf)) continue;
  const { data, body } = readFrontMatter(fs.readFileSync(bf, 'utf8'));
  let html = trimBody(body).replace(
    /<(p|li|h2|h3|h4|summary|figcaption)[^>]*>([\s\S]*?)<\/\1>/gi,
    (m, tag, inner) => {
      const t = norm(inner);
      if (words(t) >= 10 && used.has(t)) return '';
      return m;
    }
  );
  const wc = words(html);
  candidates.push({ path: e.path, html, wc, data });
}

candidates.sort((a, b) => b.wc - a.wc);
const ready = candidates.filter((c) => c.wc >= MIN);
const low = candidates.filter((c) => c.wc < MIN);

if (APPLY) {
  for (const c of ready) {
    const out = path.join(SRC, c.path.replace(/^\//, ''));
    const meta = { ...c.data, type: 'article', updated: '2026-10-19', generator: 'content-system' };
    delete meta.noindex;
    delete meta.redirect;
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, fm(meta) + c.html, 'utf8');
  }
}

console.log(`Unindexed candidates: ${candidates.length}`);
console.log(`  at/above ${MIN} words: ${ready.length}`);
console.log(`  below ${MIN}: ${low.length}`);
if (APPLY) console.log(`  wrote ${ready.length}`);
console.log('\nReady:');
for (const c of ready) console.log(`${String(c.wc).padStart(5)} ${c.path}`);
