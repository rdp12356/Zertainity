import { findSkills } from "ai/skills";
import fs from "fs";

const skills = await findSkills({ limit: 100000 });

fs.writeFileSync("skills.json", JSON.stringify(skills, null, 2));

console.log("Saved", skills.length, "skills");