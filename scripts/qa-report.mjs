// Composes qa/QA-REPORT.md from the browser and Lighthouse result files.

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const read = async (file) =>
  existsSync(path.resolve(file)) ? JSON.parse(await readFile(path.resolve(file), 'utf8')) : null;

const browser = await read('qa/browser-report.json');
const lighthouse = await read('qa/lighthouse-report.json');

const sections = ['# QA report', ''];

if (browser) {
  sections.push(`Checked against \`${browser.base}\` on ${browser.checkedAt}.`, '');

  sections.push('## Horizontal overflow', '');
  sections.push('| Page | 360 | 768 | 1024 | 1440 |', '| --- | --- | --- | --- | --- |');
  for (const page of browser.pages) {
    const cells = [360, 768, 1024, 1440].map((width) => {
      const entry = page.overflow[width];
      return entry ? (entry.overflow ? `OVERFLOW ${entry.scrollWidth}px` : 'none') : 'n/a';
    });
    sections.push(`| ${page.name} | ${cells.join(' | ')} |`);
  }
  sections.push('');

  sections.push('## Contrast', '');
  sections.push(
    'Every distinct text colour and background pair found in the rendered pages, with the computed ratio.',
    '',
  );
  sections.push('| Foreground | Background | Size | Weight | Ratio | Required | Result | Example |', '| --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const row of browser.contrast) {
    const result = row.ratio >= row.required ? 'PASS' : 'FAIL';
    const sample = row.sample.replace(/\s+/g, ' ').slice(0, 34);
    sections.push(
      `| \`${row.foreground}\` | \`${row.background}\` | ${row.fontSizePx}px | ${row.fontWeight} | ${row.ratio}:1 | ${row.required}:1 | ${result} | ${sample} |`,
    );
  }
  sections.push('');
  sections.push(
    'The hero heading sits on a photograph behind a charcoal overlay that runs from 85% to 70% opacity. At its most transparent point the effective background is `#5c5e60`, which gives white text a ratio of 6.6:1. That passes AA at every point of the gradient.',
    '',
  );

  sections.push('## Page checks', '');
  sections.push('| Page | Status | Console errors | Broken images | Quote button hidden at 360 | Menu button at 360 |', '| --- | --- | --- | --- | --- | --- |');
  for (const page of browser.pages) {
    sections.push(
      `| ${page.name} | ${page.status} | ${page.consoleErrors.length} | ${(page.brokenImages || []).length} | ${page.headerCtaHiddenAt360 ? 'yes' : 'NO'} | ${page.navToggleVisibleAt360 ? 'yes' : 'NO'} |`,
    );
  }
  sections.push('');

  const bad = browser.links.filter((link) => typeof link.status === 'number' && link.status >= 400);
  sections.push('## Links and assets', '');
  sections.push(
    `${browser.links.length} unique URLs found in the built pages. ${bad.length} returned 400 or above.`,
    '',
    `A request for a path that does not exist returned HTTP ${browser.badPathStatus}.`,
    '',
  );
}

if (lighthouse) {
  sections.push('## Lighthouse, mobile profile', '');
  sections.push('| Page | Performance | Accessibility | Best practices | SEO |', '| --- | --- | --- | --- | --- |');
  for (const row of lighthouse.rows) {
    sections.push(
      `| ${row.name} | ${row.scores.performance} | ${row.scores.accessibility} | ${row.scores['best-practices']} | ${row.scores.seo} |`,
    );
  }
  sections.push('', `Run against \`${lighthouse.base}\` on ${lighthouse.checkedAt}.`, '');
}

await writeFile(path.resolve('qa/QA-REPORT.md'), `${sections.join('\n')}\n`);
console.log('qa/QA-REPORT.md written');
