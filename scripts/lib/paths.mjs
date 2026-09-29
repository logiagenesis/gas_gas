import { site } from '../../src/data/site.js';

// One codebase, two build targets, chosen by DEPLOY_TARGET (default cpanel).
//
// cpanel: the live site at the root of https://www.gasdesigns.co.za.
// pages:  the preview at https://logiagenesis.github.io/gas_gas/, deployed
//         by .github/workflows/deploy-pages.yml on every push to main. Every
//         page carries noindex, nofollow so it never competes with the live
//         domain, and no .htaccess ships.
//
// Canonical links, the sitemap, robots.txt and the schema always name the
// live domain. The serving origin (og:url, og:image and the quote form's
// thank-you redirect) follows the target, so link previews and the form work
// wherever the build is served.
const TARGETS = {
  cpanel: { base: '/', origin: site.canonicalOrigin },
  pages: { base: '/gas_gas/', origin: 'https://logiagenesis.github.io' },
};

export function resolveDeployment() {
  const target = process.env.DEPLOY_TARGET || 'cpanel';
  if (!TARGETS[target]) {
    throw new Error(`DEPLOY_TARGET must be "pages" or "cpanel", not "${target}".`);
  }
  return { target, ...TARGETS[target] };
}
