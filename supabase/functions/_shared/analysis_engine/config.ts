import type { AnalysisConfig, CareerProfile, CollegeProfile } from "./types.ts";
import { COMPREHENSIVE_CAREERS } from "./careersCatalog_stub.ts";
import { CAREER_DETAILS } from "./careersData_stub.ts";

export const SUBJECT_ALIASES: Record<string, string[]> = {
  // Mathematics
  "Mathematics": ["Mathematics", "Maths", "Math", "Mathematics (Standard)", "Mathematics (Basic)", "Applied Mathematics", "Standard Mathematics", "Basic Mathematics"],

  // Science & Life Sciences
  "Science": ["Science", "General Science", "Natural Science"],
  "Physics": ["Physics"],
  "Chemistry": ["Chemistry"],
  "Biology": ["Biology", "Life Sciences", "Botany", "Zoology"],
  "Biotechnology": ["Biotechnology"],

  // Computing & Tech
  "Computer Science": ["Computer Science", "Information Technology", "Informatics Practices", "Computer Applications", "Artificial Intelligence", "IT", "CS", "IP"],

  // Commerce & Business
  "Accountancy": ["Accountancy", "Accounts", "Bookkeeping"],
  "Business Studies": ["Business Studies", "Commerce", "Business Management", "Entrepreneurship", "BST"],
  "Economics": ["Economics", "Eco"],

  // Humanities & Social Sciences
  "Social Science": ["Social Science", "Social Studies", "SST"],
  "History": ["History", "World History", "Indian History"],
  "Political Science": ["Political Science", "Civics", "Pol Science", "Pol Sci"],
  "Geography": ["Geography", "Geo"],
  "Sociology": ["Sociology"],
  "Psychology": ["Psychology", "Psych"],
  "Legal Studies": ["Legal Studies", "Law"],

  // Languages & Communication
  "English": ["English", "English Core", "English Elective", "English Literature", "General English"],
  "Hindi": ["Hindi", "Hindi Core", "Hindi Elective"],
  "Sanskrit": ["Sanskrit"],

  // Creative & Others
  "Art & Craft": ["Art & Craft", "Fine Arts", "Painting", "Commercial Art", "Visual Arts", "Art"],
  "Physical Education": ["Physical Education", "PE", "Sports"],
  "Music": ["Music"],
  "Dance": ["Dance"],
};

export const SUBJECT_CATEGORY_MAP: Record<string, string[]> = {
  "STEM & Tech": ["Mathematics", "Physics", "Chemistry", "Computer Science", "Information Technology", "Artificial Intelligence"],
  "Life Sciences & Health": ["Biology", "Biotechnology", "Chemistry"],
  "Commerce & Finance": ["Accountancy", "Business Studies", "Economics", "Entrepreneurship"],
  "Humanities & Law": ["History", "Political Science", "Geography", "Sociology", "Psychology", "Legal Studies"],
  "Languages": ["English", "Hindi", "Sanskrit"],
  "Creative & Applied": ["Art", "Music", "Dance", "Physical Education"],
};

export const DOMAIN_KEYWORDS: Array<[string, string[]]> = [
  ["Technology", ["coding", "programming", "software", "ai", "web", "app", "computer", "algorithm", "tech", "hardware", "cyber"]],
  ["Problem Solving", ["logic", "puzzle", "reasoning", "analytical", "solve", "math", "calculus", "derive", "patterns"]],
  ["Science", ["physics", "chemistry", "experiment", "lab", "hypothesis", "research", "atoms", "mechanics", "astronomy"]],
  ["Healthcare", ["biology", "medicine", "doctor", "health", "anatomy", "patient", "clinical", "genetics", "hospital", "pharma"]],
  ["Business", ["management", "marketing", "strategy", "startup", "company", "entrepreneur", "operations", "leadership", "sales"]],
  ["Finance", ["accounts", "banking", "tax", "audit", "invest", "stocks", "economy", "money", "capital", "ledger", "balance"]],
  ["Writing", ["essay", "literature", "writing", "author", "editor", "journalism", "creative writing", "poetry", "content"]],
  ["Communication", ["speaking", "presentation", "debate", "public relations", "languages", "oratory", "negotiation"]],
  ["Art & Creativity", ["design", "ui", "ux", "drawing", "painting", "visual", "creative", "illustration", "fashion", "animation"]],
  ["Design & Building", ["architecture", "cad", "civil", "mechanical", "drafting", "building", "robotics", "prototyping"]],
  ["Helping Others", ["counseling", "psychology", "teaching", "social work", "ngo", "therapy", "mentoring", "community"]],
  ["Leadership", ["politics", "governance", "officer", "ias", "ips", "upsc", "administration", "leading", "delegation"]],
  ["Current Affairs", ["geopolitics", "news", "international", "history", "constitution", "governance", "public policy"]],
  ["Law & Order", ["law", "justice", "legal", "court", "judge", "constitution", "corporate law", "crime", "defense"]],
  ["Physical Fitness", ["sports", "athletics", "training", "fitness", "army", "navy", "defense", "exercise", "drill"]],
];

export const RIASEC_MAP: Record<string, Array<"R" | "I" | "A" | "S" | "E" | "C">> = {
  "Technology": ["R", "I"],
  "Problem Solving": ["I", "R"],
  "Science": ["I"],
  "Healthcare": ["I", "S"],
  "Business": ["E"],
  "Finance": ["C", "E"],
  "Writing": ["A", "S"],
  "Communication": ["E", "S"],
  "Art & Creativity": ["A"],
  "Design & Building": ["R", "A"],
  "Helping Others": ["S"],
  "Leadership": ["E"],
  "Current Affairs": ["I", "S"],
  "Law & Order": ["C", "E", "I"],
  "Physical Fitness": ["R"],
};

export const RIASEC_FULL_NAMES: Record<"R" | "I" | "A" | "S" | "E" | "C", string> = {
  R: "Realistic (Hands-on & Practical)",
  I: "Investigative (Analytical & Scientific)",
  A: "Artistic (Creative & Expressive)",
  S: "Social (Helping & Communicating)",
  E: "Enterprising (Leading & Influencing)",
  C: "Conventional (Organised & Detail-oriented)",
};

const DEFAULT_CAREER_RULES: Record<string, Partial<CareerProfile>> = {
  "Software Engineer": {
    subject_weights: { Mathematics: 0.35, "Computer Science": 0.40, Physics: 0.15, English: 0.10 },
    interest_categories: ["Technology", "Problem Solving", "Mathematics"],
    required_skills: ["Analytical Thinking", "Data Structures & Algorithms", "Logical Reasoning"],
    riasec_themes: ["R", "I", "C"],
    required_subjects: ["Mathematics"],
    courses: ["B.Tech Computer Science", "BCA", "B.Sc Computer Science", "M.Tech CSE", "MCA"],
    top_colleges: ["IIT Madras", "IIT Delhi", "BITS Pilani", "IIIT Hyderabad", "NIT Trichy"],
    suggested_subjects: ["Mathematics", "Physics", "Computer Science", "English"],
    official_pathways: ["B.Tech CSE via JEE Main / State CETs", "BCA / B.Sc CS via University Entrance"],
    source_basis: ["AICTE Engineering Framework", "CBSE Senior Secondary CS Curriculum"],
    next_steps: ["Build projects in Python/JavaScript on GitHub", "Master Data Structures & Algorithms", "Target JEE Main or BCA admissions"],
    description: "Design, build, and maintain scalable software architectures, algorithms, and applications powering modern digital platforms."
  },
  "Data Scientist": {
    subject_weights: { Mathematics: 0.40, "Computer Science": 0.25, Economics: 0.20, English: 0.15 },
    interest_categories: ["Technology", "Science", "Problem Solving", "Finance"],
    required_skills: ["Statistical Modeling", "Python / R", "Data Interpretation", "Quantitative Reasoning"],
    riasec_themes: ["I", "C", "R"],
    required_subjects: ["Mathematics"],
    courses: ["B.Tech Data Science & AI", "B.Sc Statistics", "B.Sc Data Science", "M.Sc Data Science"],
    top_colleges: ["ISI Kolkata", "IIT Kharagpur", "IIT Bombay", "CMI Chennai", "IISc Bangalore"],
    suggested_subjects: ["Mathematics", "Computer Science", "Statistics", "English"],
    official_pathways: ["B.Tech / B.Sc in Data Science or Statistics via IIT JAM / JEE / CUET"],
    source_basis: ["NASSCOM Futureskills Prime", "UGC Data Science Curriculum"],
    next_steps: ["Learn Python with Pandas and NumPy", "Study probability and linear algebra", "Analyze Kaggle datasets"],
    description: "Extract actionable insights, predictive models, and pattern intelligence from massive datasets using advanced mathematical techniques."
  },
  "AI/ML Engineer": {
    subject_weights: { Mathematics: 0.45, "Computer Science": 0.30, Physics: 0.15, English: 0.10 },
    interest_categories: ["Technology", "Science", "Problem Solving"],
    required_skills: ["Linear Algebra", "Calculus", "Machine Learning Algorithms", "Neural Networks"],
    riasec_themes: ["I", "R", "C"],
    required_subjects: ["Mathematics"],
    courses: ["B.Tech AI & Data Science", "B.Tech Computer Science", "M.Tech AI/ML"],
    top_colleges: ["IIT Hyderabad", "IIT Bombay", "IIIT Hyderabad", "IIT Delhi", "IISc Bangalore"],
    suggested_subjects: ["Mathematics", "Physics", "Computer Science"],
    official_pathways: ["B.Tech in CSE / AI specialization via JEE Main & Advanced"],
    source_basis: ["NTA Engineering Admissions", "MeitY National AI Framework"],
    next_steps: ["Master calculus, matrix operations, and statistics", "Train neural networks with PyTorch/TensorFlow", "Participate in AI hackathons"],
    description: "Architect and deploy artificial intelligence models, deep neural networks, and generative AI systems."
  },
  "UI/UX Designer": {
    subject_weights: { Art: 0.35, "Computer Science": 0.25, English: 0.25, Psychology: 0.15 },
    interest_categories: ["Art & Creativity", "Technology", "Communication"],
    required_skills: ["User Empathy", "Wireframing & Prototyping", "Visual Hierarchy", "Figma / Adobe XD"],
    riasec_themes: ["A", "I", "E"],
    required_subjects: [],
    courses: ["B.Des (Bachelor of Design)", "B.Sc UI/UX Design", "M.Des Interaction Design"],
    top_colleges: ["NID Ahmedabad", "IDC IIT Bombay", "Srishti Institute Bangalore", "MIT Institute of Design Pune"],
    suggested_subjects: ["Art & Craft", "English", "Computer Science", "Psychology"],
    official_pathways: ["B.Des through UCEED / NID DAT / SEED"],
    source_basis: ["NID Design Guidelines", "IIT Industrial Design Center Framework"],
    next_steps: ["Build interactive mockups on Figma", "Study UX design heuristics and usability testing", "Build a visual portfolio on Behance"],
    description: "Design intuitive user interfaces, visual design systems, and seamless digital product experiences."
  },
  "Doctor (MBBS)": {
    subject_weights: { Biology: 0.45, Chemistry: 0.30, Physics: 0.15, English: 0.10 },
    interest_categories: ["Healthcare", "Science", "Helping Others"],
    required_skills: ["Clinical Diagnosis", "Biological Memorisation", "Patient Empathy", "Stress Management"],
    riasec_themes: ["I", "S", "R"],
    required_subjects: ["Biology", "Physics", "Chemistry"],
    courses: ["MBBS", "MD / MS (Post Graduation)"],
    top_colleges: ["AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry", "KMC Manipal", "King George Medical University"],
    suggested_subjects: ["Biology", "Chemistry", "Physics", "English"],
    official_pathways: ["MBBS admission via NEET-UG followed by state/national counselling"],
    source_basis: ["National Medical Commission (NMC)", "NTA NEET-UG"],
    next_steps: ["Master NCERT Biology, Chemistry & Physics", "Solve previous 10 years NEET questions", "Focus on conceptual clarity in Human Physiology"],
    description: "Diagnose, treat, and care for human illnesses and medical conditions through evidence-based healthcare."
  },
  "Chartered Accountant (CA)": {
    subject_weights: { Accountancy: 0.40, Mathematics: 0.25, Economics: 0.20, "Business Studies": 0.15 },
    interest_categories: ["Finance", "Business", "Law & Order"],
    required_skills: ["Auditing", "Financial Reporting", "Taxation Analysis", "Numerical Accuracy"],
    riasec_themes: ["C", "E"],
    required_subjects: [],
    courses: ["CA Course (Foundation, Intermediate, Final)", "B.Com (Hons)", "B.Com Professional"],
    top_colleges: ["ICAI (Self-Study/Articleship)", "SRCC Delhi", "St. Xavier's Kolkata", "Loyola Chennai"],
    suggested_subjects: ["Accountancy", "Mathematics", "Economics", "Business Studies"],
    official_pathways: ["ICAI CA Foundation after 12th or Direct Entry route after Graduation"],
    source_basis: ["Institute of Chartered Accountants of India (ICAI)", "Companies Act Framework"],
    next_steps: ["Register for ICAI Foundation after Class 12", "Master Double-Entry Bookkeeping and Corporate Law", "Build strong Excel financial modeling skills"],
    description: "Provide expert auditing, financial management, corporate taxation, and regulatory compliance advisory."
  },
  "Investment Banker": {
    subject_weights: { Economics: 0.35, Mathematics: 0.30, Accountancy: 0.20, English: 0.15 },
    interest_categories: ["Finance", "Business", "Leadership"],
    required_skills: ["Financial Valuation", "M&A Advisory", "Excel Financial Modeling", "High-Stakes Negotiation"],
    riasec_themes: ["E", "C", "I"],
    required_subjects: ["Mathematics"],
    courses: ["BBA Finance", "B.Com (Hons)", "MBA Finance / CFA"],
    top_colleges: ["IIM Ahmedabad", "IIM Bangalore", "IIM Calcutta", "SRCC Delhi", "ISB Hyderabad"],
    suggested_subjects: ["Mathematics", "Economics", "Accountancy", "Business Studies"],
    official_pathways: ["Top-tier Undergrad + MBA Finance via CAT / GMAT or CFA Charter"],
    source_basis: ["SEBI & Global Investment Banking Standards", "CFA Institute Body of Knowledge"],
    next_steps: ["Study financial statements, discounted cash flow (DCF), and equity valuation", "Prepare for CAT / GMAT", "Pursue CFA Level 1"],
    description: "Advise corporations and governments on capital raising, mergers & acquisitions, and financial restructurings."
  },
  "Mechanical Engineer": {
    subject_weights: { Mathematics: 0.40, Physics: 0.40, Chemistry: 0.10, English: 0.10 },
    interest_categories: ["Design & Building", "Problem Solving", "Science"],
    required_skills: ["Thermodynamics", "CAD/CAM Modeling", "Fluid Dynamics", "Structural Analysis"],
    riasec_themes: ["R", "I"],
    required_subjects: ["Mathematics", "Physics"],
    courses: ["B.Tech Mechanical Engineering", "M.Tech Robotics / Thermal Engineering"],
    top_colleges: ["IIT Bombay", "IIT Madras", "IIT Kharagpur", "BITS Pilani", "NIT Surathkal"],
    suggested_subjects: ["Physics", "Mathematics", "Chemistry", "English"],
    official_pathways: ["B.Tech Mechanical via JEE Main / JEE Advanced / State CETs"],
    source_basis: ["AICTE Engineering Standards", "NTA JEE Framework"],
    next_steps: ["Master mechanics, kinematics, and thermodynamics", "Learn AutoCAD or SolidWorks", "Prepare for JEE Main"],
    description: "Design, develop, and manufacture mechanical systems, robotics, engines, and thermodynamic equipment."
  },
  "Civil Services (IAS/IPS/IFS)": {
    subject_weights: { "Political Science": 0.30, History: 0.25, Economics: 0.20, Geography: 0.15, English: 0.10 },
    interest_categories: ["Leadership", "Current Affairs", "Law & Order", "Helping Others"],
    required_skills: ["Public Policy Analysis", "Administrative Leadership", "Critical Reasoning", "Essay & Answer Writing"],
    riasec_themes: ["E", "S", "I"],
    required_subjects: [],
    courses: ["Any Graduation Degree (BA / B.Sc / B.Tech / B.Com) + UPSC CSE Preparation"],
    top_colleges: ["Delhi University", "JNU New Delhi", "St. Stephen's College", "Presidency College"],
    suggested_subjects: ["Political Science", "History", "Economics", "Geography", "English"],
    official_pathways: ["UPSC Civil Services Examination (Prelims, Mains, Interview) after Graduation"],
    source_basis: ["Union Public Service Commission (UPSC)", "DoPT Government of India"],
    next_steps: ["Develop daily habit of reading national newspapers (The Hindu/Indian Express)", "Master NCERT Social Sciences Class 6-12", "Practice analytical writing"],
    description: "Govern, administer, and execute public policies, district governance, and foreign relations for the nation."
  },
  "Corporate Lawyer": {
    subject_weights: { "Legal Studies": 0.35, English: 0.30, "Political Science": 0.20, Economics: 0.15 },
    interest_categories: ["Law & Order", "Communication", "Business"],
    required_skills: ["Contract Drafting", "Legal Research", "Arbitration & Negotiation", "Statutory Interpretation"],
    riasec_themes: ["E", "C", "I"],
    required_subjects: [],
    courses: ["BA LLB (5-Year Integrated)", "BBA LLB (5-Year Integrated)", "LLM (Corporate Law)"],
    top_colleges: ["NLSIU Bangalore", "NALSAR Hyderabad", "WBNUJS Kolkata", "NLU Delhi", "Symbiosis Law Pune"],
    suggested_subjects: ["Legal Studies", "English", "Political Science", "Economics"],
    official_pathways: ["5-Year Integrated Law via CLAT / AILET after Class 12"],
    source_basis: ["Bar Council of India (BCI)", "Consortium of National Law Universities"],
    next_steps: ["Prepare for CLAT (Legal Reasoning, Logical Reasoning, English Comprehension)", "Participate in debates and moot courts", "Read landmark legal judgments"],
    description: "Advise businesses on commercial contracts, corporate compliance, mergers, governance, and intellectual property."
  },
  "Psychologist / Therapist": {
    subject_weights: { Psychology: 0.45, Biology: 0.25, English: 0.20, Sociology: 0.10 },
    interest_categories: ["Helping Others", "Healthcare", "Communication"],
    required_skills: ["Active Listening", "Cognitive Behavioral Therapy (CBT)", "Behavioral Assessment", "Empathy"],
    riasec_themes: ["S", "I", "A"],
    required_subjects: [],
    courses: ["BA / B.Sc Psychology", "MA / M.Sc Clinical Psychology", "M.Phil / Psy.D Clinical Psychology (RCI)"],
    top_colleges: ["NIMHANS Bangalore", "Delhi University (LSR/Daulat Ram)", "TISS Mumbai", "Christ University Bangalore"],
    suggested_subjects: ["Psychology", "Biology", "English", "Sociology"],
    official_pathways: ["B.A/B.Sc Psychology -> M.Sc Clinical Psychology -> RCI Certification / M.Phil"],
    source_basis: ["Rehabilitation Council of India (RCI)", "American Psychological Association (APA)"],
    next_steps: ["Study foundational human psychology and neuroscience", "Volunteer in community mental health initiatives", "Target CUET for top psychology departments"],
    description: "Evaluate, diagnose, and provide therapeutic treatment for cognitive, emotional, and behavioral mental health concerns."
  },
  "Commercial Pilot": {
    subject_weights: { Physics: 0.45, Mathematics: 0.45, English: 0.10 },
    interest_categories: ["Technology", "Physical Fitness", "Science"],
    required_skills: ["Spatial Awareness", "Instrument Flight Rules (IFR)", "Multi-Crew Coordination", "Quick Decision Making"],
    riasec_themes: ["R", "E"],
    required_subjects: ["Physics", "Mathematics"],
    courses: ["Commercial Pilot License (CPL) Flight Training", "B.Sc Aviation"],
    top_colleges: ["IGRUA Rae Bareli", "National Flying Training Institute (NFTI) Gondia", "CAE Gondia", "Chimes Aviation Academy"],
    suggested_subjects: ["Physics", "Mathematics", "English"],
    official_pathways: ["DGCA Class 1 Medical -> CPL Flying School (200 Flight Hours) -> Airline Type Rating"],
    source_basis: ["Directorate General of Civil Aviation (DGCA)", "ICAO Standards"],
    next_steps: ["Clear DGCA Class 2 & Class 1 Medical examinations", "Prepare for DGCA Theory Exams (Air Navigation, Meteorology, Air Regs)", "Join an accredited Flying Training Organisation (FTO)"],
    description: "Navigate, command, and operate multi-engine passenger aircraft across domestic and international flight corridors."
  },
  "Architect": {
    subject_weights: { Mathematics: 0.35, Art: 0.35, Physics: 0.20, English: 0.10 },
    interest_categories: ["Design & Building", "Art & Creativity", "Problem Solving"],
    required_skills: ["Architectural Drafting", "Spatial Design", "3D Building Modeling (BIM)", "Structural Aesthetics"],
    riasec_themes: ["A", "R", "I"],
    required_subjects: ["Mathematics", "Physics"],
    courses: ["B.Arch (Bachelor of Architecture)", "M.Arch"],
    top_colleges: ["IIT Roorkee", "IIT Kharagpur", "SPA New Delhi", "CEPT University Ahmedabad", "NIT Calicut"],
    suggested_subjects: ["Mathematics", "Physics", "Art & Craft"],
    official_pathways: ["B.Arch admission via NATA (National Aptitude Test in Architecture) or JEE Main Paper 2"],
    source_basis: ["Council of Architecture (CoA)", "NTA JEE Architecture"],
    next_steps: ["Practice freehand sketching and 3D geometric visualization", "Prepare for NATA and JEE Main Paper 2", "Explore CAD and architectural history"],
    description: "Design aesthetically pleasing, structurally sound, and sustainable building environments and urban landscapes."
  }
};

/**
 * Builds the complete list of Career Profiles from canonical catalog + detail overrides
 */
export function buildCareerProfiles(): CareerProfile[] {
  return COMPREHENSIVE_CAREERS.map((entry) => {
    const custom = DEFAULT_CAREER_RULES[entry.name] || {};
    const detail = CAREER_DETAILS[entry.name];

    const categoryWeights: Record<string, Record<string, number>> = {
      Technology: { "Computer Science": 0.40, Mathematics: 0.35, Physics: 0.15, English: 0.10 },
      Engineering: { Mathematics: 0.40, Physics: 0.35, Chemistry: 0.15, English: 0.10 },
      Medical: { Biology: 0.45, Chemistry: 0.30, Physics: 0.15, English: 0.10 },
      Healthcare: { Biology: 0.35, Psychology: 0.30, Chemistry: 0.20, English: 0.15 },
      Finance: { Accountancy: 0.35, Mathematics: 0.25, Economics: 0.25, "Business Studies": 0.15 },
      Banking: { Economics: 0.35, Mathematics: 0.30, Accountancy: 0.20, English: 0.15 },
      Business: { "Business Studies": 0.35, Economics: 0.25, English: 0.20, Mathematics: 0.20 },
      Government: { "Political Science": 0.30, History: 0.25, Economics: 0.25, English: 0.20 },
      Legal: { "Legal Studies": 0.40, English: 0.30, "Political Science": 0.20, Economics: 0.10 },
      Design: { Art: 0.45, English: 0.25, "Computer Science": 0.15, Mathematics: 0.15 },
      Education: { English: 0.35, History: 0.25, "Political Science": 0.20, Psychology: 0.20 },
      Science: { Physics: 0.35, Chemistry: 0.35, Mathematics: 0.20, English: 0.10 },
    };

    const fallbackWeights = categoryWeights[entry.category] || { English: 0.40, Mathematics: 0.30, "Social Science": 0.30 };
    const defaultInterest = [entry.category, "Problem Solving"];
    const riasec = custom.riasec_themes || (
      entry.category === "Technology" ? ["R", "I", "C"] :
      entry.category === "Engineering" ? ["R", "I"] :
      entry.category === "Medical" || entry.category === "Healthcare" ? ["I", "S"] :
      entry.category === "Finance" || entry.category === "Banking" ? ["C", "E"] :
      entry.category === "Business" ? ["E", "S"] :
      entry.category === "Legal" ? ["E", "C", "I"] :
      entry.category === "Design" ? ["A", "R"] :
      entry.category === "Government" ? ["E", "S"] : ["I", "S"]
    );

    return {
      id: entry.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: entry.name,
      category: entry.category,
      demand: entry.demand,
      education: entry.education,
      required_subjects: custom.required_subjects || (
        entry.category === "Medical" ? ["Biology", "Physics", "Chemistry"] :
        entry.category === "Engineering" ? ["Mathematics", "Physics"] : []
      ),
      subject_weights: custom.subject_weights || fallbackWeights,
      required_skills: custom.required_skills || detail?.skills || ["Critical Thinking", "Communication", "Domain Knowledge"],
      interest_categories: custom.interest_categories || defaultInterest,
      riasec_themes: riasec,
      courses: custom.courses || detail?.courses?.map(c => c.name) || [entry.education],
      top_colleges: custom.top_colleges || detail?.topColleges?.map(c => c.name) || ["Leading National Universities", "State Technical / Medical Institutes"],
      suggested_subjects: custom.suggested_subjects || Object.keys(custom.subject_weights || fallbackWeights),
      official_pathways: custom.official_pathways || (detail ? [detail.overview] : ["Undergraduate degree in discipline followed by entrance/placement"]),
      source_basis: custom.source_basis || ["National Education Policy (NEP) 2020", "AICTE / UGC Higher Education Catalog"],
      next_steps: custom.next_steps || ["Research degree prerequisites", "Prepare for targeted entrance tests", "Build foundational subject mastery"],
      description: custom.description || detail?.overview || `Professional career pathway in ${entry.category} focusing on ${entry.name}.`
    };
  });
}

export const VERIFIED_COLLEGES: CollegeProfile[] = [
  { id: "iit-m", name: "IIT Madras", location: "Chennai, Tamil Nadu", courses: ["B.Tech Computer Science", "B.Tech Mechanical Engineering", "B.Tech Electrical Engineering", "M.Tech Data Science"], rating: 4.9, rank: "NIRF #1 (Engineering)", website: "https://www.iitm.ac.in" },
  { id: "iit-d", name: "IIT Delhi", location: "New Delhi", courses: ["B.Tech Computer Science", "B.Tech AI & Data Science", "B.Tech Mechanical Engineering"], rating: 4.9, rank: "NIRF #2 (Engineering)", website: "https://home.iitd.ac.in" },
  { id: "iit-b", name: "IIT Bombay", location: "Mumbai, Maharashtra", courses: ["B.Tech Computer Science", "B.Tech Mechanical Engineering", "B.Des Design", "M.Des Interaction Design"], rating: 4.9, rank: "NIRF #3 (Engineering)", website: "https://www.iitb.ac.in" },
  { id: "bits-p", name: "BITS Pilani", location: "Pilani, Rajasthan", courses: ["B.E. Computer Science", "B.E. Electronics", "B.E. Mechanical Engineering"], rating: 4.7, rank: "Top Private Engineering", website: "https://www.bits-pilani.ac.in" },
  { id: "iiit-h", name: "IIIT Hyderabad", location: "Hyderabad, Telangana", courses: ["B.Tech CSE", "B.Tech AI & Data Science", "Dual Degree CS + Research"], rating: 4.8, rank: "Top CS & AI Research", website: "https://www.iiit.ac.in" },
  { id: "aiims-d", name: "AIIMS New Delhi", location: "New Delhi", courses: ["MBBS", "MD / MS Specialisations", "B.Sc Nursing"], rating: 5.0, rank: "NIRF #1 (Medical)", website: "https://www.aiims.edu" },
  { id: "cmc-v", name: "CMC Vellore", location: "Vellore, Tamil Nadu", courses: ["MBBS", "B.Sc Nursing", "Allied Health Sciences"], rating: 4.8, rank: "NIRF #3 (Medical)", website: "https://www.cmch-vellore.edu" },
  { id: "srcc-d", name: "SRCC (Shri Ram College of Commerce)", location: "New Delhi", courses: ["B.Com (Hons)", "BA (Hons) Economics", "PGD Global Business Operations"], rating: 4.9, rank: "NIRF #1 (Commerce)", website: "https://www.srcc.edu" },
  { id: "iim-a", name: "IIM Ahmedabad", location: "Ahmedabad, Gujarat", courses: ["MBA / PGP Management", "MBA Food & Agribusiness", "PhD Management"], rating: 5.0, rank: "NIRF #1 (Management)", website: "https://www.iima.ac.in" },
  { id: "nlsiu-b", name: "NLSIU Bangalore", location: "Bengaluru, Karnataka", courses: ["BA LLB (Hons)", "LLM Corporate Law", "MPP Public Policy"], rating: 4.9, rank: "NIRF #1 (Law)", website: "https://www.nls.ac.in" },
  { id: "nid-a", name: "NID Ahmedabad", location: "Ahmedabad, Gujarat", courses: ["B.Des Product Design", "B.Des Graphic Design", "B.Des Animation"], rating: 4.9, rank: "National Premier Design", website: "https://www.nid.edu" },
  { id: "nimhans-b", name: "NIMHANS Bangalore", location: "Bengaluru, Karnataka", courses: ["M.Sc Clinical Psychology", "M.Phil Clinical Psychology", "MD Psychiatry"], rating: 4.9, rank: "Apex Mental Health Institute", website: "https://nimhans.ac.in" }
];

export const DEFAULT_ANALYSIS_CONFIG: AnalysisConfig = {
  performance_thresholds: [
    { min: 90, label: "Exceptional" },
    { min: 80, label: "Strong" },
    { min: 70, label: "Good" },
    { min: 60, label: "Developing" },
    { min: 0, label: "Needs Improvement" },
  ],
  strength_threshold: 80,
  development_threshold: 65,
  career_weights: {
    academic: 0.40,
    interest: 0.25,
    skills: 0.20,
    aptitude: 0.10,
    preferences: 0.05,
  },
  interest_level_map: {
    high: 90,
    mid: 60,
    medium: 60,
    low: 30,
  },
  career_profiles: buildCareerProfiles(),
  college_catalog: VERIFIED_COLLEGES,
};
