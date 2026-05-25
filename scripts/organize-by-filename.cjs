#!/usr/bin/env node
/**
 * organize-by-filename.cjs
 *
 * Recursively moves each file into a folder named after its file name.
 * Example: report.pdf -> report/report.pdf
 *
 * Usage:
 *   node scripts/organize-by-filename.cjs --source "D:\" --dry-run
 *   node scripts/organize-by-filename.cjs --source "D:\" --dest "D:\Sorted" --move
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_SOURCE = process.platform === 'win32' ? 'D:\\' : process.cwd();

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
      i += 1;
      continue;
    }

    if (arg === '--dest' || arg === '-o') {
      options.dest = path.resolve(args[i + 1] || '');
      i += 1;
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

function getFolderKey(fileName) {
  const stem = path.parse(fileName).name.trim();
  const firstWord = stem.split(/[\s._-]+/).find(Boolean);
  return firstWord || stem || 'Ungrouped';
}

function isFilesystemRoot(dirPath) {
  return path.parse(path.resolve(dirPath)).root === path.resolve(dirPath);
}

function isInsideTarget(entryPath, targetPath) {
  const normalizedEntry = path.normalize(entryPath).toLowerCase();
  const normalizedTarget = path.normalize(targetPath).toLowerCase();
  return normalizedEntry === normalizedTarget || normalizedEntry.startsWith(`${normalizedTarget}${path.sep}`);
}

function scanFiles(dirPath, destBase, results) {
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
      scanFiles(entryPath, destBase, results);
      continue;
    }

    if (!entry.isFile()) continue;

    const folderKey = getFolderKey(entry.name);
    const targetFolder = path.join(destBase, folderKey);

    if (!folderKey) continue;
    if (isInsideTarget(entryPath, targetFolder)) continue;

    results.push({ sourcePath: entryPath, folderKey });
  }
}

function transferFile(sourcePath, destPath, mode, dryRun) {
  if (dryRun) return true;

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

  console.log('==================================================');
  console.log(`📁 Source Root: ${sourceRoot}`);
  console.log(`📦 Destination Base: ${destBase}`);
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
  scanFiles(sourceRoot, destBase, foundFiles);

  console.log(`🔎 Found ${foundFiles.length} file(s) to organize.\n`);

  if (foundFiles.length === 0) {
    console.log('✨ No files detected.');
    return;
  }

  if (!options.dryRun && !isFilesystemRoot(destBase)) {
    fs.mkdirSync(destBase, { recursive: true });
  }

  let movedCount = 0;

  for (const file of foundFiles) {
    const targetFolder = path.join(destBase, file.folderKey);
    const targetPath = ensureUniquePath(path.join(targetFolder, path.basename(file.sourcePath)));

    if (!options.dryRun) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    console.log(`${options.dryRun ? '[DRY RUN] Would move' : '✔ Moving'} "${path.basename(file.sourcePath)}" ➔ "${targetPath}"`);

    if (transferFile(file.sourcePath, targetPath, options.mode, options.dryRun)) {
      movedCount += 1;
    }
  }

  console.log('\n==================================================');
  console.log(`✨ ${options.dryRun ? 'Dry run complete' : 'Done'}! Organized ${movedCount} file(s).`);
  console.log('==================================================');
}

run();
