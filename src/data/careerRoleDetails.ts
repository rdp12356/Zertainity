/**
 * In-depth career pages only where we have unique copy (avoid thin duplicates).
 * Keys are URL slugs under /careers/:slug
 */

export type CareerRoleDetail = {
  listName: string;
  title: string;
  metaDescription: string;
  intro: string;
  typicalSubjects: string[];
  keyExams: string[];
  colleges: { name: string; context: string }[];
};

export const CAREER_SLUG_BY_LIST_NAME: Record<string, string> = {
  "Software Engineer": "software-engineer",
  "Doctor (MBBS)": "doctor-mbbs",
  "Chartered Accountant (CA)": "chartered-accountant-ca",
  "Civil Services (IAS/IPS/IFS)": "civil-services-ias-ips-ifs",
  "Data Scientist": "data-scientist",
  "AI/ML Engineer": "ai-ml-engineer",
  "Architect": "architect",
  "Investment Banker": "investment-banker",
};

export const CAREER_ROLE_DETAILS: Record<string, CareerRoleDetail> = {
  "software-engineer": {
    listName: "Software Engineer",
    title: "Software Engineer in India: path after 12th",
    metaDescription:
      "How to become a software engineer in India after 12th: streams, entrance exams, degrees, and colleges—plus how to test fit with Zertainity.",
    intro:
      "Software engineers design, build, test, and maintain software used by people and organisations. Common study routes include Computer Science or IT degrees, BCA, and related quantitative programmes; the quality of the curriculum, project experience, and ability to solve problems all matter.",
    typicalSubjects: ["Mathematics", "Physics (for JEE route)", "Computer Science / Informatics Practices", "Logical reasoning & English"],
    keyExams: ["JEE Main / JEE Advanced (for IIT/NIT/IIIT)", "BITSAT", "State engineering CETs (MHT-CET, KCET, WBJEE, etc.)", "MET / university-specific tests"],
    colleges: [
      { name: "IITs / NITs / IIITs", context: "Strong placements; JEE-focused entry." },
      { name: "BITS Pilani / top private universities", context: "Own entrance exams; robust CS cohorts." },
      { name: "State technical universities", context: "Affordable; build portfolio + competitive programming alongside coursework." },
    ],
  },
  "doctor-mbbs": {
    listName: "Doctor (MBBS)",
    title: "Doctor (MBBS) in India: NEET and beyond",
    metaDescription:
      "Path to MBBS in India: PCB after 10th, NEET-UG, counselling, government vs private medical colleges, and next steps after MBBS.",
    intro:
      "Admission to MBBS in India is through NEET-UG and the applicable counselling process under current rules. The course combines academic and clinical training with the prescribed internship; postgraduate specialisation is a separate, competitive stage.",
    typicalSubjects: ["Physics", "Chemistry", "Biology", "English"],
    keyExams: ["NEET-UG", "INI-CET / NEET-PG (for postgraduate; check current admission rules)"],
    colleges: [
      { name: "AIIMS / JIPMER / INIs", context: "National institutes; highly competitive ranks." },
      { name: "State medical colleges", context: "Lower fee than many private colleges; strong clinical exposure varies by hospital tie-ups." },
      { name: "Reputed private deemed universities", context: "Higher fee; verify current NMC recognition, fee details, and bond rules." },
    ],
  },
  "chartered-accountant-ca": {
    listName: "Chartered Accountant (CA)",
    title: "Chartered Accountant (CA): ICAI route in India",
    metaDescription:
      "How the CA course works: Foundation, Intermediate, Articleship, and Final—subjects to focus on and how commerce students typically prepare.",
    intro:
      "The ICAI Chartered Accountancy qualification is a staged professional route involving examinations and prescribed practical training. Under the current New Scheme, students progress through Foundation, Intermediate, practical training, self-paced modules, and Final; check ICAI for the latest sequence and rules.",
    typicalSubjects: ["Accountancy", "Economics", "Business Studies", "Mathematics (optional but helps for Quant)"],
    keyExams: ["CA Foundation", "CA Intermediate (Group I & II)", "CA Final (Group I & II)"],
    colleges: [
      { name: "ICAI-regulated route (not a “campus degree”)", context: "Articleship with a firm is your practical backbone." },
      { name: "B.Com / BBA alongside CA", context: "Common combo for breadth; time management is critical." },
      { name: "Top commerce colleges", context: "Peer environment helps; CA remains exam-driven regardless of college." },
    ],
  },
  "civil-services-ias-ips-ifs": {
    listName: "Civil Services (IAS/IPS/IFS)",
    title: "UPSC Civil Services (IAS/IPS/IFS): realistic overview",
    metaDescription:
      "UPSC CSE stages, optional subjects, and how graduates from science, commerce, and humanities compete—without duplicating coaching marketing hype.",
    intro:
      "The UPSC Civil Services Examination is a multi-stage national competitive examination. Final service allocation depends on examination performance, preferences, vacancies, eligibility, and the applicable rules; there is no single compulsory undergraduate subject.",
    typicalSubjects: ["Polity, History, Geography, Economy (GS foundation)", "Your chosen optional subject", "Essay & ethics case studies"],
    keyExams: ["UPSC CSE (Preliminary + Mains + Personality Test)"],
    colleges: [
      { name: "Any UGC-recognised graduation", context: "Eligibility is graduation; choose a degree you can finish strongly while building GS." },
      { name: "JNU / liberal arts programmes", context: "Optional: strong reading culture helps Mains." },
      { name: "Law / public policy degrees", context: "Useful for some optionals and governance framing—not mandatory." },
    ],
  },
  "data-scientist": {
    listName: "Data Scientist",
    title: "Data Scientist in India: degrees, skills, and hiring reality",
    metaDescription:
      "What hiring managers expect from data science roles in India: statistics, programming, ML basics, and portfolios—plus typical exam routes after 12th.",
    intro:
      "The title “data scientist” covers a wide range of work, from statistical analysis and experimentation to predictive modelling. Strong foundations in mathematics, statistics, programming, and communication are useful; the balance between these skills varies by employer and industry.",
    typicalSubjects: ["Mathematics", "Statistics", "Computer Science", "Econometrics (if economics route)"],
    keyExams: ["JEE / CUET / ISI MSQE entrance (programme-dependent)", "GATE (for some M.Tech analytics programmes)"],
    colleges: [
      { name: "ISI Kolkata / IISc / IITs with strong OR & ML", context: "Quant-heavy pipelines." },
      { name: "Tier-1 private universities with data science majors", context: "Check faculty research and internship MOUs." },
      { name: "Strong state universities + self-driven projects", context: "Cost-effective if you publish clean notebooks and internships." },
    ],
  },
  "ai-ml-engineer": {
    listName: "AI/ML Engineer",
    title: "AI/ML Engineer: how roles differ from generic software jobs",
    metaDescription:
      "AI and ML engineering in India: coursework vs research, M.Tech vs industry, and skills recruiters actually screen for.",
    intro:
      "AI/ML engineers build and maintain software systems that use machine-learning models. The work can include data preparation, model evaluation, deployment, monitoring, and risk management, so computer science and mathematics fundamentals are important alongside model-building tools.",
    typicalSubjects: ["Mathematics", "Computer Science", "Statistics / probability", "Linear algebra (university or online with proofs)"],
    keyExams: ["JEE Advanced (for BTech at IITs)", "GATE CS/DA (for M.Tech research programmes)", "University-specific MSc Data Science entrances"],
    colleges: [
      { name: "IITs / IISc for research-oriented M.Tech and dual degrees", context: "Competitive; strong advisor match matters." },
      { name: "IIIT Hyderabad / Bangalore AI programmes", context: "Industry-linked coursework." },
      { name: "Reputed CS departments + self-built ML portfolio", context: "Viable when coursework includes algorithms and systems." },
    ],
  },
  architect: {
    listName: "Architect",
    title: "Architect (B.Arch) in India: NATA, JEE Paper 2, and practice",
    metaDescription:
      "Becoming a licensed architect: B.Arch eligibility, NATA vs JEE Main Paper 2, COA registration, and what studio culture is like.",
    intro:
      "Architecture combines spatial design, building technology, regulations, and collaboration with clients and other professionals. A common professional route is a five-year B.Arch programme, but eligibility and admission requirements vary; verify current rules and programme approval with the Council of Architecture and the relevant admission authority.",
    typicalSubjects: ["Mathematics", "Drawing / design aptitude", "Physics basics for structures", "English"],
    keyExams: ["NATA", "JEE Main Paper 2 (B.Arch)", "Some states’ own counselling ranks"],
    colleges: [
      { name: "SPA Delhi / Bhopal", context: "Premier government institutes for planning and architecture." },
      { name: "Sir JJ College of Architecture (Mumbai)", context: "Historic programme; competitive in Maharashtra." },
      { name: "Leading private schools of architecture", context: "Verify COA approval, studio faculty, and alumni licensure outcomes." },
    ],
  },
  "investment-banker": {
    listName: "Investment Banker",
    title: "Investment banking in India: typical ladders and degrees",
    metaDescription:
      "How investment banking recruitment works in India: campuses, MBA finance, CA/CFA combinations, and analyst roles—without promising guaranteed outcomes.",
    intro:
      "Investment banking teams advise organisations on capital raising and transactions such as mergers and acquisitions. Entry routes vary by employer and may include degrees in finance, commerce, economics, or other analytical fields, internships, and postgraduate study; no single qualification guarantees a role.",
    typicalSubjects: ["Mathematics", "Economics", "Accountancy", "Business studies / finance electives"],
    keyExams: ["CAT / XAT / SNAP (for MBA)", "CA Intermediate/Final (for some finance tracks)", "CFA exams (often parallel, not a substitute for campus hiring)"],
    colleges: [
      { name: "Top IIMs / ISB (MBA)", context: "Bulk of front-office IB analyst campus hiring historically." },
      { name: "SRCC-type undergraduate commerce + internships", context: "Some boutique banks recruit analytically strong undergrads." },
      { name: "CA articleship in transaction / valuation teams", context: "Pivot with modelling courses and network into IB support roles." },
    ],
  },
};

export function hasCareerRoleDetail(listName: string): boolean {
  const slug = CAREER_SLUG_BY_LIST_NAME[listName];
  return Boolean(slug && CAREER_ROLE_DETAILS[slug]);
}

export function getCareerSlugForListName(listName: string): string | null {
  return CAREER_SLUG_BY_LIST_NAME[listName] ?? null;
}

export function getCareerDetailBySlug(slug: string): CareerRoleDetail | undefined {
  return CAREER_ROLE_DETAILS[slug];
}

export const ALL_CAREER_DETAIL_SLUGS = Object.keys(CAREER_ROLE_DETAILS);
