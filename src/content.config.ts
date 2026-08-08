import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: () =>
		z.object({
			title: z.string(),
			// `description` doubles as the excerpt shown in the homepage feed.
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			// Optional tag chips shown at the bottom of a post.
			tags: z.array(z.string()).default([]),
			// Set only on posts migrated from the old Tumblr blog. When present,
			// the post is served at its original `/post/<tumblrId>/<slug>/` URL
			// (matching what search engines indexed) instead of `/blog/<slug>/`.
			tumblrId: z.string().optional(),
			// Set on posts republished from Medium. Points rel=canonical at the
			// original Medium URL so search engines credit that copy, not this one.
			canonical: z.string().url().optional(),
		}),
});

export const collections = { blog };
