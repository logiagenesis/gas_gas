import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

// Vite base comes from the git remote so the site works at
// https://<owner>.github.io/<repo>/. A public/CNAME file means a custom
// domain, which is served from the root instead.
export function resolveDeployment() {
  let owner = '';
  let repo = '';
  try {
    const remote = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
    const match = remote.match(/[:/]([^/:]+)\/([^/]+?)(?:\.git)?$/);
    if (match) {
      owner = match[1];
      repo = match[2];
    }
  } catch {
    // No remote configured. Fall back to a root base.
  }

  const cnamePath = path.resolve('public/CNAME');
  const cname = existsSync(cnamePath) ? readFileSync(cnamePath, 'utf8').trim() : '';

  if (cname) {
    return { base: '/', origin: `https://${cname}`, owner, repo, cname };
  }
  return {
    base: repo ? `/${repo}/` : '/',
    origin: owner ? `https://${owner}.github.io` : '',
    owner,
    repo,
    cname: '',
  };
}
