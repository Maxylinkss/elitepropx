'use strict';

/**
 * Standardises the offer line inside every .cta-band so the flat $220 fee,
 * "any prop firm, any account size" and the no-profit-split terms appear on
 * every page. Headings and buttons are left alone; only the paragraph changes.
 *
 * Run: node tools/standardize-cta.js
 */

const fs = require('fs');
const path = require('path');
const walk = require('../src/lib/walk');

const PAGES = path.join(__dirname, '..', 'src', 'pages');
const OFFER =
  'One flat <strong>$220</strong> for any prop firm, any account size. Retries covered, no profit split, funded login in your name. If your firm bans third-party trading we tell you before you pay, and we will not take the job.';

let changed = 0;
for (const file of walk(PAGES)) {
  if (!file.endsWith('.html')) continue;
  const html = fs.readFileSync(file, 'utf8');
  const next = html.replace(
    /(<section class="cta-band">[\s\S]*?<div>\s*<h2>[\s\S]*?<\/h2>\s*)<p>[\s\S]*?<\/p>/,
    (m, head) => `${head}<p>${OFFER}</p>`,
  );
  if (next !== html) {
    fs.writeFileSync(file, next);
    changed++;
    console.log(`updated ${path.relative(PAGES, file)}`);
  }
}
console.log(`\n${changed} file(s) updated`);
