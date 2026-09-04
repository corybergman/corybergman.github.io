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
- Global tokens (colors, fonts, spacing): `src/styles/global.css`
- Fonts (IBM Plex via Astro's Google provider): `astro.config.mjs` + `src/components/BaseHead.astro`
- Topographic masthead SVG (tall/short): `src/components/TopoMasthead.astro`
- Header + nav (home/sub variants, active state): `src/components/SiteHeader.astro` — the nav is **Home · Topics · Projects · Speaking · About · RSS**, driven by a single `links` array so the home and sub headers can't drift apart. To add a tab: add an entry there, widen the exported `NavKey` union, and pass the matching `active="…"` from the page. `NavKey` is re-used by `BaseLayout`, so a typo in `active` is a type error. At ≤700px the nav drops to 13px/13px-gap so all six links plus RSS still fit one row on a 375px phone (they wrap 4+2 at 320px).
- Shared page shell (masthead + header + slot): `src/layouts/BaseLayout.astro`
- Feed row (excerpt clamped to 3 lines, pulled from post body): `src/components/PostListItem.astro`
- Avatar (circular headshot, `src/assets/avatar.jpg`): `src/components/Avatar.astro`
- Post layout (date, H1, body, tags, prev/all nav): `src/layouts/BlogPost.astro`
- Home feed: `src/pages/index.astro` · About: `src/pages/about.astro`
- 404 page: `src/pages/404.astro` (full-size annoyed avatar from `src/assets/avatar.jpg`; GitHub Pages serves the built `404.html` for unknown paths)
- Projects page (Companies + Writing + Press index): `src/pages/projects.astro` — fill the `companies` / `writing` / `press` arrays at the top of the file (each: title, url, source?, date?, description?). Empty section shows "Coming soon."
- Speaking page (pitch + engagements): `src/pages/speaking.astro` — fill the `engagements` array (each: event, url?, venue?, date?, description?).
- Post URLs: native posts live at `/blog/<slug>/` (`src/pages/blog/[...slug].astro`). Posts migrated from the old Tumblr blog carry a `tumblrId` in frontmatter and are served at their original `/post/<tumblrId>/<slug>/` path (`src/pages/post/[id]/[...slug].astro`) so search-indexed links don't break. Always build post links with the `postUrl(post)` helper in `src/consts.ts` — never hardcode `/blog/${post.id}/`.
- Tag pages: `/tags/` index (`src/pages/tags/index.astro`, all tags by frequency) and `/tags/<slug>/` archives (`src/pages/tags/[tag].astro`, posts per tag). The **routes stay `/tags/`** (don't rename them — they're linked from post chips and llms.txt) but the UI calls them **Topics**, matching the nav label. Tag chips on posts link here via the `tagSlug()` helper in `src/consts.ts` — always slug tags with it so links and routes stay in sync.
- Feed excerpt helper (opening prose of a post body): `src/lib/excerpt.ts` — shared by the home feed and tag archives.
- RSS feed: `src/pages/rss.xml.js` — full-content feed. Renders each post's real HTML via Astro's container API and absolutizes root-relative links; `content` carries the full post, `description` stays the teaser.
- Frontmatter schema (title, description=excerpt, pubDate, tags): `src/content.config.ts`
- Google Analytics (gtag G-7S4QWH00Z4) + schema.org Person JSON-LD: `src/components/BaseHead.astro`
- OG / social preview images: auto-generated per post at build. Card design + renderer (satori → SVG → sharp → PNG) in `src/og/card.ts`; fonts in `src/og/fonts/` (IBM Plex woff). Per-post endpoint `src/pages/og/[slug].png.ts` emits `/og/<post-id>.png`; `src/pages/og/default.png.ts` is the fallback card for non-post pages. A post can override with an `image` frontmatter field (path or URL). `BaseHead` wires `og:image`/`twitter:image` (summary_large_image) and, on posts (`article` prop), `og:type=article` + a `BlogPosting` JSON-LD block. Post pages thread `image`/`article`/dates/tags via `BlogPost` → `BaseLayout` → `BaseHead`; routes pass `id={post.id}`.
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
