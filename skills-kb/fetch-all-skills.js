import https from 'https';
import fs from 'fs';

const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');
const combinations = [];
for (let i = 0; i < chars.length; i++) {
  for (let j = 0; j < chars.length; j++) {
    combinations.push(chars[i] + chars[j]);
  }
}

const allSkills = new Map();

if (fs.existsSync('skills.json')) {
  try {
    const existing = JSON.parse(fs.readFileSync('skills.json', 'utf8'));
    existing.forEach(s => {
      allSkills.set(`${s.author}/${s.repo}/${s.name}`, s);
    });
  } catch(e) {}
}

function fetchQuery(query) {
  return new Promise((resolve) => {
    const req = https.get(`https://skills.sh/api/search?q=${query}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve([]);
        }
      });
    });
    req.on('error', () => resolve([]));
    req.setTimeout(5000, () => {
      req.abort();
      resolve([]);
    });
  });
}

async function main() {
  console.log(`Starting... already possess ${allSkills.size} skills.`);
  const concurrency = 20;
  for (let i = 0; i < combinations.length; i += concurrency) {
    const chunk = combinations.slice(i, i + concurrency);
    const results = await Promise.all(chunk.map(c => fetchQuery(c)));
    
    let added = 0;
    for (const res of results) {
      if (Array.isArray(res)) {
        res.forEach(skill => {
          if (skill && skill.name && skill.author && skill.repo) {
            const id = `${skill.author}/${skill.repo}/${skill.name}`;
            if (!allSkills.has(id)) {
                allSkills.set(id, {
                    name: skill.name,
                    author: skill.author,
                    repo: skill.repo,
                    url: `https://skills.sh/${id}`
                });
                added++;
            }
          }
        });
      }
    }
    
    if (added > 0) {
      fs.writeFileSync('skills.json', JSON.stringify(Array.from(allSkills.values()), null, 2));
    }
    
    process.stdout.write(`\rProgress: ${Math.min(i + concurrency, combinations.length)}/${combinations.length}. Total unique skills: ${allSkills.size}`);
  }

  console.log(`\nFinished! Extracted total ${allSkills.size} unique skills.`);
}

main();
