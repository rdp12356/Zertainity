/**
 * Builds Pathways / CareerDetail objects from the live careers catalogue so
 * /pathways always reflects /careers. Merges hand-authored CAREER_DETAILS and
 * extended copy from careerRoleDetails when present.
 */
import {
  Code2,
  HeartPulse,
  Layers,
  Landmark,
  IndianRupee,
  Scale,
  Palette,
  FlaskConical,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import type { CareerCatalogEntry } from "@/data/careersCatalog";
import { COMPREHENSIVE_CAREERS } from "@/data/careersCatalog";
import { CAREER_DETAILS, type CareerDetail } from "@/data/careersData";
import {
  CAREER_SLUG_BY_LIST_NAME,
  getCareerDetailBySlug,
} from "@/data/careerRoleDetails";

const categoryIcons: Record<string, typeof Briefcase> = {
  Technology: Code2,
  Medical: HeartPulse,
  Engineering: Layers,
  Government: Landmark,
  Finance: IndianRupee,
  Banking: Landmark,
  Legal: Scale,
  Law: Scale,
  Design: Palette,
  Science: FlaskConical,
  Healthcare: HeartPulse,
  Education: GraduationCap,
  Media: Briefcase,
  Marketing: Briefcase,
  Hospitality: Briefcase,
  Tourism: Briefcase,
  Aviation: Briefcase,
  Maritime: Briefcase,
  Agriculture: Briefcase,
  Sports: Briefcase,
  Business: Briefcase,
  "Social Sciences": Briefcase,
};

function iconFor(category: string) {
  return categoryIcons[category] ?? Briefcase;
}

function salaryForDemand(d: CareerCatalogEntry["demand"]): CareerDetail["salaryRange"] {
  switch (d) {
    case "Very High":
      return { entry: "₹5L – ₹14L", mid: "₹15L – ₹40L", senior: "₹45L – ₹1Cr+" };
    case "High":
      return { entry: "₹4L – ₹10L", mid: "₹12L – ₹30L", senior: "₹35L – ₹70L+" };
    case "Medium":
      return { entry: "₹3L – ₹8L", mid: "₹8L – ₹20L", senior: "₹22L – ₹45L+" };
    default:
      return { entry: "₹3L – ₹7L", mid: "₹7L – ₹15L", senior: "₹18L – ₹35L+" };
  }
}

function defaultEntrances(c: CareerCatalogEntry): string[] {
  const cat = c.category;
  if (cat === "Technology") return ["JEE Main", "State engineering CET", "CUET-UG (select universities)", "University-specific BTech tests"];
  if (cat === "Medical") return ["NEET-UG", "State medical counselling", "University entrance (where applicable)"];
  if (cat === "Engineering") return ["JEE Main / State CET", "BITSAT / VITEEE (select)", "Direct admission (private institutes)"];
  if (cat === "Government") return ["UPSC CSE / CAPF", "SSC CGL / CHSL", "State PSC / RRB", "Department-specific recruitment"];
  if (cat === "Finance" || cat === "Banking") return ["CA/CMA/CS levels", "CAT/XAT (MBA)", "IBPS / SBI PO", "NISM certifications"];
  if (cat === "Legal" || cat === "Law") return ["CLAT / AILET", "LSAT India", "University law entrance", "State judicial services (later)"];
  if (cat === "Design") return ["NID DAT", "NIFT situation test", "UCEED / NATA (where relevant)", "Portfolio + institute interview"];
  if (cat === "Education") return ["CUET-PG", "State TET / CTET", "NET (for higher academia)", "B.Ed entrance (state)"];
  if (cat === "Healthcare" && !c.name.includes("Doctor")) return ["University UG entrance", "NEET (for some allied courses)", "State board exams for paramedical"];
  if (cat === "Science") return ["IIT JAM", "GATE", "University MSc entrance", "CSIR-UGC NET (for research roles)"];
  if (cat === "Media" || cat === "Marketing") return ["Institute entrance / portfolio review", "CAT for MBA track", "Company campus / off-campus"];
  if (cat === "Hospitality" || cat === "Tourism") return ["NCHM JEE / institute test", "State diploma entrances", "Direct interview (training roles)"];
  if (cat === "Aviation" || cat === "Maritime") return ["IMU CET / DGCA / CPL route", "Company sponsorship exams", "Medical fitness boards"];
  if (cat === "Agriculture") return ["ICAR AIEEA", "State agriculture university tests", "IBPS AFO (for officer roles)"];
  if (cat === "Sports") return ["NIS / university sports quota", "Certification bodies (Yoga, fitness)", "State recruitment"];
  return ["Relevant UG/PG entrance", "Professional body registration", "Campus placement / walk-in"];
}

function defaultColleges(c: CareerCatalogEntry): CareerDetail["topColleges"] {
  const cat = c.category;
  if (cat === "Technology")
    return [
      { name: "IITs / NITs / IIITs", location: "Pan-India", rank: "Engineering & CS" },
      { name: "State technical universities", location: "Regional", rank: "CET-based" },
      { name: "Reputed private universities", location: "Metro cities", rank: "Check placements" },
    ];
  if (cat === "Medical")
    return [
      { name: "AIIMS / INIs / JIPMER", location: "National", rank: "NEET" },
      { name: "State medical colleges", location: "State quotas", rank: "Lower fee" },
      { name: "Private deemed universities", location: "Pan-India", rank: "Verify NMC" },
    ];
  if (cat === "Government")
    return [
      { name: "LBSNAA / training academies", location: "India", rank: "Post-selection" },
      { name: "State administrative academies", location: "State", rank: "PCS" },
      { name: "Your graduating university", location: "Any", rank: "Eligibility only" },
    ];
  return [
    { name: "Central / state universities in your domain", location: "India", rank: "Check accreditation" },
    { name: "Autonomous institutes with strong placement cells", location: "Metro + tier-2", rank: "Visit campus" },
    { name: "Open / distance programmes (if employed)", location: "Online", rank: "Verify recognition" },
  ];
}

function defaultSkills(c: CareerCatalogEntry): string[] {
  if (c.category === "Technology")
    return ["Programming & systems thinking", "Debugging & testing", "Version control", "Security awareness", "Team collaboration"];
  if (c.category === "Medical" || c.category === "Healthcare")
    return ["Clinical / domain reasoning", "Communication", "Evidence-based practice", "Documentation", "Ethics"];
  if (c.category === "Finance" || c.category === "Banking")
    return ["Numeracy & modelling", "Regulatory awareness", "Excel / tools", "Client communication", "Attention to detail"];
  if (c.category === "Government")
    return ["General studies depth", "Answer writing / interview composure", "Constitution & polity", "Integrity", "Stress tolerance"];
  return ["Domain fundamentals", "Stakeholder coordination", "Continuous learning", "Presentation skills", "Digital literacy"];
}

function sixStepRoadmap(c: CareerCatalogEntry, roleSubjects?: string[]): CareerDetail["roadmap"] {
  const subj = roleSubjects?.length
    ? `Typical foundations include ${roleSubjects.slice(0, 4).join(", ")}.`
    : `Align Class 11–12 and undergraduate choices with the "${c.education}" direction shown on Zertainity’s careers list.`;

  return [
    {
      phase: "School",
      title: "Foundation & exploration",
      duration: "Up to Class 10",
      description: `Build strong fundamentals and explore whether ${c.category.toLowerCase()} work fits your interests. Demand for ${c.name} is marked ${c.demand} on Zertainity’s catalogue—use that as a market signal, not a guarantee.`,
      tips: ["Read one professional biography in this field", "Join a school club or online community aligned with the domain"],
    },
    {
      phase: "College",
      title: "Senior secondary stream",
      duration: "Class 11–12",
      description: `${subj} Entrance requirements vary by state board and university—verify the latest brochure.`,
      tips: ["Map subjects to the education path: " + c.education, "Track one national entrance calendar (dates shift yearly)"],
    },
    {
      phase: "Preparation",
      title: "Entrance & selection",
      duration: "12–24 months typical",
      description: `Shortlist exams relevant to ${c.name} in ${c.category}. Combine official notifications with mentor advice; avoid relying on unverified social threads alone.`,
      tips: ["Attempt full-length timed mocks", "Keep a mistake log by topic"],
    },
    {
      phase: "Training",
      title: "Core qualification",
      duration: "Programme length varies",
      description: `Complete the primary pathway: ${c.education}. Add internships, labs, or articleship-style training where the profession expects hands-on hours.`,
      tips: ["Save work samples (where ethical)", "Ask for written feedback every internship"],
    },
    {
      phase: "Graduate",
      title: "First role & licensure",
      duration: "0–3 years",
      description: `Enter as a trainee or junior ${c.name.split("(")[0].trim()} and complete any statutory registration or probation applicable in India.`,
      tips: ["Budget for exam / registration fees", "Join a recognised professional body if applicable"],
    },
    {
      phase: "Career",
      title: "Growth & specialisation",
      duration: "Ongoing",
      description: `Progress toward senior IC or leadership tracks. ${c.demand === "Very High" || c.demand === "High" ? "Competition stays elevated—differentiate with depth in one niche." : "Smaller hiring pools may mean broader roles—combine complementary skills."}`,
      tips: ["Revisit plan every 18 months", "Teach or mentor juniors to solidify expertise"],
    },
  ];
}

function mergeUniqueStrings(a: string[], b: string[]): string[] {
  return [...new Set([...a, ...b])];
}

function generateFromCatalog(c: CareerCatalogEntry): CareerDetail {
  const slug = CAREER_SLUG_BY_LIST_NAME[c.name];
  const deep = slug ? getCareerDetailBySlug(slug) : undefined;

  const overview = deep
    ? `${deep.intro}\n\nZertainity careers listing — Category: ${c.category}. Demand: ${c.demand}. Education path: ${c.education}.`
    : `${c.name} sits in the “${c.category}” cluster on Zertainity’s careers explorer. Listed demand: ${c.demand}. Primary education pathway on the site: ${c.education}. This roadmap is generated from those fields—verify every exam date and eligibility rule with the official 2026–27 notifications.`;

  const entranceExams = deep
    ? mergeUniqueStrings([...deep.keyExams], defaultEntrances(c))
    : defaultEntrances(c);

  const topColleges = deep
    ? [
        ...deep.colleges.map((x) => ({ name: x.name, location: x.context, rank: "See career guide" })),
        ...defaultColleges(c),
      ].filter((v, i, arr) => arr.findIndex((x) => x.name === v.name) === i).slice(0, 6)
    : defaultColleges(c);

  const courses: CareerDetail["courses"] = [
    { name: c.education, duration: "Varies by institute & intake", type: "Professional" },
    { name: `Internship / practical training aligned with ${c.name}`, duration: "3–18 months (typical)", type: "Training" },
    { name: "Continuous professional development (certs / PG)", duration: "Ongoing", type: "Certificate" },
  ];

  return {
    title: c.name,
    category: c.category,
    categoryIcon: iconFor(c.category),
    tagline: `Pathway for ${c.name} — synced with Zertainity careers data.`,
    overview,
    entranceExams,
    courses,
    topColleges,
    salaryRange: salaryForDemand(c.demand),
    skills: defaultSkills(c),
    roadmap: sixStepRoadmap(c, deep?.typicalSubjects),
    proTip: `Cross-check this overview with the live “${c.name}” card on /careers and any in-depth guide linked from there—catalogue fields update together on deploy.`,
  };
}

function enrichManual(manual: CareerDetail, c: CareerCatalogEntry): CareerDetail {
  const slug = CAREER_SLUG_BY_LIST_NAME[c.name];
  const deep = slug ? getCareerDetailBySlug(slug) : undefined;

  const syncFooter = `\n\n— Synced with Zertainity careers catalogue: demand ${c.demand}; education: ${c.education}.`;

  let overview = manual.overview;
  if (deep?.intro && !overview.includes(deep.intro.slice(0, 60))) {
    overview = `${deep.intro}\n\n${overview}`;
  }
  if (!overview.includes("Zertainity careers catalogue")) overview += syncFooter;

  const entranceExams = mergeUniqueStrings(manual.entranceExams, deep?.keyExams ?? []);

  const fromDeep = deep?.colleges.map((x) => ({ name: x.name, location: x.context, rank: "Career guide" })) ?? [];
  const topColleges = [...fromDeep, ...manual.topColleges].filter(
    (v, i, arr) => arr.findIndex((x) => x.name === v.name) === i
  ).slice(0, 8);

  let roadmap = [...manual.roadmap];
  if (roadmap.length < 5) {
    const tail = sixStepRoadmap(c, deep?.typicalSubjects).slice(roadmap.length);
    roadmap = [...roadmap, ...tail].slice(0, 6);
  }

  return {
    ...manual,
    overview,
    entranceExams,
    topColleges,
    roadmap,
    proTip: `${manual.proTip} (Fields for this role also appear on /careers as: ${c.demand} demand, ${c.education}.)`,
  };
}

/** One map keyed exactly like the Pathways sidebar — rebuilt from catalogue each call (cheap; keeps data fresh in dev HMR). */
export function getPathwaysCareerMap(): Record<string, CareerDetail> {
  const map: Record<string, CareerDetail> = {};
  for (const c of COMPREHENSIVE_CAREERS) {
    const manual = CAREER_DETAILS[c.name];
    map[c.name] = manual ? enrichManual(manual, c) : generateFromCatalog(c);
  }
  return map;
}
