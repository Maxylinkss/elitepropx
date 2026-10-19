'use strict';

/**
 * Rebuild the noindex redirect stubs from the last generator run, so a
 * restoration experiment can be rolled back without losing which URL pointed
 * where.
 *
 * Run: node tools/content/revert-stubs.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const SRC = path.join(ROOT, 'src', 'pages');
const BACKUP = path.join(ROOT, '.backup', 'pages-20261019-054623');
const LAST = path.join(__dirname, 'last-run.json');
const { REDIRECTS } = require('./spec');

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
  return `---\n${Object.entries(data)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')}\n---\n`;
}

const last = JSON.parse(fs.readFileSync(LAST, 'utf8'));
const INVENTORY = path.join(ROOT, 'tools', 'gsc', 'inventory.json');
const inv = JSON.parse(fs.readFileSync(INVENTORY, 'utf8'));
const indexed = new Set(
  inv.entries.filter((e) => e.buckets.includes('indexed')).map((e) => e.path)
);
const UNINDEXED_ONLY = process.argv.includes('--unindexed');
let written = 0;
const missing = [];
for (const entry of last.generated) {
  if (entry.kind !== 'redirect' && entry.kind !== 'redirectPage') continue;
  if (UNINDEXED_ONLY && indexed.has(entry.path)) continue;
  const target = entry.redirect || REDIRECTS[entry.path];
  if (!target) {
    missing.push(entry.path);
    continue;
  }
  const backupFile = path.join(BACKUP, entry.path.replace(/^\//, ''));
  if (!fs.existsSync(backupFile)) {
    missing.push(entry.path + ' (no backup)');
    continue;
  }
  const { data: meta } = readFrontMatter(fs.readFileSync(backupFile, 'utf8'));
  const data = {
    title: meta.title,
    desc: meta.desc,
    path: entry.path,
    type: 'page',
    h1: meta.h1,
    noindex: true,
    redirect: target,
    generator: 'content-system',
  };
  const out = path.join(SRC, entry.path.replace(/^\//, ''));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, fm(data), 'utf8');
  written++;
}

console.log(`Wrote ${written} redirect stub(s).`);
if (missing.length) {
  console.log(`${missing.length} could not be restored:`);
  for (const m of missing) console.log('  ' + m);
  process.exitCode = 1;
}
