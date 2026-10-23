/* ElitePropX free tools — one engine, one block per page.
   Every calculator is a [data-calc] element with inputs tagged data-in and an
   output area tagged data-out. No dependencies, no network, no storage: the
   numbers stay in the browser. */
(function () {
  'use strict';

  var money = function (n) {
    if (!isFinite(n)) return '—';
    var neg = n < 0;
    var s = Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: 0 });
    return (neg ? '−$' : '$') + s;
  };

  var num = function (n) {
    if (!isFinite(n)) return '—';
    return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  var pct = function (n) {
    if (!isFinite(n)) return '—';
    return n.toFixed(1) + '%';
  };

  var read = function (root, key) {
    var el = root.querySelector('[data-in="' + key + '"]');
    if (!el) return NaN;
    var v = parseFloat(String(el.value).replace(/[, ]/g, ''));
    return isFinite(v) ? v : NaN;
  };

  var readStr = function (root, key) {
    var el = root.querySelector('[data-in="' + key + '"]');
    return el ? String(el.value) : '';
  };

  /* ------------------------------------------------------------ calculators */

  var CALCS = {};

  /* 1. Position size: what lot size puts a fixed % at risk for a given stop. */
  CALCS.position = function (root) {
    var account = read(root, 'account');
    var riskPct = read(root, 'riskPct');
    var stopPips = read(root, 'stopPips');
    var pipValue = read(root, 'pipValue');

    if (!(account > 0) || !(riskPct > 0) || !(stopPips > 0) || !(pipValue > 0)) {
      return [['Risk per trade', '—'], ['Lots', '—'], ['Risk per pip', '—']];
    }

    var riskCash = (account * riskPct) / 100;
    var lots = riskCash / (stopPips * pipValue);
    var perPip = riskCash / stopPips;

    return [
      ['Risk per trade', money(riskCash) + '  (' + pct(riskPct) + ' of ' + money(account) + ')'],
      ['Risk per pip', money(perPip)],
      ['Standard lots', num(lots)],
      ['Mini lots (0.1)', num(lots * 10)],
      ['Micro lots (0.01)', num(lots * 100)],
      ['At a 5% daily limit you get', Math.floor(5 / riskPct) + ' full-risk losses'],
    ];
  };

  /* 2. Daily budget: how much of today's loss limit is left, and what each
        trade may risk if the day is to survive three losses. */
  CALCS.daily = function (root) {
    var account = read(root, 'account');
    var limitPct = read(root, 'limitPct');
    var closed = read(root, 'closedPL');
    var floating = read(root, 'floatingPL');

    if (!(account > 0) || !(limitPct > 0)) {
      return [['Daily limit', '—'], ['Room left', '—'], ['Risk per trade', '—']];
    }

    closed = isFinite(closed) ? closed : 0;
    floating = isFinite(floating) ? floating : 0;

    var limitCash = (account * limitPct) / 100;
    var dayPL = closed + floating;
    var room = limitCash + dayPL;
    var used = limitCash > 0 ? ((limitCash - room) / limitCash) * 100 : 0;

    var rows = [
      ['Daily limit', money(limitCash) + '  (' + pct(limitPct) + ' of ' + money(account) + ')'],
      ['Day so far', money(dayPL)],
      ['Room left today', room > 0 ? money(room) : money(0) + '  — limit reached'],
      ['Limit used', pct(Math.max(0, Math.min(100, used)))],
    ];

    if (room > 0) {
      rows.push(['Risk per trade to survive 3 losses', money(room / 3)]);
      rows.push(['Stop the session at', money(room * 0.2) + ' left']);
    } else {
      rows.push(['What to do', 'Stop. The session is over; the next reset restores the budget.']);
    }
    return rows;
  };

  /* 3. Maximum loss and the floor: static versus trailing, in cash and %. */
  CALCS.maxloss = function (root) {
    var start = read(root, 'start');
    var peak = read(root, 'peak');
    var maxPct = read(root, 'maxPct');
    var basis = readStr(root, 'basis'); // 'initial' | 'peak'

    if (!(start > 0) || !(maxPct > 0)) {
      return [['Floor', '—'], ['Room to floor', '—'], ['Allowance used', '—']];
    }
    if (!(peak > 0)) peak = start;

    var allowance = (start * maxPct) / 100;
    var floor;
    if (basis === 'peak') {
      // Percentage-of-peak convention: the floor is a fixed distance below the
      // running high, so every new high lifts it.
      floor = peak * (1 - maxPct / 100);
    } else {
      // Fixed-dollar convention: the floor trails the high by the initial
      // allowance, so it stops rising once the peak reaches the target.
      floor = peak - allowance;
    }
    var staticFloor = start - allowance;
    if (floor < staticFloor) floor = staticFloor; // never below the start-base floor

    var room = peak - floor;

    return [
      ['Starting balance', money(start)],
      ['Running peak', money(peak)],
      [basis === 'peak' ? 'Trailing floor (% of peak)' : 'Trailing floor (fixed $)', money(floor)],
      ['A static floor would sit at', money(staticFloor)],
      ['Room from peak to floor', money(room)],
      ['Gain locked in above start', money(peak - start)],
      ['Distance from start to floor', money(start - floor > 0 ? start - floor : 0)],
    ];
  };

  /* 4. Profit target planner: target in cash, pace required, days projected. */
  CALCS.target = function (root) {
    var start = read(root, 'start');
    var targetPct = read(root, 'targetPct');
    var dailyPct = read(root, 'dailyPct');
    var minDays = read(root, 'minDays');

    if (!(start > 0) || !(targetPct > 0)) {
      return [['Target', '—'], ['Days at this pace', '—'], ['Required per day', '—']];
    }
    dailyPct = isFinite(dailyPct) && dailyPct > 0 ? dailyPct : 0;
    minDays = isFinite(minDays) && minDays > 0 ? Math.ceil(minDays) : 0;

    var targetCash = (start * targetPct) / 100;
    var perDayCash = (start * dailyPct) / 100;
    var daysNeeded = perDayCash > 0 ? targetCash / perDayCash : Infinity;
    var days = Math.ceil(daysNeeded);
    var binding = Math.max(days, minDays);
    var requiredPerDay = binding > 0 ? targetCash / binding : targetCash;

    var rows = [
      ['Profit target', money(targetCash) + '  (' + pct(targetPct) + ')'],
      ['At ' + pct(dailyPct) + ' a day', daysNeeded === Infinity ? 'no pace set' : num(daysNeeded) + ' days'],
    ];
    if (minDays) rows.push(['Minimum trading days', minDays + ' — ' + (minDays > days ? 'this is what binds' : 'pace binds, not the calendar')]);
    rows.push(['Earliest finish', binding + ' trading days']);
    rows.push(['Required per trading day', money(requiredPerDay)]);
    return rows;
  };

  /* 5. Rule checklist generator: the plan-specific checklist and limits. */
  var PLANS = {
    'ftmo-2step': {
      name: 'FTMO — 2-Step Challenge',
      target1: 10, target2: 5, daily: 5, max: 10, minDays: 4,
      drawdown: 'Static, from the starting balance',
      consistency: 'None at evaluation',
      confirm: 'Daily limit is measured on equity at 00:00 CE(S)T.',
    },
    'fundednext-stellar': {
      name: 'FundedNext — Stellar 2-Step (CFDs)',
      target1: 8, target2: 5, daily: 5, max: 10, minDays: 5,
      drawdown: 'Static',
      consistency: 'Confirm at checkout',
      confirm: 'Figures read from the CFD objectives page; verify the plan at purchase.',
    },
    'the5ers-highstakes': {
      name: 'The5ers — High Stakes',
      target1: 10, target2: 5, daily: 5, max: 10, minDays: 3,
      drawdown: 'Static',
      consistency: 'None stated',
      confirm: 'Minimum days count profitable days, not calendar days.',
    },
    'apex-eod': {
      name: 'Apex Trader Funding — EOD evaluation',
      target1: null, target2: null, daily: null, max: null, minDays: null,
      drawdown: 'End-of-day trailing',
      consistency: '50% at payout (30% on legacy accounts)',
      confirm: 'Target and loss figures vary by account size — read the parameters for the size you are buying. Figures not confirmed in this pass.',
    },
    'topstep-combine': {
      name: 'Topstep — Trading Combine',
      target1: null, target2: null, daily: null, max: null, minDays: null,
      drawdown: 'Trailing maximum loss',
      consistency: '55% of target during the Combine, 40% at payout',
      confirm: 'Limits are published per account size in the help centre. Figures not confirmed in this pass.',
    },
  };

  CALCS.checklist = function (root) {
    var key = readStr(root, 'plan');
    var size = read(root, 'size');
    var plan = PLANS[key];
    if (!plan) return [['Checklist', 'Choose a plan above']];

    var rows = [['Plan', plan.name]];
    if (isFinite(size) && size > 0) {
      rows.push(['Account size', money(size)]);
      if (plan.target1) rows.push(['Phase 1 target', money((size * plan.target1) / 100) + '  (' + plan.target1 + '%)']);
      if (plan.target2) rows.push(['Phase 2 target', money((size * plan.target2) / 100) + '  (' + plan.target2 + '%)']);
      if (plan.daily) rows.push(['Daily loss limit', money((size * plan.daily) / 100) + '  (' + plan.daily + '%)']);
      if (plan.max) rows.push(['Maximum loss', money((size * plan.max) / 100) + '  (' + plan.max + '%)']);
    }
    rows.push(['Drawdown model', plan.drawdown]);
    rows.push(['Minimum trading days', plan.minDays ? String(plan.minDays) : 'size/plan dependent']);
    rows.push(['Consistency', plan.consistency]);
    rows.push(['Read the rulebook for', plan.confirm]);
    return rows;
  };

  /* ------------------------------------------------------------------ render */

  function render(root) {
    var kind = root.getAttribute('data-calc');
    var fn = CALCS[kind];
    var out = root.querySelector('[data-out]');
    if (!fn || !out) return;

    var rows = fn(root);
    var html = '';
    for (var i = 0; i < rows.length; i++) {
      var label = rows[i][0];
      var value = rows[i][1];
      var danger = /limit reached|Stop\./.test(value);
      html +=
        '<div class="calc-row' + (danger ? ' calc-danger' : '') + '">' +
        '<span class="calc-k">' + label + '</span>' +
        '<span class="calc-v">' + value + '</span>' +
        '</div>';
    }
    out.innerHTML = html;
  }

  function init() {
    var blocks = document.querySelectorAll('[data-calc]');
    for (var i = 0; i < blocks.length; i++) {
      (function (root) {
        render(root);
        root.addEventListener('input', function () { render(root); });
        root.addEventListener('change', function () { render(root); });
        var form = root.querySelector('form');
        if (form) form.addEventListener('submit', function (e) { e.preventDefault(); render(root); });
      })(blocks[i]);
    }
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  // Exposed for the Node-side checks in tools/calc-test.js; ignored in browsers.
  if (typeof module !== 'undefined' && module.exports) module.exports = { CALCS: CALCS, PLANS: PLANS };
})();
