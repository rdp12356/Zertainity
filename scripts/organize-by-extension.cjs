#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = { source: null, dest: null, dryRun: false, mode: 'move', exclude: [] };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--source' || a === '-s') args.source = argv[++i];
    else if (a === '--dest' || a === '-o') args.dest = argv[++i];
    else if (a === '--dry-run' || a === '-d') args.dryRun = true;
    else if (a === '--copy' || a === '-c') args.mode = 'copy';
    else if (a === '--exclude' || a === '-e') args.exclude = (argv[++i] || '').split(',').map(x => x.trim()).filter(Boolean);
  }
  if (!args.source) {
    console.error('Missing --source');
    process.exit(2);
  }
  args.source = path.resolve(args.source);
  if (!args.dest) args.dest = args.source;
  else args.dest = path.resolve(args.dest);
  return args;
}

const COMMON_MAP = {
  '.pdf': 'PDF',
  '.jpg': 'Images', '.jpeg': 'Images', '.png': 'Images', '.gif': 'Images', '.webp': 'Images', '.bmp': 'Images',
  '.zip': 'Compressed', '.rar': 'Compressed', '.7z': 'Compressed', '.7zip': 'Compressed', '.gz': 'Compressed', '.tar': 'Compressed',
  '.exe': 'Programs', '.msi': 'Programs',
  '.iso': 'System Images',
  '.mp3': 'Audio', '.wav': 'Audio', '.flac': 'Audio',
  '.mp4': 'Video', '.mkv': 'Video', '.mov': 'Video',
  '.doc': 'Documents', '.docx': 'Documents', '.xls': 'Documents', '.xlsx': 'Documents', '.ppt': 'Documents', '.pptx': 'Documents',
};

const IGNORE_DIRS = new Set(['node_modules', '.git', 'System Volume Information', '$RECYCLE.BIN']);

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

function isFilesystemRoot(p) {
  const parsed = path.parse(p);
  return parsed.root === p || parsed.root === p + path.sep;
}

function transferFile(src, destRoot, folderName, dryRun, mode) {
  const destDir = path.join(destRoot, folderName);
  if (!isFilesystemRoot(destDir) && !fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  const destPath = ensureUniquePath(path.join(destDir, path.basename(src)));
  if (dryRun) {
    console.log(`[DRY RUN] Would ${mode} "${src}" -> "${destPath}"`);
    return true;
  }
  try {
    if (mode === 'copy') {
      fs.copyFileSync(src, destPath);
    } else {
      try { fs.renameSync(src, destPath); }
      catch (e) {
        fs.copyFileSync(src, destPath);
        fs.unlinkSync(src);
      }
    }
    console.log(`✔ ${mode === 'copy' ? 'Copied' : 'Moved'} "${src}" -> "${destPath}"`);
    return true;
  } catch (err) {
    console.error(`! Failed to ${mode} "${src}": ${err.message}`);
    return false;
  }
}

function scanAndOrganize(source, destRoot, dryRun, mode, exclude) {
  let moved = 0, failed = 0;
  function walk(dir) {
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
    catch (e) { return; }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (exclude.includes(e.name) || IGNORE_DIRS.has(e.name)) continue;
        walk(full);
      } else if (e.isFile()) {
        const ext = path.extname(e.name).toLowerCase();
        const folder = COMMON_MAP[ext] || (ext ? ext.slice(1).toUpperCase() : 'NO_EXT');
        const ok = transferFile(full, destRoot, folder, dryRun, mode);
        if (ok) moved++; else failed++;
      }
    }
  }
  walk(source);
  return { moved, failed };
}

function main() {
  const args = parseArgs(process.argv);
  console.log(`Source: ${args.source}`);
  console.log(`Dest:   ${args.dest}`);
  console.log(`Mode:   ${args.mode}` + (args.dryRun ? ' (dry run)' : ''));
  const res = scanAndOrganize(args.source, args.dest, args.dryRun, args.mode, args.exclude || []);
  console.log(`\nDone. Processed: ${res.moved} succeeded, ${res.failed} failed.`);
}

main();
