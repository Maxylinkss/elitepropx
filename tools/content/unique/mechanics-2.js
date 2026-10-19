'use strict';

module.exports = {
  '/pass-prop-firm-challenge-without-breaking-rules.html': {
    sections: [
      {
        h2: 'Order the rules by what ends the account',
        html: `<p>Every rulebook has three tiers. The first tier ends the account immediately: the maximum loss, the daily loss and any prohibited conduct. The second tier blocks the payout: consistency conditions, minimum trading days and verification requirements. The third tier changes the economics: platform fees, payout cycles and reset prices. A trader who treats all rules as equally important spends attention on the third tier and breaches the first.</p>
<p>Write the first tier on a card before the first trade: the dollar value of the total floor, the dollar value of the daily stop and the list of conduct that is prohibited. Those are the numbers and behaviours that cannot be recovered from. The second tier belongs in the calendar, and the third tier belongs in the budget.</p>`,
      },
      {
        h2: 'The pre-trade check that prevents most breaches',
        html: `<p>Before each entry, confirm four things: the remaining room to the floor, the loss already used in the session, the size implied by the stop distance, and whether a scheduled event restricts the trade. If any of the four is unknown, the trade is not ready. This check takes less than a minute and catches the two most common breaches: a position that is too large for the remaining room and a trade opened inside a news window.</p>
<p>The check also creates a record. A journal entry with those four numbers is enough to reconstruct why a trade was taken and whether the risk was within the plan. If a breach happens, the record shows whether it was a sizing error, a rule misunderstanding or an operational failure. That distinction matters when asking for a reset or a review.</p>`,
      },
      {
        h2: 'What to do after a breach',
        html: `<p>Stop trading the account immediately. Confirm whether the breach is hard (the account is closed) or soft (a warning or a payout restriction). Read the reset policy before paying for a new attempt. If the breach was caused by a platform or data error, collect the evidence before contacting support: order tickets, screenshots with timestamps and the account statement. A claim without evidence is a complaint; a claim with evidence is a review request.</p>
<p>If the breach was a sizing error, the next attempt should change the process, not just the intention. A smaller risk unit, a hard daily stop and a pre-trade check are process changes. "I will be more careful" is not.</p>`,
      },
    ],
    faq: [
      {
        q: 'What is the most common rule breach?',
        a: 'Position size relative to the remaining room, followed by trading inside a restricted news window. Both are preventable with a one-minute pre-trade check.',
      },
      {
        q: 'Can a breach be reversed?',
        a: "Some firms offer a reset or a review if the breach was caused by a platform error. A genuine rule breach is usually final. Collect the evidence before contacting support.",
      },
      {
        q: 'Should I pay for a reset after a breach?',
        a: 'Read the reset price and the new terms first. A reset is only worth it if the cause of the breach has been fixed in the process, not just in the intention.',
      },
    ],
  },

  '/blog/ftmo-challenge-rules-2026.html': {
    sections: [
      {
        h2: 'The three numbers that define an FTMO attempt',
        html: `<p>FTMO's rulebook is built on three numbers: the maximum loss, the daily loss and the profit target. The maximum loss is static and measured from the starting balance, so profit does not move the failure point. The daily loss is measured on equity, which means open positions count against it. The target is the distance the account has to travel before the next phase. A trader who knows only the target has not read the rulebook.</p>
<p>The verification phase adds a fourth condition: the account has to repeat the performance after the evaluation phases. That resets the calendar even after a clean pass. Budget for the extra phase before buying, because a strategy that needs a fast payout is a different product from one that can wait.</p>`,
      },
      {
        h2: 'Sizing with an equity daily stop',
        html: `<p>On a $100,000 account with a 5% daily stop, the session limit is $5,000. At a 1% risk unit of $1,000, five losses reach the limit. At 0.5%, ten losses do. The equity measurement means an open position that moves against you reduces the remaining daily allowance even before it is closed. A trader who opens three positions at once is using the same daily budget three times, not diversifying it.</p>
<p>The total floor is $10,000 on a 10% plan. Twenty losses at $500 reach it, but the daily stop will usually end the session first. That is why the daily rule, not the total rule, should drive the session plan. The total floor is the constraint on the month; the daily stop is the constraint on the day.</p>`,
      },
      {
        h2: 'Conduct rules and the payout stage',
        html: `<p>FTMO prohibits practices such as account sharing, copy trading between clients, and strategies that exploit latency or platform errors. The evaluation itself has no consistency rule, but the payout stage has its own conditions. Read the funded-account terms as carefully as the evaluation terms, because a rule that does not apply during the challenge can still affect the withdrawal.</p>
<p>If a strategy depends on holding through news, confirm the current news policy. If it depends on a specific platform feature, confirm that the feature is available on the account type. The terms change between plan generations, so the page you read last year is not evidence of the rule today.</p>`,
      },
    ],
    faq: [
      {
        q: 'Is the FTMO maximum loss static or trailing?',
        a: 'It is static and measured from the starting balance. Profit does not move the failure point, which makes a fixed risk unit valid for the whole attempt.',
      },
      {
        q: 'Is the daily loss measured on balance or equity?',
        a: 'It is measured on equity, so open positions count against the daily allowance. A floating loss reduces the room available for the session.',
      },
      {
        q: 'Does FTMO have a consistency rule?',
        a: 'The evaluation does not apply a consistency rule. The funded account and payout terms should still be read separately, because conditions can differ after the pass.',
      },
    ],
  },

  '/blog/prop-firm-scaling-plan-explained.html': {
    sections: [
      {
        h2: 'What a scaling plan actually scales',
        html: `<p>A scaling plan increases the account size or the profit split after the trader meets a set of conditions. The conditions usually include a number of profitable payout cycles, a minimum return, a maximum drawdown and a clean rule record. The increase is not automatic: it is applied after a review, and the review can take a full cycle. A trader who expects the new size on the next payout is usually disappointed.</p>
<p>The plan also defines the base. If the account is scaled from $100,000 to $150,000, the loss floor and the target may be recalculated from the new base, not carried over proportionally. Read how the new floor is set before assuming that a larger account means more room. A scale-up that raises the size but tightens the percentage can leave the trader with the same dollar risk and a larger target.</p>`,
      },
      {
        h2: 'The conditions that are usually missed',
        html: `<p>The most common missed condition is the number of profitable cycles, not the profit amount. A trader who makes a large profit in one cycle may still need three cycles before scaling. The second is the drawdown record: a scale-up can be refused after a breach even if the account was reset. The third is the consistency condition at payout, which can delay the qualifying cycles.</p>
<p>Build the scaling calendar from the conditions, not from the ambition. If the plan requires four profitable cycles and each cycle takes a month, the scale-up is a four-month project. A trader who plans around a two-month horizon will make decisions that shorten the record, such as withdrawing too much or taking an unnecessary risk to hit a threshold.</p>`,
      },
      {
        h2: 'Is scaling worth the extra risk',
        html: `<p>A larger account is only valuable if the strategy scales. A method that works at $100,000 with a $500 risk unit may not work at $500,000 with a $2,500 unit if the instrument's liquidity or the session's volatility cannot absorb the size. Before accepting a scale-up, test the larger size on a demo or on a smaller live account. The target grows with the account; the edge does not automatically grow with it.</p>
<p>If the plan allows a partial scale, take the smaller step first. A gradual increase preserves the record and gives the trader time to adjust. A jump to the maximum size is a new strategy test, not a reward.</p>`,
      },
    ],
    faq: [
      {
        q: 'How long does a scaling plan take?',
        a: 'It depends on the number of profitable cycles and the review time. Many plans require several cycles, so a scale-up is a multi-month project rather than an immediate upgrade.',
      },
      {
        q: 'Does the loss floor scale with the account?',
        a: 'The new floor is usually recalculated from the new base. Confirm whether the percentage stays the same or changes; a larger account with a tighter percentage may not give more dollar room.',
      },
      {
        q: 'Can a breach disqualify me from scaling?',
        a: "A breach or a reset can affect the record used for the review. Check the eligibility conditions of the plan before assuming the account is still on track.",
      },
    ],
  },

  '/blog/prop-firm-rules-explained.html': {
    sections: [
      {
        h2: 'Five categories, five different consequences',
        html: `<p>Prop firm rules fall into five categories: loss limits, profit targets, time conditions, conduct rules and payout conditions. Each category has a different consequence. A loss limit ends the account; a target moves it to the next phase; a time condition extends the calendar; a conduct rule can close the account or refuse a payout; a payout condition can reduce the amount that leaves the firm. A trader who treats all five as one list cannot prioritize.</p>
<p>The first step in reading any rulebook is to label each clause with its category. The second is to write the dollar value or the date that the clause implies. A rule that cannot be converted into a number or a date is not yet understood.</p>`,
      },
      {
        h2: 'The definition is the rule',
        html: `<p>Two firms can use the same word and mean different things. A daily loss can be measured on balance or equity; a maximum loss can be static or trailing; a minimum day can require a closed trade or just a login; a consistency rule can apply to the evaluation, the funded account or only the payout. The definition is the rule, and the definition is usually in the terms page rather than the sales page.</p>
<p>When a clause is ambiguous, ask support for a written answer that quotes the terms. A reply that names the measurement, the reset time and the consequence is usable. A reply that says "it depends" is not. Keep the reply with the account records.</p>`,
      },
      {
        h2: 'A reading order that saves money',
        html: `<p>Read the loss limits first, then the payout conditions, then the target and calendar, then the conduct rules, and finally the fees. The order follows the cost of getting it wrong. A misunderstood loss limit costs the account; a misunderstood payout condition costs the profit; a misunderstood fee costs money but is recoverable. Most traders read the target first because it is printed largest, which is precisely the wrong order.</p>
<p>After reading, rewrite the rulebook in your own words as a one-page checklist. If you cannot rewrite a clause, you do not understand it. The checklist is also the document to check before each session, which is when the rules actually matter.</p>`,
      },
    ],
    faq: [
      {
        q: 'What is the most important rule to understand?',
        a: 'The loss limit, because getting it wrong ends the account. The definition matters as much as the number: static or trailing, balance or equity, and when the daily limit resets.',
      },
      {
        q: 'Where should I read the rules?',
        a: 'The firm terms page, not the sales page or a comparison article. If a clause is ambiguous, ask support for a written answer that quotes the terms.',
      },
      {
        q: 'Do all firms define daily loss the same way?',
        a: 'No. Some measure on balance and others on equity, and reset times differ. The definition changes the size you can safely trade.',
      },
    ],
  },

  '/blog/account-sharing-prop-firm-rules.html': {
    sections: [
      {
        h2: 'What counts as account sharing',
        html: `<p>Account sharing usually means allowing another person to access the trading account or to make trading decisions for it. The rule can cover a login from another device, a family member placing a trade, a signal group sending entries, or a service trading the account. The common thread is control: if someone other than the account holder can affect the account, the firm may treat it as sharing.</p>
<p>The rule is not limited to a password. A trader who shares screen access, gives a VPS login to a third party or follows a signal service that executes on the account may be inside the definition even if the account holder presses the button. Read the clause for the words access, control and instruction, not just the word sharing.</p>`,
      },
      {
        h2: 'Why firms prohibit it',
        html: `<p>The firm's risk model assumes one trader making decisions on one account. Sharing breaks that assumption: it can multiply the same position across accounts, hide the true risk owner, or allow a strategy that the firm did not agree to. It also creates an identity problem at payout, because the firm has to pay the person who owns the account, not the person who traded it.</p>
<p>The consequence is usually severe: the account can be closed, the payout can be refused, and the fee may be lost. Some firms offer a written permission process for a specific arrangement, such as a passing service, but the permission has to be explicit and usually covers the evaluation only, not the funded account.</p>`,
      },
      {
        h2: 'How to stay on the right side of the rule',
        html: `<p>Keep the login to yourself. If a service trades the evaluation, confirm in writing that the firm permits third-party trading and that the permission covers the work being done. Do not use a shared VPS or a device that another trader can access. Do not copy trades between accounts unless the firm explicitly allows it. Keep a record of every access method and every permission.</p>
<p>If the firm asks about a login from a new location, answer honestly and provide the explanation before the account is flagged. A clear answer with evidence is easier to resolve than a pattern of unexplained access. The rule is strict because the risk is real, not because the firm wants to make administration difficult.</p>`,
      },
    ],
    faq: [
      {
        q: 'Can a family member trade my account?',
        a: 'Usually not without explicit permission. The rule is about control, not just the password. A family member placing trades can be treated as account sharing.',
      },
      {
        q: 'Is a passing service allowed to trade my evaluation?',
        a: 'Only if the firm terms permit third-party trading and the permission covers the work. Get the clause in writing before paying the service.',
      },
      {
        q: 'What happens if I share an account?',
        a: 'The account can be closed and the payout refused, even if the trading was profitable. The fee may not be refunded.',
      },
    ],
  },

  '/blog/prop-firm-challenge-rules-explained.html': {
    sections: [
      {
        h2: 'Evaluation rules are not funded rules',
        html: `<p>The rules that apply during an evaluation are not always the rules that apply after the pass. A firm can allow a strategy on the evaluation and restrict it on the funded account, or apply a consistency condition only at payout. The challenge rules explain the path to the funded account; the funded terms explain what the account is worth. A trader who reads only the challenge page has read half the contract.</p>
<p>The difference shows up in three places: the consistency condition, the news policy and the payout schedule. Each can change after the pass. Before buying, read both pages and write down the clauses that differ. If the difference is material to the strategy, the product is not a fit even if the challenge itself is easy.</p>`,
      },
      {
        h2: 'The four numbers in every challenge',
        html: `<p>Every challenge can be reduced to four numbers: the profit target, the maximum loss, the daily loss and the minimum days. The first two define the distance, the third defines the worst day, and the fourth defines the calendar. A rulebook that does not state all four clearly is a rulebook to avoid until support answers in writing.</p>
<p>Convert each number into dollars on the account size you are considering. A 10% target on a $50,000 account is $5,000; a 5% daily stop is $2,500. Then divide by the risk unit to see how many losses the day can absorb. If the answer is fewer than three, the size is too large for the rulebook, regardless of how good the setup looks.</p>`,
      },
      {
        h2: 'How to verify a rule before trading',
        html: `<p>Find the clause in the terms, copy it into your notes, and ask support to confirm your interpretation in one sentence. For example: "On the $100,000 plan, is the daily loss measured on equity and does it reset at 00:00 server time?" A specific question gets a specific answer. A general question gets a marketing reply.</p>
<p>Do this for the loss limits, the consistency rule and the payout schedule. Those three cover most of the money at risk. The rest of the rulebook can be read once and checked before the session.</p>`,
      },
    ],
    faq: [
      {
        q: 'Are funded account rules the same as challenge rules?',
        a: 'Not always. Consistency, news and payout conditions can change after the pass. Read both the challenge page and the funded terms before buying.',
      },
      {
        q: 'What are the four key challenge numbers?',
        a: 'The profit target, the maximum loss, the daily loss and the minimum trading days. Convert each into dollars and dates on the account size you are considering.',
      },
      {
        q: 'How do I confirm an ambiguous rule?',
        a: 'Ask support a specific question that names the measurement, the reset time and the consequence. Keep the written answer with your account records.',
      },
    ],
  },
};
