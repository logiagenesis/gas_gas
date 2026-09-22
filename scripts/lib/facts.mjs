// Reads CLIENT-FACTS.md from the repo root. Values are "Label: value" lines.
// A missing file or an empty value is reported, never guessed at.

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const FILE = path.resolve('CLIENT-FACTS.md');

export function readFacts() {
  if (!existsSync(FILE)) return { present: false, values: {} };
  const values = {};
  for (const line of readFileSync(FILE, 'utf8').split('\n')) {
    if (line.startsWith('#') || !line.includes(':')) continue;
    const index = line.indexOf(':');
    const key = line.slice(0, index).trim().toLowerCase();
    const value = line.slice(index + 1).trim();
    if (key && value) values[key] = value;
  }
  return { present: true, values };
}

export function fact(name) {
  const { values } = readFacts();
  return values[name.toLowerCase()] || '';
}
