// Static checks over dist/. Every check prints PASS or FAIL with detail.

import { readFile } from 'node:fs/promises';
import { globSync } from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
const BANNED = [
  'A passing test is a flat line',
  'illustration of the method',
  'Nine service lines',
  'one discipline',
  'Answered by email, direct',
  'Precision Gas Systems',
  'Built for Safety',
  'judged on what happens after everyone leaves',
  'charge, then hold',
  'CLIENT TO CONFIRM',
  'lorem',
  'TODO',
  'php',
  'cpanel',
  'htaccess',
];

const results = [];
const record = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
};

const files = globSync('**/*', { cwd: DIST, withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => path.join(entry.parentPath ?? entry.path, entry.name));

// 1. Banned phrases across every text file in dist, plus every filename.
const textFiles = files.filter((f) => /\.(html|css|js|json|xml|txt|svg|webmanifest)$/i.test(f));
const hits = [];
for (const file of textFiles) {
  const content = (await readFile(file, 'utf8')).toLowerCase();
  for (const phrase of BANNED) {
    if (content.includes(phrase.toLowerCase())) {
      hits.push(`${path.relative(DIST, file)}: "${phrase}"`);
    }
  }
}
for (const file of files) {
  const name = path.basename(file).toLowerCase();
  for (const phrase of BANNED) {
    if (name.includes(phrase.toLowerCase())) hits.push(`filename ${path.relative(DIST, file)}: "${phrase}"`);
  }
}
record('Banned phrases absent from dist', hits.length === 0, hits.join('; '));

// 2. No SVG element larger than 24px.
const svgProblems = [];
for (const file of textFiles.filter((f) => /\.(html|svg)$/i.test(f))) {
  const content = await readFile(file, 'utf8');
  const tags = content.match(/<svg\b[^>]*>/gi) || [];
  for (const tag of tags) {
    const width = Number((tag.match(/\bwidth="(\d+(?:\.\d+)?)"/i) || [])[1]);
    const height = Number((tag.match(/\bheight="(\d+(?:\.\d+)?)"/i) || [])[1]);
    if (!width && !height) {
      svgProblems.push(`${path.relative(DIST, file)}: <svg> without explicit width/height`);
    } else if (width > 24 || height > 24) {
      svgProblems.push(`${path.relative(DIST, file)}: <svg> ${width}x${height}`);
    }
  }
}
// The brand wordmark is a logo file, not a decorative graphic, and is exempt.
const svgFiltered = svgProblems.filter((p) => !p.includes('assets/brand/'));
record('No SVG element larger than 24px in markup', svgFiltered.length === 0, svgFiltered.join('; '));

// 3. Heading structure: one H1 per page, no skipped levels.
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const headingProblems = [];
for (const file of htmlFiles) {
  const content = await readFile(file, 'utf8');
  const levels = [...content.matchAll(/<h([1-6])\b/gi)].map((m) => Number(m[1]));
  const h1s = levels.filter((level) => level === 1).length;
  if (h1s !== 1) headingProblems.push(`${path.relative(DIST, file)}: ${h1s} H1`);
  let previous = 0;
  for (const level of levels) {
    if (previous && level > previous + 1) {
      headingProblems.push(`${path.relative(DIST, file)}: h${previous} to h${level}`);
      break;
    }
    previous = level;
  }
}
record('One H1 per page and no skipped heading levels', headingProblems.length === 0, headingProblems.join('; '));

// 4. Nine service cards in the home grid.
const homeHtml = await readFile(path.join(DIST, 'index.html'), 'utf8');
const grid = homeHtml.match(/<ul class="card-grid">([\s\S]*?)<\/ul>/);
const cardCount = grid ? (grid[1].match(/<li class="card">/g) || []).length : 0;
record('Nine service cards in the home grid', cardCount === 9, `${cardCount} found`);

// 5. Quote form markup.
const formChecks = [
  ['action', /action="https:\/\/formsubmit\.co\/pierre@gasdesigns\.co\.za"/],
  ['_subject', /name="_subject" value="Quote request/],
  ['_next absolute', /name="_next" value="https:\/\/[^"]+\/thank-you\/"/],
  ['_captcha false', /name="_captcha" value="false"/],
  ['_honey honeypot', /name="_honey"/],
  ['name field', /id="name" name="name"/],
  ['phone field', /id="phone" name="phone"/],
  ['email field', /id="email" name="email"/],
  ['suburb field', /id="suburb" name="suburb"/],
  ['property type', /id="property-type" name="property_type"/],
  ['service select', /id="service" name="service"/],
  ['message field', /id="message" name="message"/],
  ['consent checkbox', /id="consent" name="consent"/],
  ['mailto fallback', /href="mailto:pierre@gasdesigns\.co\.za"/],
];
const formMissing = formChecks.filter(([, pattern]) => !pattern.test(homeHtml)).map(([label]) => label);
record('Quote form has every required field', formMissing.length === 0, formMissing.join(', '));

// 6. Service select carries all nine services plus "Not sure".
const select = homeHtml.match(/<select id="service"[\s\S]*?<\/select>/);
const optionCount = select ? (select[0].match(/<option/g) || []).length : 0;
record('Service select lists nine services plus Not sure', optionCount === 10, `${optionCount} options`);

// 7. Schema present.
record('LocalBusiness schema on home', /"@type":"LocalBusiness"/.test(homeHtml));
record('FAQPage schema on home', /"@type":"FAQPage"/.test(homeHtml));
const serviceHtml = await readFile(
  path.join(DIST, 'services/bulk-lpg-installations/index.html'),
  'utf8',
);
record('Service schema on service pages', /"@type":"Service"/.test(serviceHtml));

// 8. No forbidden hosting artefacts.
const forbidden = files.filter((f) => /(^|\/)(\.htaccess|_headers|_redirects)$/i.test(f));
record('No .htaccess, _headers or _redirects in dist', forbidden.length === 0, forbidden.join(', '));

// 9. Required root files.
for (const required of ['404.html', 'robots.txt', 'sitemap.xml', 'site.webmanifest']) {
  record(`${required} at output root`, files.some((f) => path.relative(DIST, f) === required));
}

// 10. Third-party requests limited to GTM and FormSubmit.
const externalHosts = new Set();
for (const file of htmlFiles) {
  const content = await readFile(file, 'utf8');
  for (const match of content.matchAll(/https?:\/\/([a-z0-9.-]+)/gi)) {
    externalHosts.add(match[1].toLowerCase());
  }
}
const allowed = new Set([
  'www.googletagmanager.com',
  'formsubmit.co',
  'gasdesigns.co.za',
  'schema.org',
  'logi-ink.co.za',
  'www.w3.org',
  'logiagenesis.github.io',
]);
const unexpected = [...externalHosts].filter((host) => !allowed.has(host));
record('No unexpected third-party hosts', unexpected.length === 0, unexpected.join(', '));

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} static checks passed`);
if (failed.length) process.exit(1);
