'use strict';

/** Minimal front-matter parser: `key: value` pairs between --- fences. */
function parseFrontMatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { data: {}, body: raw };
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const i = line.indexOf(':');
    if (i === -1) continue;
    const key = line.slice(0, i).trim();
    let value = line.slice(i + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (value === 'true') value = true;
    else if (value === 'false') value = false;
    else if (/^\d+(\.\d+)?$/.test(value)) value = Number(value);
    data[key] = value;
  }
  return { data, body: raw.slice(m[0].length) };
}

/** /blog/some-post.html -> blog/some-post  |  /index.html -> index */
function pageSlug(p) {
  return p
    .replace(/^\//, '')
    .replace(/\.html$/, '')
    .replace(/\/index$/, '')
    .replace(/[^a-z0-9/-]+/gi, '-')
    .replace(/\//g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'index';
}

module.exports = { parseFrontMatter, pageSlug };
