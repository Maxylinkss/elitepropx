'use strict';

/** Repairs literal escape sequences (\n, \") and trailing JSON punctuation in a page file. */
const fs = require('fs');
const path = require('path');

const file = process.argv[2];
if (!file) {
  console.error('usage: node tools/fix-escapes.js <page file>');
  process.exit(1);
}
const p = path.join(__dirname, '..', file);
let s = fs.readFileSync(p, 'utf8');
const before = (s.match(/\\n|\\"/g) || []).length;

s = s.split('\\n').join('\n').split('\\"').join('"');
// stray JSON tail from a copy/paste: `",\n}` at end of file
s = s.replace(/\n",\s*\}\s*$/, '\n');

fs.writeFileSync(p, s);
const after = (s.match(/\\n|\\"/g) || []).length;
console.log(`${file}: ${before} literal escapes found, ${after} remaining`);
console.log('tail: ' + JSON.stringify(s.slice(-40)));
