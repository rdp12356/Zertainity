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
  if (!args.source) { console.error('Missing --source'); process.exit(2); }
  args.source = path.resolve(args.source);
  args.dest = args.dest ? path.resolve(args.dest) : args.source;
  return args;
}

// Map common extensions to categories
const COMMON_MAP = {
  '.pdf': 'Documents',
  '.doc': 'Documents', '.docx': 'Documents', '.xls': 'Documents', '.xlsx': 'Documents', '.ppt': 'Documents', '.pptx': 'Documents', '.txt': 'Documents',
  '.exe': 'Programs', '.msi': 'Programs',
  '.jpg': 'Images', '.jpeg': 'Images', '.png': 'Images', '.gif': 'Images', '.webp': 'Images', '.bmp': 'Images',
  '.mp4': 'Video', '.mkv': 'Video', '.mov': 'Video',
  '.mp3': 'Audio', '.wav': 'Audio', '.flac': 'Audio',
  '.zip': 'Compressed', '.rar': 'Compressed', '.7z': 'Compressed', '.tar': 'Compressed', '.gz': 'Compressed',
  '.iso': 'System Images'
};

// Importance ranking (lower = more important)
const RANK = {
  Documents: 1,
  Programs: 2,
  Images: 3,
  Video: 4,
  Audio: 5,
  'System Images': 6,
  Compressed: 7,
  NO_EXT: 8,
  OTHERS: 9
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

function folderForExtension(ext) {
  if (!ext) return 'NO_EXT';
  return COMMON_MAP[ext] || 'OTHERS';
}

function folderNameWithRank(folder) {
  const rank = RANK[folder] || RANK.OTHERS || 99;
  return `${String(rank).padStart(2, '0')} - ${folder}`;
}

function transferFile(src, destRoot, folderName, dryRun, mode) {
  const destDir = path.join(destRoot, folderName);
  if (!isFilesystemRoot(destDir) && !fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  const destPath = ensureUniquePath(path.join(destDir, path.basename(src)));
  if (dryRun) { console.log(`[DRY RUN] Would ${mode} "${src}" -> "${destPath}"`); return true; }
  try {
    if (mode === 'copy') fs.copyFileSync(src, destPath);
    else {
      try { fs.renameSync(src, destPath); }
      catch (e) { fs.copyFileSync(src, destPath); fs.unlinkSync(src); }
    }
    console.log(`✔ ${mode === 'copy' ? 'Copied' : 'Moved'} "${src}" -> "${destPath}"`);
    return true;
  } catch (err) { console.error(`! Failed to ${mode} "${src}": ${err.message}`); return false; }
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
        const folder = folderForExtension(ext);
        const destFolder = folderNameWithRank(folder);
        const ok = transferFile(full, destRoot, destFolder, dryRun, mode);
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
