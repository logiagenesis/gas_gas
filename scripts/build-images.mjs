// Processes the client photographs into web-sized WebP with a JPG fallback.
// Source files stay in public/assets/img/ and never reach dist/.

import { mkdir, readdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { services } from '../src/data/site.js';

const SRC = path.resolve('public/assets/img');
const OUT = path.resolve('build/static/assets/img');
const MAX_BYTES = 300 * 1024;

// Slot assignment. Made by opening every photograph and matching the subject,
// not the filename. The filenames in the supplied set do not match the order
// of the services, so several differ from what the name suggests.
const SLOTS = [
  { source: 'hero', slot: 'Home hero', width: 1920, shows: 'Technician kneeling in a dark fitted kitchen with a digital pressure gauge on the gas line above the hob' },
  ...services.map((service) => ({
    source: service.image,
    slot: service.name,
    width: 1200,
    shows: service.alt,
  })),
  { source: 'compliance', slot: 'Compliance section', width: 1200, shows: 'Pressure gauge on a gas test point with a yellow tag recording date, pressure and a pass result' },
  { source: 'about', slot: 'About section', width: 1200, shows: 'Technician loading gas cylinders into a bakkie on a suburban street at dusk' },
  { source: 'contact', slot: 'Contact section', width: 1200, shows: 'Technician handing completed paperwork to a client across a kitchen counter' },
];

async function encode(input, outBase, width) {
  const base = sharp(input).resize({ width, withoutEnlargement: true });
  const results = [];

  for (const [ext, make] of [
    ['webp', (q) => base.clone().webp({ quality: q, effort: 6 })],
    ['jpg', (q) => base.clone().jpeg({ quality: q, mozjpeg: true, progressive: true })],
  ]) {
    let quality = ext === 'webp' ? 80 : 82;
    let buffer = await make(quality).toBuffer();
    while (buffer.length > MAX_BYTES && quality > 45) {
      quality -= 6;
      buffer = await make(quality).toBuffer();
    }
    const file = `${outBase}.${ext}`;
    await writeFile(path.join(OUT, file), buffer);
    results.push({ file, bytes: buffer.length, quality });
  }
  return results;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const present = (await readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f));
  const rows = [];
  let failures = 0;

  for (const entry of SLOTS) {
    const match = present.find((f) => path.parse(f).name === entry.source);
    if (!match) {
      console.error(`MISSING source photograph for slot "${entry.slot}": ${entry.source}`);
      failures += 1;
      continue;
    }
    const input = path.join(SRC, match);
    const meta = await sharp(input).metadata();
    const outBase = `${entry.source}-${entry.width}`;
    const outputs = await encode(input, outBase, entry.width);
    const originalBytes = (await stat(input)).size;

    rows.push({
      source: match,
      slot: entry.slot,
      shows: entry.shows,
      original: `${meta.width}x${meta.height}`,
      originalKb: Math.round(originalBytes / 1024),
      outputs,
      width: Math.min(entry.width, meta.width),
    });

    for (const output of outputs) {
      if (output.bytes > MAX_BYTES) {
        console.error(`OVER 300 KB: ${output.file} at ${Math.round(output.bytes / 1024)} KB`);
        failures += 1;
      }
    }
  }

  const unused = present.filter((f) => !SLOTS.some((s) => s.source === path.parse(f).name));

  await writeFile(
    path.resolve('build/image-manifest.json'),
    JSON.stringify({ rows, unused }, null, 2),
  );

  const total = rows.reduce((sum, r) => sum + r.outputs.reduce((s, o) => s + o.bytes, 0), 0);
  console.log(`images: ${rows.length} slots, ${rows.length * 2} files, ${Math.round(total / 1024)} KB total`);
  if (unused.length) console.log(`unused source files: ${unused.join(', ')}`);
  if (failures) {
    console.error(`image build failed with ${failures} problem(s)`);
    process.exit(1);
  }
}

main();
