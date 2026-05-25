#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function parseArgs(argv){
  const args = { mapping: null, apply: false };
  for(let i=2;i<argv.length;i++){
    const a = argv[i];
    if(a === '--mapping' || a === '-m') args.mapping = path.resolve(argv[++i]);
    else if(a === '--apply' || a === '-a') args.apply = true;
  }
  if(!args.mapping){ console.error('Missing --mapping <path>'); process.exit(2); }
  return args;
}

function ensureDir(p){ if(!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }

function ensureUniquePath(p){ if(!fs.existsSync(p)) return p; const dir=path.dirname(p); const ext=path.extname(p); const base=path.basename(p,ext); for(let i=1;i<10000;i++){ const c=path.join(dir, `${base} (${i})${ext}`); if(!fs.existsSync(c)) return c; } return p; }

function transfer(src, dest, apply){
  if(!apply){ console.log(`[DRY RUN] Would move "${src}" -> "${dest}"`); return true; }
  try{
    ensureDir(path.dirname(src)); // ensure original parent exists
    try{ fs.renameSync(dest, src); }
    catch(e){ fs.copyFileSync(dest, src); fs.unlinkSync(dest); }
    console.log(`✔ Moved "${dest}" -> "${src}"`);
    return true;
  } catch(err){ console.error(`! Failed to move "${dest}" -> "${src}": ${err.message}`); return false; }
}

function main(){
  const args = parseArgs(process.argv);
  let mapping;
  try{ mapping = JSON.parse(fs.readFileSync(args.mapping,'utf8')); }
  catch(e){ console.error('Failed to read mapping:', e.message); process.exit(3); }
  let ok=0, fail=0, missing=0;
  for(const entry of mapping){
    const dest = entry.dest;
    const src = entry.src;
    if(!fs.existsSync(dest)){ missing++; continue; }
    const finalSrc = ensureUniquePath(src);
    const r = transfer(finalSrc, dest, args.apply);
    if(r) ok++; else fail++;
  }
  console.log(`\nDone. ${ok} succeeded, ${fail} failed, ${missing} missing dest files.`);
}

main();
