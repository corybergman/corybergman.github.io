import { getCollection, render } from 'astro:content';
import rss from '@astrojs/rss';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { SITE_DESCRIPTION, SITE_TITLE, postUrl } from '../consts';

export async function GET(context) {
	const posts = (await getCollection('blog')).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);

	// Render each post's real HTML (same pipeline as the site) so the feed
	// carries full content, not just the excerpt.
	const container = await AstroContainer.create();
	const origin = context.site.origin; // e.g. https://corybe.com

	const items = await Promise.all(
		posts.map(async (post) => {
			const { Content } = await render(post);
			const html = (await container.renderToString(Content))
				// Make root-relative links/images absolute for feed readers.
				.replace(/(href|src)="\/(?!\/)/g, `$1="${origin}/`);
			return {
				title: post.data.title,
				description: post.data.description,
				pubDate: post.data.pubDate,
				categories: post.data.tags,
				link: postUrl(post),
				content: html,
			};
		}),
	);

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items,
	});
}
