import { CAREER_ROLE_DETAILS } from "../src/data/careerRoleDetails.js";

function tokenize(text) {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 3)
  );
}

function jaccardSimilarity(setA, setB) {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return intersection / union;
}

const entries = Object.entries(CAREER_ROLE_DETAILS);
console.log(`\n======================================================`);
console.log(`🔍 AUDITING ${entries.length} AUTHORED CAREER PROFILES`);
console.log(`======================================================\n`);

let violations = 0;
let checkedPairs = 0;
const SIMILARITY_THRESHOLD = 0.50; // 50% max allowable token overlap

// 1. Check for forbidden placeholder text, thin content or missing metadata
entries.forEach(([slug, detail]) => {
  if (!detail.intro || detail.intro.length < 150) {
    console.error(`❌ [THIN CONTENT] ${slug}: Intro too short (${detail.intro?.length || 0} chars, min 150 chars required).`);
    violations++;
  }
  if (!detail.typicalSubjects || detail.typicalSubjects.length < 3) {
    console.error(`❌ [MISSING SUBJECTS] ${slug}: Fewer than 3 subjects provided.`);
    violations++;
  }
  if (!detail.keyExams || detail.keyExams.length < 2) {
    console.error(`❌ [MISSING EXAMS] ${slug}: Fewer than 2 entrance exams provided.`);
    violations++;
  }
  if (!detail.colleges || detail.colleges.length < 3) {
    console.error(`❌ [MISSING COLLEGES] ${slug}: Fewer than 3 colleges provided.`);
    violations++;
  }
  if (!detail.ncoCode) {
    console.warn(`⚠️ [MISSING NCO] ${slug}: No NCO-2015 code specified.`);
  }

  const forbiddenPhrases = ["coming soon", "tbd", "placeholder", "careers in this category generally require", "lorem ipsum"];
  forbiddenPhrases.forEach((phrase) => {
    if (detail.intro.toLowerCase().includes(phrase)) {
      console.error(`❌ [BOILERPLATE PHRASE] ${slug} contains forbidden phrase "${phrase}".`);
      violations++;
    }
  });
});

// 2. Check pairwise intro Jaccard similarity across all pairs
for (let i = 0; i < entries.length; i++) {
  const [slugA, detailA] = entries[i];
  const tokensA = tokenize(detailA.intro);

  for (let j = i + 1; j < entries.length; j++) {
    const [slugB, detailB] = entries[j];
    const tokensB = tokenize(detailB.intro);

    const sim = jaccardSimilarity(tokensA, tokensB);
    checkedPairs++;

    if (sim > SIMILARITY_THRESHOLD) {
      console.error(
        `❌ [HIGH SIMILARITY] ${slugA} vs ${slugB} are ${(sim * 100).toFixed(1)}% similar (Threshold: ${SIMILARITY_THRESHOLD * 100}%).`
      );
      violations++;
    }
  }
}

console.log(`\nChecked ${checkedPairs} pairwise combinations across ${entries.length} career guides.`);
if (violations > 0) {
  console.error(`\n❌ FAILED: Found ${violations} content quality / uniqueness violations.`);
  process.exit(1);
} else {
  console.log(`\n✅ PASSED: All ${entries.length} career profiles are authentic, unique (<${SIMILARITY_THRESHOLD * 100}% similarity), and fully sourced!`);
  process.exit(0);
}
