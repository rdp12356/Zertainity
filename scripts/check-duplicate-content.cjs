/**
 * Duplicate Content & Similarity Safety Net
 * Compares intro descriptions pairwise across all career guides in src/data/career_details/*.ts
 * Flags any pair with >70% Jaccard word-shingle similarity and exits with code 1.
 */
const fs = require("fs");
const path = require("path");

const detailsDir = path.join(__dirname, "../src/data/career_details");
const files = fs.readdirSync(detailsDir).filter((f) => f.endsWith(".ts") && f !== "types.ts");

const careers = [];

function tokenize(text) {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3)
  );
}

function jaccardSimilarity(setA, setB) {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = new Set([...setA, ...setB]).size;
  return intersection / union;
}

files.forEach((file) => {
  const content = fs.readFileSync(path.join(detailsDir, file), "utf-8");
  const slugRegex = /"([^"]+)":\s*\{\s*listName:\s*"([^"]+)"[\s\S]*?intro:\s*"([^"]+)"/g;
  let match;
  while ((match = slugRegex.exec(content)) !== null) {
    careers.push({
      slug: match[1],
      listName: match[2],
      intro: match[3],
      tokens: tokenize(match[3]),
      file,
    });
  }
});

console.log(`\n======================================================`);
console.log(`🛡️  RUNNING DUPLICATE CONTENT SAFETY NET AUDIT`);
console.log(`======================================================`);
console.log(`Auditing ${careers.length} career guide intros across ${files.length} domain modules...`);

let violations = 0;
const SIMILARITY_THRESHOLD = 0.70; // 70% threshold

for (let i = 0; i < careers.length; i++) {
  for (let j = i + 1; j < careers.length; j++) {
    const c1 = careers[i];
    const c2 = careers[j];
    const sim = jaccardSimilarity(c1.tokens, c2.tokens);

    if (sim > SIMILARITY_THRESHOLD) {
      violations++;
      console.error(
        `❌ DUPLICATE CONTENT DETECTED: [${c1.slug}] and [${c2.slug}] have ${(sim * 100).toFixed(1)}% similarity!`
      );
      console.error(`   ${c1.slug} (${c1.file}): "${c1.intro.slice(0, 100)}..."`);
      console.error(`   ${c2.slug} (${c2.file}): "${c2.intro.slice(0, 100)}..."`);
    }
  }
}

if (violations > 0) {
  console.error(`\n🚨 SAFETY NET FAILED: Found ${violations} duplicate/overly similar career guide(s).\n`);
  process.exit(1);
} else {
  const pairsChecked = (careers.length * (careers.length - 1)) / 2;
  console.log(`\n✅ SAFETY NET PASSED: ${pairsChecked} pairwise combinations verified. All intros are authentic & unique (<70% similarity).\n`);
  process.exit(0);
}
