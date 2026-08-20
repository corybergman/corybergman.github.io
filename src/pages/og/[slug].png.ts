import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderOgCard } from '../../og/card';

// One generated OG card per post, at /og/<post-id>.png. Posts that set an
// explicit `image` in frontmatter use that photo instead and are skipped here.
export async function getStaticPaths() {
	const posts = await getCollection('blog');
	return posts
		.filter((post) => !post.data.image)
		.map((post) => ({ params: { slug: post.id }, props: { title: post.data.title } }));
}

export const GET: APIRoute = async ({ props }) => {
	const png = await renderOgCard((props as { title: string }).title);
	return new Response(new Uint8Array(png), {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	});
};
