# elitepropx.com — rebuilt static site

Static site for **ElitePropX** (prop firm challenge passing), rebuilt from the Google-indexed URL map after the original files were lost. Built to be deployed on GitHub Pages with the existing `elitepropx.com` domain from Namecheap.

No framework, no dependencies, no build server: plain HTML, one CSS file, one small JS file, and locally generated SVG illustrations.

## Commands

```bash
npm run images    # regenerate brand assets, diagrams and social cards (SVG)
npm run build     # build src/pages -> docs/
npm run check     # QA: word counts, meta, JSON-LD, links, images, sitemap
npm run serve     # preview at http://localhost:4173
```

`npm run deploy:build` runs images → build → check in order.

## Layout

```
src/pages/**/*.html     page content + front matter (source of truth)
src/lib/                layout shell, site config, front-matter parser
build.js                wraps pages, writes sitemap/robots/CNAME/404/blog index
tools/gen-images.js     SVG logos, 8 editorial diagrams, per-page OG cards
tools/check.js          pre-deploy QA (fails on any error)
docs/                   build output — this is what GitHub Pages serves
```

Front matter keys: `title`, `desc`, `path`, `type` (`page` or `article`), `h1`, `kicker`, `crumb`, `section`, `sectionUrl`, `date`, `updated`, `priority`, `keywords`, `noindex`, `schemaService`.

## Automatic SEO output

For every page the builder emits: canonical URL, meta description, Open Graph and Twitter cards, breadcrumb structured data, and a per-page 1200×630 social card. Additionally:

- `Organization` + `WebSite` schema site-wide
- `Service` schema with the $220 offer on the homepage
- `BlogPosting` schema with `wordCount`/`datePublished` on articles
- `FAQPage` schema derived automatically from `<details class="faq">` blocks
- `sitemap.xml`, `robots.txt`, `CNAME`, `site.webmanifest`, styled `404.html`

## Adding a page

1. Create `src/pages/<path>.html` with front matter (copy an existing page as a template).
2. Use `<details class="faq"><summary>Question?</summary><div class="faq-a"><p>Answer.</p></div></details>` for FAQs — schema is generated from it.
3. Run `npm run deploy:build`. The checker fails the build if the page is under 3,500 words, has a missing canonical, one too many H1s, or links to a page that does not exist.

## Deploy to GitHub Pages

**1. Create the repository and push**

```bash
git init
git add .
git commit -m "Rebuild elitepropx.com"
git branch -M main
git remote add origin https://github.com/<your-user>/elitepropx.git
git push -u origin main
```

**2. Enable Pages**

Repository → Settings → Pages → *Source: Deploy from a branch* → *Branch: `main`* → *Folder: `/docs`* → Save.
`docs/CNAME` already contains `elitepropx.com`, so the custom domain is picked up automatically.

**3. Point Namecheap DNS at GitHub Pages**

In Namecheap: Domain List → elitepropx.com → Manage → Advanced DNS.

Delete the existing `A` record that points at `51.20.251.145` (the dead host), then add:

| Type | Host | Value | TTL |
| --- | --- | --- | --- |
| A | @ | 185.199.108.153 | Automatic |
| A | @ | 185.199.109.153 | Automatic |
| A | @ | 185.199.110.153 | Automatic |
| A | @ | 185.199.111.153 | Automatic |
| CNAME | www | `<your-user>.github.io` | Automatic |

Optional IPv6:

| Type | Host | Value |
| --- | --- | --- |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |

Leave any existing MX/TXT records alone. Do not add a `CNAME` record for `@`.

**4. Enforce HTTPS**

After DNS propagates (minutes to a few hours), Settings → Pages → tick *Enforce HTTPS*. The certificate is issued automatically.

**5. Tell Google**

In Search Console: submit `https://elitepropx.com/sitemap.xml`, then use *URL Inspection → Request indexing* for the rebuilt URLs. Keep the old URLs identical to the originals so existing rankings transfer instead of resetting.

## Notes

- `support@elitepropx.com` appears in the layout, contact page, privacy and terms pages. Change it in `src/lib/site.js` and rebuild if that address is wrong.
- Business facts (price, pass counters, supported firms) live in `src/lib/site.js` and in page copy. Keep them consistent — structured data is generated from the same figures.
- `tools/check.js` must exit 0 before deploying. It is the guard against thin pages, broken internal links and missing images.
