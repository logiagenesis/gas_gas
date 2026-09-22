# Gas Designs website

Static site for Gas Designs, built with Vite and deployed to GitHub Pages by
GitHub Actions on every push to `main`.

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
| `src/js/site.js` | Mobile menu and the `?service=` pre-fill on the quote form. |
| `scripts/` | Build steps and the QA checks. |
| `IMAGE-MAP.md` | Which photograph fills which slot, and why. |
| `qa/QA-REPORT.md` | The last recorded QA run. |

## Changing the copy

All wording lives in `src/data/`. Edit the data file and rebuild; the pages are
generated, so nothing needs editing in two places.

## The logo

`public/assets/brand/gas-designs.png` is the supplied artwork and is never edited.
At build time it is knocked out of its white background, trimmed, and split into
the flame mark and the wordmark, so the stacked logo can be laid out horizontally
in the header and the footer. The mark keeps its own colour; the wordmark is
rendered white on the charcoal bar by a CSS filter. Favicons come from the mark,
and the Open Graph card is the same horizontal lockup on charcoal.

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

## Before launch

Replace `GTM-XXXXXXX` in `src/data/site.js` with the real Google Tag Manager
container ID. Until a real ID is in place the loader does not run, so no failing
request is made.

## QA

```
npm run preview                                   # in one terminal
npm run qa:static
npm run qa:browser -- http://localhost:4173/gas_gas/
npm run qa:lighthouse -- http://localhost:4173/gas_gas/ --all
npm run qa:report
```
