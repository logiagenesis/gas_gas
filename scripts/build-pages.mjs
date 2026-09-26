// Generates every HTML page into build/site/, which is the Vite root.
// One template, one set of facts: nothing is hand-copied between pages.

import { mkdir, writeFile, copyFile, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { site, services, safetyAdvice, propertyTypes } from '../src/data/site.js';
import { home, serviceCta, thankYou, privacy, notFound } from '../src/data/pages.js';
import { resolveDeployment } from './lib/paths.mjs';
import { fact } from './lib/facts.mjs';

const ROOT = path.resolve('build/site');
const STATIC = path.resolve('build/static');
const deploy = resolveDeployment();
const BASE = deploy.base;
// Every absolute URL (canonical, og:url, og:image, schema, sitemap) points
// at where the site is actually served: GitHub Pages under the repository
// path today, or the custom domain once public/CNAME names it. Pointing them
// at a domain that does not serve the site leaves link previews without an
// image and search engines with a dead canonical.
const CANON = (deploy.origin ? `${deploy.origin}${BASE}` : `${site.canonicalOrigin}/`).replace(/\/$/, '');
const THANK_YOU_ABSOLUTE = `${deploy.origin}${BASE}thank-you/`;

const FORMSPREE_ID = fact('Formspree form ID');
if (!FORMSPREE_ID) {
  console.error('CLIENT-FACTS.md is missing "Formspree form ID". The quote form cannot be built.');
  process.exit(1);
}

const manifest = JSON.parse(await readFile(path.resolve('build/image-manifest.json'), 'utf8'));
const brand = JSON.parse(await readFile(path.resolve('build/brand-manifest.json'), 'utf8'));

const IMAGE_DIMENSIONS = Object.fromEntries(
  manifest.rows.map((row) => {
    const [w, h] = row.original.split('x').map(Number);
    const width = Math.min(row.width, w);
    return [path.parse(row.source).name, { width, height: Math.round((width * h) / w) }];
  }),
);

const IMAGE_WIDTHS = Object.fromEntries(
  manifest.rows.map((row) => [
    path.parse(row.source).name,
    [...new Set(row.outputs.map((output) => Number(output.file.match(/-(\d+)\.\w+$/)[1])))].sort((a, b) => a - b),
  ]),
);

const esc = (value) =>
  String(value).replace(/&(?!(?:[a-zA-Z][a-zA-Z0-9]*|#\d+|#x[0-9a-fA-F]+);)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const jsonLd = (data) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

const up = (depth) => (depth === 0 ? './' : '../'.repeat(depth));

const TICK =
  '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M7.6 14.2 3.4 10l1.4-1.4 2.8 2.8 7-7L16 5.8z" fill="#16181b"/></svg>';

const PHONE_ICON =
  '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M6.6 2.4 8.4 6 6.8 7.6a11.2 11.2 0 0 0 5.6 5.6L14 11.6l3.6 1.8v3.1c0 .6-.5 1.1-1.1 1.1A14.6 14.6 0 0 1 2.4 3.5c0-.6.5-1.1 1.1-1.1z" fill="currentColor"/></svg>';

const CHAT_ICON =
  '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M10 2.4c4.2 0 7.6 2.9 7.6 6.6 0 3.6-3.4 6.5-7.6 6.5-.9 0-1.8-.1-2.6-.4l-4 1.9 1.3-3.5A6.4 6.4 0 0 1 2.4 9c0-3.7 3.4-6.6 7.6-6.6z" fill="currentColor"/></svg>';

const WHATSAPP_GLYPH =
  'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z';

const whatsappIcon = (size) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${WHATSAPP_GLYPH}" fill="currentColor"/></svg>`;

const MENU_ICON =
  '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M2 4h16v2H2zm0 5h16v2H2zm0 5h16v2H2z" fill="currentColor"/></svg>';

const ARROW =
  '<svg class="arrow" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M9.3 3.3 8 4.6l2.4 2.4H2v2h8.4L8 11.4l1.3 1.3L14 8z" fill="currentColor"/></svg>';

const PLUS =
  '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M7 2h2v5h5v2H9v5H7V9H2V7h5z" fill="currentColor"/></svg>';

const MAIL_ICON =
  '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M2.5 4h15c.6 0 1 .4 1 1v10c0 .6-.4 1-1 1h-15c-.6 0-1-.4-1-1V5c0-.6.4-1 1-1zm.9 2v.3L10 10.6l6.6-4.3V6zm13.2 2.6L10 12.9 3.4 8.6V14h13.2z" fill="currentColor"/></svg>';

// Line icons for the proof points and the about list. 24px, currentColor.
const ICONS = {
  gauge:
    '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9zm0 2a7 7 0 0 1 6.9 6h-2v2h2A7 7 0 0 1 5.1 13h2v-2h-2A7 7 0 0 1 11 5.1v2h2v-2zm3.5 3.1-4.2 4.2a1.3 1.3 0 1 0 1.4 1.4l4.2-4.2z" fill="currentColor"/></svg>',
  doc:
    '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 2h8l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm7 1.5V8h4.5zM8 12v2h8v-2zm0 4v2h5v-2z" fill="currentColor"/><path d="m15.6 15.6 1.4 1.4 3-3 1 1-4 4-2.4-2.4z" fill="currentColor"/></svg>',
  list:
    '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 5h2v2H4zm4 0h12v2H8zM4 11h2v2H4zm4 0h12v2H8zm-4 6h2v2H4zm4 0h8v2H8z" fill="currentColor"/></svg>',
  bolt:
    '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M13.5 2 5 13.5h5.6L9.5 22 19 9.8h-5.8z" fill="currentColor"/></svg>',
  clock:
    '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9zm0 2a7 7 0 1 1-7 7 7 7 0 0 1 7-7zm-1 2v5.4l4.3 2.6 1-1.7-3.3-2V7z" fill="currentColor"/></svg>',
};

// "Text with [accent] words" to HTML, escaping everything else.
const accent = (text) =>
  esc(text).replace(/\[([^\]]+)\]/g, '<span class="accent">$1</span>');
const plain = (text) => text.replace(/[[\]]/g, '');

function googleTag() {
  return `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${site.ga4Id}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${site.ga4Id}');
</script>`;
}

function head({ title, description, canonical, depth, noindex = false, schema = [] }) {
  const prefix = up(depth);
  const ogImage = `${CANON}/assets/og-image.jpg`;
  return `<!DOCTYPE html>
<html lang="en-ZA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${googleTag()}
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex, follow">' : `<link rel="canonical" href="${esc(canonical)}">`}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:secure_url" content="${esc(ogImage)}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:alt" content="${esc(site.name)} logo">
<meta property="og:locale" content="en_ZA">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(ogImage)}">
<meta name="theme-color" content="#16181b">
<link rel="icon" href="/assets/icons/icon-32.png" sizes="32x32" type="image/png">
<link rel="icon" href="/assets/icons/icon-16.png" sizes="16x16" type="image/png">
<link rel="apple-touch-icon" href="/assets/icons/icon-180.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/inter-400.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/inter-700.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/inter-800.woff2" crossorigin>
<link rel="stylesheet" href="${prefix}assets/css/site.css">
${schema.map(jsonLd).join('\n')}
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>`;
}

// The client logo is a stacked lockup, which is unreadable at header height.
// It is laid out horizontally from the mark and the wordmark the brand step
// separated out. Header and footer are charcoal, so the wordmark is rendered
// white by a CSS filter; the mark keeps its own colour.
function brandLockup(markPx, wordPx) {
  if (!brand.usingClientLogo) {
    return `<img src="/assets/brand/${brand.standInSvg}" alt="${esc(site.name)}" width="180" height="40">`;
  }
  const mark = brand.mark;
  const markWidth = Math.round((markPx * mark.width) / mark.height);
  const parts = [
    `<img class="brand__mark" src="/assets/brand/${mark.file}" alt="" width="${markWidth}" height="${markPx}" aria-hidden="true">`,
  ];
  if (brand.wordmark) {
    const word = brand.wordmark;
    const wordWidth = Math.round((wordPx * word.width) / word.height);
    parts.push(
      `<img class="brand__word" src="/assets/brand/${word.file}" alt="${esc(site.name)}" width="${wordWidth}" height="${wordPx}">`,
    );
  }
  return parts.join('');
}

const NAV = [
  { label: 'Services', href: `${BASE}#services` },
  { label: 'How it works', href: `${BASE}#how-it-works` },
  { label: 'About', href: `${BASE}#about` },
  { label: 'Contact', href: `${BASE}#contact` },
];

// A slim bar above the header on every page: the emergency line is the one
// thing a visitor with a gas smell needs, and it should never be a scroll away.
function emergencyBar() {
  return `<div class="emergency-bar">
<div class="wrap emergency-bar__inner">
<span><strong>Gas emergency?</strong> <span class="emergency-bar__more">We answer ${site.emergency}.</span></span>
<a href="tel:${site.phone.tel}">${PHONE_ICON}Call ${site.phone.display}</a>
</div>
</div>`;
}

function header() {
  return `${emergencyBar()}
<header class="site-header">
<div class="wrap site-header__inner">
<a class="brand" href="${BASE}" aria-label="${esc(site.name)}, home">${brandLockup(38, 18)}</a>
<a class="header-call" href="tel:${site.phone.tel}" aria-label="Call ${esc(site.name)} on ${site.phone.display}">${PHONE_ICON}</a>
<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">${MENU_ICON}Menu</button>
<nav class="site-nav" id="site-nav" aria-label="Main">
${NAV.map((item) => `<a href="${item.href}">${esc(item.label)}</a>`).join('\n')}
<a class="nav-contact" href="tel:${site.phone.tel}">${PHONE_ICON}Call ${site.phone.display}</a>
<a class="nav-contact" href="${site.phone.whatsapp}" rel="noopener">${CHAT_ICON}WhatsApp us</a>
</nav>
<a class="header-phone" href="tel:${site.phone.tel}">${PHONE_ICON}${site.phone.display}</a>
<a class="btn btn--whatsapp header-whatsapp" href="${site.phone.whatsapp}" target="_blank" rel="noopener noreferrer">${whatsappIcon(20)}WhatsApp</a>
<a class="btn btn--primary header-cta" href="${BASE}#quote">Get a quote</a>
</div>
</header>`;
}

function whatsappFloat() {
  return `<a class="wa-float" href="${site.phone.whatsapp}" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">${whatsappIcon(24)}</a>`;
}

function footer(depth) {
  const year = new Date().getFullYear();
  return `${whatsappFloat()}
<footer class="site-footer">
<div class="wrap">
<div class="site-footer__top">
<div>
<span class="brand brand--footer">${brandLockup(40, 19)}</span>
<p>${esc(site.footerLine)}</p>
<ul class="footer-contact">
<li><a href="tel:${site.phone.tel}">${PHONE_ICON}${site.phone.display}</a></li>
<li><a href="${site.phone.whatsapp}" rel="noopener">${CHAT_ICON}WhatsApp ${site.phone.display}</a></li>
<li><a href="mailto:${site.email}">${site.email}</a></li>
</ul>
</div>
<div>
<h3>Pages</h3>
<ul>
${NAV.map((item) => `<li><a href="${item.href}">${esc(item.label)}</a></li>`).join('\n')}
<li><a href="${BASE}#faq">Questions</a></li>
<li><a href="${BASE}#gas-safety">If you smell gas</a></li>
<li><a href="${BASE}privacy/">Privacy policy</a></li>
</ul>
</div>
<div>
<h3>Services</h3>
<ul>
${services
  .map((service) => `<li><a href="${BASE}services/${service.slug}/">${esc(service.name)}</a></li>`)
  .join('\n')}
</ul>
</div>
</div>
<div class="site-footer__bottom">
<span>&copy; ${year} ${esc(site.name)}</span>
<span><a href="${site.agency.url}" rel="noopener">Website by ${esc(site.agency.name)}</a></span>
</div>
</div>
</footer>
<script type="module" src="${up(depth)}assets/js/site.js"></script>
</body>
</html>`;
}

// Every photograph ships in two or three widths; srcset lets the browser pick
// the smallest one that stays sharp at the size it is shown.
function picture(name, alt, { priority = false, className = '', sizes = '100vw' } = {}) {
  const dims = IMAGE_DIMENSIONS[name];
  const widths = IMAGE_WIDTHS[name];
  const largest = widths[widths.length - 1];
  const set = (ext) => widths.map((width) => `/assets/img/${name}-${width}.${ext} ${width}w`).join(', ');
  const loading = priority ? '' : ' loading="lazy"';
  const fetch = priority ? ' fetchpriority="high"' : '';
  return `<picture${className ? ` class="${className}"` : ''}>
<source type="image/webp" srcset="${set('webp')}" sizes="${sizes}">
<img src="/assets/img/${name}-${largest}.jpg" srcset="${set('jpg')}" sizes="${sizes}" alt="${esc(alt)}" width="${dims.width}" height="${dims.height}"${loading}${fetch} decoding="async">
</picture>`;
}

function quoteHref(slug) {
  return `${BASE}?service=${encodeURIComponent(slug)}#quote`;
}

const CARD_SIZES = '(max-width: 767px) calc(100vw - 32px), (max-width: 1024px) 45vw, 380px';

// The card's four parts are direct children so the grid can line them up
// across a row with subgrid. The photograph links to the service as well,
// but is hidden from assistive technology so the link is announced once.
function serviceCard(service) {
  const number = String(services.indexOf(service) + 1).padStart(2, '0');
  const href = `${BASE}services/${service.slug}/`;
  return `<li class="card">
<a class="card__media" href="${href}" tabindex="-1" aria-hidden="true">${picture(service.image, service.alt, { sizes: CARD_SIZES })}<span class="card__index">${number}</span></a>
<h3>${esc(service.name)}</h3>
<p class="card__text">${esc(service.card)}</p>
<div class="card__links">
<a class="link-arrow" href="${href}">View service<span class="visually-hidden">: ${esc(service.name)}</span>${ARROW}</a>
<a class="card__quote" href="${quoteHref(service.slug)}">Get a quote<span class="visually-hidden"> for ${esc(service.name)}</span></a>
</div>
</li>`;
}

function contactTiles() {
  return `<ul class="contact-tiles">
<li><a href="tel:${site.phone.tel}"><span class="tile__icon">${PHONE_ICON}</span><small>Call</small><strong>${site.phone.display}</strong></a></li>
<li><a href="${site.phone.whatsapp}" target="_blank" rel="noopener noreferrer"><span class="tile__icon tile__icon--wa">${whatsappIcon(20)}</span><small>WhatsApp</small><strong>${site.phone.display}</strong></a></li>
<li><a href="mailto:${site.email}"><span class="tile__icon">${MAIL_ICON}</span><small>Email</small><strong>${site.email}</strong></a></li>
</ul>`;
}

function quoteForm() {
  const options = services
    .map((service) => `<option value="${esc(service.name)}" data-slug="${service.slug}">${esc(service.name)}</option>`)
    .join('\n');
  return `<form class="quote-form" id="quote" action="https://formspree.io/f/${FORMSPREE_ID}" method="POST" data-thank-you="${THANK_YOU_ABSOLUTE}">
<input type="hidden" name="_subject" value="Quote request — Gas Designs website">
<div class="honey" aria-hidden="true"><label for="_gotcha">Leave this field empty</label><input type="text" id="_gotcha" name="_gotcha" tabindex="-1" autocomplete="off"></div>
<div class="form-fields">
<div class="field"><label for="name">Your name</label><input type="text" id="name" name="name" autocomplete="name" required></div>
<div class="field"><label for="phone">Phone number</label><input type="tel" id="phone" name="phone" autocomplete="tel" required></div>
<div class="field"><label for="email">Email address</label><input type="email" id="email" name="email" autocomplete="email" required></div>
<div class="field"><label for="suburb">Suburb</label><input type="text" id="suburb" name="suburb" autocomplete="address-level2" required></div>
<div class="field"><label for="property-type">Property type</label><select id="property-type" name="property_type" required>
<option value="">Please choose</option>
${propertyTypes.map((type) => `<option value="${type}">${type}</option>`).join('\n')}
</select></div>
<div class="field"><label for="service">Service needed</label><select id="service" name="service" required>
<option value="Not sure" data-slug="not-sure">Not sure</option>
${options}
</select></div>
<div class="field field--full"><label for="message">What do you need done?</label><textarea id="message" name="message" rows="6" placeholder="For example: a gas hob and a geyser in a townhouse, cylinders outside the kitchen wall." required></textarea></div>
<div class="field field--consent"><input type="checkbox" id="consent" name="consent" value="yes" required><label for="consent">I agree that Gas Designs may use these details to answer my enquiry and prepare a quote.</label></div>
<div class="form-actions">
<p class="form-status" role="status" aria-live="polite"></p>
<button class="btn btn--primary btn--block" type="submit">Send my quote request</button>
</div>
</div>
</form>`;
}

function intro({ eyebrow, heading, lead, split = false }) {
  return `<div class="section__intro${split ? ' section__intro--split' : ''} reveal">
<div>${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}<h2>${esc(heading)}</h2></div>
${lead ? `<p>${esc(lead)}</p>` : ''}
</div>`;
}

/* ---------------- Home ---------------- */

function buildHome() {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: site.name,
      url: `${CANON}/`,
      email: site.email,
      telephone: site.phone.international,
      description: site.description,
      areaServed: [...site.cities, site.region].map((name) => ({ '@type': 'Place', name })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: home.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    },
  ];

  return `${head({
    title: home.title,
    description: home.metaDescription,
    canonical: `${CANON}/`,
    depth: 0,
    schema,
  })}
${header()}
<main id="main">

<section class="hero">
<div class="hero__media">${picture('hero', home.heroImageAlt, { priority: true })}</div>
<div class="wrap hero__inner">
<p class="eyebrow">${esc(home.eyebrow)}</p>
<h1>${accent(home.h1)}</h1>
<p class="hero__lead">${esc(home.heroLead)}</p>
<div class="hero__actions">
<a class="btn btn--primary" href="${BASE}#quote">Get a written quote${ARROW}</a>
<a class="btn btn--secondary" href="${BASE}#services">Explore services</a>
</div>
<ul class="proof">
${home.proof.map((item) => `<li>${ICONS[item.icon]}<strong>${esc(item.title)}</strong><span>${esc(item.text)}</span></li>`).join('\n')}
</ul>
</div>
</section>

<section class="section section--grey" id="services">
<div class="wrap">
${intro({ eyebrow: home.servicesEyebrow, heading: home.servicesHeading, lead: home.servicesLead, split: true })}
<ul class="card-grid">
${services.map((service) => serviceCard(service)).join('\n')}
</ul>
</div>
</section>

<section class="alert-band" id="gas-safety" aria-labelledby="gas-safety-heading">
<div class="wrap alert-band__inner">
<div class="alert-band__intro">
<div>
<p class="eyebrow">${esc(home.safetyEyebrow)}</p>
<h2 id="gas-safety-heading">${esc(home.safetyHeading)}</h2>
<p>${esc(home.safetyLead)}</p>
</div>
<a class="btn btn--dark" href="tel:${site.phone.tel}">${PHONE_ICON}Call ${site.emergency}: ${site.phone.display}</a>
</div>
<ol class="alert-steps">
${safetyAdvice.stepsShort.map((step) => `<li>${esc(step)}</li>`).join('\n')}
</ol>
<p class="alert-band__note">${esc(home.safetyNote)}</p>
</div>
</section>

<section class="section section--dark process" id="how-it-works">
<div class="wrap">
${intro({ eyebrow: home.stepsEyebrow, heading: home.stepsHeading, lead: home.stepsLead })}
<ol class="process__line">
${home.steps
  .map(
    (step, index) => `<li class="process__step reveal">
<span class="process__node" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
<h3>${esc(step.name)}</h3>
<p>${esc(step.text)}</p>
<span class="process__tag">${esc(step.tag)}</span>
</li>`,
  )
  .join('\n')}
</ol>
<div class="process__cta">
<p>${esc(home.stepsCta)}</p>
<div class="hero__actions">
<a class="btn btn--primary" href="${BASE}#quote">Get a written quote${ARROW}</a>
<a class="btn btn--whatsapp" href="${site.phone.whatsapp}" target="_blank" rel="noopener noreferrer">${whatsappIcon(20)}WhatsApp us</a>
</div>
</div>
</div>
</section>

<section class="section section--white" id="compliance">
<div class="wrap split">
<div class="split__text reveal">
<p class="eyebrow">${esc(home.complianceEyebrow)}</p>
<h2>${esc(home.complianceHeading)}</h2>
${home.complianceBody.map((paragraph) => `<p>${esc(paragraph)}</p>`).join('\n')}
</div>
<div class="split__media split__media--tagged reveal">${picture('compliance', home.complianceImageAlt, { sizes: '(max-width: 899px) 100vw, 560px' })}
<div class="test-tag">
<p class="test-tag__title">${esc(home.testTag.title)}</p>
<dl>
${home.testTag.rows.map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('\n')}
</dl>
</div>
</div>
</div>
</section>

<section class="section section--grey" id="about">
<div class="wrap split split--reverse">
<div class="split__media reveal">${picture('about', home.aboutImageAlt, { sizes: '(max-width: 899px) 100vw, 560px' })}</div>
<div class="split__text reveal">
<p class="eyebrow">${esc(home.aboutEyebrow)}</p>
<h2>${esc(home.aboutHeading)}</h2>
${home.aboutBody.map((paragraph) => `<p>${esc(paragraph)}</p>`).join('\n')}
<ul class="points">
${home.aboutPoints.map((point) => `<li><span class="points__icon">${ICONS[point.icon]}</span>${esc(point.text)}</li>`).join('\n')}
</ul>
</div>
</div>
</section>

<section class="section section--white" id="faq">
<div class="wrap faq-layout">
${intro({ eyebrow: home.faqEyebrow, heading: home.faqHeading, lead: home.faqLead })}
<div class="faq">
${home.faqs
  .map(
    (faq, index) =>
      `<details class="faq__item"${index === 0 ? ' open' : ''}><summary><h3>${esc(faq.q)}</h3><span class="faq__icon">${PLUS}</span></summary><p>${esc(faq.a)}</p></details>`,
  )
  .join('\n')}
</div>
</div>
</section>

<section class="section section--grey" id="contact">
<div class="wrap">
${intro({ eyebrow: home.contactEyebrow, heading: home.contactHeading, lead: home.contactLead })}
<div class="contact-grid">
<div>${quoteForm()}</div>
<aside class="contact-aside">
<div class="contact-aside__media">${picture('contact', home.contactImageAlt, { sizes: '(max-width: 1024px) 100vw, 440px' })}</div>
<div class="contact-aside__body">
<h3>${esc(home.contactAsideHeading)}</h3>
<p>${esc(home.contactAsideText)}</p>
${contactTiles()}
</div>
</aside>
</div>
</div>
</section>

</main>
${footer(0)}`;
}

/* ---------------- Service pages ---------------- */

function ctaBand({ eyebrow, heading, text, slug }) {
  return `<section class="cta-band">
<div class="wrap cta-band__inner">
<div>
<p class="eyebrow">${esc(eyebrow)}</p>
<h2>${esc(heading)}</h2>
<p>${esc(text)}</p>
</div>
<div class="cta-band__actions">
<a class="btn btn--primary" href="${slug ? quoteHref(slug) : `${BASE}#quote`}">Get a written quote${ARROW}</a>
<a class="btn btn--whatsapp" href="${site.phone.whatsapp}" target="_blank" rel="noopener noreferrer">${whatsappIcon(20)}WhatsApp us</a>
</div>
</div>
</section>`;
}

function buildService(service) {
  const related = service.related
    .map((slug) => services.find((candidate) => candidate.slug === slug))
    .filter(Boolean);

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.name,
      description: service.metaDescription,
      url: `${CANON}/services/${service.slug}/`,
      areaServed: [...site.cities, site.region].map((name) => ({ '@type': 'Place', name })),
      provider: {
        '@type': 'LocalBusiness',
        name: site.name,
        url: `${CANON}/`,
        email: site.email,
        telephone: site.phone.international,
      },
    },
  ];

  const safetyBlock = service.safety
    ? `<section class="section section--white section--flush">
<div class="wrap">
<div class="safety-panel">
<h2>${esc(safetyAdvice.heading)}</h2>
<ol>
${safetyAdvice.steps.map((step) => `<li>${esc(step)}</li>`).join('\n')}
</ol>
</div>
</div>
</section>`
    : '';

  return `${head({
    title: `${service.metaTitle} | ${site.name}`,
    description: service.metaDescription,
    canonical: `${CANON}/services/${service.slug}/`,
    depth: 2,
    schema,
  })}
${header()}
<main id="main">

<section class="page-hero">
<div class="wrap page-hero__inner">
<div>
<p class="crumbs"><a href="${BASE}#services">Services</a><span aria-hidden="true">/</span>${esc(service.name)}</p>
<h1>${esc(service.name)}</h1>
<p class="page-hero__lead">${esc(service.intro)}</p>
<div class="hero__actions">
<a class="btn btn--primary" href="${quoteHref(service.slug)}">Get a written quote${ARROW}</a>
<a class="btn btn--secondary" href="tel:${site.phone.tel}">${PHONE_ICON}${site.phone.display}</a>
</div>
</div>
<div class="page-hero__media">${picture(service.image, service.alt, { priority: true, sizes: '(max-width: 899px) 100vw, 560px' })}</div>
</div>
</section>

<section class="section section--white">
<div class="wrap service-body">
<div>
<p class="eyebrow">The scope</p>
<h2>What is included</h2>
<ul class="ticks ticks--columns">
${service.included.map((item) => `<li>${TICK}${esc(item)}</li>`).join('\n')}
</ul>
</div>
<aside class="aside-card">
<h2>Who it is for</h2>
<p>${esc(service.forWho)}</p>
<hr class="aside-card__rule">
<a class="btn btn--dark" href="${quoteHref(service.slug)}">Get a quote for this job</a>
<a class="btn btn--whatsapp" href="${site.phone.whatsapp}" target="_blank" rel="noopener noreferrer">${whatsappIcon(20)}WhatsApp ${site.phone.display}</a>
</aside>
</div>
</section>

${safetyBlock}

<section class="section section--grey">
<div class="wrap">
${intro({ eyebrow: 'Often booked together', heading: 'Related services' })}
<ul class="related-grid">
${related.map((item) => serviceCard(item)).join('\n')}
</ul>
</div>
</section>

${ctaBand({ ...serviceCta, slug: service.slug })}

</main>
${footer(2)}`;
}

/* ---------------- Simple pages ---------------- */

function buildThankYou() {
  return `${head({
    title: thankYou.title,
    description: thankYou.metaDescription,
    canonical: `${CANON}/thank-you/`,
    depth: 1,
    noindex: true,
  })}
${header()}
<main id="main">
<section class="section section--white">
<div class="wrap prose">
<h1>${esc(thankYou.h1)}</h1>
${thankYou.body.map((paragraph) => `<p>${esc(paragraph)}</p>`).join('\n')}
<ul class="contact-methods">
<li><a href="tel:${site.phone.tel}">${PHONE_ICON}${site.phone.display}</a></li>
<li><a href="${site.phone.whatsapp}" rel="noopener">${CHAT_ICON}WhatsApp ${site.phone.display}</a></li>
<li><a href="mailto:${site.email}">${site.email}</a></li>
</ul>
<h2>${esc(safetyAdvice.heading)}</h2>
<p>${esc(thankYou.safetyNote)}</p>
<p><a class="btn btn--dark" href="${BASE}">Back to the home page</a></p>
</div>
</section>
</main>
${footer(1)}`;
}

function buildPrivacy() {
  return `${head({
    title: privacy.title,
    description: privacy.metaDescription,
    canonical: `${CANON}/privacy/`,
    depth: 1,
  })}
${header()}
<main id="main">
<section class="section section--white">
<div class="wrap prose">
<h1>${esc(privacy.h1)}</h1>
${privacy.sections
  .map(
    (section) =>
      `<h2>${esc(section.heading)}</h2>${section.body.map((paragraph) => `<p>${esc(paragraph)}</p>`).join('')}`,
  )
  .join('\n')}
</div>
</section>
</main>
${footer(1)}`;
}

function buildNotFound() {
  return `${head({
    title: notFound.title,
    description: notFound.metaDescription,
    canonical: `${CANON}/404.html`,
    depth: 0,
    noindex: true,
  })}
${header()}
<main id="main">
<section class="section section--white">
<div class="wrap prose">
<h1>${esc(notFound.h1)}</h1>
<p>${esc(notFound.body)}</p>
<h2>${esc(notFound.linksHeading)}</h2>
<ul class="ticks">
<li>${TICK}<a href="${BASE}">Home page</a></li>
<li>${TICK}<a href="${BASE}#services">All services</a></li>
<li>${TICK}<a href="${BASE}#quote">Get a written quote</a></li>
</ul>
</div>
</section>
</main>
${footer(0)}`;
}

/* ---------------- Write ---------------- */

async function main() {
  await rm(ROOT, { recursive: true, force: true });
  await mkdir(path.join(ROOT, 'assets/css'), { recursive: true });
  await mkdir(path.join(ROOT, 'assets/js'), { recursive: true });
  await mkdir(path.join(STATIC, 'assets/fonts'), { recursive: true });

  await copyFile(path.resolve('src/css/site.css'), path.join(ROOT, 'assets/css/site.css'));
  await copyFile(path.resolve('src/js/site.js'), path.join(ROOT, 'assets/js/site.js'));

  for (const [weight, file] of [
    [400, 'inter-latin-400-normal.woff2'],
    [700, 'inter-latin-700-normal.woff2'],
    [800, 'inter-latin-800-normal.woff2'],
  ]) {
    await copyFile(
      path.resolve('node_modules/@fontsource/inter/files', file),
      path.join(STATIC, `assets/fonts/inter-${weight}.woff2`),
    );
  }

  const pages = [['index.html', buildHome()], ['404.html', buildNotFound()]];
  for (const service of services) {
    pages.push([`services/${service.slug}/index.html`, buildService(service)]);
  }
  pages.push(['thank-you/index.html', buildThankYou()]);
  pages.push(['privacy/index.html', buildPrivacy()]);

  for (const [file, html] of pages) {
    const target = path.join(ROOT, file);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, html);
  }

  // robots.txt and sitemap.xml
  const urls = [
    `${CANON}/`,
    ...services.map((service) => `${CANON}/services/${service.slug}/`),
    `${CANON}/privacy/`,
  ];
  const today = new Date().toISOString().slice(0, 10);
  await writeFile(
    path.join(STATIC, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map((url) => `  <url><loc>${url}</loc><lastmod>${today}</lastmod></url>`)
      .join('\n')}\n</urlset>\n`,
  );
  await writeFile(
    path.join(STATIC, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${CANON}/sitemap.xml\n`,
  );

  if (deploy.cname) {
    await writeFile(path.join(STATIC, 'CNAME'), `${deploy.cname}\n`);
  }

  await writeFile(
    path.resolve('build/pages-manifest.json'),
    JSON.stringify({ base: BASE, origin: deploy.origin, thankYou: THANK_YOU_ABSOLUTE, pages: pages.map(([f]) => f) }, null, 2),
  );

  console.log(`pages: ${pages.length} written, base ${BASE}`);
}

main();
