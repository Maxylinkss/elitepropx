'use strict';

/**
 * Rebuild the GSC-indexed URLs that are still redirect stubs.
 *
 * Each page keeps only its page-specific core from the recovered backup article
 * (page head, comparison table, firm-specific analysis) and receives unique
 * sections and FAQs from tools/content/unique/*.js. Shared template sections
 * are dropped, which is what keeps two pages from competing with each other.
 *
 * Run: node tools/content/build-indexed.js [--apply] [--only /path.html]
 */

const fs = require('fs');
const path = require('path');
const walk = require('../../src/lib/walk');

const ROOT = path.join(__dirname, '..', '..');
const SRC = path.join(ROOT, 'src', 'pages');
const BACKUP = path.join(ROOT, '.backup', 'pages-20261019-054623');
const INVENTORY = path.join(ROOT, 'tools', 'gsc', 'inventory.json');
const UNIQUE = path.join(__dirname, 'unique');
const APPLY = process.argv.includes('--apply');
const FORCE = process.argv.includes('--force');
const ONLY_RAW = process.argv.includes('--only')
  ? process.argv[process.argv.indexOf('--only') + 1]
  : null;
const ONLY = ONLY_RAW ? (ONLY_RAW.startsWith('/') ? ONLY_RAW : '/' + ONLY_RAW) : null;

const MIN_WORDS = 600;

const DEFAULT_TAIL = `
<section class="cta-band">
  <div class="wrap cta-band-inner">
    <div>
      <h2>Want the rulebook traded for you?</h2>
      <p>Flat <strong>$220</strong>, any firm, any account size, retries covered. We read the terms before accepting the job.</p>
    </div>
    <a class="btn btn-primary" href="/contact.html">Start an evaluation</a>
  </div>
</section>
<section class="section tight">
  <div class="wrap narrow">
    <h2>Related reading</h2>
    <ul class="link-list">
      <li><a href="/passed-challenges.html">Passed challenges and certificates</a></li>
      <li><a href="/reviews/best-prop-firm-passing-service-2026.html">Best prop firm passing service 2026</a></li>
      <li><a href="/blog/best-prop-firm-passing-services.html">Passing services compared</a></li>
      <li><a href="/">ElitePropX home</a></li>
    </ul>
    <p class="disclaimer">ElitePropX is an independent service and is not affiliated with, endorsed by or sponsored by any proprietary trading firm. Rules, fees and payout terms change; verify every figure against the firm's own terms before purchasing an evaluation. Trading involves substantial risk of loss.</p>
  </div>
</section>
`;

const strip = (h) =>
  h
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
const norm = (h) => strip(h).toLowerCase().replace(/[“”‘’]/g, "'").replace(/[–—]/g, '-');
const words = (h) => strip(h).split(' ').filter(Boolean).length;
const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/* ------------------------------ authored data ------------------------------ */

const authored = {};
for (const file of fs.existsSync(UNIQUE) ? fs.readdirSync(UNIQUE) : []) {
  if (!file.endsWith('.js') || file === 'index.js') continue;
  Object.assign(authored, require(path.join(UNIQUE, file)));
}

/* ------------------------------- base page -------------------------------- */

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

/** Split off the standard CTA and related-reading tail so unique sections can be inserted before it. */
function splitTail(body) {
  const cta = body.indexOf('<section class="cta-band"');
  if (cta < 0) return { main: body, tail: '' };
  return { main: body.slice(0, cta), tail: body.slice(cta) };
}

function trimBase(body) {
  const { main, tail } = splitTail(body);
  const chunks = main.split(/(?=<h2 id=")/);
  const kept = [];
  const keptIds = [];
  for (const c of chunks) {
    const m = c.match(/^<h2 id="([^"]+)"/);
    if (m && DROP.has(m[1].toLowerCase())) continue;
    kept.push(c);
    if (m) keptIds.push(m[1]);
  }
  return { html: kept.join(''), tail, keptIds };
}

function filterToc(html, ids) {
  const start = html.indexOf('<div class="toc">');
  if (start < 0) return html;
  const end = html.indexOf('</div>', start);
  if (end < 0) return html;
  const toc = html
    .slice(start, end)
    .replace(/\s*<li><a href="#([^"]+)">[\s\S]*?<\/a><\/li>/g, (m, id) => (ids.has(id) ? m : ''));
  return html.slice(0, start) + toc + html.slice(end);
}

/** Remove prose blocks that already exist elsewhere on the site. */
function dedupe(html, used) {
  const claimed = new Set();
  const out = html.replace(
    /<(p|li|h2|h3|h4|summary|figcaption)[^>]*>([\s\S]*?)<\/\1>/gi,
    (m, tag, inner) => {
      const t = norm(inner);
      if (t.split(' ').filter(Boolean).length < 10) return m;
      if (used.has(t) || claimed.has(t)) return '';
      claimed.add(t);
      return m;
    }
  );
  for (const t of claimed) used.add(t);
  return out;
}

function cleanup(html) {
  return html
    .replace(/<div class="keypoints">([\s\S]*?)<\/div>/gi, (m, inner) => (/<li>/.test(inner) ? m : ''))
    .replace(/<ul>\s*<\/ul>/gi, '')
    .replace(/<section class="section tight">\s*<div class="wrap narrow">([\s\S]*?)<\/div>\s*<\/section>/gi, (m, inner) => (/<(p|li|table|figure|details|img)\b/i.test(inner) ? m : ''))
    .replace(/\n{3,}/g, '\n\n');
}

function slugId(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function uniqueMarkup(entry) {
  const sections = (entry.sections || [])
    .map(
      (s) => `\n<h2 id="${slugId(s.h2)}">${esc(s.h2)}</h2>\n${s.html}\n`
    )
    .join('\n');
  const faq = (entry.faq || [])
    .map(
      (f) =>
        `\n<details class="faq"><summary>${esc(f.q)}</summary><div class="faq-a"><p>${f.a}</p></div></details>`
    )
    .join('\n');
  const faqBlock = faq
    ? `\n<section class="section tight">\n  <div class="wrap narrow">\n    <h2 id="questions">Common questions</h2>\n${faq}\n  </div>\n</section>\n`
    : '';
  return { sections, faqBlock, ids: (entry.sections || []).map((s) => slugId(s.h2)).concat(faq ? ['questions'] : []) };
}

/* ---------------------------------- main ---------------------------------- */

const inv = JSON.parse(fs.readFileSync(INVENTORY, 'utf8'));
const indexed = new Set(
  inv.entries.filter((e) => e.buckets.includes('indexed')).map((e) => e.path)
);

const isStub = (p) => {
  const f = p === '/' ? path.join(SRC, 'index.html') : path.join(SRC, p.replace(/^\//, '').replace(/\/$/, 'index.html'));
  if (!fs.existsSync(f)) return false;
  return /\nredirect:/.test(fs.readFileSync(f, 'utf8'));
};

// Seed with live pages so an authored paragraph cannot repeat one already published.
const used = new Set();
for (const f of walk(SRC)) {
  if (!f.endsWith('.html')) continue;
  const raw = fs.readFileSync(f, 'utf8');
  if (/\nredirect:/.test(raw)) continue;
  if (FORCE && ONLY) {
    const rel = '/' + path.relative(SRC, f).split(path.sep).join('/');
    if (rel === ONLY) continue;
  }
  const { body } = readFrontMatter(raw);
  for (const m of body.matchAll(/<(p|li|h2|h3|h4|summary|figcaption)[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const t = norm(m[2]);
    if (words(t) >= 10) used.add(t);
  }
}

const results = [];
if (process.env.DEBUG_BUILD) console.error({ indexed: indexed.size, ONLY, stub: ONLY ? isStub(ONLY) : null });
for (const p of [...indexed].sort()) {
  if (ONLY && p !== ONLY) continue;
  if (!FORCE && !isStub(p)) continue;
  const entry = authored[p];
  if (!entry) {
    results.push({ path: p, status: 'no authored entry', wc: 0 });
    continue;
  }
  const backupFile = path.join(BACKUP, p.replace(/^\//, ''));
  if (!fs.existsSync(backupFile)) {
    results.push({ path: p, status: 'no backup source', wc: 0 });
    continue;
  }
  const { data, body } = readFrontMatter(fs.readFileSync(backupFile, 'utf8'));
  const { html: base, tail: rawTail, keptIds } = trimBase(body);
  const tail = rawTail.trim() ? rawTail : DEFAULT_TAIL;
  let html = cleanup(dedupe(base, used));
  if (entry.head && !/<h1[\s>]/i.test(html)) {
    html = `<section class="page-head">\n  <div class="wrap narrow">\n    <p class="kicker">${esc(entry.head.kicker || entry.head.h1)} · reviewed October 2026</p>\n    <h1>${esc(entry.head.h1)}</h1>\n    <p class="lede">${entry.head.lede}</p>\n  </div>\n</section>\n` + html;
  }
  const unique = uniqueMarkup(entry);
  html = html.replace(/<div class="toc">[\s\S]*?<\/div>/, (toc) => toc); // keep for now
  // Rebuild the contents list for kept base sections plus authored sections.
  const idSet = new Set([...keptIds, ...unique.ids]);
  html = filterToc(html, idSet);
  // Insert authored sections before the CTA tail.
  html = html + '\n' + unique.sections + '\n' + unique.faqBlock + '\n' + tail;
  html = cleanup(html);

  const meta = {
    ...data,
    title: (entry.head && entry.head.title) || data.title,
    desc: (entry.head && entry.head.desc) || data.desc,
    h1: (entry.head && entry.head.h1) || data.h1,
    type: 'article',
    date: data.date || '2026-10-19',
    updated: '2026-10-19',
    priority: data.priority || '0.7',
    schemaService: 'true',
    generator: 'content-system',
  };
  delete meta.noindex;
  delete meta.redirect;

  const wc = words(html);
  results.push({ path: p, status: wc >= MIN_WORDS ? 'ready' : 'thin', wc, html, meta });
}

const ready = results.filter((r) => r.status === 'ready');
if (APPLY) {
  for (const r of ready) {
    const out = path.join(SRC, r.path.replace(/^\//, ''));
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, fm(r.meta) + r.html, 'utf8');
  }
}

console.log(`Indexed stubs: ${results.length}`);
console.log(`  ready: ${ready.length}`);
console.log(`  thin: ${results.filter((r) => r.status === 'thin').length}`);
console.log(`  missing authored data: ${results.filter((r) => r.status === 'no authored entry').length}`);
if (APPLY) console.log(`  wrote ${ready.length}`);
console.log('');
for (const r of results) {
  console.log(`${String(r.wc).padStart(5)} ${r.status.padEnd(20)} ${r.path}`);
}
