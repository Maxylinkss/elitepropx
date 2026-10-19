'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const site = require('./site');

/**
 * Cache-bust static assets with a content hash. GitHub Pages serves assets
 * with a short max-age, so a changed stylesheet can otherwise keep rendering
 * the previous design for returning visitors.
 */
function assetVersion(relPath) {
  try {
    const file = path.join(__dirname, '..', '..', 'docs', relPath.replace(/^\//, ''));
    return '?v=' + crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex').slice(0, 8);
  } catch {
    return '';
  }
}

const CSS_V = assetVersion('/assets/css/style.css');
const JS_V = assetVersion('/assets/js/main.js');

const NAV = [
  { label: 'Passed Challenges', href: '/passed-challenges.html' },
  { label: 'Compare Firms', href: '/prop-firm-comparison-2026.html' },
  { label: 'Rules Matrix', href: '/prop-firm-rules-matrix.html' },
  { label: 'Services', href: '/services/passing-prop-firm-services.html' },
  { label: 'Reviews', href: '/reviews/prop-firm-passing-service-reviews.html' },
  { label: 'Blog', href: '/blog/' },
  { label: 'FAQ', href: '/faq.html' },
  { label: 'About', href: '/about.html' },
];

const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const abs = (p) => site.url + (p.startsWith('/') ? p : '/' + p);

const TELEGRAM_ICON = `<svg class="tg-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path fill="currentColor" d="M21.94 4.3 18.6 20.1c-.25 1.1-.9 1.38-1.82.86l-5.03-3.7-2.43 2.34c-.27.27-.5.5-1.02.5l.36-5.13 9.34-8.44c.4-.36-.09-.56-.63-.2L6.02 13.2.99 11.63c-1.1-.34-1.12-1.1.23-1.63L20.1 2.77c.91-.34 1.71.2 1.4 1.53Z"/></svg>`;

const telegramButton = (cls = 'btn btn-telegram', label = 'Pass your evaluation') =>
  `<a class="${cls}" href="${site.telegram}" target="_blank" rel="noopener">${TELEGRAM_ICON}<span>${label}</span></a>`;

/**
 * Every commercial band already ends with one primary action. Add the
 * Telegram route beside it so no page offers email or a form as the only
 * way to start a conversation.
 */
function withTelegramBand(body) {
  return body.replace(
    /(<section class="cta-band">[\s\S]*?)(<a class="btn btn-primary"[^>]*>[\s\S]*?<\/a>)(\s*<\/div>\s*<\/section>)/g,
    (match, before, anchor, after) => {
      if (before.includes('class="cta-actions"')) return match;
      return `${before}<div class="cta-actions">\n      ${anchor}\n      ${telegramButton()}\n    </div>${after}`;
    }
  );
}

function publicPath(p) {
  if (p === '/index.html') return '/';
  if (p.endsWith('/index.html')) return p.slice(0, -'index.html'.length);
  return p;
}

function canonicalFor(page) {
  return abs(publicPath(page.path));
}

function head(page) {
  const canonical = canonicalFor(page);
  const og =
    page.image && page.image !== site.ogImage ? abs(page.image) : abs(site.ogImage);
  const robots = page.noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large,max-snippet:-1';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.desc)}">
${page.keywords ? `<meta name="keywords" content="${esc(page.keywords)}">\n` : ''}<meta name="robots" content="${robots}">
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="${site.themeColor}">
<meta name="author" content="${site.name}">
<meta property="og:type" content="${page.type === 'article' ? 'article' : 'website'}">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${esc(page.ogTitle || page.title)}">
<meta property="og:description" content="${esc(page.desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${site.locale}">
${page.type === 'article' ? `<meta property="article:published_time" content="${page.date}T08:00:00+00:00">\n<meta property="article:modified_time" content="${page.updated}T08:00:00+00:00">\n` : ''}<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(page.ogTitle || page.title)}">
<meta name="twitter:description" content="${esc(page.desc)}">
<meta name="twitter:image" content="${og}">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/logo-mark.svg">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/assets/css/style.css${CSS_V}" as="style">
<link rel="stylesheet" href="/assets/css/style.css${CSS_V}">
<script defer src="/assets/js/main.js${JS_V}"></script>
<script type="application/ld+json">${JSON.stringify(organizationSchema())}</script>
<script type="application/ld+json">${JSON.stringify(websiteSchema())}</script>
${page.type === 'article' ? `<script type="application/ld+json">${JSON.stringify(articleSchema(page))}</script>\n` : ''}${page.schemaService ? `<script type="application/ld+json">${JSON.stringify(serviceSchema())}</script>\n` : ''}${breadcrumbSchema(page) ? `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema(page))}</script>\n` : ''}${faqSchema(page) ? `<script type="application/ld+json">${JSON.stringify(faqSchema(page))}</script>\n` : ''}</head>`;
}

function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': site.url + '/#organization',
    name: site.name,
    legalName: site.legalName,
    url: site.url + '/',
    logo: {
      '@type': 'ImageObject',
      url: abs('/assets/img/logo.svg'),
      width: 512,
      height: 128,
    },
    description: site.description,
    email: site.email,
    foundingDate: site.founded,
    areaServed: 'Worldwide',
    knowsAbout: [
      'prop firm challenge passing',
      'FTMO challenge',
      'futures prop firm evaluations',
      'Apex Trader Funding',
      'Topstep Combine',
      'FundedNext',
    ],
    sameAs: [site.social.youtube, site.telegram],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: site.email,
      url: site.telegram,
      availableLanguage: ['English'],
    },
  };
}

function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': site.url + '/#website',
    url: site.url + '/',
    name: site.name,
    description: site.description,
    inLanguage: 'en',
    publisher: { '@id': site.url + '/#organization' },
  };
}

function articleSchema(page) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': abs(page.path) + '#article',
    headline: page.h1 || page.title,
    description: page.desc,
    image: abs(page.image || site.ogImage),
    datePublished: page.date + 'T08:00:00+00:00',
    dateModified: (page.updated || page.date) + 'T08:00:00+00:00',
    wordCount: page.wordCount,
    articleSection: page.section,
    inLanguage: 'en',
    mainEntityOfPage: { '@type': 'WebPage', '@id': abs(page.path) },
    author: { '@id': site.url + '/#organization' },
    publisher: { '@id': site.url + '/#organization' },
  };
}

function serviceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Prop Firm Challenge Passing',
    serviceType: 'Prop firm challenge passing service',
    provider: { '@id': site.url + '/#organization' },
    areaServed: 'Worldwide',
    description:
      'ElitePropX trades prop firm evaluations on your behalf for a flat $220 fee, covering retries, with no profit split on the funded account.',
    offers: {
      '@type': 'Offer',
      price: site.priceValue,
      priceCurrency: site.currency,
      description: 'Flat fee per evaluation, any account size, retries covered.',
      availability: 'https://schema.org/InStock',
      url: site.url + '/',
    },
  };
}

function crumbsFor(page) {
  const crumbs = [{ name: 'Home', href: '/' }];
  if (page.path === '/index.html') return [];
  if (page.path === '/blog/index.html') {
    return [
      { name: 'Home', href: '/' },
      { name: 'Blog', href: '/blog/' },
    ];
  }
  if (page.section && page.sectionUrl && page.type === 'article') {
    if (page.sectionUrl !== '/blog/') crumbs.push({ name: 'Blog', href: '/blog/' });
    crumbs.push({ name: page.section, href: page.sectionUrl });
  } else if (page.path.startsWith('/blog/')) {
    crumbs.push({ name: 'Blog', href: '/blog/' });
  }
  crumbs.push({ name: page.crumb || page.h1 || page.title, href: publicPath(page.path) });
  return crumbs;
}

function breadcrumbSchema(page) {
  const crumbs = crumbsFor(page);
  if (!crumbs.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.href),
    })),
  };
}

function faqSchema(page) {
  if (!page.faq || !page.faq.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map((q) => ({
      '@type': 'Question',
      name: q.q,
      acceptedAnswer: { '@type': 'Answer', text: q.a },
    })),
  };
}

function header(activePath) {
  const links = NAV.map((n) => {
    const active =
      activePath === n.href ||
      (n.href !== '/' && activePath.startsWith(n.href.replace(/\/[^/]*\.html$/, '/')));
    return `<li><a href="${n.href}"${active ? ' aria-current="page" class="is-active"' : ''}>${n.label}</a></li>`;
  }).join('\n          ');

  return `<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="/" aria-label="${site.name} home">
      <img src="/assets/img/logo.svg" alt="${site.name}" width="150" height="38" loading="eager">
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">
      <span class="nav-toggle-bar"></span><span class="sr-only">Menu</span>
    </button>
    <nav id="primary-nav" class="site-nav" aria-label="Primary">
      <ul>
          ${links}
      </ul>
    </nav>
    <div class="header-actions">
      <span class="header-pitch">Prop firm challenge passing service</span>
      <a class="header-telegram" href="${site.telegram}" target="_blank" rel="noopener" aria-label="Pass your evaluation on Telegram" title="Pass your evaluation on Telegram">${TELEGRAM_ICON}</a>
      <a class="btn btn-primary header-cta" href="/#get-started">Start for ${site.price}</a>
    </div>
  </div>
  <a class="header-note" href="/#get-started">Prop firm challenge passing service <span>· ${site.price} flat</span></a>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="wrap footer-cta">
    <div>
      <p class="footer-cta-kicker">Talk to ElitePropX</p>
      <h2>Not sure which firm or plan fits?</h2>
      <p>Send the firm and account size. You will get the flat fee, a timeline and a straight answer on your firm's terms before you pay.</p>
    </div>
    <div class="footer-cta-actions">
      ${telegramButton()}
      <a class="btn btn-outline-light" href="mailto:${site.email}?subject=Prop%20firm%20challenge%20enquiry">Email support</a>
    </div>
  </div>
  <div class="wrap footer-grid">
    <div class="footer-brand">
      <img src="/assets/img/logo-white.svg" alt="${site.name}" width="150" height="38" loading="lazy">
      <p>${site.description}</p>
      <p class="footer-mail">
        <a href="${site.telegram}" target="_blank" rel="noopener">Telegram ${site.telegramHandle}</a><br>
        <a href="mailto:${site.email}">${site.email}</a>
      </p>
    </div>
    <div>
      <h2 class="footer-h">Service</h2>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/passed-challenges.html">Passed challenges</a></li>
        <li><a href="/prop-firm-comparison-2026.html">Prop firm comparison</a></li>
        <li><a href="/prop-firm-rules-matrix.html">Rules matrix</a></li>
        <li><a href="/services/passing-prop-firm-services.html">Passing services</a></li>
        <li><a href="/demo.html">Free demo trial</a></li>
        <li><a href="/reviews/prop-firm-passing-service-reviews.html">Client reviews</a></li>
      </ul>
    </div>
    <div>
      <h2 class="footer-h">Resources</h2>
      <ul>
        <li><a href="/blog/">All articles</a></li>
        <li><a href="/blog/ultimate-guide-passing-prop-firm-challenge.html">Challenge passing guide</a></li>
        <li><a href="/blog/ftmo-challenge-passing.html">FTMO passing</a></li>
        <li><a href="/blog/apex-trader-funding-challenge-passing.html">Apex passing</a></li>
        <li><a href="/faq.html">FAQ</a></li>
      </ul>
    </div>
    <div>
      <h2 class="footer-h">Company</h2>
      <ul>
        <li><a href="/about.html">About</a></li>
        <li><a href="/contact.html">Contact</a></li>
        <li><a href="/privacy.html">Privacy policy</a></li>
        <li><a href="/terms.html">Terms of service</a></li>
        <li><a href="/sitemap.xml">Sitemap</a></li>
      </ul>
    </div>
  </div>
  <div class="wrap footer-bottom">
    <p>&copy; <span id="year">2026</span> ${site.name}. All rights reserved.</p>
    <p class="disclaimer">
      ${site.name} is an independent service and is not affiliated with, endorsed by, or sponsored by any proprietary trading firm named on this site. Trading involves substantial risk of loss. Past results do not guarantee future outcomes. Check your firm's terms before purchasing any service.
    </p>
  </div>
</footer>`;
}

function breadcrumbs(page) {
  const crumbs = crumbsFor(page);
  if (!crumbs.length) return '';
  const items = crumbs.map((c, i) => {
    const last = i === crumbs.length - 1;
    return last
      ? `<li aria-current="page">${esc(c.name)}</li>`
      : `<li><a href="${c.href}">${esc(c.name)}</a></li>`;
  });
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${items.join('')}</ol></nav>`;
}

function render(page, body) {
  return `${head(page)}
<body class="page-${page.type}">
${header(page.path)}
<main id="main">
${breadcrumbs(page)}
${withTelegramBand(body)}
</main>
${footer()}
<a class="telegram-float" href="${site.telegram}" target="_blank" rel="noopener" aria-label="Pass your challenge today on Telegram">
  <span class="telegram-float-icon">${TELEGRAM_ICON}</span>
  <span class="telegram-float-text"><strong>Pass your challenge today</strong><small>${site.telegramHandle}</small></span>
</a>
</body>
</html>
`;
}

module.exports = { render, esc, NAV, crumbsFor, abs, publicPath };
