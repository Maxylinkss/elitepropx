'use strict';

/**
 * Alternate versions of the most-used shared sections.
 *
 * Each page picks a variant by hash of its own path, so the same rule is
 * explained from a different angle on neighbouring pages instead of repeating
 * one identical block site-wide. Variants keep the same heading and the same
 * mechanics; they change the framing, the examples and the emphasis.
 */

function H() {
  return require('./bank');
}

const dollar = (n) => '$' + Number(n).toLocaleString('en-US');

function drawdown(ctx) {
  const { sec, p, table, figure } = H();
  const f = ctx.firm;
  const trailing = /trailing/i.test(f.drawdown);
  return sec(
    'drawdown',
    trailing ? 'Reading the trailing threshold correctly' : 'Reading the loss floor correctly',
    [
      p(
        `There is a test that separates a trader who understands a ${f.name} rulebook from one who has only read the sales page: ask what happens to the failure point after a winning trade. On a static floor the answer is "nothing". On a trailing threshold the answer is "it moves up, and it does not move back down". Everything else in the risk plan follows from that answer.`
      ),
      table(
        ['Event', trailing ? 'Static floor' : 'Trailing threshold', trailing ? 'Trailing threshold' : 'Static floor'],
        [
          ['Account starts at $100,000 with a 10% floor', '$90,000', '$90,000'],
          ['Trade runs to +$3,000 open profit', 'floor stays $90,000', 'floor rises toward $93,000'],
          ['Trade closes at break-even', 'floor stays $90,000', 'floor stays at the raised level'],
          ['Second break-even trade', 'no change', 'no change, but room is smaller'],
          ['Room remaining after two scratch trades', '$10,000', 'roughly $7,000'],
        ]
      ),
      p(
        `The table is the whole argument. The same two scratch trades leave a static-floor account untouched and a trailing-threshold account with significantly less room than it started with. The balance is identical in both cases; only the rule is different. A trader who measures risk as a percentage of the balance will not notice the change until a normal losing trade breaches a floor they believed was still $10,000 away.`
      ),
      figure(
        'drawdown-types.svg',
        'Diagram showing a static loss floor next to a trailing threshold that follows peak equity',
        'One floor is anchored to the starting balance; the other follows the high-water mark.'
      ),
      p(
        `There is a second-order consequence for the plan. On a trailing threshold, the largest risk of the attempt is in the middle: the account has accumulated some profit, the floor has moved up, and the cushion is thinner than it looks while the target is still some distance away. That is the moment to reduce size, not to press. Many failed attempts breach in this middle phase, after a good start and before the target, which is why the trailing rule is often described as punishing success.`
      ),
      p(
        `Practical rule: keep a note of the current high-water mark and recompute the room before every trade. If the room divided by your normal risk is fewer than five, cut the size. If it is fewer than three, stop for the day. On a static floor the same check is cheap insurance against the daily stop; on a trailing one it is the difference between finishing and failing.`
      ),
    ]
  );
}

function sizing(ctx) {
  const { sec, p, table, figure } = H();
  const f = ctx.firm;
  const unit = f.market === 'futures' ? 'contracts' : f.market === 'stocks' ? 'shares' : 'lots';
  return sec(
    'sizing',
    `Turning a risk percentage into ${unit}`,
    [
      p(
        `Sizing is not a judgement call; it is arithmetic with one fixed input and two measured ones. The fixed input is the dollar risk, which comes from the plan. The measured inputs are the stop distance, which comes from the chart, and the value of one ${unit === 'shares' ? 'share' : unit === 'contracts' ? 'point per contract' : 'pip per lot'}, which comes from the instrument's specification. Change either measured input and the size changes, even if the dollar risk does not.`
      ),
      table(
        ['Account', 'Risk 0.5%', 'Tight stop', 'Wide stop'],
        [
          ['$25,000', dollar(125), 'large position, small room for error', 'small position, survivable'],
          ['$50,000', dollar(250), 'moderate position', 'moderate position'],
          ['$100,000', dollar(500), 'position may exceed the instrument’s noise', 'the same trade, sized conservatively'],
          ['$200,000', dollar(1000), 'fixed costs matter less here', 'the most forgiving of the four'],
        ]
      ),
      p(
        `The trap in the table is the tight-stop column. A tight stop with a large position looks efficient because the dollar risk is unchanged, but it moves the failure point of the trade into the market's ordinary noise. On an evaluation the consequence is a loss that was not a loss of the idea, only a loss of the stop. Wide stops are slower but they fail for the right reason, and a journal full of right-reason failures is a journal that can be improved.`
      ),
      figure(
        'risk-budget.svg',
        'Diagram showing position size falling as the stop distance grows while dollar risk stays constant',
        'Fixed risk, variable size: the stop decides the position, not the other way round.'
      ),
      p(
        f.market === 'futures'
          ? `On futures the numbers are exact. One micro E-mini S&P contract is $1.25 per tick and $5 per point; one micro Nasdaq contract is $0.50 per tick and $2 per point. A 20-point stop on a micro S&P is $100, so a $250 risk budget supports two contracts with $50 left for commission. That residual is the part traders forget: on small accounts, commission can be a fifth of the risk budget, which means the effective stop has to be tighter or the size smaller.`
          : `On forex the numbers depend on the pair. A standard lot of a dollar-quoted pair moves $10 per pip, so a 20-pip stop is $200 per lot; a $500 risk budget therefore supports 2.5 lots. On a cross or a metal the pip value is different, and on gold the contract specification changes the calculation entirely. Read the platform's specification window once, write the number down, and reuse it rather than estimating from memory.`
      ),
      p(
        `Two checks close the loop. Before entry, confirm the ticket's estimated loss equals the intended dollar risk; after entry, confirm the position's value per pip or point matches what the size calculation assumed. Both take seconds, and together they catch the two most common sizing errors: a fat-fingered size and a stop placed in the wrong unit.`
      ),
    ]
  );
}

function mistakes(ctx) {
  const { sec, p, table } = H();
  const f = ctx.firm;
  return sec(
    'mistakes',
    `The failure modes on ${f.name}, ranked by frequency`,
    [
      p(
        `Failed attempts are not evenly distributed across causes. In practice a small number of behaviours accounts for most breaches, and they tend to arrive in the same order: the first mistake creates the condition for the second. Understanding the sequence is more useful than memorising a list, because the sequence is what a trader can interrupt.`
      ),
      table(
        ['Cause', 'What it looks like', 'How it ends the account'],
        [
          ['Sizing against the balance', 'Risk unit fixed at 1% while profit accumulates', 'A normal losing streak breaches a compressed cushion'],
          ['Moving the stop', 'Stop widened after entry to avoid a loss', 'One trade consumes the daily budget'],
          ['Trading without a setup', 'Filling a required session instead of waiting', 'Small losses accumulate into a daily stop'],
          ['Ignoring the release calendar', 'Position held through a scheduled event', 'Gap past the stop; possible rules breach'],
          ['Late consistency discovery', 'One outsized winning day', 'Payout reduced or refused after a pass'],
          ['Increasing size near the target', 'Bigger position because the target is close', 'Retracement erases the progress'],
        ]
      ),
      p(
        `The first row causes the most failures because it is invisible. Nothing about a fixed 1% risk unit feels wrong; it is taught as best practice in personal accounts. On a rulebook where the loss floor moves with equity, that same unit becomes more aggressive with every winner, which is the opposite of what the plan intended. The fix is a single line in the plan: risk is a percentage of the remaining room, recalculated daily.`
      ),
      p(
        `The second row is the emotional one. Moving a stop is a decision to accept a larger loss than the plan allowed, made at the worst moment for judgement. It is also the mistake most easily prevented, because a server-side stop does not ask permission. If the stop cannot be moved without deliberate action, the discipline gap narrows to whether that action is taken, which is a far easier question than whether the loss should be accepted.`
      ),
      p(
        `The last row deserves a note of its own. Traders who do the hard part well often fail in the final third because the finish line changes the perceived value of a small gain. A 0.5% gain that puts the account $400 from the target feels inadequate, so the size goes up. The rule that fixes this is deliberately unglamorous: the size near the target is smaller than the size at the start, and the last trades are taken at the plan's minimum size regardless of how close the target appears.`
      ),
    ]
  );
}

function plan(ctx) {
  const { sec, p, table, figure } = H();
  const f = ctx.firm;
  return sec(
    'plan',
    `A plan written in four blocks, not twenty sessions`,
    [
      p(
        `Session-by-session plans look precise and are usually abandoned by day three. A more durable structure has four blocks: calibration, accumulation, protection and completion. Each block has one objective, one size, and one reason to stop. Because the blocks are defined by what the account is doing rather than by the calendar, the plan survives a bad week without needing to be rewritten.`
      ),
      table(
        ['Block', 'Objective', 'Risk per trade', 'Exit rule'],
        [
          ['Calibration', 'Learn the platform, spreads and session rhythm', '0.25%', 'Stop after two losses in a session'],
          ['Accumulation', 'Build the first half of the target', '0.5%', 'Stop after three consecutive losses'],
          ['Protection', 'Hold the cushion as the floor approaches', '0.35%', 'No new trades after 60% of the daily stop'],
          ['Completion', 'Finish at minimum size, inside the rules', '0.2%', 'Stop the attempt at the first breach'],
        ]
      ),
      p(
        `The block sizes are deliberately not equal. Calibration is small because its purpose is information, not profit. Accumulation is the largest because the cushion is at its widest and the target is far away. Protection reduces size as the floor closes in, and completion reduces it again because the remaining distance is small enough that a single loss would erase more than the gain available.`
      ),
      figure(
        'challenge-math.svg',
        'Chart showing four planning blocks with risk falling as the target approaches',
        'Risk per trade falls across the four blocks; the target does not justify increasing it.'
      ),
      p(
        `The exit rules matter as much as the entry rules. Each block ends for a stated reason — two losses in a session, three in a row, 60% of the daily stop, the first breach — and when the reason appears, the block ends. The plan does not require the trader to judge whether the market will turn; it requires recognising a number that was written down when the account was calm.`
      ),
      p(
        `Two operating rules hold the blocks together. First, the daily check: before the first trade, state the remaining room, the daily stop and the risk unit for the current block. Second, the weekly review: count the breaches, the average realised risk and the average R. If realised risk consistently exceeds planned risk, the blocks are fine and the execution is not; if realised risk matches planned risk and the expectancy is still negative, the strategy needs work before another fee is spent.`
      ),
      p(
        `One more instruction belongs in the plan: what to do when the account reaches 70% of the loss allowance. The answer is stop trading for the day and review the last ten trades in writing. The rulebook will not stop the account there. The plan has to, and the moment to decide is now rather than at the floor.`
      ),
    ]
  );
}

function cost(ctx) {
  const { sec, p, table, figure } = H();
  const f = ctx.firm;
  return sec(
    'cost',
    'Adding up every cost, not just the one at checkout',
    [
      p(
        `A prop evaluation has a visible price and an invisible total. The visible price is the fee on the checkout page. The total includes the expected number of attempts, the platform or data costs that continue between attempts, the cost of the time spent, and — if the attempt fails — the value of the information it produced. Only the first is easy to compare, which is why it dominates the marketing.`
      ),
      table(
        ['Cost line', 'Paid to', 'Behaviour'],
        [
          ['Evaluation fee', `the firm, per attempt`, f.billing === 'one-off per attempt' ? 'one-off, so patience is free' : 'monthly, so slowness is expensive'],
          ['Platform or data feed', 'platform or data provider', 'continues while you are between attempts'],
          ['Failed attempt', 'the firm, again', 'the cost that compounds fastest'],
          ['Funded account data', 'provider or firm', 'small, ongoing, and often forgotten'],
          ['Payout processing', 'the payment processor', 'proportionally largest on the first payout'],
        ]
      ),
      p(
        `Stack those lines for two scenarios. A trader who passes first time at a $150 fee pays $150 plus one month of platform costs. A trader who takes four attempts pays $600 plus four months of platform costs plus the time — and if the entry fee is a subscription, the four attempts also carry the weeks spent in each. The second scenario is common, and it is the one the flat-fee model is priced against rather than the first.`
      ),
      figure(
        'cost-comparison.svg',
        'Chart showing cumulative cost rising with each repeated attempt against a single flat fee',
        'The flat fee is priced against the realistic number of attempts, not the best case.'
      ),
      p(
        `The comparison with a flat service is a comparison of two different bets. Self-trading risks the fee repeatedly and keeps the skill; the service pays once and skips the execution work. Neither dominates. A trader with a tested method and a record of passing should self-trade; a trader whose failures share one structural cause should either fix the cause or buy the outcome, not pay for the same lesson a third time.`
      ),
      p(
        `Whatever the route, the number to compare is the cost per funded account, not the cost per attempt. Divide the total spent — fees, data, and any service fee — by the number of funded accounts actually produced. That figure is usually several times the checkout price, and it is the only one that is comparable across different routes.`
      ),
    ]
  );
}

function serviceVariant(ctx) {
  const { sec, p, table } = H();
  return sec(
    'service',
    'Using a flat-fee service without breaking the rules',
    [
      p(
        `The appeal of a passing service is straightforward: pay once, receive the outcome, avoid the execution work. The risks are less obvious, and all of them live in the firm's terms rather than in the service's marketing. A service can be honest and still be an unsuitable purchase for a particular account, because the rulebooks differ and the terms constrain what a third party may do.`
      ),
      table(
        ['Question', 'Why it decides the purchase'],
        [
          ['Does the plan permit third-party trading?', 'If not, a pass can be refused or a payout withheld'],
          ['Does the prohibition cover the funded account too?', 'Permission for the evaluation is not permission after the pass'],
          ['Who holds the login during the work?', 'Determines identity and control of the account'],
          ['What happens if the account breaches?', 'A retry policy is the only part of the price that matters when things go wrong'],
          ['Is any share of funded profit taken?', 'Separates a service from an investment arrangement'],
        ]
      ),
      p(
        `The practical test is documentation. Before paying anything, ask for the clause that permits the arrangement on the exact plan, and keep the reply with the dated terms page. A provider that answers with a guarantee rather than a clause has answered a different question. Guarantees cannot be enforced across a rulebook the provider does not control; written confirmations can be relied on in a dispute.`
      ),
      p(
        `There is also a compliance dimension after the pass. The funded account carries the same conduct rules as a self-traded one: no hedging across accounts, no prohibited news trading, no identity mismatch on the payout method. A pass obtained legitimately can still produce a withheld payout if the funded account is run outside those rules, which is why the handover matters as much as the work.`
      ),
      p(
        `Priced against the alternative, the flat fee is a bet on the number of attempts a rulebook would otherwise consume. If the honest expectation is one attempt, the fee is expensive. If it is three, the fee is cheaper than the fees plus the platform months. The useful discipline is to estimate that number from your own record before comparing prices, not after reading a sales page.`
      ),
    ]
  );
}

function verify(ctx) {
  const { sec, p, ol, table } = H();
  const f = ctx.firm;
  return sec(
    'verify',
    'A ten-minute check before any money changes hands',
    [
      p(
        `Rules change between cohorts, plan names rotate, and the page a comparison article quoted may no longer be the page the firm publishes. None of that is a reason to avoid a firm; it is a reason to verify the exact plan before paying. The check below is deliberately mechanical, because a mechanical check is one that gets done.`
      ),
      table(
        ['Check', 'Where it lives', 'What to record'],
        [
          ['Loss floor definition', 'terms page, not the sales page', 'balance or equity, static or trailing'],
          ['Daily stop definition', 'terms page', 'percentage, reset time and timezone'],
          ['Minimum days', 'plan page', 'count and what qualifies as a day'],
          ['Consistency condition', 'funded/payout terms', 'threshold and whether it applies to the evaluation'],
          ['Payout terms', 'funded terms', 'first payout date, minimum, cycle, fees'],
          ['Prohibited conduct', 'terms page', 'news, hedging, copying, EAs, sharing'],
          ['Refund and retry policy', 'terms page', 'what is refunded and when'],
        ]
      ),
      p(
        `Save the pages. A dated copy of the terms as published on the day of purchase is the only document that settles an argument about which version applied. Screenshots are sufficient; a PDF export is better because it preserves the date and the URL. This takes two minutes and is the single most useful habit in this market.`
      ),
      p(
        `Ask one question in writing that the pages do not answer. For ${f.name} a good candidate is whether the loss floor is calculated on equity including open positions or on closed balance. The reply is specific, comparable between firms and impossible to spin. If support cannot answer a mechanics question, that is information about the operational depth of the firm before the fee rather than after it.`
      ),
      p(
        `Finally, check the plan name against the rulebook you planned for. Multi-plan firms publish several products under one brand, and the search result for the brand will mix them. Two pages from the same firm can describe different drawdown mechanics and both be accurate, because they describe different plans.`
      ),
    ]
  );
}

function checklist(ctx) {
  const { sec, p, ul, table } = H();
  const f = ctx.firm;
  return sec(
    'checklist',
    `The pre-purchase list for a ${f.name} plan`,
    [
      p(
        `This list is designed to be answered yes or no. It is not a judgement about the firm's quality; a good firm can be the wrong counterparty for a particular method, and the list is intended to surface fit before the fee is paid rather than after.`
      ),
      ul([
        `The plan name on the checkout page is the one whose rulebook I have read.`,
        `I know whether the loss floor is measured on balance or equity.`,
        `I know the daily stop, if any, and the timezone in which it resets.`,
        `The minimum trading day requirement is compatible with the number of sessions my method needs.`,
        `I know whether a consistency condition applies to the evaluation, the funded account, or both.`,
        `I know what the first payout requires and how long it takes to arrive.`,
        `News trading, weekend holding, hedging, copy trading, EAs and account sharing are each explicitly allowed or prohibited on my plan.`,
        `The retry and refund policy is written down and I have a copy.`,
        `The platform supports the order types my method relies on.`,
        `My expected total cost across attempts is affordable without touching risk capital.`,
        `If a service will trade the account, the terms permit it on this exact plan.`,
        `I have dated copies of the terms pages I relied on.`,
      ]),
      p(
        `The items that fail most often are the consistency condition, the weekend restriction and the retry policy, in that order. Each is published, none is on the sales page, and all three can change the value of a funded account substantially. Reading them before payment converts a surprise into a price input.`
      ),
      p(
        `Two items deserve a second pass because they interact. The minimum trading day rule and the billing rhythm together determine the cost of a slow attempt: a subscription product with a long minimum is the most expensive combination, while a one-off fee with a long minimum is the cheapest. The payout rhythm and the consistency condition interact in the same way: a generous split with a strict concentration test can be worth less than a smaller split paid without one.`
      ),
      table(
        ['If you answer "no" to', 'Then'],
        [
          ['the loss-floor definition', 'you cannot size a single trade correctly — stop here'],
          ['the retry policy', 'assume a failed attempt costs full price'],
          ['the consistency clause', 'assume any single large day can be unpaid'],
          ['the terms check for a service', 'do not buy the service'],
        ]
      ),
    ]
  );
}

const payout = (ctx) => {
  const { sec, p, table, figure } = H();
  const f = ctx.firm;
  return sec(
    'payout',
    `What the payout terms are worth in the first year`,
    [
      p(
        `${f.name} pays out on this rhythm: ${f.payout}. The percentage of profit is the headline; the rhythm is the substance. A high split paid slowly is worth less than a lower split paid quickly when the money is needed, and a split with a condition attached is worth less than either until the condition is satisfied.`
      ),
      table(
        ['Term', 'Why it changes the value'],
        [
          ['Seasoning period', 'Delays the first cash and increases the time the floor applies'],
          ['Minimum withdrawal', 'A high minimum can push the first payout months into the future'],
          ['Consistency condition', 'Can reduce a profitable account to an unpaid one'],
          ['Payment cycle', 'Determines whether income is monthly or lumpy'],
          ['Processor fees', 'Proportionally largest on the smallest withdrawals'],
        ]
      ),
      p(
        `The right way to compare two firms is to model the first four months. Take an average monthly profit, apply the split, delay the first payment by the seasoning period, then apply the cycle and subtract fees. The result is a cash figure per firm rather than a percentage, and the ranking is often different from the marketing order.`
      ),
      figure(
        'payout-timeline.svg',
        'Timeline from the pass date through the seasoning period to the first and subsequent payouts',
        'The gap between passing and the first payout is set by the funded terms, not the evaluation.'
      ),
      p(
        `After the pass, the behaviour that protects the payout is the same behaviour that protected the evaluation: size to the remaining room, respect the daily stop, keep the funded account flat before restricted events. The difference is that the funded account is now the asset that produces income, so the cost of a breach is larger than the fee that created it.`
      ),
      p(
        `Take the first payout as soon as it is eligible rather than letting the balance grow. A completed withdrawal proves the entire chain — pass, verification, contract, payout — and produces the evidence base for a second account or a scaling application. An unwithdrawn balance is a claim; a payout statement is a record.`
      ),
    ]
  );
};

const consistency = (ctx) => {
  const { sec, p, table, figure } = H();
  return sec(
    'consistency',
    'Designing a profit distribution that passes the consistency test',
    [
      p(
        `A consistency rule is a constraint on shape rather than size: total profit is acceptable only if no single day contributes more than a stated share of it. The rule usually appears in the funded terms, is assessed when a payout is requested, and can turn a profitable month into a delayed one. Treat it as part of the sizing plan rather than as a payout formality.`
      ),
      table(
        ['Total profit', '40% single-day cap', 'Maximum one-day profit', 'Days needed at $800/day'],
        [
          ['$4,000', '40%', '$1,600', '5'],
          ['$6,000', '40%', '$2,400', '8'],
          ['$8,000', '40%', '$3,200', '10'],
          ['$10,000', '40%', '$4,000', '13'],
        ]
      ),
      p(
        `The table shows the mechanism: an oversized day does not fail the target, it raises the total that the rest of the month must reach before the concentrated day is compliant. A single $3,000 day against an $8,000 total requires $4,500 elsewhere before the cap is satisfied. In practice a trader then keeps trading after the target is reached, which is exactly when the loss floor is most dangerous.`
      ),
      figure(
        'consistency-rule.svg',
        'Bar chart comparing a concentrated profit distribution with a flat one under the same consistency cap',
        'The same total profit passes or fails depending on how it is distributed.'
      ),
      p(
        `The defence is a daily profit cap written into the plan: no session may produce more than the consistency threshold multiplied by the expected total. If the expected total is $8,000 and the cap is 40%, no day should exceed $3,200. When a trade is running into that territory, the answer is to take part of it and stop, not to let the remainder run on a larger position.`
      ),
      p(
        `Confirm where the rule applies. Some firms test consistency on the evaluation, some on the funded account, some on both. The distinction decides whether a concentrated pass fails outright or merely delays a payout, and it is stated in the terms. A written answer from support, kept with the dated terms page, is the only version worth relying on.`
      ),
    ]
  );
};

module.exports = {
  drawdown,
  sizing,
  mistakes,
  plan,
  cost,
  service: serviceVariant,
  verify,
  checklist,
  payout,
  consistency,
};
