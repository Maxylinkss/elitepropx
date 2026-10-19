'use strict';

module.exports = {
  '/blog/apex-trader-funding-first-payout-timeline.html': {
    sections: [
      {
        h2: 'From qualifying day to money in the bank',
        html: `<p>The first Apex payout is a sequence, not a button. The account has to reach the qualifying profit and the required number of trading days, then the payout request enters a review, then the payment is processed. Each stage has its own delay, and the total is what the trader should budget for. A plan that assumes cash arrives the day after the request is a plan that will be wrong by at least a week.</p>
<p>Start by counting the qualifying days on the plan you actually bought. The count is not the same as the number of days you logged in; a day usually has to meet a minimum activity or profit condition. Mark the qualifying days on a calendar as they happen, because reconstructing them from memory at payout time is how a request gets rejected for a clerical reason.</p>`,
      },
      {
        h2: 'Building a payout buffer before the request',
        html: `<p>The request is not the end of the risk. The account continues to trade, and a breach after the request but before the payment can still affect the payout. Leave a buffer above the floor and above the target: if the plan requires a minimum balance after withdrawal, withdrawing the maximum can push the account below the next threshold or reset the qualifying period. Read the post-payout terms before deciding the amount.</p>
<p>A first payout should be treated as a proof of process, not as a payday. Take an amount that leaves the account comfortably above the floor, confirm the processor fee, and keep the statement. The second payout is where the rhythm becomes predictable; the first one is where the paperwork is learned.</p>`,
      },
      {
        h2: 'The three delays to plan for',
        html: `<p>There is a qualifying delay (the days before a request is allowed), a review delay (the time support takes to approve the request) and a processing delay (the time the payment provider takes to settle). The qualifying delay is in the plan terms, the review delay is operational, and the processing delay depends on the method. Ask support for the typical review and processing windows in writing, then add a margin.</p>
<p>If the payout is time-sensitive, choose the method with the shortest settlement and accept the fee. A cheaper method that takes a week longer is not cheaper if the money is needed sooner. The right choice depends on the purpose of the withdrawal, not on the fee table alone.</p>`,
      },
    ],
    faq: [
      {
        q: 'How long does the first Apex payout take?',
        a: 'It depends on three stages: qualifying days, request review and payment processing. The plan terms define the qualifying stage, while the review and processing windows are operational. Ask support for the current windows and add a margin.',
      },
      {
        q: 'Can I withdraw the full profit on the first payout?',
        a: 'The plan may require a minimum balance to remain after withdrawal. Read the post-payout terms before requesting the maximum, because a withdrawal that leaves the account too close to the floor can affect the next cycle.',
      },
      {
        q: 'Do I need to keep trading after the request?',
        a: 'The account remains subject to the rules until the payout is complete. Avoid taking risk that could breach the floor between the request and the payment.',
      },
    ],
  },

  '/blog/how-to-get-multiple-funded-accounts.html': {
    sections: [
      {
        h2: 'Multiple accounts are a risk decision, not a shortcut',
        html: `<p>Holding several funded accounts at one firm multiplies both the opportunity and the subscription cost. If each account carries a monthly fee, three accounts cost three fees whether or not they trade. Before adding a second account, calculate the total monthly cost against the expected payout from the first. An account that is not being traded is a subscription, not an asset.</p>
<p>The rules also multiply. Most firms restrict copy trading between accounts, cap the total capital allocated to one trader, or require that each account be traded independently. A trader who mirrors the same position across three accounts may be treated as one position for risk purposes, and some terms prohibit the practice outright. Read the account-sharing and copy-trading clauses before scaling.</p>`,
      },
      {
        h2: 'Correlation is the hidden limit',
        html: `<p>Three accounts trading the same setup at the same time are one bet with three fees. If the setup loses, all three lose together; if it wins, the gain is larger but the risk is not diversified. A portfolio of accounts is only useful when the strategies are genuinely different or when the accounts are traded at different times. Otherwise the second account adds cost without adding a second chance.</p>
<p>A practical structure is one core account traded at full size and one experimental account traded smaller with a different method. The core pays the bills; the experimental account tests a change without risking the main record. Two identical accounts are usually a way to pay twice for the same outcome.</p>`,
      },
      {
        h2: 'The operational cost of a second login',
        html: `<p>Each account needs its own journal, its own risk tracking and its own payout calendar. A trader who cannot keep one set of records accurate should not add a second. The failure mode is not a dramatic breach; it is a missed qualifying day, a duplicated trade or a payout request sent from the wrong account.</p>
<p>If the firm permits multiple accounts, ask whether the profit split or the payout terms change when the total allocation crosses a threshold. Some firms apply a different schedule at higher allocation levels. The answer should be in the terms, not in a support conversation you cannot reproduce.</p>`,
      },
    ],
    faq: [
      {
        q: 'Can I copy trades between my funded accounts?',
        a: 'Only if the firm permits it. Many firms restrict copy trading between accounts or treat mirrored positions as a single risk exposure. Check the copy-trading and account-sharing clauses before doing it.',
      },
      {
        q: 'Is more than one account always better?',
        a: 'No. Multiple accounts multiply subscription costs and operational work. They help when the strategies are genuinely different; identical accounts trading the same setup are one bet with several fees.',
      },
      {
        q: 'Do multiple accounts affect the payout terms?',
        a: 'Some firms apply a different schedule or cap at higher total allocation. Ask before scaling, and get the answer in writing.',
      },
    ],
  },

  '/blog/prop-firm-payout-times.html': {
    sections: [
      {
        h2: 'Why two payouts take different amounts of time',
        html: `<p>A payout time is the sum of the qualification window, the review window and the payment rail. The qualification window is in the plan terms and is usually expressed in trading days. The review window depends on the firm's operations and on whether the request is complete. The payment rail depends on the method: a bank transfer, a card processor and a crypto transfer settle on different schedules.</p>
<p>The first payout is usually the slowest because the firm verifies identity, trading history and the account's compliance with the rules. Later payouts are faster because the account is already known. A trader who plans around the first payout's delay will be pleasantly surprised by the second; a trader who plans around the marketing claim of instant payment will be disappointed by both.</p>`,
      },
      {
        h2: 'How to make a request easy to approve',
        html: `<p>Submit a complete request: verified identity, the correct account, the requested amount within the allowed range, and a statement that matches the account record. Incomplete requests are the main cause of avoidable delay. If the plan requires a minimum balance to remain, state the amount you are leaving behind. If the plan has a consistency condition, include the trade history that shows it is satisfied.</p>
<p>Keep a copy of the request and the support reply. If the payment is late, the copy is what turns a vague complaint into a specific query. The firm's obligation is defined by its terms, and the terms are easier to enforce when the request is documented.</p>`,
      },
      {
        h2: 'Choosing a payout method',
        html: `<p>The fastest method is not always the cheapest, and the cheapest is not always the most reliable. A bank transfer may have the lowest fee but the longest settlement; a card processor may be faster but charge a percentage; a crypto transfer may be fast but introduces price risk between the request and the conversion. Choose the method that matches the purpose of the money and the amount being withdrawn.</p>
<p>For a first payout, prioritize reliability over speed. The goal is to complete the process once and learn the firm's rhythm. After that, optimize the fee for the amounts you actually withdraw.</p>`,
      },
    ],
    faq: [
      {
        q: 'Why is the first payout slower than later ones?',
        a: 'The first request usually includes identity and trading-history verification that later requests do not repeat. The account becomes known to the firm after the first successful payout.',
      },
      {
        q: 'What causes a payout request to be delayed?',
        a: 'Incomplete documentation, a mismatch between the requested amount and the account terms, an unresolved consistency condition, or a payment method that takes longer to settle. A complete request with a saved copy is easier to approve.',
      },
      {
        q: 'Which payout method is fastest?',
        a: 'It depends on the firm and the rail. Crypto and card processors are often faster than bank transfers, but fees and conversion risk differ. Choose reliability first for the initial payout.',
      },
    ],
  },

  '/blog/prop-firm-ea-automated-trading.html': {
    sections: [
      {
        h2: 'The rule is firm-specific, not universal',
        html: `<p>Some prop firms allow expert advisors, some prohibit them, and some allow them only on certain account types. The rule is usually in the prohibited-conduct section of the terms, not on the sales page. Before attaching an EA to an evaluation, search the terms for the words automated, algorithmic, expert advisor and latency. If the clause is ambiguous, ask support for a written answer that names your EA type.</p>
<p>Even where an EA is allowed, the strategy still has to respect the loss rules. An EA that opens positions without a hard stop can breach a daily loss limit faster than a manual trader because it does not hesitate. The evaluation is not a test of whether automation is permitted; it is a test of whether the automated method survives the rulebook.</p>`,
      },
      {
        h2: 'Execution risks that only appear on a prop account',
        html: `<p>A prop account adds constraints that a personal account does not have: a maximum loss that ends the account, a daily stop that can halt trading, and a server that may be shared with other users. An EA that performs well on a demo can fail on a prop account because of slippage during news, a wider spread at the session open, or a latency spike that delays the stop. The strategy needs to be tested on the same platform and data feed the firm provides.</p>
<p>Run the EA on a demo with the firm's server settings, including the same leverage and contract specifications. Compare the realized slippage with the backtest assumption. If the difference is large, the live evaluation will be worse than the backtest regardless of the win rate.</p>`,
      },
      {
        h2: 'Documentation before deployment',
        html: `<p>Write down what the EA does, which instruments it trades, the maximum risk per trade, the conditions under which it stops, and how it handles a news event. Keep the version of the code that produced the record. If the firm asks how a trade was generated, the documentation is the answer. An EA without a written specification is a black box that is hard to defend in a dispute.</p>
<p>If the firm prohibits automation, do not try to disguise it. The consequence is usually a breached account and a lost fee, not a warning. The rule exists because the firm is pricing a human trader's risk, and an automated strategy can change that risk in ways the terms do not allow.</p>`,
      },
    ],
    faq: [
      {
        q: 'Are EAs allowed on prop firm accounts?',
        a: 'It depends on the firm and the account type. Some allow them, some prohibit them, and some restrict certain strategies. Check the prohibited-conduct section and get a written answer before deploying.',
      },
      {
        q: 'Can I run an EA on a VPS?',
        a: 'Only if the firm permits it and the VPS meets the platform requirements. A VPS does not change the trading rules, but it can change latency and execution quality.',
      },
      {
        q: 'What happens if an EA breaches a rule?',
        a: 'The account is usually closed or the payout is refused, even if the breach was unintentional. The firm applies the terms to the account, not to the intent behind the order.',
      },
    ],
  },

  '/blog/prop-firm-minimum-trading-days.html': {
    sections: [
      {
        h2: 'What counts as a trading day',
        html: `<p>A minimum trading day is not simply a day on which you opened the platform. The plan usually requires at least one closed trade, a minimum profit or loss, or a minimum holding time. Some firms count a day only if the account has a position at the close. The definition is in the plan terms, and it is the first thing to confirm before planning a calendar.</p>
<p>If the requirement is five days, a trader who finishes the target in two days still has to produce three more qualifying days. The temptation is to force trades to fill the calendar. That is the wrong response: a minimum day can be satisfied with the smallest permitted position and a trade that meets the definition, while the risk budget stays untouched.</p>`,
      },
      {
        h2: 'Filling days without adding risk',
        html: `<p>Use the smallest size the plan allows and a setup with a tight stop. The goal is a qualifying closed trade, not a profit. If the plan permits a break-even trade, a position opened and closed at the same price may satisfy the activity requirement; if it does not, take a small risk with a predefined stop and accept the outcome. The cost of filling a day should be a few dollars plus commission, not a meaningful share of the loss budget.</p>
<p>Do not save the required days for the end of the attempt. If a day is missed because of a platform outage or a public holiday, the calendar extends. Build the days into the first half of the plan, when the account has the most room and the pressure is lowest.</p>`,
      },
      {
        h2: 'The interaction with the target and the floor',
        html: `<p>Minimum days change the pacing, not the risk. A plan with a 10% target and a five-day minimum is not a five-day sprint; it is a target that has to be reached without breaching the floor over at least five days. If the target is reached early, the remaining days should be traded at minimum size or not traded at all, depending on the activity definition. The account should not be put at risk to satisfy a calendar rule.</p>
<p>Confirm whether the minimum applies to the evaluation only or also to the funded account. Some firms require a minimum number of days before a payout, which is a separate condition from the evaluation minimum.</p>`,
      },
    ],
    faq: [
      {
        q: 'Does logging in count as a trading day?',
        a: 'Usually not. The plan typically requires a closed trade or a position held at the close. Check the exact definition in the plan terms.',
      },
      {
        q: 'Can I fill a minimum day with a tiny trade?',
        a: 'If the plan allows it, yes. The goal is to meet the activity definition without risking a meaningful part of the loss budget. Use the smallest permitted size and a predefined stop.',
      },
      {
        q: 'Does the minimum apply after the pass?',
        a: 'Some firms require a minimum number of trading days before a payout, separate from the evaluation minimum. Confirm both conditions before planning the calendar.',
      },
    ],
  },

  '/blog/prop-firm-news-trading-rules.html': {
    sections: [
      {
        h2: 'The window is the rule',
        html: `<p>News trading restrictions are usually time-based: a window before and after a scheduled release during which new positions are prohibited or existing positions must be closed. The window can be five minutes, fifteen minutes or longer, and it can apply to all instruments or only to the one affected by the release. The first step is to find the exact window and the list of covered events in the plan terms.</p>
<p>A restriction on opening a position is not the same as a restriction on holding one. Some firms allow a position to remain open through the release but prohibit opening or increasing it inside the window. Others require the position to be flat before the event. The difference decides whether a swing trader can hold overnight or has to close before every major release.</p>`,
      },
      {
        h2: 'The gap risk the rule is trying to price',
        html: `<p>A news release can move price through a stop with no trading in between. The firm's loss limit is based on the account, not on the order, so a gap that jumps past the stop can produce a loss larger than the planned risk. That is why the rule exists: it limits the firm's exposure to an event it cannot hedge. A trader who ignores the rule is not just breaking a term; they are taking a risk the plan did not price.</p>
<p>The practical response is to reduce size before a scheduled event and to avoid holding a position that depends on a stop being filled at a specific price. If the strategy needs news exposure, use a smaller size and a wider stop, and confirm that the plan allows the position to be held at all.</p>`,
      },
      {
        h2: 'Building a news calendar into the plan',
        html: `<p>Mark the red-folder events for the instruments you trade at the start of each week. For each event, decide whether the plan requires flat, allows holding, or prohibits new entries. Then set the session plan around that decision: no new entries in the window, a smaller size before the event, or a full stop for the day. Write the decision down before the event, because the moment the release prints is not the moment to interpret a rule.</p>
<p>If the rule is ambiguous, ask support before the trade, not after. A written answer is the only thing that will help in a dispute, and it is easier to get before the account is at risk.</p>`,
      },
    ],
    faq: [
      {
        q: 'Does the news rule apply to all instruments?',
        a: 'It depends on the firm. Some restrict only the instrument affected by the release, while others apply the window to all positions. Check the plan terms for the covered events and instruments.',
      },
      {
        q: 'Can I hold a position through a news event?',
        a: 'Only if the plan permits it. Some firms require the account to be flat before the event, while others prohibit new entries but allow an existing position to remain.',
      },
      {
        q: 'What happens if a gap jumps past my stop during news?',
        a: 'The fill can be worse than the stop price, and the loss can exceed the planned risk. That is why the rule exists and why size should be reduced before a scheduled event.',
      },
    ],
  },
};
