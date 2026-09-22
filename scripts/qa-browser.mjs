// Browser QA against a running site. Usage: node scripts/qa-browser.mjs <baseUrl>
// Records screenshots, horizontal overflow, console errors, link status and
// a computed contrast table. Writes qa/browser-report.json and prints a summary.

import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// This environment ships Chromium separately from the pinned Playwright build,
// so point at it directly when the bundled revision is not present.
const PREINSTALLED = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/opt/pw-browsers/chromium'];
const executablePath = PREINSTALLED.find((candidate) => existsSync(candidate));
const launchOptions = executablePath ? { executablePath } : {};

const BASE = (process.argv[2] || 'http://localhost:4173/gas_gas/').replace(/\/?$/, '/');
const SHOTS = path.resolve('qa/screenshots');
const WIDTHS = [360, 768, 1024, 1440];
const SHOT_WIDTHS = [360, 1440];

const PAGES = [
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
];

const CONTRAST_SCRIPT = `() => {
  const parse = (value) => {
    const m = String(value).match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const parts = m[1].split(',').map((n) => parseFloat(n));
    return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
  };
  const lum = (c) => {
    const ch = [c.r, c.g, c.b].map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  };
  const ratio = (a, b) => {
    const la = lum(a), lb = lum(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  };
  const hex = (c) => '#' + [c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
  const bgOf = (el) => {
    let node = el;
    while (node && node !== document.documentElement) {
      const bg = parse(getComputedStyle(node).backgroundColor);
      if (bg && bg.a > 0.95) return bg;
      node = node.parentElement;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };
  const out = {};
  document.querySelectorAll('h1,h2,h3,p,a,li,label,span,button,input,select,textarea').forEach((el) => {
    const text = (el.textContent || '').trim();
    if (!text) return;
    const style = getComputedStyle(el);
    if (style.visibility === 'hidden' || style.display === 'none') return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const fg = parse(style.color);
    if (!fg || fg.a < 0.95) return;
    const bg = bgOf(el);
    const size = parseFloat(style.fontSize);
    const weight = parseInt(style.fontWeight, 10) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const key = hex(fg) + '|' + hex(bg) + '|' + (large ? 'large' : 'normal');
    if (!out[key]) {
      out[key] = {
        foreground: hex(fg),
        background: hex(bg),
        fontSizePx: size,
        fontWeight: weight,
        large,
        ratio: Math.round(ratio(fg, bg) * 100) / 100,
        required: large ? 3 : 4.5,
        sample: text.slice(0, 48),
      };
    }
  });
  return Object.values(out);
}`;

const OVERFLOW_SCRIPT = `() => {
  const doc = document.documentElement;
  const offenders = [];
  if (doc.scrollWidth > doc.clientWidth + 1) {
    document.querySelectorAll('body *').forEach((el) => {
      const rect = el.getBoundingClientRect();
      // Only rightward overflow widens the page in a left-to-right layout;
      // content parked off-screen to the left, such as the honeypot, does not.
      if (rect.right > doc.clientWidth + 1) {
        offenders.push(el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : ''));
      }
    });
  }
  return {
    scrollWidth: doc.scrollWidth,
    clientWidth: doc.clientWidth,
    overflow: doc.scrollWidth > doc.clientWidth + 1,
    offenders: [...new Set(offenders)].slice(0, 8),
  };
}`;

async function main() {
  await mkdir(SHOTS, { recursive: true });
  const browser = await chromium.launch(launchOptions);
  const report = { base: BASE, checkedAt: new Date().toISOString(), pages: [], contrast: [], links: [] };
  const contrastSeen = new Map();
  const linkSeen = new Map();
  let failures = 0;

  for (const [name, route] of PAGES) {
    const url = BASE + route;
    const entry = { name, url, status: null, overflow: {}, consoleErrors: [], pageErrors: [], h1: null, blockedHosts: [] };

    for (const width of WIDTHS) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
      const page = await context.newPage();
      page.on('console', (msg) => {
        if (msg.type() === 'error' && !entry.consoleErrors.includes(msg.text())) {
          entry.consoleErrors.push(msg.text());
        }
      });
      page.on('pageerror', (error) => entry.pageErrors.push(String(error)));
      // This sandbox blocks some third-party hosts at the network layer. A
      // resource error caused by that is an environment limit, not a defect in
      // the page, so it is recorded separately.
      page.on('requestfailed', (request) => {
        try {
          const host = new URL(request.url()).host;
          if (host !== new URL(url).host && !entry.blockedHosts.includes(host)) entry.blockedHosts.push(host);
        } catch {
          /* ignore unparseable URLs */
        }
      });

      const response = await page.goto(url, { waitUntil: 'networkidle' });
      if (width === WIDTHS[0]) entry.status = response ? response.status() : null;

      // Scroll the whole page so lazy-loaded images below the fold actually
      // load before anything is measured or photographed.
      await page.evaluate(`(async () => {
        const step = window.innerHeight;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      })()`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(200);
      entry.overflow[width] = await page.evaluate(`(${OVERFLOW_SCRIPT})()`);
      if (entry.overflow[width].overflow) failures += 1;

      if (width === 360) {
        const cta = await page.locator('.header-cta').first();
        const visible = (await cta.count()) ? await cta.isVisible() : false;
        entry.headerCtaHiddenAt360 = !visible;
        if (visible) failures += 1;
        const toggle = page.locator('.nav-toggle').first();
        entry.navToggleVisibleAt360 = (await toggle.count()) ? await toggle.isVisible() : false;
        if (!entry.navToggleVisibleAt360) failures += 1;
      }

      if (width === 1440) {
        entry.h1 = await page.locator('h1').first().innerText();
        const broken = await page.evaluate(`(() => [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.currentSrc || i.src))()`);
        entry.brokenImages = broken;
        if (broken.length) failures += 1;

        for (const row of await page.evaluate(`(${CONTRAST_SCRIPT})()`)) {
          const key = `${row.foreground}|${row.background}|${row.large}`;
          if (!contrastSeen.has(key)) contrastSeen.set(key, { ...row, page: name });
        }

        for (const href of await page.evaluate(`(() => [...document.querySelectorAll('a[href]')].map((a) => a.href))()`)) {
          if (!linkSeen.has(href)) linkSeen.set(href, name);
        }
        for (const src of await page.evaluate(`(() => [...document.querySelectorAll('img[src], source[srcset], script[src], link[rel=stylesheet]')].map((el) => el.src || el.srcset || el.href))()`)) {
          if (src && !linkSeen.has(src)) linkSeen.set(src, name);
        }
      }

      if (SHOT_WIDTHS.includes(width)) {
        await page.screenshot({
          path: path.join(SHOTS, `${name}-${width}.png`),
          fullPage: true,
        });
      }
      await context.close();
    }

    // A bare "Failed to load resource" is only excused when every failed
    // request went to a third-party host this sandbox blocks.
    const excused =
      entry.blockedHosts.length > 0 &&
      entry.consoleErrors.every((message) => /Failed to load resource/i.test(message));
    entry.realConsoleErrors = excused ? [] : entry.consoleErrors;
    if (entry.realConsoleErrors.length || entry.pageErrors.length) failures += 1;
    report.pages.push(entry);
    const flag =
      entry.realConsoleErrors.length || Object.values(entry.overflow).some((o) => o.overflow) ? 'FAIL' : 'ok';
    const blocked = entry.blockedHosts.length ? ` (blocked by sandbox: ${entry.blockedHosts.join(', ')})` : '';
    console.log(
      `${flag.padEnd(4)} ${name} — status ${entry.status}, console errors ${entry.realConsoleErrors.length}${blocked}`,
    );
  }

  report.contrast = [...contrastSeen.values()].sort((a, b) => a.ratio - b.ratio);
  const contrastFails = report.contrast.filter((row) => row.ratio < row.required);
  if (contrastFails.length) failures += contrastFails.length;

  // Link and asset status check
  const context = await browser.newContext();
  const page = await context.newPage();
  for (const [url, from] of linkSeen) {
    if (!url.startsWith(BASE.split('/').slice(0, 3).join('/'))) {
      report.links.push({ url, from, status: 'external, not fetched' });
      continue;
    }
    const response = await page.request.get(url);
    report.links.push({ url, from, status: response.status() });
    if (response.status() >= 400) failures += 1;
  }
  const notFoundResponse = await page.request.get(`${BASE}this-path-does-not-exist/`);
  report.badPathStatus = notFoundResponse.status();
  await context.close();
  await browser.close();

  await writeFile(path.resolve('qa/browser-report.json'), JSON.stringify(report, null, 2));

  console.log(`\ncontrast pairs: ${report.contrast.length}, below AA: ${contrastFails.length}`);
  for (const row of contrastFails) {
    console.log(`  FAIL ${row.foreground} on ${row.background} = ${row.ratio}:1 (needs ${row.required}) "${row.sample}"`);
  }
  const badLinks = report.links.filter((l) => typeof l.status === 'number' && l.status >= 400);
  console.log(`links checked: ${report.links.length}, broken: ${badLinks.length}`);
  for (const link of badLinks) console.log(`  ${link.status} ${link.url}`);
  console.log(`bad path returns: ${report.badPathStatus}`);
  console.log(failures ? `\n${failures} problem(s)` : '\nall browser checks passed');
  if (failures) process.exit(1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}

// --- Anchor landing check (fix list item 1) -------------------------------
// Every in-page anchor must come to rest below the sticky header.
export async function checkAnchors(baseUrl, launchOptions) {
  const { chromium: browserType } = await import('@playwright/test');
  const browser = await browserType.launch(launchOptions);
  const failures = [];

  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 800 } });
    const page = await context.newPage();
    await page.goto(baseUrl, { waitUntil: 'networkidle' });

    const anchors = await page.evaluate(
      `(() => [...document.querySelectorAll('.site-nav a[href*="#"], .header-cta[href*="#"]')]
        .map((a) => a.getAttribute('href').split('#')[1]).filter(Boolean))()`,
    );

    for (const id of [...new Set(anchors)]) {
      const result = await page.evaluate(
        `(() => {
          const target = document.getElementById(${JSON.stringify(id)});
          if (!target) return { id: ${JSON.stringify(id)}, missing: true };
          target.scrollIntoView();
          return new Promise((resolve) => setTimeout(() => {
            const header = document.querySelector('.site-header').getBoundingClientRect();
            const rect = target.getBoundingClientRect();
            resolve({ id: ${JSON.stringify(id)}, top: Math.round(rect.top), headerBottom: Math.round(header.bottom) });
          }, 120));
        })()`,
      );
      if (result.missing) {
        failures.push(`${width}px: #${result.id} does not exist`);
      } else if (result.top < result.headerBottom) {
        failures.push(`${width}px: #${result.id} rests at ${result.top}, under the header bottom ${result.headerBottom}`);
      }
    }
    await context.close();
  }

  await browser.close();
  return failures;
}

// --- GA4 check (fix list item 2) -----------------------------------------
// Asserts the page requests the gtag library for the right measurement ID and
// that dataLayer carries a config entry for it. The request itself may fail in
// a sandbox that blocks googletagmanager.com; the assertion is that it is made.
export async function checkGa4(baseUrl, launchOptions, measurementId = 'G-JDXDHXGZ5Q') {
  const { chromium: browserType } = await import('@playwright/test');
  const browser = await browserType.launch(launchOptions);
  const context = await browser.newContext();
  const page = await context.newPage();
  const requested = [];
  page.on('request', (request) => requested.push(request.url()));

  await page.goto(baseUrl, { waitUntil: 'load' });
  await page.waitForTimeout(600);

  const wanted = `www.googletagmanager.com/gtag/js?id=${measurementId}`;
  const sawRequest = requested.some((url) => url.includes(wanted));
  const hasConfig = await page.evaluate(
    `(() => (window.dataLayer || []).some((row) => row && row[0] === 'config' && row[1] === ${JSON.stringify(measurementId)}))()`,
  );

  await browser.close();
  const failures = [];
  if (!sawRequest) failures.push(`no request to ${wanted}`);
  if (!hasConfig) failures.push(`dataLayer has no config entry for ${measurementId}`);
  return failures;
}
