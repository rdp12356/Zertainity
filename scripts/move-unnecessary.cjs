const fs = require('fs')
const path = require('path')

function parseArgs() {
  const args = process.argv.slice(2)
  const out = { sources: [], dest: null, dryRun: false }
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === '--sources' || a === '-s') {
      out.sources = args[++i].split(',').map(s => s.trim())
    } else if (a === '--dest' || a === '-d') {
      out.dest = args[++i]
    } else if (a === '--dry-run' || a === '-n') {
      out.dryRun = true
    }
  }
  return out
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function ensureUniquePath(dest) {
  if (!fs.existsSync(dest)) return dest
  const dir = path.dirname(dest)
  const ext = path.extname(dest)
  const base = path.basename(dest, ext)
  let n = 1
  let next
  do {
    next = path.join(dir, `${base} (${n})${ext}`)
    n++
  } while (fs.existsSync(next))
  return next
}

function transferFile(src, dest, dryRun) {
  const final = ensureUniquePath(dest)
  if (dryRun) {
    console.log(`DRY RUN: ${src} -> ${final}`)
    return
  }
  try {
    fs.renameSync(src, final)
  } catch (err) {
    fs.copyFileSync(src, final)
    fs.unlinkSync(src)
  }
  console.log(`✔ Moved "${src}" -> "${final}"`)
}

function walkFiles(dir, cb) {
  if (!fs.existsSync(dir)) return
  const stat = fs.statSync(dir)
  if (!stat.isDirectory()) return
  const items = fs.readdirSync(dir)
  for (const it of items) {
    const full = path.join(dir, it)
    const s = fs.statSync(full)
    if (s.isDirectory()) walkFiles(full, cb)
    else cb(full)
  }
}

function removeEmptyDirs(dir) {
  if (!fs.existsSync(dir)) return
  let entries = fs.readdirSync(dir)
  for (const e of entries) {
    const full = path.join(dir, e)
    if (fs.existsSync(full) && fs.statSync(full).isDirectory()) removeEmptyDirs(full)
  }
  entries = fs.readdirSync(dir)
  if (entries.length === 0) {
    try { fs.rmdirSync(dir) } catch (e) {}
  }
}

function main() {
  const argv = parseArgs()
  const defaultSources = [
    'D:\\09 - OTHERS',
    'D:\\NO_EXT',
    'D:\\Compressed'
  ]
  const sources = argv.sources.length ? argv.sources : defaultSources
  const dest = argv.dest || 'D:\\UNNECESSARY'
  const dryRun = argv.dryRun

  ensureDir(dest)

  for (const src of sources) {
    if (!fs.existsSync(src)) continue
    walkFiles(src, (filePath) => {
      const fileName = path.basename(filePath)
      const target = path.join(dest, fileName)
      transferFile(filePath, target, dryRun)
    })
    if (!dryRun) removeEmptyDirs(src)
  }

  console.log(dryRun ? 'Dry run complete.' : `Done. Files moved to ${dest}`)
}

main()
