import { site } from '../../src/data/site.js';

// The site is served from the root of www.gasdesigns.co.za on cPanel, so the
// Vite base is "/" and every absolute URL (canonical, og:url, og:image, the
// schema, the sitemap and the form's thank-you redirect) uses the www origin,
// which is also the GA4 stream URL.
export function resolveDeployment() {
  return { base: '/', origin: site.canonicalOrigin };
}
