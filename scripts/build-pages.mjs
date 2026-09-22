// Generates every HTML page into build/site/, which is the Vite root.
// One template, one set of facts: nothing is hand-copied between pages.

import { mkdir, writeFile, copyFile, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { site, services, safetyAdvice, propertyTypes } from '../src/data/site.js';
import { home, thankYou, privacy, notFound } from '../src/data/pages.js';
import { resolveDeployment } from './lib/paths.mjs';

const ROOT = path.resolve('build/site');
const STATIC = path.resolve('build/static');
const deploy = resolveDeployment();
const BASE = deploy.base;
const CANON = site.canonicalOrigin;
const THANK_YOU_ABSOLUTE = `${deploy.origin}${BASE}thank-you/`;

const manifest = JSON.parse(await readFile(path.resolve('build/image-manifest.json'), 'utf8'));
const brand = JSON.parse(await readFile(path.resolve('build/brand-manifest.json'), 'utf8'));

const IMAGE_DIMENSIONS = Object.fromEntries(
  manifest.rows.map((row) => {
    const [w, h] = row.original.split('x').map(Number);
    const width = Math.min(row.width, w);
    return [path.parse(row.source).name, { width, height: Math.round((width * h) / w) }];
  }),
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

function header() {
  return `<header class="site-header">
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
<a class="btn btn--primary header-cta" href="${BASE}#quote">Request a quote</a>
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
<li><a href="${BASE}privacy/">Privacy policy</a></li>
</ul>
</div>
<div>
<h3>Services</h3>
<ul>
${services
  .slice(0, 5)
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

function picture(name, alt, { priority = false, className = '' } = {}) {
  const dims = IMAGE_DIMENSIONS[name];
  const file = `${name}-${dims.width >= 1920 ? 1920 : 1200}`;
  const loading = priority ? '' : ' loading="lazy"';
  const fetch = priority ? ' fetchpriority="high"' : '';
  return `<picture${className ? ` class="${className}"` : ''}>
<source type="image/webp" srcset="/assets/img/${file}.webp">
<img src="/assets/img/${file}.jpg" alt="${esc(alt)}" width="${dims.width}" height="${dims.height}"${loading}${fetch} decoding="async">
</picture>`;
}

function quoteHref(slug) {
  return `${BASE}?service=${encodeURIComponent(slug)}#quote`;
}

function serviceCard(service, priority = false) {
  const safety = service.safety
    ? `<p class="card__safety"><strong>${esc(safetyAdvice.heading)}:</strong> ${esc(safetyAdvice.short)}</p>`
    : '';
  return `<li class="card">
<div class="card__media">${picture(service.image, service.alt, { priority })}</div>
<div class="card__body">
<h3>${esc(service.name)}</h3>
<p>${esc(service.card)}</p>
${safety}
<div class="card__links">
<a href="${BASE}services/${service.slug}/">Learn more<span class="visually-hidden"> about ${esc(service.name)}</span></a>
<a href="${quoteHref(service.slug)}">Request a quote<span class="visually-hidden"> for ${esc(service.name)}</span></a>
</div>
</div>
</li>`;
}

function quoteForm() {
  const options = services
    .map((service) => `<option value="${esc(service.name)}" data-slug="${service.slug}">${esc(service.name)}</option>`)
    .join('\n');
  return `<form class="quote-form" id="quote" action="https://formsubmit.co/${site.email}" method="POST">
<input type="hidden" name="_subject" value="Quote request — Gas Designs website">
<input type="hidden" name="_next" value="${THANK_YOU_ABSOLUTE}">
<input type="hidden" name="_captcha" value="false">
<input type="hidden" name="_template" value="table">
<div class="honey" aria-hidden="true"><label for="_honey">Leave this field empty</label><input type="text" id="_honey" name="_honey" tabindex="-1" autocomplete="off"></div>
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
<div class="field field--full"><label for="message">What do you need done?</label><textarea id="message" name="message" rows="6" required></textarea></div>
<div class="field field--consent"><input type="checkbox" id="consent" name="consent" value="yes" required><label for="consent">I agree that Gas Designs may use these details to answer my enquiry and prepare a quote.</label></div>
<div class="form-actions"><button class="btn btn--primary btn--block" type="submit">Send quote request</button></div>
</div>
</form>`;
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
      areaServed: 'South Africa',
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
<h1>${esc(home.h1)}</h1>
<p>${esc(home.heroLead)}</p>
<div class="hero__actions">
<a class="btn btn--primary" href="${BASE}#quote">Request a quote</a>
<a class="btn btn--secondary" href="${BASE}#services">See services</a>
</div>
</div>
</section>

<section class="section section--white" id="services">
<div class="wrap">
<div class="section__intro">
<h2>${esc(home.servicesHeading)}</h2>
<p>${esc(home.servicesLead)}</p>
</div>
<ul class="card-grid">
${services.map((service) => serviceCard(service)).join('\n')}
</ul>
</div>
</section>

<section class="section section--grey" id="how-it-works">
<div class="wrap">
<div class="section__intro"><h2>${esc(home.stepsHeading)}</h2></div>
<ol class="steps">
${home.steps.map((step) => `<li><h3>${esc(step.name)}</h3><p>${esc(step.text)}</p></li>`).join('\n')}
</ol>
</div>
</section>

<section class="section section--white" id="compliance">
<div class="wrap split">
<div class="split__text">
<h2>${esc(home.complianceHeading)}</h2>
${home.complianceBody.map((paragraph) => `<p>${esc(paragraph)}</p>`).join('\n')}
</div>
<div class="split__media">${picture('compliance', home.complianceImageAlt)}</div>
</div>
</section>

<section class="section section--grey" id="about">
<div class="wrap split">
<div class="split__media">${picture('about', home.aboutImageAlt)}</div>
<div class="split__text">
<h2>${esc(home.aboutHeading)}</h2>
${home.aboutBody.map((paragraph) => `<p>${esc(paragraph)}</p>`).join('\n')}
</div>
</div>
</section>

<section class="section section--white" id="faq">
<div class="wrap">
<div class="section__intro"><h2>${esc(home.faqHeading)}</h2></div>
<div class="faq">
${home.faqs.map((faq) => `<div class="faq__item"><h3>${esc(faq.q)}</h3><p>${esc(faq.a)}</p></div>`).join('\n')}
</div>
</div>
</section>

<section class="section section--grey" id="contact">
<div class="wrap">
<div class="section__intro">
<h2>${esc(home.contactHeading)}</h2>
<p>${esc(home.contactLead)}</p>
</div>
<div class="contact-grid">
<div>${quoteForm()}</div>
<aside class="contact-aside">
<div class="contact-aside__media">${picture('contact', home.contactImageAlt)}</div>
<h3>Reach us directly</h3>
<p>If you would rather not use the form, call, send a WhatsApp message, or write to us.</p>
<ul class="contact-methods">
<li><a href="tel:${site.phone.tel}">${PHONE_ICON}${site.phone.display}</a></li>
<li><a href="${site.phone.whatsapp}" rel="noopener">${CHAT_ICON}WhatsApp ${site.phone.display}</a></li>
<li><a href="mailto:${site.email}">${site.email}</a></li>
</ul>
<h3>${esc(safetyAdvice.heading)}</h3>
<p>${esc(safetyAdvice.short)}</p>
</aside>
</div>
</div>
</section>

</main>
${footer(0)}`;
}

/* ---------------- Service pages ---------------- */

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
      areaServed: 'South Africa',
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
    ? `<section class="section section--white">
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
<h1>${esc(service.name)}</h1>
<p>${esc(service.intro)}</p>
</div>
</section>
<div class="page-hero__media">${picture(service.image, service.alt, { priority: true })}</div>

<section class="section section--white">
<div class="wrap split split--top">
<div class="split__text">
<h2>What is included</h2>
<ul class="ticks">
${service.included.map((item) => `<li>${TICK}${esc(item)}</li>`).join('\n')}
</ul>
</div>
<div class="split__text">
<h2>Who it is for</h2>
<p>${esc(service.forWho)}</p>
<p><a class="btn btn--dark" href="${quoteHref(service.slug)}">Request a quote for this service</a></p>
</div>
</div>
</section>

${safetyBlock}

<section class="section section--grey">
<div class="wrap">
<div class="section__intro"><h2>Related services</h2></div>
<ul class="related-grid">
${related.map((item) => serviceCard(item)).join('\n')}
</ul>
</div>
</section>

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
<li>${TICK}<a href="${BASE}#quote">Request a quote</a></li>
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
