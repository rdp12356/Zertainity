#!/usr/bin/env node
/**
 * organize-programs-compressed.cjs
 *
 * Recursively moves .exe/.msi files into Programs and
 * .zip/.7z/.7zip/.rar files into Compressed Folder.
 *
 * Usage:
 *   node scripts/organize-programs-compressed.cjs --source "D:\" --dry-run
 *   node scripts/organize-programs-compressed.cjs --source "D:\" --move
 *   node scripts/organize-programs-compressed.cjs --source "C:\Users\johan\Downloads" --dest "D:\MyFolder" --dry-run
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_SOURCE = process.platform === 'win32' ? 'D:\\' : process.cwd();
const CATEGORY_FOLDERS = {
  programs: 'Programs',
  compressed: 'Compressed Folder',
};

const CATEGORY_EXTENSIONS = {
  programs: new Set(['.exe', '.msi']),
  compressed: new Set(['.zip', '.7z', '.7zip', '.rar']),
};

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
  CATEGORY_FOLDERS.programs,
  CATEGORY_FOLDERS.compressed,
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

function classifyFile(fileName) {
  const ext = path.extname(fileName).toLowerCase();

  for (const [category, extensions] of Object.entries(CATEGORY_EXTENSIONS)) {
    if (extensions.has(ext)) return category;
  }

  return null;
}

function isInsideTarget(entryPath, targetPath) {
  const normalizedEntry = path.normalize(entryPath).toLowerCase();
  const normalizedTarget = path.normalize(targetPath).toLowerCase();
  return normalizedEntry === normalizedTarget || normalizedEntry.startsWith(`${normalizedTarget}${path.sep}`);
}

function isFilesystemRoot(dirPath) {
  return path.parse(path.resolve(dirPath)).root === path.resolve(dirPath);
}

function scanForFiles(dirPath, targetRoots, results) {
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
      scanForFiles(entryPath, targetRoots, results);
      continue;
    }

    if (!entry.isFile()) continue;

    const category = classifyFile(entry.name);
    if (category) {
      results.push({ sourcePath: entryPath, category });
    }
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
  const destRootBase = options.dest ? path.resolve(options.dest) : sourceRoot;
  const destRoots = {
    programs: path.join(destRootBase, CATEGORY_FOLDERS.programs),
    compressed: path.join(destRootBase, CATEGORY_FOLDERS.compressed),
  };

  console.log('==================================================');
  console.log(`📁 Source Root: ${sourceRoot}`);
  console.log(`📦 Destination Root: ${destRootBase}`);
  console.log(`📦 Programs Folder: ${destRoots.programs}`);
  console.log(`📦 Compressed Folder: ${destRoots.compressed}`);
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
  scanForFiles(sourceRoot, Object.values(destRoots), foundFiles);

  console.log(`🔎 Found ${foundFiles.length} file(s) to organize.\n`);

  if (foundFiles.length === 0) {
    console.log('✨ No matching files detected.');
    return;
  }

  if (!options.dryRun && !isFilesystemRoot(destRootBase)) {
    fs.mkdirSync(destRootBase, { recursive: true });
    fs.mkdirSync(destRoots.programs, { recursive: true });
    fs.mkdirSync(destRoots.compressed, { recursive: true });
  }

  const counts = { programs: 0, compressed: 0 };

  for (const file of foundFiles) {
    const destRoot = destRoots[file.category];
    const destPath = ensureUniquePath(path.join(destRoot, path.basename(file.sourcePath)));
    const destLabel = path.basename(destRoot);
    const destFileLabel = path.basename(destPath);
    const displayDestPath = path.join(destRootBase, destLabel, destFileLabel);

    console.log(`${options.dryRun ? '[DRY RUN] Would move' : '✔ Moving'} "${path.basename(file.sourcePath)}" ➔ "${displayDestPath}"`);

    if (transferFile(file.sourcePath, destPath, options.mode, options.dryRun)) {
      counts[file.category] += 1;
    }
  }

  console.log('\n==================================================');
  console.log(`✨ ${options.dryRun ? 'Dry run complete' : 'Done'}!`);
  console.log(`🧩 Programs files organized: ${counts.programs}`);
  console.log(`🗜️ Compressed files organized: ${counts.compressed}`);
  console.log('==================================================');
}

run();
