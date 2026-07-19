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

## Site-wide settings

- Site title / bio / social links: `src/consts.ts`
- Global tokens (colors, fonts, spacing): `src/styles/global.css`
- Fonts (IBM Plex via Astro's Google provider): `astro.config.mjs` + `src/components/BaseHead.astro`
- Topographic masthead SVG (tall/short): `src/components/TopoMasthead.astro`
- Header + nav (home/sub variants, active state): `src/components/SiteHeader.astro`
- Shared page shell (masthead + header + slot): `src/layouts/BaseLayout.astro`
- Feed row: `src/components/PostListItem.astro`
- Subscribe form (inline/card, set provider `action`): `src/components/SubscribeForm.astro`
- Post layout (date, H1, body, tags, prev/all nav, subscribe): `src/layouts/BlogPost.astro`
- Home feed: `src/pages/index.astro` · About: `src/pages/about.astro`
- Post route + prev-post logic: `src/pages/blog/[...slug].astro` (URLs are `/blog/<slug>/`)
- RSS feed: `src/pages/rss.xml.js`
- Frontmatter schema (title, description=excerpt, pubDate, tags): `src/content.config.ts`
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

The site auto-deploys on `git push` once connected to Cloudflare Pages or
Netlify. Set `site` in `astro.config.mjs` to the final domain first.

## Astro documentation

Full docs: https://docs.astro.build — see the guides on
[content collections](https://docs.astro.build/en/guides/content-collections/),
[routing](https://docs.astro.build/en/guides/routing/),
[components](https://docs.astro.build/en/basics/astro-components/), and
[styling](https://docs.astro.build/en/guides/styling/).
