'use strict';

/**
 * Single source of truth for brand facts used across every page.
 * Keep claims identical site-wide so structured data and copy never disagree.
 */
const site = {
  name: 'ElitePropX',
  url: 'https://elitepropx.com',
  legalName: 'ElitePropX',
  tagline: 'Pass your prop firm challenge for a flat $220',
  description:
    'ElitePropX is an independent prop firm challenge-passing service for Forex and Futures traders. Flat $220 per evaluation, retries covered, no profit split.',
  price: '$220',
  priceValue: '220',
  currency: 'USD',
  email: 'support@elitepropx.com',
  telegram: 'https://t.me/voraspas',
  telegramHandle: '@voraspas',
  founded: '2024',
  stats: {
    challengesPassed: '500+',
    successRate: '95%',
    firmsSupported: '20+',
    avgPassDays: '14',
  },
  social: {
    youtube: 'https://www.youtube.com/hashtag/propfirmpassing',
    telegram: 'https://t.me/voraspas',
  },
  themeColor: '#0b1220',
  ogImage: '/assets/img/og/default.svg',
  locale: 'en_US',
};

module.exports = site;
