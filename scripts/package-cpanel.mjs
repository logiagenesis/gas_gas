// Zips the contents of dist/ (not the folder itself) for upload to cPanel's
// public_html, hidden .htaccess included. Writes
// release/gasdesigns-cpanel-YYYYMMDD.zip, dated in South African time.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, statSync } from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
if (!existsSync(path.join(DIST, 'index.html')) || !existsSync(path.join(DIST, '.htaccess'))) {
  // A GitHub Pages preview build has no .htaccess and must never be shipped.
  console.error('dist/ is missing index.html or .htaccess. Run npm run build:cpanel first.');
  process.exit(1);
}

const stamp = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Johannesburg' })
  .format(new Date())
  .replace(/-/g, '');
const outDir = path.resolve('release');
const out = path.join(outDir, `gasdesigns-cpanel-${stamp}.zip`);

mkdirSync(outDir, { recursive: true });
rmSync(out, { force: true });
// -r recurse, -X leave out extra file attributes; "." takes dotfiles too.
execFileSync('zip', ['-r', '-X', '-q', out, '.'], { cwd: DIST });

console.log(`${path.relative(process.cwd(), out)} (${Math.round(statSync(out).size / 1024)} KB)`);
