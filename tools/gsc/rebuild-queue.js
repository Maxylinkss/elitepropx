'use strict';

/**
 * Rebuilds tools/gsc/queue.json from tools/gsc/inventory.json.
 *
 * inventory.js reports the ratio of built pages per directory, which is enough
 * for reporting but not for re-generation. This script walks the raw inventory
 * and lists every tracked URL that has no src/pages file, so the content
 * generator can be re-run after pages are removed.
 */

const fs = require('fs');
const path = require('path');

const INVENTORY = path.join(__dirname, 'inventory.json');
const QUEUE = path.join(__dirname, 'queue.json');
const SRC = path.join(__dirname, '..', '..', 'src', 'pages');

const inv = JSON.parse(fs.readFileSync(INVENTORY, 'utf8'));

const urls = [];
const seen = new Set();
(function walk(node, bucket) {
  if (Array.isArray(node)) return node.forEach((v) => walk(v, bucket));
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      const b = /indexed|crawled|notfound|discovered|redirect/.test(k) ? k : bucket;
      walk(v, b);
    }
    return;
  }
  if (typeof node !== 'string') return;
  const m = node.match(/^\/[a-z0-9\-\/]*\.html$/i);
  if (m && !seen.has(node)) {
    seen.add(node);
    urls.push({ path: node, bucket: bucket || 'inventory' });
  }
})(inv, 'inventory');

const pending = urls.filter((u) => !fs.existsSync(path.join(SRC, u.path.replace(/^\//, ''))));

fs.writeFileSync(
  QUEUE,
  JSON.stringify(
    pending.map((u, i) => ({ path: u.path, bucket: u.bucket, order: i + 1 })),
    null,
    2
  ) + '\n'
);

console.log(`inventory URLs: ${urls.length} | already built: ${urls.length - pending.length} | queued: ${pending.length}`);
