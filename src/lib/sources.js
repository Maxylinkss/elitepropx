'use strict';

/**
 * Firm rule sources, kept in one registry so the same claim is always cited to
 * the same document. Pages opt in through front matter:
 *
 *   sources: ftmo, apex, topstep
 *
 * and the layout renders the block at the foot of the page, with the same links
 * published as BlogPosting `citation`. Add a firm here only after the URL
 * resolves; a citation that 404s does more damage than no citation.
 *
 * Where a firm keeps its rules inside a help centre or account dashboard, the
 * help centre is cited rather than a deep article that may be renamed.
 */
const FIRMS = {
  ftmo: {
    name: 'FTMO',
    items: [
      { label: '2-Step Challenge trading objectives', href: 'https://ftmo.oanda.com/2-step-challenge/' },
    ],
  },
  fundednext: {
    name: 'FundedNext',
    items: [{ label: 'CFD trading objectives', href: 'https://fundednext.com/cfds' }],
  },
  the5ers: {
    name: 'The5ers',
    items: [{ label: 'High Stakes plan rules', href: 'https://the5ers.com/high-stakes/' }],
  },
  apex: {
    name: 'Apex Trader Funding',
    items: [
      {
        label: 'EOD evaluation parameters',
        href: 'https://apextraderfunding.com/help-center/eod-trailing-drawdown-accounts/eod-evaluations/',
      },
      {
        label: 'intraday trailing drawdown',
        href: 'https://apextraderfunding.com/help-center/intraday-trailing-drawdown-accounts/intraday-trailing-drawdown-explained/',
      },
      {
        label: '50% consistency requirement',
        href: 'https://apextraderfunding.com/help-center/additional-helpful-items/50-consistency-requirement/',
      },
    ],
  },
  topstep: {
    name: 'Topstep',
    items: [
      {
        label: 'maximum loss limit',
        href: 'https://help.topstep.com/en/articles/8284204-what-is-the-maximum-loss-limit',
      },
      {
        label: 'daily loss limit',
        href: 'https://help.topstep.com/en/articles/10490293-daily-loss-limit-in-the-trading-combine-and-express-funded-account',
      },
      {
        label: 'consistency targets',
        href: 'https://help.topstep.com/en/articles/8284208-consistency-at-topstep',
      },
    ],
  },
  mff: {
    name: 'MyFundedFutures',
    items: [
      {
        label: 'help centre — evaluation rules and parameters',
        href: 'https://help.myfundedfutures.com/en/',
      },
    ],
  },
  e8: {
    name: 'E8 Markets',
    items: [
      { label: 'challenge rules and account configurator', href: 'https://e8markets.com/' },
    ],
  },
  alpha: {
    name: 'Alpha Capital Group',
    items: [
      { label: 'evaluation objectives and payout terms', href: 'https://alphacapitalgroup.uk/' },
    ],
  },
};

/** Last date every link above was opened and confirmed to resolve. */
const CHECKED = '2026-10-23';

function get(key) {
  return FIRMS[key] || null;
}

function slugs(page) {
  if (!page.sources) return [];
  return String(page.sources)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function resolve(page) {
  return slugs(page)
    .map(get)
    .filter(Boolean);
}

module.exports = { FIRMS, CHECKED, get, slugs, resolve };
