import { defineConfig } from 'vite';
import { globSync } from 'node:fs';
import path from 'node:path';
import { resolveDeployment } from './scripts/lib/paths.mjs';

const root = path.resolve('build/site');
const deploy = resolveDeployment();

const input = Object.fromEntries(
  globSync('**/*.html', { cwd: root }).map((file) => [
    file.replace(/\.html$/, '').replace(/\//g, '-'),
    path.join(root, file),
  ]),
);

export default defineConfig({
  root,
  base: deploy.base,
  publicDir: path.resolve('build/static'),
  appType: 'mpa',
  build: {
    outDir: path.resolve('dist'),
    emptyOutDir: true,
    assetsDir: 'assets/build',
    cssMinify: true,
    rollupOptions: { input },
  },
});
