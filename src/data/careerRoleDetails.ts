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
      "Software engineering remains one of the most flexible high-growth careers in India. Most students enter through a B.Tech in Computer Science or Information Technology, but strong programmers also emerge from BCA, integrated programmes, and reputable bootcamps when paired with internships and open-source work. Success depends less on a single college brand and more on problem-solving, data structures, and shipping real projects.",
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
      "An MBBS is a long, regulated journey: you must clear NEET-UG, complete a 5.5-year programme including internship, then sit for PG entrance if you want specialisation. Demand for qualified doctors stays high, but seats are competitive—plan PCB rigorously from Class 11, practise NCERT-first biology, and use mock tests to stabilise rank.",
    typicalSubjects: ["Physics", "Chemistry", "Biology", "English"],
    keyExams: ["NEET-UG", "AIIMS PG / INI-CET / NEET-PG (for postgraduate)"],
    colleges: [
      { name: "AIIMS / JIPMER / INIs", context: "National institutes; highly competitive ranks." },
      { name: "State medical colleges", context: "Lower fee than many private colleges; strong clinical exposure varies by hospital tie-ups." },
      { name: "Reputed private deemed universities", context: "Higher fee; verify MCI/NMC recognition and bond rules." },
    ],
  },
  "chartered-accountant-ca": {
    listName: "Chartered Accountant (CA)",
    title: "Chartered Accountant (CA): ICAI route in India",
    metaDescription:
      "How the CA course works: Foundation, Intermediate, Articleship, and Final—subjects to focus on and how commerce students typically prepare.",
    intro:
      "The CA qualification from ICAI is rigorous and exam-heavy. Unlike a single four-year degree, you progress through levels with mandatory articleship training under a practising CA. Strong accounting, law, taxation, and audit concepts matter as much as exam technique—answer writing and revision cycles separate clears from attempts.",
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
      "The Civil Services Examination rewards breadth, consistency, and answer-writing discipline over years, not weeks. After clearing Prelims, Mains, and Interview, you are allocated a service based on rank and preferences. There is no single “best” degree—engineers, doctors, lawyers, and literature graduates all feature in merit lists when their preparation strategy fits the exam’s demands.",
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
      "“Data scientist” titles span everything from analytics dashboards to deep learning research. In India, most entry paths combine quantitative undergraduate training (B.Tech CS/Math, B.Stat, Economics honours) with projects that show SQL, Python, and clear problem statements. Kaggle medals alone rarely substitute for business communication and experimental design.",
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
      "AI/ML engineering is not only model training—it includes data pipelines, evaluation, monitoring drift, and responsible deployment. Students often benefit from solid linear algebra and probability before chasing the latest framework. Internships that expose you to real messy datasets beat copying tutorial notebooks.",
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
      "Architecture blends design studio work, building science, and regulations. Entry is through a five-year B.Arch from a COA-approved school, typically via NATA or JEE Main Paper 2 scores used in central/state counselling. Beyond marks, admissions often look at sketching aptitude and a portfolio mindset.",
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
      "Front-office investment banking roles in India are small and selective compared with software hiring. Many analysts come from top MBA finance campuses, some from CA + CFA profiles, and a few from elite undergraduate programmes with off-cycle internships. Networking, financial modelling practice, and stamina for long hours matter alongside grades.",
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
