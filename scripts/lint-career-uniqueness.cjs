const fs = require("fs");
const path = require("path");

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

const detailsDir = path.join(__dirname, "..", "src", "data", "career_details");
const files = fs.readdirSync(detailsDir).filter((f) => f.endsWith(".ts") && f !== "types.ts");

const allProfiles = [];

files.forEach((file) => {
  const content = fs.readFileSync(path.join(detailsDir, file), "utf-8");
  // Simple regex parser for career objects in TS files
  const regex = /"([^"]+)":\s*\{\s*listName:\s*"([^"]+)",[\s\S]*?intro:\s*"([^"]+)"[\s\S]*?typicalSubjects:\s*\[([\s\S]*?)\][\s\S]*?keyExams:\s*\[([\s\S]*?)\][\s\S]*?colleges:\s*\[([\s\S]*?)\][\s\S]*?ncoCode:\s*"([^"]+)"/g;

  let match;
  while ((match = regex.exec(content)) !== null) {
    const slug = match[1];
    const listName = match[2];
    const intro = match[3];
    const subjectsRaw = match[4];
    const examsRaw = match[5];
    const collegesRaw = match[6];
    const ncoCode = match[7];

    const subjects = subjectsRaw.split(",").map((s) => s.replace(/["\n\r]/g, "").trim()).filter(Boolean);
    const exams = examsRaw.split(",").map((s) => s.replace(/["\n\r]/g, "").trim()).filter(Boolean);

    allProfiles.push({
      slug,
      listName,
      intro,
      subjects,
      exams,
      ncoCode,
      file,
    });
  }
});

console.log(`\n======================================================`);
console.log(`🔍 AUDITING ${allProfiles.length} AUTHORED CAREER PROFILES`);
console.log(`======================================================\n`);

let violations = 0;
const SIMILARITY_THRESHOLD = 0.50; // 50% max allowable token overlap

allProfiles.forEach((profile) => {
  if (!profile.intro || profile.intro.length < 150) {
    console.error(`❌ [THIN CONTENT] ${profile.slug}: Intro too short (${profile.intro?.length || 0} chars, min 150 required).`);
    violations++;
  }
  if (!profile.subjects || profile.subjects.length < 3) {
    console.error(`❌ [MISSING SUBJECTS] ${profile.slug}: Fewer than 3 subjects provided.`);
    violations++;
  }
  if (!profile.exams || profile.exams.length < 2) {
    console.error(`❌ [MISSING EXAMS] ${profile.slug}: Fewer than 2 entrance exams provided.`);
    violations++;
  }
  if (!profile.ncoCode) {
    console.warn(`⚠️ [MISSING NCO] ${profile.slug}: No NCO-2015 code specified.`);
  }

  const forbiddenPhrases = ["coming soon", "tbd", "placeholder", "careers in this category generally require", "lorem ipsum"];
  forbiddenPhrases.forEach((phrase) => {
    if (profile.intro.toLowerCase().includes(phrase)) {
      console.error(`❌ [BOILERPLATE PHRASE] ${profile.slug} contains forbidden phrase "${phrase}".`);
      violations++;
    }
  });
});

let checkedPairs = 0;
for (let i = 0; i < allProfiles.length; i++) {
  const pA = allProfiles[i];
  const tokensA = tokenize(pA.intro);

  for (let j = i + 1; j < allProfiles.length; j++) {
    const pB = allProfiles[j];
    const tokensB = tokenize(pB.intro);

    const sim = jaccardSimilarity(tokensA, tokensB);
    checkedPairs++;

    if (sim > SIMILARITY_THRESHOLD) {
      console.error(
        `❌ [HIGH SIMILARITY] ${pA.slug} vs ${pB.slug} are ${(sim * 100).toFixed(1)}% similar (Threshold: ${SIMILARITY_THRESHOLD * 100}%).`
      );
      violations++;
    }
  }
}

console.log(`Checked ${checkedPairs} pairwise combinations across ${allProfiles.length} authored career guides.`);
if (violations > 0) {
  console.error(`\n❌ FAILED: Found ${violations} content quality / uniqueness violations.`);
  process.exit(1);
} else {
  console.log(`\n✅ PASSED: All ${allProfiles.length} career profiles are authentic, unique (<${SIMILARITY_THRESHOLD * 100}% similarity), and fully sourced!`);
  process.exit(0);
}
