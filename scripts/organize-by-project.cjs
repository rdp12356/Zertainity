#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const PROJECT_MARKERS = new Set([
  'package.json',
  'package-lock.json',
  'pnpm-lock.yaml',
  'yarn.lock',
  'bun.lockb',
  'tsconfig.json',
  'vite.config.ts',
  'vite.config.js',
  'vitest.config.ts',
  'vitest.config.js',
  'pyproject.toml',
  'requirements.txt',
  'setup.py',
  'setup.cfg',
  'Pipfile',
  'poetry.lock',
  'go.mod',
  'Cargo.toml',
  'Cargo.lock',
  'pom.xml',
  'build.gradle',
  'build.gradle.kts',
  'settings.gradle',
  'settings.gradle.kts',
  'composer.json',
  'Gemfile',
  'Rakefile',
  'pubspec.yaml',
  'CMakeLists.txt',
]);

const STRONG_PROJECT_MARKERS = new Set([
  'package.json',
  'pyproject.toml',
  'go.mod',
  'Cargo.toml',
  'pom.xml',
  'build.gradle',
  'build.gradle.kts',
  'settings.gradle',
  'settings.gradle.kts',
  'composer.json',
  'Gemfile',
  'pubspec.yaml',
  'CMakeLists.txt',
]);

const PROJECT_HINT_DIRS = new Set(['src', 'app', 'lib', 'tests', 'test', 'spec', 'packages', 'examples']);

const PROGRAM_EXTENSIONS = new Set([
  '.c', '.cc', '.cpp', '.cs', '.go', '.h', '.hpp', '.java', '.js', '.jsx', '.kt', '.kts',
  '.m', '.mm', '.php', '.py', '.rb', '.rs', '.sh', '.swift', '.ts', '.tsx', '.vue', '.svelte',
  '.gradle', '.sql', '.ps1', '.bat', '.cmd',
]);

const IGNORE_DIRS = new Set([
  '.git', 'node_modules', 'dist', 'build', 'out', 'release', 'artifacts', '.next', '.cache',
  '.vscode', '$RECYCLE.BIN', 'System Volume Information', 'Windows', 'Program Files',
  'Program Files (x86)', 'ProgramData', 'PerfLogs', 'Recovery', 'pagefile.sys', 'swapfile.sys',
]);

function parseArgs(argv) {
  const options = { source: null, dest: null, dryRun: false, mode: 'move' };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--source' || arg === '-s') options.source = argv[++i];
    else if (arg === '--dest' || arg === '-o') options.dest = argv[++i];
    else if (arg === '--dry-run' || arg === '-d') options.dryRun = true;
    else if (arg === '--copy' || arg === '-c') options.mode = 'copy';
    else if (arg === '--move' || arg === '-m') options.mode = 'move';
  }
  if (!options.source) {
    console.error('Missing --source');
    process.exit(2);
  }
  options.source = path.resolve(options.source);
  options.dest = path.resolve(options.dest || path.join(options.source, 'PROJECTS'));
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
    candidate = path.join(dir, `${base} (${index})${ext}`);
    index += 1;
  }
  return candidate;
}

function isFilesystemRoot(dirPath) {
  const resolved = path.resolve(dirPath);
  return path.parse(resolved).root === resolved;
}

function isInsideTarget(entryPath, targetPath) {
  const normalizedEntry = path.normalize(entryPath).toLowerCase();
  const normalizedTarget = path.normalize(targetPath).toLowerCase();
  return normalizedEntry === normalizedTarget || normalizedEntry.startsWith(`${normalizedTarget}${path.sep}`);
}

function isProgrammingFile(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  return PROGRAM_EXTENSIONS.has(ext) || PROJECT_MARKERS.has(fileName);
}

function detectProjectRoots(sourceRoot, destRoot) {
  const roots = new Set();

  function walk(dirPath) {
    if (isInsideTarget(dirPath, destRoot)) return;

    let entries = [];
    try {
      entries = fs.readdirSync(dirPath, { withFileTypes: true });
    } catch {
      return;
    }

    const markerNames = entries.filter(entry => entry.isFile() && PROJECT_MARKERS.has(entry.name)).map(entry => entry.name);
    const hasStrongMarker = markerNames.some(name => STRONG_PROJECT_MARKERS.has(name));
    const hasProjectHints = entries.some(entry => entry.isDirectory() && PROJECT_HINT_DIRS.has(entry.name));
    const markerCount = markerNames.length;

    if (hasStrongMarker && (hasProjectHints || markerCount >= 2)) {
      roots.add(dirPath);
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (IGNORE_DIRS.has(entry.name)) continue;
      walk(path.join(dirPath, entry.name));
    }
  }

  walk(sourceRoot);
  return [...roots].sort((left, right) => right.length - left.length);
}

function findNearestProjectRoot(filePath, projectRoots) {
  for (const root of projectRoots) {
    if (isInsideTarget(filePath, root)) return root;
  }
  return null;
}

function transferFile(sourcePath, targetPath, mode, dryRun) {
  if (dryRun) {
    console.log(`[DRY RUN] Would ${mode} "${sourcePath}" -> "${targetPath}"`);
    return true;
  }

  try {
    if (mode === 'copy') {
      fs.copyFileSync(sourcePath, targetPath);
    } else {
      try {
        fs.renameSync(sourcePath, targetPath);
      } catch {
        fs.copyFileSync(sourcePath, targetPath);
        fs.unlinkSync(sourcePath);
      }
    }
    console.log(`✔ ${mode === 'copy' ? 'Copied' : 'Moved'} "${sourcePath}" -> "${targetPath}"`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to ${mode} "${sourcePath}": ${error.message}`);
    return false;
  }
}

function scanFiles(sourceRoot, destRoot, projectRoots) {
  const items = [];

  function walk(dirPath) {
    if (isInsideTarget(dirPath, destRoot)) return;

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
        walk(entryPath);
        continue;
      }

      if (!entry.isFile() || !isProgrammingFile(entry.name)) continue;
      if (isInsideTarget(entryPath, destRoot)) continue;

      const projectRoot = findNearestProjectRoot(entryPath, projectRoots);
      if (!projectRoot) continue;

      const projectName = path.basename(projectRoot).trim() || 'Project';
      const relativePath = path.relative(projectRoot, entryPath);

      items.push({ sourcePath: entryPath, projectName, relativePath });
    }
  }

  walk(sourceRoot);
  return items;
}

function run() {
  const options = parseArgs(process.argv);
  const sourceRoot = options.source;
  const destRoot = options.dest;
  const sourceRootName = path.basename(sourceRoot).toLowerCase();

  console.log('==================================================');
  console.log(`📁 Source Root: ${sourceRoot}`);
  console.log(`📦 Destination Base: ${destRoot}`);
  console.log(`🔍 Mode: ${options.dryRun ? 'DRY RUN' : options.mode.toUpperCase()}`);
  console.log('==================================================\n');

  if (!fs.existsSync(sourceRoot)) {
    console.error(`❌ Source root does not exist: ${sourceRoot}`);
    process.exit(1);
  }

  if (!fs.statSync(sourceRoot).isDirectory()) {
    console.error(`❌ Source root is not a directory: ${sourceRoot}`);
    process.exit(1);
  }

  const projectRoots = detectProjectRoots(sourceRoot, destRoot);

  const effectiveRoots = sourceRootName === 'unnecessary'
    ? projectRoots.filter(root => path.resolve(root) !== path.resolve(sourceRoot))
    : projectRoots;

  const foundFiles = scanFiles(sourceRoot, destRoot, effectiveRoots);

  console.log(`🔎 Found ${foundFiles.length} programming file(s) to organize.`);
  console.log(`🧭 Detected ${effectiveRoots.length} project root(s).\n`);

  if (foundFiles.length === 0) {
    console.log('✨ No programming files detected.');
    return;
  }

  if (!options.dryRun && !isFilesystemRoot(destRoot)) {
    fs.mkdirSync(destRoot, { recursive: true });
  }

  let movedCount = 0;

  for (const file of foundFiles) {
    const targetFolder = path.join(destRoot, file.projectName);
    const targetPath = ensureUniquePath(path.join(targetFolder, file.relativePath));

    if (!options.dryRun) {
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    }

    if (transferFile(file.sourcePath, targetPath, options.mode, options.dryRun)) {
      movedCount += 1;
    }
  }

  console.log('\n==================================================');
  console.log(`✨ ${options.dryRun ? 'Dry run complete' : 'Done'}! Organized ${movedCount} file(s).`);
  console.log('==================================================');
}

run();
