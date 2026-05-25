#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function usage(){
  console.error('Usage: build-revert-from-session.cjs <session-resources-dir>');
  process.exit(2);
}

const dir = process.argv[2];
if(!dir) usage();
const abs = path.resolve(dir);
const files = [];
function walk(d){
  let items = [];
  try{ items = fs.readdirSync(d,{withFileTypes:true}); }catch(e){ return; }
  for(const it of items){
    const p = path.join(d,it.name);
    if(it.isDirectory()) walk(p);
    else if(it.isFile() && it.name === 'content.txt') files.push(p);
  }
}
walk(abs);
if(files.length===0){ console.error('No content.txt files found under', abs); process.exit(3); }
const spawn = require('child_process').spawnSync;
const args = ['scripts/build-revert-log.cjs'];
for(const f of files) args.push('--log', f);
const res = spawn('node', args, { encoding: 'utf8' });
if(res.error) { console.error('Failed to run builder:', res.error.message); process.exit(4); }
process.stdout.write(res.stdout);
process.stderr.write(res.stderr);
