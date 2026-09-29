// Runs the full build for one deployment target: node scripts/build-target.mjs
// pages|cpanel. Setting DEPLOY_TARGET here, rather than in the npm script,
// keeps the command working in Windows shells as well as on the CI runner.

import { spawnSync } from 'node:child_process';

const target = process.argv[2];
if (!['pages', 'cpanel'].includes(target)) {
  console.error('Usage: node scripts/build-target.mjs pages|cpanel');
  process.exit(1);
}

const result = spawnSync('npm', ['run', 'build'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, DEPLOY_TARGET: target },
});
process.exit(result.status ?? 1);
