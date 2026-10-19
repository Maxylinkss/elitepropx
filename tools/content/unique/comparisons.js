'use strict';

/**
 * Unique copy for the GSC-indexed comparison pages.
 * Each entry supplies sections that exist only on that URL, so the page can
 * stand on its own without borrowing the shared template prose.
 */

module.exports = {
  '/blog/ftmo-vs-funded-trader-tft-comparison.html': {
    sections: [
      {
        h2: 'The verification phase changes the calendar, not the risk',
        html: `<p>FTMO's sequence is two evaluation phases followed by a verification phase, while Funded Trader (TFT) runs a two-phase evaluation with a static floor. The extra stage matters less for the loss limit than for the clock: a trader who finishes phase two in three weeks can still spend another month proving the result before a funded account exists. Budget for that month in the plan, because a strategy that needs a fast payout is a different product from one that can wait.</p>
<p>TFT's static floor stays at the same dollar level through both phases. That is the easier of the two structures to size against, because the distance from the current balance to the failure point does not shrink when the account earns. FTMO's floor also stays fixed, so neither firm punishes a winner by moving the failure point closer. The practical difference is the verification stage and the consistency condition that TFT applies.</p>`,
      },
      {
        h2: 'A $100,000 attempt under both rulebooks',
        html: `<p>On a $100,000 account with a 10% maximum loss, both firms put the failure point at $90,000. A 5% equity daily stop caps a session at $5,000, and a 0.5% risk unit is $500. Ten consecutive losses at that size reach the daily stop before they reach the total floor, so the daily rule is the one that ends most bad sessions. A trader who risks 1% per trade reaches the daily limit in five losses and the total floor in ten; the second number is irrelevant if the first one arrives first.</p>
<p>The target is a separate distance. If phase one requires 10%, the account needs $10,000 of profit. At a $500 risk unit and a 2:1 reward-to-risk plan, a winning trade contributes $1,000, so ten net winners are needed; at 1:1 the count doubles. TFT's consistency condition can then affect the payout even after the target is met, so the correct comparison is not pass speed but pass speed plus the documentation the payout stage will demand.</p>
<p>Neither calculation includes the cost of a retry. FTMO and TFT both bill once per attempt, so a second attempt doubles the cash cost without changing the risk arithmetic. That is why the fee should be compared across expected attempts, not at the checkout page.</p>`,
      },
      {
        h2: 'Which trader should pick which',
        html: `<p>Pick FTMO when platform choice matters and the plan can absorb a verification stage: the MT4, MT5, cTrader and DXtrade coverage is wider, the evaluation has no consistency rule, and the payout rhythm is documented in more places than almost any other firm's. Pick TFT when the trader wants a static floor and a conventional two-phase path, and can produce a consistent trade record at payout. A trader whose results depend on two or three oversized days is a poor fit for TFT's consistency condition even if the pass itself is easy.</p>
<p>If both rulebooks fit, decide on the operational details that appear after the pass: how the payout request is reviewed, how long the first payment takes, and whether support answers a question about a specific clause in writing. Those answers are worth more than another percentage point of profit split, because a split only applies to money that actually leaves the account.</p>`,
      },
    ],
    faq: [
      {
        q: 'Is Funded Trader (TFT) stricter than FTMO because it has a consistency rule?',
        a: 'It is stricter at the payout stage, not necessarily during the evaluation. FTMO has no consistency rule on the evaluation, while TFT applies one. A trader with a steady distribution may find TFT easier than expected; a trader with one outsized winner may pass and still struggle to withdraw.',
      },
      {
        q: 'Do both firms use a static maximum loss?',
        a: 'Yes. FTMO measures its floor from the starting balance, and TFT uses a static floor as well. Profit does not move either failure point, which makes both easier to size against than a trailing threshold.',
      },
      {
        q: 'Which firm is cheaper for a slow pass?',
        a: 'Both bill once per attempt, so the entry fee does not grow with the calendar. Ancillary costs such as a VPS or platform subscription can still differ, and those should be added before comparing the totals.',
      },
    ],
  },
};
