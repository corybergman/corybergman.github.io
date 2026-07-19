// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// Live at the GitHub user site for now. When corybe.com is pointed here,
	// change this to 'https://corybe.com' and add a CNAME (see AGENTS.md).
	// This drives canonical URLs and the RSS feed. Base stays '/' either way
	// because a user site (corybergman.github.io) serves from the root.
	site: 'https://corybergman.github.io',
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
