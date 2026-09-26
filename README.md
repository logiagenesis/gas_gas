# Gas Designs website

Static site for Gas Designs, built with Vite and deployed to GitHub Pages by
GitHub Actions on every push to `main`.

`main` is the only branch and the default branch. The `github-pages`
environment (Settings › Environments) only accepts deploys from the branches
its deployment rule names, and that rule is `main`. Changing the default branch
does not change the rule: if the site ever deploys from another branch, both
settings need updating.

Node 22 or newer is required: the build and the QA checks use `globSync` from
`node:fs`, which Node 20 does not provide. The pinned version is in
`.node-version` and the workflow reads that file.

## Running it locally

```
npm install
npm run build
npm run preview
```

`npm run build` runs three steps before Vite: it processes the photographs, builds
the logo and icons, then generates every HTML page. Nothing under `build/` or
`dist/` is committed.

## Where things live

| Path | What it holds |
| --- | --- |
| `public/assets/img/` | The original photographs. Source files only; these never reach `dist/`. |
| `public/assets/brand/` | The client logo, used unchanged as the source for every brand asset. |
| `src/data/site.js` | Business facts, the nine services and all service copy. |
| `src/data/pages.js` | Home, thank-you, privacy and 404 copy. |
| `src/css/site.css` | The whole stylesheet. |
| `src/js/site.js` | Mobile menu, WhatsApp button guard, reveal on scroll, GA4 events, the quote form and its `?service=` pre-fill. |
| `scripts/` | Build steps and the QA checks. |
| `IMAGE-MAP.md` | Which photograph fills which slot, and why. |
| `qa/QA-REPORT.md` | The last recorded QA run. |
| `qa/AUDIT.md` | The September 2026 audit: copy, images, buttons, look and feel, and what is still waiting on the client. |

## Changing the copy

All wording lives in `src/data/`. Edit the data file and rebuild; the pages are
generated, so nothing needs editing in two places.

The area named in the copy, the meta titles and the schema is `region` in
`src/data/site.js`. In the home H1, words in square brackets are shown in the
accent colour.

## The logo

`public/assets/brand/gas-designs.png` is the supplied artwork and is never edited.
At build time it is knocked out of its white background, trimmed, and split into
the flame mark and the wordmark, so the stacked logo can be laid out horizontally
in the header and the footer. The mark keeps its own colour; the wordmark is
rendered white on the charcoal bar by a CSS filter. The knock-out also separates
the anti-aliased edge pixels from white, so no pale halo shows on dark surfaces.

Favicons come from the mark: the 16px and 32px browser-tab icons are the flame on
transparency, and the 180px and 512px home-screen icons sit on white, because iOS
fills a transparent apple-touch-icon with black. The Open Graph card (the image
WhatsApp and other apps show beside a shared link) is built for WhatsApp's
small square thumbnail on a dark bubble: the flame in its own colours and the
wordmark in white, stacked on the site's charcoal with a low amber glow, all
inside the centre 630 x 630 square that chat apps crop to. The home page also
gives link previews a shorter title, because WhatsApp cuts titles off after
about 55 characters.

Every absolute URL (canonical, `og:url`, `og:image`, schema, sitemap) is built
from where the site is served: `https://logiagenesis.github.io/gas_gas/` today.
When the site moves to gasdesigns.co.za, put the domain in `public/CNAME` and
rebuild; every URL follows. The static QA fails if `og:image` points anywhere
else, because WhatsApp and other apps then show a link with no image.

## Photographs

Each photograph is built at 640px and at its full slot width (the hero also at
1,280px), as WebP with a JPG fallback, and the pages choose with `srcset`.

Replacing the logo means dropping a new file into that folder and rebuilding.

## The enquiry form

The quote form posts to Formspree at `https://formspree.io/f/mbglopba`.

| | |
| --- | --- |
| Form ID | `mbglopba`, read from `CLIENT-FACTS.md` at build time |
| Account owner | pierre@gasdesigns.co.za |
| Plan limit | 50 submissions a month across the whole account |
| Usage | formspree.io/account |
| Stored copies | submissions stay in the Formspree dashboard for 30 days |

The form is posted with `fetch` so the visitor lands on this site's own
thank-you page. The free plan ignores a redirect field on a native POST, so
without JavaScript the browser posts normally and lands on Formspree's own
thank-you page instead. That is accepted rather than worked around.

A build fails if `CLIENT-FACTS.md` is missing the form ID, rather than shipping
a form that posts nowhere.

## Analytics

GA4 loads through gtag.js with the ID `ga4Id` in `src/data/site.js`. Calls,
WhatsApp taps and quote-form submissions are sent as events.

## QA

```
npm run preview                                   # in one terminal
npm run qa:static
npm run qa:browser -- http://localhost:4173/gas_gas/
npm run qa:lighthouse -- http://localhost:4173/gas_gas/ --all
npm run qa:report
```
