#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const glob = require('glob');

function sortObject(obj) {
  if (Array.isArray(obj)) return obj.map(sortObject);
  if (obj && typeof obj === 'object') {
    const keys = Object.keys(obj).sort((a, b) => a.localeCompare(b));
    const out = {};
    for (const k of keys) out[k] = sortObject(obj[k]);
    return out;
  }
  return obj;
}

const ignore = [
  '**/node_modules/**',
  '**/archive/**',
  '**/package-lock.json',
  '**/pnpm-lock.yaml',
  '**/yarn.lock',
  '**/skills-lock.json',
  '**/*.lock',
];

const pattern = '**/*.json';
const files = glob.sync(pattern, { ignore, nodir: true, dot: true });

const skipNames = new Set(['package-lock.json', 'skills-lock.json']);

const changed = [];

for (const file of files) {
  const base = path.basename(file);
  if (skipNames.has(base)) continue;
  try {
    const src = fs.readFileSync(file, 'utf8');
    const data = JSON.parse(src);
    const sorted = sortObject(data);
    const out = JSON.stringify(sorted, null, 2) + '\n';
    if (out !== src) {
      fs.writeFileSync(file, out, 'utf8');
      changed.push(file);
    }
  } catch (e) {
    // skip files that aren't valid JSON
  }
}

if (changed.length === 0) {
  console.log('No JSON files changed');
} else {
  console.log('Updated JSON files:');
  changed.forEach(f => console.log(' -', f));
}
