// Build-time Open Graph card generator.
//
// Renders the "Card B" design (blue #2c567e, cream title, avatar + name footer)
// with satori — which turns the layout into an SVG with glyphs baked in as
// vector paths — then rasterizes to PNG with sharp. Runs only at build; the
// generated images are static files, so nothing extra is needed to host them.
import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import sharp from 'sharp';

const root = process.cwd();
const fontDir = path.join(root, 'src/og/fonts');

const sansRegular = fs.readFileSync(path.join(fontDir, 'IBMPlexSans-Regular.woff'));
const sansSemiBold = fs.readFileSync(path.join(fontDir, 'IBMPlexSans-SemiBold.woff'));
const mono = fs.readFileSync(path.join(fontDir, 'IBMPlexMono-Regular.woff'));

// Avatar embedded as a data URI so satori can draw it without a network fetch.
// The source is landscape (1000×645), so center-crop it to a square first —
// otherwise satori stretches it to fill the 72×72 box and distorts the face.
let avatarUriCache: string | null = null;
async function avatarUri(): Promise<string> {
	if (!avatarUriCache) {
		const square = await sharp(path.join(root, 'public/corybergman.jpg'))
			.resize(144, 144, { fit: 'cover', position: 'centre' })
			.jpeg({ quality: 90 })
			.toBuffer();
		avatarUriCache = `data:image/jpeg;base64,${square.toString('base64')}`;
	}
	return avatarUriCache;
}

type Style = Record<string, unknown>;
type El = { type: string; props: Record<string, unknown> };

// Minimal hyperscript for satori's element shape (avoids needing JSX here).
const h = (type: string, style: Style, children?: unknown, extra: Record<string, unknown> = {}): El => ({
	type,
	props: { style, ...extra, ...(children !== undefined ? { children } : {}) },
});

export async function renderOgCard(title: string): Promise<Buffer> {
	const avatar = await avatarUri();
	const tree = h(
		'div',
		{
			width: '100%',
			height: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			padding: '96px 100px',
			backgroundColor: '#2c567e',
			fontFamily: 'IBM Plex Sans',
		},
		[
			h(
				'div',
				{
					fontFamily: 'IBM Plex Mono',
					fontSize: 22,
					letterSpacing: 3,
					textTransform: 'uppercase',
					color: '#a7c0dd',
				},
				'Cory Bergman · corybe.com',
			),
			h('div', { display: 'flex', flexDirection: 'column' }, [
				h('div', { width: 64, height: 4, backgroundColor: '#a7c0dd', borderRadius: 2, marginBottom: 26 }),
				h(
					'div',
					{ fontSize: 80, fontWeight: 600, color: '#f7f8f5', lineHeight: 1.07, letterSpacing: -1.6, maxWidth: 1000 },
					title,
				),
			]),
			h('div', { display: 'flex', alignItems: 'center' }, [
				h('img', { width: 72, height: 72, borderRadius: 36, objectFit: 'cover', marginRight: 22 }, undefined, { src: avatar }),
				h('div', { fontSize: 30, fontWeight: 600, color: '#f7f8f5' }, 'Cory Bergman'),
				h('div', { width: 6, height: 6, borderRadius: 3, backgroundColor: '#86a9cf', marginLeft: 14, marginRight: 14 }),
				h('div', { fontSize: 26, color: '#bccee2' }, 'corybe.com'),
			]),
		],
	);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const svg = await satori(tree as any, {
		width: 1200,
		height: 630,
		fonts: [
			{ name: 'IBM Plex Sans', data: sansRegular, weight: 400, style: 'normal' },
			{ name: 'IBM Plex Sans', data: sansSemiBold, weight: 600, style: 'normal' },
			{ name: 'IBM Plex Mono', data: mono, weight: 400, style: 'normal' },
		],
	});

	return sharp(Buffer.from(svg)).png().toBuffer();
}
