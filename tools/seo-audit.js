'use strict';

/**
 * Site-wide SEO audit over docs/.
 *
 * Checks the things tools/check.js does not: title and description uniqueness,
 * self-referencing canonicals, robots directives, heading order, image alt
 * quality, internal link counts, social-card files, structured-data fields and
 * sitemap metadata. Run: node tools/seo-audit.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');
const SITE = 'https://elitepropx.com';

// Directory indexes are published at their directory URL, not at index.html.
const publicRel = (p) =>
  p === '/index.html' ? '/' : p.endsWith('/index.html') ? p.slice(0, -'index.html'.length) : p;

function walk(d) {
  const out = [];
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const files = walk(DOCS).filter((f) => !f.includes(path.sep + 'assets' + path.sep));
const attr = (html, re) => {
  const m = html.match(re);
  return m ? m[1] : null;
};

const problems = [];
const warn = [];
const titles = new Map();
const descs = new Map();
const indexable = [];

for (const file of files) {
  const rel = '/' + path.relative(DOCS, file).split(path.sep).join('/');
  const html = fs.readFileSync(file, 'utf8');
  const is404 = rel === '/404.html';
  const isRedirect = /http-equiv="refresh"/i.test(html);
  const P = (m) => problems.push(`${rel}: ${m}`);
  const W = (m) => warn.push(`${rel}: ${m}`);

  if (isRedirect) {
    const target = attr(html, /content="0; url=([^"]+)"/i);
    const canon = attr(html, /<link rel="canonical" href="([^"]+)"/i);
    if (!target) P('redirect without target');
    else if (!fs.existsSync(path.join(DOCS, target.replace(/^\//, '')))) P(`redirect target missing: ${target}`);
    if (!/noindex/.test(html)) P('redirect is indexable');
    if (!canon || !canon.endsWith(target)) P('redirect canonical mismatch');
    continue;
  }

  const robots = attr(html, /<meta name="robots" content="([^"]*)"/i) || '';
  const noindex = /noindex/.test(robots);
  if (!noindex) indexable.push(rel);
  if (!is404 && !noindex && !/index/.test(robots)) P('missing index directive');

  // <html lang>
  if (!/<html lang="en"/.test(html)) P('missing html lang="en"');
  if (!/<meta name="viewport"/.test(html)) P('missing viewport');

  // Title
  const title = attr(html, /<title>([\s\S]*?)<\/title>/i);
  if (!title) P('missing title');
  else {
    if (title.length < 20 || title.length > 70) P(`title length ${title.length}`);
    if (!noindex) {
      if (titles.has(title)) P(`duplicate title with ${titles.get(title)}`);
      else titles.set(title, rel);
    }
  }

  // Description
  const desc = attr(html, /<meta name="description" content="([^"]*)"/i);
  if (!desc) P('missing description');
  else {
    if (desc.length < 70 || desc.length > 165) P(`description length ${desc.length}`);
    if (!noindex) {
      if (descs.has(desc)) P(`duplicate description with ${descs.get(desc)}`);
      else descs.set(desc, rel);
    }
  }

  // Canonical must be absolute and self-referencing
  const canon = attr(html, /<link rel="canonical" href="([^"]+)"/i);
  if (!canon) P('missing canonical');
  else {
    if (!canon.startsWith(SITE)) P(`canonical not absolute: ${canon}`);
    const expect = SITE + publicRel(rel);
    if (canon !== expect) P(`canonical mismatch: ${canon} (expected ${expect})`);
  }

  // Social cards
  const og = attr(html, /<meta property="og:image" content="([^"]+)"/i);
  if (!og) P('missing og:image');
  else {
    const rel2 = og.replace(SITE, '').replace(/^\//, '');
    if (!/^https?:/.test(og) || !fs.existsSync(path.join(DOCS, rel2))) P(`og:image missing file: ${og}`);
  }
  for (const tag of ['og:type', 'og:title', 'og:description', 'og:url', 'og:site_name', 'twitter:card', 'twitter:image']) {
    if (!new RegExp(`(property|name)="${tag}"`).test(html)) P(`missing ${tag}`);
  }

  // Headings
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => m[1].replace(/<[^>]+>/g, '').trim());
  if (!is404 && h1s.length !== 1) P(`${h1s.length} h1 tags`);
  const headOrder = [...html.matchAll(/<h([1-6])[\s>]/gi)].map((m) => Number(m[1]));
  let level = 0;
  for (const h of headOrder) {
    if (h > level + 1 && level !== 0) {
      P(`heading jump h${level} → h${h}`);
      break;
    }
    level = h;
  }
  const h2Count = headOrder.filter((h) => h === 2).length;
  if (!is404 && h2Count < 6) W(`only ${h2Count} h2 headings`);

  // Images
  for (const m of html.matchAll(/<img[^>]*>/g)) {
    const tag = m[0];
    const alt = attr(tag, /alt="([^"]*)"/);
    if (alt === null) P(`image without alt: ${tag.slice(0, 60)}`);
    else if (!alt.trim()) P(`image with empty alt: ${tag.slice(0, 60)}`);
    if (!/width="/.test(tag) || !/height="/.test(tag)) P(`image without dimensions: ${tag.slice(0, 60)}`);
    if (!/loading="/.test(tag)) W('image without loading attribute');
  }

  // Links
  const mainHtml = attr(html, /<main[\s\S]*?<\/main>/i) || html;
  const internal = [...mainHtml.matchAll(/href="(\/[^"#?]*)"/g)].length;
  if (!is404 && internal < 5) W(`only ${internal} internal links in main`);
  for (const m of html.matchAll(/<a[^>]*>([^<]{2,})<\/a>/g)) {
    const text = m[1].trim().toLowerCase();
    if (['click here', 'here', 'read more', 'more', 'link'].includes(text)) W(`generic anchor text: "${m[1]}"`);
  }

  // Structured data
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const types = [];
  for (const b of blocks) {
    try {
      const data = JSON.parse(b[1]);
      types.push(data['@type']);
      if (data['@type'] === 'BlogPosting' || data['@type'] === 'WebPage') {
        for (const field of ['headline', 'description', 'datePublished', 'dateModified', 'wordCount', 'mainEntityOfPage', 'author', 'publisher']) {
          if (field !== 'wordCount' || data['@type'] === 'BlogPosting') {
            if (data[field] === undefined) P(`JSON-LD ${data['@type']} missing ${field}`);
          }
        }
        if (data.wordCount && data.wordCount < 800) W(`JSON-LD wordCount ${data.wordCount} is low`);
      }
      if (data['@type'] === 'BreadcrumbList' && (!data.itemListElement || data.itemListElement.length < 2)) {
        P('breadcrumb list too short');
      }
    } catch (e) {
      P(`invalid JSON-LD: ${e.message}`);
    }
  }
  if (!is404 && blocks.length < 3) P(`${blocks.length} JSON-LD blocks`);
  const faq = blocks.find((b) => /"@type":"FAQPage"/.test(b[1]));
  if (faq) {
    const data = JSON.parse(faq[1]);
    if (!data.mainEntity || data.mainEntity.length < 3) P('FAQPage with fewer than 3 questions');
  } else if (!is404) {
    // The 404 page is noindex and carries no FAQ markup by design.
    W('no FAQPage structured data');
  }
}

// sitemap sanity
const sitemap = fs.readFileSync(path.join(DOCS, 'sitemap.xml'), 'utf8');
const entries = [...sitemap.matchAll(/<url>[\s\S]*?<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>[\s\S]*?<priority>([^<]+)<\/priority>[\s\S]*?<\/url>/g)];
for (const e of entries) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(e[2])) problems.push(`sitemap: bad lastmod ${e[2]} for ${e[1]}`);
  const pr = Number(e[3]);
  if (!(pr > 0 && pr <= 1)) problems.push(`sitemap: bad priority ${e[3]} for ${e[1]}`);
}
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, '') || '/');
const indexableSet = new Set(indexable.map(publicRel));
const notInSitemap = [...indexableSet].filter((p) => !sitemapUrls.includes(p));
if (notInSitemap.length) problems.push(`sitemap missing ${notInSitemap.length} indexable pages: ${notInSitemap.slice(0, 5)}`);
const notIndexable = sitemapUrls.filter((u) => !indexableSet.has(u));
if (notIndexable.length) problems.push(`sitemap lists ${notIndexable.length} non-indexable pages: ${notIndexable.slice(0, 5)}`);

// robots.txt
const robotsTxt = fs.readFileSync(path.join(DOCS, 'robots.txt'), 'utf8');
if (!/Sitemap: https:\/\/elitepropx\.com\/sitemap\.xml/.test(robotsTxt)) problems.push('robots.txt missing sitemap directive');
if (/Disallow: \/\s*$/m.test(robotsTxt)) problems.push('robots.txt blocks the whole site');

console.log(`SEO audit over ${files.length} built pages (${indexable.length} indexable)`);
console.log(`sitemap entries: ${sitemapUrls.length} | unique titles: ${titles.size} | unique descriptions: ${descs.size}`);
console.log(`\n${problems.length} error(s), ${warn.length} warning(s)\n`);
for (const p of problems.slice(0, 40)) console.log(`  ✗ ${p}`);
if (problems.length > 40) console.log(`  … ${problems.length - 40} more`);
for (const w of warn.slice(0, 20)) console.log(`  ! ${w}`);
if (warn.length > 20) console.log(`  … ${warn.length - 20} more`);
process.exit(problems.length ? 1 : 0);
