'use strict';

/**
 * Exercises docs/assets/js/tools.js without a browser. Each fake root exposes
 * querySelector for the inputs a calculator reads, which is the only DOM the
 * engine touches. Run: node tools/calc-test.js
 */

const path = require('path');
const { CALCS } = require(path.join(__dirname, '..', 'docs', 'assets', 'js', 'tools.js'));

function root(inputs) {
  return {
    querySelector: (sel) => {
      const m = sel.match(/data-in="([^"]+)"/);
      if (m && inputs[m[1]] !== undefined) return { value: String(inputs[m[1]]) };
      return null;
    },
  };
}

const find = (rows, label) => {
  const row = rows.find((r) => r[0].toLowerCase().includes(label.toLowerCase()));
  return row ? row[1] : null;
};

let fails = 0;
const check = (name, got, want) => {
  const ok = String(got).includes(String(want));
  if (!ok) fails++;
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name}\n      got: ${got}\n      want contains: ${want}`);
};

/* 1. Position size: $100k, 1% risk, 20 pip stop, $10 pip value per lot. */
let r = CALCS.position(root({ account: 100000, riskPct: 1, stopPips: 20, pipValue: 10 }));
check('position risk cash', find(r, 'Risk per trade'), '$1,000');
check('position lots', find(r, 'Standard lots'), '5');
check('position losses at 5%', find(r, '5% daily limit'), '5');

/* 2. Daily budget: $100k, 5% limit, −$1,200 closed, −$300 floating. */
r = CALCS.daily(root({ account: 100000, limitPct: 5, closedPL: -1200, floatingPL: -300 }));
check('daily limit cash', find(r, 'Daily limit'), '$5,000');
check('daily room left', find(r, 'Room left'), '$3,500');
check('daily per-trade guidance', find(r, 'survive 3'), '$1,167');

/* 3. Breached day must warn, not print negative room. */
r = CALCS.daily(root({ account: 100000, limitPct: 5, closedPL: -6000, floatingPL: 0 }));
check('daily breach', find(r, 'Room left'), 'limit reached');

/* 4. Max loss, fixed-dollar trailing: start 100k, peak 106k, 10% → floor 96k. */
r = CALCS.maxloss(root({ start: 100000, peak: 106000, maxPct: 10, basis: 'initial' }));
check('trailing floor (fixed $)', find(r, 'Trailing floor'), '$96,000');
check('room from peak', find(r, 'Room from peak'), '$10,000');
check('gain locked in', find(r, 'Gain locked in'), '$6,000');

/* 5. Max loss, percentage-of-peak: 106k peak, 10% → floor 95,400. */
r = CALCS.maxloss(root({ start: 100000, peak: 106000, maxPct: 10, basis: 'peak' }));
check('trailing floor (% of peak)', find(r, 'Trailing floor'), '$95,400');

/* 6. Floor never drops below the static floor. */
r = CALCS.maxloss(root({ start: 100000, peak: 95000, maxPct: 10, basis: 'initial' }));
check('floor clamps to static', find(r, 'Trailing floor'), '$90,000');

/* 7. Target: 100k, 10% target, 0.5% a day → 200 days, but 4 min days. */
r = CALCS.target(root({ start: 100000, targetPct: 10, dailyPct: 0.5, minDays: 4 }));
check('target cash', find(r, 'Profit target'), '$10,000');
check('days at pace', find(r, '0.5% a day'), '20 days');
check('earliest finish', find(r, 'Earliest finish'), '20 trading days');

/* 8. Minimum days bind when pace is fast: 0.1%/day needs 100 days, min 4. */
r = CALCS.target(root({ start: 50000, targetPct: 8, dailyPct: 4, minDays: 5 }));
check('min days bind', find(r, 'Earliest finish'), '5 trading days');

/* 9. Checklist: FTMO 100k. */
r = CALCS.checklist(root({ plan: 'ftmo-2step', size: 100000 }));
check('checklist phase 1', find(r, 'Phase 1 target'), '$10,000');
check('checklist daily', find(r, 'Daily loss limit'), '$5,000');
check('checklist drawdown', find(r, 'Drawdown model'), 'Static');

/* 10. Checklist: an unverified plan must not invent figures. */
r = CALCS.checklist(root({ plan: 'apex-eod', size: 100000 }));
check('apex has no invented target', r.some((x) => x[0] === 'Phase 1 target'), 'false');
check('apex says unconfirmed', find(r, 'Read the rulebook'), 'not confirmed');

/* 11. Garbage input must not produce NaN on the page. */
r = CALCS.position(root({ account: '', riskPct: '', stopPips: '', pipValue: '' }));
check('empty input safe', find(r, 'Risk per trade'), '—');

console.log(`\n${fails === 0 ? 'All calculator checks passed' : fails + ' check(s) failed'}`);
process.exit(fails === 0 ? 0 : 1);
