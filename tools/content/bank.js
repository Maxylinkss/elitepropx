'use strict';

/**
 * Shared section bank for the generated long-tail library.
 *
 * Every function returns { id, h2, html }. Renderers pick sections, order them
 * and add page-specific sections around them. Wording is parameterised on the
 * firm(s) and topic so the same mechanic reads differently on a forex page and
 * a futures page, and numeric examples are always labelled as illustrative.
 */

const SITE = require('../../src/lib/site');

const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const money = (n) =>
  '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 });

const p = (s) => `<p>${s}</p>`;
const ul = (items, cls) =>
  `<ul${cls ? ` class="${cls}"` : ''}>\n${items.map((i) => `  <li>${i}</li>`).join('\n')}\n</ul>`;
const ol = (items) =>
  `<ol>\n${items.map((i) => `  <li>${i}</li>`).join('\n')}\n</ol>`;

const table = (headers, rows, cls = '') =>
  `<div class="table-scroll${cls ? ' ' + cls : ''}">\n  <table>\n    <thead>\n      <tr>${headers
    .map((h) => `<th>${h}</th>`)
    .join('')}</tr>\n    </thead>\n    <tbody>\n${rows
    .map((r) => `      <tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`)
    .join('\n')}\n    </tbody>\n  </table>\n</div>`;

const DIMS = {
  'challenge-math.svg': [940, 500],
  'consistency-rule.svg': [940, 540],
  'cost-comparison.svg': [940, 520],
  'daily-drawdown.svg': [1000, 540],
  'drawdown-types.svg': [1000, 560],
  'firm-landscape.svg': [1000, 560],
  'how-it-works.svg': [1000, 470],
  'leverage-vs-risk.svg': [1000, 520],
  'model-fit-flow.svg': [980, 470],
  'payout-timeline.svg': [1000, 420],
  'risk-budget.svg': [940, 520],
  'rulebook-models.svg': [1000, 540],
};

const figure = (name, alt, caption) => {
  const [w, h] = DIMS[name];
  return `<figure>\n  <img src="/assets/img/${name}" alt="${esc(alt)}" width="${w}" height="${h}" loading="lazy">\n  <figcaption>${caption}</figcaption>\n</figure>`;
};

const sec = (id, h2, blocks) => ({
  id,
  h2,
  html: `<h2 id="${id}">${h2}</h2>\n${blocks.filter(Boolean).join('\n')}`,
});

const initials = (name) =>
  name
    .replace(/[^A-Za-z ]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((w) => w[0])
    .join('');

const marketWord = (firm) =>
  firm.market === 'futures'
    ? 'futures'
    : firm.market === 'stocks'
    ? 'equities'
    : firm.market === 'crypto'
    ? 'crypto'
    : firm.market === 'multi'
    ? 'multi-asset'
    : 'forex and CFD';

const unitWord = (firm) =>
  firm.market === 'futures' ? 'contracts' : firm.market === 'stocks' ? 'shares' : 'lots';

/** Short noun phrase for a firm's loss floor, usable inside a sentence. */
const floorShort = (firm) => {
  const d = String((firm && firm.drawdown) || '');
  if (/end-of-day/i.test(d)) return 'end-of-day trailing';
  if (/trailing/i.test(d)) return 'trailing';
  if (/static/i.test(d)) return 'static';
  return 'plan-specific';
};

/** Sentence-ready description of a firm's daily stop rule. */
const dailyPhrase = (firm) => {
  const d = String((firm && firm.daily) || '');
  if (/^yes/i.test(d)) {
    const detail = d.replace(/^yes,?\s*/i, '').replace(/\.$/, '');
    return detail ? `a daily stop (${detail})` : 'a daily stop';
  }
  if (/^no/i.test(d)) return 'no separate daily stop on the standard plan';
  return 'a daily rule that varies with the plan';
};

const riskUnit = (firm) =>
  firm.market === 'futures'
    ? 'ticks and dollars per point'
    : firm.market === 'stocks'
    ? 'cents per share'
    : 'pips and lot value';

/* -------------------------------------------------------------------------- */
/* Shared sections                                                             */
/* -------------------------------------------------------------------------- */

function rulebook(ctx) {
  const f = ctx.firm;
  const rows = [
    ['Market', marketWord(f)],
    ['Evaluation model', f.model],
    ['Loss floor', f.drawdown],
    ['Daily stop', f.daily],
    ['Consistency test', f.consistency],
    ['Minimum trading days', f.minDays],
    ['Billing rhythm', f.billing],
    ['Payout rhythm', f.payout],
    ['Platforms', f.platforms],
    ['Session', f.session],
  ];
  return sec(
    'rulebook',
    `How the ${f.name} rulebook is built`,
    [
      p(
        `The <strong>${f.name}</strong> evaluation is best understood as a set of constraints that interact, not as a headline profit target with some footnotes. The target decides how much you have to make. The loss floor decides how much room you have to make it. The daily stop, if there is one, decides how quickly a bad session ends. The minimum-day rule decides how long the attempt takes even when the target is reached early. Change any one of those and the same trading strategy produces a different outcome.`
      ),
      p(
        `For ${f.name}, the published structure is a ${f.model}. The loss floor is ${f.drawdown}, the daily stop is ${f.daily}, and the consistency condition is ${f.consistency}. Billing is ${f.billing}, payouts follow ${f.payout}, and the supported platforms are ${f.platforms}. Those are the rows that matter. Marketing pages tend to foreground the profit target and the profit split because both are easy to compare; neither tells you whether a given trade is survivable.`
      ),
      table(['Parameter', `${f.name} — published shape`], rows),
      p(
        `Read the loss-floor row before anything else. A loss floor measured from the starting balance is a fixed distance away for the whole attempt: profit does not move it, and an open position cannot pull it closer. A floor measured from peak equity behaves in the opposite way. It follows the high-water mark, so an open winner raises the failure point, and a retracement that gives back profit can end the account while the balance is still above where it started. Those two mechanics require different stop placement, different position sizing and different answers to the question "how much can I risk on this trade?"`
      ),
      p(
        `The daily stop row matters just as much for a different reason. A percentage daily stop measured on equity counts open positions, so it is not enough to check the realised balance at the end of the day. If a trade is $1,800 in profit and then reverses to a $3,200 loss on a $100,000 account with a 5% daily stop, the account can be closed by the swing even if the trader never intended to risk more than one percent. The stop is evaluated continuously, not at midnight.`
      ),
      p(
        `Finally, the minimum-day row sets the floor on elapsed time. A rulebook with no minimum can be passed in a session if the target is reached; one with a five- or ten-day minimum cannot. That matters for cost: on a subscription product, every extra required day is a day of billing, and on a one-off product it is a day of exposure with no additional fee. The same rule change alters the correct pace on the two billing models in opposite directions.`,
        ''
      ),
      p(
        `Before buying, open the firm's own dashboard and confirm each row above against the plan name you are about to purchase. Rules are revised between cohorts, and the plan name — not the brand — is the unit that carries the rulebook. A screenshot of the terms page, dated the day you buy, is the only record that will settle a dispute later.`
      ),
    ]
  );
}

function drawdown(ctx) {
  const f = ctx.firm;
  const trailing = /trailing/i.test(f.drawdown);
  return sec(
    'drawdown',
    trailing ? 'The trailing threshold, worked through' : 'The loss floor, worked through',
    [
      p(
        trailing
          ? `A trailing threshold is the single rule most responsible for failed ${f.name} attempts, and it is routinely described as a "drawdown" as if it were the same thing as a static loss limit. It is not. A static limit is anchored to the starting balance. A trailing threshold is anchored to the highest equity the account has reached, and on an intraday trail it is recalculated as open profit grows.`
          : `A static loss floor is the simplest rule in the ${f.name} rulebook and the one traders most often misapply. The floor is anchored to the starting balance and does not move. On a $100,000 account with a 10% limit, the failure point stays at $90,000 from the first trade to the last, whatever the account does in between.`,
      ),
      p(
        trailing
          ? `Take an illustrative $100,000 account with a $6,000 trailing threshold. The account starts with $6,000 of room. A trade moves to $3,000 of open profit; the floor moves up to $97,000 and the room is still $6,000. The trade retraces and closes at break-even. The floor does not move back down. The account now has $3,000 of room, not $6,000, because the high-water mark was recorded. Two break-even trades after a winner can leave an account with almost no cushion even though the balance never fell below its starting value.`
          : `Take an illustrative $100,000 account with a 10% static limit and a 5% daily stop. The maximum loss is $10,000 and the daily stop is $5,000. A trade that loses $2,000 leaves $8,000 of total room and $3,000 of daily room. A second loss of $2,000 the same day leaves $6,000 total and $1,000 daily. The total floor never moved, but the daily stop is now the binding constraint — and it resets at the firm's defined session boundary, which is usually midnight server time rather than your local midnight.`,
      ),
      figure(
        trailing ? 'drawdown-types.svg' : 'daily-drawdown.svg',
        trailing
          ? 'Diagram comparing a static loss floor with a trailing threshold that follows peak equity'
          : 'Diagram showing how a daily loss limit and a total loss floor interact on a single account',
        trailing
          ? 'The trailing floor follows the high-water mark; the static floor does not.'
          : 'The daily stop and the total floor are two separate failure points.'
      ),
      p(
        trailing
          ? `The practical consequence is that risk per trade has to fall as the target approaches. Early in the attempt, with the full threshold ahead, a 1% risk per trade is comfortably inside the room. Late in the attempt, after a run of profit, the same 1% risk can be larger than the remaining cushion because the cushion is measured from the new high, not from the original balance. Traders who size every trade against the starting balance are therefore taking progressively more risk in relative terms without changing a single parameter.`
          : `The practical consequence is that the daily stop, not the total floor, decides most losing days. A trader who risks 1% per trade can absorb ten losses inside the total limit but only five inside a 5% daily stop, and only if all five happen on the same day. That is why the daily limit should be treated as the real risk budget and the total floor as the backstop. Planning against the total floor alone produces a plan that dies on a normal bad day.`,
      ),
      p(
        `There is a second-order effect that matters on ${marketWord(f)} accounts. The loss is measured on equity, which includes floating profit and loss, spread and commission. On a ${f.market === 'futures' ? 'futures account, commission and exchange fees are charged per contract per side, so a high-frequency plan pays for its activity even when the trades are scratch' : 'forex account, swap and commission are deducted from equity, so a position held overnight can reduce the cushion without a price move'}. A risk plan that ignores costs will drift into the floor more slowly than expected, then all at once.`
      ),
      p(
        `The fix is unglamorous: keep a running high-water mark, compute the remaining room before every trade, and express the stop as a percentage of the room rather than a percentage of the balance. If the remaining room is ${trailing ? '$3,000' : '$6,000'} and the rule is to risk 20% of the room, the maximum loss on the next trade is ${trailing ? '$600' : '$1,200'} — a number that changes as the account moves. A fixed dollar risk is easier to follow, but it is only safe while the room is at least five times that risk.`
      ),
    ]
  );
}

function sizing(ctx) {
  const f = ctx.firm;
  const unit = unitWord(f);
  const rows = [
    ['$25,000', '$250', '$500', '$1,000'],
    ['$50,000', '$500', '$1,000', '$2,000'],
    ['$100,000', '$1,000', '$2,000', '$4,000'],
    ['$200,000', '$2,000', '$4,000', '$8,000'],
  ];
  return sec(
    'sizing',
    `Position sizing on a ${f.name} account`,
    [
      p(
        `Position sizing is where a rulebook becomes a trade. The percentage risk you choose means nothing until it is converted into ${unit}, a stop distance and a lot or contract count. On a ${marketWord(f)} account the conversion has three inputs: the dollar risk, the distance between entry and stop in ${riskUnit(f)}, and the value of one ${unit === 'shares' ? 'share' : unit === 'lots' ? 'lot' : 'contract'} per unit of that distance. Get any one wrong and the trade risks a different amount than intended.`
      ),
      table(
        ['Account', '0.25% risk', '0.5% risk', '1% risk'],
        rows
      ),
      p(
        `The table is deliberately conservative. One percent per trade is the upper end of what a challenge rulebook supports, not a target. With a 10% total loss allowance, ten consecutive 1% losses use the entire budget; with a 5% daily stop, five losses in a day do the same. At 0.5% the account can absorb twenty consecutive losses, which is outside the range most strategies produce but inside the range a bad month can produce.`
      ),
      p(
        `The stop distance is the input traders fudge most often. A stop placed at a round number because it "feels" safe is not a risk calculation. The stop belongs where the trade idea is invalidated, and the position size is whatever makes that stop equal the chosen dollar risk. If the invalidation point is far away, the position gets smaller; if it is close, the position gets larger. The dollar risk stays constant, which is the only way the loss column of a journal stays comparable across setups.`
      ),
      figure(
        'risk-budget.svg',
        'Diagram showing how a fixed dollar risk translates into different position sizes as the stop distance changes',
        'Fixed dollar risk, variable position size: the stop location sets the size, not the other way round.'
      ),
      p(
        f.market === 'futures'
          ? `On futures, the arithmetic is exact and unforgiving. A micro E-mini S&P contract is $5 per point, so a 10-point stop is $50 per contract. A $250 risk budget therefore allows five contracts — but the same $250 on a 40-point stop allows one. Commission is charged per contract per side, so five contracts round-trip costs roughly five times one contract; that cost has to come out of the risk budget, not out of the target. On a small account, commission can be 10–20% of a tight stop, which is why the smallest futures tiers are harder than their percentage targets suggest.`
          : `On forex, the arithmetic depends on the pair, the account currency and the lot size. A standard lot of EURUSD is $10 per pip; a mini lot is $1; a micro lot is $0.10. A $500 risk budget with a 25-pip stop therefore allows two standard lots, or 20 mini lots, or 200 micro lots — the same exposure expressed three ways. On a pair quoted in another currency the pip value changes, and on metals or indices the contract specification does the same. The number that matters is the one in the platform's contract specification window, not a remembered rule of thumb.`
      ),
      p(
        `Two adjustments are specific to evaluation accounts. First, size against the remaining room rather than the starting balance once the account is in profit, particularly on a trailing threshold. Second, size for the daily stop when a setup is taken late in the session: a trade that would be acceptable at 9am can breach the daily limit at 4pm because earlier losses have already consumed part of the budget. The correct size is the smaller of the two constraints, always.`
      ),
      p(
        `A practical routine: before entry, write down the dollar risk, the stop price, the resulting size, and the remaining daily room. After entry, do not move the stop further away. After exit, record the realised risk as a percentage of the account and of the remaining room. Ten trades of that record will tell you more about your sizing than any calculator, because it exposes the difference between the risk you intended and the risk you actually took.`
      ),
    ]
  );
}

function targetMath(ctx) {
  const f = ctx.firm;
  return sec(
    'target-math',
    'What the profit target demands in practice',
    [
      p(
        `A profit target is a distance, and the only useful question is how many trades it takes to cover that distance at a given risk-reward. On an illustrative $100,000 ${f.name} account with an 8% target, the account needs $8,000 of net profit. At a 1:2 risk-reward and 0.5% risk per trade, a winning trade makes $1,000 and a losing trade loses $500. A 50% win rate over 20 trades produces ten winners and ten losers: $10,000 gained, $5,000 lost, $5,000 net. That is short of the target. The same win rate over 32 trades produces $8,000 net, which is the target.`
      ),
      table(
        ['Win rate', 'Risk-reward', 'Trades to $8,000 net at 0.5% risk', 'Calendar at 2 trades/day'],
        [
          ['40%', '1:2', '80', '40 sessions'],
          ['50%', '1:2', '32', '16 sessions'],
          ['60%', '1:2', '20', '10 sessions'],
          ['50%', '1:1', 'infinite (break-even expectancy)', '—'],
          ['50%', '1:3', '16', '8 sessions'],
        ]
      ),
      p(
        `The table explains why most challenge failures are not caused by a bad strategy but by an expectancy that is too thin relative to the calendar. At a 50% win rate and 1:1, the strategy has zero expectancy before costs; no amount of discipline turns it into a pass. At 1:2 it works, but it needs 32 trades, and 32 trades at two per day is sixteen sessions — longer than many traders plan for and longer than many subscription budgets allow.`
      ),
      p(
        `The other side of the equation is the loss allowance. A strategy with a 60% win rate and 1:2 risk-reward will still produce losing streaks. The probability of four consecutive losses at a 40% loss rate is roughly 2.6%; over 32 trades, the chance of seeing at least one four-loss streak is high enough to plan for. At 0.5% risk, four losses cost 2% — survivable. At 2% risk, the same streak costs 8%, which is most of a typical total loss allowance. The target is not the hard part; surviving the distribution on the way to it is.`
      ),
      p(
        `There is also a minimum-days interaction. If the rulebook requires ten trading days and the strategy needs sixteen sessions, the calendar is set by the strategy. If the strategy needs eight sessions, the rulebook adds two idle days that must not be used to "speed things up" with oversized trades. The correct behaviour on a required idle day is no trade, or a trade at the normal size with the normal stop. The requirement is a floor on time, not an invitation to fill it.`
      ),
      p(
        `Finally, subtract costs before comparing any of this to a backtest. Spread, commission, swap and slippage are charged whether the trade wins or loses. On a ${f.market === 'futures' ? 'futures account, per-contract commission on a 20-trade month can equal a meaningful fraction of a small target' : 'forex account, a one-pip spread on a 20-pip stop is a 5% tax on every trade'}. A backtest that ignores costs overstates expectancy, and an overestimated expectancy produces a plan that is too fast for the target and too large for the drawdown.`
      ),
    ]
  );
}

function plan(ctx) {
  const f = ctx.firm;
  return sec(
    'plan',
    `A twenty-session plan for the ${f.name} evaluation`,
    [
      p(
        `A plan is not a prediction. It is a set of rules that decides what you do on each of the twenty sessions an evaluation typically takes, including the sessions where nothing happens. The plan below is built around a 0.5% risk unit, a 1:2 minimum risk-reward and a hard stop at two losses per session. It assumes a ${marketWord(f)} account and a rulebook with a ${floorShort(f)} loss floor. Adjust the numbers to your own account, but keep the structure.`
      ),
      table(
        ['Sessions', 'Objective', 'Maximum risk', 'Stop condition'],
        [
          ['1–2', 'Observe the platform, spreads and session rhythm; take only A+ setups', '0.5% per trade', 'Two losses in a session'],
          ['3–5', 'Establish the routine: pre-market note, one setup type, journal entry', '0.5% per trade', 'Two losses or −1.5%'],
          ['6–10', 'Build the first third of the target at normal size', '0.5% per trade', 'Three consecutive losses'],
          ['11–15', 'Hold size constant; do not increase after a winner', '0.5% per trade', 'Daily stop at 60%'],
          ['16–19', 'Reduce to 0.35% as the remaining room shrinks', '0.35% per trade', 'Two losses in a session'],
          ['20+', 'Only take setups that meet the full checklist; no "last trade" risk', '0.25% per trade', 'Any breach of the daily stop'],
        ]
      ),
      p(
        `The reductions in the final week are the part most traders skip. On a static floor they are optional; on a trailing one they are close to mandatory, because the remaining room is measured from the high-water mark. If the account is $7,000 into an $8,000 target and the trailing cushion has compressed to $2,500, a 0.5% risk is $500 — one fifth of the entire remaining cushion. Halving the size at that point is not cowardice; it is the only sizing that keeps a normal losing streak survivable.`
      ),
      figure(
        'challenge-math.svg',
        'Chart showing a twenty-session path to a profit target with risk reduced as the target approaches',
        'The plan reduces risk as the target approaches; the target does not justify increasing it.'
      ),
      p(
        `Each session has a pre-trade checklist: the economic calendar, the session's key levels, the maximum loss for the day, and the one or two setups that are allowed. If a setup is not on the list, it is not taken. The checklist is not there to improve win rate; it is there to prevent the improvisation that turns a planned 0.5% loss into an unplanned 2% loss at the worst moment of the attempt.`
      ),
      p(
        `The journal is part of the plan, not an optional extra. Record the setup, the reason for entry, the planned stop, the realised result, the remaining room before and after, and one sentence on execution. Twenty entries produce a dataset that can answer the only question that matters at the end of the attempt: was the loss caused by the strategy, the sizing, or a rules breach? Without the journal, every failure looks like bad luck and every pass looks like skill.`
      ),
      p(
        `Finally, define the abort condition in advance. If the account reaches 60% of the total loss allowance, stop for the day and review. If it reaches 80%, stop for the week. The rulebook will not stop you; it will let the account run to the floor. The abort condition is the only part of the plan that protects the fee, and it has to be written before the first trade, when it is still a decision rather than a reaction.`
      ),
    ]
  );
}

function payout(ctx) {
  const f = ctx.firm;
  return sec(
    'payout',
    `Payouts after a ${f.name} pass`,
    [
      p(
        `The evaluation is the audition; the funded account is the job. ${f.name} pays out on this rhythm: ${f.payout}. The split percentage is the number on the sales page, but the rhythm is the number that decides what the account is worth in the first year. A 90% split paid after ninety days is worth less than an 80% split paid in the first week if you need the cash flow, and a split with a consistency condition attached can be reduced after the fact.`
      ),
      p(
        `Read the funded terms for four things before celebrating a pass. First, the profit threshold: some firms require a minimum before the first withdrawal, and that threshold can be a meaningful fraction of the evaluation target. Second, the consistency rule: a payout can be denied or reduced if one day's profit is too large a share of the total. Third, the payment interval and the first-payout restriction. Fourth, the conduct rules that continue to apply after funding — news trading, hedging, copy trading, account sharing and maximum lot size are the usual ones.`
      ),
      figure(
        'payout-timeline.svg',
        'Timeline showing the gap between passing an evaluation, the first payout eligibility date and later payout cycles',
        'The pass date is not the payout date; the funded terms set the gap.'
      ),
      p(
        `A worked example makes the rhythm concrete. Suppose the funded account pays 80% of profit, requires a $500 minimum before the first withdrawal, and then pays on a fourteen-day cycle. A trader who makes $4,000 in the first month receives $3,200 at the first cycle, minus any platform or transfer fees. A trader who makes $4,000 in the first month but takes it as one $4,000 day and thirty flat days may fail a consistency test that caps any single day at 40% of total profit. The profit is the same; the payout is not.`
      ),
      p(
        `Withdrawal mechanics also matter. Bank transfer, crypto and third-party processors have different fees, minimums and settlement times, and the firm may pass the processor fee to the trader. On a small first payout, a $30 transfer fee is a larger share of the money than the difference between an 80% and an 85% split. Check the fee schedule before choosing the method, and keep the withdrawal address or bank details consistent with the account name — mismatches are a common reason a payout is held for review.`
      ),
      p(
        `The most common payout mistake is treating the funded account as a second challenge. After a pass, the target disappears but the loss floor usually remains, and the funded account is often subject to stricter conduct rules than the evaluation. The correct behaviour is to trade the funded account at the same or smaller size than the evaluation, take the first payout as soon as it is eligible, and only increase risk after a track record of withdrawals. The first payout is the proof of the product; everything before it is marketing.`
      ),
    ]
  );
}

function consistency(ctx) {
  const f = ctx.firm;
  return sec(
    'consistency',
    'The consistency condition and how it changes the pass',
    [
      p(
        `A consistency rule limits how much of the total profit can come from a single day. The usual form is a percentage: no single trading day may account for more than 30–50% of total profit at the time of payout. ${f.name} applies this condition as follows: ${f.consistency}. The rule does not stop you passing the evaluation; it can stop you being paid, which is a more expensive failure because the fee and the time are already spent.`
      ),
      p(
        `The arithmetic is simple and brutal. If the rule caps a single day at 40% of total profit, a $4,000 profit day requires at least $6,000 of profit on other days before the payout is valid. A trader who reaches the target with one $5,000 day and $3,000 spread across a month has an 62.5% concentration and fails the test. The same total profit earned as eight $1,000 days passes easily. The target is identical; the distribution is not.`
      ),
      figure(
        'consistency-rule.svg',
        'Bar chart comparing a profit distribution concentrated in one day with an even distribution that satisfies the same consistency rule',
        'Same total profit, different distribution: consistency is a test of shape, not size.'
      ),
      p(
        `That changes the correct plan. If a consistency condition applies, the target should be built from a repeatable daily edge rather than from one outsized trade. Position size should be capped so that a single good day cannot exceed the concentration limit, even if the setup justifies more. In practice this means sizing for the rule, not for the opportunity: a 1:4 winner on a normal day is fine, but the same winner at triple size can make the account unpayable.`
      ),
      p(
        `There is a second-order trap: the rule is usually assessed at payout, not at the moment of the trade. A trader can pass with a concentrated distribution and only discover the problem when requesting the first withdrawal. The time to check is before the first trade, by reading the funded terms and writing down the maximum single-day profit that keeps the account compliant at the expected total. If the expected total is $8,000 and the cap is 40%, no single day should exceed $3,200.`
      ),
      p(
        `Some firms apply consistency only to the evaluation, some only to the funded account, and some to both. The distinction matters because a rule that applies only at payout can be managed after the pass, while a rule that applies to the evaluation can fail the attempt outright. Confirm which version applies to the plan you are buying, and if the answer is ambiguous, ask support in writing and keep the reply. Ambiguity is resolved in the firm's favour in a dispute, so the only useful protection is documentation before purchase.`
      ),
    ]
  );
}

function cost(ctx) {
  const f = ctx.firm;
  return sec(
    'cost',
    `What the evaluation costs against the alternatives`,
    [
      p(
        `The cost of a ${f.name} attempt is not the entry fee. It is the entry fee multiplied by the expected number of attempts, plus the value of the time spent, plus the cost of the mistakes the attempt teaches. A $100 fee that takes four attempts costs $400; a $250 fee that takes one attempt costs $250. Firms compete on the first number because it is visible at checkout, and traders compare on it because it is easy, but the second number is the one that leaves the bank account.`
      ),
      table(
        ['Route', 'Cash cost', 'Time to funded', 'What you still have to do'],
        [
          ['Self-traded challenge, one attempt', 'Entry fee only', 'Days to weeks', 'Pass the rulebook, then trade the funded account'],
          ['Self-traded challenge, three attempts', '3 × entry fee', 'Weeks to months', 'Same, with the retry risk carried by you'],
          ['Flat passing service', `${SITE.price} per evaluation`, 'Typically around two weeks', 'Verify the firm permits third-party trading'],
          ['Managed account or signal service', 'Often a profit split', 'Varies', 'Due diligence on the counterparty and the terms'],
        ]
      ),
      p(
        `The comparison is not an argument that one route is always cheaper. A trader with a tested edge and a $100 fee may pass first time, in which case self-trading is obviously cheaper. A trader who has failed the same rulebook three times has already spent more than the flat fee in cash alone, before counting the months. The honest way to compare is to estimate your own pass probability from your record, not from the marketing claim that "most traders fail".`
      ),
      figure(
        'cost-comparison.svg',
        'Chart comparing the cumulative cost of repeated challenge attempts with a single flat service fee',
        'Repeated attempts cross the flat fee quickly; the exact crossover depends on the entry price.'
      ),
      p(
        `There is also a hidden cost in the retry model: the rulebook does not change between attempts, so a trader who fails for a structural reason — position sizing, session timing, a trailing threshold — tends to fail again for the same reason. Paying for a third attempt without changing the cause is not a strategy; it is a subscription to the same mistake. The fee is only worth paying when the cause has been identified and fixed.`
      ),
      p(
        `If you use a passing service, the relevant cost is the flat fee plus the firm's own rules on third-party trading. Some firms permit it explicitly, some prohibit it, and some are silent. A service that does not ask which firm you are using, or that guarantees a pass without reading the terms, is a risk to the account and to the fee. The ${SITE.price} figure on this site is flat across firms and account sizes, includes retries, and is refunded or declined where the firm's terms do not allow it.`
      ),
      p(
        `Whatever route you choose, keep the cost in the same units as the payoff. A $10,000 funded account that pays an 80% split on $2,000 of profit is worth $1,600 before fees. Spending $1,000 of fees and three months to reach that payoff is a poor trade unless the process also produces a repeatable skill or a second account. The evaluation is a means; the funded account's cash flow is the end. Judging the means by its sticker price rather than by the end it produces is the most common financial mistake in this market.`
      ),
    ]
  );
}

function service(ctx) {
  return sec(
    'service',
    'How a flat-fee passing service fits the rulebook',
    [
      p(
        `A passing service trades the evaluation on your behalf for a flat fee, then hands back a funded account in your name. The model only works if three conditions hold: the firm permits third-party trading on the plan you bought, the service trades the actual rulebook rather than a generic strategy, and the fee is flat enough that a difficult account does not change the economics. Remove any one and the arrangement is either a rules breach or a bad deal.`
      ),
      p(
        `The first condition is a documentation question, not a marketing one. Some firms prohibit account sharing and third-party trading explicitly; others restrict it to the evaluation but allow it on the funded account, or the reverse. The service should ask for the firm and plan before quoting, read the terms, and decline the work if the terms forbid it. A blanket "we can pass any firm" claim is a red flag, because the firms do not share one rulebook.`
      ),
      p(
        `The second condition is about process. An evaluation is a constrained optimisation: reach a target without touching a loss floor, inside a calendar, under a daily stop and a consistency condition. The trading that satisfies those constraints is not the same as the trading that maximises long-run return. A service that treats the account like a personal trading account, with full-size positions and no regard for the floor, is not passing the evaluation; it is gambling with your fee.`
      ),
      p(
        `The third condition is pricing. A percentage-of-profit or profit-split model aligns the service with the funded account, but it also gives the service a claim on the account after the pass. A flat fee is simpler and leaves the funded account entirely yours. The trade-off is that a flat fee is paid whether or not the attempt succeeds, which is why the retry policy matters more than the headline number. ${SITE.name} charges ${SITE.price} per evaluation, covers retries, and takes no share of the funded account.`
      ),
      p(
        `Before buying any service, ask five questions in writing: which firm and plan, whether the terms permit third-party trading, who holds the login during the evaluation, what happens if the account breaches, and what the retry policy is. A service that answers all five consistently is worth considering. A service that answers with a guarantee and a countdown timer is not. The guarantee is the part that cannot be enforced; the terms are the part that can.`
      ),
      p(
        `Finally, the account remains yours. The pass certificate, the funded login and the payout details should be in your name, with your email and your identity verification. A service that needs to hold the funded account, or that pays out through its own account, has changed the product from a service into an investment. That may be a legitimate arrangement, but it is a different one, with different counterparty risk, and it should be priced and documented accordingly.`
      ),
    ]
  );
}

function mistakes(ctx) {
  const f = ctx.firm;
  return sec(
    'mistakes',
    `The mistakes that end ${f.name} attempts`,
    [
      p(
        `Most failed attempts share a small number of causes, and almost none of them are "the market moved". The causes are structural: a position sized against the balance rather than the remaining room, a stop moved to avoid a loss, a session traded because the trader was at the screen rather than because a setup existed, a consistency rule discovered at payout. Each is preventable with a rule written before the attempt.`
      ),
      ul([
        `<strong>Sizing against the starting balance.</strong> On a trailing threshold, the room shrinks as profit accumulates. A fixed 1% risk becomes a growing share of the cushion, and a normal losing streak ends the account even though the strategy is unchanged.`,
        `<strong>Moving the stop.</strong> The stop is the trade's definition of failure. Moving it converts a planned 0.5% loss into an unplanned 2% loss and, on a daily-stop rulebook, can breach the daily limit in a single trade.`,
        `<strong>Trading the calendar instead of the setup.</strong> Minimum-day rules create idle days. Filling them with lower-quality trades is the most common way a profitable strategy fails an evaluation it would otherwise pass.`,
        `<strong>Ignoring the news window.</strong> A position held through a scheduled release can gap past the stop. Where the rulebook restricts news trading, the breach is a rules failure; where it does not, the gap is still a risk failure.`,
        `<strong>Discovering the consistency rule late.</strong> A concentrated profit distribution can pass the target and fail the payout. The limit has to be part of the sizing plan from day one.`,
        `<strong>Increasing size after a winner.</strong> The account is closest to the target when the remaining room is smallest. Increasing size at that moment is the opposite of what the arithmetic requires.`,
        `<strong>Not reading the plan name.</strong> Multi-plan firms sell different rulebooks under one brand. Buying the plan whose marketing page you read is not the same as buying the rulebook you planned for.`,
        `<strong>Treating the funded account as a second challenge.</strong> The funded rules are usually stricter and the payout conditions are where the money is decided. A pass is the start of a new compliance period, not the end of one.`,
      ]),
      figure(
        'risk-budget.svg',
        'Diagram showing how a single oversized loss consumes a disproportionate share of the remaining drawdown room',
        'One oversized loss does more damage than several planned ones; the floor does not care about intent.'
      ),
      p(
        `The list is short because the causes are few. A trader who writes these eight items on a card and checks them before each session has removed most of the ways an evaluation fails. The remaining failures are strategy failures — a genuinely negative expectancy — and those are the only ones that require a new method rather than a new rule.`
      ),
      p(
        `There is one more mistake that deserves its own line: failing to stop. A rulebook will let an account run to the floor. It has no interest in protecting the fee. The trader has to define an abort condition — 60% of the loss allowance, three losses in a day, two breaches of the checklist in a week — and honour it before the account is gone. The abort is not a failure of the attempt; it is the only thing that makes the next attempt affordable.`
      ),
    ]
  );
}

function psychology(ctx) {
  return sec(
    'psychology',
    'The psychology of a fixed deadline',
    [
      p(
        `An evaluation is a performance with a deadline, and deadlines change behaviour. In an open-ended account, a losing week is a data point. In an evaluation with a target and a calendar, the same week feels like a countdown pressure, which produces the two behaviours that end most attempts: increasing size to catch up and taking setups that would not pass the checklist. Neither is a character flaw; both are predictable responses to a finite runway.`
      ),
      p(
        `The first defence is to make the deadline irrelevant to the decision. The target is a distance; the calendar is a separate constraint. If the strategy needs sixteen sessions and the rulebook allows sixty, there is no deadline in any meaningful sense. The trader who feels rushed is usually comparing their pace to someone else's screenshot, not to their own plan. Writing the expected number of sessions next to the target, before the first trade, removes most of that pressure.`
      ),
      p(
        `The second defence is a pre-mortem. Before the attempt, write down the three most likely ways it fails, and the rule that prevents each. "I will increase size after two losses" is prevented by a fixed risk unit. "I will trade a news release to make back a loss" is prevented by a session checklist. "I will hold a loser overnight" is prevented by a hard flat-by time. The pre-mortem turns a vague intention to be disciplined into a specific rule that can be checked.`
      ),
      p(
        `The third defence is a hard stop that is not negotiable in the moment. The rulebook's daily stop is a backstop, not a plan. The plan should stop earlier: two losses in a session, or a 1.5% drawdown on the day. Once the stop is hit, the platform is closed for the day. The decision to stop is made once, when calm, rather than repeatedly, when not.`
      ),
      p(
        `Finally, separate the outcome from the execution. A losing trade taken according to plan is a good trade; a winning trade taken outside the plan is a bad one, because it teaches the wrong lesson. The journal should record the execution grade separately from the profit and loss. Over twenty sessions, the execution grade is the variable the trader controls, and it is the one that predicts the next attempt better than any single result.`
      ),
    ]
  );
}

function news(ctx) {
  const f = ctx.firm;
  return sec(
    'news',
    'News windows, gaps and event risk',
    [
      p(
        `Scheduled economic releases are the most predictable source of unpredictable loss. A position held through a central-bank decision or a payrolls print can gap past its stop, and a stop that is jumped does not limit the loss to the planned amount. For an evaluation account, that is a double problem: the loss can breach a daily stop, and where the rulebook restricts news trading, the trade can also be a rules breach independent of the result.`
      ),
      p(
        `The ${f.name} position on news trading is: ${f.news || 'plan-specific, so confirm it for the exact plan before trading'}. Read that as a constraint on the calendar, not as a suggestion. If the rule prohibits opening or holding positions in a window around a release, the correct behaviour is to be flat before the window and to stay flat until it closes. A stop is not a substitute for being flat, because the gap can be larger than the stop.`
      ),
      table(
        ['Event type', 'Typical risk', 'Practical rule'],
        [
          ['Central-bank rate decision', 'Spread widens, whipsaw in both directions', 'Flat before the statement; no re-entry until the first candle closes'],
          ['Payrolls / CPI', 'Immediate gap, stop slippage', 'No position inside the window; wait for the range to form'],
          ['Weekend gap', 'Opening price away from Friday close', 'Reduce or close before the close if the rulebook restricts holding'],
          ['Geopolitical headline', 'Unpredictable, correlated across pairs', 'Size for the possibility, not the forecast'],
        ]
      ),
      p(
        `The mechanics of a gap are worth spelling out. A stop is an instruction to close at the market once a price is touched. If the market opens beyond the stop, the fill is at the opening price, not at the stop. On a $100,000 account risking 0.5%, a 40-pip stop that gaps 120 pips loses three times the planned amount, which on a tight daily stop can end the day before the trader has made a single decision. The only protection is position size small enough that a multiple of the stop is still survivable, or no position at all.`
      ),
      p(
        `News also changes the shape of the session. The best setups often occur after the initial spike, when the market has chosen a direction and the spread has normalised. Trading the spike itself is a coin flip with a wide spread and a high chance of a stop on both sides. Waiting thirty minutes costs nothing in a twenty-session plan and removes the most expensive form of variance.`
      ),
      p(
        `If the rulebook permits news trading, the risk is still real. The permission is not a recommendation, and the firms that allow it usually still apply a general market-conduct clause that can be used against a trader who appears to be exploiting a pricing error. The safe interpretation is: trade the setup, not the release. If the setup requires the release to work, it is a news trade and should be sized as one.`
      ),
    ]
  );
}

function weekend(ctx) {
  const f = ctx.firm;
  return sec(
    'weekend',
    'Holding overnight and over the weekend',
    [
      p(
        `The weekend rule is easy to ignore during a winning week and impossible to ignore after a gap. ${f.name} treats weekend holding as follows: ${f.weekend || 'confirm per plan, because it varies between products'}. The rule usually interacts with two others: the daily stop, which may be calculated on the Friday close, and the loss floor, which may be adjusted for the gap at the Sunday open.`
      ),
      p(
        `The risk arithmetic is straightforward. A position held over the weekend carries gap risk that cannot be stopped. On a $100,000 account with a 1% position and a 50-pip stop, a 150-pip weekend gap turns a $1,000 planned loss into $3,000. If the daily stop is 5%, that is 60% of the day's budget consumed by a single open position, before any decision is made. On a trailing threshold, the same gap can breach the floor outright.`
      ),
      figure(
        'drawdown-types.svg',
        'Diagram illustrating how a weekend gap can jump a stop and consume more of the loss allowance than planned',
        'A stop limits the loss only when the market trades through it; a gap does not.'
      ),
      p(
        `Where the rulebook allows weekend holding, the decision should still be deliberate. Three questions: is the position small enough that a two-times-stop gap is survivable, is there a scheduled event over the weekend that could move the market, and does the strategy's edge depend on holding through the close? If the answer to the third question is no, closing is the cheaper choice. The foregone overnight move is a cost; the gap is a risk.`
      ),
      p(
        `Where the rulebook restricts weekend holding, the practical rule is a flat-by time well before the close. Not at the close, when spreads widen and liquidity thins, but thirty to sixty minutes earlier, when the exit is still clean. The same applies to Friday's daily stop: a position closed at the bell is a position that cannot gap, and a rulebook that resets the daily stop at the session close will not carry the loss into Monday.`
      ),
      p(
        `For swing strategies, the constraint may be the reason to choose a different firm rather than a different trade. A strategy that needs multi-day holds is incompatible with a rulebook that requires flat weekends, and no amount of position sizing fixes a structural mismatch. Check the rule before buying the evaluation, not after the first Friday.`
      ),
    ]
  );
}

function verify(ctx) {
  const f = ctx.firm;
  return sec(
    'verify',
    'How to verify the terms before you pay',
    [
      p(
        `Every number in this guide describes the published shape of the ${f.name} rulebook, not a guarantee of the terms on the day you buy. Firms revise targets, loss limits and payout conditions between cohorts, and the dashboard you see after checkout is the only version that binds. The verification routine below takes ten minutes and is worth more than any comparison table, including this one.`
      ),
      ol([
        `Open the plan page and the terms page side by side. The plan page carries the marketing numbers; the terms page carries the definitions. Where they differ, the terms page wins.`,
        `Screenshot the loss-floor definition and the daily-stop definition. The words "balance" and "equity" mean different things, and the difference decides whether open positions count.`,
        `Find the consistency clause. Note whether it applies to the evaluation, the funded account or both, and what the threshold is.`,
        `Find the payout section. Note the first-payout restriction, the payment cycle, the minimum withdrawal and the processor fees.`,
        `Find the prohibited-conduct list. Note the rules on news trading, hedging, copy trading, account sharing, EAs and maximum lot size.`,
        `Check the refund and retry policy. A fee is only cheap if a failed attempt can be repeated without paying the full price again.`,
        `Save the pages as PDFs with the date in the filename. If a dispute arises, the dated copy is the only evidence that the terms were different when you bought.`,
      ]),
      p(
        `The most common source of dispute is not a hidden rule; it is a rule the trader read on a comparison site instead of the firm's own page. Comparison content, including this page, is a map of the questions to ask. It is not the contract. Treating it as the contract is how a trader ends up surprised by a consistency clause that was published all along.`
      ),
      p(
        `A second source of dispute is the plan name. A firm with three models can publish three different loss definitions under one brand, and a search result for the brand will mix them. When you compare two firms, compare the exact plan names and the exact account sizes. A $100,000 two-phase plan and a $100,000 one-step plan from the same firm are different products with different probabilities of passing.`
      ),
      p(
        `Finally, ask support the question you cannot answer from the page. "Is the trailing threshold calculated on equity including open profit, or on closed balance?" is a question with a specific answer, and the reply is worth keeping. If support cannot answer a mechanics question, that is itself information about the firm's operational depth.`
      ),
    ]
  );
}

function afterPass(ctx) {
  const f = ctx.firm;
  return sec(
    'after-pass',
    'The first week after the pass',
    [
      p(
        `The pass email is the midpoint, not the finish. Between the pass and the first payout there is a verification step, a contract, a funded login and a compliance period. Each has its own failure mode, and none of them is about trading skill. The first week after a ${f.name} pass is mostly administrative, and treating it that way prevents the most avoidable loss of the whole process.`
      ),
      ol([
        `Complete identity verification with the same documents and the same name as the evaluation account. A mismatch between the account name and the payout method is the most common reason a first withdrawal is held.`,
        `Read the funded contract before signing. The loss floor, the consistency condition and the conduct rules can differ from the evaluation, and the signature is the point at which they bind.`,
        `Log in to the funded account and confirm the balance, the platform and the rulebook shown on the dashboard. If anything differs from the contract, raise it before the first trade.`,
        `Trade the first week at the same or smaller size than the evaluation. The target is gone, but the loss floor is not, and the funded account is the asset that produces the payouts.`,
        `Request the first payout as soon as it is eligible. The first payout is the proof that the process works end to end; delaying it to grow the balance increases the risk without increasing the evidence.`,
      ]),
      p(
        `The psychological shift is harder than the administrative one. During the evaluation, the target gave every trade a purpose. After the pass, there is no target, and the absence of one can produce either over-trading or paralysis. The replacement is a payout plan: a monthly profit goal expressed as a percentage, a maximum risk per trade, and a withdrawal schedule. The goal is cash flow, not a certificate.`
      ),
      p(
        `Most traders who pass and then lose the funded account do so in the first month, by increasing size because "the account is already funded". The account is funded, which means it is now the thing that pays. Treating it as a victory lap is how the payout that justified the fee never arrives. The correct size after a pass is the size that survived the evaluation, not the size that feels deserved.`
      ),
      p(
        `Keep the records. The pass certificate, the signed contract, the first payout statement and the trade history are the evidence base for a second account, a scaling application or a dispute. A trader who can show a funded account, a payout and a clean rulebook history has a much easier time with the next firm than one who can only show a screenshot of a target reached.`
      ),
    ]
  );
}

function platform(ctx) {
  const f = ctx.firm;
  return sec(
    'platform',
    `Trading the ${f.name} account on ${f.platforms.split(',')[0]}`,
    [
      p(
        `${f.name} supports ${f.platforms}. The platform is not a neutral choice: it decides how stops are stored, whether they are visible to the broker, how the daily loss is displayed, and how quickly an exit can be executed when the market moves. A rulebook that depends on precise stop placement is only as good as the order types the platform actually supports.`
      ),
      p(
        `The first thing to configure is the stop-loss order type. A server-side stop is held by the broker and survives a disconnect; a client-side stop exists only while the terminal is running. On an evaluation account, a client-side stop is a single power cut away from an unlimited loss. Configure server-side stops for every position, and check after the first trade that the stop is visible in the order list rather than only on the chart.`
      ),
      p(
        `The second is the daily-loss display. Most platforms show balance and equity, but few show the distance to the firm's daily stop, because the firm's definition is not part of the platform. Build the number yourself: daily starting equity minus the allowed loss, written on a note next to the screen. Do not rely on the platform's "free margin" figure, which includes unrealised profit and has nothing to do with the rulebook.`
      ),
      p(
        `The third is execution during fast markets. Spread widening and slippage are not platform bugs; they are the market. A stop order becomes a market order when triggered, so the fill can be worse than the stop price. The only defence is position size and avoiding the moments when liquidity is thinnest. A platform with a good chart and a fast server does not change that arithmetic.`
      ),
      p(
        `Finally, keep a second device and a backup connection. An evaluation that depends on one laptop and one internet connection is one outage away from a breach. A phone with the same platform installed, logged in and tested before the attempt is cheap insurance. The rulebook does not accept "my connection dropped" as a defence, and neither will the firm.`
      ),
    ]
  );
}

function journal(ctx) {
  return sec(
    'journal',
    'The journal that makes the next attempt cheaper',
    [
      p(
        `A trading journal is usually described as a tool for improving win rate. On an evaluation, its more valuable job is cost control: it identifies which losses were planned and which were caused by a rule breach, and it separates the two. A trader who knows that 70% of losses came from three breaches does not need a new strategy; they need three rules. A trader who knows that every loss was planned and the expectancy is still negative does need a new strategy.`
      ),
      table(
        ['Field', 'Why it matters'],
        [
          ['Setup name', 'Groups results by pattern rather than by story'],
          ['Planned risk ($ and %)', 'Compares intended risk with realised risk'],
          ['Remaining room before entry', 'Exposes sizing against the balance instead of the cushion'],
          ['Stop distance and size', 'Reconstructs the position-sizing decision'],
          ['Result in R', 'Makes wins and losses comparable across instruments'],
          ['Rule breach (Y/N)', 'Separates execution failures from strategy failures'],
          ['One-line execution note', 'Turns the trade into a lesson rather than a memory'],
        ]
      ),
      p(
        `The minimum viable journal is seven columns and takes ninety seconds per trade. The elaborate version with screenshots and sentiment scores is usually abandoned by day four. Start with the seven, keep them for twenty sessions, and only add fields that answer a question you actually have. A journal that is too detailed to maintain produces no data at all.`
      ),
      p(
        `Review the journal weekly, not daily. Daily review encourages reacting to noise; weekly review shows the distribution. Count the breaches, the average planned risk, the average realised risk, the win rate and the average R. If realised risk is consistently higher than planned risk, the problem is execution. If realised risk matches planned risk and the expectancy is negative, the problem is the strategy. The two problems have different fixes, and the journal is what tells them apart.`
      ),
      p(
        `Keep the journal across attempts. A failed evaluation is only a total loss if it produces no information. The second attempt should start with the first attempt's distribution in hand: which setups worked, which sessions produced the losses, which rule was broken most often. That is the difference between paying for a retry and paying for a lesson.`
      ),
    ]
  );
}

function alternatives(ctx) {
  const f = ctx.firm;
  const pool = ctx.alternatives || [];
  const rows = pool.slice(0, 4).map((a) => [
    a.name,
    a.market,
    a.drawdown,
    a.billing,
    a.bestFor,
  ]);
  return sec(
    'alternatives',
    `When a different firm fits better than ${f.name}`,
    [
      p(
        `No rulebook is best for every trader, and the useful comparison is between structures rather than brands. ${f.name} fits a trader whose constraints match a ${floorShort(f)} loss floor, ${dailyPhrase(f)} and ${f.billing} billing. A trader with a different constraint — a swing strategy, a session that does not overlap the market, a budget that cannot absorb a retry — will get a better expected outcome from a different structure, even if the other firm is less famous.`
      ),
      rows.length
        ? table(
            ['Firm', 'Market', 'Loss floor', 'Billing', 'Best for'],
            rows
          )
        : '',
      p(
        `The first mismatch to check is session availability. A ${marketWord(f)} evaluation whose opportunity set sits in a session you cannot trade is not a difficulty problem; it is a scheduling problem. The second is the drawdown mechanic: a strategy that holds positions through retracements needs a static floor, while a strategy that takes quick profits and re-enters can live with a trailing one. The third is billing: a one-off fee rewards patience, a subscription punishes it.`
      ),
      p(
        `The fourth is the payout rhythm. A firm that pays on demand after a short seasoning period is worth more to a trader who needs cash flow than a firm with a higher split and a ninety-day cycle. Compare the first-year cash, not the headline percentage. The fifth is platform access: if your strategy depends on a specific order type or chart, a firm that does not support it is not a candidate, whatever its target.`
      ),
      p(
        `It is also worth distinguishing between switching firms and switching rulebook models. A trader who keeps failing a trailing threshold will keep failing it at every firm that uses one. Moving to a static floor is a structural change; moving from one trailing firm to another is a change of logo. The comparison table is useful only if it changes the mechanic, not just the name.`
      ),
      p(
        `Finally, price the switch honestly. A new evaluation fee, a new data subscription and a new learning curve are real costs. If the current rulebook is a reasonable fit and the failures are execution failures, the cheaper fix is a rule, not a new firm. If the failures are structural — the mechanic fights the strategy — the switch is the cheaper fix even at a higher fee.`
      ),
    ]
  );
}

function tax(ctx) {
  return sec(
    'tax',
    'Tax and record-keeping on evaluation payouts',
    [
      p(
        `Payouts from a prop firm are income, not capital gains from a brokerage account, in most jurisdictions. The firm pays a profit share for trading its capital; the trader receives a fee for a service, often with no employment relationship and no tax withheld. That classification drives the record-keeping: the relevant documents are the payout statements, the contracts and the fees paid, not a brokerage 1099 or equivalent.`
      ),
      p(
        `The exact treatment depends on residence, the firm's jurisdiction and whether the trader operates as an individual or a company. This page cannot give tax advice and does not try to. What it can do is list the records that any adviser will ask for: every payout statement with the gross profit, the split, the fee deductions and the net received; every evaluation fee paid, including failed attempts; every platform or data subscription; and the dates of each.`
      ),
      p(
        `The asymmetry that catches traders is that failed evaluation fees are usually deductible business expenses while the payouts are taxable income, but only if the activity is treated as a business rather than a hobby. That classification is jurisdiction-specific and depends on intent, organisation and repetition. A trader with one small payout and no records is in a different position from one running multiple accounts with a documented process.`
      ),
      p(
        `Keep the records in the currency you were paid and note the exchange rate on the payment date. A payout in dollars converted to another currency produces a gain or loss on the conversion that is separate from the trading result. Ignoring it produces a reconciliation problem at year end that is much harder to fix than to prevent.`
      ),
      p(
        `The practical rule is to treat the first payout as the moment the activity becomes a business for record-keeping purposes, and to keep everything from the first evaluation fee onward. The records are cheap to keep and expensive to reconstruct. A folder with dated PDFs of every fee, contract and payout is sufficient for most advisers to do the rest.`
      ),
    ]
  );
}

function glossary(ctx) {
  const f = ctx.firm;
  return sec(
    'glossary',
    'Terms used in this guide',
    [
      p(
        `The vocabulary of prop evaluations is small but inconsistent between firms. The definitions below are the ones used on this page; where ${f.name} uses a different word for the same mechanic, the mechanic is what matters.`
      ),
      table(
        ['Term', 'Meaning on this page'],
        [
          ['Evaluation / challenge', 'The paid test phase before a funded account'],
          ['Verification / phase two', 'A second test phase, usually with a smaller target'],
          ['Static loss floor', 'A maximum loss fixed at the starting balance'],
          ['Trailing threshold', 'A maximum loss measured from peak equity that moves up as profit grows'],
          ['End-of-day trailing', 'A trailing threshold recalculated only at session close'],
          ['Daily stop', 'A maximum loss within one trading day, reset at the firm’s session boundary'],
          ['Consistency rule', 'A cap on how much of total profit may come from one day'],
          ['Minimum trading days', 'The smallest number of sessions a pass can take'],
          ['Profit split', 'The trader’s share of funded-account profit'],
          ['Seasoning period', 'The wait before the first payout is eligible'],
          ['Soft breach', 'A rule violation that resets progress rather than closing the account'],
          ['Hard breach', 'A rule violation that closes the account'],
          ['Funded account', 'The live account after a pass, governed by the funded terms'],
        ]
      ),
      p(
        `Two definitions cause most of the confusion. "Drawdown" is used for both the static floor and the trailing threshold, but they behave in opposite ways. "Daily loss" is sometimes measured on balance and sometimes on equity; the difference decides whether an open position can breach the limit. When a page or a support reply uses either word without defining it, ask which one is meant before relying on the number.`
      ),
      p(
        `The other terms are administrative. A soft breach usually costs progress; a hard breach costs the account. A seasoning period is a waiting time, not a trading requirement. A profit split is applied to profit, not to the account balance, and fees are usually deducted before the split. Reading the payout statement once with these definitions in hand will make the arithmetic obvious.`
      ),
    ]
  );
}

function numeric(ctx) {
  const f = ctx.firm;
  const market = f ? f.market : /micro|futures|nq|e-mini/.test(ctx.slug) ? 'futures' : 'forex';
  if (market === 'futures') {
    return sec(
      'numbers',
      'Contract values, and what one contract actually risks',
      [
        p(
          `Futures sizing starts with the contract specification. The E-mini S&P 500 (ES) is $50 per index point; the Micro E-mini (MES) is $5. The E-mini Nasdaq (NQ) is $20 per point; the Micro Nasdaq (MNQ) is $2. Gold (GC) is $100 per point with a 0.10 tick, so one tick is $10; the Micro Gold (MGC) is $10 per point and $1 per tick. Those numbers, not the margin, determine the dollar risk of a stop.`
        ),
        table(
          ['Contract', 'Value per point', 'Value per tick', 'Typical use'],
          [
            ['ES (E-mini S&P)', '$50.00', '$12.50 (0.25 pt)', 'Full-size index exposure'],
            ['MES (Micro S&P)', '$5.00', '$1.25 (0.25 pt)', 'Small accounts, precise sizing'],
            ['NQ (E-mini Nasdaq)', '$20.00', '$5.00 (0.25 pt)', 'Higher volatility index exposure'],
            ['MNQ (Micro Nasdaq)', '$2.00', '$0.50 (0.25 pt)', 'Small accounts, tight risk control'],
            ['CL (Crude oil)', '$1,000 per $1', '$10 per $0.01', 'Energy, event-driven'],
            ['MCL (Micro crude)', '$100 per $1', '$1 per $0.01', 'Small energy exposure'],
            ['GC (Gold)', '$100 per $1', '$10 per $0.10', 'Metals, macro events'],
            ['MGC (Micro gold)', '$10 per $1', '$1 per $0.10', 'Small metals exposure'],
          ]
        ),
        p(
          `The formula is: contracts = dollar risk ÷ (stop distance in points × value per point). On a $100,000 evaluation risking 0.5% ($500) with a 10-point stop on MES, each contract risks $50, so the position is ten contracts. The same $500 with a 40-point stop allows two contracts. The dollar risk is constant; the size moves with the stop.`
        ),
        p(
          `Commission changes the arithmetic at small sizes. A round turn on a micro typically costs a dollar or two per contract, so ten contracts cost $10–$20 before the trade moves. On a $500 risk budget that is 2–4% of the risk, and on a smaller budget it can be 10%. The commission has to be subtracted from the risk budget, not added to the target.`
        ),
        p(
          `Margin is a separate constraint. The exchange sets a maintenance margin and the broker sets an intraday margin, which can be lower. A trader who sizes to the intraday margin is using the maximum the platform will allow, which is almost always larger than the size the loss floor supports. The correct size is the smaller of the two calculations, and on an evaluation it is nearly always the loss-floor calculation.`
        ),
      ]
    );
  }
  return sec(
    'numbers',
    'Lot values, and what one lot actually risks',
    [
      p(
        `Forex sizing starts with pip value. A standard lot of a USD-quoted pair is $10 per pip; a mini lot is $1; a micro lot is $0.10. The formula is: lots = dollar risk ÷ (stop distance in pips × pip value per lot). On a $100,000 evaluation risking 0.5% ($500) with a 25-pip stop, that is $500 ÷ (25 × $10) = 2.0 standard lots, or 20 mini lots, or 200 micro lots.`
      ),
      table(
        ['Account', 'Risk at 0.5%', '20-pip stop', '40-pip stop', '80-pip stop'],
        [
          ['$25,000', '$125', '0.62 lots', '0.31 lots', '0.15 lots'],
          ['$50,000', '$250', '1.25 lots', '0.62 lots', '0.31 lots'],
          ['$100,000', '$500', '2.50 lots', '1.25 lots', '0.62 lots'],
          ['$200,000', '$1,000', '5.00 lots', '2.50 lots', '1.25 lots'],
        ]
      ),
      p(
        `The table assumes a USD-quoted pair with a $10 pip value per standard lot. On pairs quoted in another currency, or on crosses, the pip value has to be converted into the account currency first. On gold the contract is usually 100 ounces and the tick value differs from a currency pair entirely, which is why a lot size copied from EURUSD is not a size at all on XAUUSD.`
      ),
      p(
        `The other input is the account currency. A euro-denominated account trading a dollar-quoted pair has a pip value in dollars that must be converted at the prevailing rate, and the conversion changes the risk slightly as the rate moves. For most evaluation sizes the difference is small, but it should be computed rather than assumed.`
      ),
      figure(
        'risk-budget.svg',
        'Diagram showing how a fixed dollar risk translates into different lot sizes at different stop distances',
        'The stop distance sets the size; the risk budget stays constant.'
      ),
      p(
        `A practical check: after entering the position, look at the platform's own profit-and-loss display for a one-pip move and compare it with the intended risk. If the numbers disagree, the lot size is wrong. This takes ten seconds and catches the most common sizing error before it becomes a loss.`
      ),
    ]
  );
}

function checklist(ctx) {
  const f = ctx.firm;
  return sec(
    'checklist',
    'The pre-purchase checklist',
    [
      p(
        `Before paying for a ${f.name} evaluation, confirm every item below against the firm's own pages. The list is deliberately mechanical: each item is a question with a yes/no answer, not a judgement about the firm's quality. A firm can be legitimate and still be a poor fit for a particular trader, and the checklist is designed to expose fit rather than reputation.`
      ),
      ul([
        `The plan name is the one whose rulebook I have read, not a similar plan from the same brand.`,
        `The loss floor is defined on balance or equity, and I know which.`,
        `The daily stop, if any, resets at a stated time in a stated timezone.`,
        `The minimum trading days are compatible with the number of sessions my strategy needs.`,
        `The consistency rule, if any, applies to the evaluation, the funded account or both.`,
        `The first payout is eligible after a stated period, with a stated minimum.`,
        `News trading, weekend holding, hedging, copy trading, EAs and account sharing are each explicitly allowed or prohibited.`,
        `The retry and refund policy is written down, not implied.`,
        `The platform supports the order types my strategy needs.`,
        `The total cost across my expected number of attempts is affordable without affecting my risk capital.`,
        `If I use a service, the terms permit third-party trading on this exact plan.`,
        `I have saved dated copies of the terms pages I relied on.`,
      ]),
      p(
        `Twelve items, ten minutes, and most of the expensive surprises in this market disappear. The items that most often fail are the consistency rule, the weekend restriction and the retry policy, in that order. Each is buried in a terms page rather than a sales page, which is exactly why the checklist exists.`
      ),
      p(
        `The last item is the one traders skip. A dated copy of the terms is not paranoia; it is the only way to resolve a dispute about what the rulebook said on the day of purchase. Firms revise pages, and a revision is not a breach if the new terms were published before the trade. The copy establishes which version applied.`
      ),
    ]
  );
}

const extras = [platform, journal, glossary, checklist, tax, psychology, weekend, news];

function hashStr(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/**
 * Wrap each shared section so a page renders the base version or an alternate
 * one depending on its own path. This keeps the site's recurring mechanics
 * readable without printing one identical block on two hundred pages.
 */
function withVariants(map) {
  const out = {};
  for (const [name, fn] of Object.entries(map)) {
    out[name] = (ctx) => {
      // Lazy require: variants.js needs the helpers above, not this export.
      const alt = require('./variants')[name];
      if (alt && hashStr(String(ctx.path || '') + name) % 2 === 1) return alt(ctx);
      return fn(ctx);
    };
  }
  return out;
}

module.exports = {
  esc,
  money,
  p,
  ul,
  ol,
  table,
  figure,
  sec,
  initials,
  marketWord,
  unitWord,
  riskUnit,
  floorShort,
  dailyPhrase,
  sections: withVariants({
    rulebook,
    drawdown,
    sizing,
    targetMath,
    plan,
    payout,
    consistency,
    cost,
    service,
    mistakes,
    psychology,
    news,
    weekend,
    verify,
    afterPass,
    platform,
    journal,
    alternatives,
    tax,
    glossary,
    checklist,
    numeric,
  }),
  extras,
};
