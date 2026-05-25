#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const p = path.resolve('scripts/move-log-revert-full.json');
if (!fs.existsSync(p)) {
  console.error('mapping not found', p);
  process.exit(2);
}
const data = JSON.parse(fs.readFileSync(p, 'utf8'));
const missing = [];
for (const item of data) {
  const dest = item.dest || item.to || item[1] || item[0] || item.path || item.toString && item.toString();
  if (!dest) continue;
  try {
    if (!fs.existsSync(dest)) missing.push(item);
  } catch (e) {
    missing.push(item);
  }
}
console.log('total_records', data.length);
console.log('missing_count', missing.length);
const sample = missing.slice(0, 100);
fs.writeFileSync('scripts/missing-revert.json', JSON.stringify(missing, null, 2));
console.log('wrote scripts/missing-revert.json');
if (sample.length) console.log('first_sample', JSON.stringify(sample.slice(0, 10), null, 2));
process.exit(0);
