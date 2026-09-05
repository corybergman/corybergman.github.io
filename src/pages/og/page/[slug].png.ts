import type { APIRoute } from 'astro';
import { renderOgCard } from '../../../og/card';
import { pageCards } from '../../../lib/og-cards';

// One generated OG card per standing page, at /og/page/<slug>.png.
export function getStaticPaths() {
	return pageCards.map((card) => ({
		params: { slug: card.slug },
		props: { title: card.title },
	}));
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
