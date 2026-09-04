import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SOCIAL, postUrl, tagSlug } from '../consts';

// /llms.txt — a plain-text index of this site for AI crawlers and assistants.
// GENERATED AT BUILD TIME from the blog collection, so it can never fall out of
// date: publish a post and the next deploy lists it automatically. Do not
// hand-maintain a copy in public/ — this route is the single source of truth.

const SITE = 'https://corybe.com';

// Format a date the way the site does elsewhere: "Aug 15, 2026".
const fmt = (date: Date) =>
	date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		timeZone: 'UTC',
	});

// One list entry per the llms.txt convention: - [name](url): description
const line = (post: {
	id: string;
	data: {
		title: string;
		description: string;
		pubDate: Date;
		tumblrId?: string;
		canonical?: string;
	};
}) => {
	const url = `${SITE}${postUrl(post)}`;
	const origin = post.data.canonical
		? ` (originally published on Medium: ${post.data.canonical})`
		: '';
	return `- [${post.data.title}](${url}) — ${fmt(post.data.pubDate)}: ${post.data.description}${origin}`;
};

export const GET: APIRoute = async () => {
	const posts = (await getCollection('blog')).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);

	// Posts migrated from the old Tumblr blog carry a `tumblrId` and form the
	// tail of the feed; split there so the archive reads as an archive.
	const recent = posts.filter((p) => !p.data.tumblrId);
	const archive = posts.filter((p) => p.data.tumblrId);

	// Tag vocabulary, most-used first — a topic map of the whole archive.
	const counts = new Map<string, { tag: string; count: number }>();
	for (const post of posts) {
		for (const tag of post.data.tags ?? []) {
			const slug = tagSlug(tag);
			const entry = counts.get(slug) ?? { tag, count: 0 };
			entry.count += 1;
			counts.set(slug, entry);
		}
	}
	const tags = [...counts.entries()]
		.map(([slug, { tag, count }]) => ({ slug, tag, count }))
		.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));

	const archiveYears = archive.length
		? ` (${archive[archive.length - 1].data.pubDate.getUTCFullYear()}–${archive[0].data.pubDate.getUTCFullYear()})`
		: '';

	const years = posts.length
		? `${posts[posts.length - 1].data.pubDate.getUTCFullYear()}–${posts[0].data.pubDate.getUTCFullYear()}`
		: '';

	const body = `# Cory Bergman

> Personal site of Cory Bergman — co-founder and chief product officer of Factal, the verified risk intelligence company. A product leader and journalist, he has spent two decades building real-time information products that protect people in harm's way. Previously co-founded and led BreakingNews.com, which later became part of NBC News, where he also led product development; earlier he founded Lost Remote and My Ballard. He speaks frequently on how global security and risk teams can put AI to work, and has won national awards for both television and online journalism. He holds an MBA from the University of the Pacific and lives in Seattle.

This file indexes ${posts.length} posts published ${years}, plus the site's standing pages. Everything here is written by Cory; the site itself is built and published with AI. Full text of each post is at its URL below.

## Pages
- [Home](${SITE}/): Reverse-chronological feed of every post.
- [Projects](${SITE}/projects): Companies Cory founded or helped build (Factal, Breaking News, My Ballard, Lost Remote), plus his writing elsewhere and press coverage.
- [Speaking](${SITE}/speaking): Speaking topics, recent talks and booking. Cory speaks to global security and risk audiences about applying AI in practice.
- [About](${SITE}/about): Biography and career history.
- [Topics](${SITE}/tags/): Every post grouped by topic.
- [RSS](${SITE}/rss.xml): Full-content feed.

## Writing
Posts on this site, newest first. Entries marked as originally published on Medium are republished here with rel=canonical pointing at the Medium original.

${recent.map(line).join('\n')}

## Archive${archiveYears}
Earlier posts from Cory's original blog, largely on how mobile reshaped journalism. Preserved at their original URLs so existing links keep working.

${archive.map(line).join('\n')}

## Topics
${tags.map((t) => `- [${t.tag}](${SITE}/tags/${t.slug}/): ${t.count} post${t.count === 1 ? '' : 's'}`).join('\n')}

## Elsewhere
- Factal (company): https://www.factal.com
- Factal blog: https://blog.factal.com
- X/Twitter: ${SOCIAL.x}
- Bluesky: ${SOCIAL.bluesky}
- Threads: ${SOCIAL.threads}
- LinkedIn: ${SOCIAL.linkedin}
- GitHub: ${SOCIAL.github}
`;

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
