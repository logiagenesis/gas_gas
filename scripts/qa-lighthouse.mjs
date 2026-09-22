// Lighthouse, mobile profile, against a running site.
// Usage: node scripts/qa-lighthouse.mjs <baseUrl> [--all]

import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const BASE = (process.argv[2] || 'http://localhost:4173/gas_gas/').replace(/\/?$/, '/');
const ALL = process.argv.includes('--all');

const CHROME = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/opt/pw-browsers/chromium'].find(
  (candidate) => existsSync(candidate),
);
if (CHROME) process.env.CHROME_PATH = CHROME;

const ROUTES = ALL
  ? [
      ['home', ''],
      ['services-residential-gas-installations', 'services/residential-gas-installations/'],
      ['services-commercial-kitchen-gas-systems', 'services/commercial-kitchen-gas-systems/'],
      ['services-industrial-gas-installations-maintenance', 'services/industrial-gas-installations-maintenance/'],
      ['services-bulk-lpg-installations', 'services/bulk-lpg-installations/'],
      ['services-custom-projects-developments', 'services/custom-projects-developments/'],
      ['services-certificate-of-conformity', 'services/certificate-of-conformity/'],
      ['services-gas-system-maintenance', 'services/gas-system-maintenance/'],
      ['services-gas-leak-detection-emergency-repairs', 'services/gas-leak-detection-emergency-repairs/'],
      ['services-basic-electrical-gas-system-support', 'services/basic-electrical-gas-system-support/'],
      ['thank-you', 'thank-you/'],
      ['privacy', 'privacy/'],
      ['404', '404.html'],
    ]
  : [
      ['home', ''],
      ['services-bulk-lpg-installations', 'services/bulk-lpg-installations/'],
      ['privacy', 'privacy/'],
    ];

const THRESHOLDS = {
  performance: 90,
  accessibility: 95,
  'best-practices': 95,
  seo: 95,
};

async function main() {
  await mkdir(path.resolve('qa'), { recursive: true });
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  });

  const rows = [];
  let failures = 0;

  for (const [name, route] of ROUTES) {
    const url = BASE + route;
    const result = await lighthouse(
      url,
      { port: chrome.port, output: 'json', logLevel: 'error' },
      undefined,
    );
    const scores = Object.fromEntries(
      Object.entries(result.lhr.categories).map(([key, category]) => [
        key,
        Math.round(category.score * 100),
      ]),
    );
    const failed = Object.entries(THRESHOLDS)
      .filter(([key, min]) => scores[key] < min)
      .map(([key, min]) => `${key} ${scores[key]} < ${min}`);
    if (failed.length) failures += 1;

    const opportunities = result.lhr.audits
      ? Object.values(result.lhr.audits)
          .filter((audit) => audit.score !== null && audit.score < 0.9 && audit.details)
          .map((audit) => audit.title)
          .slice(0, 6)
      : [];

    rows.push({ name, url, scores, failed, opportunities });
    console.log(
      `${failed.length ? 'FAIL' : 'ok  '} ${name.padEnd(48)} P${scores.performance} A${scores.accessibility} BP${scores['best-practices']} SEO${scores.seo}${failed.length ? '  — ' + failed.join(', ') : ''}`,
    );
  }

  await chrome.kill();
  await writeFile(
    path.resolve('qa/lighthouse-report.json'),
    JSON.stringify({ base: BASE, checkedAt: new Date().toISOString(), rows }, null, 2),
  );
  console.log(failures ? `\n${failures} page(s) below threshold` : '\nall pages meet the thresholds');
  if (failures) process.exitCode = 1;
}

main();
