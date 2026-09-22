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
| `public/assets/brand/` | The client logo. Empty means the build draws a stand-in wordmark. |
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

## Adding the real logo

Drop an SVG or PNG into `public/assets/brand/` and rebuild. The build uses it
unchanged and regenerates the favicons from it, and the stand-in wordmark is no
longer produced.

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
