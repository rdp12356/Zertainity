#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = {
    unresolved: path.resolve('scripts/missing-revert-unresolved.json'),
    output: path.resolve('scripts/missing-revert-unresolved-after-basename.json'),
    roots: ['C:\\Users\\johan\\Downloads', 'D:\\'],
    apply: true,
  };

  for (let i = 2; i < argv.length; i++) {
    const value = argv[i];
    if (value === '--unresolved' || value === '-u') args.unresolved = path.resolve(argv[++i]);
    else if (value === '--output' || value === '-o') args.output = path.resolve(argv[++i]);
    else if (value === '--roots') args.roots = argv[++i].split(';').filter(Boolean);
    else if (value === '--root' || value === '-r') args.roots.push(argv[++i]);
    else if (value === '--dry-run' || value === '-d') args.apply = false;
    else if (value === '--apply' || value === '-a') args.apply = true;
  }

  return args;
}

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function ensureUniquePath(p) {
  if (!fs.existsSync(p)) return p;
  const dir = path.dirname(p);
  const ext = path.extname(p);
  const base = path.basename(p, ext);
  for (let i = 1; i < 10000; i++) {
    const candidate = path.join(dir, `${base} (${i})${ext}`);
    if (!fs.existsSync(candidate)) return candidate;
  }
  return p;
}

function walkFiles(root, visitor) {
  const stack = [root];
  while (stack.length) {
    const current = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(fullPath);
      else if (entry.isFile()) visitor(fullPath);
    }
  }
}

function transfer(from, to, apply) {
  if (!apply) {
    console.log(`[DRY RUN] Would move "${from}" -> "${to}"`);
    return true;
  }

  try {
    ensureDir(path.dirname(to));
    try {
      fs.renameSync(from, to);
    } catch {
      fs.copyFileSync(from, to);
      fs.unlinkSync(from);
    }
    console.log(`✔ Moved "${from}" -> "${to}"`);
    return true;
  } catch (error) {
    console.error(`! Failed to move "${from}" -> "${to}": ${error.message}`);
    return false;
  }
}

function main() {
  const args = parseArgs(process.argv);

  if (!fs.existsSync(args.unresolved)) {
    console.error('Missing unresolved input file:', args.unresolved);
    process.exit(2);
  }

  const unresolved = JSON.parse(fs.readFileSync(args.unresolved, 'utf8'));
  const byName = new Map();
  const scannedRoots = [];

  for (const root of args.roots) {
    const resolvedRoot = path.resolve(root);
    if (!fs.existsSync(resolvedRoot)) continue;
    scannedRoots.push(resolvedRoot);
    walkFiles(resolvedRoot, filePath => {
      const name = path.basename(filePath).toLowerCase();
      const list = byName.get(name);
      if (list) list.push(filePath);
      else byName.set(name, [filePath]);
    });
  }

  const remaining = [];
  let recovered = 0;
  let ambiguous = 0;
  let stillMissing = 0;

  for (const entry of unresolved) {
    const src = entry.src;
    const dest = entry.dest;
    const name = path.basename(dest).toLowerCase();

    if (fs.existsSync(src)) {
      continue;
    }

    const matches = byName.get(name) || [];
    const uniqueMatches = matches.filter(candidate => path.resolve(candidate) !== path.resolve(dest));

    if (uniqueMatches.length === 1) {
      const candidate = uniqueMatches[0];
      const finalSrc = ensureUniquePath(src);
      if (transfer(candidate, finalSrc, args.apply)) {
        recovered++;
      } else {
        remaining.push(entry);
      }
      continue;
    }

    if (uniqueMatches.length > 1) {
      ambiguous++;
      remaining.push({ ...entry, candidates: uniqueMatches.slice(0, 10) });
      continue;
    }

    stillMissing++;
    remaining.push(entry);
  }

  fs.writeFileSync(args.output, JSON.stringify(remaining, null, 2));
  console.log(`\nScanned roots: ${scannedRoots.join(', ') || '(none)'}`);
  console.log(`Done. recovered=${recovered}, ambiguous=${ambiguous}, still_missing=${stillMissing}`);
  console.log(`Wrote remaining entries to ${args.output}`);
}

main();