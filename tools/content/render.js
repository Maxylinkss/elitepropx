'use strict';

/**
 * Archetype renderers for the generated long-tail library.
 * Each renderer returns the front-matter fields plus the page body.
 */

const B = require('./bank');
const SITE = require('../../src/lib/site');

const { p, ul, ol, table, figure, sec, esc, marketWord, floorShort, dailyPhrase } = B;

const RELATED = [
  ['/blog/ultimate-guide-passing-prop-firm-challenge.html', 'The complete guide to passing a prop firm challenge'],
  ['/blog/prop-firm-passing-complete-guide-2026.html', 'Prop firm passing in 2026: the full playbook'],
  ['/blog/prop-firm-daily-drawdown-explained.html', 'Daily drawdown explained'],
  ['/blog/prop-firm-consistency-rule-guide.html', 'The consistency rule guide'],
  ['/blog/prop-firm-leverage-explained.html', 'Leverage and margin on an evaluation'],
  ['/blog/prop-firm-weekend-holding-rules.html', 'Weekend holding rules'],
  ['/blog/prop-firm-profit-target-strategies.html', 'Profit target strategies that survive the rules'],
  ['/blog/prop-firm-challenge-failure-recovery.html', 'How to recover from a failed challenge'],
  ['/blog/funded-account-payout-process.html', 'The funded account payout process'],
  ['/blog/what-happens-after-passing-challenge.html', 'What happens after you pass'],
  ['/blog/prop-firm-scams-to-avoid.html', 'Prop firm scams to avoid'],
  ['/blog/prop-firm-instant-funding.html', 'Instant funding explained'],
  ['/blog/how-much-money-to-trade-micro-futures.html', 'How much money you need for micro futures'],
  ['/blog/apex-trailing-drawdown-math.html', 'Apex trailing drawdown math'],
  ['/blog/best-prop-firm-passing-services.html', 'Passing service reviews and comparisons'],
  ['/blog/best-prop-firms-2026.html', 'Best prop firms in 2026'],
  ['/blog/best-prop-firm-beginners-2026.html', 'Best prop firms for beginners'],
  ['/blog/best-futures-prop-firms-2026.html', 'Best futures prop firms'],
  ['/blog/best-prop-firm-passing-services.html', 'Best prop firm passing services'],
  ['/blog/do-prop-firms-refund-challenge-fee.html', 'Do prop firms refund challenge fees?'],
  ['/prop-firm-rules-matrix.html', 'Prop firm rules matrix'],
  ['/prop-firm-comparison-2026.html', 'Prop firm comparison 2026'],
  ['/tools/prop-firm-profit-calculator.html', 'Prop firm profit calculator'],
  ['/tools/prop-firm-calculator-embed.html', 'Risk and target calculator'],
  ['/passed-challenges.html', 'Passed challenges'],
  ['/blog/best-prop-firm-passing-services.html', 'Client reviews'],
  ['/blog/best-prop-firm-passing-services.html', 'Best passing service 2026'],
  ['/services/passing-prop-firm-services.html', 'Prop firm passing services'],
  ['/blog/prop-firm-challenge-failure-recovery.html', 'Challenge failure recovery'],
];

const FIRM_RELATED = {
  ftmo: ['/blog/ftmo-challenge-passing.html', 'FTMO challenge passing'],
  apex: ['/blog/apex-trader-funding-challenge-passing.html', 'Apex challenge passing'],
  topstep: ['/blog/topstep-challenge-passing.html', 'Topstep Combine passing'],
  fundednext: ['/blog/fundednext-challenge-passing.html', 'FundedNext challenge passing'],
  mff: ['/blog/mff-challenge-passing.html', 'My Funded Futures passing'],
  tft: ['/blog/tft-funded-trader-review.html', 'Funded Trader review'],
  goat: ['/blog/goat-funded-trader-challenge-passing.html', 'GOAT Funded Trader passing'],
  the5ers: ['/blog/the-5ers-challenge-passing.html', 'The5ers challenge passing'],
  tpt: ['/blog/take-profit-trader-challenge-passing.html', 'Take Profit Trader passing'],
  e8: ['/blog/e8-markets-vs-fundednext-which-is-easier-comparison.html', 'E8 Markets vs FundedNext'],
  fundingpips: ['/blog/fundednext-vs-funding-pips-comparison.html', 'FundedNext vs Funding Pips'],
};

const escAttr = (s) => esc(s);

function pageHead(ctx, { kicker, lede }) {
  return `<section class="page-head">
  <div class="wrap narrow">
    <p class="kicker">${esc(kicker)}</p>
    <h1>${esc(ctx.h1)}</h1>
    <p class="lede">${lede}</p>
  </div>
</section>`;
}

function keypoints(items, title = 'Key takeaways') {
  return `<div class="keypoints">
  <h2>${title}</h2>
${ul(items)}
</div>`;
}

function toc(sections) {
  return `<div class="toc">
  <p>Contents</p>
${ol(sections.map((s) => `<a href="#${s.id}">${esc(s.h2)}</a>`))}
</div>`;
}

function faqBlock(items) {
  return `<h2 id="faq">Frequently asked questions</h2>
${items
  .map(
    (q) =>
      `<details class="faq"><summary>${esc(q.q)}</summary><div class="faq-a"><p>${q.a}</p></div></details>`
  )
  .join('\n')}`;
}

function ctaBlock(heading, text) {
  return `<section class="cta-band">
  <div class="wrap cta-band-inner">
    <div>
      <h2>${esc(heading)}</h2>
      <p>${text}</p>
    </div>
    <a class="btn btn-primary" href="/contact.html">Start an evaluation</a>
  </div>
</section>`;
}

function relatedBlock(ctx, disclaimers) {
  const links = [];
  const seen = new Set();
  const add = (href, label) => {
    if (!href || seen.has(href)) return;
    seen.add(href);
    links.push({ href, label });
  };
  for (const key of ctx.firmKeys || []) {
    const r = FIRM_RELATED[key];
    if (r) add(r[0], r[1]);
  }
  // Route readers to the commercial pages from inside the content, not only
  // from the navigation that every page shares.
  add('/passed-challenges.html', 'Passed challenges and certificates');
  add('/blog/best-prop-firm-passing-services.html', 'Client reviews of the service');
  if (ctx.related) for (const r of ctx.related) add(r[0], r[1]);
  for (const r of RELATED) {
    if (links.length >= 9) break;
    add(r[0], r[1]);
  }
  const firmsNamed = disclaimers.filter(Boolean);
  return `<section class="section tight">
  <div class="wrap narrow">
    <h2>Related reading</h2>
    <ul class="link-list">
${links.map((l) => `      <li><a href="${l.href}">${esc(l.label)}</a></li>`).join('\n')}
    </ul>
    <p class="disclaimer">${
      firmsNamed.length
        ? `${firmsNamed.join(' and ')} ${firmsNamed.length > 1 ? 'are' : 'is'} named for identification only. `
        : ''
    }${SITE.name} is an independent service and is not affiliated with, endorsed by or sponsored by any proprietary trading firm. Rules, fees and payout terms change; verify every figure against the firm's own terms before purchasing an evaluation. Trading involves substantial risk of loss.</p>
  </div>
</section>`;
}

function finalize(ctx, sections, faq, opts = {}) {
  const body = [
    pageHead(ctx, opts),
    `<section class="section tight">
  <div class="wrap narrow">
${keypoints(opts.keypoints || [])}
${toc(sections)}
${sections.map((s) => s.html).join('\n')}
${faqBlock(faq)}
  </div>
</section>`,
    ctaBlock(opts.ctaHeading, opts.ctaText),
    relatedBlock(ctx, opts.disclaimers || []),
  ].join('\n\n');
  return body;
}

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Deterministic rotation so two pages never open with the same section order. */
function pick(ctx, list, n, salt = '') {
  const h = hash((ctx.path || '') + salt);
  const out = [];
  for (let i = 0; out.length < n && i < list.length; i++) {
    const item = list[(h + i) % list.length];
    out.push(typeof item === 'function' ? item(ctx) : item);
  }
  return out;
}

function trimDesc(s) {
  if (s.length <= 160) return s;
  const cut = s.slice(0, 157);
  return cut.slice(0, cut.lastIndexOf(' ')) + '…';
}

function clampTitle(s) {
  if (s.length <= 70) return s;
  const cut = s.slice(0, 70);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[ ,:;-]+$/, '');
}

/* -------------------------------------------------------------------------- */
/* FAQ builder                                                                 */
/* -------------------------------------------------------------------------- */

function faqFor(ctx, kind) {
  const f = ctx.firm;
  const name = f ? f.name : 'the firm';
  const other = ctx.other ? ctx.other.name : null;
  const base = [];

  if (kind === 'comparison' && other) {
    base.push(
      {
        q: `Is ${name} easier than ${other}?`,
        a: `Neither is easier in the abstract; they test different constraints. ${name} uses a ${f.drawdown} floor and ${f.billing} billing, while ${other} uses a ${ctx.other.drawdown} floor and ${ctx.other.billing} billing. A trader whose strategy holds through retracements will find the static floor easier, while a trader who takes quick profits and re-enters can work with either. Compare the mechanic against your own trade distribution, not the headline target.`,
      },
      {
        q: `Which of the two is cheaper across several attempts?`,
        a: `Multiply the entry cost by your realistic number of attempts. ${f.billing === 'one-off per attempt' ? `${name} charges once per attempt, so a slow pass costs the same as a fast one.` : `${name} bills monthly, so every extra week is a cost.`} ${ctx.other.billing === 'one-off per attempt' ? `${other} charges once per attempt.` : `${other} bills monthly.`} The cheaper headline is often not the cheaper route once the calendar is included.`,
      },
      {
        q: `Can I use the same strategy on both evaluations?`,
        a: `Only if the strategy does not depend on the rule you are changing. A ${floorShort(f)} loss floor and a ${floorShort(ctx.other)} loss floor require different stop placement and different sizing as profit accumulates. A strategy with fixed stops and a fixed risk unit can be ported, but the size has to be recalculated for each floor before the first trade.`,
      },
      {
        q: `Do both firms allow weekend holding?`,
        a: `${name} treats weekend holding as ${f.weekend || 'plan-specific, so confirm the exact product'}. ${other} treats it as ${ctx.other.weekend || 'plan-specific'}. Where holding is restricted, be flat before the close rather than at it, because spreads widen in the final minutes and an exit at the bell is not guaranteed to be clean.`,
      },
      {
        q: `Which one pays out sooner after a pass?`,
        a: `${name} pays ${f.payout}. ${other} pays ${ctx.other.payout}. The interval matters more than the split for first-year cash: a larger percentage paid after a long seasoning period can be worth less than a smaller percentage paid sooner. Check the first-payout restriction before comparing percentages.`,
      },
      {
        q: `Is a passing service allowed on either evaluation?`,
        a: `It depends on the terms of the exact plan, not on the brand. Some firms prohibit third-party trading of the evaluation, the funded account or both; others are silent, which is not permission. ${SITE.name} checks the terms before accepting a job and declines where the rules forbid it, rather than risking the account after payment.`,
      },
    );
  } else if (f) {
    base.push(
      {
        q: `How long does it take to pass a ${name} evaluation?`,
        a: `At disciplined sizing, most attempts land in the two-to-four-week range, with the lower bound set by the minimum-day rule (${f.minDays}) and the upper bound by the strategy's expectancy. A pass attempted in a handful of days usually relies on oversized trades, which is why it tends to create a consistency problem at payout or a thin cushion in the funded account.`,
      },
      {
        q: `What is the biggest reason ${name} attempts fail?`,
        a: `Position sizing against the starting balance instead of the remaining room. On a ${floorShort(f)} loss floor, the room changes as profit accumulates, so a fixed percentage risk becomes a growing share of the cushion. The second most common cause is a stop moved to avoid a loss, which converts a planned small loss into an unplanned large one.`,
      },
      {
        q: `Does ${name} allow weekend holding?`,
        a: `${f.weekend || 'The rule is plan-specific'}. Check the funded terms as well as the evaluation terms, because the two can differ. Where holding is restricted, close well before the session ends rather than at the bell, and size any permitted overnight position so that a two-times-stop gap is still survivable.`,
      },
      {
        q: `Can I pass a ${name} evaluation in one day?`,
        a: `Only where the plan has no minimum-day rule and the target is reachable inside a single session without breaching the daily stop. ${f.minDays === 'none on the evaluation' ? 'This plan does not impose a minimum day count, so a fast pass is technically possible.' : `This plan applies a minimum-day rule (${f.minDays}), so the calendar cannot be compressed below it.`} A one-day pass built on one oversized trade often fails a consistency test at payout, which makes the speed expensive.`,
      },
      {
        q: `Is ${name} legit?`,
        a: `Legitimacy is a question about payout evidence, not about the size of the marketing budget. Look for published terms, a documented payout process, a support channel that answers mechanics questions in writing, and a track record you can verify independently. No comparison page can substitute for the firm's own contract, and no firm is risk-free.`,
      },
      {
        q: `How much does a ${name} evaluation cost in total?`,
        a: `The entry fee multiplied by your expected number of attempts, plus platform or data costs. ${f.billing === 'monthly subscription per account' || f.billing === 'monthly subscription' ? 'Because billing is monthly, the calendar is part of the cost: a four-week attempt costs roughly four times a one-week attempt.' : 'Because billing is one-off, a slow pass costs the same as a fast one, which rewards patience.'} The flat ${SITE.price} service fee on this site covers retries and does not depend on account size.`,
      },
      {
        q: `What happens after I pass a ${name} evaluation?`,
        a: `You complete identity verification, sign the funded agreement, receive a funded login and trade under the funded rulebook, which can be stricter than the evaluation. ${name} pays ${f.payout}. The first payout is the point at which the process is proven; until then, the evaluation fee is a bet on the firm as well as on the strategy.`,
      },
    );
  }

  const generic = [
    {
      q: `Can I use a passing service for this?`,
      a: `Only if the firm's terms permit third-party trading on the exact plan. ${SITE.name} charges a flat ${SITE.price} per evaluation at any account size, covers retries, takes no profit split and declines work where the terms forbid it. The service fee is separate from the firm's own evaluation or reset charge.`,
    },
    {
      q: `How should I size positions on an evaluation account?`,
      a: `Start from the remaining loss room, not the starting balance. Risk 0.25–0.5% per trade while the room is intact and reduce that as the target approaches, especially on a trailing threshold. The stop belongs where the trade idea is invalidated; the position size is whatever makes that stop equal the chosen dollar risk.`,
    },
    {
      q: `Does the daily loss limit include open positions?`,
      a: `Usually yes, because most firms measure it on equity rather than balance. That means an open position in profit can still breach the limit if it reverses far enough. Confirm the definition on the firm's terms page and treat the daily stop as a hard cut-off rather than a target to approach.`,
    },
    {
      q: `What is a consistency rule and does it apply here?`,
      a: `A consistency rule caps how much of total profit may come from one trading day, often 30–50%. It can pass the evaluation target and still reduce or deny a payout, so it has to be part of the sizing plan from day one. Check whether it applies to the evaluation, the funded account or both.`,
    },
    {
      q: `Can I hold trades over the weekend?`,
      a: `It depends on the plan. Where holding is allowed, size for a gap of two or three times the stop, because a stop does not limit a loss when the market opens beyond it. Where holding is restricted, close thirty to sixty minutes before the session ends, while liquidity is still adequate.`,
    },
    {
      q: `How many trades should a challenge take?`,
      a: `Enough to reach the target at your normal risk unit, and no more. For a 0.5% risk unit with a 1:2 risk-reward and a 50% win rate, an 8% target needs roughly 32 trades. Trading more than the plan requires adds variance without adding expectancy, and variance is what ends evaluations.`,
    },
    {
      q: `Is it worth retrying a failed challenge?`,
      a: `Only if the cause of the failure has changed. If the same rule was breached in the same way, a retry buys the same outcome. If the failure was a specific execution error with a written fix, a retry is a rational purchase. The flat service fee exists for the second case, not as a substitute for diagnosis.`,
    },
    {
      q: `What should I do in the first week of an evaluation?`,
      a: `Trade small, learn the platform's execution and spreads, and establish the routine. The first week is for calibrating the plan, not for racing the target. A trader who gives back 2% in week one has spent a fifth of a typical loss allowance on calibration, which is avoidable with 0.25% risk.`,
    },
    {
      q: `How do I verify the terms before paying?`,
      a: `Open the plan page and the terms page side by side, screenshot the loss-floor and daily-stop definitions, find the consistency and payout clauses, list the prohibited conduct, and save dated copies. If a mechanic is ambiguous, ask support in writing and keep the reply. The dated copy is what settles a dispute.`,
    },
    {
      q: `Does a higher profit split mean a better firm?`,
      a: `Not on its own. A 90% split paid after ninety days can be worth less than an 80% split paid in the first fortnight, and a split with a consistency condition can be reduced after the fact. Compare the first-year cash after fees, not the percentage on the sales page.`,
    },
    {
      q: `What is the difference between a soft and a hard breach?`,
      a: `A soft breach usually resets progress or ends the trading day; a hard breach closes the account. The same violation can be soft at one firm and hard at another, so the classification matters as much as the rule. Check which one applies before assuming a mistake is recoverable.`,
    },
    {
      q: `Can I trade news on an evaluation?`,
      a: `Only if the plan explicitly allows it. Where it is restricted, being flat before the window is safer than relying on a stop, because a release can gap past the stop and the resulting loss can breach the daily limit. Where it is allowed, the permission is not a recommendation; size the event like an event.`,
    },
  ];

  // Rotate the generic pool per page so neighbouring articles do not carry an
  // identical FAQ block; the firm-specific questions always come first.
  const h = hash(String(ctx.path || ''));
  const rotated = generic.map((_, i) => generic[(h + i) % generic.length]);
  const seen = new Set();
  const out = [];
  for (const q of [...base, ...rotated]) {
    if (seen.has(q.q)) continue;
    seen.add(q.q);
    out.push(q);
    if (out.length >= 12) break;
  }
  return out;
}

/* -------------------------------------------------------------------------- */
/* Renderers                                                                   */
/* -------------------------------------------------------------------------- */

function firmFactsTable(f) {
  return table(
    ['Rule area', `${f.name} — published shape`],
    [
      ['Market', marketWord(f)],
      ['Evaluation model', f.model],
      ['Loss floor', f.drawdown],
      ['Daily stop', f.daily],
      ['Consistency', f.consistency],
      ['Minimum days', f.minDays],
      ['Billing', f.billing],
      ['Payout', f.payout],
      ['Platforms', f.platforms],
    ]
  );
}

function firmGuide(ctx) {
  const f = ctx.firm;
  const sections = [
    B.sections.rulebook(ctx),
    B.sections.drawdown(ctx),
    B.sections.sizing(ctx),
    B.sections.targetMath(ctx),
    B.sections.plan(ctx),
    B.sections.mistakes(ctx),
  ];
  for (const extra of ctx.extras || []) sections.push(extra(ctx));
  sections.push(B.sections.cost(ctx));
  sections.push(B.sections.service(ctx));
  sections.push(B.sections.verify(ctx));
  for (const extra of ctx.extras2 || []) sections.push(extra(ctx));
  sections.push(B.sections.afterPass(ctx));

  const body = finalize(ctx, sections, faqFor(ctx, 'firm'), {
    kicker: `${f.name} · evaluation guide · reviewed October 2026`,
    lede: `${f.name} runs a ${f.model} with a ${floorShort(f)} loss floor, ${dailyPhrase(f)} and ${f.billing} billing. This guide works through the rulebook in the order that decides an attempt: the loss floor first, then sizing, then the calendar, then the payout conditions that decide what a pass is actually worth. The numbers are illustrative and the mechanics are the firm's; confirm the current schedule on the plan page before you buy.`,
    keypoints: [
      `The loss floor is ${f.drawdown}. That single sentence decides how every trade must be sized.`,
      `Daily stop: ${f.daily}. On most evaluations it is measured on equity, so open positions count.`,
      `Minimum trading days: ${f.minDays}. That sets the floor on how fast a pass can be, whatever the target.`,
      `Billing is ${f.billing}, so a slow attempt costs ${f.billing === 'one-off per attempt' ? 'the same as a fast one, which rewards patience' : 'more each month, which rewards a fast pass'}.`,
      `A flat ${SITE.price} service fee covers any account size and retries, and is declined where the firm's terms forbid third-party trading.`,
    ],
    ctaHeading: `${f.name} evaluation, traded for you`,
    ctaText: `One flat <strong>${SITE.price}</strong> for any account size. Retries covered, no profit split, funded login in your name. If ${f.name}'s terms forbid third-party trading we tell you before you pay.`,
    disclaimers: [f.name],
  });

  return {
    title: clampTitle(`${f.name} Challenge Passing: The 2026 Rulebook`),
    desc: trimDesc(
      `How to pass a ${f.name} evaluation: the ${floorShort(f)} loss floor, the daily stop, position sizing, a 20-session plan and the payout rules that decide what a pass is worth.`
    ),
    h1: `How to pass a ${f.name} challenge: the rulebook, the math and the plan`,
    kicker: `${f.name} challenge`,
    crumb: `${f.name} challenge passing`,
    section: 'Firm guides',
    body,
  };
}

function review(ctx) {
  const f = ctx.firm;
  const sections = [
    sec(
      'verdict',
      `The short verdict on ${f.name}`,
      [
        p(
          `${f.name} is a ${marketWord(f)} evaluator built on a ${f.model}, with a ${floorShort(f)} loss floor, ${dailyPhrase(f)} and ${f.billing} billing. The product is a reasonable fit for ${f.bestFor}. It is a poor fit for a trader whose strategy needs the opposite drawdown mechanic, or whose budget cannot absorb the billing rhythm across several attempts.`
        ),
        table(
          ['Question', 'Answer'],
          [
            ['Who is it for?', f.bestFor],
            ['What is the strongest feature?', f.strengths[0]],
            ['What is the biggest caution?', f.cautions[0]],
            ['How is it billed?', f.billing],
            ['How does it pay?', f.payout],
          ]
        ),
        p(
          `The review below separates the three things traders usually blend together: the rulebook, the commercial terms and the operational experience. A firm can be strong on one and weak on another, and the weighting depends on what you are buying. A trader who intends to pass once and withdraw immediately cares most about the payout clause; a trader who intends to run several accounts cares about the dashboard, support and reset policy.`
        ),
      ]
    ),
    B.sections.rulebook(ctx),
    B.sections.drawdown(ctx),
    sec(
      'strengths',
      `What ${f.name} does well`,
      [
        p(
          `The strengths are structural rather than promotional. ${f.strengths.join('. ')}. Those are the features that show up in the trading experience, not just on the comparison table.`
        ),
        ul(f.strengths.map((s) => `<strong>${s}.</strong>`)),
        p(
          `The strongest feature is usually the one that matches your own constraint. If your strategy holds positions through retracements, a static floor is worth more than a lower fee. If you need a fast pass, a one-step structure is worth more than a slightly larger profit split. If you trade a session that overlaps the firm's instrument hours, the platform list matters less than the execution quality during that session.`
        ),
        p(
          `It is worth separating a feature from a marketing claim. "No minimum days" is a feature because it changes the calendar. "Best payout in the industry" is a claim unless the payout clause defines the interval, the minimum and the consistency condition. The review weights features by whether they change a decision you will actually make during the attempt.`
        ),
      ]
    ),
    sec(
      'cautions',
      `Where ${f.name} is weaker`,
      [
        p(
          `The cautions are equally structural. ${f.cautions.join('. ')}. None of them is a reason to avoid the firm automatically, but each has to be priced into the plan before the fee is paid.`
        ),
        ul(f.cautions.map((c) => `<strong>${c}.</strong>`)),
        p(
          `The caution that matters most is the one that interacts with your strategy. A trailing threshold is harmless for a trader who takes one trade a day and closes it before the session ends; it is decisive for a trader who holds through a retracement. A monthly subscription is harmless for a trader who expects to pass in ten days; it is expensive for one who expects to take two months.`
        ),
        p(
          `Operational cautions are harder to verify and more important over time. How quickly does support answer a mechanics question? Does the dashboard show the distance to the loss floor? Is the payout statement itemised? These are the things that decide whether a funded account is pleasant to run, and they are not visible on a sales page.`
        ),
      ]
    ),
    B.sections.cost(ctx),
    B.sections.payout(ctx),
    B.sections.alternatives(ctx),
    B.sections.verify(ctx),
    sec(
      'bottom-line',
      'Bottom line',
      [
        p(
          `${f.name} is worth considering if the rulebook matches your strategy and the billing rhythm matches your expected timeline. It is not worth considering as a generic "best firm" purchase, because the firm's mechanic is the product. A trader who buys a ${floorShort(f)} loss floor and then trades it like a static account has bought the wrong product, whatever the fee.`
        ),
        p(
          `The score that matters is not a star rating. It is the number of attempts you expect, multiplied by the cost per attempt, compared with the cost of a flat-fee service and the time you have. ${f.name} is a good deal when you pass early and a poor one when the rulebook fights your method. Judge it on that arithmetic rather than on the marketing.`
        ),
      ]
    ),
    B.sections.checklist(ctx),
  ];

  return {
    title: clampTitle(`${f.name} Review 2026: Rules, Costs, Fit`),
    desc: trimDesc(
      `${f.name} review for 2026: the ${floorShort(f)} loss floor, ${f.billing} billing, payout rhythm, strengths, cautions and the traders the rulebook actually fits.`
    ),
    h1: `${f.name} review 2026: the rulebook, the cost and the verdict`,
    kicker: `${f.name} review`,
    crumb: `${f.name} review`,
    section: 'Firm reviews',
    body: finalize(ctx, sections, faqFor(ctx, 'review'), {
      kicker: `${f.name} review · October 2026`,
      lede: `A review of ${f.name} that starts with the rulebook rather than the profit split: what a ${floorShort(f)} loss floor does to position sizing, how ${f.billing} billing changes the cost of a slow pass, and which traders the product genuinely fits. Every figure describes the published shape of the plan; confirm the current schedule before buying.`,
      keypoints: [
        `${f.name} evaluates ${marketWord(f)} accounts on a ${f.model}.`,
        `The loss floor is ${f.drawdown}; the daily stop is ${f.daily}.`,
        `Billing is ${f.billing} and payouts follow ${f.payout}.`,
        `Best fit: ${f.bestFor}.`,
        `Main caution: ${f.cautions[0].toLowerCase()}.`,
      ],
      ctaHeading: `Want the ${f.name} evaluation traded for you?`,
      ctaText: `Flat <strong>${SITE.price}</strong>, any account size, retries covered, no profit split. We check ${f.name}'s terms before accepting the job.`,
      disclaimers: [f.name],
    }),
  };
}

function comparison(ctx) {
  const a = ctx.firm;
  const b = ctx.other;
  const c = ctx.third || null;
  const sameMarket = a.market === b.market;
  const sections = [
    sec(
      'shape',
      `${a.name} vs ${b.name}: the two rulebooks side by side`,
      [
        p(
          `The comparison that matters is not which firm has the larger target. It is which rulebook changes your behaviour. ${a.name} uses a ${a.drawdown} floor, ${a.daily} daily stop and ${a.billing}; ${b.name} uses a ${b.drawdown} floor, ${b.daily} daily stop and ${b.billing}. Those differences decide how much you can risk, how fast you can pass and what a failed attempt costs.`,
        ),
        table(
          ['Parameter', a.name, b.name, ...(c ? [c.name] : [])],
          [
            ['Market', marketWord(a), marketWord(b), ...(c ? [marketWord(c)] : [])],
            ['Evaluation model', a.model, b.model, ...(c ? [c.model] : [])],
            ['Loss floor', a.drawdown, b.drawdown, ...(c ? [c.drawdown] : [])],
            ['Daily stop', a.daily, b.daily, ...(c ? [c.daily] : [])],
            ['Consistency', a.consistency, b.consistency, ...(c ? [c.consistency] : [])],
            ['Minimum days', a.minDays, b.minDays, ...(c ? [c.minDays] : [])],
            ['Billing', a.billing, b.billing, ...(c ? [c.billing] : [])],
            ['Payout', a.payout, b.payout, ...(c ? [c.payout] : [])],
            ['Platforms', a.platforms, b.platforms, ...(c ? [c.platforms] : [])],
            ['Session', a.session, b.session, ...(c ? [c.session] : [])],
          ]
        ),
        p(
          `${sameMarket ? `Both firms evaluate ${marketWord(a)} accounts, so the instruments are broadly comparable and the decision turns on the rule mechanics and commercial terms.` : `${a.name} evaluates ${marketWord(a)} accounts while ${b.name} evaluates ${marketWord(b)} accounts. That difference is prior to every other comparison: the sessions, position sizing, costs and gap risk are not the same product category.`} A trader who ignores this and compares only the headline target is comparing two different sports by their scoreboards.`
        ),
        p(
          `The table is a map of the questions to ask, not a verdict. Two firms can publish the same target and produce completely different pass rates because one measures loss from the starting balance and the other from peak equity. Before reading the rest of this comparison, identify which row would end your last attempt. That row is the one to compare most carefully.`
        ),
      ]
    ),
    sec(
      'drawdown',
      `${a.name} vs ${b.name}: the drawdown mechanics compared`,
      [
        p(
          `A ${a.drawdown} floor and a ${b.drawdown} floor are not two versions of the same rule. ${/trailing/i.test(a.drawdown) ? `${a.name}'s floor follows peak equity, so an open winner raises the failure point and a retracement can end the account while the balance is still positive.` : `${a.name}'s floor is anchored to the starting balance, so profit does not move the failure point and an open position cannot pull it closer.`} ${/trailing/i.test(b.drawdown) ? `${b.name}'s floor follows peak equity in the same way.` : `${b.name}'s floor is static, so the distance to failure stays fixed for the whole attempt.`}`
        ),
        p(
          `The difference shows up in the correct risk per trade. On a static floor, a fixed 0.5% risk unit stays at 0.5% of the account for the whole evaluation. On a trailing floor, the same fixed unit becomes a growing share of the remaining cushion as profit accumulates, so the size has to fall in the final third of the target. A trader who does not make that adjustment can pass the target and still breach on the retracement that follows.`
        ),
        figure(
          'drawdown-types.svg',
          `Diagram comparing the ${a.name} and ${b.name} loss floors and where each one moves`,
          'The floor that moves changes every sizing decision after the first winner.'
        ),
        p(
          `There is a second interaction: the daily stop. ${/yes/i.test(a.daily) ? `${a.name} applies a daily stop, so a bad session has a hard end.` : `${a.name} does not apply a separate daily stop on the standard evaluation, so the total floor is the only backstop.`} ${/yes/i.test(b.daily) ? `${b.name} applies a daily stop.` : `${b.name} relies on the total floor.`} A daily stop protects the account from a single catastrophic session but also creates a second way to fail; a rulebook without one gives more room per day but punishes a trader who cannot stop.`
        ),
        p(
          `The practical test is to take your last twenty trades and replay them against both rulebooks, trading the same size and the same stops. Count how many would have breached each floor and on which day. That exercise produces a better answer than any comparison table, because it uses your distribution rather than a generic assumption about volatility.`
        ),
      ]
    ),
    sec(
      'cost',
      `${a.name} vs ${b.name}: cost across attempts`,
      [
        p(
          `The entry fee is the visible cost; the expected number of attempts is the real one. ${a.billing === 'one-off per attempt' ? `${a.name} charges once per attempt, so the cost of a slow pass equals the cost of a fast one.` : `${a.name} bills monthly, so every week spent in the attempt is a cost and a slow pass is more expensive.`} ${b.billing === 'one-off per attempt' ? `${b.name} charges once per attempt.` : `${b.name} bills monthly, so the calendar is a cost centre.`}`
        ),
        table(
          ['Scenario', `${a.name}`, `${b.name}`],
          [
            ['One attempt, passed quickly', 'One fee or one billing cycle', 'One fee or one billing cycle'],
            ['Two attempts', 'Two fees or two cycles plus time', 'Two fees or two cycles plus time'],
            ['Slow pass over eight weeks', a.billing === 'one-off per attempt' ? 'Unchanged entry cost' : 'Roughly two months of billing', b.billing === 'one-off per attempt' ? 'Unchanged entry cost' : 'Roughly two months of billing'],
            ['Flat service route', `${SITE.price} per evaluation`, `${SITE.price} per evaluation`],
          ]
        ),
        p(
          `A like-for-like comparison also includes platform and data costs. Futures evaluations often require a data feed or a platform subscription that is separate from the evaluation fee; forex evaluations usually include platform access but may charge for a VPS if the strategy needs one. Add those costs to both sides before declaring a winner on the sticker price.`
        ),
        p(
          `The flat-fee service on this site is deliberately the same price for either firm, because the fee is for the work of passing a rulebook, not for the brand on the dashboard. That removes the fee from the choice between the two firms and leaves the rulebook as the deciding variable, which is where the decision should have been in the first place.`
        ),
      ]
    ),
    sec(
      'fit',
      `Which trader should choose ${a.name}, and which should choose ${b.name}`,
      [
        p(
          `Choose ${a.name} if your strategy fits a ${floorShort(a)} loss floor, you can trade its session (${a.session}) and its billing rhythm (${a.billing}) matches your expected timeline. It is specifically suited to ${a.bestFor}. The strongest reason to pick it is ${a.strengths[0].toLowerCase()}.`
        ),
        p(
          `Choose ${b.name} if your strategy fits a ${floorShort(b)} loss floor, you can trade its session (${b.session}) and its billing rhythm (${b.billing}) matches your timeline. It is specifically suited to ${b.bestFor}. The strongest reason to pick it is ${b.strengths[0].toLowerCase()}.`
        ),
        p(
          `Do not choose either on the basis of the profit split alone. A split is applied to profit that only exists if the account survives, and the account survives only if the rulebook matches the strategy. The split is the least informative number on the page, even though it is the one printed largest.`
        ),
        p(
          `If both fit, choose on operational quality: support response, dashboard clarity, payout statement detail and the reset policy. Those are the parts of the product you will use every week after the pass, and they are the parts least visible before purchase. Ask a mechanics question before buying and judge the answer.`
        ),
      ]
    ),
    ...(c
      ? [
          sec(
            'third',
            `Where ${c.name} fits in this comparison`,
            [
              p(
                `${c.name} is the third product in this group and it changes the choice in a specific way: ${c.drawdown}, ${c.billing} and ${c.daily} daily stop. It suits ${c.bestFor}. A three-way comparison is useful only if the third product changes the ranking of the first two; otherwise it adds a column without adding a decision.`
              ),
              table(
                ['Question', a.name, b.name, c.name],
                [
                  ['Strongest feature', a.strengths[0], b.strengths[0], c.strengths[0]],
                  ['Main caution', a.cautions[0], b.cautions[0], c.cautions[0]],
                  ['Best fit', a.bestFor, b.bestFor, c.bestFor],
                ]
              ),
              p(
                `The practical way to use the three columns is to eliminate rather than to rank. First remove any product whose market or session you cannot trade. Then remove any product whose loss-floor mechanic fights your holding period. Then compare billing against your expected timeline. The product that survives is the choice, and the other two were never candidates.`
              ),
              p(
                `If all three survive, the decision is operational: support, dashboard detail, payout statement clarity and the reset policy. Those are the parts of the product you will use after the pass, and they are the parts a comparison table cannot score. Ask each firm a mechanics question in writing and judge the reply.`
              ),
            ]
          ),
        ]
      : []),
    B.sections.payout({ ...ctx, firm: a }),
    B.sections.mistakes({ ...ctx, firm: a }),
    sec(
      'service',
      `Using a passing service on either evaluation`,
      [
        p(
          `The service route is identical in shape for both firms: a flat ${SITE.price} per evaluation, retries covered, no profit split, funded login in your name. What differs is the firm's own terms on third-party trading. Some permit it on the evaluation but not the funded account, some prohibit it outright, and some are silent. Silence is not permission, and a provider that treats it as permission is transferring the risk to you.`
        ),
        p(
          `The service fee is separate from the firm's evaluation fee. If the account breaches during the attempt, the retry is covered by the service, but the firm's own reset charge is not. Confirm both numbers before paying either side, and confirm that the funded account will be issued in your name with your identity verification.`
        ),
        p(
          `A passing service does not make a bad rulebook good. If the firm's terms forbid the arrangement, the correct answer is no, however attractive the fee. The value of the service is that it removes the execution risk of a rulebook you already understand, not that it creates access to a firm that would otherwise exclude you.`
        ),
      ]
    ),
    B.sections.verify({ ...ctx, firm: a }),
  ];

  return {
    title: clampTitle(ctx.title || `${a.name} vs ${b.name}: 2026 Rulebook Comparison`),
    desc: trimDesc(
      ctx.desc ||
        `${a.name} vs ${b.name} compared on drawdown mechanics, daily stops, billing, payout rhythm and the traders each rulebook actually fits. Includes cost across repeated attempts.`
    ),
    h1: ctx.h1 || `${a.name} vs ${b.name}: which rulebook fits your trading`,
    kicker: 'Firm comparison',
    crumb: `${a.name} vs ${b.name}`,
    section: 'Firm comparisons',
    body: finalize(ctx, sections, faqFor(ctx, 'comparison'), {
      kicker: `Firm comparison · reviewed October 2026`,
      lede: `${a.name} and ${b.name} are compared on the rows that decide an attempt: the loss floor, the daily stop, the billing rhythm and the payout conditions. ${sameMarket ? 'They evaluate the same broad market, so the decision turns on mechanics and commercial terms.' : `They evaluate different markets — ${marketWord(a)} versus ${marketWord(b)} — which changes the sessions, the sizing and the gap risk before any headline target is relevant.`} Numbers below describe each published rulebook's shape; confirm the current plan schedule before buying.`,
      keypoints: [
        `${a.name}: ${a.drawdown}, ${a.billing}.`,
        `${b.name}: ${b.drawdown}, ${b.billing}.`,
        `${/trailing/i.test(a.drawdown) !== /trailing/i.test(b.drawdown) ? 'One floor trails peak equity and the other is fixed, so the same equity curve can fail one and survive the other.' : 'Both floors use the same mechanic, so the decision turns on daily stops, billing and payout terms.'}`,
        `Daily stops: ${a.daily} versus ${b.daily}${c ? ` versus ${c.daily}` : ''}.`,
        `A flat ${SITE.price} service fee applies to any of the firms and any account size.`,
      ],
      ctaHeading: `${a.name} or ${b.name} — traded for you`,
      ctaText: `One flat <strong>${SITE.price}</strong> for either evaluation, any account size. Retries covered, no profit split, funded login in your name. If the firm's terms forbid third-party trading, we decline before payment.`,
      disclaimers: [a.name, b.name, c ? c.name : null].filter(Boolean),
    }),
  };
}

function strategy(ctx) {
  const f = ctx.firm;
  const core = [
    sec(
      'frame',
      'What this guide is really solving',
      [
        p(ctx.topicIntro),
        p(
          `The frame matters because most prop-firm advice is written as if the only problem were finding a profitable strategy. It is not. An evaluation adds three constraints that a personal account does not have: a loss floor that ends the account, a calendar that may impose minimum days, and a payout condition that can reduce a profit after the pass. A method that ignores those constraints can be profitable in a demo and still fail the evaluation.`
        ),
        p(
          `The rest of this guide works through those constraints in the order they bind: the loss floor first, because it decides position size; the target second, because it decides how many trades the plan needs; the calendar third, because it decides whether the plan is feasible; and the payout conditions last, because they decide whether a pass is worth anything. Each section ends with a rule that can be written down and checked.`
        ),
      ]
    ),
  ];
  const sections = [
    ...core,
    ...pick(ctx, [B.sections.drawdown, B.sections.sizing, B.sections.targetMath], 2, 'core'),
    ...pick(
      ctx,
      [
        B.sections.plan,
        B.sections.mistakes,
        B.sections.psychology,
        B.sections.journal,
        B.sections.checklist,
        B.sections.verify,
        B.sections.weekend,
        B.sections.news,
      ],
      5,
      'body'
    ),
  ];

  const body = finalize(ctx, sections, faqFor(ctx, 'strategy'), {
    kicker: `${ctx.kicker || 'Challenge strategy'} · reviewed October 2026`,
    lede: ctx.lede,
    keypoints: ctx.keypoints,
    ctaHeading: 'Want the evaluation traded for you?',
    ctaText: `One flat <strong>${SITE.price}</strong> for any prop firm, any stage, any account size. Retries covered, no profit split, funded login in your name.`,
    disclaimers: f ? [f.name] : [],
  });

  return {
    title: clampTitle(ctx.title),
    desc: trimDesc(ctx.desc),
    h1: ctx.h1,
    kicker: ctx.kicker || 'Challenge strategy',
    crumb: ctx.crumb || ctx.h1,
    section: 'Strategy',
    body,
  };
}

function mechanic(ctx) {
  const f = ctx.firm;
  const sections = [
    sec(
      'definition',
      `What ${ctx.topicTitle} means in a prop evaluation`,
      [
        p(ctx.topicIntro),
        p(
          `The definition matters because the same word can mean different things at different firms. A "drawdown" can be static or trailing; a "daily loss" can be measured on balance or equity; a "consistency rule" can apply to the evaluation, the funded account or both. When a rule is ambiguous, the firm's own terms page is the definition, and a support reply in writing is the only useful clarification.`
        ),
        p(
          `This guide uses the mechanic as the unit of analysis rather than the brand, because the brand changes and the mechanic does not. Once you understand how a rule behaves, you can apply it to any firm's schedule in a few minutes: read the definition, identify what the number is measured against, and work out which of your decisions it changes.`
        ),
      ]
    ),
    sec(
      'math',
      `The arithmetic, on an illustrative account`,
      [
        p(
          `Take an illustrative $100,000 account with a 10% total loss allowance, a 5% daily stop and an 8% target. Those are round numbers, not a claim about any firm's current schedule, and they make the mechanic visible. Every calculation below can be redone with your own account size; the proportions stay the same.`
        ),
        table(
          ['Measure', 'Amount', 'What it constrains'],
          [
            ['Starting balance', '$100,000', 'The reference point for a static floor'],
            ['Total loss allowance', '$10,000', 'The distance to account closure'],
            ['Daily stop', '$5,000', 'The maximum loss in one session'],
            ['Profit target', '$8,000', 'The distance to a pass'],
            ['Risk per trade at 0.5%', '$500', 'Twenty consecutive losses to the total floor'],
            ['Risk per trade at 1%', '$1,000', 'Ten consecutive losses to the total floor'],
          ]
        ),
        p(
          `The table exposes the first trap: a 10% total loss allowance and a 1% risk unit allow ten consecutive losses, but the daily stop may end the day after five. The binding constraint is the smaller of the two, and it changes with the time of day. A trade that is acceptable at the open is not automatically acceptable after three losses in the same session.`
        ),
        p(
          `The second trap is compounding. A 0.5% risk unit is 0.5% of the current balance, not of the starting balance, if the trader recalculates after each trade. After a 3% drawdown, the same percentage risks slightly less in dollars, which slows the recovery. After a 3% gain, it risks slightly more. Most evaluation plans are simpler and safer with a fixed dollar risk, recalculated only when the account size changes.`
        ),
        figure(
          'challenge-math.svg',
          'Diagram showing the relationship between account size, loss allowance, daily stop and profit target',
          'The target is one distance; the loss allowance and daily stop are two separate limits.'
        ),
        p(
          `Write the numbers on a card before the first trade: the dollar value of the total floor, the dollar value of the daily stop, the dollar risk per trade, and the maximum number of losses the day can absorb. A trader who can state all four from memory is far less likely to breach one by accident.`
        ),
      ]
    ),
    ...pick(
      ctx,
      [
        B.sections.mistakes,
        B.sections.plan,
        B.sections.sizing,
        B.sections.verify,
        B.sections.checklist,
        B.sections.glossary,
        B.sections.psychology,
        B.sections.journal,
      ],
      4,
      'mechanic'
    ),
  ];

  const body = finalize(ctx, sections, faqFor(ctx, 'mechanic'), {
    kicker: `${ctx.kicker || 'Rules explained'} · reviewed October 2026`,
    lede: ctx.lede,
    keypoints: ctx.keypoints,
    ctaHeading: 'Want the rulebook traded for you?',
    ctaText: `Flat <strong>${SITE.price}</strong>, any firm, any account size, retries covered. We read the terms before accepting the job.`,
    disclaimers: f ? [f.name] : [],
  });

  return {
    title: clampTitle(ctx.title),
    desc: trimDesc(ctx.desc),
    h1: ctx.h1,
    kicker: ctx.kicker || 'Rules explained',
    crumb: ctx.crumb || ctx.h1,
    section: 'Rules',
    body,
  };
}

function money(ctx) {
  const sections = [
    sec(
      'numbers',
      'The numbers that decide the cost',
      [
        p(ctx.topicIntro),
        table(
          ['Item', 'Typical shape', 'How it changes the total'],
          [
            ['Evaluation fee', 'One-off or monthly, by account size', 'Multiplied by the number of attempts'],
            ['Reset or retry fee', 'Often discounted, sometimes full price', 'The hidden cost of a failed attempt'],
            ['Platform or data fee', 'Monthly, mainly on futures', 'Continues between attempts'],
            ['Funded account costs', 'Usually none, sometimes a data fee', 'Reduces the net payout'],
            ['Payout processing', 'Processor fee, varies by method', 'Largest on small first withdrawals'],
          ]
        ),
        p(
          `The total cost of reaching a first payout is the sum of those rows, not the first one. A $100 evaluation that takes three attempts, a $50 monthly data fee for three months and a $30 payout fee costs $430 before any profit. A $250 evaluation passed first time costs $280. The cheaper headline is the more expensive route in this example, which is why the comparison has to be made on the total.`
        ),
        p(
          `The breakeven calculation is simple: divide the total cost by your expected net payout. If a funded account pays $1,600 net on a typical first withdrawal and the route costs $430, the first payout covers the cost and the second is profit. If the route costs $1,200, it takes most of a year of average payouts to break even. Neither number is a reason to buy or avoid; they are the terms of the bet.`
        ),
      ]
    ),
    B.sections.cost(ctx),
    sec(
      'roi',
      'The return on the fee, honestly',
      [
        p(
          `A prop evaluation is a leveraged bet on your own execution. The fee buys a chance at a funded account, not the account itself, and the expected value depends on the probability of a pass multiplied by the value of the funded account, minus the fee. That is the whole model, and most marketing avoids it because the probability is the hard input.`
        ),
        p(
          `The probability can be estimated from your own record. If you have taken twenty trades at a fixed risk unit and a documented expectancy, you can simulate the pass probability for a given target and floor. If you have no record, the honest estimate is "unknown", and the correct first purchase is a small account or a demo, not the largest available evaluation.`
        ),
        p(
          `The value of the funded account is the net payout you expect before the account fails or you stop trading it. That is usually a few months of average profit, not a year, because the same loss floor applies after the pass. A $10,000 account that pays $800 a month for four months is worth $3,200, not $9,600, and the fee should be compared with the former.`
        ),
      ]
    ),
    B.sections.payout(ctx),
    ...pick(
      ctx,
      [B.sections.tax, B.sections.verify, B.sections.checklist, B.sections.consistency, B.sections.tax],
      2,
      'money'
    ),
  ];

  const body = finalize(ctx, sections, faqFor(ctx, 'money'), {
    kicker: `${ctx.kicker || 'Costs'} · reviewed October 2026`,
    lede: ctx.lede,
    keypoints: ctx.keypoints,
    ctaHeading: 'One flat fee instead of repeated attempts',
    ctaText: `<strong>${SITE.price}</strong> per evaluation, any firm, any account size, retries covered, no profit split. The fee is declined where the firm's terms forbid third-party trading.`,
    disclaimers: ctx.firm ? [ctx.firm.name] : [],
  });

  return {
    title: clampTitle(ctx.title),
    desc: trimDesc(ctx.desc),
    h1: ctx.h1,
    kicker: ctx.kicker || 'Costs',
    crumb: ctx.crumb || ctx.h1,
    section: 'Costs',
    body,
  };
}

const LIST_FILTERS = {
  beginners: (f) => f.bestFor.match(/beginner|first|cheap|low-cost/i),
  cheap: () => true,
  cheapest: () => true,
  futures: (f) => f.market === 'futures',
  forex: (f) => f.market === 'forex',
  scalping: (f) => /static/i.test(f.drawdown),
  swing: (f) => /static/i.test(f.drawdown) && f.weekend !== 'restricted',
  gold: (f) => f.market === 'forex',
  instant: (f) => /instant|one-step|single/i.test(f.model),
  payout: (f) => /on demand|request|fixed/i.test(f.payout),
  'no-time-limit': () => true,
  'without-consistency': (f) => f.consistency === 'none',
};

function list(ctx) {
  const pool = ctx.pool || [];
  const rows = pool.slice(0, 10).map((f, i) => [
    String(i + 1),
    f.name,
    marketWord(f),
    floorShort(f),
    f.billing.replace(' per attempt', '').replace(' per account', ''),
    f.bestFor,
  ]);

  const mini = pool.slice(0, 8).map((f) =>
    sec(
      `firm-${f.key}`,
      `${f.name}: ${f.strengths[0]}`,
      [
        p(
          `${f.name} is a ${marketWord(f)} evaluator with a ${f.model} and a ${floorShort(f)} loss floor. Its strongest feature is ${f.strengths[0].toLowerCase()}, and its main caution is ${f.cautions[0].toLowerCase()}. It suits ${f.bestFor}.`
        ),
        p(
          `On this list it ranks where it does because of ${ctx.rankBasis || 'the balance between rulebook fit and total cost'}. A trader who values ${f.strengths[1].toLowerCase()} will weight it higher; a trader who cannot tolerate ${f.cautions[1].toLowerCase()} will weight it lower. Both are legitimate readings of the same facts.`
        ),
      ]
    )
  );

  const sections = [
    sec(
      'criteria',
      'How this list was ranked',
      [
        p(ctx.topicIntro),
        p(
          `The ranking is built from the rulebook first and the price second. A firm with a generous target and a floor that fights every strategy is not a good firm; it is a cheap way to lose a fee. The criteria below are the ones that change an outcome, in the order they bind.`
        ),
        ul([
          '<strong>Loss-floor mechanic.</strong> Static or trailing, and what it is measured against. This decides sizing more than any other row.',
          '<strong>Daily stop.</strong> The presence of one changes how a bad session ends and how much room a single trade can consume.',
          '<strong>Consistency condition.</strong> A payout test that can reduce a profitable pass to an unpaid one.',
          '<strong>Billing rhythm.</strong> One-off versus subscription, which decides whether patience is free or expensive.',
          '<strong>Payout rhythm.</strong> The interval to the first payout matters more than the headline split.',
          '<strong>Operational quality.</strong> Terms clarity, support and dashboard detail, judged from published documentation.',
        ]),
        figure(
          'firm-landscape.svg',
          'Diagram grouping prop firms by market, evaluation model and billing rhythm',
          'Grouping by rulebook shape is more useful than ranking by brand recognition.'
        ),
        p(
          `The list deliberately mixes markets. A futures evaluation and a forex evaluation are not substitutes, so a single ranking across both is only meaningful if the reader filters by the market they can actually trade. Use the market column as a hard filter before reading the rank.`
        ),
      ]
    ),
    sec(
      'table',
      'The shortlist at a glance',
      [
        table(
          ['#', 'Firm', 'Market', 'Loss floor', 'Billing', 'Best for'],
          rows
        ),
        p(
          `A table cannot show the interaction between rows. A firm with a static floor and a monthly subscription is cheap for a fast trader and expensive for a slow one; a firm with a trailing floor and a one-off fee is the reverse. Read the table as a set of questions to ask about your own timeline, not as a final ordering.`
        ),
      ]
    ),
    ...mini,
    sec(
      'choose',
      'How to choose between them',
      [
        p(
          `Start with the market you can trade in the hours you are available. That single filter usually removes half the list. Then choose the loss-floor mechanic that matches your holding period: static for strategies that endure retracements, trailing for strategies that take profit quickly and re-enter. Then compare billing against your expected timeline.`
        ),
        p(
          `Only after those three filters should price enter the decision. A $50 difference in entry fee is noise compared with the difference between passing on the second attempt and the fifth. The total cost across attempts is the number to compare, and it depends on the rulebook fit more than on the checkout price.`
        ),
        p(
          `Finally, verify the terms for the exact plan you are buying. Every firm on this list publishes its schedule, and every schedule can change between cohorts. A dated screenshot of the terms page is the only record that will resolve a dispute about what applied on the day of purchase.`
        ),
      ]
    ),
    ...pick(ctx, [B.sections.verify, B.sections.checklist, B.sections.cost, B.sections.consistency], 2, 'list'),
  ];

  const body = finalize(ctx, sections, faqFor(ctx, 'list'), {
    kicker: `${ctx.kicker || 'Rankings'} · reviewed October 2026`,
    lede: ctx.lede,
    keypoints: ctx.keypoints,
    ctaHeading: 'Any firm on this list, traded for you',
    ctaText: `One flat <strong>${SITE.price}</strong> per evaluation, any account size, retries covered, no profit split. We decline firms whose terms forbid third-party trading.`,
    disclaimers: pool.slice(0, 3).map((f) => f.name),
  });

  return {
    title: clampTitle(ctx.title),
    desc: trimDesc(ctx.desc),
    h1: ctx.h1,
    kicker: ctx.kicker || 'Rankings',
    crumb: ctx.crumb || ctx.h1,
    section: 'Rankings',
    body,
  };
}

function servicePage(ctx) {
  const sections = [
    sec(
      'how',
      'What the service actually does',
      [
        p(ctx.topicIntro),
        p(
          `The process is deliberately narrow. You choose the firm and the account size; the service reads that firm's terms for the exact plan; if third-party trading is permitted, it trades the evaluation to the target inside the rulebook; if the account breaches, it retries under the same flat fee; when the target is reached, the funded account is issued in your name. The service does not hold the funded account and takes no share of its profit.`
        ),
        ol([
          'Confirm the firm, plan and account size, and check the terms on third-party trading.',
          'Pay the flat fee only after the terms are confirmed.',
          'The evaluation is traded to the target under the firm\'s loss floor and daily stop.',
          'On a pass, identity verification and the funded contract are completed in your name.',
          'The funded login is handed back; payouts are yours, with no profit split.',
        ]),
        p(
          `The parts that are not included matter as much as the parts that are. The firm's own evaluation fee and any reset charge are separate. The service cannot change the firm's rules, speed up a minimum-day requirement, or guarantee a payout that the funded terms make conditional. It removes execution risk, not counterparty or rule risk.`
        ),
      ]
    ),
    sec(
      'legit',
      'How to tell a legitimate service from a bad one',
      [
        p(
          `The market contains three kinds of provider: services that trade within the terms, services that ignore the terms, and services that take the fee and never trade. The first is a legitimate product; the second transfers a rules risk to the client; the third is fraud. The difference is visible before payment if you ask the right questions.`
        ),
        table(
          ['Question', 'Good answer', 'Warning sign'],
          [
            ['Which firms do you accept?', 'A named list with terms checked', '"Any firm, guaranteed"'],
            ['Who holds the login?', 'The service during the evaluation only', 'The service holds the funded account'],
            ['What if the account breaches?', 'Retry covered under the same fee', 'A new fee or no policy'],
            ['Do you take a profit split?', 'No, the funded account is yours', 'A percentage of funded profit'],
            ['Can I see the terms check?', 'A written confirmation per firm', 'Refusal or a generic claim'],
          ]
        ),
        p(
          `A guarantee is the least useful promise, because it is the hardest to enforce. A written terms check, a refund policy and a named contact are worth more than any claim about pass rates. If the provider cannot tell you which clause permits the arrangement, the arrangement is probably not permitted.`
        ),
        p(
          `Price is also a signal. A fee that is far below the market either buys a much smaller service or is not a service at all. A fee that is a percentage of the funded account aligns incentives but also gives the provider a claim on the account. The flat fee model is simple to audit: one payment, retries covered, no ongoing claim.`
        ),
      ]
    ),
    sec(
      'firms',
      'Firms, plans and the third-party trading clause',
      [
        p(
          `The clause that decides whether a service can operate is usually called "third-party trading", "account sharing" or "account management". Some firms prohibit it on the evaluation, some on the funded account, and some on both. A service that does not ask which plan you bought cannot know which clause applies, because the same firm can publish different terms for different products.`
        ),
        p(
          `Where the terms permit the arrangement, the practical requirements are usually identity, login control and conduct. The account must remain in your name, the identity verification must be yours, and the trading must follow the same conduct rules as self-trading: no hedging across accounts, no prohibited news trading, no exploiting pricing errors. A service that treats the evaluation as a technical challenge rather than a compliance one is a risk to the account.`
        ),
        p(
          `Where the terms are silent, the safe reading is that the arrangement is not authorised. Silence is not permission, and a firm that later decides the arrangement breached its terms can withhold a payout even after a pass. The only protection is a written confirmation before payment, kept with the dated terms page.`
        ),
        p(
          `The flat ${SITE.price} fee on this site is the same for any firm and account size, which makes the terms check the only variable. If the firm prohibits the arrangement, the job is declined before payment, and the fee is not collected. That is the correct order of operations: terms first, payment second.`
        ),
      ]
    ),
    sec(
      'compare',
      'Service versus trading it yourself',
      [
        p(
          `Trading the evaluation yourself is cheaper in cash if you pass first time. It is also the route that produces the skill, the journal and the evidence base for a second account. A service is not a substitute for those things; it is a way to buy the outcome when the execution, not the strategy, is the bottleneck.`
        ),
        table(
          ['Factor', 'Self-traded', 'Flat-fee service'],
          [
            ['Cash cost', 'Entry fee per attempt', `${SITE.price} per evaluation`],
            ['Time', 'Your sessions for the duration', 'Typically around two weeks' ],
            ['Skill built', 'Yes, directly', 'No'],
            ['Execution risk', 'Yours', 'Transferred to the provider'],
            ['Rules risk', 'Yours', 'Checked before payment'],
            ['Funded account', 'Yours', 'Yours, no profit split'],
          ]
        ),
        p(
          `The decision is therefore about what you are optimising. If the goal is to become a funded trader who can pass repeatedly, self-trading is the better investment even if it costs more in fees. If the goal is a funded account for a specific firm within a specific window, and the strategy is already sound, the service is the cheaper way to remove the execution variable.`
        ),
        p(
          `A sensible sequence for many traders is self-trade the first evaluation, keep the journal, and use the service only for a firm whose rulebook has repeatedly defeated an otherwise working method. That sequence pays for the lesson once and buys the outcome once, instead of paying for the same lesson repeatedly.`
        ),
      ]
    ),
    ...pick(ctx, [B.sections.cost, B.sections.verify, B.sections.checklist, B.sections.consistency], 2, 'service'),
  ];

  const body = finalize(ctx, sections, faqFor(ctx, 'service'), {
    kicker: `${ctx.kicker || 'Passing services'} · reviewed October 2026`,
    lede: ctx.lede,
    keypoints: ctx.keypoints,
    ctaHeading: 'Start an evaluation',
    ctaText: `Flat <strong>${SITE.price}</strong> per evaluation, any firm, any account size. Retries covered, no profit split, funded login in your name. Terms checked before payment.`,
    disclaimers: [],
  });

  return {
    title: clampTitle(ctx.title),
    desc: trimDesc(ctx.desc),
    h1: ctx.h1,
    kicker: ctx.kicker || 'Passing services',
    crumb: ctx.crumb || ctx.h1,
    section: 'Services',
    body,
  };
}

function mathPage(ctx) {
  const sections = [
    sec(
      'frame',
      `What this calculation decides`,
      [
        p(ctx.topicIntro),
        p(
          `The calculation matters because it is the point where a rule becomes a trade. A risk percentage is an intention; a lot or contract count is an instruction. Between the two sit the stop distance, the instrument's value per point or pip, and the account currency. Get any of them wrong and the trade risks a different amount than the plan allows.`
        ),
      ]
    ),
    B.sections.numeric(ctx),
    B.sections.sizing(ctx),
    B.sections.targetMath(ctx),
    ...pick(ctx, [B.sections.mistakes, B.sections.plan, B.sections.checklist, B.sections.journal], 2, 'math'),
    B.sections.verify(ctx),
  ];

  const body = finalize(ctx, sections, faqFor(ctx, 'math'), {
    kicker: `${ctx.kicker || 'Position sizing'} · reviewed October 2026`,
    lede: ctx.lede,
    keypoints: ctx.keypoints,
    ctaHeading: 'Want the evaluation traded for you?',
    ctaText: `One flat <strong>${SITE.price}</strong> per evaluation, any account size, retries covered, no profit split.`,
    disclaimers: ctx.firm ? [ctx.firm.name] : [],
  });

  return {
    title: clampTitle(ctx.title),
    desc: trimDesc(ctx.desc),
    h1: ctx.h1,
    kicker: ctx.kicker || 'Position sizing',
    crumb: ctx.crumb || ctx.h1,
    section: 'Position sizing',
    body,
  };
}

function platformPage(ctx) {
  const sections = [
    sec(
      'steps',
      ctx.stepsHeading || 'The exact steps',
      [
        p(ctx.topicIntro),
        ...(ctx.steps || []).map((s, i) =>
          `<h3>Step ${i + 1}: ${s.h}</h3>\n${p(s.body)}`
        ),
        p(
          `The steps are mechanical on purpose. The failure mode in an evaluation is rarely a missing feature; it is a stop that was never placed, a setting that reset after a platform update, or an order type that behaved differently from the label. Walking the same sequence every time is what makes the behaviour predictable under pressure.`
        ),
      ]
    ),
    sec(
      'verify',
      'How to verify the order is actually working',
      [
        p(
          `After placing any protective order, verify it in three places: the order list, the position row and, where the platform offers it, the server-side order log. A stop that appears only as a line on the chart is a client-side object; it will not survive a disconnect. The order list is the authoritative view because it is populated from the server.`
        ),
        p(
          `Then test the behaviour on a demo account with the same broker settings. Place a stop, disconnect the terminal, reconnect, and confirm the order is still there. This five-minute test is the difference between a stop and a hope. It is especially important after a platform update, because updates occasionally reset order defaults.`
        ),
        p(
          `Finally, check the distance in the platform's own units. On a forex account the stop distance is in pips; on futures it is in ticks; on a stock account it is in cents. A stop entered as "20" means twenty of whatever the platform's default unit is, which is not always the unit you intended. Read the order ticket before clicking.`
        ),
      ]
    ),
    sec(
      'evaluation',
      'Why this matters more on an evaluation',
      [
        p(
          `On a personal account, a missing stop is a risk. On an evaluation, it is a rule breach waiting to happen. A loss that runs past the intended stop can consume the daily allowance before the trader has made a decision, and on a trailing threshold it can end the account even if the balance later recovers. The evaluation does not distinguish between a deliberate risk and an accidental one.`
        ),
        p(
          `The correct default is that every position has a server-side stop before it has a size. That order — stop first, size second — is the reverse of how most traders click, which is why the mistake is common. The platform will accept a market order without a stop; the rulebook will not forgive one.`
        ),
        p(
          `A second evaluation-specific issue is the daily reset. A stop that is valid today may be irrelevant tomorrow because the daily allowance resets and the plan's risk budget changes. Recalculate the maximum loss at the start of each session and write it next to the platform, rather than carrying yesterday's number in your head.`
        ),
      ]
    ),
    ...pick(ctx, [B.sections.sizing, B.sections.mistakes, B.sections.checklist, B.sections.journal], 2, 'platform'),
  ];

  const body = finalize(ctx, sections, faqFor(ctx, 'platform'), {
    kicker: `${ctx.kicker || 'Platform guide'} · reviewed October 2026`,
    lede: ctx.lede,
    keypoints: ctx.keypoints,
    ctaHeading: 'Want the evaluation traded for you?',
    ctaText: `Flat <strong>${SITE.price}</strong>, any firm, any account size, retries covered. Every position enters with a server-side stop.`,
    disclaimers: [],
  });

  return {
    title: clampTitle(ctx.title),
    desc: trimDesc(ctx.desc),
    h1: ctx.h1,
    kicker: ctx.kicker || 'Platform guide',
    crumb: ctx.crumb || ctx.h1,
    section: 'Platforms',
    body,
  };
}

function redirectPage(ctx) {
  return {
    redirect: ctx.target,
    title: `${ctx.h1} | ${SITE.name}`,
    desc: ctx.desc,
    h1: ctx.h1,
    crumb: ctx.h1,
    noindex: true,
  };
}

module.exports = {
  renderers: { firmGuide, review, comparison, strategy, mechanic, money, list, servicePage, platformPage, mathPage, redirectPage },
  faqFor,
  trimDesc,
  clampTitle,
  RELATED,
  LIST_FILTERS,
};
