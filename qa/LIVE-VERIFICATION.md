# Live verification

Checked: 2026-09-22 10:08 (SAST)
Commit deployed: f7c8c0e7d5f14f3675dcfc1cc239997620d02e0a
Workflow run: https://github.com/logiagenesis/gas_gas/actions/runs/35702657044 (build and deploy both succeeded)

| Check | Result |
| --- | --- |
| `https://logiagenesis.github.io/gas_gas/` | HTTP 200 |
| H1 present | "Gas installation, maintenance and certification in South Africa" |
| Stylesheet, fonts, hero and card images | Render correctly in a live screenshot at 1280x900 |
| Logo wordmark | Renders in the header |
| Service page (gas-leak-detection-emergency-repairs) | HTTP 200, correct title and meta description, safety steps present |
| Nine service links on the home page | All present, all under the `/gas_gas/` base |
| Path that does not exist | HTTP 404, serving the custom 404 page |
| Favicon | Served from `/gas_gas/assets/icons/icon-32.png` |

## How this was checked

Direct outbound access to `logiagenesis.github.io` is denied by the egress policy on
the machine this build ran on, so the live pages were fetched through the Firecrawl
connector rather than with a local HTTP client. The workflow run status came from the
GitHub API.

## Lighthouse

Lighthouse was run against the production build served over HTTP on the build machine,
not against the live URL, for the same reason. It measures the same artefact that was
deployed. Scores are in QA-REPORT.md.
