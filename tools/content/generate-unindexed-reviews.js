'use strict';

/**
 * Rebuild the unindexed firm-review stubs from the verdict table each backup
 * article already contains. The page head, key takeaways and verdict table are
 * page-specific; the shared template sections are dropped. Two unique analysis
 * sections and two FAQs are then generated from that review's own answers.
 *
 * Run: node tools/content/generate-unindexed-reviews.js [--apply]
 */

const fs = require('fs');
const path = require('path');
const walk = require('../../src/lib/walk');

const ROOT = path.join(__dirname, '..', '..');
const SRC = path.join(ROOT, 'src', 'pages');
const BACKUP = path.join(ROOT, '.backup', 'pages-20261019-054623');
const INVENTORY = path.join(ROOT, 'tools', 'gsc', 'inventory.json');
const APPLY = process.argv.includes('--apply');

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

function verdictFacts(body) {
  const first = body.slice(0, body.indexOf('</table>'));
  const out = {};
  for (const m of first.matchAll(/<tr><td>([^<]+)<\/td><td>([^<]*)<\/td><\/tr>/g)) {
    out[m[1].replace(/\?$/, '').trim()] = m[2].trim();
  }
  return out;
}

function headAndVerdict(body) {
  const sections = body.split(/(?=<h2 id=")/);
  const keep = [sections[0]];
  const verdict = sections.find((s) => /^<h2 id="verdict"/.test(s));
  if (verdict) keep.push(verdict);
  return keep.join('');
}

function tailOf(body) {
  const i = body.indexOf('<section class="cta-band"');
  return i >= 0 ? body.slice(i) : '';
}

function clean(html) {
  return html
    .replace(/<div class="toc">[\s\S]*?<\/div>/, '')
    .replace(/<div class="keypoints">([\s\S]*?)<\/div>/gi, (m, inner) => (/<li>/.test(inner) ? m : ''))
    .replace(/\n{3,}/g, '\n\n');
}

function sections(f) {
  const firm = (f.firm || 'this firm').replace(/\s+Review$/, '');
  const who = f['Who is it for'] || 'traders whose method matches the plan';
  const strong = f['What is the strongest feature'] || 'a clear rulebook';
  const caution = f['What is the biggest caution'] || 'the terms can change between plans';
  const billing = f['How is it billed'] || 'one-off per attempt';
  const payout = f['How does it pay'] || 'a fixed payout cycle';

  return [
    {
      h2: 'What the verdict table leaves out',
      html: `<p>The table answers who ${firm} is for, but it does not show how that answer changes the first trade. The strongest feature is ${strong.toLowerCase()}. In practice that means the rule should be visible in the position size, not just in the review: a static floor allows a fixed dollar risk, while a trailing floor requires the risk to fall after a new equity high. A trader who reads the feature as a slogan rather than a sizing rule will still breach a floor they understood in principle.</p>
<p>The caution is ${caution.toLowerCase()}. That is the row to test against your own method before paying. If the plan is billed ${billing.toLowerCase()} and pays ${payout.toLowerCase()}, the cost of a slow attempt depends on how the billing rhythm interacts with the calendar. A one-off fee makes patience free; a subscription makes every extra week part of the price. Neither is a reason to avoid ${firm}; both change the expected cost of the attempt.</p>`,
    },
    {
      h2: 'A first attempt that fits this rulebook',
      html: `<p>Start with a $100,000 account and a risk unit of 0.5%, or $500 per trade. Write the total loss allowance and the daily stop in dollars before the first entry. If the plan uses a static floor, the $500 unit stays valid for the whole attempt; if it trails, recalculate the remaining room after every new high and cut the size when the room falls below five times the unit. The first week should be a measurement week: take only the setups the journal already supports and record the remaining room beside every entry.</p>
<p>The second week is for calibration. Compare the intended risk with the realised risk and drop any setup whose stop distance forces a size the floor cannot support. The third week is the first push toward the target, with the size fixed at the calibrated unit. If the target is reached before the calendar allows a payout, stop trading or use the smallest permitted size to satisfy any activity rule. The account is the asset; the target is only the gate.</p>
<p>Before the first trade, confirm the exact wording of the billing and payout answers above. A review is a map, not the contract. The firm's own plan page, saved with a date, is the version that applies if a term changes between cohorts.</p>`,
    },
  ];
}

function faq(f) {
  const firm = (f.firm || 'this firm').replace(/\s+Review$/, '');
  const billing = f['How is it billed'] || 'one-off per attempt';
  const payout = f['How does it pay'] || 'a fixed payout cycle';
  const caution = f['What is the biggest caution'] || 'the terms can change between plans';
  return [
    {
      q: `Is ${firm} a good fit for a first evaluation?`,
      a: `${firm} fits ${(f['Who is it for'] || 'traders whose method matches the plan').toLowerCase()}. A first evaluation is usually better served by a simple rulebook and a small account, so confirm that the plan you would buy has the floor and payout terms you can explain from memory before treating it as a beginner product.`,
    },
    {
      q: `How does ${firm} charge and pay?`,
      a: `${firm} is billed ${billing.toLowerCase()} and pays ${payout.toLowerCase()}. Compare the total across the number of attempts you realistically expect, not the first payment, because the billing rhythm and the payout cycle decide the net cost.`,
    },
    {
      q: `What is the main risk with ${firm}?`,
      a: `The main caution is ${caution.toLowerCase()}. Read the plan page for the exact rule, save a dated copy and test the rule against your last fifty trades before buying. A caution that does not interact with your method is not a reason to avoid the firm.`,
    },
  ];
}

function faqBlock(items) {
  return `\n<section class="section tight">\n  <div class="wrap narrow">\n    <h2 id="questions">Common questions</h2>\n${items
    .map(
      (x) =>
        `<details class="faq"><summary>${x.q}</summary><div class="faq-a"><p>${x.a}</p></div></details>`
    )
    .join('\n')}\n  </div>\n</section>\n`;
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

const results = [];
for (const e of inv.entries) {
  if (e.buckets.includes('indexed')) continue;
  if (!/-review(-2026)?\.html$/.test(e.path)) continue;
  const src = path.join(SRC, e.path.replace(/^\//, ''));
  if (!fs.existsSync(src) || !/\nredirect:/.test(fs.readFileSync(src, 'utf8'))) continue;
  const bf = path.join(BACKUP, e.path.replace(/^\//, ''));
  if (!fs.existsSync(bf)) continue;
  const { data, body } = readFrontMatter(fs.readFileSync(bf, 'utf8'));
  const facts = verdictFacts(body);
  const firm = (data.title || '').replace(/\s+Review 2026.*$/, '').trim();
  facts.firm = firm;
  let html = clean(headAndVerdict(body));
  const secs = sections(facts);
  const fq = faq(facts);
  html += `\n${secs.map((s) => `<h2 id="${s.h2.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}">${s.h2}</h2>\n${s.html}`).join('\n')}\n`;
  html += faqBlock(fq);
  html += tailOf(body);
  const meta = { ...data, type: 'article', updated: '2026-10-19', generator: 'content-system' };
  delete meta.noindex;
  delete meta.redirect;
  results.push({ path: e.path, html, wc: words(html), meta });
}

console.log(`Unindexed reviews: ${results.length}`);
for (const r of results) console.log(`${String(r.wc).padStart(5)} ${r.path}`);
if (APPLY) {
  for (const r of results) {
    const out = path.join(SRC, r.path.replace(/^\//, ''));
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, fm(r.meta) + r.html, 'utf8');
  }
  console.log(`wrote ${results.length}`);
}
