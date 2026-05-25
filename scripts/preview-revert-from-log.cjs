#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function parseArgs(argv){
  const args = { log: null, sample: 5 };
  for(let i=2;i<argv.length;i++){
    const a = argv[i];
    if(a === '--log' || a === '-l') args.log = argv[++i];
    else if(a === '--sample' || a === '-s') args.sample = parseInt(argv[++i],10)||5;
  }
  if(!args.log){ console.error('Missing --log <path-to-run-output>'); process.exit(2); }
  args.log = path.resolve(args.log);
  return args;
}

function buildMapping(logContent){
  const lines = logContent.split(/\r?\n/);
  const re = /[✔✓]\s+Moved\s+"([^"]+)"\s+->\s+"([^"]+)"/; // matches moved lines
  const map = [];
  for(const l of lines){
    const m = l.match(re);
    if(m){ map.push({ src: m[1], dest: m[2] }); }
  }
  return map;
}

function main(){
  const args = parseArgs(process.argv);
  let content;
  try{ content = fs.readFileSync(args.log,'utf8'); }
  catch(e){ console.error('Could not read log:', e.message); process.exit(3); }
  const mapping = buildMapping(content);
  console.log('Found', mapping.length, 'move records.');
  let destExist = 0, srcExist = 0;
  for(const e of mapping){ if(fs.existsSync(e.dest)) destExist++; if(fs.existsSync(e.src)) srcExist++; }
  console.log('Destination files currently present:', destExist);
  console.log('Original source paths still exist (should be false):', srcExist);
  console.log('\nSample revert operations:');
  mapping.slice(0, args.sample).forEach((m,i)=>{
    console.log(`${i+1}. Move "${m.dest}" -> "${m.src}"`);
  });
  const outJson = path.join(process.cwd(),'scripts','move-log-revert.json');
  try{ fs.writeFileSync(outJson, JSON.stringify(mapping, null, 2)); console.log('\nWrote mapping to', outJson); }
  catch(e){ console.error('Failed to write mapping file:', e.message); }
}

main();
