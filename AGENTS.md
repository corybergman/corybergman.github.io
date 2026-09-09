# Cory's Blog — how to work on this site

This is a personal blog built with **Astro** (the official `blog` template).
There is no CMS and no database. Posts are Markdown files; publishing is a git push.

## Adding a new post

Create a file in `src/content/blog/<slug>.md`. The filename becomes the URL
(`/blog/<slug>/`). Use this frontmatter:

```markdown
---
title: 'Post title'
description: 'One-line summary — this is the excerpt shown in the homepage feed.'
pubDate: 'Jul 19 2026'          # required. Format: MMM DD YYYY
updatedDate: 'Jul 20 2026'      # optional
tags: ['media', 'mobile']       # optional — rendered as chips at the end of the post
---

Body in Markdown.
```

- `pubDate` controls sort order (newest first). It is required.
- `description` is reused as the feed excerpt, so write it as a real teaser.
- `tags` render as chips under the post and become RSS categories.
- For components/interactivity inside a post, use `.mdx` instead of `.md`.

## Design

The site follows a design handoff: a topographic trail-map masthead, IBM Plex
Sans/Mono type, and pine-green accents. Three views — homepage feed, single
post, About. Source of truth for the look is `~/Documents/design_handoff_corybe_site/`.

All colors, spacing, and type live as CSS variables in `src/styles/global.css`
(`--pine`, `--ink`, `--contour`, `--frame-max`, etc.). Change the design there
first; components reference the variables.

**Dark mode** follows the reader's system setting — there is no toggle UI (yet).
The complete light palette is declared on bare `:root`; the dark palette
redefines those same names twice, in `@media (prefers-color-scheme: dark)`
(guarded as `:root:not([data-theme='light'])`) and in `:root[data-theme='dark']`.
That second block is deliberate: dropping in a toggle later means writing
`data-theme` onto `<html>` and nothing else.

Rules when adding styles:
- **Never hardcode a color in a component.** Use a token, or add one to all
  three blocks in `global.css`. A color defined only inside a media query
  breaks the other theme.
- Photos (masthead, avatar) carry `filter: var(--photo-filter)`, which dims
  them slightly in dark mode so they don't glare. Apply it to any new photo.
- `BaseHead.astro` ships a matching pair of `theme-color` meta tags.

## Site-wide settings

- Site title / bio / social links: `src/consts.ts`
- Global tokens (colors, fonts, spacing): `src/styles/global.css`. `--frame-pad` steps 104px → **48px at ≤950px** → 24px at ≤700px; the 48px step is load-bearing (without it the home hero portrait wraps under the text at ~925px). `--faint` (light) was darkened to `#6f6b64` on 2026-09-08 so 12.5px mono dates clear 4.5:1 — don't lighten it back.
- Fonts (IBM Plex via Astro's Google provider): `astro.config.mjs` + `src/components/BaseHead.astro`
- Masthead photo (tall/short + per-page override): `src/components/TopoMasthead.astro`. `variant="tall"` → `masthead1.png` (homepage), `variant="short"` → `masthead2.png` (everywhere else). A page can override both by passing `masthead={…}` to `BaseLayout`, which forwards it as TopoMasthead's `image` prop — **About does this** with `src/assets/masthead-about.jpg` (the Seattle skyline). Supply overrides at **1800×400** (2× the 900×200 display size) or they look soft on retina; the 4.5:1 ratio matches the other two.
  - `masthead-about.jpg` was cut from the 4032×3024 original at `~/Documents/downtownseattle.HEIC` (band `top:268, height:896` at full width, resized to 1800×400, mozjpeg q88 → ~130KB). sharp can't decode that HEIC (iref security limit), so convert first: `sips -s format png in.HEIC --out out.png`. The original is **not** in the repo, so keep that HEIC if you want to re-crop later.
- Header + nav (active state): `src/components/SiteHeader.astro` — **one header for every page** since the 2026-09-08 home redesign: name (22px link) left, nav right, `flex-wrap`, hairline below, **no avatar** (removed everywhere on purpose — the headshot now appears in the home hero and on About). The current page is `--ink`, the rest `--muted`; there is no underline. The nav is **Home · Topics · Projects · Speaking · About** (RSS lives in the footer), driven by a single `links` array. To add a tab: add an entry there, widen the exported `NavKey` union, and pass the matching `active="…"` from the page. `NavKey` is re-used by `BaseLayout`, so a typo in `active` is a type error. At ≤700px the nav drops to 13px/13px-gap so the links fit one row under the name on a 375px phone. The home page's H1 is in its hero, not the header.
- Site footer (social links with brand icons + copyright/RSS): `src/components/SiteFooter.astro`, rendered for every page by `BaseLayout` after the slot. Order is RSS · LinkedIn · Twitter · Bluesky · Threads · GitHub — **no Email**, which lives only on the About page under "Contact me". RSS leads the row and is not a social account; it moved out of the nav so the header carries only site sections. The `<link rel="alternate" type="application/rss+xml">` autodiscovery tag in `BaseHead` is unaffected — feed readers find the feed through that, not the visible link. The Twitter label is just "Twitter" here because the X logo sits next to it; the About page's chip still reads "X/Twitter", since it has no icon to carry the X. Icons are **inlined 24×24 path data** in the `ICON` map — no icon package, no extra request. Four came from `simple-icons` (installed with `--no-save`, paths extracted, package removed, so `package.json` is untouched); **`linkedin` is hand-drawn** because simple-icons dropped LinkedIn at the company's request. They fill with `currentColor` at 0.72 opacity so they work in both themes and brighten on hover. Links come from `SOCIAL` in `src/consts.ts` — the same source the About page's "Elsewhere" chips use, so edit a handle in one place. Pass `footerSocial={false}` to `BaseLayout` to hide the social row on a page that already lists them; **About does this**, otherwise the six links appear twice a few pixels apart.
- Shared page shell (masthead + header + slot + footer): `src/layouts/BaseLayout.astro`
- Tag-archive post row (excerpt clamped to 3 lines, pulled from post body): `src/components/PostListItem.astro` — used **only by `/tags/<slug>/`** now; the home page has its own compact rows (below).
- Headshots: the home hero shows the full 2026 portrait `src/assets/corybe_2026.jpg` via `astro:assets` (`widths={[295, 590]}`, CSS-cropped to a 250×225 rounded box with `object-position: 50% 8%` so the hands are out of frame); About uses `src/assets/headshot-2026.jpg`, an 800×800 face crop of that same portrait (sharp `extract({left:230, top:80, width:660, height:660})`, mozjpeg q86); the About "Download headshot" link serves `public/corybergman.jpg` (the full portrait, metadata stripped) and the OG-card avatar in `src/og/card.ts` reads `headshot-2026.jpg`. The old candid selfie `src/assets/avatar.jpg` is used **only by the 404 page** (the joke depends on that face); don't swap it there. `Avatar.astro` was deleted with the header avatar.
- Post layout (date, H1, body, tags, prev/all nav): `src/layouts/BlogPost.astro`
- Home page: `src/pages/index.astro` — **redesigned 2026-09-08** from the Claude Design handoff at `~/Documents/design_handoff_corybe_home/` (README = spec; `Corybe Home.dc.html` = reference). Top to bottom: hero (H1 "Trusted information for people in harm's way.", lede, Factal line, "More about me →", portrait), **Where I focus** (three `auto-fit` columns, each a sentence + link; the BUILD/VERIFY/APPLY labels and per-column headings were deliberately removed in design — don't reintroduce), the **Speaking card** (the only enclosed block; left = pitch + "Learn more about speaking →", right = Upcoming: Global Security Briefing, `factal.com/promo/globalsecuritybriefing/`; the hairline between the halves appears only ≤780px when the grid wraps), then **Writing**: the newest `RECENT_COUNT` (5) posts as date / title / one-line excerpt, then "Browse the full archive, back to 2011 →" → `/tags/`. **Excerpts are the post's `description` frontmatter**, so keep new descriptions to roughly 100–120 characters — they double as the meta description and RSS teaser. The middle focus link is labeled "More about journalism" and points at `/tags/journalism/` (the design had "verification", which has no tag; Cory chose the relabel). All hero/focus/speaking copy was written by Cory — do not reword. · About: `src/pages/about.astro`
- **No archive toggle and no pagination on the home page** (since 2026-09-08). The old `<details>` "Earlier writing" toggle went with the redesign; the full list of posts is reachable from the tag index at `/tags/` and each `/tags/<slug>/` archive, and every post keeps its one permanent URL. If a chronological all-posts page is ever wanted again, add it as a new route rather than reviving the toggle.
- 404 page: `src/pages/404.astro` (full-size annoyed candid from `src/assets/avatar.jpg` — deliberately NOT the studio headshot the rest of the site uses; GitHub Pages serves the built `404.html` for unknown paths)
- Projects page (Companies + Writing + Press index): `src/pages/projects.astro` — fill the `writing` / `press` arrays at the top of the file (each: title, url, source?, date?, description?). Empty section shows "Coming soon."
- **Companies** are **not** in `projects.astro`. They live in `src/lib/companies.ts` (slug, title, url?, date?, description?, logo?) because each one also gets its own page. The `/projects` index shows logo, name, date, a two-line teaser and a "Read more" link, all pointing at the company page; the full description appears only on that page. The teaser is the description with its markup stripped (`companyPlainText()`), truncated by a CSS `line-clamp: 2` rather than a character count — links are dropped so they don't compete with "Read more". Same treatment as the post excerpts on the home feed, two lines instead of three. Route: `src/pages/projects/[company].astro` → `/projects/<slug>/`. Always build links with the `companyUrl()` helper, and note `slug` is **explicit, not derived** — those URLs are permanent and auto-slugging "Breaking News (NBC News)" would be ugly. A company with no `url` (Breaking News) simply gets no "Visit" link. `llms.txt.ts` imports the same array, so the AI index lists the company pages automatically.
- Speaking page (pitch + engagements): `src/pages/speaking.astro` — fill the `engagements` array (each: event, url?, venue?, date?, description?).
- Post URLs: native posts live at `/blog/<slug>/` (`src/pages/blog/[...slug].astro`). Posts migrated from the old Tumblr blog carry a `tumblrId` in frontmatter and are served at their original `/post/<tumblrId>/<slug>/` path (`src/pages/post/[id]/[...slug].astro`) so search-indexed links don't break. Always build post links with the `postUrl(post)` helper in `src/consts.ts` — never hardcode `/blog/${post.id}/`.
- Tag pages: `/tags/` index (`src/pages/tags/index.astro`, all tags by frequency) and `/tags/<slug>/` archives (`src/pages/tags/[tag].astro`, posts per tag). The **routes stay `/tags/`** (don't rename them — they're linked from post chips and llms.txt) but the UI calls them **Topics**, matching the nav label. Tag chips on posts link here via the `tagSlug()` helper in `src/consts.ts` — always slug tags with it so links and routes stay in sync.
- Feed excerpt helper (opening prose of a post body): `src/lib/excerpt.ts` — shared by the home feed and tag archives.
- RSS feed: `src/pages/rss.xml.js` — full-content feed. Renders each post's real HTML via Astro's container API and absolutizes root-relative links; `content` carries the full post, `description` stays the teaser.
- Frontmatter schema (title, description=excerpt, pubDate, tags): `src/content.config.ts`
- Google Analytics (gtag G-7S4QWH00Z4) + schema.org Person JSON-LD: `src/components/BaseHead.astro`
- OG / social preview images: auto-generated per post at build. Card design + renderer (satori → SVG → sharp → PNG) in `src/og/card.ts`; fonts in `src/og/fonts/` (IBM Plex woff). Per-post endpoint `src/pages/og/[slug].png.ts` emits `/og/<post-id>.png`; `src/pages/og/default.png.ts` is the fallback card, now used only by the homepage and 404. **Standing pages have their own cards**: titles live in `src/lib/og-cards.ts` (the four standing pages plus one per company, pulled from the same `companies` array), the endpoint is `src/pages/og/page/[slug].png.ts` → `/og/page/<slug>.png`, and each page passes `image={pageCard('<slug>')}` to `BaseLayout`. Tag archives reuse the `topics` card rather than generating one per tag. To add a card, add a slug/title to `og-cards.ts` and pass `pageCard()` from the page — the two must stay in sync, since an unknown slug 404s. A post can override with an `image` frontmatter field (path or URL). `BaseHead` wires `og:image`/`twitter:image` (summary_large_image) and, on posts (`article` prop), `og:type=article` + a `BlogPosting` JSON-LD block. Post pages thread `image`/`article`/dates/tags via `BlogPost` → `BaseLayout` → `BaseHead`; routes pass `id={post.id}`.
- AI discoverability index: `/llms.txt`, **generated at build time** by `src/pages/llms.txt.ts` from the blog collection. It lists every post (title, URL, date, description), the tag vocabulary, and the standing pages. **Never hand-edit it and never re-add a static `public/llms.txt`** — publishing a post updates the index automatically on the next deploy. Only edit `src/pages/llms.txt.ts` when the *bio, standing pages or external links* change.
- Favicons / app icons: the mark is **"CB"** in IBM Plex Sans SemiBold on the brand blue (`#1d5f9e`), pre-outlined as vector paths so no webfont is needed at render time. Every file in `public/` is **generated** by `scripts/generate-icons.mjs` (`node scripts/generate-icons.mjs`, sharp only, no new deps) — `favicon.svg`, `favicon.ico` (16/32/48), `apple-touch-icon.png` (180, full bleed), `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`. **Don't hand-edit those files**; edit `MARK_PATH`/geometry in the script and re-run. `favicon.ico` **must stay at the site root** — DuckDuckGo, Bing, Slack and feed readers only look there and ignore an SVG-only favicon (this was why the icon was missing from search results). `<link>` tags live in `src/components/BaseHead.astro`; icon list + theme colour in `public/site.webmanifest`.
- Final domain (for RSS + canonical URLs): `site` in `astro.config.mjs`

## Development

Start the dev server in background mode:

```
astro dev --background
```

Manage it with `astro dev stop`, `astro dev status`, and `astro dev logs`.

Other commands:

```
npm run build    # production build into ./dist (also type-checks content)
npm run preview  # preview the built site
```

## Publishing

Live at **https://corybe.com** via **GitHub Pages** (repo
`corybergman/corybergman.github.io`). Every push to `main` triggers
`.github/workflows/deploy.yml`, which builds on Node 22 and deploys. So:
edit → commit → `git push origin main` → live in ~1 minute. Custom domain is
set by `public/CNAME`; HTTPS is enforced.

## Astro documentation

Full docs: https://docs.astro.build — see the guides on
[content collections](https://docs.astro.build/en/guides/content-collections/),
[routing](https://docs.astro.build/en/guides/routing/),
[components](https://docs.astro.build/en/basics/astro-components/), and
[styling](https://docs.astro.build/en/guides/styling/).
