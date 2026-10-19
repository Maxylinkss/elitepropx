'use strict';

module.exports = {
  '/blog/fundednext-vs-funding-pips-comparison.html': {
    sections: [
      {
        h2: 'Read the plan name before the brand',
        html: `<p>FundedNext and Funding Pips both sell forex evaluations with one-off billing, and both publish a two-phase structure that looks similar at the top of the page. The difference is inside the plan menu. Funding Pips describes a two-phase evaluation with a static loss floor measured from the initial balance. FundedNext sells one-step and two-phase models, and some one-step variants use a trailing floor. Two FundedNext traders can therefore be trading different loss mechanics under the same brand.</p>
<p>The practical check is to open the plan page, find the words static or trailing, and confirm whether the floor is measured from the starting balance or from peak equity. If the page says trailing, model the account as one where a winning trade reduces the room available for the next trade. If it says static, the original dollar distance stays available for the whole attempt.</p>`,
      },
      {
        h2: 'Where the one-step model changes the arithmetic',
        html: `<p>A one-step evaluation removes a phase but usually compresses the loss allowance. On a $100,000 account with a 6% floor instead of a 10% floor, the failure point is $94,000 rather than $90,000. A $500 risk unit has twelve losses of room instead of twenty, and a trailing variant reduces that room further after a gain. The shorter path is real, but it is bought with a smaller margin for error.</p>
<p>Funding Pips' two-phase static structure gives the trader the full floor for both phases, which is easier to size against but adds a second target and a longer calendar. A trader with a steady method may prefer the slower route because it does not require a size reduction after every new high. A trader with a short window may prefer the one-step model and accept the tighter floor.</p>
<p>Both firms bill once per attempt, so the fee does not grow with the calendar. The cost of a slow pass is the time itself, not another month of subscription. That makes the expected number of attempts the main cost variable, and the tighter floor of a one-step model can increase that number.</p>`,
      },
      {
        h2: 'The operational differences that remain',
        html: `<p>Platform access is similar, with MT4, MT5 and cTrader available at both firms. Payouts are released on a fixed cycle after the first withdrawal at both, and the consistency condition varies by plan at FundedNext while Funding Pips usually applies none on the evaluation. A trader who relies on a few large days should confirm the payout condition before choosing the cheaper plan.</p>
<p>If the two are close on price, choose the plan whose floor you can describe from memory. A static floor is easier to hold in your head during a session; a trailing floor requires you to track the high-water mark. The rule you can follow under pressure is worth more than a slightly lower fee.</p>`,
      },
    ],
    faq: [
      {
        q: 'Does FundedNext use a static or trailing floor?',
        a: 'It depends on the model. The two-phase model is commonly described as static, while some one-step variants use a trailing floor. The plan page, not the brand page, is the definition.',
      },
      {
        q: "Is the Funding Pips evaluation always static?",
        a: 'The two-phase product is described as a static floor measured from the initial balance. Confirm the exact plan at checkout, because firms can change terms between cohorts.',
      },
      {
        q: 'Which is better for a small account?',
        a: 'The one-step model can be cheaper in time, but its tighter floor leaves less room for a normal losing streak. A small account should usually prioritize the floor size over the speed of the path.',
      },
    ],
  },

  '/blog/fundednext-vs-e8-markets-comparison.html': {
    sections: [
      {
        h2: 'One menu, two plan generations',
        html: `<p>FundedNext and E8 Markets both sell one-step and two-phase forex evaluations, and both present a static floor on their standard plans. The comparison turns on the variants: FundedNext's one-step model can use a trailing floor, while E8's standard plans are usually static. A trader who compares the cheapest one-step price at both firms may be comparing a trailing product with a static one, which is not a like-for-like comparison.</p>
<p>The platform list is also slightly different. Both offer MT4, MT5 and cTrader, and E8 adds Match-Trader. A trader who uses Match-Trader has a concrete reason to pick E8; a trader who does not should treat the platform row as neutral and compare the floor and payout terms instead.</p>`,
      },
      {
        h2: 'The cost of choosing speed',
        html: `<p>On a $100,000 account, a 10% static floor leaves $10,000 of room. A 6% one-step floor leaves $6,000. At a $500 risk unit, the difference is eight losses of room: twenty on the two-phase plan against twelve on the faster plan. If the one-step variant also trails, a $1,000 gain lifts the floor and reduces the room to $5,000 from the original balance, which is ten losses at the same size.</p>
<p>The fee does not change with the calendar at either firm because both bill once per attempt. That means the faster plan is not automatically cheaper across a year: a tighter floor can cause more retries, and each retry costs a full fee. A trader who expects two attempts on the fast plan and one on the slow plan should compare two fees against one, not the headline prices.</p>
<p>Payouts are on a fixed cycle after the first withdrawal at both firms. The consistency condition is often absent on the evaluation at E8 and varies by model at FundedNext, so a trader with an uneven distribution should read the payout terms before deciding.</p>`,
      },
      {
        h2: 'Which trader fits which menu',
        html: `<p>FundedNext fits a trader who wants to choose between a one-step and a two-phase structure and is willing to read the model name carefully. E8 Markets fits a trader who wants a static floor on most plans and values the extra Match-Trader option. A trader who needs a static floor should avoid any one-step variant described as trailing, regardless of the brand.</p>
<p>If both offer the same static two-phase structure at a similar price, the decision comes down to operational details: payout review time, support response, and whether the platform you use is supported natively. Those are the parts of the product you will use after the pass.</p>`,
      },
    ],
    faq: [
      {
        q: 'Are FundedNext and E8 Markets the same product?',
        a: 'No. Both sell one-step and two-phase forex evaluations, but the plan menus differ and some FundedNext one-step variants use a trailing floor. The plan name decides the mechanics.',
      },
      {
        q: 'Which firm offers Match-Trader?',
        a: 'E8 Markets lists Match-Trader alongside MT4, MT5 and cTrader. FundedNext lists MT4, MT5 and cTrader. Platform access is a practical tie-breaker if you already use one of them.',
      },
      {
        q: 'Does a one-step plan always cost less overall?',
        a: 'Not necessarily. The one-step fee is lower in time, but a tighter floor can cause more retries, and each retry is a full fee. Compare the expected total across attempts.',
      },
    ],
  },

  '/blog/fundednext-vs-ftuk-comparison.html': {
    sections: [
      {
        h2: 'Forex and futures are not interchangeable',
        html: `<p>FundedNext evaluates forex and CFD accounts; FTUK evaluates futures. The first filter is therefore the market and the session, not the fee. FundedNext traders work weekday forex hours on MT4, MT5 or cTrader. FTUK traders work the US futures session on Tradovate, TradingView or NinjaTrader. A trader who cannot be at the screen during US hours should not buy the futures product, however attractive the one-off price looks.</p>
<p>The loss mechanics differ as well. FundedNext's two-phase model uses a static floor, while some one-step variants trail. FTUK uses a trailing threshold on peak equity. A static floor keeps the original dollar distance available; a trailing floor reduces it after every new high. That difference changes position size more than the headline target does.</p>`,
      },
      {
        h2: 'A $100,000 account under each rule',
        html: `<p>Take a $100,000 account with a 10% static floor and a $3,000 trailing threshold. On the static account, a $500 risk unit has twenty losses of room for the whole attempt. On the trailing account, the same $500 unit has six losses of room at the start, and fewer after a gain. A trader who carries the forex size onto the futures account is taking more than three times the risk relative to the floor.</p>
<p>The correct futures size is derived from the remaining room. If the floor is $2,000 below current equity, a $250 risk unit gives eight losses, which is a reasonable buffer. The size must be recalculated after every new equity high, not set once at the start.</p>
<p>Both firms bill once per attempt on the plans compared here, so the entry fee does not grow with the calendar. That makes the trailing mechanic the main driver of retry cost: a tighter floor produces more failed attempts, and each attempt is a full fee.</p>`,
      },
      {
        h2: 'The trader each product fits',
        html: `<p>FundedNext fits a forex trader who wants a static two-phase option, a familiar platform and a one-off fee. FTUK fits a futures trader who wants a one-off purchase instead of a monthly subscription and can trade the US session. A trader who wants both markets can use both, but should keep separate size tables and separate journals; the same strategy rarely transfers without adjustment.</p>
<p>If the decision is close, choose the market you can trade in your available hours. A rulebook you understand but cannot execute is worse than one you have to learn in a market that fits your day.</p>`,
      },
    ],
    faq: [
      {
        q: 'Is FTUK a forex firm?',
        a: 'No. FTUK evaluates futures accounts on a US session. FundedNext evaluates forex and CFD accounts on weekday forex hours. The market difference comes before the fee comparison.',
      },
      {
        q: 'Does FundedNext have a trailing floor?',
        a: 'The two-phase model is commonly static, while some one-step variants trail. Confirm the plan name and the floor definition on the plan page before buying.',
      },
      {
        q: 'Which is cheaper for a slow pass?',
        a: 'Both charge once per attempt on the plans compared here, so the calendar does not add fees. The total cost depends on the number of retries, which the trailing floor can increase.',
      },
    ],
  },

  '/blog/ftmo-vs-trade-the-pool-comparison.html': {
    sections: [
      {
        h2: 'Forex hours against the US equity session',
        html: `<p>FTMO evaluates forex and CFD accounts on weekday forex hours; Trade The Pool evaluates equity day-trading accounts on the US cash session. The instruments, the platform stack and the kind of news that moves price are different. A forex trader who has never handled an equity halt or a single-stock gap should not treat the equity product as a cheaper version of the same job.</p>
<p>The loss mechanics are different too. FTMO uses a static percentage floor measured from the starting balance and a separate equity daily stop. Trade The Pool typically uses a hard dollar loss limit with a daily stop and a profit target. The static floor is easier to size against because it does not move with profit; the fixed dollar limit is also stable, but the daily stop and equity-specific gaps change how a session behaves.</p>`,
      },
      {
        h2: 'Sizing on a $50,000 account',
        html: `<p>On a $50,000 FTMO account with a 10% maximum loss, the floor is $45,000 and a 5% daily stop is $2,500. A $250 risk unit has ten losses of room to the daily stop and twenty to the total floor. On a $50,000 equity account with a $2,500 fixed loss limit, the same $250 unit also has ten losses of room, but a single halt or gap can consume more than one unit at once. That is why the daily stop matters more on the equity side.</p>
<p>The profit target adds another difference. A percentage target on a forex account is a fixed dollar distance from the starting balance; an equity target may be measured differently and may interact with the daily stop. Read the target definition, not just the percentage, before calculating how many winning trades the plan needs.</p>
<p>Billing also differs: FTMO charges once per attempt, while Trade The Pool charges a monthly subscription. A slow pass on the equity product carries a calendar cost that the forex product does not.</p>`,
      },
      {
        h2: 'Which market belongs in your week',
        html: `<p>FTMO fits a forex trader who wants a static floor, a conventional two-phase path and a wide platform choice. Trade The Pool fits an equity day trader who already understands the cash session and wants a fixed loss limit. A trader with no equity experience should start elsewhere; the evaluation fee is the smallest cost of learning a new market under a deadline.</p>
<p>If you trade both markets already, compare the rulebooks on the row that would end your last attempt. For most traders that is the daily stop, not the headline target.</p>`,
      },
    ],
    faq: [
      {
        q: 'Can I trade forex on Trade The Pool?',
        a: 'No. Trade The Pool evaluates equity day-trading accounts. Forex pairs are not part of that product, and the session and platform stack are built around US equities.',
      },
      {
        q: 'Does FTMO have a daily loss limit?',
        a: 'Yes. FTMO applies an equity-based daily loss limit in addition to the static maximum loss. The daily limit can end a session before the total floor is reached.',
      },
      {
        q: 'Which product charges monthly?',
        a: 'Trade The Pool charges a monthly subscription on the product compared here. FTMO charges once per attempt, so a slow pass does not add monthly fees.',
      },
    ],
  },

  '/blog/topstep-vs-tradify-comparison.html': {
    sections: [
      {
        h2: 'Two futures rulebooks with different daily controls',
        html: `<p>Topstep and Tradify both evaluate futures accounts on a monthly subscription and a trailing threshold, so the headline rows look alike. The difference is the daily control. Topstep applies a per-session dollar stop and a minimum session count, and its payout stage considers the best day. Tradify combines a trailing floor with a session stop and a simpler qualifying-day path. For a trader who has one bad session, the daily stop is the rule that decides whether the account survives the week.</p>
<p>Topstep's best-day expectation is the row most traders miss. A payout can be reduced if one day produced an outsized share of the profit, even when the account passed cleanly. Tradify's payout conditions are different, so a trader with a lumpy distribution should compare the payout rules before the platform list.</p>`,
      },
      {
        h2: 'A $50,000 Combine with a $2,000 red day',
        html: `<p>On a $50,000 account with a $2,000 daily stop, a single session that reaches the stop ends trading for the day. The trailing floor may still be $2,500 away, but the daily rule binds first. That is a feature for a trader who struggles to stop and a constraint for a trader whose method needs a wide intraday range.</p>
<p>The trailing floor then interacts with the next session. If the account made $1,000 the day before, the floor has moved up, so the remaining room is smaller than it was at the start. A trader who keeps the same size after a good day is taking more risk relative to the floor, not less. Recalculate the size from the remaining room before the next session.</p>
<p>Both firms charge monthly, so a slow pass pays for calendar time. A trader who expects to take two months should add two subscription payments to the cost, not just the first one.</p>`,
      },
      {
        h2: 'Which platform and rulebook fit',
        html: `<p>Topstep fits a futures trader who wants a proprietary platform, a clear educational path and a hard daily stop. Tradify fits a trader who wants TradingView execution and a simpler qualifying-day structure. A trader who relies on TradingView should check that the order routing is supported end to end, not just that the chart loads.</p>
<p>If both rulebooks fit, choose on the payout condition that would affect your distribution. A trader with one or two large days should prefer the firm whose payout rule does not penalize that pattern. A trader with a steady daily result can treat the payout rule as neutral and choose on platform and price.</p>`,
      },
    ],
    faq: [
      {
        q: 'Does Topstep have a daily loss limit?',
        a: 'Yes. Topstep applies a per-session dollar stop in addition to the trailing threshold. The daily stop can end a session before the trailing floor is reached.',
      },
      {
        q: 'What is a best-day expectation?',
        a: 'It is a payout condition that limits how much of the profit can come from a single day. A profitable account with one outsized day can still see a reduced payout if the rule applies.',
      },
      {
        q: 'Which firm supports TradingView?',
        a: 'Tradify lists TradingView among its platforms. Topstep uses TopstepX and also supports NinjaTrader, Tradovate and Rithmic, but the platform list should be confirmed for the exact plan.',
      },
    ],
  },

  '/blog/ftmo-vs-earn2trade-comparison.html': {
    sections: [
      {
        h2: 'A forex percentage rulebook against a futures programme',
        html: `<p>FTMO evaluates forex and CFD accounts with a static percentage loss floor and an equity daily stop. Earn2Trade evaluates futures accounts with a programme that includes structured education and an end-of-day trailing threshold on most offers. The market difference decides the session and the platform; the trailing mechanic decides how position size changes after a winning day.</p>
<p>The education bundle is the second difference. Part of the Earn2Trade fee buys a course, whether or not the trader needs it. FTMO sells the evaluation and the platform access, with no curriculum attached. For a beginner, the course can be the reason to choose Earn2Trade; for an experienced trader, it is a cost with no corresponding benefit.</p>`,
      },
      {
        h2: 'A $100,000 attempt and a held winner',
        html: `<p>On a $100,000 FTMO account with a 10% floor, the failure point is $90,000 and stays there. A $500 risk unit has twenty losses of room. On a $100,000 Earn2Trade account with a $3,000 end-of-day trailing threshold, the same $500 unit has six losses of room at the start. A $1,000 winner held through the session does not move the Earn2Trade floor until the close; at a firm with an intraday trail, it would.</p>
<p>That distinction is the main reason a futures trader might prefer the end-of-day version. The floor still moves after a profitable close, so the size must be recalculated the next morning. A trader who sets size once and forgets it will gradually take more risk relative to the remaining cushion.</p>
<p>Billing differs as well: FTMO charges once per attempt; Earn2Trade charges once per programme. A slow pass on the futures side does not add a monthly subscription, but the programme price includes the course.</p>`,
      },
      {
        h2: 'The trader each product fits',
        html: `<p>FTMO fits a forex trader who wants a conventional static rulebook, a wide platform list and no course attached. Earn2Trade fits a beginner who wants a futures evaluation with instruction and an end-of-day trailing rule. An experienced futures trader who already has a method may find the course redundant and prefer a product that sells only the evaluation.</p>
<p>If you are choosing between the two as a first evaluation, start with the market you can trade in your available hours. The rulebook is easier to learn than a new session and a new instrument set.</p>`,
      },
    ],
    faq: [
      {
        q: "Is the Earn2Trade trailing threshold intraday or end-of-day?",
        a: 'Most Earn2Trade programmes use an end-of-day trailing threshold, so open profit does not move the floor until the session closes. Confirm the exact programme before relying on that behaviour.',
      },
      {
        q: 'Does FTMO include education?',
        a: 'The evaluation does not bundle a structured course. FTMO publishes extensive documentation, but it is not the same product as a paid curriculum.',
      },
      {
        q: 'Which one is cheaper for a slow pass?',
        a: 'FTMO charges once per attempt and Earn2Trade charges once per programme on most offers, so neither adds a monthly fee. The total depends on the number of attempts and what the programme bundle includes.',
      },
    ],
  },
};
