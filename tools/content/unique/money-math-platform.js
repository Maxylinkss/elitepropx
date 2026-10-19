'use strict';

module.exports = {
  '/blog/prop-firm-passing-service-cost-2026.html': {
    sections: [
      {
        h2: 'The 2026 cost stack, not the headline fee',
        html: `<p>A passing service quote is only one line of the cost stack. The full cost of reaching a first payout includes the service fee, the evaluation fee if the service does not cover it, any reset or retry charge, platform and data costs, and the time between payment and the funded account. A $220 service fee attached to a $500 evaluation and a $60 data feed is not a $220 route; it is a $780 route before the first withdrawal.</p>
<p>The 2026 difference is that more firms now charge monthly subscriptions and more services bundle retries. A bundled retry is valuable only if the service actually covers a second attempt without another fee. Ask what happens after a breach: is the retry included, discounted or charged in full? That answer changes the expected cost more than a small difference in the headline price.</p>`,
      },
      {
        h2: 'Cost per funded account across three routes',
        html: `<p>Route one is self-trading with one attempt. The cost is the evaluation fee plus platform costs for the attempt. Route two is self-trading with an expected three attempts. The cost is three fees plus three months of platform costs, minus any reset discount. Route three is a flat service with retries included. The cost is the service fee plus any evaluation fee not covered, and it does not grow with the number of attempts the service needs.</p>
<p>If the service fee is $220 and the evaluation is $100, route three costs $320 for a funded account. If the self-trading route takes three attempts at $100 plus $60 of platform costs, it costs $480 and three months. The service is cheaper in that example, but only because the expected attempt count is three. A trader who passes first time spends $160 and is better off self-trading. The honest comparison uses your own pass probability, not the industry average.</p>`,
      },
      {
        h2: 'What a 2026 quote should disclose',
        html: `<p>A quote should state the fee, what it covers, the retry policy, the expected timeline and the firms it applies to. It should also state the terms check: whether the firm permits third-party trading and whether the permission covers the funded account. A quote that omits the terms check is not a complete quote, because a refused payout can turn a cheap route into an expensive one.</p>
<p>Ask for the refund policy in writing. If the service cannot pass the evaluation, does it refund, retry or credit the fee? The answer should be in the terms, not in a chat message. A service that is confident in its process should be willing to put the policy on paper.</p>`,
      },
    ],
    faq: [
      {
        q: 'What does a passing service cost in 2026?',
        a: 'Flat fees are commonly quoted around a few hundred dollars, with $220 as the reference point on this site. The total route also includes any evaluation fee, data costs and the time to a funded account.',
      },
      {
        q: 'Are retries included in the fee?',
        a: 'It depends on the service. A bundled retry is valuable only if the terms say the second attempt is covered without another fee. Ask for the policy in writing.',
      },
      {
        q: 'Is a passing service cheaper than self-trading?',
        a: 'Only if your expected number of attempts is high enough. A trader who passes first time is usually cheaper self-trading; a trader who expects three attempts may find the flat fee cheaper.',
      },
    ],
  },

  '/blog/challenge-fees-vs-passing-service.html': {
    sections: [
      {
        h2: 'Compare expected cost, not sticker price',
        html: `<p>The evaluation fee is paid once per attempt, so the expected cost is the fee multiplied by the expected number of attempts. A $100 evaluation with a 40% pass probability has an expected cost of $250 before platform fees. A $220 passing service with a high completion rate has an expected cost of $220 plus any evaluation fee it does not cover. The comparison is not $100 against $220; it is the expected total against the expected total.</p>
<p>Time belongs in the same calculation. Three attempts over three months carry three months of platform costs, three months of waiting and three months in which the capital could be used elsewhere. A service that returns a funded account in two weeks is not just a different price; it is a different timeline. Put a dollar value on the time before deciding that the cheaper sticker is cheaper.</p>`,
      },
      {
        h2: 'What the service fee buys and does not buy',
        html: `<p>The fee buys the work of passing the evaluation under the firm's rules. It does not buy a guarantee, a funded account that ignores the terms, or a profit split. A legitimate service returns the account in the client's name and does not take a share of the funded profit. If the offer includes a profit split, it is a different product with a different risk profile.</p>
<p>The fee also does not remove the evaluation fee unless the service says it does. Some services include the evaluation cost in the quote; others ask the client to buy the evaluation. Read the scope before comparing the numbers. A quote that looks cheaper may simply exclude a cost that the other quote includes.</p>`,
      },
      {
        h2: 'The risk that no fee comparison captures',
        html: `<p>A passing service is only viable where the firm permits third-party trading. If the terms prohibit it, the account can be closed and the payout refused even if the evaluation was passed cleanly. That risk is not priced into either fee. Before choosing the service route, confirm the clause in writing and confirm that the permission covers the funded account, not just the evaluation.</p>
<p>If the clause is unclear, the self-trading route is the safer default. A flat fee is attractive, but it cannot compensate for a payout that never arrives.</p>`,
      },
    ],
    faq: [
      {
        q: 'Is a $220 service cheaper than a $100 challenge?',
        a: 'Not necessarily. The challenge fee is paid per attempt, so the expected cost depends on the pass probability. Compare the expected total, including platform costs and time, rather than the sticker prices.',
      },
      {
        q: 'Does the service fee include the evaluation fee?',
        a: 'It depends on the quote. Some services include the evaluation cost and others ask the client to buy it. Read the scope before comparing totals.',
      },
      {
        q: 'What is the main risk of using a service?',
        a: 'The firm terms. If third-party trading is prohibited, the account can be closed and the payout refused. Confirm the clause in writing before paying.',
      },
    ],
  },

  '/blog/prop-firm-passing-service-cost.html': {
    sections: [
      {
        h2: 'What the flat fee covers',
        html: `<p>A flat passing fee covers the work of trading an evaluation to its target under the firm's rules. It usually includes the risk plan, the execution, the progress reporting and the retry policy stated in the quote. It does not include the evaluation fee unless the quote says so, and it does not include platform or data costs charged by the firm. The first step in comparing two quotes is to line up the inclusions.</p>
<p>The fee is flat because the work is the same regardless of account size. A $100,000 evaluation and a $200,000 evaluation require the same rule reading, the same risk plan and the same execution discipline; the dollar risk changes, but the process does not. That is why a per-account-size fee is harder to justify than a flat fee, and why the flat fee is easier to audit.</p>`,
      },
      {
        h2: 'The per-size economics',
        html: `<p>On a $50,000 account, a $220 fee is 0.44% of the account. On a $200,000 account, it is 0.11%. The fee does not scale with the account, so the relative cost falls as the size rises. That makes the service more attractive on larger accounts, provided the strategy can trade the larger size without changing its risk profile. A method that works at $50,000 may need wider stops or smaller relative size at $200,000.</p>
<p>The evaluation fee does scale with size, and so does the platform cost. Add those to the service fee before comparing a small account with a large one. A large account with a high evaluation fee can still be the cheaper route per dollar of funded capital, but the absolute cash outlay is larger.</p>`,
      },
      {
        h2: 'When the service is the wrong buy',
        html: `<p>If the firm prohibits third-party trading, the service is the wrong buy regardless of the price. If the client wants to learn the rulebook, the service removes the learning opportunity. If the client has a tested method and a high pass probability, self-trading is usually cheaper. The service is a fit for a trader who values time, has a firm that permits the arrangement and does not want to manage the evaluation personally.</p>
<p>Ask for the terms check and the retry policy before paying. A quote that cannot name the clause it relies on is not a quote worth accepting.</p>`,
      },
    ],
    faq: [
      {
        q: 'Why is the fee flat instead of a percentage?',
        a: 'The work is the same process at any account size: read the rulebook, build the risk plan and execute. A flat fee reflects that process rather than the size of the account.',
      },
      {
        q: 'Does the fee include the evaluation?',
        a: 'Only if the quote says so. Many quotes cover the service work and leave the evaluation fee to the client. Compare the inclusions before comparing totals.',
      },
      {
        q: 'Is the service worth it on a small account?',
        a: 'The fee is a larger share of a small account, so the relative cost is higher. It can still be worth it if the time saved matters, but the math favors larger accounts.',
      },
    ],
  },

  '/blog/prop-firm-taxes-2026.html': {
    sections: [
      {
        h2: 'Payouts are income, not a gift',
        html: `<p>A prop firm payout is generally taxable income in the jurisdiction where the trader is resident, even though the firm may describe it as a profit split or a performance payment. The label on the payment does not change the tax treatment; the nature of the receipt does. A trader who receives regular payouts should keep a record of each payment, the firm, the date and the amount, and should not assume the firm has withheld tax.</p>
<p>The first question is the trader's tax residency, because that decides the rules. The second is whether the activity is treated as trading, self-employment or another category. The answer can change the deductions available, the social contributions and the filing deadline. A tax adviser who knows the local rules is worth more than a generic article, including this one.</p>`,
      },
      {
        h2: 'Records that make the return possible',
        html: `<p>Keep the payout statements, the evaluation fees, the platform and data costs, the service fees and the bank or processor fees. Those are the numbers that determine the net result. A payout statement that shows a gross amount and a fee is more useful than a bank credit that shows only the net, because the fee may be deductible or may need to be reported separately.</p>
<p>Separate the accounts by firm and by year. A single spreadsheet with columns for date, firm, account, gross payout, fees and net received is enough for most solo traders. Reconstructing a year from bank statements is possible but slow, and it is the main reason traders overpay or under-report.</p>`,
      },
      {
        h2: 'The timing questions',
        html: `<p>Tax is usually due when the income is received or when it is earned, depending on the jurisdiction and the accounting method. A payout requested in December and paid in January may fall in a different tax year from the one the trader expects. Check the local rule before making a year-end withdrawal decision.</p>
<p>If the activity is a business, quarterly estimates may apply. If it is a hobby or a one-off, the treatment can differ. The classification is not decided by the size of the payout alone; it depends on the pattern of activity, the intent to profit and the local tests. Ask before the first significant payout, not after.</p>`,
      },
    ],
    faq: [
      {
        q: 'Are prop firm payouts taxable?',
        a: 'In most jurisdictions, yes. A payout is generally treated as income, and the firm may not withhold tax. The exact treatment depends on residence and the nature of the activity.',
      },
      {
        q: 'Can I deduct evaluation and platform fees?',
        a: 'It depends on the local rules and whether the activity is treated as a business. Keep the receipts and ask a tax adviser before assuming a deduction is available.',
      },
      {
        q: 'When is a payout taxed?',
        a: 'Usually when it is received or earned, depending on the jurisdiction and accounting method. A payment requested in one year and received in the next can fall in a different tax year.',
      },
    ],
  },

  '/blog/how-much-do-prop-firm-traders-make.html': {
    sections: [
      {
        h2: 'A realistic range, not a headline',
        html: `<p>A funded trader's income depends on three variables: the account size, the profit split and the amount of profit actually withdrawn. A $100,000 account with a 90% split and a 2% monthly return produces $1,800 before fees; the same account with a 0.5% monthly return produces $450. The split is the least important of the three because it applies to a number that the trader has to produce first.</p>
<p>The distribution is skewed. Most funded traders make little or nothing, a smaller group makes a modest monthly income, and a very small group makes a living. Marketing pages show the top of the distribution because that is what sells evaluations. A plan built on the average of the top decile is a plan built on an outlier.</p>`,
      },
      {
        h2: 'The costs that reduce the headline',
        html: `<p>Start with the gross profit, apply the split, subtract the platform and data costs, subtract the evaluation fees and resets, and subtract the payout processor fees. The result is the net income. A trader who makes $2,000 gross on a $100,000 account with a 90% split, $60 of monthly data costs and a $300 evaluation fee has a very different first-month result from the headline.</p>
<p>The first payout is usually the least representative because it carries the setup costs. The second and third payouts are a better measure of the ongoing income. A trader who wants to know whether the activity is viable should model six months, not one good month.</p>`,
      },
      {
        h2: 'The account size illusion',
        html: `<p>A larger account does not automatically produce more income. The risk per trade is usually a small percentage of the account, so the dollar risk grows with the size, but so does the target. A trader who cannot produce a return on a $50,000 account will not produce one on a $200,000 account; the larger account simply makes the same mistakes more expensive.</p>
<p>The right sequence is to prove the process on the smallest viable account, then scale the size once the payout rhythm is stable. A trader who buys the largest account first is paying for a larger test, not a larger income.</p>`,
      },
    ],
    faq: [
      {
        q: 'How much can a funded trader make per month?',
        a: 'It depends on the return, the account size and the split. A 2% monthly return on a $100,000 account at a 90% split is about $1,800 before costs. Most traders produce less, and the distribution is heavily skewed.',
      },
      {
        q: 'What costs reduce the payout?',
        a: 'Platform and data fees, evaluation and reset fees, and payout processor fees. The first payout carries the setup costs, so it is usually the least representative.',
      },
      {
        q: 'Should I start with a large account?',
        a: 'Usually not. Prove the process on the smallest viable account, then scale once the payout rhythm is stable. A larger account makes the same mistakes more expensive.',
      },
    ],
  },

  '/blog/lot-size-for-100k-prop-firm-account.html': {
    sections: [
      {
        h2: 'The formula, with the units made explicit',
        html: `<p>Lot size is the dollar risk divided by the dollar value of the stop distance for one lot. If the plan allows $500 of risk and the stop is 20 pips, the first step is the value of one pip per standard lot. On EURUSD, one pip is $10 per standard lot, so a 20-pip stop is $200 per lot. Divide $500 by $200 and the size is 2.5 standard lots, or 0.25 lots on a mini account if the platform quotes in tenths.</p>
<p>The formula is the same for every instrument, but the pip or point value changes. Gold often uses $1 per point per 0.01 lot, depending on the contract specification; indices use a contract multiplier. Confirm the specification on the platform before calculating. A size that is correct for EURUSD can be ten times too large for an index.</p>`,
      },
      {
        h2: 'A $100,000 account with a 1% risk unit',
        html: `<p>At 1% risk, the dollar budget is $1,000. On EURUSD with a 25-pip stop, one standard lot risks $250, so the size is 4 lots. On gold with a $5 stop and a $1 per point value per 0.01 lot, one lot risks $500, so the size is 2 lots. The dollar risk is the same; the lot number is not. This is why copying a lot size from another trader is meaningless without the stop distance and the instrument specification.</p>
<p>On a static-floor evaluation, the 1% unit stays $1,000 for the whole attempt. On a trailing-floor evaluation, the remaining room shrinks after a gain, so the same $1,000 becomes a larger share of the cushion. The size should be recalculated from the remaining room, not from the starting balance.</p>`,
      },
      {
        h2: 'The sanity check before sending the order',
        html: `<p>Use the platform's estimated loss field to confirm the calculation. If the ticket shows a loss at the stop that is larger than the budget, reduce the size rather than moving the stop closer. Moving the stop changes the setup; reducing the size preserves it. If the ticket shows a much smaller loss, the calculation or the specification is wrong; check the contract size before sending.</p>
<p>Write the dollar risk, the stop distance and the lot size in the journal before the trade. The record makes the next calculation faster and exposes drift: a trader who gradually increases size without changing the risk budget is usually moving the stop closer, which is the beginning of a breach.</p>`,
      },
    ],
    faq: [
      {
        q: 'What lot size should I use on a $100,000 account?',
        a: 'It depends on the risk budget, the stop distance and the instrument. At 1% risk and a 25-pip EURUSD stop, 4 standard lots risk $1,000. The lot number changes with the stop and the contract specification.',
      },
      {
        q: 'Is 1% risk too high for a prop evaluation?',
        a: 'On a static 10% floor, 1% allows ten losses before failure, which is tight for a normal losing streak. Many traders use 0.25% to 0.5% to leave room for the daily stop and the calendar.',
      },
      {
        q: 'Why does my lot size differ from another trader on the same account?',
        a: 'Because the stop distance or the instrument specification differs. Lot size is a function of dollar risk and stop distance, not a fixed number for an account size.',
      },
    ],
  },

  '/blog/prop-firm-mt4-mt5-ctrader-platforms.html': {
    sections: [
      {
        h2: 'What each platform is actually good at',
        html: `<p>MT4 is the oldest of the three and has the widest library of expert advisors and custom indicators, but its order types and backtesting are dated. MT5 keeps the MQL language family but adds more timeframes, a faster tester and a broader instrument list; it is the better choice for a new automated strategy. cTrader has a cleaner order interface, level II depth on supported brokers and a modern API, which makes it the easiest of the three for a discretionary trader who wants precise order control.</p>
<p>The prop firm's platform list matters more than the platform's feature list. A firm may support MT4 and MT5 but not cTrader, or support cTrader only on certain account types. Confirm the exact platform before building a workflow around it.</p>`,
      },
      {
        h2: 'Order handling on an evaluation',
        html: `<p>Every platform supports market, limit and stop orders, but the details differ. MT4 and MT5 attach stops to the order ticket and hold them server-side once accepted. cTrader shows the stop and target as separate orders linked to the position, which makes the protection visible in the order list. On an evaluation, the server-side visibility is what matters: a chart line that exists only in the terminal is not protection.</p>
<p>Check how the platform handles a partial close, a trailing stop and a stop modification during a news window. Those are the operations that produce rule breaches. A platform that makes a stop modification easy also makes it easy to widen a stop after entry, which is a conduct issue even if the platform allows it.</p>`,
      },
      {
        h2: 'Automation and VPS decisions',
        html: `<p>MT4 and MT5 run expert advisors natively; cTrader uses cBots and a different API. If the strategy is automated, choose the platform the code is written for and confirm the firm permits automation. A VPS is useful for keeping the terminal online, but it does not change the rules. A VPS in the same region as the broker's server reduces latency, which matters for a short-term strategy but not for a swing method.</p>
<p>Before paying for a VPS, test the strategy on the firm's demo server with the same settings. If the execution differs materially from the backtest, the problem is the strategy or the data, not the VPS. Adding infrastructure to a strategy that does not have an edge only makes the losses faster.</p>`,
      },
    ],
    faq: [
      {
        q: 'Which platform is best for prop firm trading?',
        a: 'It depends on the method. MT4 has the widest EA library, MT5 has better testing and more instruments, and cTrader has the cleanest order handling for discretionary trading. Confirm the firm supports the platform first.',
      },
      {
        q: 'Are stops server-side on MT4 and MT5?',
        a: 'Stops entered in the order ticket are held server-side once the order is accepted. A line drawn on the chart is a client-side object and is not protection.',
      },
      {
        q: 'Do I need a VPS for an evaluation?',
        a: 'Only if the strategy needs the terminal to stay online. A VPS does not change the rules and does not fix a strategy without an edge.',
      },
    ],
  },
};
