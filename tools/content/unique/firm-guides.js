'use strict';

module.exports = {
  '/blog/lucid-trading-challenge-passing.html': {
    sections: [
      {
        h2: 'The trailing floor is the plan',
        html: `<p>Lucid Trading evaluates futures on a trailing threshold. The rule that ends most attempts is not the profit target but the high-water mark: a winning trade lifts the failure point, and a normal retracement can then close the account before the target is reached. Before buying, write down the starting threshold, the current equity high and the dollar distance between them. That distance, not the account size, is the risk budget for the session.</p>
<p>The correct size is a fraction of the remaining room. If the cushion is $2,000 and the plan is to risk $250 per trade, the account can absorb eight losses. If the cushion is $800, the same size allows three, which is too few for a normal distribution. Cut the size when the cushion shrinks and accept that the last third of the target is traded smaller than the first third.</p>`,
      },
      {
        h2: 'A five-week schedule for a Lucid attempt',
        html: `<p>Week one is for measurement, not for a pass: take the same setups you would take on a demo, but record the remaining room before every entry. Week two is for calibration: compare intended risk with realised risk and cut any setup whose stop distance forces a size the plan cannot support. Week three is for the first push toward the target, with size fixed at the calibrated unit. Week four is for protecting the cushion after a gain, even if that means smaller positions. Week five is for the final push, with a hard rule that no new high is given back by more than half.</p>
<p>The schedule assumes the plan has no minimum-day requirement that forces activity. If it does, fill the required sessions with the smallest permitted size and treat them as administration, not as opportunities. A required session is not a reason to take a trade that the setup does not justify.</p>`,
      },
      {
        h2: 'What to verify before paying',
        html: `<p>Confirm the exact trailing definition: does the threshold follow closed balance or peak equity including open profit? Confirm whether a daily stop applies, because a session stop changes the worst-case day. Confirm the payout qualification, including the number of qualifying days and whether a consistency test applies. Finally, confirm the platform and data-feed costs, because a monthly subscription plus a data fee is the real monthly cost of a slow attempt.</p>
<p>If any of those answers is unclear, ask support in writing before buying. A reply you can save is worth more than a comparison table written by someone who is not carrying the risk.</p>`,
      },
    ],
    faq: [
      {
        q: 'Does Lucid Trading use a trailing drawdown?',
        a: 'Yes. The evaluation uses a trailing threshold, so the failure point follows the equity high. The room available for a retracement shrinks after a profitable run.',
      },
      {
        q: 'Does Lucid have a daily stop?',
        a: 'The plan includes a daily stop. Confirm the exact reset time and whether it is measured on balance or equity before relying on it.',
      },
      {
        q: 'How long should a Lucid attempt take?',
        a: 'There is no single answer, but a five-week schedule that separates measurement, calibration and the final push is more realistic than trying to pass in a week. Minimum-day rules and the trailing floor both shape the calendar.',
      },
    ],
  },

  '/blog/tradify-challenge-passing.html': {
    sections: [
      {
        h2: 'A daily stop changes the failure mode',
        html: `<p>Tradify combines a trailing threshold with a session stop. The daily stop is the rule that ends a bad day; the trailing floor is the rule that ends a bad sequence. A trader who understands only one of them will mis-size the account. On a session where the daily stop is $1,500 and the normal risk unit is $300, the day can absorb five losses. That is the effective limit for the session, regardless of how much total room remains.</p>
<p>The trailing floor then decides the next session. If the account made $900 yesterday, the floor has moved up and the room from the original balance is smaller. The size that was appropriate at the start may now be too large relative to the cushion. Recalculate the remaining room each morning and divide by the risk unit before the first trade.</p>`,
      },
      {
        h2: 'The order of operations for a Tradify attempt',
        html: `<p>Start with the calendar: count the qualifying days the plan requires and map them against your availability. Then set the daily loss budget as the smaller of the plan's session stop and your own three-loss rule. Then set the per-trade risk so that five losses fit inside the daily budget. If the setup's stop distance forces a larger size than that, skip the trade; the plan is not asking you to take every valid setup, only to survive the ones you take.</p>
<p>During the attempt, record the remaining room and the daily loss used before each entry. After the session, update the high-water mark. A trader who can state both numbers from memory is far less likely to breach one by accident. The journal is not a diary; it is the risk dashboard the plan needs.</p>`,
      },
      {
        h2: 'Which traders should avoid this product',
        html: `<p>A trader whose method needs a wide intraday range and frequent re-entries will find the session stop restrictive. A trader who cannot watch the US futures session should not buy a product built around it. A trader who has never traded a trailing threshold should paper-trade the rule for two weeks before paying, because the difference between a static and a trailing floor is larger than most marketing pages admit.</p>
<p>If the rulebook fits, Tradify's combination of a session stop and a trailing floor is a coherent product: the daily stop caps the damage, and the trailing floor forces discipline after a gain. The trader's job is to respect both, not to find a way around either.</p>`,
      },
    ],
    faq: [
      {
        q: 'Does Tradify have a trailing or static floor?',
        a: 'The evaluation uses a trailing floor with a session stop. The failure point follows the equity high, while the daily stop caps a single session.',
      },
      {
        q: 'How many trades can I take in a day?',
        a: 'The plan does not set a fixed trade count. The daily stop and your per-trade risk determine how many losses the session can absorb; size so that a normal losing streak fits inside the daily budget.',
      },
      {
        q: 'Which platforms does Tradify support?',
        a: 'Tradovate, TradingView and NinjaTrader are listed for the product compared here. Confirm the platform list for the exact plan before buying.',
      },
    ],
  },

  '/blog/funded-engineer-challenge-passing.html': {
    sections: [
      {
        h2: 'A static forex floor with a consistency condition',
        html: `<p>Funded Engineer runs a two-phase forex evaluation with a static floor and a consistency test. The static floor is the easier part: the dollar distance to failure does not move when the account earns, so a fixed risk unit stays valid for the whole attempt. The consistency test is the part that catches traders at the payout stage, because a pass built on one or two oversized days can satisfy the target and still fail the distribution check.</p>
<p>The practical response is to plan the profit distribution before the first trade. If the plan requires that no single day contributes more than a set share of the total, the target has to be reached through a series of normal days rather than one exceptional one. That changes the trade selection: a setup with a large expected payoff but a low hit rate is less useful than a smaller, repeatable edge.</p>`,
      },
      {
        h2: 'A $100,000 attempt with a 10% target',
        html: `<p>On a $100,000 account with a 10% target, the plan needs $10,000 of profit. If the consistency rule caps a single day at 25% of the total, no day can contribute more than $2,500 without risking the payout. At a $500 risk unit and a 2:1 plan, a normal winning day of two winners contributes $2,000, which fits. A single $4,000 day would breach the distribution even though it moves the balance closer to the target.</p>
<p>The static floor gives the trader room to build that distribution: a 10% maximum loss means twenty losses at $500, so the plan can absorb a normal losing streak without the failure point moving. The binding constraint is the calendar and the consistency rule, not the floor.</p>
<p>Billing is one-off per attempt, so a slower, more evenly distributed pass does not add fees. That is an advantage for a trader who needs time to build a consistent record.</p>`,
      },
      {
        h2: 'What to verify before buying',
        html: `<p>Confirm the consistency formula: is it a share of total profit, a share of the target, or a maximum day relative to the average? Confirm whether it applies to the evaluation, the funded account or only the payout. Confirm the daily stop and its reset time. Confirm the platform list and whether MT4 and MT5 are both available on the plan. Finally, confirm the payout cycle and the minimum withdrawal, because a pass that cannot be withdrawn is not a pass.</p>
<p>Ask for the clause in writing. A support reply that quotes the terms is the only version of the rule you can rely on later.</p>`,
      },
    ],
    faq: [
      {
        q: 'Does Funded Engineer use a static or trailing floor?',
        a: 'The evaluation described here uses a static floor. Profit does not move the failure point, which makes a fixed risk unit easier to maintain for the whole attempt.',
      },
      {
        q: 'What is the consistency test?',
        a: 'It limits how much of the profit can come from a single day or a small number of days. A pass built on one oversized winner can fail the test even when the target is met.',
      },
      {
        q: 'Which platforms are available?',
        a: 'MT4 and MT5 are listed for the product compared here. Confirm the platform list for the exact plan before buying.',
      },
    ],
  },

  '/blog/e8-markets-challenge-passing.html': {
    sections: [
      {
        h2: 'One-step and two-phase plans are different products',
        html: `<p>E8 Markets sells one-step and two-phase forex evaluations, with a static floor on most plans and a percentage daily stop. The two structures are not the same product with a shorter queue. A one-step plan removes a phase but usually compresses the loss allowance; a two-phase plan adds a second target but gives more room. Before comparing prices, decide which structure your method can actually trade.</p>
<p>The static floor makes the sizing simpler than a trailing product: the dollar distance to failure stays fixed, so a 0.5% risk unit remains 0.5% of the starting balance for the whole attempt. The daily stop is the variable that changes the worst-case day. On a 5% daily stop, a $100,000 account can lose $5,000 in a session; at a $500 risk unit, that is ten losses. The plan should never require the account to survive more than the daily stop in one session.</p>`,
      },
      {
        h2: 'Building a pass around the daily stop',
        html: `<p>Start with the daily stop, not the target. If the daily stop is $5,000 and the normal risk unit is $500, the session can absorb ten losses, which is more than a normal distribution needs. A trader who takes five losses in a day should stop regardless of the remaining allowance, because the next five losses would consume the entire session budget and leave no room for a recovery. A three-loss rule is often a better personal limit than the plan's maximum.</p>
<p>Then map the target. A 10% target on a $100,000 account needs $10,000. At a $500 unit and a 2:1 plan, a winning trade contributes $1,000, so ten net winners are needed. If the plan has a minimum-day requirement, spread those winners across the required sessions rather than trying to finish early. The calendar is part of the risk plan, not an obstacle to it.</p>`,
      },
      {
        h2: 'Platform and payout checks',
        html: `<p>E8 lists MT4, MT5, cTrader and Match-Trader. If you use Match-Trader, confirm that the plan supports it; if you use MT5, confirm that the account type matches your expert advisor or indicator setup. On the payout side, confirm the cycle, the minimum withdrawal and whether a consistency condition applies at the funded stage. A one-off fee makes a slow pass cheaper than a subscription, but it does not make a refused payout acceptable.</p>
<p>Read the one-step and two-phase terms side by side. The plan name is the rule; the brand is only the dashboard.</p>`,
      },
    ],
    faq: [
      {
        q: 'Are E8 Markets plans static?',
        a: 'Most plans use a static floor, but one-step and two-phase variants can differ. Confirm the exact plan page before comparing it with a trailing product.',
      },
      {
        q: 'Does E8 have a daily stop?',
        a: 'Yes, the plans described here use a percentage-based daily stop. The reset time and whether it is measured on balance or equity should be confirmed on the plan page.',
      },
      {
        q: 'Which platform should I use?',
        a: 'MT4, MT5, cTrader and Match-Trader are listed. Choose the platform your strategy is already tested on, and confirm the plan supports it before buying.',
      },
    ],
  },

  '/blog/funding-pips-challenge-passing.html': {
    sections: [
      {
        h2: 'The static floor is only half the plan',
        html: `<p>Funding Pips runs a two-phase forex evaluation with a static floor measured from the initial balance and a percentage daily stop. The static floor means the failure point does not move when the account earns, so a fixed risk unit remains valid across both phases. The daily stop is the rule that ends a bad session, and it is the number most traders under-plan for.</p>
<p>On a $100,000 account with a 10% floor and a 5% daily stop, the failure point is $90,000 and the session limit is $5,000. At a $500 risk unit, the account can absorb twenty losses in total but only ten in one day. A trader who takes ten losses in a day has used the entire daily allowance and cannot recover within the session; stopping earlier is the only sensible plan.</p>`,
      },
      {
        h2: 'A two-phase calendar that respects the daily stop',
        html: `<p>Phase one should be treated as a measurement phase. Take the setups your journal already supports, size at the calibrated unit, and stop at three losses or the daily stop, whichever comes first. The goal is to reach the target without ever touching the daily limit, not to reach it quickly. Phase two repeats the same process with the same size; a static floor does not require a size reduction after a gain, so the plan can stay stable.</p>
<p>If the plan has a minimum-day requirement, use the required sessions to observe and record rather than to force trades. A session with no valid setup is a successful session if it preserves the floor. The consistency condition, if one applies at payout, is easier to satisfy when the profit is built from a series of normal days.</p>`,
      },
      {
        h2: 'What to verify about the firm and the service',
        html: `<p>Before paying for an evaluation, confirm the daily stop reset time and whether it is measured on balance or equity. Confirm the maximum loss definition and whether it includes open profit. Confirm the payout cycle, minimum withdrawal and any consistency rule. If a passing service is involved, confirm that the firm permits third-party trading and that permission covers the funded account as well as the evaluation. A service that cannot produce that clause in writing is not a safe route.</p>
<p>Finally, confirm the platform: MT4, MT5 and cTrader are listed, but the account type should match the strategy's execution needs. A plan that fits on paper can still fail on a platform that cannot place the orders the method requires.</p>`,
      },
    ],
    faq: [
      {
        q: 'Does Funding Pips use a static drawdown?',
        a: 'The two-phase evaluation uses a static floor measured from the initial balance. Profit does not move the failure point, which makes a fixed risk unit easier to maintain.',
      },
      {
        q: 'Is there a daily loss limit?',
        a: 'Yes, the plan uses a percentage-based daily stop. Confirm the reset time and whether it is measured on balance or equity before relying on it.',
      },
      {
        q: 'Can a passing service trade a Funding Pips account?',
        a: 'Only if the firm terms permit third-party trading and that permission covers the work being done. Ask for the clause in writing before paying a service.',
      },
    ],
  },

  '/blog/audacity-capital-challenge-passing.html': {
    sections: [
      {
        h2: 'An allocation programme needs a different preparation',
        html: `<p>Audacity Capital is closer to a reviewed capital allocation than a self-serve challenge. The application stage means the preparation starts before the first trade: a track record, a defined method and a risk plan are part of what gets reviewed. A trader who arrives with only a strategy idea is less prepared than one who can show how the method behaved across a sample of trades and what the worst drawdown was.</p>
<p>The loss allowance is usually expressed as a fixed dollar figure rather than a percentage. That makes the risk arithmetic simple: divide the allowance by the number of losses the method normally takes in a bad streak. If the allowance is $10,000 and the method's worst streak is ten losses, the risk unit should be no more than $1,000, and a more conservative $500 leaves room for a streak twice as long as the sample.</p>`,
      },
      {
        h2: 'The plan for the first month',
        html: `<p>The first week is for confirming the platform and the reporting rhythm, not for pressing toward a target. The second week establishes the normal size and the daily loss budget. The third and fourth weeks are for building a record that a reviewer can read: entries, exits, risk per trade, remaining room and the reason for each decision. A programme that reviews performance is more interested in a repeatable process than in a single profitable month.</p>
<p>The minimum trading period means a fast, concentrated gain is not necessarily an advantage. A trader who makes the target in three days but cannot show a consistent process may be asked to trade longer. Budget for the period, and treat the first month as the application's evidence rather than a sprint.</p>`,
      },
      {
        h2: 'Questions to ask before applying',
        html: `<p>Ask how the loss allowance is measured, whether a daily stop applies, and what the minimum trading period requires. Ask whether the allocation can be scaled and what the conditions are. Ask how profits are split and when they are paid. Ask what happens if the account breaches: is there a reset, a new application, or neither? Those answers decide whether the programme is a fit before any trading begins.</p>
<p>A reviewed allocation is not for every trader. A self-serve evaluation is faster and more predictable; a programme is slower and more relational. Choose the structure that matches the way you actually work.</p>`,
      },
    ],
    faq: [
      {
        q: 'Is Audacity Capital a self-serve challenge?',
        a: 'It is closer to a reviewed capital allocation programme. The application and review stage comes before trading, and the terms are programme-specific rather than a standard checkout plan.',
      },
      {
        q: 'How is the loss limit expressed?',
        a: 'Programmes often use a fixed dollar loss allowance rather than a percentage. That makes the risk arithmetic simple but means the dollar figure should be compared across account sizes.',
      },
      {
        q: 'Does Audacity require a minimum trading period?',
        a: 'Yes, the programme includes a minimum trading period. A fast, concentrated gain is not automatically the best evidence for a reviewed allocation.',
      },
    ],
  },
};
