import type { APIRoute } from 'astro';
import { renderOgCard } from '../../og/card';

// Fallback OG card for non-post pages (home, About, Projects, Speaking).
export const GET: APIRoute = async () => {
	const png = await renderOgCard("Trusted information for people in harm's way");
	return new Response(new Uint8Array(png), {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=31536000, immutable',
		},
	});
};
