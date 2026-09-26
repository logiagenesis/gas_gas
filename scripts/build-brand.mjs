// Builds the logo, favicons, web manifest and Open Graph image.
// If public/assets/brand/ holds a client logo it is copied through untouched.
// If it is empty, a stand-in wordmark is drawn from Inter outlines.

import { mkdir, readdir, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import * as fontkit from 'fontkit';
import sharp from 'sharp';
import { site } from '../src/data/site.js';
import { home } from '../src/data/pages.js';
import { analyseLogo } from './lib/logo.mjs';

const BRAND_SRC = path.resolve('public/assets/brand');
const OUT = path.resolve('build/static/assets/brand');
const ICONS = path.resolve('build/static/assets/icons');
const STATIC = path.resolve('build/static');

const FONTS = {
  500: 'node_modules/@fontsource/inter/files/inter-latin-500-normal.woff2',
  800: 'node_modules/@fontsource/inter/files/inter-latin-800-normal.woff2',
  400: 'node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2',
  700: 'node_modules/@fontsource/inter/files/inter-latin-700-normal.woff2',
};

const UPM = 2048;
const CAP = 1490;

function loadFont(weight) {
  return fontkit.openSync(path.resolve(FONTS[weight]));
}

// Returns { d, width } — glyph outlines merged into one path string,
// drawn on a baseline at y=0 with y running downwards.
function textToPath(font, text, fontSize, tracking = 0) {
  const scale = fontSize / UPM;
  const run = font.layout(text);
  let pen = 0;
  const parts = [];

  run.glyphs.forEach((glyph, index) => {
    const position = run.positions[index];
    const d = glyph.path.toSVG();
    if (d && d.trim()) {
      const x = (pen + (position.xOffset || 0)) * scale;
      parts.push(`<path transform="translate(${x.toFixed(2)} 0) scale(${scale.toFixed(6)} ${(-scale).toFixed(6)})" d="${d}"/>`);
    }
    pen += position.xAdvance + tracking / scale;
  });

  return { parts: parts.join(''), width: pen * scale };
}

function measure(font, text, fontSize) {
  const run = font.layout(text);
  return (run.advanceWidth * fontSize) / UPM;
}

// One simple flame. Not a dot, not a gauge, not a pipe.
const FLAME = 'M32 1 C32 17 49 26 49 46 C49 63 41 74 32 80 C23 74 15 63 15 46 C15 34 21 27 26 19 C27 30 30 35 34 37 C37 29 35 12 32 1 Z';

function buildWordmark(textColour) {
  const extraBold = loadFont(800);
  const medium = loadFont(500);

  const fontSize = (60 / CAP) * UPM; // cap height of 60 units
  const baseline = 68;

  // "set tight" — a small negative tracking on both words.
  const gas = textToPath(extraBold, 'Gas', fontSize, -0.9);
  const designs = textToPath(medium, 'Designs', fontSize, -0.6);

  const flameWidth = 64;
  const flameScale = 72 / 80;
  const flameX = 0;
  const flameY = baseline - 60 - 6;

  const gasX = flameWidth * flameScale + 12;
  const designsX = gasX + gas.width + measure(medium, ' ', fontSize) * 0.55;
  const totalWidth = designsX + designs.width;
  const height = 96;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Math.ceil(totalWidth)} ${height}" role="img" aria-label="${site.name}">
<title>${site.name}</title>
<g fill="#f5b400"><g transform="translate(${flameX} ${flameY}) scale(${flameScale.toFixed(4)})"><path d="${FLAME}"/></g></g>
<g fill="${textColour}"><g transform="translate(${gasX.toFixed(2)} ${baseline})">${gas.parts}</g><g transform="translate(${designsX.toFixed(2)} ${baseline})">${designs.parts}</g></g>
</svg>`;
}

function buildIconSvg(size) {
  const scale = (size * 0.62) / 80;
  const w = 64 * scale;
  const h = 80 * scale;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
<rect width="${size}" height="${size}" fill="#16181b"/>
<g transform="translate(${((size - w) / 2).toFixed(2)} ${((size - h) / 2).toFixed(2)}) scale(${scale.toFixed(4)})" fill="#f5b400"><path d="${FLAME}"/></g>
</svg>`;
}

function wrapText(font, text, fontSize, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (measure(font, next, fontSize) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

async function buildOgImage(wordmarkSvg) {
  const regular = loadFont(400);
  const subtitleSize = 40;
  const lines = wrapText(regular, home.h1.replace(/[[\]]/g, ''), subtitleSize, 880);

  const logoTargetWidth = 520;
  const meta = await sharp(Buffer.from(wordmarkSvg)).metadata();
  const logoHeight = Math.round((logoTargetWidth / meta.width) * meta.height);

  const blockHeight = logoHeight + 40 + lines.length * (subtitleSize * 1.35);
  let y = Math.round((630 - blockHeight) / 2) + logoHeight + 40 + subtitleSize;

  const subtitle = lines
    .map((line) => {
      const { parts, width } = textToPath(regular, line, subtitleSize);
      const x = (1200 - width) / 2;
      const g = `<g transform="translate(${x.toFixed(2)} ${y})">${parts}</g>`;
      y += subtitleSize * 1.35;
      return g;
    })
    .join('');

  const canvas = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#16181b"/><g fill="#c9cdd2">${subtitle}</g></svg>`;

  const logo = await sharp(Buffer.from(wordmarkSvg)).resize({ width: logoTargetWidth }).png().toBuffer();

  await sharp(Buffer.from(canvas))
    .composite([
      {
        input: logo,
        left: Math.round((1200 - logoTargetWidth) / 2),
        top: Math.round((630 - blockHeight) / 2),
      },
    ])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(path.join(STATIC, 'assets', 'og-image.jpg'));
}

// Open Graph card: the client's stacked logo, exactly as supplied, in full
// colour on white. WhatsApp and most chat apps crop a link preview to a small
// square taken from the centre of the image, so the whole logo is sized to sit
// inside the central 630 x 630 square with a margin: cropped or not, the
// preview shows the complete logo. A thin amber rule runs along the foot.
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const OG_SAFE = 570; // the logo's box inside the centre square

async function buildOgFromLockup(parts) {
  const logo = await sharp(parts.stacked)
    .resize({ width: OG_SAFE, height: OG_SAFE, fit: 'inside' })
    .png()
    .toBuffer();
  const meta = await sharp(logo).metadata();
  const rule = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_WIDTH}" height="10"><rect width="${OG_WIDTH}" height="10" fill="#f5b400"/></svg>`,
  );

  await sharp({ create: { width: OG_WIDTH, height: OG_HEIGHT, channels: 3, background: '#ffffff' } })
    .composite([
      {
        input: logo,
        left: Math.round((OG_WIDTH - meta.width) / 2),
        top: Math.round((OG_HEIGHT - meta.height) / 2),
      },
      { input: rule, left: 0, top: OG_HEIGHT - 10 },
    ])
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(path.join(STATIC, 'assets', 'og-image.jpg'));
}

async function main() {
  await mkdir(OUT, { recursive: true });
  await mkdir(ICONS, { recursive: true });
  await mkdir(BRAND_SRC, { recursive: true });

  const supplied = (await readdir(BRAND_SRC)).filter((f) => /\.(svg|png|jpe?g)$/i.test(f));
  const manifest = { usingClientLogo: supplied.length > 0 };

  if (supplied.length) {
    const file = supplied.find((f) => /\.png$/i.test(f)) || supplied[0];
    const parts = await analyseLogo(path.join(BRAND_SRC, file));

    const write = async (name, buffer) => {
      await writeFile(path.join(OUT, name), buffer);
      const meta = await sharp(buffer).metadata();
      return { file: name, width: meta.width, height: meta.height };
    };

    manifest.source = file;
    manifest.stacked = await write('gas-designs.png', parts.stacked);
    manifest.mark = await write('gas-designs-mark.png', parts.mark);
    manifest.wordmark = parts.wordmark ? await write('gas-designs-wordmark.png', parts.wordmark) : null;

    // Browser-tab icons are the flame alone on transparency, filling the square
    // so it reads at 16px on light and dark tab bars alike. The home-screen
    // icons sit on white with breathing room: iOS paints any transparent area
    // of an apple-touch-icon black, and a black tile is what the client rejected.
    const ICON_SPECS = [
      { size: 16, fill: 1, background: null },
      { size: 32, fill: 0.97, background: null },
      { size: 180, fill: 0.62, background: '#ffffff' },
      { size: 512, fill: 0.62, background: '#ffffff' },
    ];
    for (const { size, fill, background } of ICON_SPECS) {
      const inner = Math.round(size * fill);
      const mark = await sharp(parts.mark)
        .resize({ width: inner, height: inner, fit: 'inside', withoutEnlargement: false })
        .png()
        .toBuffer();
      const meta = await sharp(mark).metadata();
      const icon = await sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: background || { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
        .composite([
          {
            input: mark,
            left: Math.round((size - meta.width) / 2),
            top: Math.round((size - meta.height) / 2),
          },
        ])
        .png()
        .toBuffer();
      await writeFile(path.join(ICONS, `icon-${size}.png`), icon);
    }

    await buildOgFromLockup(parts);
    console.log(`brand: using client logo ${file}, split into mark and wordmark`);
  } else {
    const onLight = buildWordmark('#16181b');
    const onDark = buildWordmark('#ffffff');
    await writeFile(path.join(OUT, 'gas-designs-charcoal.svg'), onLight);
    await writeFile(path.join(OUT, 'gas-designs-white.svg'), onDark);
    manifest.standInSvg = 'gas-designs-white.svg';

    for (const size of [16, 32, 180, 512]) {
      await writeFile(
        path.join(ICONS, `icon-${size}.png`),
        await sharp(Buffer.from(buildIconSvg(size))).png().toBuffer(),
      );
    }
    await buildOgImage(buildWordmark('#ffffff'));
    console.log('brand: no client logo found, stand-in wordmark generated');
  }

  await writeFile(
    path.join(STATIC, 'site.webmanifest'),
    JSON.stringify(
      {
        name: site.name,
        short_name: site.name,
        description: site.description,
        start_url: './',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#16181b',
        icons: [
          { src: 'assets/icons/icon-180.png', sizes: '180x180', type: 'image/png' },
          { src: 'assets/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      null,
      2,
    ),
  );

  await writeFile(path.resolve('build/brand-manifest.json'), JSON.stringify(manifest, null, 2));

  console.log('brand: icons, manifest and og-image written');
}

main();
