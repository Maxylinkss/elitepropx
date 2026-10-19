'use strict';

/**
 * Generates every image used by the site as a local SVG:
 *  - brand logo (light + dark), mark, favicon
 *  - editorial diagrams used inside articles
 *  - one 1200x630 social card per page
 *
 * Run: node tools/gen-images.js
 */

const fs = require('fs');
const path = require('path');
const walk = require('../src/lib/walk');
const { parseFrontMatter, pageSlug } = require('../src/lib/frontmatter');

const ROOT = path.join(__dirname, '..');
const IMG = path.join(ROOT, 'docs', 'assets', 'img');
const OG = path.join(IMG, 'og');
fs.mkdirSync(OG, { recursive: true });

const C = {
  ink: '#0b1220',
  ink2: '#16233b',
  ink3: '#243b5c',
  body: '#3d4a61',
  muted: '#6b7a92',
  line: '#dbe3ef',
  soft: '#f4f7fc',
  green: '#0e9f6e',
  greenLt: '#57e0ae',
  greenSoft: '#e7f7f0',
  gold: '#f2b705',
  red: '#d9534f',
  white: '#ffffff',
};

const FONT = "Arial, Helvetica, 'Segoe UI', sans-serif";

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const write = (name, svg) => fs.writeFileSync(path.join(IMG, name), svg.trim() + '\n', 'utf8');

/* ------------------------------ brand assets ------------------------------ */

function logoSvg({ dark = false } = {}) {
  const text = dark ? C.white : C.ink;
  const sub = dark ? '#9fb0c9' : C.muted;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 76" role="img" aria-label="ElitePropX">
  <title>ElitePropX</title>
  <rect x="2" y="10" width="56" height="56" rx="15" fill="${C.ink}"/>
  <path d="M18 46 L30 32 L38 40 L46 22" fill="none" stroke="${C.greenLt}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="46" cy="22" r="4.5" fill="${C.gold}"/>
  <text x="72" y="42" font-family="${FONT}" font-size="27" font-weight="800" fill="${text}" letter-spacing="-0.6">Elite<tspan fill="${C.green}">PropX</tspan></text>
  <text x="73" y="60" font-family="${FONT}" font-size="10.5" font-weight="700" fill="${sub}" letter-spacing="2.6">PROP CHALLENGE PASSING</text>
</svg>`;
}

write('logo.svg', logoSvg({ dark: false }));
write('logo-white.svg', logoSvg({ dark: true }));

write(
  'logo-mark.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="ElitePropX mark">
  <rect width="64" height="64" rx="16" fill="${C.ink}"/>
  <path d="M14 46 L28 31 L37 40 L50 20" fill="none" stroke="${C.greenLt}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="50" cy="20" r="5" fill="${C.gold}"/>
</svg>`
);

write(
  'favicon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${C.ink}"/>
  <path d="M14 46 L28 31 L37 40 L50 20" fill="none" stroke="${C.greenLt}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="50" cy="20" r="5" fill="${C.gold}"/>
</svg>`
);

/* -------------------------------- diagrams -------------------------------- */

const svgOpen = (w, h, label) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}" font-family="${FONT}">`;

const gridPattern = (id, size = 40, color = '#e8eef7') =>
  `<pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse"><path d="M ${size} 0 L 0 0 0 ${size}" fill="none" stroke="${color}" stroke-width="1"/></pattern>`;

/* 1. How the service works */
write(
  'how-it-works.svg',
  `${svgOpen(1000, 470, 'Four steps: choose your firm, pay the flat fee, we trade the evaluation, you receive the funded account')}
  <defs>${gridPattern('hiw')}</defs>
  <rect width="1000" height="470" fill="${C.soft}"/>
  <rect width="1000" height="470" fill="url(#hiw)"/>
  <text x="60" y="62" font-size="13" font-weight="800" letter-spacing="3" fill="${C.green}">HOW ELITEPROPX WORKS</text>
  <text x="60" y="100" font-size="30" font-weight="800" fill="${C.ink}">Four steps from evaluation to funded account</text>
  ${[
    ['01', 'Pick the firm', 'FTMO, FundedNext, Apex,\nTopstep and 20+ more', 60],
    ['02', 'Pay $220 flat', 'Any account size.\nRetries included', 292],
    ['03', 'We trade it', 'Rules-first execution on\nyour evaluation', 524],
    ['04', 'Get funded', 'Login handed over,\n100% of payouts yours', 756],
  ]
    .map(([n, title, body, x]) => {
      const lines = body.split('\n');
      return `<g>
    <rect x="${x}" y="150" width="196" height="230" rx="16" fill="#fff" stroke="${C.line}"/>
    <rect x="${x}" y="150" width="196" height="6" rx="3" fill="${C.green}"/>
    <text x="${x + 24}" y="205" font-size="34" font-weight="800" fill="${C.greenSoft}">${n}</text>
    <text x="${x + 24}" y="240" font-size="18" font-weight="800" fill="${C.ink}">${esc(title)}</text>
    ${lines
      .map(
        (l, i) =>
          `<text x="${x + 24}" y="${268 + i * 21}" font-size="13" fill="${C.muted}">${esc(l)}</text>`
      )
      .join('\n    ')}
  </g>`;
    })
    .join('\n  ')}
  <path d="M256 265 h26 m-8 -6 l8 6 -8 6" stroke="${C.ink3}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M488 265 h26 m-8 -6 l8 6 -8 6" stroke="${C.ink3}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M720 265 h26 m-8 -6 l8 6 -8 6" stroke="${C.ink3}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="60" y="430" font-size="13" fill="${C.muted}">Average completion time across managed evaluations: 14 days.</text>
</svg>`
);

/* 2. Drawdown types */
write(
  'drawdown-types.svg',
  `${svgOpen(1000, 560, 'Three drawdown models compared: static, intraday trailing and end-of-day trailing')}
  <rect width="1000" height="560" fill="#fff"/>
  <text x="50" y="52" font-size="13" font-weight="800" letter-spacing="3" fill="${C.green}">DRAWDOWN MODELS</text>
  <text x="50" y="88" font-size="28" font-weight="800" fill="${C.ink}">The same account, three different safety floors</text>
  ${[
    ['Static', 'Floor never moves', 0],
    ['Intraday trailing', 'Floor follows every tick up', 1],
    ['End-of-day trailing', 'Floor follows closed profit', 2],
  ]
    .map(([title, sub, i]) => {
      const x = 50 + i * 310;
      const y = 130;
      const start = 372;
      const step = 30;
      const profits = [0, 12, 26, 38, 54, 66, 80, 92, 108, 118];
      const clamp = (v) => Math.max(start - v, y + 34);
      const pts = profits.map((p, k) => `${x + 14 + k * step},${clamp(p)}`).join(' ');
      let floor;
      if (i === 0) floor = `${x + 14},${clamp(0)} ${x + 284},${clamp(0)}`;
      else if (i === 1) {
        const f = profits.map((p, k) => `${x + 14 + k * step},${clamp(Math.max(0, p - 40))}`);
        floor = f.join(' ');
      } else {
        const f = profits.map((p, k) => `${x + 14 + k * step},${clamp(Math.max(0, (profits[k - 1] || 0) - 40))}`);
        floor = f.join(' ');
      }
      return `<g>
    <rect x="${x}" y="${y}" width="290" height="340" rx="14" fill="${C.soft}" stroke="${C.line}"/>
    <text x="${x + 18}" y="${y + 30}" font-size="15" font-weight="800" fill="${C.ink}">${esc(title)}</text>
    <text x="${x + 18}" y="${y + 50}" font-size="12" fill="${C.muted}">${esc(sub)}</text>
    <line x1="${x + 14}" y1="${start}" x2="${x + 284}" y2="${start}" stroke="#c9d4e5" stroke-width="1" stroke-dasharray="4 4"/>
    <polyline points="${floor}" fill="none" stroke="${C.red}" stroke-width="2.5" stroke-dasharray="6 4"/>
    <polyline points="${pts}" fill="none" stroke="${C.green}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${x + 14 + 9 * step}" cy="${clamp(profits[9])}" r="4.5" fill="${C.green}"/>
    <text x="${x + 18}" y="${y + 322}" font-size="11.5" fill="${C.muted}">Green: equity · Red: failure floor</text>
  </g>`;
    })
    .join('\n  ')}
  <text x="50" y="516" font-size="13.5" fill="${C.body}">A trailing floor turns every winner into a smaller cushion. That single mechanic ends more evaluations than any other rule.</text>
</svg>`
);

/* 3. Risk budget / position sizing */
write(
  'risk-budget.svg',
  `${svgOpen(940, 520, 'Daily loss limit divided into three trade slots')}
  <rect width="940" height="520" fill="#fff"/>
  <text x="48" y="50" font-size="13" font-weight="800" letter-spacing="3" fill="${C.green}">POSITION SIZING</text>
  <text x="48" y="86" font-size="27" font-weight="800" fill="${C.ink}">Spend the daily loss limit in thirds</text>
  <rect x="48" y="120" width="844" height="54" rx="10" fill="${C.soft}" stroke="${C.line}"/>
  <rect x="48" y="120" width="281" height="54" rx="10" fill="#c9f2e2"/>
  <rect x="329" y="120" width="281" height="54" fill="#fdf0c8"/>
  <rect x="610" y="120" width="281" height="54" rx="10" fill="#f8d7d5"/>
  <text x="70" y="153" font-size="14" font-weight="700" fill="${C.ink}">Trade 1 · 1/3 of limit</text>
  <text x="351" y="153" font-size="14" font-weight="700" fill="${C.ink}">Trade 2 · 1/3 of limit</text>
  <text x="632" y="153" font-size="14" font-weight="700" fill="${C.ink}">Trade 3 · 1/3 of limit</text>
  <text x="48" y="210" font-size="14" fill="${C.body}">On a $100,000 account with a 5% daily limit ($5,000), each slot is roughly $1,650 of risk.</text>
  ${[['$5,000', 'daily limit', 48], ['$1,650', 'per trade', 328], ['$5,000', 'total at risk', 608]]
    .map(
      ([big, small, x]) => `<g>
    <rect x="${x}" y="250" width="264" height="112" rx="12" fill="#fff" stroke="${C.line}"/>
    <text x="${x + 22}" y="302" font-size="30" font-weight="800" fill="${C.ink}">${big}</text>
    <text x="${x + 22}" y="330" font-size="13" fill="${C.muted}">${small}</text>
  </g>`
    )
    .join('\n  ')}
  <rect x="48" y="392" width="844" height="76" rx="12" fill="${C.greenSoft}" stroke="#c9f2e2"/>
  <text x="70" y="423" font-size="14" font-weight="800" fill="${C.green}">Why thirds?</text>
  <text x="70" y="447" font-size="13.5" fill="${C.body}">Three consecutive losses in one day is a normal statistical event. Three losses should never be fatal.</text>
</svg>`
);

/* 4. Consistency rule */
write(
  'consistency-rule.svg',
  `${svgOpen(940, 540, 'Consistency rule bar chart where the best day must stay under thirty percent of total profit')}
  <rect width="940" height="540" fill="#fff"/>
  <text x="48" y="50" font-size="13" font-weight="800" letter-spacing="3" fill="${C.green}">CONSISTENCY RULE</text>
  <text x="48" y="86" font-size="27" font-weight="800" fill="${C.ink}">One huge day can block your payout</text>
  ${[
    ['Mon', 900, 0],
    ['Tue', 2100, 0],
    ['Wed', 6400, 1],
    ['Thu', 1800, 0],
    ['Fri', 2600, 0],
  ]
    .map(([day, val, hot], i) => {
      const h = Math.round(val / 7000 * 260);
      const x = 90 + i * 150;
      return `<g>
    <rect x="${x}" y="${340 - h}" width="86" height="${h}" rx="6" fill="${hot ? C.gold : C.green}" opacity="${hot ? 1 : 0.85}"/>
    <text x="${x}" y="${340 - h - 12}" font-size="13" font-weight="700" fill="${hot ? '#9a6208' : C.ink}">$${val.toLocaleString('en-US')}</text>
    <text x="${x}" y="364" font-size="13" fill="${C.muted}">${day}</text>
  </g>`;
    })
    .join('\n  ')}
  <line x1="70" y1="196" x2="880" y2="196" stroke="${C.red}" stroke-width="2" stroke-dasharray="7 5"/>
  <text x="700" y="188" font-size="12.5" font-weight="700" fill="${C.red}">30% of $14,800 = $4,440</text>
  <text x="48" y="410" font-size="14" fill="${C.body}">Wednesday alone is 43% of total profit, so the account fails the consistency check even though the target is met.</text>
  <rect x="48" y="438" width="844" height="66" rx="12" fill="${C.soft}" stroke="${C.line}"/>
  <text x="70" y="466" font-size="13" font-weight="800" fill="${C.ink}">The fix:</text>
  <text x="70" y="489" font-size="13" fill="${C.body}">cap any single day at roughly a third of your profit target and keep adding ordinary, boring winning days.</text>
</svg>`
);

/* 5. Payout timeline */
write(
  'payout-timeline.svg',
  `${svgOpen(1000, 420, 'Payout timeline from passing the evaluation to receiving the first withdrawal')}
  <rect width="1000" height="420" fill="${C.soft}"/>
  <text x="52" y="52" font-size="13" font-weight="800" letter-spacing="3" fill="${C.green}">FROM PASS TO PAYOUT</text>
  <text x="52" y="88" font-size="27" font-weight="800" fill="${C.ink}">Six checkpoints before money leaves the firm</text>
  <line x1="90" y1="220" x2="910" y2="220" stroke="#cfdbeb" stroke-width="3"/>
  ${[
    ['Evaluation passed', 'Rules verified'],
    ['Funded login', 'New limits apply'],
    ['Minimum days', 'Usually 5–10'],
    ['Profit target', 'Typically 5–10%'],
    ['KYC', 'ID + address'],
    ['Payout', '1–7 business days'],
  ]
    .map(([t, s], i) => {
      const x = 90 + i * 164;
      return `<g>
    <circle cx="${x}" cy="220" r="13" fill="#fff" stroke="${C.green}" stroke-width="4"/>
    <circle cx="${x}" cy="220" r="4.5" fill="${C.green}"/>
    <text x="${x}" y="262" font-size="13.5" font-weight="800" fill="${C.ink}" text-anchor="middle">${esc(t.split(' ')[0])}</text>
    <text x="${x}" y="281" font-size="13.5" font-weight="800" fill="${C.ink}" text-anchor="middle">${esc(t.split(' ').slice(1).join(' '))}</text>
    <text x="${x}" y="303" font-size="11.5" fill="${C.muted}" text-anchor="middle">${esc(s)}</text>
  </g>`;
    })
    .join('\n  ')}
  <text x="52" y="360" font-size="13.5" fill="${C.body}">Firms differ on minimum trading days and profit thresholds, but the sequence is almost always identical.</text>
</svg>`
);

/* 6. Cost comparison */
write(
  'cost-comparison.svg',
  `${svgOpen(940, 520, 'Cost of retrying a challenge yourself versus using a flat fee passing service')}
  <rect width="940" height="520" fill="#fff"/>
  <text x="48" y="50" font-size="13" font-weight="800" letter-spacing="3" fill="${C.green}">COST OF RETRIES</text>
  <text x="48" y="86" font-size="27" font-weight="800" fill="${C.ink}">Three failed attempts vs one flat fee</text>
  <rect x="48" y="128" width="400" height="280" rx="14" fill="${C.soft}" stroke="${C.line}"/>
  <text x="74" y="170" font-size="17" font-weight="800" fill="${C.ink}">Retry it yourself</text>
  ${['Attempt 1 · $540', 'Attempt 2 · $540', 'Reset fee · $120', 'Attempt 3 · $540']
    .map(
      (l, i) =>
        `<text x="74" y="${212 + i * 34}" font-size="14" fill="${C.body}">✕ ${esc(l)}</text>`
    )
    .join('\n  ')}
  <text x="74" y="382" font-size="26" font-weight="800" fill="${C.red}">$1,740</text>
  <rect x="492" y="128" width="400" height="280" rx="14" fill="${C.greenSoft}" stroke="#bfe9d7"/>
  <text x="518" y="170" font-size="17" font-weight="800" fill="${C.ink}">ElitePropX</text>
  ${['One flat fee · $220', 'Any account size', 'Retries covered', 'No profit split']
    .map(
      (l, i) =>
        `<text x="518" y="${212 + i * 34}" font-size="14" fill="${C.body}">✓ ${esc(l)}</text>`
    )
    .join('\n  ')}
  <text x="518" y="382" font-size="26" font-weight="800" fill="${C.green}">$220</text>
  <text x="48" y="458" font-size="13.5" fill="${C.body}">Illustrative fees based on a mid-size evaluation. Your firm's published prices are the only numbers that matter.</text>
</svg>`
);

/* 7. Firm landscape */
write(
  'firm-landscape.svg',
  `${svgOpen(1000, 560, 'Prop firm landscape: forex versus futures firms and evaluation versus instant funding')}
  <rect width="1000" height="560" fill="#fff"/>
  <text x="52" y="50" font-size="13" font-weight="800" letter-spacing="3" fill="${C.green}">FIRM LANDSCAPE</text>
  <text x="52" y="86" font-size="27" font-weight="800" fill="${C.ink}">Where the major firms sit</text>
  <rect x="150" y="130" width="760" height="360" rx="14" fill="${C.soft}" stroke="${C.line}"/>
  <line x1="150" y1="310" x2="910" y2="310" stroke="#c9d4e5" stroke-width="1.5"/>
  <line x1="530" y1="130" x2="530" y2="490" stroke="#c9d4e5" stroke-width="1.5"/>
  <text x="530" y="518" font-size="12.5" fill="${C.muted}" text-anchor="middle">Forex / CFD</text>
  <text x="530" y="120" font-size="12.5" fill="${C.muted}" text-anchor="middle">Futures</text>
  <text x="140" y="315" font-size="12.5" fill="${C.muted}" text-anchor="end">Evaluation</text>
  <text x="920" y="315" font-size="12.5" fill="${C.muted}">Instant funding</text>
  ${[
    ['FTMO', 300, 210],
    ['FundedNext', 360, 255],
    ['The5ers', 400, 372],
    ['FXIFY', 455, 268],
    ['FundingPips', 285, 330],
    ['Apex', 700, 205],
    ['Topstep', 760, 250],
    ['MFF', 660, 300],
    ['MyFundedFutures', 745, 330],
    ['Take Profit Trader', 690, 372],
  ]
    .map(
      ([name, cx, cy]) => `<g>
    <circle cx="${cx}" cy="${cy}" r="${name === 'FTMO' || name === 'Apex' || name === 'Topstep' ? 9 : 6.5}" fill="${name === 'FTMO' || name === 'Apex' || name === 'Topstep' ? C.green : C.ink3}"/>
    <text x="${cx + 14}" y="${cy + 4}" font-size="12.5" fill="${C.ink}">${esc(name)}</text>
  </g>`
    )
    .join('\n  ')}
</svg>`
);

/* 8. Challenge math */
write(
  'challenge-math.svg',
  `${svgOpen(940, 500, 'Profit target and maximum loss shown as a range around the starting balance')}
  <rect width="940" height="500" fill="#fff"/>
  <text x="48" y="50" font-size="13" font-weight="800" letter-spacing="3" fill="${C.green}">THE MATH</text>
  <text x="48" y="86" font-size="27" font-weight="800" fill="${C.ink}">Target and drawdown are one equation</text>
  <rect x="48" y="140" width="844" height="150" rx="14" fill="${C.soft}" stroke="${C.line}"/>
  <line x1="70" y1="215" x2="870" y2="215" stroke="#ccd7e7" stroke-width="1.5" stroke-dasharray="5 5"/>
  <rect x="70" y="196" width="800" height="38" fill="${C.greenSoft}"/>
  <text x="470" y="172" font-size="13" font-weight="700" fill="${C.muted}" text-anchor="middle">$100,000 starting balance</text>
  <text x="470" y="222" font-size="13" font-weight="800" fill="${C.green}" text-anchor="middle">+$10,000 target (10%)</text>
  <text x="470" y="262" font-size="13" font-weight="800" fill="${C.red}" text-anchor="middle">−$10,000 max loss (10%)</text>
  <text x="48" y="340" font-size="14" fill="${C.body}">A 10% target with a 10% maximum loss means your account must survive a 1:1 risk-to-reward journey. Sizing for the loss limit, not the target, is what keeps the account alive.</text>
  ${[['1%', 'per trade · 20 losses to fail'], ['2%', 'per trade · 10 losses to fail'], ['5%', 'per trade · 4 losses to fail']]
    .map(
      ([pct, note], i) => `<g>
    <rect x="${48 + i * 288}" y="380" width="268" height="80" rx="12" fill="#fff" stroke="${C.line}"/>
    <text x="${70 + i * 288}" y="416" font-size="22" font-weight="800" fill="${i === 2 ? C.red : C.ink}">${pct}</text>
    <text x="${70 + i * 288}" y="440" font-size="12" fill="${C.muted}">${esc(note)}</text>
  </g>`
    )
    .join('\n  ')}
</svg>`
);

/* 11. Two rulebook models: percentage CFD evaluation vs dollar futures evaluation */
write(
  'rulebook-models.svg',
  `${svgOpen(1000, 540, 'FundedNext and Topstep rulebook models compared side by side across mandate, target, drawdown, daily limit, consistency and billing')}
  <defs>${gridPattern('rbm')}</defs>
  <rect width="1000" height="540" fill="${C.soft}"/>
  <rect width="1000" height="540" fill="url(#rbm)"/>
  <text x="50" y="56" font-size="13" font-weight="800" letter-spacing="3" fill="${C.green}">TWO RULEBOOK MODELS</text>
  <text x="50" y="94" font-size="29" font-weight="800" fill="${C.ink}">Same evaluation, different unit of measurement</text>
  ${[
    {
      name: 'FundedNext',
      sub: 'Percentage model · Forex and CFDs',
      x: 50,
      accent: C.green,
      rows: [
        ['Mandate', 'FX, metals, indices'],
        ['Target', '% of starting balance'],
        ['Max loss', 'Static or trailing'],
        ['Daily limit', 'Equity or balance'],
        ['Consistency', 'Plan dependent'],
        ['Billing', 'One-off per attempt'],
      ],
    },
    {
      name: 'Topstep',
      sub: 'Dollar model · CME futures',
      x: 520,
      accent: C.ink3,
      rows: [
        ['Mandate', 'Micro and full futures'],
        ['Target', 'Fixed dollar amount'],
        ['Max loss', 'Trailing threshold'],
        ['Daily limit', 'Explicit, per session'],
        ['Consistency', 'Best-day expectation'],
        ['Billing', 'Monthly subscription'],
      ],
    },
  ]
    .map(
      (p) => `<g>
    <rect x="${p.x}" y="130" width="430" height="352" rx="16" fill="#fff" stroke="${C.line}"/>
    <rect x="${p.x}" y="130" width="430" height="6" rx="3" fill="${p.accent}"/>
    <text x="${p.x + 26}" y="178" font-size="22" font-weight="800" fill="${C.ink}">${esc(p.name)}</text>
    <text x="${p.x + 26}" y="202" font-size="13" fill="${C.muted}">${esc(p.sub)}</text>
    <line x1="${p.x + 26}" y1="220" x2="${p.x + 404}" y2="220" stroke="${C.line}"/>
    ${p.rows
      .map(
        ([k, v], i) => `<text x="${p.x + 26}" y="${250 + i * 38}" font-size="12" font-weight="700" letter-spacing="1" fill="${C.ink3}">${esc(k.toUpperCase())}</text>
    <text x="${p.x + 404}" y="${250 + i * 38}" font-size="14" font-weight="600" fill="${C.ink}" text-anchor="end">${esc(v)}</text>`
      )
      .join('\n    ')}
  </g>`
    )
    .join('\n  ')}
  <text x="50" y="516" font-size="13.5" fill="${C.body}">The unit matters: a percentage target and a trailing dollar threshold fail at different moments on the same equity curve.</text>
</svg>`
);

/* 12. Which model fits which trading style */
write(
  'model-fit-flow.svg',
  `${svgOpen(980, 470, 'Decision flow matching trading style and session availability to a percentage CFD evaluation or a dollar futures evaluation')}
  <rect width="980" height="470" fill="#fff"/>
  <text x="48" y="50" font-size="13" font-weight="800" letter-spacing="3" fill="${C.green}">CHOOSING A MODEL</text>
  <text x="48" y="86" font-size="27" font-weight="800" fill="${C.ink}">Start from your session, not the headline target</text>
  <rect x="48" y="120" width="240" height="86" rx="14" fill="${C.soft}" stroke="${C.line}"/>
  <text x="72" y="156" font-size="15" font-weight="800" fill="${C.ink}">Can you watch a</text>
  <text x="72" y="178" font-size="15" font-weight="800" fill="${C.ink}">US session daily?</text>
  <text x="72" y="196" font-size="12" fill="${C.muted}">RTH, 9:30–16:00 ET</text>
  ${[
    ['Yes', 'Futures evaluation', 'Dollar rules, session-based\nmarket, no weekend gap', 560, 150],
    ['No', 'Forex evaluation', 'Percentage rules, 24-hour\nmarket, overnight holds', 560, 300],
  ]
    .map(
      ([answer, title, body, x, y]) => `<g>
    <rect x="${x}" y="${y}" width="372" height="112" rx="14" fill="#fff" stroke="${C.line}"/>
    <text x="${x + 20}" y="${y + 30}" font-size="12" font-weight="800" letter-spacing="2" fill="${C.green}">${esc(answer.toUpperCase())}</text>
    <text x="${x + 20}" y="${y + 58}" font-size="17" font-weight="800" fill="${C.ink}">${esc(title)}</text>
    ${body
      .split('\n')
      .map((l, i) => `<text x="${x + 20}" y="${y + 82 + i * 17}" font-size="12.5" fill="${C.muted}">${esc(l)}</text>`)
      .join('\n    ')}
  </g>`
    )
    .join('\n  ')}
  <path d="M288 163 C380 163 420 206 556 206" fill="none" stroke="${C.ink3}" stroke-width="2" stroke-linecap="round"/>
  <path d="M548 200 l10 6 -10 6" fill="none" stroke="${C.ink3}" stroke-width="2" stroke-linecap="round"/>
  <path d="M288 163 C380 163 420 356 556 356" fill="none" stroke="${C.ink3}" stroke-width="2" stroke-linecap="round"/>
  <path d="M548 350 l10 6 -10 6" fill="none" stroke="${C.ink3}" stroke-width="2" stroke-linecap="round"/>
  <text x="48" y="440" font-size="13" fill="${C.muted}">Session availability is the constraint that decides which rulebook you can actually trade, so it belongs first in any comparison.</text>
</svg>`
);

/* ------------------------------- social cards ------------------------------ */

function wrapWords(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > maxChars && line) {
      lines.push(line.trim());
      line = w;
    } else {
      line = (line + ' ' + w).trim();
    }
  }
  if (line) lines.push(line.trim());
  return lines;
}

function ogCard({ title, kicker, slug }) {
  const len = title.length;
  const size = len > 96 ? 44 : len > 72 ? 50 : 56;
  const maxChars = Math.floor(1040 / (size * 0.55));
  const lines = wrapWords(title, maxChars).slice(0, 3);
  const startY = 330 - (lines.length - 1) * (size * 0.58);

  return `${svgOpen(1200, 630, title)}
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0a1120"/>
      <stop offset="0.55" stop-color="#122340"/>
      <stop offset="1" stop-color="#0c2a22"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.82" cy="0.1" r="0.75">
      <stop offset="0" stop-color="#0e9f6e" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#0e9f6e" stop-opacity="0"/>
    </radialGradient>
    ${gridPattern('ogg', 48, '#1b2c47')}
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#ogg)" opacity="0.55"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g transform="translate(72,64)">
    <rect width="46" height="46" rx="12" fill="#13233c" stroke="#2b4467"/>
    <path d="M11 34 L22 22 L29 29 L36 16" fill="none" stroke="#57e0ae" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <text x="132" y="94" font-family="${FONT}" font-size="24" font-weight="800" fill="#ffffff" letter-spacing="-0.3">Elite<tspan fill="#57e0ae">PropX</tspan></text>
  <text x="72" y="196" font-family="${FONT}" font-size="17" font-weight="800" fill="#57e0ae" letter-spacing="4">${esc(kicker)}</text>
  ${lines
    .map(
      (l, i) =>
        `<text x="72" y="${startY + i * (size * 0.58 + 12)}" font-family="${FONT}" font-size="${size}" font-weight="800" fill="#ffffff" letter-spacing="-1">${esc(l)}</text>`
    )
    .join('\n  ')}
  <rect x="72" y="530" width="86" height="5" rx="2.5" fill="#0e9f6e"/>
  <text x="72" y="574" font-family="${FONT}" font-size="20" fill="#9fb0c9">elitepropx.com</text>
  <text x="1128" y="574" font-family="${FONT}" font-size="20" font-weight="700" fill="#57e0ae" text-anchor="end">Flat $220 · Retries covered</text>
</svg>`;
}

/* 9. Leverage versus risk */
write(
  'leverage-vs-risk.svg',
  `${svgOpen(1000, 520, 'Three accounts with the same one percent risk and different leverage, showing margin required and distance to stop')}
  <defs>${gridPattern('lev')}</defs>
  <rect width="1000" height="520" fill="${C.soft}"/>
  <rect width="1000" height="520" fill="url(#lev)"/>
  <text x="50" y="56" font-size="13" font-weight="800" letter-spacing="3" fill="${C.green}">LEVERAGE VERSUS RISK</text>
  <text x="50" y="94" font-size="29" font-weight="800" fill="${C.ink}">Same 1% risk, three different margin requirements</text>
  ${[
    ['1:30', 'Forex retail', '$3,300', '62 pips', 50],
    ['1:100', 'Forex pro', '$1,000', '62 pips', 358],
    ['1:10', 'Futures', '$10,000', '62 pips', 666],
  ]
    .map(([ratio, label, margin, stop, x]) => `<g>
    <rect x="${x}" y="140" width="284" height="300" rx="16" fill="#fff" stroke="${C.line}"/>
    <text x="${x + 24}" y="196" font-size="36" font-weight="800" fill="${C.green}">${ratio}</text>
    <text x="${x + 24}" y="222" font-size="15" font-weight="700" fill="${C.muted}">${esc(label)}</text>
    <line x1="${x + 24}" y1="244" x2="${x + 260}" y2="244" stroke="${C.line}"/>
    <text x="${x + 24}" y="282" font-size="13" font-weight="700" letter-spacing="1" fill="${C.ink3}">MARGIN REQUIRED</text>
    <text x="${x + 24}" y="316" font-size="26" font-weight="800" fill="${C.ink}">${esc(margin)}</text>
    <text x="${x + 24}" y="366" font-size="13" font-weight="700" letter-spacing="1" fill="${C.ink3}">RISK IF STOP HITS</text>
    <text x="${x + 24}" y="400" font-size="26" font-weight="800" fill="${C.ink}">$1,000</text>
  </g>`)
    .join('\n  ')}
  <text x="50" y="482" font-size="13" fill="${C.muted}">Risk is set by position size and stop distance, not by the leverage on the account — leverage only changes the margin locked up.</text>
</svg>`
);

/* 10. How a daily loss limit is measured */
write(
  'daily-drawdown.svg',
  `${svgOpen(1000, 540, 'The same losing price path measured on floating equity and on closed balance, showing that the equity rule triggers first')}
  <rect width="1000" height="540" fill="#fff"/>
  <text x="50" y="52" font-size="13" font-weight="800" letter-spacing="3" fill="${C.green}">DAILY LOSS MEASUREMENT</text>
  <text x="50" y="90" font-size="28" font-weight="800" fill="${C.ink}">Why the same day breaches one rule and survives the other</text>
  ${[
    ['Equity, including floating', 'Breach at the worst moment', '#e5484d', 0],
    ['Closed balance only', 'Breach only on a closed loss', '#0e9f6e', 1],
  ]
    .map(([title, sub, colour, i]) => {
      const y = 130 + i * 190;
      const path = '20,90 90,42 160,116 230,64 300,150 370,96 440,170 510,120 580,196 650,140 720,214 790,158';
      const pts = path
        .split(' ')
        .map((p) => p.split(',').map((v) => Number(v)));
      const sx = 90;
      const sy = y + 40;
      const scaled = pts.map(([a, b]) => `${sx + a * 1.05},${sy + b * 0.72}`).join(' ');
      return `<g>
    <rect x="50" y="${y - 26}" width="900" height="164" rx="14" fill="${C.soft}" stroke="${C.line}"/>
    <text x="76" y="${y + 4}" font-size="17" font-weight="800" fill="${C.ink}">${esc(title)}</text>
    <text x="76" y="${y + 28}" font-size="13" fill="${C.muted}">${esc(sub)}</text>
    <polyline points="${scaled}" fill="none" stroke="${colour}" stroke-width="3" stroke-linejoin="round"/>
    <line x1="${sx}" y1="${sy + 128}" x2="${sx + 840}" y2="${sy + 128}" stroke="${colour}" stroke-dasharray="6 6" stroke-width="2"/>
    <text x="${sx + 846}" y="${sy + 132}" font-size="12" font-weight="700" fill="${colour}">limit</text>
  </g>`;
    })
    .join('\n  ')}
  <text x="50" y="508" font-size="13" fill="${C.muted}">Most firms measure the daily limit on equity, so an open losing position counts against the budget before it is closed.</text>
</svg>`
);

write(
  'og/default.svg',
  ogCard({
    title: 'Pass your prop firm challenge for a flat $220',
    kicker: 'PROP FIRM CHALLENGE PASSING',
    slug: 'default',
  })
);

/* Per-page cards, mirroring build.js naming */
const SRC = path.join(ROOT, 'src', 'pages');
const pages = walk(SRC).map((file) => {
  const { data } = parseFrontMatter(fs.readFileSync(file, 'utf8'));
  const rel = path.relative(SRC, file).split(path.sep).join('/');
  const p = data.path || '/' + rel;
  return {
    path: p,
    title: data.h1 || data.title || 'ElitePropX',
    kicker: data.kicker || (data.type === 'article' ? 'PROP FIRM GUIDE' : 'ELITEPROPX'),
  };
});

for (const p of pages) {
  const slug = pageSlug(p.path);
  const title = p.title.replace(/\s*\|\s*ElitePropX.*$/i, '').replace(/\s*-\s*ElitePropX.*$/i, '');
  write(`og/${slug}.svg`, ogCard({ title, kicker: String(p.kicker).toUpperCase(), slug }));
}

const diagrams = fs.readdirSync(IMG).filter((f) => f.endsWith('.svg')).length;
console.log(`Generated brand assets, ${diagrams} SVGs and ${pages.length} social cards → docs/assets/img`);
