#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function parseArgs(argv){
  const args = { logs: [] };
  for(let i=2;i<argv.length;i++){
    const a = argv[i];
    if(a === '--log' || a === '-l') args.logs.push(path.resolve(argv[++i]));
  }
  if(args.logs.length === 0){ console.error('Usage: build-revert-log.cjs --log <path> [--log <path> ...]'); process.exit(2); }
  return args;
}

function extractFromContent(content){
  const lines = content.split(/\r?\n/);
  const patterns = [
    /[✔✓]\s+Moved\s+"([^"]+)"\s+->\s+"([^"]+)"/, // real run moved
    /\[DRY RUN\]\s+Would\s+(?:move|copy)\s+"([^"]+)"\s+->\s+"([^"]+)"/i
  ];
  const pairs = [];
  for(const l of lines){
    for(const p of patterns){
      const m = l.match(p);
      if(m) pairs.push({ src: m[1], dest: m[2] });
    }
  }
  return pairs;
}

function uniqueMerge(pairs){
  const map = new Map();
  for(const p of pairs){ map.set(p.dest, p.src); }
  return Array.from(map.entries()).map(([dest,src])=>({src,dest}));
}

function main(){
  const args = parseArgs(process.argv);
  let all = [];
  for(const f of args.logs){
    try{ const c = fs.readFileSync(f,'utf8'); all = all.concat(extractFromContent(c)); }
    catch(e){ console.error('Could not read', f, e.message); }
  }
  const merged = uniqueMerge(all);
  const out = path.join(process.cwd(),'scripts','move-log-revert-full.json');
  fs.writeFileSync(out, JSON.stringify(merged, null, 2));
  console.log('Wrote', merged.length, 'records to', out);
}

main();
