# QA report

Checked against `http://localhost:4173/gas_gas/` on 2026-09-26T08:08:04.358Z.

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
| `#a64b00` | `#ffffff` | 13px | 700 | 5.79:1 | 4.5:1 | PASS | The scope |
| `#4a525a` | `#f6f4ef` | 19px | 700 | 7.22:1 | 3:1 | PASS | What we do |
| `#4a525a` | `#f6f4ef` | 19px | 400 | 7.22:1 | 4.5:1 | PASS | Homes, commercial kitchens, factor |
| `#4a525a` | `#ffffff` | 16px | 400 | 7.94:1 | 4.5:1 | PASS | Gas hobs, ovens, geysers and firep |
| `#4a525a` | `#ffffff` | 19px | 700 | 7.94:1 | 3:1 | PASS | Questions |
| `#16181b` | `#25d366` | 16px | 700 | 8.97:1 | 4.5:1 | PASS | WhatsApp |
| `#16181b` | `#f5b400` | 17px | 700 | 9.67:1 | 4.5:1 | PASS | Skip to content |
| `#f5b400` | `#16181b` | 13px | 700 | 9.67:1 | 4.5:1 | PASS | Gas installers · Pretoria · Johann |
| `#f5b400` | `#16181b` | 62px | 800 | 9.67:1 | 3:1 | PASS | Tested before you light it. |
| `#16181b` | `#f5b400` | 42px | 800 | 9.67:1 | 3:1 | PASS | Smell gas? Do this first. |
| `#c9cdd2` | `#16181b` | 16px | 700 | 11.14:1 | 4.5:1 | PASS | Services |
| `#c9cdd2` | `#16181b` | 19px | 700 | 11.14:1 | 3:1 | PASS | How it works |
| `#1e2227` | `#f6f4ef` | 42px | 800 | 14.55:1 | 3:1 | PASS | Every gas job, from one hob to a b |
| `#1e2227` | `#f6f4ef` | 17px | 700 | 14.55:1 | 4.5:1 | PASS | 10+ years in gas and electrical |
| `#ffffff` | `#1f2327` | 17px | 400 | 15.81:1 | 4.5:1 | PASS | Call061 039 7034 |
| `#1e2227` | `#ffffff` | 17px | 400 | 15.99:1 | 4.5:1 | PASS | 01 Residential Gas Installations G |
| `#1e2227` | `#ffffff` | 20px | 700 | 15.99:1 | 3:1 | PASS | Residential Gas Installations |
| `#ffffff` | `#16181b` | 16px | 700 | 17.79:1 | 4.5:1 | PASS | 061 039 7034 |
| `#ffffff` | `#16181b` | 62px | 800 | 17.79:1 | 3:1 | PASS | Gas, installed properly. Tested be |

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

75 unique URLs found in the built pages. 0 returned 400 or above.

A request for a path that does not exist returned HTTP 404.

## Lighthouse, mobile profile

| Page | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| home | 99 | 100 | 96 | 100 |
| services-bulk-lpg-installations | 98 | 100 | 96 | 100 |
| privacy | 100 | 100 | 96 | 100 |

Run against `http://localhost:4173/gas_gas/` on 2026-09-26T08:09:51.444Z.

