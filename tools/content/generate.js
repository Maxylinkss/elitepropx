'use strict';

/**
 * Generates the remaining GSC inventory pages from the structured content
 * system. Existing files are never overwritten unless --force is passed.
 *
 * Run: node tools/content/generate.js [--limit N] [--only /path.html]
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const SRC = path.join(ROOT, 'src', 'pages');
const QUEUE = path.join(ROOT, 'tools', 'gsc', 'queue.json');

const { buildSpec, fb } = require('./spec');
const { renderers, trimDesc, clampTitle } = require('./render');
const B = require('./bank');

const args = process.argv.slice(2);
const LIMIT = args.includes('--limit') ? Number(args[args.indexOf('--limit') + 1]) : Infinity;
const ONLY = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;
const FORCE = args.includes('--force');

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/&#\d+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const words = (html) => stripTags(html).split(' ').filter(Boolean).length;

const EXTRA_BY_KIND = {
  firmGuide: [
    B.sections.payout,
    B.sections.consistency,
    B.sections.psychology,
    B.sections.weekend,
    B.sections.journal,
    B.sections.checklist,
    B.sections.alternatives,
  ],
  review: [B.sections.consistency, B.sections.checklist, B.sections.psychology, B.sections.alternatives],
  comparison: [B.sections.consistency, B.sections.weekend, B.sections.checklist, B.sections.psychology],
  strategy: [
    B.sections.checklist,
    B.sections.verify,
    B.sections.weekend,
    B.sections.news,
    B.sections.journal,
    B.sections.glossary,
    B.sections.psychology,
  ],
  mechanic: [B.sections.checklist, B.sections.plan, B.sections.glossary, B.sections.psychology, B.sections.verify],
  money: [B.sections.checklist, B.sections.verify, B.sections.tax, B.sections.consistency],
  list: [B.sections.verify, B.sections.checklist, B.sections.cost, B.sections.consistency],
  servicePage: [B.sections.verify, B.sections.checklist, B.sections.cost, B.sections.consistency],
  platformPage: [B.sections.sizing, B.sections.mistakes, B.sections.checklist, B.sections.journal],
  mathPage: [B.sections.journal, B.sections.plan, B.sections.checklist],
};

const TARGET_WORDS = 4900;

const FULL_POOL = [
  B.sections.checklist,
  B.sections.verify,
  B.sections.plan,
  B.sections.sizing,
  B.sections.mistakes,
  B.sections.psychology,
  B.sections.journal,
  B.sections.glossary,
  B.sections.weekend,
  B.sections.news,
  B.sections.consistency,
  B.sections.payout,
  B.sections.cost,
  B.sections.afterPass,
  B.sections.platform,
  B.sections.targetMath,
  B.sections.drawdown,
];

function deepen(body, ctx, kind) {
  let w = words(body);
  const pool = [...(EXTRA_BY_KIND[kind] || []), ...FULL_POOL].filter(
    (fn, i, arr) => arr.indexOf(fn) === i
  );
  let added = 0;
  for (const fn of pool) {
    if (w >= TARGET_WORDS || added >= 8) break;
    const s = fn(ctx);
    if (body.includes(`id="${s.id}"`)) continue;
    body = body.replace('<h2 id="faq">', `${s.html}\n<h2 id="faq">`);
    w = words(body);
    added++;
  }
  return { body, words: w, added };
}

function frontMatter(obj) {
  const lines = ['---'];
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null || v === '') continue;
    lines.push(`${k}: ${v}`);
  }
  lines.push('---', '');
  return lines.join('\n');
}

function buildFile(spec) {
  const ctx = { ...spec.ctx };
  const renderer = renderers[spec.kind];
  if (!renderer) throw new Error(`unknown renderer: ${spec.kind}`);

  const page = renderer(ctx);

  if (spec.kind === 'redirectPage') {
    return {
      path: ctx.path,
      content: frontMatter({
        title: page.title,
        desc: page.desc,
        path: ctx.path,
        type: 'page',
        h1: page.h1,
        noindex: true,
        redirect: page.redirect,
        generator: 'content-system',
      }),
      words: 0,
      title: page.title,
      desc: page.desc,
      kind: spec.kind,
      redirect: page.redirect,
    };
  }

  // Root-level guides generated here are editorial pages, so they are typed as
  // articles to be listed on the /blog/ index and picked up by its links.
  const isArticle = true;
  const ctxSafe = { ...ctx, ...page, firm: ctx.firm || fb(ctx.slug) };
  const deepened = deepen(page.body, ctxSafe, spec.kind);

  const fm = {
    title: clampTitle(page.title),
    desc: trimDesc(page.desc),
    path: ctx.path,
    type: isArticle ? 'article' : 'page',
    h1: page.h1,
    kicker: page.kicker,
    crumb: page.crumb,
    section: page.section || 'Guides',
    sectionUrl: '/blog/',
    date: isArticle ? ctx.date : undefined,
    updated: ctx.updated || ctx.date,
    priority: ctx.priority,
    schemaService: true,
    generator: 'content-system',
  };

  return {
    path: ctx.path,
    content: frontMatter(fm) + deepened.body + '\n',
    words: deepened.words,
    added: deepened.added,
    title: page.title,
    desc: page.desc,
    kind: spec.kind,
  };
}

/* -------------------------------------------------------------------------- */
/* Duplicate removal                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Sections that explain a mechanic every page used to repeat. The explanation
 * now lives once, on its dedicated guide, and the generated pages link to it.
 * Keeping one copy is what makes the remaining pages eligible to rank on their
 * own topic instead of competing with a dozen copies of the same paragraph.
 */
const DROP_SECTIONS = new Set([
  'drawdown',
  'sizing',
  'target-math',
  'targetmath',
  'plan',
  'mistakes',
  'psychology',
  'journal',
  'glossary',
  'weekend',
  'news',
  'consistency',
  'payout',
  'cost',
  'after-pass',
  'afterpass',
  'platform',
  'tax',
  'service',
  'verify',
  'checklist',
  'alternatives',
  'faq',
]);

const ELEMENT_RE = /<(p|li|tr|figure|details)[^>]*>[\s\S]*?<\/\1>/g;
const MIN_UNIQUE_WORDS = 750;

/**
 * Archetypes whose pages are the same document with the firm name swapped.
 * The hand-written site already covers those topics in depth, so the generated
 * copies are consolidated into the existing guide rather than kept as a second
 * near-identical page.
 */
const CONSOLIDATE_KINDS = new Set(['review', 'servicePage']);

const normalise = (html) =>
  stripTags(html)
    .toLowerCase()
    .replace(/[“”‘’]/g, "'")
    .replace(/[–—]/g, '-');

function paraList(html) {
  return [
    ...html.matchAll(/<(p|li|h2|h3|td|th|summary|figcaption)[^>]*>([\s\S]*?)<\/\1>/g),
  ]
    .map((m) => normalise(m[2]))
    .filter((t) => t.split(' ').length >= 10);
}

function shingleSet(html) {
  const w = normalise(html)
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  const set = new Set();
  for (let i = 0; i + 5 <= w.length; i++) set.add(w.slice(i, i + 5).join(' '));
  return set;
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

function splitSections(body) {
  return body.split(/(?=<h2 id=")/);
}

/** Remove table-of-contents entries whose section was removed. */
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

/**
 * Return the page body with every paragraph that already appears on another
 * page removed. The base set is not mutated: the caller promotes the returned
 * set only when the page survives, so a rejected page cannot consume text.
 */
function dedupeBody(body, base) {
  const used = new Set(base);
  const out = [];
  const keptIds = new Set();

  for (const chunk of splitSections(body)) {
    const m = chunk.match(/^<h2 id="([^"]+)"/);
    if (!m) {
      // The first chunk holds the page head, the key takeaways and the table of
      // contents. Head and contents are page-specific; the takeaways repeat
      // across pages of the same archetype, so they get the same treatment.
      let first = chunk;
      if (first.includes('<div class="keypoints">')) {
        first = first.replace(/<div class="keypoints">[\s\S]*?<\/div>/, (box) => {
          const cleaned = box.replace(ELEMENT_RE, (el) => {
            const text = normalise(el);
            if (text.split(' ').length < 10) return el;
            if (used.has(text)) return '';
            used.add(text);
            return el;
          });
          return /<li>/.test(cleaned) ? cleaned : '';
        });
      }
      out.push(first);
      continue;
    }
    const id = m[1].toLowerCase();
    if (id === 'faq') {
      // The FAQ lives inside the same wrapper as the closing markup, CTA and
      // related links. Drop only the questions, never the tail of the page.
      out.push(
        chunk
          .replace(/^<h2 id="faq">[\s\S]*?<\/h2>/, '')
          .replace(/<details class="faq">[\s\S]*?<\/details>/g, '')
      );
      continue;
    }
    if (DROP_SECTIONS.has(id)) continue;

    const headingEnd = chunk.indexOf('>') + 1;
    const heading = chunk.slice(0, headingEnd);
    const rest = chunk.slice(headingEnd);
    const cleaned = rest
      .replace(ELEMENT_RE, (el) => {
        const text = normalise(el);
        if (text.split(' ').length < 10) return el;
        if (used.has(text)) return '';
        used.add(text);
        return el;
      })
      .replace(/\n{3,}/g, '\n\n');

    if (!/<(p|li|tr|figure|details)/.test(cleaned)) continue;
    out.push(heading + cleaned);
    keptIds.add(id);
  }

  return { html: filterToc(out.join(''), keptIds), used };
}

/** Topical fallback for pages that no longer have enough unique material. */
const HUBS = [
  [/(passing-service|challenge-helper|pass-my-|legit|discreet|fees-vs|cheap|passing-service-cost|passing-service-review)/, '/blog/best-prop-firm-passing-services.html'],
  [/(compare|comparison|-vs-)/, '/prop-firm-comparison-2026.html'],
  [/(drawdown|trailing|daily-loss|daily-stop)/, '/blog/prop-firm-daily-drawdown-explained.html'],
  [/(consistency)/, '/blog/prop-firm-consistency-rule-guide.html'],
  [/(payout|withdraw)/, '/blog/funded-account-payout-process.html'],
  [/(tax)/, '/blog/prop-firm-taxes-2026.html'],
  [/(weekend)/, '/blog/prop-firm-weekend-holding-rules.html'],
  [/(psychology|revenge|overtrad|discipline|failure)/, '/blog/ultimate-guide-passing-prop-firm-challenge.html'],
  [/(position-size|lot-size|risk-management|account-size|calculator)/, '/tools/prop-firm-profit-calculator.html'],
  [/(passing-service|service)/, '/blog/best-prop-firm-passing-services.html'],
  [/(review|challenge-passing|evaluation-rules|reset|account-sizes|pass-rate|funded)/, '/prop-firm-comparison-2026.html'],
];

function hubFor(url) {
  for (const [re, target] of HUBS) if (re.test(url)) return target;
  return '/blog/ultimate-guide-passing-prop-firm-challenge.html';
}

function pageFrontMatter(spec, page) {
  return frontMatter({
    title: clampTitle(page.title),
    desc: trimDesc(page.desc),
    path: spec.ctx.path,
    type: 'article',
    h1: page.h1,
    kicker: page.kicker,
    crumb: page.crumb,
    section: page.section || 'Guides',
    sectionUrl: '/blog/',
    date: spec.ctx.date,
    updated: spec.ctx.updated || spec.ctx.date,
    priority: spec.ctx.priority,
    schemaService: true,
    generator: 'content-system',
  });
}

function redirectFrontMatter(spec, page, target) {
  return frontMatter({
    title: page.title,
    desc: page.desc,
    path: spec.ctx.path,
    type: 'page',
    h1: page.h1,
    noindex: true,
    redirect: target,
    generator: 'content-system',
  });
}

function writePage(relPath, content) {
  const out = path.join(SRC, relPath.replace(/^\//, ''));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, content, 'utf8');
}

function main() {
  const queue = JSON.parse(fs.readFileSync(QUEUE, 'utf8')).sort((a, b) => a.order - b.order);
  const queuePaths = new Set(queue.map((i) => i.path));
  const failures = [];

  // Pages written by hand are the reference copy. Their paragraphs are seeded
  // first so generated pages can never repeat them.
  const hand = [];
  const seeded = new Set();
  for (const file of require('../../src/lib/walk')(SRC)) {
    const rel = '/' + path.relative(SRC, file).split(path.sep).join('/');
    if (queuePaths.has(rel)) continue;
    const raw = fs.readFileSync(file, 'utf8');
    if (/\nredirect:/.test(raw)) continue;
    const body = raw.replace(/^---[\s\S]*?---/, '');
    hand.push({ path: rel, shingles: shingleSet(body) });
    for (const t of paraList(body)) seeded.add(t);
  }

  const rendered = [];
  for (const item of queue) {
    if (ONLY && item.path !== ONLY) continue;
    try {
      const spec = buildSpec(item.path);
      if (spec.kind === 'redirectPage') {
        const page = renderers.redirectPage(spec.ctx);
        rendered.push({ item, spec, page, redirect: true });
        continue;
      }
      const page = renderers[spec.kind]({ ...spec.ctx, firm: spec.ctx.firm });
      rendered.push({
        item,
        spec,
        page,
        shingles: shingleSet(page.body),
        paras: paraList(page.body),
      });
    } catch (err) {
      failures.push({ path: item.path, error: err.message });
    }
  }

  // Pages carrying the most material that appears nowhere else are kept first,
  // so the genuinely distinct page keeps its text and the copy loses it.
  const freq = new Map();
  for (const r of rendered) {
    if (r.redirect) continue;
    for (const t of new Set(r.paras)) freq.set(t, (freq.get(t) || 0) + 1);
  }
  for (const r of rendered) {
    if (r.redirect) continue;
    r.score = r.paras.filter((t) => !seeded.has(t) && freq.get(t) === 1).length;
  }
  const ordered = rendered.filter((r) => !r.redirect).sort((a, b) => b.score - a.score);

  let used = new Set(seeded);
  const kept = [];
  const folded = [];
  for (const r of ordered) {
    if (CONSOLIDATE_KINDS.has(r.spec.kind)) {
      folded.push({ ...r, words: 0 });
      continue;
    }
    const { html, used: next } = dedupeBody(r.page.body, used);
    const w = words(html);
    if (w >= MIN_UNIQUE_WORDS) {
      kept.push({ ...r, body: html, words: w });
      used = next;
    } else {
      folded.push({ ...r, words: w });
    }
  }

  const candidates = [
    ...kept.map((k) => ({ path: k.spec.ctx.path, shingles: k.shingles })),
    ...hand,
  ];

  const results = [];
  for (const r of rendered) {
    const rel = r.spec.ctx.path;
    if (r.redirect) {
      writePage(rel, redirectFrontMatter(r.spec, r.page, r.page.redirect));
      results.push({ path: rel, words: 0, kind: 'redirectPage' });
      continue;
    }
    const keptPage = kept.find((k) => k.spec.ctx.path === rel);
    if (keptPage) {
      writePage(rel, pageFrontMatter(r.spec, r.page) + keptPage.body + '\n');
      results.push({ path: rel, words: keptPage.words, kind: r.spec.kind });
      continue;
    }
    let best = null;
    let bestSim = 0;
    for (const c of candidates) {
      if (c.path === rel) continue;
      const sim = jaccard(r.shingles, c.shingles);
      if (sim > bestSim) {
        bestSim = sim;
        best = c.path;
      }
    }
    const target = best && bestSim >= 0.15 ? best : hubFor(rel);
    writePage(rel, redirectFrontMatter(r.spec, r.page, target));
    results.push({ path: rel, words: 0, kind: 'redirect', redirect: target });
  }

  const byKind = {};
  for (const r of results) byKind[r.kind] = (byKind[r.kind] || 0) + 1;
  const wc = kept.map((k) => k.words).sort((a, b) => a - b);

  console.log(`Processed ${results.length} queued page(s).`);
  console.log(`Kept with unique content: ${kept.length}; consolidated to redirects: ${results.filter((r) => r.kind === 'redirect').length}.`);
  console.log('By archetype:', JSON.stringify(byKind));
  if (wc.length) {
    console.log(`Words: min ${wc[0]}, median ${wc[Math.floor(wc.length / 2)]}, max ${wc.at(-1)}`);
  }
  if (failures.length) {
    console.log(`\n${failures.length} failure(s):`);
    for (const f of failures) console.log(`  ${f.path}: ${f.error}`);
    process.exitCode = 1;
  }

  fs.writeFileSync(
    path.join(__dirname, 'last-run.json'),
    JSON.stringify({ generated: results, kept: kept.map((k) => ({ path: k.spec.ctx.path, words: k.words })), failures }, null, 2)
  );
  fs.writeFileSync(
    path.join(ROOT, 'tools', 'gsc', 'consolidated.json'),
    JSON.stringify(
      {
        kept: kept.map((k) => ({ path: k.spec.ctx.path, words: k.words })),
        redirects: results.filter((r) => r.kind === 'redirect').map((r) => ({ path: r.path, target: r.redirect })),
      },
      null,
      2
    )
  );
}

main();
