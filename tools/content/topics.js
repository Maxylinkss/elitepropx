'use strict';

/**
 * Topic framing for the generated library.
 *
 * The goal is that every page says something specific about its own subject,
 * not just about prop firms in general. Each subject entry contributes a short
 * explanatory note and three or four concrete points; the category frame adds
 * the structural material that the renderer then expands with shared sections.
 */

const SUBJECTS = [
  {
    match: /stop-loss-mt5-mobile/,
    note: 'Placing a stop on the MetaTrader 5 mobile app is a different sequence from the desktop terminal, and the difference matters on an evaluation: the mobile ticket defaults to a market order with no stop, and the stop has to be attached before the order is sent or edited in immediately afterwards.',
    points: [
      'The mobile ticket hides the stop fields behind a collapsed section; expand it before sending the order.',
      'A stop added after entry is a modification, not part of the original order, and it can be rejected if the price has already moved.',
      'Verify the stop in the position row, not on the chart, because a chart line can be a client-side object.',
    ],
  },
  {
    match: /stop-loss-mt5/,
    note: 'A stop loss in MetaTrader 5 is an order instruction, and the platform offers two versions: a client-side line that exists only while the terminal is running, and a server-side order that survives a disconnect. On an evaluation account the second is the only defensible choice.',
    points: [
      'Server-side stops survive terminal crashes, connection drops and platform restarts.',
      'The order ticket shows the stop in price terms; the risk in account currency has to be calculated separately.',
      'A stop moved after entry changes the risk of the trade and must be recorded in the journal as a breach if it moves away from the entry.',
    ],
  },
  {
    match: /take-profit-mt5/,
    note: 'A take-profit order is the mirror of a stop: a server-side instruction to close at a specified price. Its placement decides the risk-reward of the trade, and on an evaluation it also decides whether the profit is banked before a retracement can turn a winner into a loser.',
    points: [
      'Set the take-profit at the level where the setup is complete, not at a round number that feels satisfying.',
      'A take-profit that is too close converts a positive-expectancy setup into a high-win-rate, low-payoff one that cannot reach the target.',
      'Partial closes are a separate order and count toward commission and, on some firms, toward the trade record used for consistency.',
    ],
  },
  {
    match: /trailing-stop-mt5/,
    note: 'A trailing stop in MetaTrader 5 moves the stop as price advances, which sounds like free protection but changes the trade distribution: it converts open profit into a tighter exit and can take a trader out of a position that would have reached the target.',
    points: [
      'The trailing distance has to be wider than normal noise, or the stop is triggered by the market’s ordinary breathing.',
      'A trailing stop does not protect against a gap, because it is still a stop order.',
      'On a trailing-drawdown evaluation, a trailing stop that locks in small profits can help preserve the cushion, but it also caps the day’s contribution to the target.',
    ],
  },
  {
    match: /stop-loss-tradingview/,
    note: 'TradingView offers stop orders on supported brokers, but the behaviour depends on the broker connection: a stop placed on the chart may be a broker-side order or a alert-driven instruction, and only the broker-side version survives a closed browser.',
    points: [
      'Check the order panel for the broker’s order types rather than relying on chart tools.',
      'A TradingView alert is not an order; it notifies you, and the execution still requires a live connection.',
      'Reconcile the position in the broker’s own platform after entry, because the chart is a view, not the book.',
    ],
  },
  {
    match: /tradingview-on-ftmo/,
    note: 'Using TradingView with FTMO is a question about execution, not charting. Charting on TradingView is harmless; routing orders through it depends on whether the broker connection supports the account type and whether the order is held server-side.',
    points: [
      'A charting-only setup is always permitted; the rules concern execution and account access.',
      'If orders are routed through a connected broker, confirm the stop is server-side and visible in the firm’s platform.',
      'The evaluation rules apply to the account, not to the software used to analyse it.',
    ],
  },
  {
    match: /micro-nq-point|micro-e-mini-vs-e-mini|micro-futures-margin|micro-futures-complete|best-micro-futures|how-much-money-to-trade-micro/,
    note: 'Micro futures are the smallest exchange-traded contracts on the index, energy and metals products, and their tick values are a fixed fraction of the full-size contract. The arithmetic is simple, but the commission per contract is not proportional, which is why micros are easier to size and harder to trade profitably at high frequency.',
    points: [
      'A micro E-mini S&P contract moves $5 per full index point, or $1.25 per tick.',
      'Commission is charged per contract per side, so ten micros cost ten times one micro to trade.',
      'The smallest account that can trade one micro is set by the intraday margin, not by the contract’s notional value.',
    ],
  },
  {
    match: /lot-size|position-size/,
    note: 'Lot size is the bridge between a percentage risk and a price stop. The formula is always the same: dollar risk divided by the value of the stop distance per lot. The inputs change with the pair, the account currency and the contract specification, which is why a remembered rule of thumb is unreliable.',
    points: [
      'Compute the pip or tick value from the platform’s contract specification, not from memory.',
      'Size from the stop distance, never from the margin the platform allows.',
      'Recompute after a change in account size, instrument or account currency.',
    ],
  },
  {
    match: /daily-drawdown|trailing-drawdown|drawdown/,
    note: 'Drawdown rules come in two families: a floor fixed at the starting balance and a threshold that follows peak equity. They behave in opposite ways, and the same equity curve can pass one and fail the other.',
    points: [
      'A static floor does not move with profit; a trailing threshold does, including on open profit at some firms.',
      'The daily stop is a separate limit and is usually measured on equity.',
      'Risk per trade has to fall as a trailing cushion compresses.',
    ],
  },
  {
    match: /consistency/,
    note: 'A consistency rule caps the share of total profit that may come from one trading day. It can leave a profitable evaluation unpaid, so it belongs in the sizing plan from the first trade rather than in the payout checklist.',
    points: [
      'Common thresholds are 30–50% of total profit from any single day.',
      'The rule is usually assessed at payout, not at the moment of the trade.',
      'A distribution of ordinary days passes more reliably than one oversized winner.',
    ],
  },
  {
    match: /news-trading/,
    note: 'News rules restrict opening or holding positions around scheduled releases. The restriction exists because a release can gap past a stop, which turns a planned loss into an unplanned one and can breach a daily limit in a single tick.',
    points: [
      'Being flat before the window is safer than relying on a stop.',
      'The affected window is defined by the firm, often around major releases only.',
      'Where news trading is allowed, size the event like an event rather than like an ordinary setup.',
    ],
  },
  {
    match: /hedging/,
    note: 'Hedging rules prohibit holding offsetting positions in the same or correlated instruments, usually across accounts as well as within one. The prohibition is about exposure, not about intent: two trades that cancel economically are treated as one position.',
    points: [
      'Offsetting long and short positions in the same instrument are usually prohibited.',
      'Correlated pairs can count as hedging even when the instruments differ.',
      'The rule often applies across all accounts held with the firm, not just one.',
    ],
  },
  {
    match: /martingale/,
    note: 'Martingale sizing doubles risk after a loss to recover the drawdown in one trade. It is incompatible with a fixed loss floor because the sequence requires capital that the rulebook does not provide, and the tail loss arrives exactly when the account is least able to absorb it.',
    points: [
      'A four-step doubling sequence at 0.5% risk risks 7.5% on the fourth trade.',
      'The strategy’s survival depends on never meeting a losing streak longer than the sequence.',
      'Fixed fractional risk produces a survivable distribution; martingale produces a high-probability small gain and a low-probability ruin.',
    ],
  },
  {
    match: /copy-trading/,
    note: 'Copy-trading rules govern whether a trader may mirror positions from another account or allow their account to be mirrored. The usual concern is that copied positions can double exposure across accounts and bypass the firm’s risk limits.',
    points: [
      'Copying between your own accounts at the same firm is often restricted.',
      'Copying from an external signal provider may be treated as third-party trading.',
      'The rule applies to the funded account as well as the evaluation.',
    ],
  },
  {
    match: /ea-automated|challenge-with-ea/,
    note: 'Expert advisors are permitted at many firms but restricted at others, and the restrictions usually concern high-frequency strategies, latency arbitrage and identical trade patterns across accounts rather than automation itself.',
    points: [
      'Check whether the plan permits EAs on the evaluation and the funded account separately.',
      'Latency or price-error exploitation is usually prohibited regardless of the tool used.',
      'Identical trades across multiple accounts can be treated as copy trading.',
    ],
  },
  {
    match: /weekend-holding/,
    note: 'Weekend holding rules decide whether a position may remain open from Friday’s close to Sunday’s open. The risk is a gap that jumps the stop, and the rule is usually paired with a flat-by time or a reduced-leverage condition.',
    points: [
      'A stop does not limit a loss when the market opens beyond it.',
      'Close before the final minutes, when spreads widen and liquidity thins.',
      'Where holding is allowed, size for a two- or three-times-stop gap.',
    ],
  },
  {
    match: /leverage|margin-rules/,
    note: 'Leverage on an evaluation is a convenience, not a strategy. The rulebook’s loss floor, not the margin, is the real limit on position size, and a trader who sizes to the available margin is sizing to the wrong number.',
    points: [
      'Margin determines the maximum position, not the sensible one.',
      'Higher leverage increases the damage of a sizing error without changing the loss floor.',
      'Futures margin is set by the exchange and the broker, and intraday margin can differ from overnight.',
    ],
  },
  {
    match: /minimum-trading-days/,
    note: 'A minimum trading day rule sets the smallest number of sessions a pass can take, independent of the target. It exists to stop a single outsized day from producing a funded account, and it changes the correct pace of the plan.',
    points: [
      'A qualifying day usually requires at least one closed trade, sometimes a minimum profit or loss.',
      'Scratch days may or may not count; confirm the definition.',
      'The rule sets a floor on time, not a target for activity.',
    ],
  },
  {
    match: /payout-times|fastest-payouts|payout-process|payout-rejected|payout-denied|payout-calculator/,
    note: 'Payout terms decide what a funded account is worth. The split is the visible number; the interval, the minimum, the seasoning period and the consistency condition are the ones that decide when the money actually arrives.',
    points: [
      'The first payout usually has a longer wait than later cycles.',
      'A processor fee is proportionally larger on a small first withdrawal.',
      'A payout can be held for identity or conduct review even after a clean pass.',
    ],
  },
  {
    match: /scaling|multiple-funded-accounts|multiple-accounts|how-many-prop-firm-challenges/,
    note: 'Scaling and multiple accounts multiply both opportunity and cost. Each account carries its own subscription, its own loss floor and its own attention requirement, and correlated positions across accounts can breach copy-trading or hedging rules.',
    points: [
      'Two accounts double the fees and the screen time, not just the capital.',
      'Correlated exposure across accounts is often treated as one position.',
      'A scaling plan is only useful if the first account is consistently profitable.',
    ],
  },
  {
    match: /tax/,
    note: 'Payouts from a prop firm are generally treated as income for a service rather than as capital gains, which changes the records a trader needs: payout statements, contracts and fees paid, not brokerage tax forms.',
    points: [
      'Failed evaluation fees are often deductible business expenses where the activity is a business.',
      'Keep records from the first fee onward, in the currency paid.',
      'Residence and firm jurisdiction decide the treatment; this is not tax advice.',
    ],
  },
  {
    match: /discount|cheapest|cheap/,
    note: 'Discounts change the entry price, not the rulebook. A plan bought at 80% off carries the same loss floor and payout conditions as the full-price version, so the discount is only a bargain if the rulebook fits.',
    points: [
      'Compare total cost across expected attempts, not the discounted entry fee.',
      'Promotional plans can carry modified terms; read the plan name.',
      'A discount that expires in hours is a sales tactic, not a reason to decide.',
    ],
  },
  {
    match: /pass-rate|success-rate|87-percent|why-traders-fail/,
    note: 'Published pass rates are not comparable across firms because the denominator differs: attempts, accounts or traders. The useful number is your own pass probability at a given risk unit, which can be estimated from a documented trade record.',
    points: [
      'A pass rate without a denominator and a time window is marketing.',
      'The main causes of failure are sizing, rule breaches and trading outside the plan.',
      'Your own distribution is a better input than any industry average.',
    ],
  },
  {
    match: /minimum-deposit/,
    note: 'A minimum deposit is the smallest amount a firm will accept before issuing an evaluation. It is separate from the evaluation fee and is usually held as trading capital, which changes the effective cost of the first attempt.',
    points: [
      'The deposit is not the fee; confirm which is refundable.',
      'A low deposit with a high fee can be more expensive than the reverse.',
      'Withdrawal conditions on the deposit are part of the cost.',
    ],
  },
  {
    match: /instant-funding/,
    note: 'Instant funding products skip the evaluation and issue a funded account directly, usually with a stricter loss floor and a higher fee. The trade-off is speed against margin for error.',
    points: [
      'The loss floor is typically tighter than an evaluation’s.',
      'The fee is usually not refundable on a breach.',
      'A payout condition may still apply before the first withdrawal.',
    ],
  },
  {
    match: /no-time-limit|time-limits/,
    note: 'A time limit caps the calendar for an evaluation, while a minimum-day rule sets a floor. The two are often confused, and a rulebook with no maximum still has a minimum that decides the fastest possible pass.',
    points: [
      'Unlimited time does not mean unlimited attempts within one fee.',
      'A minimum-day rule still applies where a maximum does not.',
      'A subscription product makes unlimited time expensive in billing.',
    ],
  },
  {
    match: /without-consistency/,
    note: 'A firm without a consistency rule does not test the shape of the profit distribution at payout. That makes a concentrated pass viable, but it does not remove the drawdown or daily-stop constraints that decide whether the account survives.',
    points: [
      'Confirm the rule is absent from the funded terms, not just the evaluation.',
      'A concentrated pass can still fail a best-day expectation at some firms.',
      'The absence of a consistency rule is a payout advantage, not a trading advantage.',
    ],
  },
  {
    match: /scam|legit|choosing-challenge-helper|discreet|free-test|why-free-test|order/,
    note: 'The passing-service market has no central regulator, so legitimacy has to be established from evidence: a written terms check, a refund policy, a named contact and a payment method with recourse. Claims about pass rates cannot be verified and should not be the basis of a purchase.',
    points: [
      'Ask which firms are accepted and which clause permits the arrangement.',
      'A guarantee is unenforceable; a refund policy is not.',
      'Never hand over a funded account or identity documents beyond what the firm requires.',
    ],
  },
  {
    match: /psychology|revenge|overtrading|discipline/,
    note: 'Evaluation psychology is mostly about deadlines and recovery. A finite calendar creates urgency, and a loss creates the urge to recover it immediately, which is the behaviour that converts a planned drawdown into a breach.',
    points: [
      'Decide the daily stop before the session, not after a loss.',
      'Separate execution quality from profit and loss in the journal.',
      'A pre-mortem written before the attempt removes most in-the-moment negotiation.',
    ],
  },
  {
    match: /risk-management|risk-budget/,
    note: 'Risk management on an evaluation is the practice of keeping the probability of ruin below the probability of reaching the target. That is a different objective from maximising expected return, and it usually requires smaller size than a personal account would use.',
    points: [
      'Risk per trade should be a fraction of the remaining room, not of the starting balance.',
      'The daily stop is the binding constraint on most losing days.',
      'A strategy that needs oversized trades to reach the target is not compatible with the rulebook.',
    ],
  },
  {
    match: /swing/,
    note: 'Swing strategies hold positions across sessions, which makes them sensitive to weekend rules, swap costs and gap risk. They fit a static loss floor far better than a trailing one, because a trailing threshold punishes the retracement that a multi-day hold normally endures.',
    points: [
      'Check weekend holding and overnight swap before choosing a firm.',
      'A static floor preserves room through a normal retracement.',
      'Size for a gap, not just for the stop.',
    ],
  },
  {
    match: /scalping/,
    note: 'Scalping depends on tight spreads, fast execution and a high trade count. On an evaluation, the trade count interacts with commission and with any consistency or news rule, and the small average win makes cost control the dominant variable.',
    points: [
      'Commission per trade is a larger share of a small average win.',
      'A high trade count increases the chance of a rule breach through sheer repetition.',
      'Tight spreads matter more than a generous target for this style.',
    ],
  },
  {
    match: /gold/,
    note: 'Gold is volatile relative to the major currency pairs, with wider spreads and larger average ranges. Position size has to fall accordingly, and a stop that would be normal on EURUSD is often inside the noise on XAUUSD.',
    points: [
      'Contract specifications and pip value differ from forex pairs.',
      'Spread widening around session opens is larger than on majors.',
      'News sensitivity is high; a gold position is an event position more often than a forex one.',
    ],
  },
  {
    match: /beginner|first-challenge/,
    note: 'A first evaluation should be chosen for the clarity of its rulebook rather than the size of its headline account. A small account with a static floor teaches the mechanics at a lower cost than a large account with a trailing threshold.',
    points: [
      'Start with a rulebook you can explain in one sentence.',
      'Size at 0.25–0.5% until the process is routine.',
      'Keep the journal from the first trade; it is the asset that survives a failed attempt.',
    ],
  },
  {
    match: /30-days|how-long|pass-in-/,
    note: 'The calendar for a pass is set by the strategy’s expectancy and the rulebook’s minimum days, not by ambition. A thirty-day plan that needs forty trades at two per day is a plan for a different strategy.',
    points: [
      'Count the trades the target requires at your normal risk unit.',
      'Divide by the realistic trades per week, not the maximum.',
      'Add the minimum-day floor before deciding the plan is feasible.',
    ],
  },
  {
    match: /one-day|1-day|fast/,
    note: 'A one-day pass is possible only where the plan has no minimum-day rule and the target can be reached inside a single session without breaching the daily stop. It is a structural possibility, not a strategy, and a pass built on one oversized trade often fails a consistency test later.',
    points: [
      'Check the minimum-day rule before planning a single session.',
      'The daily stop caps the loss but not the target; the sizing has to do both.',
      'A concentrated pass can be unpaid at firms with a consistency condition.',
    ],
  },
  {
    match: /without-trading|get-funded-without-trading|pass-my-|for-me/,
    note: 'Getting funded without trading means using a service that trades the evaluation on your behalf. The arrangement is only legitimate where the firm’s terms permit third-party trading, and the funded account must remain in your name.',
    points: [
      'The firm’s terms decide whether the arrangement is allowed.',
      'A flat fee with retries covered is simpler to audit than a profit split.',
      'Never hand over a funded account or identity documents beyond the firm’s requirements.',
    ],
  },
  {
    match: /service|passing-service|challenge-helper/,
    note: 'A passing service is a product with a narrow scope: it trades an evaluation to its target under the firm’s rules and returns a funded account in your name. It is not a signal service, a managed fund or a guarantee.',
    points: [
      'The fee should be flat and the retry policy written down.',
      'A written terms check per firm is the minimum standard.',
      'No profit split means the funded account remains entirely yours.',
    ],
  },
  {
    match: /funded-account|keep-funded|withdraw/,
    note: 'Keeping a funded account is a compliance exercise as much as a trading one. The loss floor remains, the conduct rules are usually stricter, and the first payout is the point at which the process is proven.',
    points: [
      'Trade the funded account at the size that survived the evaluation.',
      'Take the first payout as soon as it is eligible.',
      'Keep every statement and contract for the next account or a dispute.',
    ],
  },
  {
    match: /breach|failure|recover/,
    note: 'A breach ends an account, not a process. The useful response is diagnostic: which rule failed, on which trade, and what written rule prevents the same failure next time. A retry without that diagnosis buys the same outcome.',
    points: [
      'Separate execution failures from strategy failures.',
      'If the same rule failed twice, the plan is wrong, not the market.',
      'A retry is rational only after the cause has a written fix.',
    ],
  },
  {
    match: /rules|glossary|terms/,
    note: 'Prop firm rules are a small vocabulary with large consequences. The same word can mean different things at different firms, so the definition in the terms page is the only one that binds.',
    points: [
      'Drawdown, daily loss and consistency each have firm-specific definitions.',
      'A soft breach resets progress; a hard breach closes the account.',
      'Save dated copies of the terms you relied on.',
    ],
  },
  {
    match: /myths|future|challenge-vs-real|scam-signs/,
    note: 'Most prop firm myths survive because they offer a simple explanation for a complex outcome. The useful test is whether a claim changes a decision you can make: a rule, a size, a firm or a deadline.',
    points: [
      'A claim that cannot be checked against the terms is not a basis for a decision.',
      'Simulated funding and real capital are different products with different counterparty risk.',
      'The mechanics that decide an attempt are boring and well documented.',
    ],
  },
  {
    match: /platform|metatrader|ctrader|mobile|vps/,
    note: 'The platform is part of the risk system. It decides whether stops are server-side, how orders behave in fast markets and whether the trader can act when the connection is poor.',
    points: [
      'Confirm that stops are held on the server, not only on the chart.',
      'Test the order types on a demo with the same broker settings.',
      'A backup device and connection are part of the plan.',
    ],
  },
  {
    match: /calculator|cost|fee|price|profit-split|how-much/,
    note: 'Evaluation economics are a multiplication problem: fee per attempt times expected attempts, plus platform costs, compared with the net value of the first few payouts. The headline fee is only one input.',
    points: [
      'Compare total cost, not the entry price.',
      'A subscription makes a slow pass expensive; a one-off fee does not.',
      'The payout interval matters more than the split percentage.',
    ],
  },
  {
    match: /account-size|100k|200k|50k/,
    note: 'Account size changes the dollar value of every rule but not the percentage mechanics. A larger account has a larger target and a larger loss allowance, while commissions and fixed costs stay the same, which makes the largest tiers marginally more efficient per dollar of target.',
    points: [
      'Percentage rules scale; fixed costs do not.',
      'The smallest tier is usually the hardest per dollar of profit.',
      'Choose the size your strategy can trade without rounding errors.',
    ],
  },
  {
    match: /challenge-mistakes|rules-that-matter|risk/,
    note: 'The rules that matter are the ones that change a decision: the loss floor changes size, the daily stop changes when to stop, the minimum days change the calendar and the consistency rule changes the distribution. Everything else is commentary.',
    points: [
      'Write the four binding numbers on a card before the first trade.',
      'Check them before each session, not after a loss.',
      'A rule you cannot state from memory is a rule you will breach.',
    ],
  },
];

function subjectFor(slug) {
  for (const s of SUBJECTS) if (s.match.test(slug)) return s;
  return null;
}

/* ------------------------------- titles ---------------------------------- */

const ACRONYMS = {
  ftmo: 'FTMO',
  mt4: 'MT4',
  mt5: 'MT5',
  ctrader: 'cTrader',
  ea: 'EA',
  vps: 'VPS',
  nq: 'NQ',
  es: 'ES',
  cpi: 'CPI',
  faq: 'FAQ',
  roi: 'ROI',
  tft: 'TFT',
  mff: 'MFF',
  ftuk: 'FTUK',
  e8: 'E8',
  pip: 'PIP',
  api: 'API',
  usd: 'USD',
  xauusd: 'XAUUSD',
  eurusd: 'EURUSD',
};

const SMALL = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 'into', 'of', 'on', 'or', 'the', 'to', 'vs', 'with', 'without', 'your']);

const RAW = {
  phase1: 'Phase 1',
  phase2: 'Phase 2',
  '1step': '1-Step',
  '2step': '2-Step',
  '1-day': '1-Day',
  '30-days': '30 Days',
  '90-days': '90 Days',
  v2: 'v2',
};

function humanize(slug) {
  const words = slug.split('-').filter(Boolean);
  return words
    .map((w, i) => {
      if (RAW[w]) return RAW[w];
      if (ACRONYMS[w]) return ACRONYMS[w];
      if (i > 0 && SMALL.has(w)) return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(' ');
}

function titleFor(slug) {
  const s = slug;
  const map = [
    [/^how-to-set-stop-loss-mt5-mobile$/, 'How to Set a Stop Loss in MT5 Mobile'],
    [/^how-to-set-stop-loss-mt5$/, 'How to Set a Stop Loss in MT5 (Server-Side)'],
    [/^how-to-set-take-profit-mt5$/, 'How to Set Take Profit in MT5'],
    [/^how-to-set-trailing-stop-mt5$/, 'How to Set a Trailing Stop in MT5'],
    [/^how-to-set-stop-loss-tradingview$/, 'How to Set a Stop Loss in TradingView'],
    [/^how-to-trade-on-apex$/, 'How to Trade on Apex: Platform, Rules and Sizing'],
    [/^metatrader-5-complete-guide$/, 'MetaTrader 5: The Complete Setup Guide'],
    [/^lot-size-for-100k-prop-firm-account$/, 'Lot Size for a $100k Prop Firm Account'],
    [/^how-to-calculate-position-size-prop-firm$/, 'How to Calculate Position Size on a Prop Account'],
    [/^how-much-is-one-micro-nq-point-worth$/, 'What One Micro NQ Point Is Worth'],
    [/^micro-e-mini-vs-e-mini$/, 'Micro E-mini vs E-mini: Tick Values and Margin'],
    [/^micro-futures-margin-requirements$/, 'Micro Futures Margin Requirements Explained'],
    [/^micro-futures-complete-guide$/, 'Micro Futures: The Complete Guide'],
  ];
  for (const [re, t] of map) if (re.test(s)) return t;
  return humanize(s) + ' | 2026 Guide';
}

function h1For(slug, title) {
  const base = title.replace(/\s*\|\s*2026 Guide$/, '');
  if (/^(How|What|Why|When|Can|Do|Does|Is|Are|Should)\b/i.test(base)) return base;
  return base;
}

module.exports = { subjectFor, humanize, titleFor, h1For, SUBJECTS };
