# QA report

Checked against `http://localhost:4173/gas_gas/` on 2026-09-22T13:00:24.222Z.

## Horizontal overflow

| Page | 360 | 768 | 1024 | 1440 |
| --- | --- | --- | --- | --- |
| home | none | none | none | none |
| services-residential-gas-installations | none | none | none | none |
| services-commercial-kitchen-gas-systems | none | none | none | none |
| services-industrial-gas-installations-maintenance | none | none | none | none |
| services-bulk-lpg-installations | none | none | none | none |
| services-custom-projects-developments | none | none | none | none |
| services-certificate-of-conformity | none | none | none | none |
| services-gas-system-maintenance | none | none | none | none |
| services-gas-leak-detection-emergency-repairs | none | none | none | none |
| services-basic-electrical-gas-system-support | none | none | none | none |
| thank-you | none | none | none | none |
| privacy | none | none | none | none |
| 404 | none | none | none | none |

## Contrast

Every distinct text colour and background pair found in the rendered pages, with the computed ratio.

| Foreground | Background | Size | Weight | Ratio | Required | Result | Example |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `#4a525a` | `#f4f5f6` | 16px | 400 | 7.27:1 | 4.5:1 | PASS | We install gas hobs, ovens, water  |
| `#4a525a` | `#ffffff` | 18px | 400 | 7.94:1 | 4.5:1 | PASS | Each service below covers the work |
| `#16181b` | `#25d366` | 17px | 700 | 8.97:1 | 4.5:1 | PASS | WhatsApp |
| `#16181b` | `#f5b400` | 17px | 700 | 9.67:1 | 4.5:1 | PASS | Skip to content |
| `#c9cdd2` | `#16181b` | 19px | 400 | 11.14:1 | 4.5:1 | PASS | Gas Designs installs, services and |
| `#1e2227` | `#f4f5f6` | 17px | 400 | 14.65:1 | 4.5:1 | PASS | Residential Gas Installations We i |
| `#1e2227` | `#f4f5f6` | 20px | 700 | 14.65:1 | 3:1 | PASS | Residential Gas Installations |
| `#1e2227` | `#ffffff` | 32px | 700 | 15.99:1 | 3:1 | PASS | Gas services we install, maintain  |
| `#1e2227` | `#ffffff` | 17px | 400 | 15.99:1 | 4.5:1 | PASS | Please choose Residential Commerci |
| `#ffffff` | `#16181b` | 17px | 400 | 17.79:1 | 4.5:1 | PASS | Services |
| `#ffffff` | `#16181b` | 44px | 700 | 17.79:1 | 3:1 | PASS | Gas installation, maintenance and  |

The hero heading sits on a photograph behind a charcoal overlay that runs from 85% to 70% opacity. At its most transparent point the effective background is `#5c5e60`, which gives white text a ratio of 6.6:1. That passes AA at every point of the gradient.

## Page checks

| Page | Status | Console errors | Broken images | Quote button hidden at 360 | Menu button at 360 |
| --- | --- | --- | --- | --- | --- |
| home | 200 | 1 | 0 | yes | yes |
| services-residential-gas-installations | 200 | 1 | 0 | yes | yes |
| services-commercial-kitchen-gas-systems | 200 | 1 | 0 | yes | yes |
| services-industrial-gas-installations-maintenance | 200 | 1 | 0 | yes | yes |
| services-bulk-lpg-installations | 200 | 1 | 0 | yes | yes |
| services-custom-projects-developments | 200 | 1 | 0 | yes | yes |
| services-certificate-of-conformity | 200 | 1 | 0 | yes | yes |
| services-gas-system-maintenance | 200 | 1 | 0 | yes | yes |
| services-gas-leak-detection-emergency-repairs | 200 | 1 | 0 | yes | yes |
| services-basic-electrical-gas-system-support | 200 | 1 | 0 | yes | yes |
| thank-you | 200 | 1 | 0 | yes | yes |
| privacy | 200 | 1 | 0 | yes | yes |
| 404 | 200 | 1 | 0 | yes | yes |

## Links and assets

73 unique URLs found in the built pages. 0 returned 400 or above.

A request for a path that does not exist returned HTTP 404.

## Lighthouse, mobile profile

| Page | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| home | 96 | 100 | 100 | 100 |
| services-bulk-lpg-installations | 96 | 100 | 100 | 100 |
| privacy | 100 | 100 | 100 | 100 |

Run against `http://localhost:4173/gas_gas/` on 2026-09-22T09:36:41.005Z.

