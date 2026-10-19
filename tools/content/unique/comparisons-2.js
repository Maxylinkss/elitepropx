'use strict';

module.exports = {
  '/blog/apex-vs-bulenox-comparison.html': {
    sections: [
      {
        h2: 'Trailing floors, different billing pressure',
        html: `<p>Apex and Bulenox both evaluate futures on a threshold that follows peak equity, so the row that decides an attempt is not the headline target but the moment the floor starts moving. At Apex the threshold includes open profit, which means an unrealised winner raises the failure point before the trade is closed. Bulenox uses a trailing threshold as well, but the attached rule set changes with the promotional plan, so the first thing to confirm is which plan generation the checkout page is selling.</p>
<p>The billing difference is larger than it looks. Apex charges a monthly subscription per account, so a pass that takes ten weeks pays for roughly three months. Bulenox sells some plans as a one-off and others as a subscription depending on the promotion. Two traders can compare the same sticker price and end up with different total costs simply because one bought during a promotion and the other did not.</p>`,
      },
      {
        h2: 'A $50,000 futures attempt, line by line',
        html: `<p>On a $50,000 account with a $2,500 trailing threshold, the failure point starts at $47,500. A $1,000 winning trade lifts the floor to $48,500 once the profit is counted, so the room below the new high is still $2,500 but the room from the original balance is only $1,500. A normal retracement that gives back $1,600 now ends the account even though the trader is still profitable on the day.</p>
<p>That arithmetic is why size has to fall after a good run. A trader risking $250 per trade has ten losses of room at the start; after a $1,000 gain the same $250 risk has six losses of room from the new floor. Cutting to $150 restores a reasonable buffer. Bulenox's trailing rule behaves the same way; the only reliable difference is the plan terms attached to the promotion, which can include a daily stop on some offers and not on others.</p>
<p>Add the subscription cost before comparing the two. At Apex, three months of billing is part of the cost of a slow pass. At Bulenox, a one-off promotion can be cheaper for a slow pass and more expensive if the trader needs a reset. Neither structure is universally cheaper; the expected number of attempts decides.</p>`,
      },
      {
        h2: 'Which futures trader belongs on which platform',
        html: `<p>Apex suits a trader who wants a large account ladder, a familiar monthly subscription and a rulebook that is widely documented. Bulenox suits a cost-sensitive trader who is willing to read each promotion's terms and accept that the plan attached to a discount may not be the standard one. A trader who needs a daily stop should verify it plan by plan at Bulenox rather than assuming it is included.</p>
<p>Platform access is nearly identical, so it should not decide the choice. Both firms work with Tradovate, Rithmic and NinjaTrader, and both run on US futures session hours. The real decision is whether the trader can live with a floor that moves and a billing rhythm that charges for calendar time. A trader who needs a fixed failure point should be looking at a static forex evaluation instead of either of these futures products.</p>`,
      },
    ],
    faq: [
      {
        q: 'Does Apex include open profit in its trailing threshold?',
        a: 'Yes. The threshold is measured from peak equity including open profit, so an unrealised gain can raise the failure point before the trade is closed. A retracement after that can end the account even if the closed balance never reached the new high.',
      },
      {
        q: 'Is Bulenox always cheaper than Apex?',
        a: 'No. Bulenox runs frequent promotions, and some plans are one-off while others are subscriptions. A promotional price can be cheaper for one attempt, but the attached rules and reset terms decide the total cost across retries.',
      },
      {
        q: 'Which firm has a daily stop?',
        a: 'Bulenox includes a daily stop on some plans; Apex does not apply a separate daily stop on its standard evaluation. Confirm the exact plan before buying, because both firms sell more than one generation of terms.',
      },
    ],
  },

  '/blog/ftmo-vs-audacity-capital-comparison.html': {
    sections: [
      {
        h2: 'A checkout challenge against a reviewed allocation',
        html: `<p>FTMO is a self-serve evaluation: you buy a plan, trade two phases and a verification phase, and the rulebook is the same for every buyer on that plan. Audacity Capital is closer to a capital allocation programme, with an application and a review before trading starts. That difference changes the calendar before it changes the risk: a trader comparing the two is not comparing two checkouts but a checkout and an interview.</p>
<p>The loss allowance is expressed differently as well. FTMO publishes a percentage floor measured from the starting balance, which makes the dollar figure easy to calculate at any account size. Audacity's programme usually states a fixed dollar loss allowance, which is simpler to read but harder to compare across account sizes. Convert both to dollars before deciding which one gives more room.</p>`,
      },
      {
        h2: 'What the fixed allowance does to position size',
        html: `<p>Suppose FTMO's $100,000 plan carries a 10% maximum loss and a 5% daily stop. The total floor is $90,000 and the daily limit is $5,000. At a 0.5% risk unit of $500, the day can absorb ten losses before the daily stop, but the total floor can absorb twenty. The daily rule binds first on a bad day, and the total rule binds first on a bad month.</p>
<p>A fixed dollar allowance of, say, $10,000 on a $100,000 allocation produces the same starting arithmetic, but the absence of a percentage formula means the number does not change when the balance changes. That is easier to plan around, and it is also less forgiving of a trader who sizes as a percentage of current equity: after a drawdown the percentage method risks less in dollars, which slows recovery, while the fixed allowance still permits the original size.</p>
<p>Audacity's programme also carries a minimum trading period, so a fast, high-conviction pass may not be accepted on the original timeline. FTMO's verification phase has a similar effect on the calendar but not on the loss allowance. Neither is a reason to avoid the firm; both are reasons to map the calendar before paying.</p>`,
      },
      {
        h2: 'Which route fits which trader',
        html: `<p>FTMO fits a trader who wants a conventional, documented rulebook, a self-serve dashboard and the widest platform choice. Audacity fits an experienced forex trader who prefers a reviewed allocation and a fixed dollar loss allowance to a percentage challenge, and who is willing to wait for approval before the first trade. A beginner should generally start with the self-serve product because the review process adds a variable that has nothing to do with trading skill.</p>
<p>If the goal is to reach a funded account as quickly as possible, FTMO's documented process is easier to schedule. If the goal is a longer relationship with a fixed risk budget, Audacity's structure is closer to what a proprietary desk actually offers. The mistake is treating the two as interchangeable because both appear in the same comparison tables.</p>`,
      },
    ],
    faq: [
      {
        q: 'Is Audacity Capital a standard prop firm challenge?',
        a: 'Not in the checkout sense. It runs a reviewed capital allocation programme with an application stage, a fixed loss allowance and programme-specific terms, so it should be compared with other allocation programmes rather than with a self-serve evaluation.',
      },
      {
        q: 'Does FTMO use a trailing or static loss floor?',
        a: 'FTMO uses a static maximum loss measured from the starting balance. Profit does not move the failure point, which makes the dollar risk easier to calculate for the whole attempt.',
      },
      {
        q: 'Which one is better for a beginner?',
        a: 'FTMO is usually the easier first product because the rulebook is public, the process is self-serve and the platform choice is wider. Audacity suits traders who already have a record and prefer a reviewed allocation.',
      },
    ],
  },

  '/blog/ftmo-vs-take-profit-trader-comparison.html': {
    sections: [
      {
        h2: 'Two markets, two completely different loss mechanics',
        html: `<p>FTMO evaluates forex and CFD accounts on a percentage rulebook with a static maximum loss. Take Profit Trader evaluates futures accounts on a trailing threshold with a payout-focused rule set. The market difference comes before every other row: forex sessions are weekdays and can be traded from a laptop, while futures sessions follow the US clock and often require a data feed and a platform built for futures.</p>
<p>The loss mechanic is the second filter. FTMO's static floor stays at the starting level, so a winning trade does not make the failure point closer. Take Profit Trader's trailing floor follows peak equity, which means a profitable run reduces the room available for a normal retracement. A trader who has only traded static forex evaluations will find the futures rule more demanding even if the headline target looks similar.</p>`,
      },
      {
        h2: 'The same trade on two different accounts',
        html: `<p>Take a $400 risk unit on a $100,000 account. At FTMO, the maximum loss is $10,000, so the account can absorb twenty-five losing trades before the floor is reached. At Take Profit Trader, a $3,000 trailing threshold gives seven losing trades of room at the same size, and the number falls after every new equity high. A trader who uses the FTMO size on the futures account will breach long before the target.</p>
<p>The correct size on the trailing account is derived from the remaining room, not the original threshold. If the floor is $2,100 below the current equity after a good run, a 0.5% risk of $500 has only four losses of room. Cutting to $250 restores eight. That adjustment is the whole skill of trading a trailing product, and it is the reason the two accounts cannot share one position-size table.</p>
<p>Billing adds a second difference: FTMO charges once per attempt, while Take Profit Trader charges a monthly subscription. A slow pass on the futures side pays for calendar time; a slow pass on the forex side does not. Add the expected number of months to the cost comparison before deciding which is cheaper.</p>`,
      },
      {
        h2: 'The trader each rulebook actually fits',
        html: `<p>FTMO fits a forex trader who wants a static floor, a conventional two-phase path and a platform list that includes MT4, MT5, cTrader and DXtrade. Take Profit Trader fits a futures trader who can trade the US session, understands that the floor follows equity, and wants a payout-focused rulebook with a monthly billing rhythm. A trader who cannot watch the US session should not buy the futures product regardless of its advertised pass rate.</p>
<p>Do not choose based on the profit split. The split applies to a payout that only exists if the account survives, and the account survives only if the loss mechanic matches the strategy. For most traders, the market and the session are the deciding rows, not the percentage printed beside the payout.</p>`,
      },
    ],
    faq: [
      {
        q: 'Can a forex strategy be used on Take Profit Trader?',
        a: 'The product evaluates futures accounts, so the instruments, session hours and contract specifications are different from spot forex. A strategy built around forex sessions and pip values needs to be re-tested on futures before it is used on the evaluation.',
      },
      {
        q: 'Does FTMO move its loss floor after a winning trade?',
        a: 'No. FTMO uses a static maximum loss measured from the starting balance. A winning trade changes the balance but not the failure point, so the distance to the floor increases.',
      },
      {
        q: 'Why does the trailing floor matter more on a futures account?',
        a: 'Futures contracts have a fixed dollar value per point, so position size translates directly into dollars of risk. A trailing floor that follows open profit can be reached by a normal retracement even when the closed balance is still positive.',
      },
    ],
  },

  '/blog/apex-vs-earn2trade-comparison.html': {
    sections: [
      {
        h2: 'An intraday trail against an end-of-day trail',
        html: `<p>Both firms evaluate futures accounts, but the trailing mechanic is not the same. Apex measures its threshold from peak equity including open profit, so an unrealised winner can raise the floor during the session. Earn2Trade uses an end-of-day trailing threshold on most programmes, which means open profit does not move the floor until the session closes. For a trader who holds a winner through the day, the end-of-day version is materially more forgiving.</p>
<p>The second difference is what comes bundled. Earn2Trade attaches a structured futures course to its programme, which is useful for a beginner and unnecessary for a trader who already has a tested method. Apex sells the evaluation and the platform access; education is not part of the product. That changes the value calculation: part of the Earn2Trade fee buys instruction, whether or not the buyer needs it.</p>`,
      },
      {
        h2: 'A $100,000 attempt with a $1,000 daily winner',
        html: `<p>Take a $100,000 account with a $3,000 trailing threshold and a $1,000 winning trade held open. At Apex, the floor rises toward $98,000 while the trade is open, leaving a smaller cushion for a retracement. At Earn2Trade, the floor stays at $97,000 until the session closes; if the trade is closed at $1,000, the floor then adjusts to the new end-of-day balance. The difference is not cosmetic: a $900 retracement that would end the Apex account is survivable on the end-of-day rule.</p>
<p>Position sizing has to follow the mechanic. On the Apex account, a $300 risk unit has ten losses of room at the start but fewer after a run. On the Earn2Trade account, the same $300 unit has ten losses of room against a floor that only moves once a day. A trader who uses one size on both accounts is not running the same strategy, even if the entry signals are identical.</p>
<p>The billing difference is smaller than the mechanic difference. Apex charges monthly per account; Earn2Trade charges once per programme. A fast pass favours the one-off, a slow pass favours neither automatically because the monthly cost depends on the number of months and the one-off includes the course.</p>`,
      },
      {
        h2: 'Who should pick which',
        html: `<p>Apex fits a self-directed futures trader who wants a large account ladder, a monthly subscription and a rulebook that rewards discipline over activity. Earn2Trade fits a beginner who wants a course alongside the evaluation and prefers an end-of-day trailing rule that does not punish an open winner. An experienced trader who already has a method may resent paying for the course; a beginner who buys Apex may underestimate how much the trailing rule demands.</p>
<p>Whichever is chosen, confirm the exact programme name before comparing prices. Both firms sell more than one generation of terms, and the trailing mechanic can differ between a standard programme and a promotional one.</p>`,
      },
    ],
    faq: [
      {
        q: 'Is Earn2Trade easier than Apex because it uses end-of-day trailing?',
        a: 'It is more forgiving for a trader who holds winners through the session, because open profit does not move the floor until the close. It is not automatically easier overall: the programme rules, minimum days and payout conditions still apply.',
      },
      {
        q: 'Does the Earn2Trade fee include a course?',
        a: 'Yes, the programme bundles structured futures education. That is part of what the fee buys, so an experienced trader should compare the evaluation-only value rather than the full price.',
      },
      {
        q: 'Which firm charges monthly?',
        a: 'Apex charges a monthly subscription per account. Earn2Trade charges once per programme on most offers. A slow pass therefore has a different cost profile on each.',
      },
    ],
  },

  '/blog/apex-vs-the5ers-comparison.html': {
    sections: [
      {
        h2: 'Futures against forex is the first decision',
        html: `<p>Apex evaluates futures; The5ers evaluates forex. That single row decides the session, the instrument list, the platform and the way a loss limit is expressed. Apex traders work the US futures session on Rithmic, Tradovate or NinjaTrader, with a threshold that follows peak equity. The5ers traders work weekday forex hours on MT5, with a static floor on most programmes. Comparing the two on target size before filtering for market is not a comparison at all.</p>
<p>The5ers also runs a menu of programmes rather than a single challenge. The cheapest entry point is usually a lower-balance programme with a tighter loss limit, while the higher-stakes programmes behave more like a conventional evaluation. Any comparison has to name the programme, because two traders can both say they are on The5ers and be trading different rulebooks.</p>`,
      },
      {
        h2: 'How the two floors change the size calculation',
        html: `<p>On a $100,000 forex account with a static 10% floor, the failure point is $90,000 and stays there. A $500 risk unit has twenty losses of room for the whole attempt. On a $100,000 futures account with a $3,000 trailing threshold, the same $500 risk has six losses of room at the start, and fewer after a new equity high. The futures account is not more dangerous because futures are volatile; it is more dangerous because the floor moves.</p>
<p>The correct response is not to avoid futures but to size the futures account off the trailing distance. If the remaining room is $2,000, a $250 risk unit gives eight losses, which is a workable buffer for a short attempt. A trader who carries a forex-sized 1% risk onto the futures account is taking four times the intended risk relative to the floor.</p>
<p>Billing reinforces the difference. Apex charges monthly, so the cost grows with the calendar. The5ers charges once per programme on most offers, so a slow pass does not add fees. A trader who expects to take two months should compare the total, not the first payment.</p>`,
      },
      {
        h2: 'The trader each one fits',
        html: `<p>Apex fits a futures trader who can watch the US session, wants a large account ladder and accepts a trailing threshold. The5ers fits a forex trader who wants a static floor, a low-cost first programme and a straightforward MT5 setup. A trader who splits time between markets can use both, but should not use the same position-size table for both.</p>
<p>If the decision is close, choose on the market you can actually trade in your available hours. A rulebook you understand but cannot trade is worse than a rulebook you have to learn in a market that fits your day.</p>`,
      },
    ],
    faq: [
      {
        q: 'Are Apex and The5ers comparable at all?',
        a: 'They are comparable only after filtering for market. Apex evaluates futures and The5ers evaluates forex, so the session, platforms and loss mechanics differ before any target or fee comparison.',
      },
      {
        q: 'Which one has a static loss floor?',
        a: 'The5ers uses a static floor on most programmes. Apex uses a trailing threshold measured from peak equity, so the failure point moves as the account earns.',
      },
      {
        q: 'Does The5ers have more than one rulebook?',
        a: 'Yes. It sells several programmes with different balances, loss limits and consistency conditions. Comparisons should name the programme rather than the brand.',
      },
    ],
  },

  '/blog/apex-vs-trade-the-pool-comparison.html': {
    sections: [
      {
        h2: 'Futures and equities are different day jobs',
        html: `<p>Apex evaluates futures accounts; Trade The Pool evaluates equity day-trading accounts. The instruments, the sessions and the settlement mechanics are different, and so is the skill a trader needs. A futures trader watches the US futures session and manages contracts with a fixed dollar value per point. An equity trader watches the US cash session, handles halts and overnight gaps differently, and uses a platform stack built around equities.</p>
<p>That difference is more important than the headline account size. A trader who has never traded equities should not buy an equity evaluation because the fee looks lower; the learning curve is part of the cost. The same is true in reverse: an equity trader moving to futures has to learn contract specifications and a session that starts before the cash open.</p>`,
      },
      {
        h2: 'The loss mechanics behind the two products',
        html: `<p>Apex uses a trailing threshold measured from peak equity including open profit. Trade The Pool uses a firm-specific loss limit, typically a hard dollar limit, with a profit target and a daily stop. The Apex floor moves with the account; the Trade The Pool limit is closer to a fixed wall. For a trader who likes to hold a winner, the fixed limit is easier to plan around; for a trader who takes profits quickly, the trailing rule may never bind.</p>
<p>Position sizing follows the same logic as the floor. On a $50,000 futures account with a $2,500 trailing threshold, a $250 risk unit has ten losses of room at the start and fewer after a gain. On an equity account with a fixed $2,500 loss limit, the same $250 unit keeps ten losses of room until the balance changes. The fixed limit is simpler; the trailing limit demands a size reduction after every new high.</p>
<p>The daily stop matters more on the equity product because equity halts and opening gaps can create a single large loss. A daily limit caps that risk; a futures evaluation without a daily stop relies on the trader to stop. Know which protection the plan actually provides.</p>`,
      },
      {
        h2: 'Which market fits your week',
        html: `<p>Apex fits a futures trader who can be at the screen for the US session and wants a subscription-based ladder. Trade The Pool fits an equity day trader who already understands the cash session, halts and the platform stack, and who prefers a fixed loss limit to a trailing one. A trader with no equity experience should not start with an equity evaluation; the fee is the smallest cost of that mistake.</p>
<p>Both firms charge monthly on the products compared here, so a slow pass carries a calendar cost. That makes the expected time to pass part of the price, not a separate consideration.</p>`,
      },
    ],
    faq: [
      {
        q: 'Can I use a futures strategy on Trade The Pool?',
        a: 'No. Trade The Pool evaluates equity day-trading accounts, so the instruments, session and execution mechanics are different. A futures strategy needs to be rebuilt and tested for equities before it is used on that evaluation.',
      },
      {
        q: 'Does Apex have a daily stop?',
        a: 'The standard Apex evaluation does not apply a separate daily stop. The trailing threshold is the primary loss control, which is why position sizing and a self-imposed session limit matter.',
      },
      {
        q: 'Which product has a fixed loss limit?',
        a: 'Trade The Pool typically uses a hard dollar loss limit, while Apex uses a trailing threshold. The fixed limit is easier to size against; the trailing limit requires reducing size after gains.',
      },
    ],
  },
};
