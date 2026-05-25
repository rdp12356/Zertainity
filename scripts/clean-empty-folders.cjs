#!/usr/bin/env node
/**
 * clean-empty-folders.cjs
 *
 * Recursively removes empty folders from a source directory.
 *
 * Usage:
 *   node scripts/clean-empty-folders.cjs --source "D:\" --dry-run
 *   node scripts/clean-empty-folders.cjs --source "D:\" --delete
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_SOURCE = process.platform === 'win32' ? 'D:\\' : process.cwd();

function parseArgs(argv) {
  const args = [...argv];
  const options = {
    source: DEFAULT_SOURCE,
    dryRun: true,
    deleteEmpty: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--dry-run' || arg === '-d') {
      options.dryRun = true;
      options.deleteEmpty = false;
      continue;
    }

    if (arg === '--delete' || arg === '--remove' || arg === '-r') {
      options.dryRun = false;
      options.deleteEmpty = true;
      continue;
    }

    if (arg === '--source' || arg === '-s') {
      options.source = path.resolve(args[i + 1] || options.source);
      i += 1;
    }
  }

  return options;
}

function isDirectoryEmpty(dirPath) {
  try {
    return fs.readdirSync(dirPath).length === 0;
  } catch {
    return false;
  }
}

function cleanEmptyFolders(dirPath, options, stats) {
  let entries = [];

  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    cleanEmptyFolders(path.join(dirPath, entry.name), options, stats);
  }

  if (isDirectoryEmpty(dirPath)) {
    stats.emptyFolders += 1;

    if (options.deleteEmpty) {
      try {
        fs.rmdirSync(dirPath);
        stats.deletedFolders += 1;
        console.log(`✔ Removed empty folder: ${dirPath}`);
      } catch (error) {
        console.error(`❌ Failed to remove folder: ${dirPath} (${error.message})`);
      }
    } else {
      console.log(`[DRY RUN] Would remove empty folder: ${dirPath}`);
    }
  }
}

function run() {
  const options = parseArgs(process.argv.slice(2));
  const sourceRoot = path.resolve(options.source);

  console.log('==================================================');
  console.log(`📁 Source Root: ${sourceRoot}`);
  console.log(`🔍 Mode: ${options.deleteEmpty ? 'DELETE' : 'DRY RUN'}`);
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

  const stats = { emptyFolders: 0, deletedFolders: 0 };
  cleanEmptyFolders(sourceRoot, options, stats);

  console.log('\n==================================================');
  console.log(`🔎 Empty folders found: ${stats.emptyFolders}`);
  console.log(`🧹 Empty folders removed: ${stats.deletedFolders}`);
  console.log(`✨ ${options.deleteEmpty ? 'Cleanup complete' : 'Dry run complete'}.`);
  console.log('==================================================');
}

run();
