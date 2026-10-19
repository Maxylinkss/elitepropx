'use strict';

module.exports = {
  '/blog/ftmo-vs-ftuk-comparison.html': {
    sections: [
      {
        h2: 'The market row decides everything after it',
        html: `<p>FTMO evaluates forex and CFD accounts on weekday forex hours; FTUK evaluates futures on the US session. The instruments, the platform stack and the way a loss is measured are different, so a like-for-like comparison starts with the question of which market the trader can actually work. A forex trader who cannot be at the screen during US hours should not buy the futures product, and a futures trader who needs a data feed should not assume the forex platform list applies.</p>
<p>FTMO uses a static percentage floor measured from the starting balance and an equity daily stop. FTUK uses a trailing threshold on peak equity with a daily stop on most plans. The static floor keeps the original dollar distance available for the whole attempt; the trailing floor reduces it after every new high. That is the row that changes position size.</p>`,
      },
      {
        h2: 'A $100,000 account on each rulebook',
        html: `<p>On the FTMO account, a 10% floor puts the failure point at $90,000, and a $500 risk unit has twenty losses of room. On the FTUK account, a $3,000 trailing threshold gives six losses at the same size. After a $1,000 gain, the FTUK floor moves up and the room from the original balance falls to $2,000, or four losses at $500. Reducing to $250 restores eight.</p>
<p>The target math is separate. A 10% target on the forex account needs $10,000; a futures target expressed in dollars or points needs to be converted at the contract's value per point. A trader who compares the two targets without converting them is comparing a currency amount with a distance on a chart.</p>
<p>Both firms bill once per attempt on the plans compared here, so the calendar does not add fees. The trailing floor is the main driver of retries, and each retry is a full fee.</p>`,
      },
      {
        h2: 'Who should choose which',
        html: `<p>FTMO fits a forex trader who wants a static floor, the widest platform list and a conventional verification path. FTUK fits a futures trader who wants a one-off purchase, TradingView access and a trailing-threshold challenge. A trader who values a fixed failure point should choose the forex product; a trader who values a one-off fee and can trade futures should choose FTUK.</p>
<p>If both markets are available to you, compare the size tables you would actually use. The account that lets you keep a normal risk unit without breaching on a retracement is the one that fits, regardless of which brand is cheaper at checkout.</p>`,
      },
    ],
    faq: [
      {
        q: 'Does FTUK evaluate forex accounts?',
        a: 'No. FTUK evaluates futures accounts on the US session. FTMO evaluates forex and CFD accounts on weekday forex hours.',
      },
      {
        q: 'Which firm uses a static loss floor?',
        a: 'FTMO uses a static maximum loss measured from the starting balance. FTUK uses a trailing threshold on peak equity, which reduces the room after a gain.',
      },
      {
        q: 'Which one charges monthly?',
        a: 'Neither on the plans compared here: both bill once per attempt. Confirm the exact plan at checkout, because promotional or newer plans can change the billing rhythm.',
      },
    ],
  },

  '/blog/apex-vs-e8-markets-comparison.html': {
    sections: [
      {
        h2: 'Futures trail, forex usually stays put',
        html: `<p>Apex evaluates futures with a threshold that follows peak equity including open profit. E8 Markets evaluates forex and CFD accounts, with a static floor on most plans and both one-step and two-phase structures. The market difference is prior to the price difference: a futures trader on Apex works the US session with contract specifications, while an E8 trader works weekday forex hours with lot-based sizing.</p>
<p>The loss mechanics reinforce the split. Apex's trailing floor changes after every new equity high, so the room available for a retracement shrinks as the account earns. E8's static floor stays at the initial distance on most plans, which makes the dollar risk easier to hold constant. A trader who has only used static forex evaluations often underestimates how much the Apex trail changes the last third of an attempt.</p>`,
      },
      {
        h2: 'The same $50,000, two different size tables',
        html: `<p>On a $50,000 Apex account with a $2,500 trailing threshold, a $250 risk unit has ten losses of room at the start. After a $1,000 gain, the floor rises and the room from the original balance falls to $1,500, or six losses at the same size. On a $50,000 E8 account with a 10% static floor, the failure point is $45,000 and a $250 unit keeps twenty losses of room for the whole attempt, even after a gain.</p>
<p>The correct Apex size after the gain is lower, not because the strategy changed but because the floor did. A trader who keeps the original size is gradually increasing risk relative to the remaining cushion. On the static account, the size can stay constant, which is one reason static forex evaluations are easier for a systematic trader to model.</p>
<p>Billing differs as well: Apex charges monthly per account, E8 charges once per attempt on most plans. A slow pass on Apex adds subscription cost; a slow pass on E8 does not.</p>`,
      },
      {
        h2: 'Which product fits',
        html: `<p>Apex fits a futures trader who can watch the US session and wants a large account ladder with a monthly subscription. E8 fits a forex trader who wants a static floor, a one-off fee and a choice between one-step and two-phase structures. A trader who cannot decide between markets should start with the one they have actually traded, because the rulebook is easier to learn than an unfamiliar session.</p>
<p>If you use both, keep separate journals and separate size tables. The fact that both accounts are called funded does not make the risk math the same.</p>`,
      },
    ],
    faq: [
      {
        q: 'Is E8 Markets a futures firm?',
        a: 'No. E8 Markets evaluates forex and CFD accounts. Apex evaluates futures. The market, session and instrument specifications are different.',
      },
      {
        q: 'Does Apex include open profit in the trailing threshold?',
        a: 'Yes. The threshold follows peak equity including open profit, so an unrealised winner can raise the floor during the session.',
      },
      {
        q: 'Which firm has a static floor?',
        a: 'E8 Markets uses a static floor on most plans. Confirm the exact plan, because one-step variants can differ between cohorts.',
      },
    ],
  },

  '/blog/ftmo-vs-fundednext-comparison-2026.html': {
    sections: [
      {
        h2: 'One conventional path against a plan menu',
        html: `<p>FTMO sells one documented path: two evaluation phases, a verification phase, a static percentage floor and an equity daily stop. FundedNext sells a menu of one-step and two-phase models, with static floors on the two-phase model and trailing floors on some one-step variants. The comparison is therefore not one rulebook against another but one rulebook against a family of them.</p>
<p>The practical consequence is that the FundedNext plan name is part of the rule. A trader who buys the cheapest one-step offer may be taking a trailing floor with a tighter allowance, while a trader on the two-phase model gets a static floor and a longer path. The fee can be the same across the brand; the risk is not.</p>`,
      },
      {
        h2: 'Sizing a $100,000 attempt',
        html: `<p>On FTMO's $100,000 plan with a 10% maximum loss, the floor is $90,000 and a 5% daily stop is $5,000. A $500 risk unit has ten losses of room to the daily stop and twenty to the total floor. On a FundedNext two-phase plan with a static floor of the same size, the arithmetic is the same. On a one-step variant with a 6% floor, the failure point is $94,000 and the same $500 unit has twelve losses of room; if the variant trails, a gain reduces that room further.</p>
<p>FTMO's verification phase adds calendar time but not risk. FundedNext's one-step model removes a phase but compresses the allowance. A trader who needs speed may prefer the one-step model; a trader who needs margin for error should take the two-phase plan or FTMO.</p>
<p>Both firms bill once per attempt, so the entry fee does not grow with the calendar. The cost of a slow pass is time, not another monthly payment.</p>`,
      },
      {
        h2: 'Which trader should pick which',
        html: `<p>FTMO fits a trader who wants one well-documented rulebook, the widest platform choice and a conventional verification path. FundedNext fits a trader who understands the difference between its models and wants to choose between speed and a softer floor. A trader who cannot state the floor definition of the plan they bought should not be comparing the two brands yet.</p>
<p>If the two-phase FundedNext plan and FTMO are close on price, choose on platform and payout operations. Both are static, both are one-off, and both require the trader to keep the risk unit stable. The brand is less important than the plan name and the payout rhythm.</p>`,
      },
    ],
    faq: [
      {
        q: "Is the FundedNext two-phase plan static?",
        a: 'The two-phase model is commonly described as static. Some one-step variants use a trailing floor, so the plan name has to be checked before comparing it with FTMO.',
      },
      {
        q: 'Does FTMO have a one-step plan?',
        a: "The standard FTMO path is two evaluation phases followed by a verification phase. It is not a one-step product, so a direct speed comparison with a FundedNext one-step plan is not like for like.",
      },
      {
        q: 'Which firm has a verification phase?',
        a: "FTMO includes a verification phase after the two evaluation phases. The FundedNext two-phase model does not use the same structure, and its one-step model removes a phase entirely.",
      },
    ],
  },

  '/blog/fundednext-vs-earn2trade-comparison.html': {
    sections: [
      {
        h2: 'Forex menus against a futures programme',
        html: `<p>FundedNext evaluates forex and CFD accounts with a choice of one-step and two-phase models. Earn2Trade evaluates futures accounts through a programme that bundles structured education and uses an end-of-day trailing threshold on most offers. The market and session decide the platform and the hours; the trailing mechanic decides how size changes after a profitable close.</p>
<p>The education bundle is the second difference. Part of the Earn2Trade fee buys a course, which is useful for a beginner and redundant for an experienced trader. FundedNext sells the evaluation and the plan terms, with no curriculum attached. A trader comparing the sticker prices without accounting for the bundle is not comparing the same product.</p>`,
      },
      {
        h2: 'How the floors change the plan',
        html: `<p>On a $100,000 FundedNext two-phase account with a static floor, a $500 risk unit has twenty losses of room if the floor is 10%. On a one-step variant with a 6% floor, the same unit has twelve. Earn2Trade's end-of-day trailing threshold behaves differently again: a $1,000 winner does not move the floor until the close, but it does move it after the close, so the next session starts with less room. A trader who sets size once and forgets it will gradually take more risk relative to the cushion.</p>
<p>The correct process is to recalculate the remaining room at the start of each session and divide by the planned risk unit. If the result is fewer than five losses, cut the size; if it is fewer than three, stop for the day. That rule works on any trailing account and is more useful than a fixed percentage table.</p>
<p>Billing differs: FundedNext charges once per attempt, Earn2Trade charges once per programme. Neither adds a monthly subscription on the offers compared here, so the calendar is not the main cost driver.</p>`,
      },
      {
        h2: 'Which trader fits which',
        html: `<p>FundedNext fits a forex trader who wants to choose between a one-step and a two-phase structure and is willing to read the plan name. Earn2Trade fits a beginner who wants a futures evaluation with a course and an end-of-day trailing rule. An experienced futures trader may prefer a product that sells only the evaluation; an experienced forex trader may prefer the static two-phase option.</p>
<p>If you are new to both markets, the course is a real advantage, but it does not replace screen time. Budget for practice on a demo before the evaluation starts.</p>`,
      },
    ],
    faq: [
      {
        q: 'Does Earn2Trade use an intraday trailing threshold?',
        a: 'Most programmes use an end-of-day trailing threshold, so open profit does not move the floor during the session. Confirm the exact programme before relying on that detail.',
      },
      {
        q: 'Are FundedNext plans all static?',
        a: 'No. The two-phase model is commonly static, while some one-step variants trail. The plan name is part of the rule.',
      },
      {
        q: 'Which firm includes a course?',
        a: 'Earn2Trade bundles structured futures education with its programme. FundedNext does not include a course in the evaluation.',
      },
    ],
  },

  '/blog/fundednext-vs-the5ers-comparison.html': {
    sections: [
      {
        h2: 'Two forex menus with different floor styles',
        html: `<p>FundedNext and The5ers both sell forex evaluations and both run a menu rather than a single plan. FundedNext's two-phase model is commonly static, while some one-step variants trail. The5ers uses a static floor on most programmes, with a menu that ranges from low-cost bootcamp-style entries to higher-stakes evaluations. The plan name is the rule at both firms, so a brand-level comparison is misleading.</p>
<p>The5ers' lower-balance programmes are the ones most often compared on price. A smaller account with a static floor can be a cheaper way to learn the mechanics, but fixed costs such as a VPS or data service take a larger share of the target. FundedNext's larger account menu gives more room for a strategy that needs a meaningful dollar risk unit.</p>`,
      },
      {
        h2: 'A $25,000 and a $100,000 comparison',
        html: `<p>On a $25,000 account with a 10% static floor, the failure point is $22,500 and a $125 risk unit has twenty losses of room. On a $100,000 account with the same percentage floor, a $500 unit has the same twenty losses of room but a much larger dollar target. The percentage arithmetic is identical; the fixed costs are not. A $30 monthly data fee is 0.12% of the $25,000 account and 0.03% of the $100,000 account, which is why small accounts need a cheaper cost stack.</p>
<p>If the FundedNext one-step variant trails, the size calculation changes. A $500 gain raises the floor and reduces the room from the original balance. The trader then has to cut size or accept a smaller buffer. On The5ers' static programme, the original room stays available, which is simpler for a trader who wants a fixed risk unit.</p>
<p>Both firms bill once per attempt or programme, so the entry fee does not grow with the calendar. The number of attempts is still the main cost variable.</p>`,
      },
      {
        h2: 'Which menu fits',
        html: `<p>FundedNext fits a forex trader who wants a choice between one-step and two-phase structures and a larger account ladder. The5ers fits a trader who wants a static floor, a low-cost first programme and a straightforward MT5 setup. A trader who needs the largest possible account should compare the top of each ladder; a trader learning the mechanics should compare the smallest.</p>
<p>If a plan is described as trailing, treat it as a different product from a static plan, even if the brand and the target are the same. The floor definition is the row that decides how the account is traded.</p>`,
      },
    ],
    faq: [
      {
        q: 'Are all The5ers programmes static?',
        a: 'Most programmes use a static floor, but the menu is large and the programme name matters. Confirm the floor definition on the specific programme page.',
      },
      {
        q: 'Does FundedNext offer a low-balance entry?',
        a: 'It offers several account sizes, but the exact ladder changes by model and cohort. Compare the plan page rather than a third-party list.',
      },
      {
        q: 'Which firm is better for a first evaluation?',
        a: "The low-cost The5ers programmes are often chosen for a first attempt because the entry price and static floor are easier to learn on. FundedNext is a better fit once the trader knows which model they want.",
      },
    ],
  },
};
