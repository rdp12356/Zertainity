import fs from "fs";

const data = fs.readFileSync("src_skills.html", "utf-8");

// Parse all relative links with exactly 3 path segments, typical for skills.sh href="/author/repo/skill"
const regex = /href="\/([^/"?#\\]+)\/([^/"?#\\]+)\/([^/"?#\\]+)"/g;
let match;
const skills = [];
const seen = new Set();

while ((match = regex.exec(data)) !== null) {
  const author = match[1];
  const repo = match[2];
  const name = match[3];

  // exclude system paths
  if (author !== '_next' && name !== 'skills.sh') {
    if (!seen.has(name)) {
      skills.push({
        name,
        author,
        repo,
        url: `https://skills.sh/${author}/${repo}/${name}`
      });
      seen.add(name);
    }
  }
}

fs.writeFileSync("skills.json", JSON.stringify(skills, null, 2));
console.log("Saved", skills.length, "skills to skills.json");
