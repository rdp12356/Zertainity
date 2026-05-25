#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

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

function parseArgs(argv) {
  const args = {
    missing: path.resolve('scripts/missing-revert.json'),
    apply: true,
    output: path.resolve('scripts/missing-revert-unresolved.json'),
  };

  for (let i = 2; i < argv.length; i++) {
    const value = argv[i];
    if (value === '--missing' || value === '-m') args.missing = path.resolve(argv[++i]);
    else if (value === '--output' || value === '-o') args.output = path.resolve(argv[++i]);
    else if (value === '--dry-run' || value === '-d') args.apply = false;
    else if (value === '--apply' || value === '-a') args.apply = true;
  }

  return args;
}

function transfer(dest, src, apply) {
  if (!apply) {
    console.log(`[DRY RUN] Would move "${dest}" -> "${src}"`);
    return true;
  }

  try {
    ensureDir(path.dirname(src));
    try {
      fs.renameSync(dest, src);
    } catch (error) {
      fs.copyFileSync(dest, src);
      fs.unlinkSync(dest);
    }
    console.log(`✔ Moved "${dest}" -> "${src}"`);
    return true;
  } catch (error) {
    console.error(`! Failed to move "${dest}" -> "${src}": ${error.message}`);
    return false;
  }
}

function main() {
  const args = parseArgs(process.argv);

  if (!fs.existsSync(args.missing)) {
    console.error('Missing input file:', args.missing);
    process.exit(2);
  }

  const entries = JSON.parse(fs.readFileSync(args.missing, 'utf8'));
  const unresolved = [];
  let restored = 0;
  let alreadyAtSrc = 0;
  let missingDest = 0;
  let failed = 0;

  for (const entry of entries) {
    const src = entry.src;
    const dest = entry.dest;

    if (fs.existsSync(dest)) {
      const finalSrc = ensureUniquePath(src);
      if (transfer(dest, finalSrc, args.apply)) {
        restored++;
      } else {
        failed++;
        unresolved.push(entry);
      }
      continue;
    }

    if (fs.existsSync(src)) {
      alreadyAtSrc++;
      continue;
    }

    missingDest++;
    unresolved.push(entry);
  }

  fs.writeFileSync(args.output, JSON.stringify(unresolved, null, 2));
  console.log(`\nDone. restored=${restored}, already_at_src=${alreadyAtSrc}, missing_dest=${missingDest}, failed=${failed}`);
  console.log(`Wrote unresolved entries to ${args.output}`);
}

main();