// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// Custom domain. The public/CNAME file registers corybe.com with GitHub
	// Pages on deploy. This drives canonical URLs and the RSS feed; base stays
	// '/' because an apex domain serves from the root.
	site: 'https://corybe.com',
	// The old topic index moved to /writing/ on 2026-09-09. Static output
	// emits a meta-refresh page at /tags/index.html. The per-topic archives
	// at /tags/<slug>/ are untouched.
	redirects: { '/tags': '/writing' },
	integrations: [mdx(), sitemap()],
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'IBM Plex Sans',
			cssVariable: '--font-sans',
			weights: [400, 500, 600],
			fallbacks: ['sans-serif'],
		},
		{
			provider: fontProviders.google(),
			name: 'IBM Plex Mono',
			cssVariable: '--font-mono',
			weights: [400, 500],
			fallbacks: ['monospace'],
		},
	],
});
