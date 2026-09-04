/**
 * Generates the whole favicon / app-icon set into public/ from one source of truth.
 *
 *   node scripts/generate-icons.mjs
 *
 * The mark is "CB" in IBM Plex Sans SemiBold (600), matching the site's headings.
 * The letters are pre-outlined vector paths (extracted from
 * src/og/fonts/IBMPlexSans-SemiBold.woff with fontTools) so the SVG renders
 * identically everywhere with no webfont dependency.
 *
 * Outputs — all generated, none hand-edited:
 *   public/favicon.svg              modern browsers (rounded square)
 *   public/favicon.ico              16/32/48 — the file DuckDuckGo, Bing, Slack
 *                                   and feed readers look for at the site root
 *   public/apple-touch-icon.png     180px, full-bleed square (iOS masks corners itself)
 *   public/icon-192.png             PWA / Android
 *   public/icon-512.png             PWA / Android
 *   public/icon-maskable-512.png    full-bleed, mark inside Android's 80% safe zone
 *
 * To change the mark, edit MARK_PATH / GEOMETRY below and re-run. Remember to
 * keep public/site.webmanifest and the <link> tags in src/components/BaseHead.astro
 * in sync if you add or rename an output.
 */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const PUBLIC = path.resolve(fileURLToPath(new URL('../public', import.meta.url)));

/** Brand blue — keep in sync with --pine in src/styles/global.css. */
const BLUE = '#1d5f9e';
/** Corner radius on a 32-unit grid, matching the previous favicon. */
const RADIUS = 6;

/**
 * "CB" outlined at 32x32: cap height 14.23 (44% of the square), tracking -18
 * font units, cap box optically centred 0.3px above true centre.
 */
const MARK_PATH =
  'M10.08 23.06Q8.20 23.06 6.83 22.24Q5.45 21.43 4.69 19.81Q3.94 18.19 3.94 15.80Q3.94 13.40 4.69 11.73Q5.45 10.07 6.83 9.21Q8.20 8.34 10.08 8.34Q11.97 8.34 13.25 9.16Q14.52 9.97 15.28 11.62L12.97 12.85Q12.67 11.89 11.97 11.31Q11.28 10.73 10.08 10.73Q8.57 10.73 7.68 11.74Q6.79 12.76 6.79 14.60V16.84Q6.79 18.66 7.68 19.67Q8.57 20.67 10.08 20.67Q11.28 20.67 12.03 20.02Q12.79 19.37 13.16 18.41L15.34 19.70Q14.58 21.29 13.28 22.17Q11.97 23.06 10.08 23.06ZM17.27 22.82V8.58H23.86Q25.61 8.58 26.62 9.58Q27.63 10.58 27.63 12.23Q27.63 13.31 27.26 13.97Q26.90 14.62 26.32 14.93Q25.74 15.23 25.08 15.29V15.41Q25.55 15.41 26.08 15.60Q26.61 15.78 27.09 16.17Q27.57 16.56 27.87 17.19Q28.16 17.82 28.16 18.74Q28.16 19.88 27.68 20.80Q27.20 21.71 26.38 22.27Q25.55 22.82 24.49 22.82ZM19.97 16.72V20.53H23.72Q24.23 20.53 24.59 20.35Q24.96 20.17 25.15 19.82Q25.35 19.47 25.35 18.98V18.29Q25.35 17.78 25.15 17.43Q24.96 17.09 24.59 16.90Q24.23 16.72 23.72 16.72ZM19.97 10.87V14.52H23.29Q23.78 14.52 24.12 14.33Q24.47 14.15 24.65 13.81Q24.84 13.48 24.84 13.01V12.38Q24.84 11.91 24.65 11.56Q24.47 11.21 24.12 11.04Q23.78 10.87 23.29 10.87Z';

/**
 * Composes one icon SVG.
 * @param {object} o
 * @param {number} o.radius     corner radius on the 32-unit grid (0 = full bleed)
 * @param {number} [o.inset=1]  scale factor for the mark, about the centre —
 *                              <1 pulls it into a safe zone for maskable icons
 */
function iconSvg({ radius, inset = 1 }) {
  const mark =
    inset === 1
      ? `<path fill="#fff" d="${MARK_PATH}"/>`
      : `<g transform="translate(16 16) scale(${inset}) translate(-16 -16)">` +
        `<path fill="#fff" d="${MARK_PATH}"/></g>`;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" ` +
    `role="img" aria-label="Cory Bergman">` +
    `<rect width="32" height="32"${radius ? ` rx="${radius}"` : ''} fill="${BLUE}"/>` +
    mark +
    `</svg>`
  );
}

/** Rasterise an SVG string to a square PNG buffer, rendering at the target size. */
const png = (svg, size) =>
  sharp(Buffer.from(svg), { density: Math.round((72 * size) / 32) })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toBuffer();

/**
 * Packs PNG buffers into an .ico. Every current browser and favicon crawler
 * reads PNG-payload ICOs, which keeps the file small and the edges clean.
 */
function encodeIco(images) {
  const HEADER = 6;
  const ENTRY = 16;
  const header = Buffer.alloc(HEADER);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(images.length, 4);

  let offset = HEADER + ENTRY * images.length;
  const entries = [];
  for (const { size, data } of images) {
    const e = Buffer.alloc(ENTRY);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // 0 encodes 256
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); // palette count — 0 for truecolour
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    entries.push(e);
    offset += data.length;
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const out = (name) => path.join(PUBLIC, name);

const rounded = iconSvg({ radius: RADIUS });
const square = iconSvg({ radius: 0 });
// Android maskable icons can be cropped to a circle; keep the mark inside the
// centre 80% so nothing clips.
const maskable = iconSvg({ radius: 0, inset: 0.8 });

// The SVG favicon ships pretty-printed — it is the one output a human might read.
await writeFile(
  out('favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" role="img" aria-label="Cory Bergman">\n` +
    `  <rect width="32" height="32" rx="${RADIUS}" fill="${BLUE}"/>\n` +
    `  <path fill="#fff" d="${MARK_PATH}"/>\n` +
    `</svg>\n`
);

const icoSizes = [16, 32, 48];
await writeFile(
  out('favicon.ico'),
  encodeIco(
    await Promise.all(
      icoSizes.map(async (size) => ({ size, data: await png(rounded, size) }))
    )
  )
);

await writeFile(out('apple-touch-icon.png'), await png(square, 180));
await writeFile(out('icon-192.png'), await png(rounded, 192));
await writeFile(out('icon-512.png'), await png(rounded, 512));
await writeFile(out('icon-maskable-512.png'), await png(maskable, 512));

console.log('Wrote to public/:');
console.log(`  favicon.svg`);
console.log(`  favicon.ico              ${icoSizes.join('/')}`);
console.log(`  apple-touch-icon.png     180 (full bleed)`);
console.log(`  icon-192.png             192`);
console.log(`  icon-512.png             512`);
console.log(`  icon-maskable-512.png    512 (80% safe zone)`);
