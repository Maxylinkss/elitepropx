'use strict';

/**
 * Submits every URL in docs/sitemap.xml to IndexNow.
 *
 * IndexNow is a shared push protocol: Bing, Yandex, Seznam and Naver pick the
 * URL up in minutes instead of waiting for a crawl, and Bing's index is what
 * DuckDuckGo and most AI answer engines read from.
 *
 * The key file must already be live at https://elitepropx.com/<key>.txt before
 * this runs, or the endpoint answers 403. Run: node tools/indexnow.js
 */

const fs = require('fs');
const path = require('path');

const HOST = 'elitepropx.com';
const KEY = '7e7dd70f9dda720b20fe3c45281d2f2f';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const BATCH = 500;

const sitemap = fs.readFileSync(path.join(__dirname, '..', 'docs', 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

const offHost = urls.filter((u) => !u.startsWith(`https://${HOST}/`));
if (offHost.length) {
  console.error(`Refusing to submit ${offHost.length} URL(s) outside ${HOST}: ${offHost[0]}`);
  process.exit(1);
}

(async () => {
  console.log(`Submitting ${urls.length} URLs to IndexNow for ${HOST}`);

  for (let i = 0; i < urls.length; i += BATCH) {
    const urlList = urls.slice(i, i + BATCH);
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
    });
    const text = await res.text().catch(() => '');
    console.log(`  batch ${i / BATCH + 1}: HTTP ${res.status} ${res.statusText}${text ? ` — ${text.slice(0, 200)}` : ''}`);
    // 200 = accepted, 202 = accepted but key still being validated.
    if (res.status !== 200 && res.status !== 202) process.exit(1);
  }

  console.log('Done. Check https://www.bing.com/webmasters for coverage.');
})();
