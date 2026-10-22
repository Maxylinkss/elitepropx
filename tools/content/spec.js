'use strict';

/**
 * Maps a queued URL to an archetype plus the context its renderer needs.
 * No I/O: the generator reads the queue, calls buildSpec for each path and
 * writes the rendered page.
 */

const { firms, byKey, findFirm, pairFromSlug, splitFirm } = require('./firms');
const T = require('./topics');
const { floorShort, dailyPhrase } = require('./bank');

const PRIORITY = 0.7;
const DATE = '2026-10-19';

/**
 * Pages that are not about one firm still need a subject for the shared
 * sections. The placeholder describes a generic rulebook in the right market
 * so the mechanics stay accurate without naming a firm the page is not about.
 */
const GENERIC = (market) => ({
  key: 'generic',
  name: 'prop firm',
  market,
  model: market === 'futures' ? 'single-phase futures evaluation' : 'typical two-phase evaluation',
  drawdown: market === 'futures' ? 'trailing, measured from peak equity' : 'static, measured from the starting balance',
  daily: 'yes on most plans, measured on equity',
  consistency: 'plan-specific, and often applied at payout',
  minDays: 'varies by plan, and is stated on the plan page',
  billing: market === 'futures' ? 'usually a monthly subscription' : 'usually a one-off fee per attempt',
  payout: 'a fixed cycle after the first payout is eligible',
  platforms: market === 'futures' ? 'Tradovate, Rithmic or NinjaTrader' : 'MT4, MT5 or cTrader',
  session: market === 'futures' ? 'US futures session hours' : 'weekday forex hours',
  weekend: 'plan-specific, so confirm the funded terms as well as the evaluation terms',
  news: 'plan-specific, and often restricted around major releases',
  ea: 'plan-specific',
  strengths: [
    'A published rulebook you can read before buying',
    'A loss floor that can be planned around',
    'A payout path with terms you can check in advance',
  ],
  cautions: [
    'Terms change between plan generations',
    'A payout condition can reduce a profitable pass',
    'The billing rhythm decides whether a slow pass is expensive',
  ],
  bestFor: 'traders whose method matches the plan they actually bought',
});

const fb = (seg) => GENERIC(/micro|futures|e-mini|nq|topstep|apex/.test(seg) ? 'futures' : 'forex');

const REDIRECTS = {
  '/best-prop-firms-comparison-2026.html': '/prop-firm-comparison-2026.html',
  '/blog/best-prop-firm-for-beginners-2026.html': '/blog/best-prop-firm-beginners-2026.html',
  '/blog/best-prop-firm-passing-service-2026.html': '/blog/best-prop-firm-passing-services.html',
  '/blog/best-prop-firms-for-beginners.html': '/blog/best-prop-firm-beginners-2026.html',
  '/blog/prop-firm-passing-service-reviews.html': '/blog/best-prop-firm-passing-services.html',
  '/blog/prop-firm-challenge-passing-service-reviews-2026.html': '/blog/best-prop-firm-passing-services.html',
  '/blog/best-prop-firms-beginners-2026.html': '/blog/best-prop-firm-beginners-2026.html',
  '/blog/how-much-prop-firm-traders-make.html': '/blog/how-much-do-prop-firm-traders-make.html',
  '/blog/prop-firm-taxes-explained.html': '/blog/prop-firm-taxes-2026.html',
  '/blog/prop-firm-consistency-rule-explained.html': '/blog/prop-firm-consistency-rule-guide.html',
  '/blog/prop-firm-weekend-holding-rules-guide.html': '/blog/prop-firm-weekend-holding-rules.html',
  '/blog/topstep-vs-apex-prop-firm.html': '/blog/apex-vs-topstep-comparison-2026.html',
  '/blog/ftmo-vs-fundednext-comparison.html': '/blog/ftmo-vs-fundednext-comparison-2026.html',
  '/blog/best-prop-firm-swing-traders-2026.html': '/blog/best-prop-firms-for-swing-trading.html',
  '/how-long-to-pass-prop-firm-challenge.html': '/blog/how-long-to-pass-prop-firm-challenge.html',
  '/blog/medium-article-1.html': '/blog/',
  '/order.html': '/contact.html',
  // Passing-service cluster consolidated to two targets, 22 Oct 2026.
  '/services/prop-firm-challenge-passing-service.html': '/services/passing-prop-firm-services.html',
  '/blog/prop-firm-passing-service.html': '/services/passing-prop-firm-services.html',
  '/blog/prop-firm-passing-service-cost.html': '/services/passing-prop-firm-services.html',
  '/blog/cheapest-prop-firm-passing-service.html': '/services/passing-prop-firm-services.html',
  '/blog/cheap-passing-service.html': '/services/passing-prop-firm-services.html',
  '/blog/legit-prop-firm-passing-service.html': '/services/passing-prop-firm-services.html',
  '/blog/no-profit-split-passing-service.html': '/services/passing-prop-firm-services.html',
  '/blog/prop-firm-passing-service-cost-2026.html': '/services/passing-prop-firm-services.html',
  '/blog/how-challenge-passing-services-work.html': '/services/passing-prop-firm-services.html',
  '/blog/apex-challenge-passing-service-cost.html': '/services/passing-prop-firm-services.html',
  '/blog/prop-firm-passing-service-reviews-2026.html': '/blog/best-prop-firm-passing-services.html',
  '/blog/challenge-passing-service-review.html': '/blog/best-prop-firm-passing-services.html',
  '/reviews/best-prop-firm-passing-service-2026.html': '/blog/best-prop-firm-passing-services.html',
  '/reviews/prop-firm-passing-service-reviews.html': '/blog/best-prop-firm-passing-services.html',
};

const NO_2026 = /(\|\s*2026 Guide)$/;

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function segOf(urlPath) {
  return urlPath
    .replace(/\.html$/, '')
    .split('/')
    .filter(Boolean)
    .pop()
    .replace(/-v2$/, '');
}

function cleanTitle(seg) {
  let t = T.titleFor(seg).replace(NO_2026, '').trim();
  if (!/\b2026\b/.test(t) && t.length <= 58) t += ' | 2026';
  if (t.length < 25) t += ' — Prop Firm Guide';
  return t;
}

function cleanH1(seg) {
  return cleanTitle(seg).replace(/\s*\|\s*2026$/, '');
}

const DESC_TAILS = [
  ' Worked numbers, the common mistakes and a checklist.',
  ' Includes the arithmetic, the rule checks and the pitfalls.',
  ' With the math, the rulebook checks and what to verify first.',
  ' Worked examples plus the terms to confirm before buying.',
];

/**
 * Descriptions are prefixed with the page's own subject phrase so two pages
 * that share a topic note still read differently in search results, and so
 * truncation cannot make them identical.
 */
function descFor(seg, note) {
  const label = T.humanize(seg);
  const first = (note.split(/(?<=\.)\s+/)[0] || note).replace(/\s+/g, ' ').trim();
  const tail = DESC_TAILS[hash(seg) % DESC_TAILS.length];
  return `${label}: ${first}${tail}`;
}

const CATEGORY_FRAME = {
  strategy:
    'On an evaluation, the consequence is specific: the same decision either keeps the loss floor at a distance or brings the end of the account closer. The sections below turn that into a plan rather than a principle.',
  mechanic:
    'The consequence is always numerical. A rule changes the dollar value of a stop, the number of trades a day can absorb, or the amount that reaches a payout. Reading it as a number rather than a slogan is what makes it usable.',
  money:
    'The consequence is cumulative. Fees, retries, data costs and payout timing add up to a total cost of reaching the first withdrawal, and that total is the number worth comparing across routes.',
  list:
    'The ranking below is built from the rulebook first and the price second, because a cheap evaluation attached to a rulebook that fights your method is not cheap at all.',
  service:
    'The consequence is a contractual one. The firm’s terms decide whether the arrangement is permitted, and the fee structure decides whether it is worth doing at all.',
  platform:
    'The consequence is mechanical: an order that exists only on the chart is not a stop, and a setting that resets after an update is not a plan.',
  math:
    'The consequence is a position size. Once the stop distance and the instrument value are known, the calculation is exact, and an exact number is far easier to follow than an intention.',
};

function genericSubject(seg) {
  const label = T.humanize(seg);
  return {
    note: `${label} is one of the decisions that sits between a trading method and a funded account. It changes how much you can risk, how quickly you can pass, or what a pass is worth after the fact, and it is usually decided by a clause rather than by the market.`,
    points: [
      'The rule matters only where it changes a number: size, stop, calendar or payout.',
      'The firm’s own terms page is the definition; comparison content is only the map.',
      'A decision you cannot state from memory before the session is one you will break under pressure.',
    ],
  };
}

function makeBase(urlPath, category, overrides = {}) {
  const seg = segOf(urlPath);
  const subject = T.subjectFor(seg) || genericSubject(seg);
  const note = overrides.note || subject.note;
  const topicTitle = overrides.topicTitle || T.humanize(seg);
  const title = overrides.title || cleanTitle(seg);
  const h1 = overrides.h1 || cleanH1(seg);
  const keypoints = overrides.keypoints || [
    ...subject.points,
    `The ${category} decision should be checked against the exact plan, not the brand: terms change between cohorts and between plan names.`,
  ];
  return {
    path: urlPath,
    slug: seg,
    category,
    title,
    desc: overrides.desc || descFor(seg, note),
    h1,
    kicker: overrides.kicker || T.humanize(seg),
    crumb: overrides.crumb || h1,
    lede:
      overrides.lede ||
      `${note} This guide turns the rule into something you can apply to the plan you are actually trading.`,
    topicTitle,
    topicIntro:
      overrides.topicIntro ||
      `${note} ${CATEGORY_FRAME[category] || CATEGORY_FRAME.strategy}`,
    keypoints,
    date: DATE,
    updated: DATE,
    priority: overrides.priority || PRIORITY,
    schemaService: true,
    ...overrides,
  };
}

/* --------------------------- list ranking -------------------------------- */

function listPool(seg) {
  const scores = firms.map((f, i) => {
    let s = 0;
    if (/futures|micro/.test(seg)) s += f.market === 'futures' ? 4 : -6;
    if (/forex|gold|beginner/.test(seg)) s += f.market === 'forex' ? 3 : f.market === 'multi' ? 1 : -4;
    if (/scalp/.test(seg)) s += /static/i.test(f.drawdown) ? 3 : 1;
    if (/swing/.test(seg)) s += /static/i.test(f.drawdown) ? 3 : -3;
    if (/instant/.test(seg)) s += /one-step|instant|single/i.test(f.model) ? 4 : 0;
    if (/without-consistency/.test(seg)) s += f.consistency === 'none' ? 4 : /none on the evaluation/i.test(f.consistency) ? 2 : 0;
    if (/no-time-limit/.test(seg)) s += /none on the evaluation/.test(f.minDays) ? 2 : 0;
    if (/cheapest|cheap/.test(seg)) s += f.billing === 'one-off per attempt' ? 2 : 0;
    if (/hardest/.test(seg)) s += /trailing/i.test(f.drawdown) ? 3 : 0;
    if (/payout/.test(seg)) s += /on demand|request/i.test(f.payout) ? 3 : 0;
    if (/beginners/.test(seg)) s += /static/i.test(f.drawdown) ? 2 : 0;
    if (/scaling/.test(seg)) s += /static/i.test(f.drawdown) ? 1 : 0;
    if (/news/.test(seg)) s += 1;
    return { f, s, i };
  });
  const jitter = hash(seg) % 5;
  scores.sort((a, b) => b.s - a.s || ((a.i + jitter) % 7) - ((b.i + jitter) % 7));
  return scores.map((x) => x.f);
}

/* ------------------------------ builders --------------------------------- */

function buildSpec(urlPath) {
  if (REDIRECTS[urlPath]) {
    const seg = segOf(urlPath);
    return {
      kind: 'redirectPage',
      ctx: {
        path: urlPath,
        target: REDIRECTS[urlPath],
        h1: T.humanize(seg),
        desc: `This page has moved. Continue to the updated guide.`,
      },
    };
  }

  const seg = segOf(urlPath);
  const isBlog = urlPath.startsWith('/blog/');

  // Three-way comparison
  if (seg === 'ftmo-vs-fundednext-vs-mff') {
    const ctx = makeBase(urlPath, 'list', {
      title: 'FTMO vs FundedNext vs My Funded Futures | 2026',
      h1: 'FTMO vs FundedNext vs My Funded Futures: three rulebooks compared',
      kicker: 'Three-way comparison',
      crumb: 'FTMO vs FundedNext vs MFF',
      note: 'These three firms are often grouped because they appear in the same comparison tables, but they are not substitutes: two evaluate forex accounts and one evaluates futures, and the billing rhythms differ as well. A three-way comparison is useful only if it eliminates rather than ranks.',
      topicIntro:
        'FTMO and FundedNext evaluate forex and CFD accounts on percentage rulebooks; My Funded Futures evaluates futures on a dollar rulebook with a trailing threshold. That difference comes before every other comparison, because it decides the session, the instrument list and the way a loss limit is expressed.',
      keypoints: [
        'Two products are forex percentage rulebooks; one is a dollar-based futures rulebook.',
        'Billing differs: one-off attempts at the forex firms, a monthly subscription at the futures firm.',
        'A single ranking across the three is misleading unless market and session are filtered first.',
        'The flat $220 service fee is the same for any of the three and any account size.',
      ],
      lede:
        'FTMO, FundedNext and My Funded Futures are compared here on market, drawdown mechanic, billing and payout rhythm. The first filter is the market you can trade in the hours you are available; only the survivors deserve a detailed comparison.',
    });
    return {
      kind: 'comparison',
      ctx: {
        ...ctx,
        firm: byKey.get('ftmo'),
        other: byKey.get('fundednext'),
        third: byKey.get('mff'),
        firmKeys: ['ftmo', 'fundednext', 'mff'],
        related: [
          ['/blog/ftmo-challenge-passing.html', 'FTMO challenge passing'],
          ['/blog/fundednext-challenge-passing.html', 'FundedNext challenge passing'],
          ['/blog/mff-challenge-passing.html', 'My Funded Futures passing'],
        ],
      },
    };
  }

  const pair = pairFromSlug(urlPath);
  if (pair && pair[0] && pair[1]) {
    const [a, b] = pair;
    const ctx = makeBase(urlPath, 'strategy', {
      title: `${a.name} vs ${b.name}: 2026 Rulebook Comparison`,
      h1: `${a.name} vs ${b.name}: which rulebook fits your trading`,
      kicker: `${a.name} vs ${b.name}`,
      crumb: `${a.name} vs ${b.name}`,
      note: `${a.name} and ${b.name} are compared most often on their headline targets, which is the least informative row in either rulebook. The rows that decide an attempt are the loss floor, the daily stop, the billing rhythm and the payout conditions.`,
      keypoints: [
        `${a.name}: ${a.drawdown}, ${a.billing}.`,
        `${b.name}: ${b.drawdown}, ${b.billing}.`,
        `Daily stops: ${a.daily} versus ${b.daily}.`,
        `A flat $220 service fee applies to either firm and any account size.`,
      ],
      lede: `${a.name} and ${b.name} compared on the mechanics that decide an attempt: the loss floor, the daily stop, the billing rhythm, the payout conditions and the traders each rulebook actually fits.`,
    });
    return {
      kind: 'comparison',
      ctx: {
        ...ctx,
        firm: a,
        other: b,
        firmKeys: [a.key, b.key],
        related: [],
      },
    };
  }

  // FundedNext one-step vs two-step
  if (seg === 'fundednext-1step-vs-2step') {
    const f = byKey.get('fundednext');
    const ctx = makeBase(urlPath, 'mechanic', {
      title: 'FundedNext 1-Step vs 2-Step: Which Plan Fits',
      h1: 'FundedNext 1-step vs 2-step: choosing the structure',
      kicker: 'FundedNext plans',
      crumb: 'FundedNext 1-step vs 2-step',
      note: 'FundedNext sells both one-step and two-step evaluations, and the two are not the same product with a shorter queue. The one-step plan removes a phase but usually compresses the loss allowance; the two-step plan keeps a conventional target and a longer calendar.',
      topicIntro:
        'The choice between FundedNext’s one-step and two-step structures is a choice between speed and margin for error. A one-step pass is faster but demands tighter sizing, while a two-step pass gives more room but adds a second target and a longer calendar.',
      keypoints: [
        'The one-step plan shortens the path but usually compresses the loss allowance.',
        'The two-step plan adds a phase and a second target in exchange for more room.',
        'Read the plan name, not the brand: the drawdown mechanic can differ between the two.',
        '$220 covers either plan at any account size, with retries included.',
      ],
      lede:
        'FundedNext’s one-step and two-step plans are compared on drawdown room, target math, calendar and the traders each structure fits. The brand is the same; the rulebooks are not.',
    });
    return {
      kind: 'mechanic',
      ctx: { ...ctx, firm: f, firmKeys: ['fundednext'], related: [['/blog/fundednext-challenge-passing.html', 'FundedNext challenge passing']] },
    };
  }

  if (/-review(-2026)?$/.test(seg) && !/service/.test(seg)) {
    const [f] = splitFirm(seg);
    if (f) {
      const ctx = makeBase(urlPath, 'strategy', {
        title: `${f.name} Review 2026: Rules, Costs, Fit`,
        h1: `${f.name} review 2026: the rulebook, the cost and the verdict`,
        kicker: `${f.name} review`,
        crumb: `${f.name} review`,
        note: `${f.name} is reviewed here on the three things that decide whether it is worth a fee: the rulebook, the commercial terms and the operational experience. The review starts with the ${floorShort(f)} loss floor because that is the row that changes every sizing decision.`,
        keypoints: [
          `${f.name} evaluates ${f.market === 'futures' ? 'futures' : f.market === 'stocks' ? 'equities' : 'forex'} accounts on a ${f.model}.`,
          `Loss floor: ${f.drawdown}. Daily stop: ${f.daily}.`,
          `Billing: ${f.billing}. Payout: ${f.payout}.`,
          `Best fit: ${f.bestFor}.`,
        ],
        lede: `A review of ${f.name} that starts with the rulebook rather than the profit split: what a ${floorShort(f)} loss floor does to sizing, how ${f.billing} billing changes the cost of a slow pass, and which traders the product genuinely fits.`,
      });
      return { kind: 'review', ctx: { ...ctx, firm: f, firmKeys: [f.key], related: [] } };
    }
  }

  if (/-challenge-passing(-v2)?$/.test(seg)) {
    const [f] = splitFirm(seg);
    if (f) {
      const extrasPool = [
        require('./bank').sections.payout,
        require('./bank').sections.consistency,
        require('./bank').sections.psychology,
        require('./bank').sections.news,
        require('./bank').sections.weekend,
        require('./bank').sections.journal,
        require('./bank').sections.alternatives,
        require('./bank').sections.checklist,
      ];
      const start = hash(urlPath) % extrasPool.length;
      const extras = [extrasPool[start], extrasPool[(start + 3) % extrasPool.length]];
      const ctx = makeBase(urlPath, 'strategy', {
        title: `${f.name} Challenge Passing: The 2026 Rulebook`,
        h1: `How to pass a ${f.name} challenge: the rulebook, the math and the plan`,
        kicker: `${f.name} challenge`,
        crumb: `${f.name} challenge passing`,
        note: `${f.name} runs a ${f.model} with a ${floorShort(f)} loss floor and ${f.billing} billing. Passing it is a scheduling and sizing problem before it is a market problem: the target decides how much you need, the floor decides how much you can risk, and the calendar decides how long you have.`,
        keypoints: [
          `Loss floor: ${f.drawdown}. That sentence decides position size.`,
          `Daily stop: ${f.daily}; minimum days: ${f.minDays}.`,
          `Billing is ${f.billing}, which changes the cost of a slow pass.`,
          `A flat $220 fee covers any account size and retries, where the terms permit third-party trading.`,
        ],
        lede: `How to pass a ${f.name} evaluation, worked through in the order that decides the attempt: the loss floor, then sizing, then the calendar, then the payout conditions that decide what a pass is worth.`,
      });
      return {
        kind: 'firmGuide',
        ctx: { ...ctx, firm: f, firmKeys: [f.key], extras, extras2: [], related: [] },
      };
    }
  }

  const f = findFirm(seg);

  const isPassingService =
    /passing-service|challenge-passing-service|challenge-helper|services?-review|for-me|without-trading|discreet|free-test|challenge-service/.test(seg) &&
    !/cost|fee/.test(seg);

  if (isPassingService) {
    const ctx = makeBase(urlPath, 'service', {
      title: cleanTitle(seg),
      h1: cleanH1(seg),
      note:
        'A passing service trades an evaluation on your behalf for a flat fee and returns a funded account in your name. The arrangement is only legitimate where the firm’s terms permit third-party trading, and the fee is only fair where the retry policy is written down.',
      keypoints: [
        'The firm’s terms, not the service’s marketing, decide whether the arrangement is allowed.',
        'A flat fee with retries covered is simpler to audit than a profit split.',
        'The funded account should be issued in your name, with no share of profit taken.',
        'A written terms check per firm is the minimum standard before payment.',
      ],
      lede:
        'How the service works, what it costs, how to check the firm’s third-party trading clause, and when trading the evaluation yourself is the better buy.',
    });
    return { kind: 'servicePage', ctx: { ...ctx, firm: f || fb(seg), firmKeys: f ? [f.key] : [], related: [] } };
  }

  if (
    (/^(best|cheapest|hardest|top)-/.test(seg) && !/best-time|best-indicators|best-micro/.test(seg)) ||
    /^prop-firms-(with|that|no|without)-/.test(seg)
  ) {
    const ctx = makeBase(urlPath, 'list', {
      title: cleanTitle(seg),
      h1: cleanH1(seg),
    });
    const pool = listPool(seg);
    return {
      kind: 'list',
      ctx: {
        ...ctx,
        firm: f || fb(seg),
        pool,
        rankBasis: /hardest/.test(seg)
          ? 'the strictness of the drawdown mechanic and the billing rhythm'
          : /cheap/.test(seg)
          ? 'total cost across expected attempts rather than the entry fee'
          : 'rulebook fit for the stated style',
        related: [],
      },
    };
  }

  if (/^how-to-set-|metatrader|mt4-mt5-ctrader|platforms?$|tradingview-on|trading-on-mobile|vps-requirements|how-to-trade-on-/.test(seg)) {
    const steps = STEPS[seg] || defaultSteps(seg);
    const ctx = makeBase(urlPath, 'platform', {
      title: cleanTitle(seg),
      h1: cleanH1(seg),
      steps,
    });
    return {
      kind: 'platformPage',
      ctx: { ...ctx, firm: f || fb(seg), firmKeys: f ? [f.key] : [], stepsHeading: 'The exact steps', related: [] },
    };
  }

  if (/lot-size|position-size|how-much-is-one|micro-e-mini|micro-futures|margin-requirements|how-much-money-to-trade|how-much-100k|account-size-guide|risk-management-100k/.test(seg)) {
    const ctx = makeBase(urlPath, 'math', {
      title: cleanTitle(seg),
      h1: cleanH1(seg),
    });
    return { kind: 'mathPage', ctx: { ...ctx, firm: f || fb(seg), firmKeys: f ? [f.key] : [], related: [] } };
  }

  if (/cost|fee|taxes?|payout-calculator|profit-split|how-much-do|how-much-prop|minimum-deposit|discount/.test(seg)) {
    const ctx = makeBase(urlPath, 'money', {
      title: cleanTitle(seg),
      h1: cleanH1(seg),
    });
    return { kind: 'money', ctx: { ...ctx, firm: f || fb(seg), firmKeys: f ? [f.key] : [], related: [] } };
  }

  if (/drawdown|consistency|news-trading|hedging|martingale|copy-trading|ea|weekend|leverage|margin|minimum-trading-days|instant-funding|no-time-limit|scaling|breach|rules|glossary|payout|pass-rate|success-rate|time-limits|terms|myths|future|scam|why-traders-fail|87-percent|reset|multiple-funded/.test(seg)) {
    const ctx = makeBase(urlPath, 'mechanic', {
      title: cleanTitle(seg),
      h1: cleanH1(seg),
      ...(f
        ? {
            note: `${T.humanize(seg)} matters at ${f.name} because the firm's rulebook is built on a ${floorShort(f)} loss floor with ${dailyPhrase(f)}. The definition in the firm's own terms is the one that binds; the explanation below is the mechanic behind it.`,
          }
        : {}),
    });
    return { kind: 'mechanic', ctx: { ...ctx, firm: f || fb(seg), firmKeys: f ? [f.key] : [], related: [] } };
  }

  const ctx = makeBase(urlPath, 'strategy', {
    title: cleanTitle(seg),
    h1: cleanH1(seg),
  });
  return { kind: 'strategy', ctx: { ...ctx, firm: f || fb(seg), firmKeys: f ? [f.key] : [], related: [] } };
}

function defaultSteps(seg) {
  const label = T.humanize(seg);
  return [
    {
      h: 'Open the order ticket before you have a bias',
      body: `Open the ticket for the instrument and set the fields in the order the platform expects: instrument, size, stop, target. Doing this before deciding direction prevents the common sequence in which the trade is sent and the protection is added afterwards, when the price has already moved. For ${label.toLowerCase()}, the ticket is also the place to confirm the order type is the one the plan requires.`,
    },
    {
      h: 'Set the protective order in price terms',
      body: 'Enter the stop as a price, not as a number of points or pips, unless the platform labels the field explicitly. A price is unambiguous; a distance depends on the platform’s unit and on the direction of the trade. Check the ticket preview, which shows the estimated loss at the stop, and compare it with the risk budget for the session.',
    },
    {
      h: 'Confirm the order is server-side',
      body: 'After the order is accepted, open the order or position list and confirm the stop appears there. A line on the chart can be a client-side object that disappears when the terminal closes. If the list does not show the stop, the protection is not real; edit the position and attach it again.',
    },
    {
      h: 'Test it on a demo with the same settings',
      body: 'Place a small trade on a demo account, close the terminal, reopen it and confirm the stop is still present. This five-minute test catches the settings that reset after an update and the account types where the order is held differently. It is worth repeating after every platform update.',
    },
    {
      h: 'Record the risk in the journal before the trade',
      body: 'Write the planned dollar risk, the stop distance and the remaining room for the day. The journal entry is what makes the next review possible, and it forces the sizing decision to happen before the outcome is known. A trade without a recorded risk is a trade that cannot be evaluated afterwards.',
    },
  ];
}

const STEPS = {
  'how-to-set-stop-loss-mt5': [
    {
      h: 'Open a new order and expand the stop fields',
      body: 'In MetaTrader 5, open the New Order window, choose the symbol and volume, then expand the section that contains the stop loss and take profit fields. On the desktop terminal the fields are visible by default; on some builds they are collapsed. Enter the stop as a price, not as a distance, and check that the field is not greyed out because the distance is inside the broker’s minimum stop level.',
    },
    {
      h: 'Choose the server-side option, not a chart line',
      body: 'A stop entered in the order ticket is sent to the server with the order and survives a disconnect. A horizontal line dragged onto the chart is a client-side object and does not. If the stop is added after entry, use the position’s Modify or Stop Loss command rather than a chart tool, and confirm the change in the order list.',
    },
    {
      h: 'Verify the stop in the Trade tab',
      body: 'After the order is filled, open the Trade tab and look at the position row. The stop loss column should show the price you entered. If it is empty, the position is unprotected; right-click the position, choose Modify, and attach the stop. Do this before the trade has time to move against you.',
    },
    {
      h: 'Check the risk in account currency',
      body: 'The ticket shows the estimated loss at the stop, but it does not know your risk budget. Compare the number with the dollar risk the plan allows, and if the position is too large, reduce the volume rather than moving the stop closer. Moving the stop closer to fit the size is how a normal trade becomes a breach.',
    },
  ],
  'how-to-set-stop-loss-mt5-mobile': [
    {
      h: 'Open the symbol and choose New Order',
      body: 'In the MetaTrader 5 mobile app, open the symbol from the Quotes tab and tap New Order. The mobile ticket opens with the volume and order type; the stop fields are further down and may need to be expanded. Set the volume first, because changing it later recalculates the estimated loss.',
    },
    {
      h: 'Expand the stop loss section before sending',
      body: 'Tap the section labelled Stop Loss / Take Profit and enter the stop as a price. The mobile app is less forgiving than the desktop: if the price is outside the allowed distance, the field rejects it or the order is sent without protection. Read the ticket summary before tapping the send button.',
    },
    {
      h: 'Confirm on the position screen',
      body: 'After the order is accepted, open the Trade tab and tap the position. The details screen shows the stop loss price if one is attached. If the field is empty, tap Modify and add it immediately. Do not rely on the chart line shown on the mobile chart; it is a visual object, not the order.',
    },
    {
      h: 'Keep the phone session alive or use server-side orders',
      body: 'A mobile stop entered in the ticket is server-side once accepted, but a stop added as an alert or a chart object is not. If the connection drops, the server-side order remains and the alert does not. Test the behaviour on a demo before relying on it during an evaluation.',
    },
  ],
  'how-to-set-take-profit-mt5': [
    {
      h: 'Decide the target before the entry',
      body: 'Set the take-profit at the level where the setup is complete: the prior high, the measured move, the range edge. A target chosen after entry tends to be the level that makes the current loss disappear, which is not a target at all. Write the level down before opening the ticket.',
    },
    {
      h: 'Enter it in the order ticket',
      body: 'In the New Order window, enter the take-profit as a price in the field next to stop loss. The ticket shows the estimated profit at that level, which should be at least twice the estimated loss for a 1:2 plan. If the ratio is below the plan’s minimum, the trade is not a candidate, whatever the setup looks like.',
    },
    {
      h: 'Modify rather than hope',
      body: 'If the target needs to change after entry, use the position’s Modify command and record the reason in the journal. Moving a target further away to avoid missing a move is the mirror of moving a stop; both change the risk-reward that justified the trade. A target moved closer is a partial exit by another name.',
    },
    {
      h: 'Check the order survived the session',
      body: 'A take-profit is server-side when entered in the ticket, so it survives a disconnect. Confirm it in the Trade tab and again after any platform restart. If the position is closed by the target, the order list will show the closing deal at that price, which is the record the journal needs.',
    },
  ],
  'how-to-set-trailing-stop-mt5': [
    {
      h: 'Understand what a trailing stop changes',
      body: 'A trailing stop moves the stop as price advances, locking in profit but also tightening the exit. On a prop evaluation this changes the distribution: it can protect a cushion on a trailing-drawdown account, and it can also take you out of a trade that would have reached the target. Decide which effect the plan needs before enabling it.',
    },
    {
      h: 'Set the distance wider than normal noise',
      body: 'In the position’s Modify window, enter the trailing distance in points. The distance should be at least the average noise of the timeframe you trade; a distance of ten points on an instrument that routinely moves thirty will be triggered by ordinary breathing. Use the same distance on every trade of the same setup so the results are comparable.',
    },
    {
      h: 'Confirm the trail is server-side',
      body: 'MetaTrader’s trailing stop is applied by the terminal, not by the server, in the standard implementation. If the terminal closes, the trail stops moving. That makes it unsuitable as the only protection on an evaluation; keep a hard server-side stop as the outer limit and treat the trail as an exit refinement.',
    },
    {
      h: 'Record the exit reason',
      body: 'A trade closed by a trailing stop and a trade closed by a target are different outcomes even when the profit is the same. Record which one occurred, and review after twenty trades whether the trail added more than it cost. On a small account the answer is often no, because the tighter exit cuts the winners that pay for the losers.',
    },
  ],
  'how-to-set-stop-loss-tradingview': [
    {
      h: 'Separate charting from execution',
      body: 'TradingView is a charting platform first. Orders are routed through a connected broker, and the order types available depend on that connection. A stop drawn with the chart’s position tool is a visual object; a stop placed through the broker panel is an order. Only the second is protection.',
    },
    {
      h: 'Use the broker order panel',
      body: 'Open the trading panel, select the symbol and size, and use the bracket or stop field provided by the broker integration. Enter the stop as a price and confirm that the order summary shows the estimated risk. If the connection does not support bracket orders, place the stop as a separate order in the broker’s own platform.',
    },
    {
      h: 'Reconcile in the broker platform',
      body: 'After entry, open the broker’s native platform and confirm the position and its stop. TradingView is a view; the broker’s book is the record the firm will use in a dispute. A stop that exists in one and not the other is not a stop.',
    },
    {
      h: 'Do not confuse alerts with orders',
      body: 'A TradingView alert sends a notification or triggers a webhook; it does not place an order unless a broker integration is configured to do so. On an evaluation, an alert that fires while the browser is closed changes nothing. Use alerts for monitoring and server-side orders for protection.',
    },
  ],
  'can-you-use-tradingview-on-ftmo': [
    {
      h: 'Charting is always allowed',
      body: 'Using TradingView to analyse markets is not restricted by FTMO’s trading rules. The rules concern the account, the instruments and the conduct, not the software used to draw levels. A trader can chart on TradingView and execute on MT4, MT5, cTrader or DXtrade without any conflict.',
    },
    {
      h: 'Execution depends on the broker connection',
      body: 'If orders are routed from TradingView through a connected broker, the order is held according to that broker’s setup. Confirm that the stop is server-side and visible in the firm’s platform, and that the account type supports the order types the strategy needs. If the connection does not support them, execute in the firm’s platform instead.',
    },
    {
      h: 'Reconcile every position',
      body: 'After entry, check the position in the firm’s own platform. The evaluation rules are applied to the account, and the account record is the one that counts. A chart that shows a stop is not evidence that the order exists.',
    },
    {
      h: 'Keep the platform list current',
      body: 'Firms add and remove platform integrations. The supported list on the firm’s page is the authoritative one, and it can change between plan generations. Confirm before buying an evaluation that depends on a specific integration.',
    },
  ],
};

module.exports = { buildSpec, REDIRECTS, segOf, cleanTitle, cleanH1, fb, GENERIC };
