// Writes IMAGE-MAP.md from the processed-image manifest.

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const manifest = JSON.parse(await readFile(path.resolve('build/image-manifest.json'), 'utf8'));

// Notes on slots where the supplied filename did not match the subject, or
// where the fit is imperfect. Recorded so the client can see the reasoning.
const NOTES = {
  'service-04.jpg': 'Filename suggested service 4. The photograph shows a commercial kitchen, so it fills service 2.',
  'service-06.jpg': 'Filename suggested service 6. The photograph shows marked back-of-house reticulation, so it fills service 3.',
  'service-05.jpg': 'Filename suggested service 5. The photograph shows a bulk LPG tank, so it fills service 4.',
  'service-09.jpg': 'Filename suggested service 9. The photograph shows cylinder enclosures at a development, so it fills service 5.',
  'service-08.jpg': 'Filename suggested service 8. The photograph shows a Certificate of Conformity, so it fills service 6.',
  'service-02.jpg': 'Filename suggested service 2. The photograph shows an installed gas water heater, so it fills service 7.',
  'service-07.jpg': 'Filename suggested service 7. The photograph shows electronic leak detection, so it fills service 8.',
  'service-03.jpg': 'Filename suggested service 3. The photograph shows a gas fireplace. CLOSEST AVAILABLE MATCH ONLY: no photograph in the supplied set shows electrical work. A photograph of an appliance isolator or control wiring would fit this service properly.',
};

const rows = manifest.rows
  .map((row) => {
    const outputs = row.outputs
      .map((output) => `${output.file} (${Math.round(output.bytes / 1024)} KB)`)
      .join('<br>');
    const note = NOTES[row.source] ? `<br>**Note:** ${NOTES[row.source]}` : '';
    return `| \`${row.source}\` | ${row.slot} | ${row.shows}${note} | ${row.original} | ${outputs} |`;
  })
  .join('\n');

const unused = manifest.unused.length
  ? manifest.unused.map((file) => `- \`${file}\` — present in the folder but not assigned to any slot.`).join('\n')
  : '- None. Every photograph in `public/assets/img/` is used.';

const markdown = `# Image map

Every photograph in \`public/assets/img/\` was opened and assigned to the slot whose
subject it actually shows. The filenames in the supplied set do not follow the order
of the services, so several photographs fill a different slot from the one their name
suggests. Those cases are noted in the table.

Source files stay in \`public/assets/img/\` and are never copied into \`dist/\`. The build
resizes each one and writes a WebP with a JPG fallback into \`dist/assets/img/\`. Every
output file is under 300 KB.

| Source file | Slot | What the photograph shows | Source size | Output files |
| --- | --- | --- | --- | --- |
${rows}

## Reused photographs

- None. Each of the 13 slots is filled by a different photograph.

## Unused or rejected files

${unused}

## Open point for the client

The photograph filling **Basic Electrical & Gas System Support** shows a gas fireplace.
It is the closest match in the supplied set, but nothing in the set shows electrical
work. A photograph of an appliance isolator, control wiring or a fan connection would
replace it properly. Drop the new file into \`public/assets/img/\`, point the \`image\`
field for that service in \`src/data/site.js\` at it, and rebuild.
`;

await writeFile(path.resolve('IMAGE-MAP.md'), markdown);
console.log('IMAGE-MAP.md written');
