'use strict';

/**
 * Static site builder for elitepropx.com
 * - Reads page fragments from src/pages (front matter + body)
 * - Wraps each page in the shared layout with SEO metadata and JSON-LD
 * - Generates /blog/ index, sitemap.xml, robots.txt, CNAME and 404
 * Zero dependencies. Run: node build.js
 */

const fs = require('fs');
const path = require('path');
const layout = require('./src/lib/layout');
const site = require('./src/lib/site');
const walk = require('./src/lib/walk');
const { parseFrontMatter, pageSlug } = require('./src/lib/frontmatter');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src', 'pages');
const OUT = path.join(ROOT, 'docs');
const TODAY = new Date().toISOString().slice(0, 10);
const INDEXNOW_KEY = '7e7dd70f9dda720b20fe3c45281d2f2f';

/* ---------------------------------- utils --------------------------------- */

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

function wordCount(html) {
  const text = stripTags(html);
  return text ? text.split(' ').filter(Boolean).length : 0;
}

/**
 * Pull Q/A pairs out of markup shaped like:
 *   <details class="faq"><summary>Question?</summary><div class="faq-a"><p>Answer.</p></div></details>
 * Used for FAQPage structured data.
 */
function extractFaq(body) {
  const out = [];
  const re =
    /<details class="faq"[^>]*>\s*<summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/gi;
  let m;
  while ((m = re.exec(body))) {
    const q = stripTags(m[1]);
    const a = stripTags(m[2]);
    if (q && a) out.push({ q, a });
  }
  return out;
}

/* --------------------------------- build ---------------------------------- */

// GitHub Pages cannot send a 301, so a moved URL is published as a stub that
// refreshes to its replacement. The stub deliberately carries no noindex: a
// noindex cancels the canonical, so Google drops the old URL instead of merging
// it into the target, and whatever links and history the old URL had are lost.
// Refresh plus canonical is read as a redirect and consolidates the signals.
function redirectHtml(page) {
  const target = page.redirect;
  const abs = site.url + target;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${layout.esc(page.title)}</title>
<link rel="canonical" href="${abs}">
<meta http-equiv="refresh" content="0; url=${target}">
<script>location.replace(${JSON.stringify(target)} + location.hash);</script>
</head>
<body>
<p>This page has moved to <a href="${target}">${layout.esc(target)}</a>.</p>
</body>
</html>
`;
}

function build() {
  const files = walk(SRC);
  const pages = [];

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    const { data, body } = parseFrontMatter(raw);
    const rel = path.relative(SRC, file).split(path.sep).join('/');
    const page = {
      ...data,
      path: data.path || '/' + rel,
      type: data.type || 'page',
      crumb: data.crumb || data.h1,
      body,
    };
    page.image = page.image || `/assets/img/og/${pageSlug(page.path)}.svg`;
    const wc = wordCount(body);
    const faq = extractFaq(body);
    pages.push({ ...page, wordCount: wc, faq });
  }

  // Article index for /blog/
  const articles = pages
    .filter((p) => p.type === 'article')
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const blogIndex = pages.find((p) => p.path === '/blog/index.html');
  if (blogIndex) {
    // Keep the library's advertised article count true without hand-editing it.
    blogIndex.title = blogIndex.title.replace('{{ARTICLE_COUNT}}', String(articles.length));
    blogIndex.body = blogIndex.body.replace(
      '<!-- ARTICLES -->',
      `<div class="post-grid">\n${articles
        .map(
          (a) => `  <article class="post-card">
    <p class="post-meta"><time datetime="${a.date}">${new Date(a.date + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</time> · ${Math.round(a.wordCount / 100) * 100} words</p>
    <h3><a href="${a.path}">${layout.esc(a.h1 || a.title)}</a></h3>
    <p>${layout.esc(a.desc)}</p>
    <a class="post-more" href="${a.path}">Read guide →</a>
  </article>`
        )
        .join('\n')}\n</div>`
    );
  }

  // Write pages
  const unconfigured = [];
  for (const page of pages) {
    const outFile = path.join(OUT, page.path.replace(/^\//, ''));
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    const html = page.redirect ? redirectHtml(page) : layout.render(page, page.body);
    if (html.includes('__WEB3FORMS_ACCESS_KEY__')) unconfigured.push(page.path);
    fs.writeFileSync(outFile, html, 'utf8');
  }
  if (unconfigured.length) {
    console.log(`\nForms awaiting an access key (${unconfigured.length}):`);
    for (const p of unconfigured) console.log(`  ${p} — replace __WEB3FORMS_ACCESS_KEY__`);
  }

  // sitemap.xml
  const urls = pages
    .filter((p) => !p.noindex)
    .map((p) => {
      const loc = site.url + layout.publicPath(p.path);
      const priority = p.priority || (p.type === 'article' ? 0.7 : 0.9);
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${p.updated || p.date || TODAY}</lastmod>
    <changefreq>${p.type === 'article' ? 'monthly' : 'weekly'}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  fs.writeFileSync(
    path.join(OUT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
    'utf8'
  );

  fs.writeFileSync(
    path.join(OUT, 'robots.txt'),
    `User-agent: *
Allow: /
Disallow: /assets/js/

Sitemap: ${site.url}/sitemap.xml
`,
    'utf8'
  );

  fs.writeFileSync(path.join(OUT, 'CNAME'), 'elitepropx.com\n', 'utf8');

  // IndexNow key file: proves ownership to Bing, Yandex, Seznam and Naver.
  // The filename and its contents must match exactly, or submissions are rejected.
  fs.writeFileSync(path.join(OUT, `${INDEXNOW_KEY}.txt`), INDEXNOW_KEY, 'utf8');

  fs.writeFileSync(
    path.join(OUT, 'site.webmanifest'),
    JSON.stringify(
      {
        name: site.name,
        short_name: 'ElitePropX',
        description: site.description,
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: site.themeColor,
        icons: [
          { src: '/assets/img/logo-mark.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
      },
      null,
      2
    ),
    'utf8'
  );

  // 404
  const notFound = {
    path: '/404.html',
    title: 'Page not found | ElitePropX',
    desc: 'That page is not here. Browse our prop firm guides, comparisons and passed challenge certificates instead.',
    h1: 'Page not found',
    type: 'page',
    noindex: true,
    body: `<section class="section">
  <div class="wrap narrow">
    <p class="kicker">404</p>
    <h1>That page is not here</h1>
    <p class="lede">The page you followed no longer exists — your old bookmarks and search results may point at URLs we have rebuilt. Start from one of these instead:</p>
    <ul class="link-list">
      <li><a href="/">Home — pass a prop firm challenge for ${site.price}</a></li>
      <li><a href="/blog/">All prop firm guides</a></li>
      <li><a href="/prop-firm-comparison-2026.html">Prop firm comparison 2026</a></li>
      <li><a href="/passed-challenges.html">Passed challenges</a></li>
      <li><a href="/faq.html">FAQ</a></li>
    </ul>
    <p><a class="btn btn-primary" href="/">Back to ${site.name}</a></p>
  </div>
</section>`,
  };
  fs.writeFileSync(
    path.join(OUT, '404.html'),
    layout.render(notFound, notFound.body),
    'utf8'
  );

  // Report
  const totalWords = pages.reduce((n, p) => n + p.wordCount, 0);
  console.log(`Built ${pages.length} pages → docs/`);
  console.log(`Total words: ${totalWords.toLocaleString()}`);
  console.log(`Articles: ${articles.length}`);
  const thin = pages.filter((p) => !p.noindex && !p.redirect && p.wordCount < 600);
  if (thin.length) {
    console.log(`\nPages under 600 words (${thin.length}):`);
    for (const p of thin) console.log(`  ${p.wordCount.toString().padStart(5)}  ${p.path}`);
  }
}

build();
