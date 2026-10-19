'use strict';

module.exports = {
  '/blog/prop-firm-risk-management-challenge.html': {
    sections: [
      {
        h2: 'Risk management is a budget, not a feeling',
        html: `<p>The loss limit is a budget, and every trade spends part of it. If the account has $10,000 of total room and the plan is to risk $500 per trade, the budget allows twenty losses. The daily stop may allow ten. The binding number is the smaller of the two on any given day, and the plan should be built around it rather than around the total.</p>
<p>A budget makes the sizing decision mechanical. Divide the dollar risk by the stop distance and the instrument value, and the lot size is fixed. If the result is too large for the platform's minimum or too small to be meaningful, the setup is not suitable for the account. The trader does not need a stronger opinion; they need a different setup or a different account size.</p>`,
      },
      {
        h2: 'The losing-streak calculation',
        html: `<p>Before the first trade, estimate the longest losing streak the method has produced in a representative sample. If the sample's worst streak is eight losses, a budget that allows only ten is too tight; a normal streak will almost reach the floor. A budget that allows twenty gives the method room to be wrong twice as long as the sample.</p>
<p>The calculation is not a prediction. It is a margin of safety. A method with a 45% win rate will produce long losing streaks by chance, even if the edge is real. The trader who sizes for the average streak is the trader who breaches during a normal bad month.</p>`,
      },
      {
        h2: 'The daily stop as a circuit breaker',
        html: `<p>The firm's daily stop is a limit, not a target. A trader should set a personal stop below it, usually three losses or a fixed percentage of the daily budget. The personal stop is a circuit breaker: it ends the session before the emotional decisions begin. The firm's stop is the consequence; the personal stop is the control.</p>
<p>Write the daily loss used and the remaining budget before each entry. A trader who can state both numbers from memory is far less likely to take a revenge trade. The journal is not a record of opinions; it is the risk dashboard.</p>`,
      },
    ],
    faq: [
      {
        q: 'What percentage should I risk per trade?',
        a: 'Most traders should risk 0.25% to 0.5% of the account per trade on a static floor. On a trailing floor, the size should be recalculated from the remaining room after a gain.',
      },
      {
        q: 'How many losses should the account be able to absorb?',
        a: 'At least twice the worst losing streak in a representative sample. If the method has produced eight consecutive losses, a budget of ten is too tight; twenty gives a margin of safety.',
      },
      {
        q: 'Should I use the firm’s daily stop as my own?',
        a: 'No. Set a personal stop below the firm’s limit, such as three losses or a fixed share of the daily budget. The firm’s stop is the consequence, not the plan.',
      },
    ],
  },

  '/blog/how-to-pass-ftmo-challenge-fast-2026.html': {
    sections: [
      {
        h2: 'Fast is a pacing decision, not a size decision',
        html: `<p>The fastest legitimate way to pass an FTMO challenge is to use a larger number of high-quality setups at a controlled risk, not to increase the risk per trade. FTMO's static floor and daily stop do not reward a larger size; they punish a breach. The trader who doubles the risk to finish in a week is twice as likely to hit the daily stop and no more likely to reach the target.</p>
<p>The pacing decision is about the number of trading days and the number of valid setups. If the method produces two valid setups a day and the target requires twenty net winners, the minimum is ten days of perfect execution. A realistic plan allows for losses and missed days, so the calendar is longer. The speed comes from taking the valid setups, not from forcing more.</p>`,
      },
      {
        h2: 'The target math on a $100,000 account',
        html: `<p>On a $100,000 account with a 10% target, the account needs $10,000. At a $500 risk unit and a 2:1 plan, a winning trade contributes $1,000, so ten net winners are needed. At a 1:2 plan, a winner contributes $500 and the count doubles. The faster route is the higher reward-to-risk plan, provided the win rate does not collapse. A 2:1 plan with a 40% win rate has a positive expectancy; a 4:1 plan with a 20% win rate may have the same, but the losing streaks are longer.</p>
<p>The daily stop is the constraint on a fast attempt. If the trader takes too many setups in one day and hits the daily limit, the account is done for the day. The plan should cap the number of trades at a level that keeps the daily budget intact even after a normal losing run.</p>`,
      },
      {
        h2: 'What not to do',
        html: `<p>Do not increase size after a losing day to recover. Do not hold a position through a news event unless the plan permits it. Do not skip the verification phase in the calendar. Do not assume that a fast pass is a better pass; the payout stage is the same. A trader who reaches the target in a week but fails the verification or the payout review has not passed.</p>
<p>If the goal is speed, the best investment is preparation: a tested setup, a written risk plan and a journal from the first trade. Preparation shortens the calendar more reliably than a larger position.</p>`,
      },
    ],
    faq: [
      {
        q: 'Can I pass FTMO in one week?',
        a: 'It is possible if the target is reached with valid setups and the risk stays within the daily stop, but it is not a reliable plan. The verification phase and payout seasoning still apply, so a fast evaluation does not mean fast cash.',
      },
      {
        q: 'Should I increase risk to pass faster?',
        a: 'No. A larger risk increases the chance of hitting the daily stop and does not improve the expectancy. Speed comes from valid setups and preparation, not from size.',
      },
      {
        q: 'What is the fastest legitimate route?',
        a: 'A tested high-reward-to-risk setup traded at a controlled size, with enough valid setups per week to reach the target without breaching the daily stop.',
      },
    ],
  },

  '/blog/prop-firm-beginner-faq.html': {
    sections: [
      {
        h2: 'The questions beginners ask first',
        html: `<p>The first question is not which firm has the biggest account; it is which rulebook you can explain in one sentence. A static percentage floor with a daily stop is easier to learn than a trailing threshold with a consistency condition. Start with the simpler rulebook and a small account. The cost of a first evaluation should be small enough that a failure is tuition, not a crisis.</p>
<p>The second question is how much to risk per trade. A beginner should use 0.25% to 0.5% of the account, not 1% to 2%. The smaller size leaves room for the learning curve and for a normal losing streak. A trader who risks 2% on a first evaluation can breach the daily stop in three losses, which is a normal day.</p>`,
      },
      {
        h2: 'What a first evaluation should teach',
        html: `<p>A first evaluation is a process test. The goal is to learn how the rulebook behaves, how the platform executes and how the trader responds to a daily stop. The pass is a bonus. A beginner who treats the first evaluation as a pass-or-fail exam will take risks that the process cannot support. A beginner who treats it as a supervised rehearsal will learn something that transfers to the next attempt.</p>
<p>Keep a journal from the first trade: setup, risk, stop, result and remaining room. The journal is the asset that survives a failed attempt. After the attempt, review the journal before buying another evaluation. If the losses came from the process, fix the process; if they came from the market, the process may be fine.</p>`,
      },
      {
        h2: 'When to buy a second attempt',
        html: `<p>Buy a second attempt only after answering two questions: what caused the first failure, and what changed in the process? If the answer is "I got unlucky", the process has not been reviewed. If the answer is "I risked too much after a loss and hit the daily stop", the change is a smaller risk unit and a personal daily stop. The second attempt should test the change, not repeat the first attempt with more hope.</p>
<p>If the first attempt was failed by a rule misunderstanding, the second attempt should start with a written rule summary and a support confirmation. The fee is the same; the lesson should not be.</p>`,
      },
    ],
    faq: [
      {
        q: 'Which prop firm is best for a beginner?',
        a: 'The one with the simplest rulebook and a low-cost small account. A static floor with a daily stop is easier to learn than a trailing threshold with a consistency condition.',
      },
      {
        q: 'How much should a beginner risk per trade?',
        a: '0.25% to 0.5% of the account. A larger size can breach the daily stop in a normal losing run before the method has a chance to work.',
      },
      {
        q: 'Should I buy another evaluation after failing?',
        a: 'Only after identifying the cause and changing the process. Repeating the same attempt with the same size is not a new test.',
      },
    ],
  },

  '/blog/prop-firm-challenge-mistakes.html': {
    sections: [
      {
        h2: 'The mistake that ends most attempts',
        html: `<p>The most common mistake is sizing against the account balance instead of the remaining room. On a trailing floor, a trader who keeps a 1% risk unit after a gain is taking a larger share of the cushion than at the start. The account can be closed by a normal retracement even though the balance is still positive. The fix is to recalculate the risk unit from the distance to the floor before every session.</p>
<p>The second most common mistake is treating the daily stop as a target. A trader who tries to recover a loss in the same session usually increases size and hits the limit. The daily stop is a circuit breaker; the session should end before it is reached. A personal three-loss rule is easier to follow than a percentage limit.</p>`,
      },
      {
        h2: 'Process mistakes that look like bad luck',
        html: `<p>Taking a trade without a stop, moving a stop away from the entry, and holding a position through a restricted news window are process mistakes, not bad luck. Each one can end an account regardless of the profit. The evaluation is not a test of whether the trader can predict the market; it is a test of whether the trader can follow a rulebook under pressure. A process mistake is a failure of the test even when the trade wins.</p>
<p>The fix is a pre-trade checklist: remaining room, daily loss used, stop distance, size and news window. If any item is unknown, the trade is not ready. The checklist takes a minute and catches the mistakes that cost the fee.</p>`,
      },
      {
        h2: 'The review that prevents the repeat',
        html: `<p>After a failed attempt, review the journal before buying another evaluation. Categorize each loss as a setup loss, a sizing error, a rule breach or an execution error. The categories tell you what to change. A setup loss is part of the method; a sizing error is a process bug; a rule breach is a reading failure; an execution error is a platform or discipline problem. Each has a different fix.</p>
<p>A trader who cannot categorize the losses has not reviewed the attempt. The next evaluation will repeat the same pattern with a different date. The fee is the price of the lesson; the review is how the lesson is collected.</p>`,
      },
    ],
    faq: [
      {
        q: 'What is the biggest mistake in a prop firm challenge?',
        a: 'Sizing against the account balance instead of the remaining room, especially on a trailing floor. A normal retracement can then end the account while the balance is still positive.',
      },
      {
        q: 'Why is moving a stop a problem?',
        a: 'It changes the risk of the trade after entry and can breach the plan’s conduct rules. It also turns a planned loss into an unplanned one.',
      },
      {
        q: 'How do I avoid repeating the same failure?',
        a: 'Categorize each loss in the journal as a setup loss, sizing error, rule breach or execution error. Each category has a different fix, and the review is what makes the next attempt different.',
      },
    ],
  },
};
