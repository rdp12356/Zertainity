#!/usr/bin/env node
/**
 * organize-pdf-files.cjs
 *
 * Recursively finds .pdf files and moves them into a single "PDF" folder.
 *
 * Usage:
 *   node scripts/organize-pdf-files.cjs --source "D:\" --dry-run
 *   node scripts/organize-pdf-files.cjs --source "D:\" --move
 *   node scripts/organize-pdf-files.cjs --source "D:\" --dest "D:\PDF"
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_SOURCE = process.platform === 'win32' ? 'D:\\' : process.cwd();
const DEFAULT_DEST_NAME = 'PDF';

const IGNORE_DIRS = new Set([
  '.git',
  'node_modules',
  'dist',
  'build',
  'out',
  'release',
  'artifacts',
  '.next',
  '.cache',
  '.vscode',
  '$RECYCLE.BIN',
  'System Volume Information',
]);

function parseArgs(argv) {
  const args = [...argv];
  const options = {
    source: DEFAULT_SOURCE,
    dest: null,
    dryRun: false,
    mode: 'move',
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--dry-run' || arg === '-d') {
      options.dryRun = true;
      continue;
    }
    if (arg === '--move' || arg === '-m') {
      options.mode = 'move';
      continue;
    }
    if (arg === '--copy' || arg === '-c') {
      options.mode = 'copy';
      continue;
    }
    if (arg === '--source' || arg === '-s') {
      options.source = path.resolve(args[i + 1] || options.source);
      i++;
      continue;
    }
    if (arg === '--dest' || arg === '-o') {
      options.dest = path.resolve(args[i + 1] || '');
      i++;
      continue;
    }
  }

  return options;
}

function ensureUniquePath(targetPath) {
  if (!fs.existsSync(targetPath)) return targetPath;

  const dir = path.dirname(targetPath);
  const ext = path.extname(targetPath);
  const base = path.basename(targetPath, ext);
  let index = 1;
  let candidate = targetPath;

  while (fs.existsSync(candidate)) {
    candidate = path.join(dir, `${base}_${index}${ext}`);
    index += 1;
  }

  return candidate;
}

function isFilesystemRoot(dirPath) {
  return path.parse(path.resolve(dirPath)).root === path.resolve(dirPath);
}

function isInsideTarget(entryPath, targetPath) {
  const normalizedEntry = path.normalize(entryPath).toLowerCase();
  const normalizedTarget = path.normalize(targetPath).toLowerCase();
  return normalizedEntry === normalizedTarget || normalizedEntry.startsWith(`${normalizedTarget}${path.sep}`);
}

function scanForPdfs(dirPath, targetRoots, files) {
  let entries = [];
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      if (targetRoots.some((root) => isInsideTarget(entryPath, root))) continue;
      scanForPdfs(entryPath, targetRoots, files);
      continue;
    }

    if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.pdf') {
      files.push(entryPath);
    }
  }
}

function moveFile(sourcePath, destPath, isDryRun, mode) {
  if (isDryRun) return true;

  if (mode === 'copy') {
    try {
      fs.copyFileSync(sourcePath, destPath);
      return true;
    } catch (err) {
      console.error(`❌ Failed to copy "${sourcePath}": ${err.message}`);
      return false;
    }
  }

  try {
    fs.renameSync(sourcePath, destPath);
    return true;
  } catch {
    try {
      fs.copyFileSync(sourcePath, destPath);
      fs.unlinkSync(sourcePath);
      return true;
    } catch (err) {
      console.error(`❌ Failed to move "${sourcePath}": ${err.message}`);
      return false;
    }
  }
}

function run() {
  const options = parseArgs(process.argv.slice(2));
  const sourceRoot = path.resolve(options.source);
  const destBase = options.dest ? path.resolve(options.dest) : sourceRoot;
  const destRoot = path.join(destBase, DEFAULT_DEST_NAME);

  console.log('==================================================');
  console.log(`📁 Source Root: ${sourceRoot}`);
  console.log(`📦 Destination Base: ${destBase}`);
  console.log(`📦 Destination Root: ${destRoot}`);
  console.log(`🔍 Mode: ${options.dryRun ? 'DRY RUN' : options.mode.toUpperCase()}`);
  console.log('==================================================\n');

  if (!fs.existsSync(sourceRoot)) {
    console.error(`❌ Source root does not exist: ${sourceRoot}`);
    process.exit(1);
  }

  const sourceStat = fs.statSync(sourceRoot);
  if (!sourceStat.isDirectory()) {
    console.error(`❌ Source root is not a directory: ${sourceRoot}`);
    process.exit(1);
  }

  const foundFiles = [];
  scanForPdfs(sourceRoot, [destRoot], foundFiles);

  console.log(`🔎 Found ${foundFiles.length} PDF file(s).\n`);

  if (foundFiles.length === 0) {
    console.log('✨ No .pdf files detected.');
    return;
  }

  if (!options.dryRun) {
    if (!isFilesystemRoot(destBase)) {
      fs.mkdirSync(destBase, { recursive: true });
    }
    fs.mkdirSync(destRoot, { recursive: true });
  }

  let movedCount = 0;
  for (const file of foundFiles) {
    const destPath = ensureUniquePath(path.join(destRoot, path.basename(file)));
    const finalName = path.basename(destPath);
    console.log(`${options.dryRun ? '[DRY RUN] Would move' : '✔ Moving'} "${path.basename(file)}" ➔ "${destPath}"`);

    if (moveFile(file, destPath, options.dryRun, options.mode)) {
      movedCount += 1;
    }
  }

  console.log('\n==================================================');
  console.log(`✨ ${options.dryRun ? 'Dry run complete' : 'Done'}! Organized ${movedCount} file(s).`);
  console.log('==================================================');
}

run();
