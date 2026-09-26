# Site audit and fixes — 26/09/2026

The brief is the "Audit and Fix" document and the four annotated screenshots in the
Gas Designs › Fixes folder on Google Drive. Every item below is marked **Fixed**
(in this change), **Client** (needs a fact or a decision from Gas Designs) or
**Owner** (a GitHub setting only the repository owner can change).

Checks after the fixes, on a local build:

- Static checks: 19 of 19 pass.
- Browser QA across 13 pages at 360, 768, 1,024 and 1,440px: no horizontal overflow and no console errors. All 75 internal links resolve, and all 19 text-and-background colour pairs pass WCAG AA.
- Lighthouse, home page: Performance 99, Accessibility 100, Best Practices 96, SEO 100.

The full results are in `qa/QA-REPORT.md`.

---

## 0. Repository and deployment: why there were two branches

| # | Finding | Status |
| --- | --- | --- |
| 0.1 | GitHub's **default branch** was `claude/google-drive-folder-8dem5g`, not `main`. Both branches pointed at the same commit, but the stray branch was the one GitHub showed first. | Fixed by the owner on 26/09: the default is now `main`, the stray branch is deleted, and the pull request between the two is closed. |
| 0.2 | Every push to `main` since 22/09 **failed to deploy**. The `deploy` job stopped within a second, without a runner. The cause was the `github-pages` environment's deployment rule, which allowed only the stray branch. The live site only updated when the workflow was run by hand from that branch. Changing the default branch alone did not fix it. | Fixed by the owner on 26/09: the environment rule now allows `main`, so every push to `main` deploys. |
| 0.3 | Rule for the future: one branch, `main`. No working branches are left on GitHub. | Fixed (the stray branch is deleted after 0.1). |

---

## 1. Copywriting list

The benchmark covered 18 Gauteng gas installer websites, checked on 26/09/2026. They included GasGuru, The Gas Lady, The LpGas Man, Top Spec, Your Own Energy, National Gas Installers, ARB, Action Gas, Minzo and Fueltec.

**What the market says too often, and this site now avoids:**

- "Your safety is our priority"
- "peace of mind"
- "no job too big or too small"
- "right the first time"
- "one-stop shop"
- "trusted"
- "fully compliant"

**What nobody does well, and this site now owns:**

- A "smell gas? do this now" section.
- How a commercial-kitchen job actually runs.
- When to move from cylinders to bulk LPG.
- Developer work priced from drawings.
- CoCs written for estate agents and conveyancers.
- Gas and electrical from one team.

| # | Where | Before | After | Status |
| --- | --- | --- | --- | --- |
| 1.1 | Home H1 | "Gas installation, maintenance and certification in South Africa" | "Gas, installed properly. **Tested before you light it.**" The keywords move to the eyebrow, the meta title and the lead. | Fixed |
| 1.2 | Hero lead | Restated the H1 | Shows the range ("from a single gas hob to a bulk LPG tank"), then the method, then the certificate | Fixed |
| 1.3 | Proof strip | None | Four proof points, all established facts: pressure and leak tested; CoC issued; itemised written quotes; gas and electrical | Fixed |
| 1.4 | Service cards | Described the task ("We install…") | Open with the customer's situation ("Selling, letting or insuring?", "When cylinders can't keep up") and are trimmed to similar lengths | Fixed |
| 1.5 | Service pages | Intros described the process | Intros open with the reason to act, then the method. Examples: "A kitchen that goes down mid-service loses money by the minute." "Gas is easiest to get right before the walls close." | Fixed |
| 1.6 | Local vocabulary | "water heater" throughout | "geyser" used alongside it; "CoC" used after the first full mention | Fixed |
| 1.7 | How it works | Flat task list | Outcome-led steps, each with a "you get" tag. Heading: "From first message to signed-off certificate" | Fixed |
| 1.8 | Compliance | Generic "SANS standards" | Names SANS 10087 and the Pressure Equipment Regulations under the OHS Act, and says why they matter (insurer, bank, conveyancer) | Fixed |
| 1.9 | FAQ | 6 questions | 7 questions. Adds "When should I move from cylinders to a bulk LPG tank?" and names CoCs in the first answer | Fixed |
| 1.10 | Calls to action | "Request a quote" / "Learn more" / "See services" | One vocabulary: "Get a written quote", "View service", "Explore services", "WhatsApp us" | Fixed |
| 1.11 | Meta titles | "Residential Gas Installations" | Each names Gauteng and the search term, e.g. "Gas Certificate of Conformity (CoC) in Gauteng" | Fixed |
| 1.12 | Region | Copy said "South Africa" | Pretoria, Johannesburg and the rest of Gauteng, including outlying areas. Confirmed by the client on 26/09. | Fixed |
| 1.13 | Copyright | Footer year is set at build time; the Inter font is OFL-licensed; the logo was supplied by the client | No issue. The photographs are the client's supplied set, and the client should confirm they own the rights to use them. | **Client**: confirm image rights |

### Client facts

Supplied on 26/09 and now used across the site:

| Fact | Where it appears |
| --- | --- |
| Pretoria, Johannesburg and the rest of Gauteng, including outlying areas | Hero eyebrow, About, FAQ, footer, meta titles and descriptions, `areaServed` in the schema |
| 15 years' experience in gas and electrical, confirmed by the client. | Hero proof strip, About, meta description |
| Open 24 hours a day for emergencies; the client confirms 061 039 7034 is answered 24/7 | Emergency bar above the header on every page, hero proof strip, safety band, FAQ, and the leak-repair card, page and meta title |
| A registered company | About |

The company itself is about a year old. The site states the team's experience rather than the company's age.

Still waiting on the client:

| Fact | Why it matters |
| --- | --- |
| SAQCC Gas registration number and category | No competitor home page shows one. Showing it, with a way to verify it, would be unique in the market. "Registered company" (CIPC) is not the same thing and is not presented as a gas registration. |
| Specific outlying areas or towns | Local search, e.g. Centurion, Midrand, Hartbeespoort, Cullinan. |
| Office hours for non-emergency work | Useful for the schema and the contact section. |
| Workmanship guarantee (period) | Only two competitors state one. |
| Customer reviews (Google rating or named testimonials) | Social proof; no reviews are on the site today. |
| Electrical registration scope | Confirms what "basic electrical" may claim. |

---

## 2. Image quality list

| # | Image | Finding | Status |
| --- | --- | --- | --- |
| 2.1 | All photographs | Only a single 1,200px size was served, so phones downloaded roughly four times the pixels they show. | Fixed: each photo now ships at 640px and at full size (hero 640, 1,280 and 1,920px), in WebP with a JPG fallback, and `srcset` picks the right one. |
| 2.2 | Service-page heroes | A 1,200px photograph was stretched full-bleed to 1,440–1,920px, which blurs it. | Fixed: the photo now sits in a framed panel no wider than its source. |
| 2.3 | `service-03.jpg` (Basic Electrical) | Shows a gas fireplace. No supplied photo shows electrical work. | **Client**: supply a photo of an isolator, ignition wiring or fan connection. |
| 2.4 | `service-08.jpg` (CoC) | The certificate on the clipboard carries unreadable placeholder text. It is fine at card size but looks fake when enlarged. | **Client**: a photo of a real, redacted CoC would be stronger. |
| 2.5 | `compliance.jpg` | The gauge brand and the tag text are not legible words. The photo is only ever shown small, and the test-tag graphic now carries the message. | Acceptable; replace with a real site photo when available. |
| 2.6 | All photographs | They read as stock or AI-generated and consistently styled. Real job photos (before and after, the team, the bakkie) would build more trust than any copy. | **Client**: send real job photos when possible. |
| 2.7 | Logo mark | The white knock-out left a faint white halo round the flame. | Fixed: the edge pixels are now separated from white properly (de-fringed). |
| 2.8 | Favicon | The flame sat on a black square. | Fixed: transparent flame for browser tabs; a white tile only for the phone home-screen icon, because iOS fills transparency with black. |
| 2.9 | Share image (Open Graph) | Flat black card; then a photo version WhatsApp cropped through the logo; then a white tile that looked harsh on WhatsApp's dark bubble, with the title cut off. | Fixed: the flame and white wordmark centred on charcoal with an amber glow, sized for the square thumbnail, and a 53-character share title that fits. |
| 2.10 | Share image address | WhatsApp showed the link with no image. `og:image`, `og:url` and the canonical link pointed at gasdesigns.co.za, which does not serve this site. | Fixed on 26/09: every absolute URL now follows the live address. A static check fails the build if `og:image` points elsewhere. |

---

## 3. Button list

| # | Finding | Status |
| --- | --- | --- |
| 3.1 | Five different CTA styles with inconsistent heights and wording. | Fixed: one button system. All buttons are 52px (44px in the header), share one radius, and lift slightly on hover. Types: primary (amber), secondary (outline on dark), dark (charcoal) and WhatsApp (green). |
| 3.2 | Card links "Learn more" and "Request a quote" looked identical and competed for attention. | Fixed: "View service →" is the main action; "Get a quote" is quieter. |
| 3.3 | Primary buttons had no direction cue. | Fixed: an arrow slides on hover, and the movement is turned off for visitors who prefer reduced motion. |
| 3.4 | Header CTA "Request a quote" did not match the hero. | Fixed: "Get a quote" in the header and "Get a written quote" in the body. |
| 3.5 | Contact links were small underlined text. | Fixed: large call, WhatsApp and email tiles, each with an icon. |
| 3.6 | No call button beside the safety advice. | Fixed: "Call 061 039 7034" in the safety band. |
| 3.7 | Service pages ended without a next step. | Fixed: a closing call-to-action band, plus a quote card beside the scope that stays in view on scroll. |
| 3.8 | Floating WhatsApp button | Checked. It still steps aside when it would cover the submit button or a footer link. |

---

## 4. Look and feel list

| # | Finding | Status |
| --- | --- | --- |
| 4.1 | **Out-of-sync service cards (screenshot 2).** The safety callout inside one card made it taller, and titles of one and two lines pushed the text out of line. | Fixed: the callout is out of the cards and has its own band. The cards share a subgrid, so titles, text and links line up across every row whatever their length. Older browsers fall back to pinning the links to the foot of each card. |
| 4.2 | **"How it works" (screenshot 4).** A flat row of five text columns. | Fixed and reinvented: a dark "pipeline". Five numbered stations sit on a line that runs from grey through flame orange to amber, with a pulse travelling along it like gas through a pipe. Each step carries a "you get" tag, and the section ends with a call to action. It turns vertical on phones. |
| 4.3 | **Favicon on black (screenshot 3).** | Fixed; see 2.8. |
| 4.4 | "Straightforward and AI-ish" feel. | Fixed: <ul><li>Stronger typography (Inter ExtraBold headlines, tight tracking, balanced line breaks)</li><li>Amber eyebrow labels, and a warm stone background instead of cold grey</li><li>A left-weighted hero wash with an amber glow</li><li>Numbered, lifting service cards with photo zoom</li><li>A hazard-striped safety band</li><li>A yellow test tag pinned to the compliance photo</li><li>Icon points in About, and an FAQ accordion</li><li>Content eases in on scroll</li></ul> |
| 4.5 | Safety advice was repeated in a card, the contact aside and the FAQ. | Fixed: one clear home, the "Smell gas? Do this first." band (linked from the footer), plus the FAQ answer and the leak-repair page. |
| 4.6 | The footer listed 5 of the 9 services. | Fixed: all nine, plus links to the FAQ and "If you smell gas". |
| 4.7 | Motion and accessibility | Every animation is switched off under `prefers-reduced-motion`. Content is never hidden if JavaScript fails. Contrast is AA throughout. |
| 4.8 | Afrikaans | No Gauteng competitor offers it, and Pretoria has a large Afrikaans-speaking market. | **Client**: worth considering as a later phase. |
