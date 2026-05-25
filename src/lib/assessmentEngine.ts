export type SubjectMarksInput = {
  subject: string;
  marks: string | number;
  interest?: "high" | "mid" | "low";
};

export type QuizQuestionInput = {
  subject?: string;
  question?: string;
};

export type AssessmentRecommendation = {
  stream: string;
  category: string;
  match: number;
  confidence: "High" | "Medium" | "Low";
  description: string;
  reasons: string[];
  careers: string[];
  nextSteps: string[];
  suggestedSubjects: string[];
  officialPathways: string[];
  sourceBasis: string[];
};

export type RecommendedStream = {
  streamName: string;
  matchScore: number;
  matchLevel: "High Match" | "Moderate Match" | "Low Match";
  reasons: string[];
  subjects: string[];
  careers: string[];
  suitabilityAnalysis: string;
};

export type AssessmentResult = {
  strengths: string;
  recommendations: AssessmentRecommendation[];
  academicAverage: number;
  topInterestDomains: string[];
  riasecProfile?: {
    primary: string;
    secondary: string;
    code: string;
    scores: Record<string, number>;
  };
  recommendedStreams?: RecommendedStream[];
};

export type RiasecCode = "R" | "I" | "A" | "S" | "E" | "C";

type CareerDefinition = {
  category: string;
  subjectWeights: Record<string, number>;
  interestDomains: string[];
  riasecThemes: RiasecCode[];
  nextSteps: string[];
  suggestedSubjects?: string[];
  officialPathways?: string[];
  sourceBasis?: string[];
  requiredSubjects?: string[]; // Core prerequisites for eligibility check
};

type AssessmentInput = {
  studentName?: string;
  marks?: Record<string, number>;
  interests?: Record<string, number>;
  topN?: number;
  academicWeight?: number;
  interestWeight?: number;
};

const riasecFullNames: Record<RiasecCode, string> = {
  R: "Realistic (Hands-on & Practical)",
  I: "Investigative (Analytical & Scientific)",
  A: "Artistic (Creative & Expressive)",
  S: "Social (Helping & Communicating)",
  E: "Enterprising (Leading & Influencing)",
  C: "Conventional (Organised & Detail-oriented)"
};

const interestToRiasec: Record<string, RiasecCode[]> = {
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
  "Research": ["I"],
  "Mathematics": ["I", "C"],
  "Physical Fitness": ["R"],
  "Social Media": ["E", "A"],
  "Entertainment": ["A", "E"]
};

export const careers: Record<string, CareerDefinition> = {
  "Software Engineer": {
    category: "Technology",
    subjectWeights: { Mathematics: 0.35, "Computer Science": 0.4, Physics: 0.15, English: 0.1 },
    interestDomains: ["Technology", "Problem Solving", "Mathematics"],
    riasecThemes: ["R", "I", "C"],
    nextSteps: ["Learn Python or JavaScript as your first language", "Build small projects on GitHub", "Explore B.Tech CSE / BCA / B.Sc CS programs", "Practice programming logic on codewars / hackerRank"],
    suggestedSubjects: ["Mathematics", "Physics", "Computer Science", "English"],
    officialPathways: ["B.Tech CSE through JEE Main / state counselling", "BCA or B.Sc Computer Science through university admission"],
    sourceBasis: ["CBSE senior secondary CS pathways", "NTA JEE Main engineering route"],
    requiredSubjects: ["Mathematics"]
  },
  "Data Scientist": {
    category: "Technology",
    subjectWeights: { Mathematics: 0.4, Statistics: 0.3, "Computer Science": 0.2, English: 0.1 },
    interestDomains: ["Technology", "Research", "Mathematics", "Problem Solving"],
    riasecThemes: ["I", "C", "R"],
    nextSteps: ["Study statistics and probability deeply", "Learn Python with NumPy and Pandas", "Pursue B.Tech CSE / B.Sc Statistics / Mathematics", "Practice analysis using Kaggle datasets"],
    suggestedSubjects: ["Mathematics", "Statistics", "Computer Science", "English"],
    officialPathways: ["B.Tech AI & Data Science through engineering admissions", "B.Sc Data Science / Statistics through university entrance"],
    sourceBasis: ["CBSE Applied Mathematics framework", "UGC university science pathways"],
    requiredSubjects: ["Mathematics"]
  },
  "UI/UX Designer": {
    category: "Technology",
    subjectWeights: { English: 0.2, Art: 0.4, "Computer Science": 0.25, Mathematics: 0.15 },
    interestDomains: ["Art & Creativity", "Design & Building", "Technology"],
    riasecThemes: ["A", "I", "E"],
    nextSteps: ["Learn design tools like Figma and Adobe XD", "Study user empathy and wireframing", "Build a visual portfolio on Behance", "Target B.Des (Bachelor of Design) programs"],
    suggestedSubjects: ["Art", "Computer Science", "English", "Psychology"],
    officialPathways: ["B.Des / M.Des admission via UCEED, NID DAT, or institutional exams"],
    sourceBasis: ["NID and IIT Design frameworks", "CBSE Fine Arts and CS subjects"],
    requiredSubjects: []
  },
  "Cybersecurity Analyst": {
    category: "Technology",
    subjectWeights: { "Computer Science": 0.45, Mathematics: 0.25, Physics: 0.2, English: 0.1 },
    interestDomains: ["Technology", "Problem Solving", "Law & Order"],
    riasecThemes: ["I", "C", "R"],
    nextSteps: ["Learn networking concepts and Linux system administration", "Practice ethical hacking on TryHackMe", "Pursue B.Tech CSE with Cyber Security specialization", "Aim for CompTIA Security+ certification"],
    suggestedSubjects: ["Computer Science", "Mathematics", "Physics", "English"],
    officialPathways: ["B.Tech CSE (Cybersecurity) or BCA + Security certifications"],
    sourceBasis: ["MeitY cyber education guidelines", "NTA JEE Main pathways"],
    requiredSubjects: ["Mathematics"]
  },
  "AI/ML Engineer": {
    category: "Technology",
    subjectWeights: { Mathematics: 0.45, "Computer Science": 0.3, Physics: 0.15, English: 0.1 },
    interestDomains: ["Technology", "Research", "Mathematics", "Problem Solving"],
    riasecThemes: ["I", "R", "C"],
    nextSteps: ["Strengthen linear algebra, calculus, and statistics", "Learn Python and machine learning libraries (scikit-learn, PyTorch)", "Target B.Tech CSE or AI/ML specializations", "Participate in AI hackathons"],
    suggestedSubjects: ["Mathematics", "Computer Science", "Physics", "English"],
    officialPathways: ["B.Tech AI/ML through national/state engineering entrance exams"],
    sourceBasis: ["CBSE Mathematics and CS syllabus", "NTA engineering frameworks"],
    requiredSubjects: ["Mathematics"]
  },
  "Full Stack Developer": {
    category: "Technology",
    subjectWeights: { "Computer Science": 0.4, Mathematics: 0.3, Physics: 0.15, English: 0.15 },
    interestDomains: ["Technology", "Design & Building", "Problem Solving"],
    riasecThemes: ["R", "I", "C"],
    nextSteps: ["Master HTML, CSS, JavaScript, and database concepts", "Build complete front-to-back web applications", "Explore BCA / B.Tech CSE / B.Sc CS", "Create a personal portfolio website"],
    suggestedSubjects: ["Computer Science", "Mathematics", "English"],
    officialPathways: ["B.Tech CSE, BCA, or B.Sc CS through college admissions"],
    sourceBasis: ["CBSE CS curriculum", "UGC IT curriculum guidelines"],
    requiredSubjects: []
  },
  "Mechanical Engineer": {
    category: "Engineering",
    subjectWeights: { Mathematics: 0.4, Physics: 0.4, Chemistry: 0.1, English: 0.1 },
    interestDomains: ["Design & Building", "Problem Solving", "Science"],
    riasecThemes: ["R", "I"],
    nextSteps: ["Focus on mechanics, thermodynamics, and drawing", "Learn basic CAD software (AutoCAD, SolidWorks)", "Prepare for JEE Main / JEE Advanced", "Build mechanics-based model projects"],
    suggestedSubjects: ["Physics", "Mathematics", "Chemistry", "English"],
    officialPathways: ["B.Tech / B.E. Mechanical Engineering via JEE Main or state counselling"],
    sourceBasis: ["NTA JEE Main pathways", "AICTE engineering education framework"],
    requiredSubjects: ["Mathematics", "Physics"]
  },
  "Civil Engineer": {
    category: "Engineering",
    subjectWeights: { Mathematics: 0.4, Physics: 0.35, Chemistry: 0.15, English: 0.1 },
    interestDomains: ["Design & Building", "Problem Solving", "Science"],
    riasecThemes: ["R", "I", "C"],
    nextSteps: ["Learn standard structural design concepts", "Get introduced to AutoCAD Civil 3D", "Target JEE Main and state engineering tests", "Visit local civil construction projects"],
    suggestedSubjects: ["Physics", "Mathematics", "Chemistry", "English"],
    officialPathways: ["B.Tech / B.E. Civil Engineering through JEE Main / state admission processes"],
    sourceBasis: ["NTA JEE Main engineering pathways", "AICTE guidelines"],
    requiredSubjects: ["Mathematics", "Physics"]
  },
  "Electrical Engineer": {
    category: "Engineering",
    subjectWeights: { Mathematics: 0.4, Physics: 0.4, Chemistry: 0.1, English: 0.1 },
    interestDomains: ["Design & Building", "Science", "Technology"],
    riasecThemes: ["R", "I"],
    nextSteps: ["Master electrical circuit analysis and electromagnetic fields", "Experiment with basic electronics kits", "Prepare for JEE Main / state engineering tests", "Read about power systems and smart grids"],
    suggestedSubjects: ["Physics", "Mathematics", "Chemistry", "English"],
    officialPathways: ["B.Tech / B.E. Electrical Engineering via engineering counselling"],
    sourceBasis: ["CBSE PCM subject combination", "NTA JEE Main structure"],
    requiredSubjects: ["Mathematics", "Physics"]
  },
  "Robotics Engineer": {
    category: "Engineering",
    subjectWeights: { Mathematics: 0.35, Physics: 0.35, "Computer Science": 0.2, English: 0.1 },
    interestDomains: ["Technology", "Design & Building", "Problem Solving", "Science"],
    riasecThemes: ["R", "I"],
    nextSteps: ["Learn Arduino coding and microcontrollers", "Study physics of mechanics and electronics", "Aim for B.Tech in Mechatronics or Robotics Engineering", "Participate in local robotics competitions"],
    suggestedSubjects: ["Physics", "Mathematics", "Computer Science", "English"],
    officialPathways: ["B.Tech Robotics/Mechatronics/ECE through JEE Main / state entrance"],
    sourceBasis: ["CBSE PCM and Computer Science pathways", "AICTE model curriculum"],
    requiredSubjects: ["Mathematics", "Physics"]
  },
  "Doctor (MBBS)": {
    category: "Medical",
    subjectWeights: { Biology: 0.45, Chemistry: 0.35, Physics: 0.15, English: 0.05 },
    interestDomains: ["Healthcare", "Science", "Helping Others", "Research"],
    riasecThemes: ["I", "S"],
    nextSteps: ["Focus extensively on human anatomy, physiology, and botany", "Prepare rigorously for the NEET-UG entrance exam", "Strengthen organic and inorganic chemistry", "Volunteer or shadow in healthcare settings if possible"],
    suggestedSubjects: ["Biology", "Chemistry", "Physics", "English"],
    officialPathways: ["MBBS / BDS admission strictly through NEET-UG national merit counselling"],
    sourceBasis: ["National Medical Commission (NMC) regulations", "NTA NEET-UG standard"],
    requiredSubjects: ["Biology", "Chemistry"]
  },
  "Nurse": {
    category: "Medical",
    subjectWeights: { Biology: 0.4, Chemistry: 0.2, English: 0.3, Sociology: 0.1 },
    interestDomains: ["Healthcare", "Helping Others", "Communication"],
    riasecThemes: ["S", "I"],
    nextSteps: ["Study biology and basic healthcare science", "Develop strong active listening and empathy skills", "Apply for B.Sc Nursing programs", "Complete basic CPR or first-aid training certificates"],
    suggestedSubjects: ["Biology", "Chemistry", "English", "Sociology"],
    officialPathways: ["B.Sc Nursing / GNM admission through state or institutional entrance tests"],
    sourceBasis: ["Indian Nursing Council (INC) syllabus", "CBSE biology and social sciences"],
    requiredSubjects: ["Biology"]
  },
  "Psychologist / Therapist": {
    category: "Healthcare",
    subjectWeights: { Psychology: 0.4, Biology: 0.2, Sociology: 0.2, English: 0.2 },
    interestDomains: ["Helping Others", "Research", "Communication"],
    riasecThemes: ["S", "I", "A"],
    nextSteps: ["Read foundational books on psychology and human behaviour", "Volunteer with student counseling or helpline NGOs", "Pursue BA / B.Sc in Psychology", "Plan for a Master's and RCI certification later"],
    suggestedSubjects: ["Psychology", "Biology", "Sociology", "English"],
    officialPathways: ["B.A / B.Sc Psychology followed by M.Sc and M.Phil (for clinical licensing via RCI)"],
    sourceBasis: ["Rehabilitation Council of India (RCI) guidelines", "UGC psychology pathways"],
    requiredSubjects: []
  },
  "Nutritionist / Dietitian": {
    category: "Healthcare",
    subjectWeights: { Biology: 0.4, Chemistry: 0.3, English: 0.2, HomeScience: 0.1 },
    interestDomains: ["Healthcare", "Helping Others", "Science"],
    riasecThemes: ["S", "I", "C"],
    nextSteps: ["Study biochemistry and nutrition science principles", "Learn about wellness, diets, and metabolic health", "Pursue B.Sc in Nutrition & Dietetics / Clinical Nutrition", "Aim for Registered Dietitian (RD) licensure"],
    suggestedSubjects: ["Biology", "Chemistry", "English", "Home Science"],
    officialPathways: ["B.Sc Nutrition & Dietetics followed by PG Diploma and RD exams"],
    sourceBasis: ["UGC home science & clinical nutrition curriculum", "IDA (Indian Dietetic Association)"],
    requiredSubjects: ["Biology"]
  },
  "Chartered Accountant (CA)": {
    category: "Finance",
    subjectWeights: { Accountancy: 0.45, "Business Studies": 0.2, Economics: 0.15, Mathematics: 0.2 },
    interestDomains: ["Finance", "Problem Solving", "Business"],
    riasecThemes: ["C", "E"],
    nextSteps: ["Strengthen principles of accounting and mercantile law", "Register with ICAI for the CA Foundation exam", "Practice arithmetic calculations and analytical problems", "Develop spreadsheet and Excel proficiency"],
    suggestedSubjects: ["Accountancy", "Business Studies", "Economics", "Mathematics"],
    officialPathways: ["Register with ICAI, pass CA Foundation, Intermediate, Articleship, and CA Final"],
    sourceBasis: ["Institute of Chartered Accountants of India (ICAI) system", "CBSE Commerce syllabus"],
    requiredSubjects: ["Accountancy"]
  },
  "Financial Analyst": {
    category: "Finance",
    subjectWeights: { Economics: 0.4, Mathematics: 0.3, Accountancy: 0.2, English: 0.1 },
    interestDomains: ["Finance", "Research", "Mathematics"],
    riasecThemes: ["C", "I", "E"],
    nextSteps: ["Study macroeconomics, microeconomics, and corporate finance", "Learn financial modeling and Excel analysis", "Pursue B.Com / BBA Finance / B.Sc Economics", "Prepare for CFA Level 1 exams"],
    suggestedSubjects: ["Economics", "Mathematics", "Accountancy", "English"],
    officialPathways: ["B.Com / BBA / B.Sc Economics followed by MBA Finance or CFA charter"],
    sourceBasis: ["UGC commerce and finance programs", "CFA Institute guidelines"],
    requiredSubjects: ["Economics"]
  },
  "Investment Banker": {
    category: "Finance",
    subjectWeights: { Economics: 0.35, Accountancy: 0.2, Mathematics: 0.3, "Business Studies": 0.15 },
    interestDomains: ["Finance", "Business", "Leadership", "Communication"],
    riasecThemes: ["E", "C", "I"],
    nextSteps: ["Study mergers & acquisitions and capital markets", "Build strong networking and presentation capabilities", "Target top-tier BBA / B.Com / B.Tech programs", "Plan to pursue an MBA in Finance from a premier institution"],
    suggestedSubjects: ["Economics", "Mathematics", "Accountancy", "Business Studies"],
    officialPathways: ["Graduation in Commerce/Economics/Engineering followed by MBA Finance or CFA"],
    sourceBasis: ["Top global and Indian IB recruitment patterns", "UGC management standards"],
    requiredSubjects: []
  },
  "Business Analyst": {
    category: "Business",
    subjectWeights: { "Business Studies": 0.3, Economics: 0.3, Mathematics: 0.2, "Computer Science": 0.2 },
    interestDomains: ["Business", "Problem Solving", "Technology"],
    riasecThemes: ["I", "E", "C"],
    nextSteps: ["Learn SQL, data analytics, and visualization tools (Tableau, PowerBI)", "Study business process modeling and requirement analysis", "Pursue BBA / B.Com / B.Tech / BCA", "Get certified in Agile Scrum methodologies"],
    suggestedSubjects: ["Business Studies", "Economics", "Mathematics", "Computer Science"],
    officialPathways: ["BBA / B.Tech / B.Com followed by Business Analytics courses or MBA"],
    sourceBasis: ["UGC business analytics curriculum guidelines"],
    requiredSubjects: []
  },
  "Management Consultant": {
    category: "Business",
    subjectWeights: { "Business Studies": 0.3, English: 0.3, Economics: 0.2, Mathematics: 0.2 },
    interestDomains: ["Business", "Problem Solving", "Leadership", "Communication"],
    riasecThemes: ["E", "S", "I"],
    nextSteps: ["Practice solving business case studies and guesstimates", "Sharpen presentation, slide-making, and verbal speaking skills", "Aim for graduation from tier-1 universities", "Target management consulting firms through internships"],
    suggestedSubjects: ["Business Studies", "English", "Economics", "Mathematics"],
    officialPathways: ["Graduation from a premium college followed by PGDM / MBA from tier-1 B-Schools"],
    sourceBasis: ["Consulting recruitment practices at IITs/IIMs", "UGC business standards"],
    requiredSubjects: []
  },
  "Product Manager": {
    category: "Business",
    subjectWeights: { "Business Studies": 0.3, "Computer Science": 0.25, Economics: 0.2, English: 0.25 },
    interestDomains: ["Business", "Technology", "Leadership", "Communication"],
    riasecThemes: ["E", "I", "C"],
    nextSteps: ["Study product design, roadmap logic, and user telemetry", "Participate in product teardowns and case study competitions", "Pursue B.Tech CSE / BBA / B.Des", "Get familiar with UX principles and agile project tools"],
    suggestedSubjects: ["Business Studies", "Computer Science", "English", "Economics"],
    officialPathways: ["Graduation in engineering/business followed by MBA or Product Management certs"],
    sourceBasis: ["Industry hiring standards for technology companies"],
    requiredSubjects: []
  },
  "Startup Founder / Entrepreneur": {
    category: "Business",
    subjectWeights: { "Business Studies": 0.4, Economics: 0.25, English: 0.2, Accountancy: 0.15 },
    interestDomains: ["Business", "Leadership", "Technology", "Social Media"],
    riasecThemes: ["E", "A"],
    nextSteps: ["Launch a micro-project or side hustle to learn startup mechanics", "Read startup case studies and venture capital basics", "Attend networking events and pitch sessions", "Learn product design and customer research techniques"],
    suggestedSubjects: ["Business Studies", "Economics", "English", "Accountancy"],
    officialPathways: ["Any graduation degree. Startup incubators and accelerators support building"],
    sourceBasis: ["Ministry of Commerce Startup India guidelines"],
    requiredSubjects: []
  },
  "Civil Services (IAS/IPS/IFS)": {
    category: "Government",
    subjectWeights: { History: 0.25, "Political Science": 0.25, Geography: 0.2, English: 0.2, Economics: 0.1 },
    interestDomains: ["Current Affairs", "Leadership", "Helping Others", "Law & Order"],
    riasecThemes: ["E", "S", "I"],
    nextSteps: ["Read national newspapers (The Hindu / Indian Express) daily", "Thoroughly master NCERT textbooks from class 6 to 12", "Select an optional subject that aligns with your interest", "Start practicing essay writing and structured answers early"],
    suggestedSubjects: ["History", "Political Science", "Geography", "English", "Economics"],
    officialPathways: ["Any graduation degree followed by clearing the three stages of UPSC CSE"],
    sourceBasis: ["UPSC Civil Services Examination syllabus", "CBSE humanities curriculum"],
    requiredSubjects: []
  },
  "Defense Services (Army/Navy/AF)": {
    category: "Government",
    subjectWeights: { Mathematics: 0.3, Physics: 0.3, English: 0.2, "General Knowledge": 0.2 },
    interestDomains: ["Leadership", "Physical Fitness", "Law & Order"],
    riasecThemes: ["R", "E", "S"],
    nextSteps: ["Maintain optimal physical fitness and medical health standards", "Prepare for the NDA entrance written examination", "Develop Officer Like Qualities (OLQs)", "Practice situational intelligence and SSB interview tasks"],
    suggestedSubjects: ["Physics", "Mathematics", "English", "General Knowledge"],
    officialPathways: ["Clear NDA exam (after 12th) or CDS exam (after graduation) followed by SSB Interview"],
    sourceBasis: ["UPSC NDA eligibility guidelines", "Indian Armed Forces recruitment framework"],
    requiredSubjects: ["Mathematics", "Physics"]
  },
  "Corporate Lawyer": {
    category: "Legal",
    subjectWeights: { English: 0.35, "Political Science": 0.3, History: 0.2, Sociology: 0.15 },
    interestDomains: ["Law & Order", "Communication", "Business", "Problem Solving"],
    riasecThemes: ["E", "C", "I"],
    nextSteps: ["Sharpen logical reasoning and critical reading speed", "Prepare for CLAT (Common Law Admission Test)", "Participate in debates and mock trial competitions", "Follow corporate law case studies and corporate news"],
    suggestedSubjects: ["English", "Political Science", "History", "Sociology", "Legal Studies"],
    officialPathways: ["5-year integrated BA LLB / BBA LLB from National Law Universities (NLUs) via CLAT"],
    sourceBasis: ["Consortium of National Law Universities (NLUs) standards", "Bar Council of India regulations"],
    requiredSubjects: ["English"]
  },
  "Architect": {
    category: "Design",
    subjectWeights: { Mathematics: 0.35, Art: 0.35, Physics: 0.2, English: 0.1 },
    interestDomains: ["Design & Building", "Art & Creativity", "Science"],
    riasecThemes: ["R", "A", "I"],
    nextSteps: ["Develop sketching and spatial visual skills", "Prepare for the NATA (National Aptitude Test in Architecture) or JEE Paper 2", "Build basic physical models or study design concepts", "Get introduced to 3D rendering and drawing software"],
    suggestedSubjects: ["Mathematics", "Physics", "Art", "English"],
    officialPathways: ["Bachelor of Architecture (B.Arch) through NATA / JEE Paper 2 and COA registration"],
    sourceBasis: ["Council of Architecture (COA) standards", "NATA exam guidelines"],
    requiredSubjects: ["Mathematics", "Physics"]
  },
  "Graphic Designer": {
    category: "Design",
    subjectWeights: { Art: 0.45, "Computer Science": 0.2, English: 0.2, "Business Studies": 0.15 },
    interestDomains: ["Art & Creativity", "Social Media", "Design & Building"],
    riasecThemes: ["A", "E"],
    nextSteps: ["Learn Adobe Photoshop, Illustrator, and digital layout", "Practice typography, color theory, and visual messaging", "Build an online design portfolio (Dribbble/Behance)", "Apply to B.Des / BFA programs"],
    suggestedSubjects: ["Art", "Computer Science", "English", "Business Studies"],
    officialPathways: ["B.Des / BFA at institutions like NID, NIFT, or university fine arts departments"],
    sourceBasis: ["NID DAT and NIFT design frameworks", "CBSE Fine Arts curriculum"],
    requiredSubjects: []
  },
  "Commercial Pilot": {
    category: "Aviation",
    subjectWeights: { Physics: 0.4, Mathematics: 0.4, English: 0.2 },
    interestDomains: ["Physical Fitness", "Science", "Technology", "Travel & Tourism"],
    riasecThemes: ["R", "I", "C"],
    nextSteps: ["Obtain DGCA Class II Medical Assessment certificate", "Study aviation meteorology, air navigation, and flight rules", "Join a DGCA-approved flying club", "Complete 200 hours of flying to obtain CPL"],
    suggestedSubjects: ["Physics", "Mathematics", "English"],
    officialPathways: ["12th PCM -> Flying School -> Pass DGCA written papers -> Flying Training -> CPL License"],
    sourceBasis: ["Directorate General of Civil Aviation (DGCA) licensing rules", "Aviation academy routes"],
    requiredSubjects: ["Mathematics", "Physics"]
  }
};

const subjectAliases: Record<string, string[]> = {
  Science: ["Physics", "Chemistry", "Biology"],
  "Social Studies": ["History", "Geography", "Political Science", "Economics"],
  SST: ["History", "Geography", "Political Science", "Economics"],
  CS: ["Computer Science"],
  "Informatics Practices": ["Computer Science"],
  "Artificial Intelligence": ["Computer Science"],
  "Data Science": ["Statistics", "Computer Science"],
  "Web Application": ["Computer Science"],
  "Applied Mathematics": ["Mathematics"],
  Biotechnology: ["Biology", "Chemistry"],
  Accounts: ["Accountancy"],
  Business: ["Business Studies"],
  "Legal Studies": ["Political Science", "Sociology"],
  "Mass Media Studies": ["English", "Sociology"],
  "Fine Arts": ["Art"],
  Painting: ["Art"],
  "Graphic Design": ["Art", "Computer Science"],
  "Fashion Studies": ["Art", "Business Studies"],
  "Physical Education": ["General Knowledge"],
  "Engineering Graphics": ["Physics", "Mathematics"],
  Healthcare: ["Biology"],
  "Food Nutrition and Dietetics": ["Biology", "Chemistry"],
};

const interestKeywordMap: Array<[string, string[]]> = [
  ["Technology", ["technology", "coding", "software", "computer", "programming", "app", "ai", "robotics", "cyber", "security"]],
  ["Problem Solving", ["problem", "logic", "puzzle", "solve", "analysis", "analytical"]],
  ["Science", ["science", "physics", "chemistry", "biology", "experiment", "space", "astronomy"]],
  ["Healthcare", ["doctor", "medical", "health", "medicine", "patient", "nursing", "nutrition", "diet"]],
  ["Business", ["business", "startup", "entrepreneur", "management", "corporate", "consulting", "product"]],
  ["Finance", ["finance", "money", "account", "investment", "economics", "stock", "banking", "risk"]],
  ["Writing", ["writing", "content", "journalism", "blog", "story", "copywriting"]],
  ["Communication", ["communication", "speaking", "presentation", "debate", "relations"]],
  ["Art & Creativity", ["art", "creative", "design", "animation", "film", "music", "sketching", "drawing"]],
  ["Design & Building", ["design", "build", "making", "architecture", "mechanical", "civil", "structure"]],
  ["Helping Others", ["help", "counsel", "support", "teach", "social", "therapy", "education"]],
  ["Leadership", ["leadership", "leader", "manage", "team", "army", "defence", "officer"]],
  ["Current Affairs", ["current affairs", "news", "politics", "upsc", "civil"]],
  ["Law & Order", ["law", "justice", "legal", "police", "order", "court"]],
  ["Research", ["research", "discover", "study", "learning"]],
  ["Mathematics", ["math", "mathematics", "statistics", "numbers", "data"]],
  ["Physical Fitness", ["fitness", "sports", "physical", "army", "defence", "pilot"]],
  ["Social Media", ["social media", "instagram", "youtube", "creator", "influencer"]],
  ["Entertainment", ["entertainment", "film", "movie", "animation", "vfx", "gaming"]]
];

const subjectInterestMap: Record<string, string[]> = {
  Mathematics: ["Mathematics", "Problem Solving", "Logic"],
  Statistics: ["Mathematics", "Research", "Problem Solving"],
  Physics: ["Science", "Problem Solving", "Design & Building"],
  Chemistry: ["Science", "Research"],
  Biology: ["Science", "Healthcare", "Research"],
  Science: ["Science", "Research", "Healthcare"],
  "Computer Science": ["Technology", "Problem Solving", "Logic", "Gaming / Apps"],
  Technology: ["Technology", "Problem Solving", "Gaming / Apps"],
  English: ["Communication", "Writing", "Reading & Learning"],
  Literature: ["Writing", "Communication", "Reading & Learning"],
  History: ["Current Affairs", "Social Issues", "Reading & Learning"],
  Geography: ["Current Affairs", "Social Issues", "Research"],
  "Political Science": ["Current Affairs", "Law & Order", "Social Issues"],
  Economics: ["Finance", "Current Affairs", "Research", "Mathematics"],
  Accountancy: ["Finance", "Problem Solving"],
  "Business Studies": ["Business", "Leadership", "Finance"],
  Sociology: ["Social Issues", "Helping Others", "Research"],
  Psychology: ["Helping Others", "Healthcare", "Social Issues"],
  Art: ["Art & Creativity", "Design & Building"],
  Arts: ["Art & Creativity", "Design & Building", "Entertainment"],
  "General Knowledge": ["Current Affairs", "Reading & Learning"],
  "Social Studies": ["Current Affairs", "Social Issues", "Law & Order"],
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const computeAcademicAverage = (marks: Record<string, number>): number => {
  const values = Object.values(marks);
  return values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : 75; // 75 as neutral default
};

const computeStudentRiasec = (interests: Record<string, number>): Record<RiasecCode, number> => {
  const scores: Record<RiasecCode, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  const counts: Record<RiasecCode, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  Object.entries(interests).forEach(([domain, rating]) => {
    const codes = interestToRiasec[domain] || [];
    codes.forEach(code => {
      scores[code] += rating;
      counts[code] += 1;
    });
  });

  const normalized: Record<RiasecCode, number> = { R: 5, I: 5, A: 5, S: 5, E: 5, C: 5 };
  (Object.keys(scores) as RiasecCode[]).forEach(code => {
    if (counts[code] > 0) {
      normalized[code] = Math.round((scores[code] / counts[code]) * 10) / 10;
    }
  });

  return normalized;
};

const getConfidence = (score: number, hasPrereqIssues: boolean): AssessmentRecommendation["confidence"] => {
  if (score >= 75) {
    return hasPrereqIssues ? "Medium" : "High";
  }
  if (score >= 50) return "Medium";
  return "Low";
};

export const assessCareer = ({
  marks = {},
  interests = {},
  topN = 5,
  academicWeight = 0.50,
  interestWeight = 0.50
}: AssessmentInput): AssessmentResult => {
  const academicAverage = computeAcademicAverage(marks);
  const studentRiasec = computeStudentRiasec(interests);

  // Identify student's dominant Holland code themes
  const sortedRiasec = (Object.keys(studentRiasec) as RiasecCode[])
    .sort((a, b) => studentRiasec[b] - studentRiasec[a]);
  const primaryTheme = sortedRiasec[0];
  const secondaryTheme = sortedRiasec[1];
  const riasecCode = `${primaryTheme}${secondaryTheme}`;

  const recommendations = Object.entries(careers)
    .map(([careerName, careerData]) => {
      const keyStrengths: string[] = [];
      const developmentAreas: string[] = [];
      const missingPrereqs: string[] = [];
      let prereqStrengthSum = 0;
      let ratedPrereqsCount = 0;

      // 1. Core Aptitude calculations
      const weights = Object.entries(careerData.subjectWeights);
      let weightedSum = 0;
      let totalWeight = 0;

      weights.forEach(([subject, weight]) => {
        const studentMark = marks[subject] !== undefined ? marks[subject] : academicAverage;
        weightedSum += (clamp(studentMark, 0, 100) / 100) * weight;
        totalWeight += weight;
      });

      const aptitudeScore = totalWeight ? (weightedSum / totalWeight) * 100 : 75;

      // 2. Relative marks trend analysis
      const required = careerData.requiredSubjects || [];
      required.forEach(subject => {
        const mark = marks[subject];
        if (mark === undefined) {
          missingPrereqs.push(subject);
        } else {
          ratedPrereqsCount++;
          prereqStrengthSum += mark;
          const diff = mark - academicAverage;
          if (diff >= 5) {
            keyStrengths.push(`Relative strength in ${subject} (${Math.round(mark)}% vs average ${Math.round(academicAverage)}%)`);
          } else if (diff <= -5) {
            developmentAreas.push(`Your ${subject} mark (${Math.round(mark)}%) is below your academic average (${Math.round(academicAverage)}%)`);
          }
        }
      });

      // 3. Interest alignment and RIASEC congruence
      let interestSum = 0;
      careerData.interestDomains.forEach(domain => {
        interestSum += clamp(interests[domain] ?? 5, 0, 10);
      });
      const domainMatchPercent = careerData.interestDomains.length
        ? (interestSum / careerData.interestDomains.length) * 10
        : 50;

      let riasecSum = 0;
      careerData.riasecThemes.forEach(theme => {
        riasecSum += studentRiasec[theme];
      });
      const riasecMatchPercent = careerData.riasecThemes.length
        ? (riasecSum / careerData.riasecThemes.length) * 10
        : 50;

      const interestScore = (domainMatchPercent * 0.5) + (riasecMatchPercent * 0.5);

      // 4. Synergy and relative adjustments
      let synergyBonus = 0;
      // High marks matches high RIASEC codes
      const dominantCareerTheme = careerData.riasecThemes[0];
      if (dominantCareerTheme === primaryTheme || dominantCareerTheme === secondaryTheme) {
        synergyBonus += 3;
      }
      // Top interest matching career domain
      const studentTopInterests = Object.entries(interests).sort((a,b) => b[1] - a[1]).slice(0, 3).map(([d]) => d);
      if (studentTopInterests.some(d => careerData.interestDomains.includes(d))) {
        synergyBonus += 3;
      }

      // Dynamic Matching calculation (combining Aptitude + Interest + Synergy)
      const totalNormWeight = academicWeight + interestWeight;
      const normAcWeight = totalNormWeight ? academicWeight / totalNormWeight : 0.5;
      const normIntWeight = totalNormWeight ? interestWeight / totalNormWeight : 0.5;

      let matchScore = (normAcWeight * aptitudeScore) + (normIntWeight * interestScore) + synergyBonus;

      // Adjust score for relative subject trends
      if (ratedPrereqsCount > 0) {
        const prereqAverage = prereqStrengthSum / ratedPrereqsCount;
        const diffFromOverall = prereqAverage - academicAverage;
        // Boost if prerequisite subjects are stronger than overall average
        if (diffFromOverall > 0) {
          matchScore += Math.min(5, diffFromOverall * 0.5);
        } else {
          // Soft adjustment for negative trend
          matchScore += Math.max(-8, diffFromOverall * 0.8);
        }
      }

      // Handle completely missing prerequisite subjects fluidly
      if (missingPrereqs.length > 0) {
        // Dynamic adjustment: slightly decrease match score to reflect lack of stream records
        matchScore -= (missingPrereqs.length * 6);
        missingPrereqs.forEach(subject => {
          developmentAreas.push(`Prerequisite subject ${subject} is not recorded; verify secondary pathways or bridging courses`);
        });
      }

      const score = clamp(matchScore, 0, 100);
      const confidence = getConfidence(score, missingPrereqs.length > 0);

      // Strengths extraction
      const careerTopSubjects = Object.keys(careerData.subjectWeights)
        .sort((a,b) => (marks[b] ?? 0) - (marks[a] ?? 0));
      const bestSubject = careerTopSubjects[0];
      if (bestSubject && (marks[bestSubject] ?? 0) >= academicAverage) {
        keyStrengths.push(`Core focus: strong performance in ${bestSubject} (${Math.round(marks[bestSubject] ?? 0)}%)`);
      }

      const matchingCareerThemes = careerData.riasecThemes.filter(theme => theme === primaryTheme || theme === secondaryTheme);
      if (matchingCareerThemes.length > 0) {
        keyStrengths.push(`Fits your ${matchingCareerThemes.map(t => riasecFullNames[t].split(" ")[0]).join(" & ")} traits`);
      }

      // Collate dynamic feedback explanations
      const reasons = [...keyStrengths, ...developmentAreas];
      if (reasons.length === 0) {
        reasons.push("Aligned with overall academic parameters and interest themes.");
      }

      const description = `${careerName} aligns with your profile (Match: ${Math.round(score)}%). ` +
        `This path highlights your ${careerData.riasecThemes.map(t => riasecFullNames[t].split(" ")[0]).join("-")} occupational traits. ` +
        (missingPrereqs.length > 0
          ? `Note: Stream details do not verify enrollment in ${missingPrereqs.join(" / ")}, which are traditional criteria.`
          : `Your recorded subjects support the eligibility guidelines for this career.`);

      return {
        stream: careerName,
        category: careerData.category,
        match: Math.round(score),
        confidence,
        description,
        reasons,
        careers: [careerName],
        nextSteps: careerData.nextSteps,
        suggestedSubjects: careerData.suggestedSubjects ?? Object.keys(careerData.subjectWeights),
        officialPathways: careerData.officialPathways ?? ["Consult official state board/entrance brochures to verify selection criteria."],
        sourceBasis: careerData.sourceBasis ?? ["University board standards & regulatory guidelines"],
      };
    })
    .sort((a, b) => b.match - a.match)
    .slice(0, topN);

  const topInterestDomains = Object.entries(interests)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([domain]) => domain);

  const topRecommendation = recommendations[0];
  const strengths = topRecommendation
    ? `Your strongest match is ${topRecommendation.stream} (${topRecommendation.match}% fit) indicating a high congruence in the ${riasecFullNames[primaryTheme]} theme profile.`
    : "Your profile indicates a balanced distribution of academic skills and interests. Review recommendations to identify specific paths.";

  return {
    strengths,
    recommendations,
    academicAverage: Math.round(academicAverage * 10) / 10,
    topInterestDomains,
    riasecProfile: {
      primary: riasecFullNames[primaryTheme],
      secondary: riasecFullNames[secondaryTheme],
      code: riasecCode,
      scores: studentRiasec
    },
    recommendedStreams: assessStreams(marks, interests, studentRiasec, academicAverage)
  };
};

export const assessStreams = (
  marks: Record<string, number>,
  interests: Record<string, number>,
  riasecScores: Record<string, number>,
  academicAverage: number
): RecommendedStream[] => {
  const getMark = (sub: string) => marks[sub] !== undefined ? marks[sub] : academicAverage;
  
  // Science marks helper
  const scienceMark = (getMark("Physics") + getMark("Chemistry") + getMark("Science")) / 3;
  const bioMark = marks["Biology"] !== undefined ? marks["Biology"] : scienceMark;
  const mathMark = getMark("Mathematics");
  const sstMark = (getMark("Social Studies") + getMark("History") + getMark("Geography") + getMark("Political Science") + getMark("Economics")) / 5;
  const engMark = getMark("English");

  const getInterestAvg = (domains: string[]) => {
    const sum = domains.reduce((acc, d) => acc + (interests[d] ?? 5), 0);
    return (sum / domains.length) * 10; // normalized to 0-100
  };

  const getRiasecAvg = (themes: RiasecCode[]) => {
    const sum = themes.reduce((acc, t) => acc + (riasecScores[t] ?? 5), 0);
    return (sum / themes.length) * 10; // normalized to 0-100
  };

  const streamDefinitions = [
    {
      name: "Science (PCM)",
      subjects: ["Physics", "Chemistry", "Mathematics", "English", "Computer Science / Economics"],
      careers: ["Software Engineer", "Mechanical/Civil/Electrical Engineer", "Data Scientist", "Commercial Pilot", "Architect", "AI/ML Engineer"],
      aptitude: (mathMark * 0.5) + (scienceMark * 0.5),
      interestDomains: ["Technology", "Problem Solving", "Mathematics", "Design & Building"],
      riasecThemes: ["R", "I", "C"] as RiasecCode[],
      getAnalysis: () => {
        const reasons = [];
        if (mathMark > academicAverage) reasons.push(`Strong relative performance in Mathematics (${Math.round(mathMark)}% vs average ${Math.round(academicAverage)}%)`);
        if (scienceMark > academicAverage) reasons.push(`Excellent understanding of Science subjects (${Math.round(scienceMark)}% vs average ${Math.round(academicAverage)}%)`);
        if ((interests["Technology"] ?? 5) > 6) reasons.push("High interest in Technology & Coding");
        if ((interests["Problem Solving"] ?? 5) > 6) reasons.push("Strong logical problem-solving preference");
        
        return {
          reasons: reasons.length ? reasons : ["Aligned with logical and analytical aptitude profile."],
          analysis: `Science with Physics, Chemistry, and Mathematics (PCM) is highly recommended for you. Your analytical skills and interest in design, building, and problem-solving suggest a strong fit for engineering, technological, and architecture careers.`
        };
      }
    },
    {
      name: "Science (PCB)",
      subjects: ["Physics", "Chemistry", "Biology", "English", "Psychology / Biotechnology"],
      careers: ["Doctor (MBBS)", "Dentist", "Biotechnologist", "Pharmacist", "Nurse", "Nutritionist / Dietitian"],
      aptitude: (bioMark * 0.6) + (scienceMark * 0.2) + (mathMark * 0.2),
      interestDomains: ["Healthcare", "Science", "Helping Others", "Research"],
      riasecThemes: ["I", "S"] as RiasecCode[],
      getAnalysis: () => {
        const reasons = [];
        if (bioMark > academicAverage) reasons.push(`Strong aptitude in Biology (${Math.round(bioMark)}% vs average ${Math.round(academicAverage)}%)`);
        if (scienceMark > academicAverage) reasons.push(`Good base in General Science (${Math.round(scienceMark)}% vs average ${Math.round(academicAverage)}%)`);
        if ((interests["Healthcare"] ?? 5) > 6) reasons.push("Keen interest in Medical & Healthcare domains");
        if ((interests["Helping Others"] ?? 5) > 6) reasons.push("Strong preference for careers that help others directly");

        return {
          reasons: reasons.length ? reasons : ["Aligned with medical interest themes and scientific curiosity."],
          analysis: `Science with Physics, Chemistry, and Biology (PCB) is the standard route for medical, biological, and health sciences. Your scientific curiosity and interest in helping others align perfectly with these fields.`
        };
      }
    },
    {
      name: "Science (PCMB)",
      subjects: ["Physics", "Chemistry", "Mathematics", "Biology", "English"],
      careers: ["Biomedical Engineer", "Bioinformatician", "Biotechnologist", "Research Scientist", "Pharmaceutical Developer"],
      aptitude: (mathMark * 0.3) + (bioMark * 0.3) + (scienceMark * 0.4),
      interestDomains: ["Science", "Healthcare", "Problem Solving", "Mathematics", "Research"],
      riasecThemes: ["I", "R", "S"] as RiasecCode[],
      getAnalysis: () => {
        const reasons = [];
        if (mathMark > academicAverage && bioMark > academicAverage) reasons.push("Balanced excellence in both Mathematics and Biology");
        if (scienceMark > academicAverage) reasons.push(`Outstanding general science aptitude (${Math.round(scienceMark)}% vs average ${Math.round(academicAverage)}%)`);
        if ((interests["Research"] ?? 5) > 6) reasons.push("High interest in scientific research and inquiry");

        return {
          reasons: reasons.length ? reasons : ["Strong balanced performance across all core science and mathematical subjects."],
          analysis: `Science with PCMB offers the maximum career flexibility, opening doors to both engineering and medical disciplines. This combination is challenging but highly rewarding for students showing high analytical ability across both maths and life sciences.`
        };
      }
    },
    {
      name: "Commerce",
      subjects: ["Accountancy", "Business Studies", "Economics", "English", "Mathematics / Applied Mathematics"],
      careers: ["Chartered Accountant (CA)", "Financial Analyst", "Investment Banker", "Business Analyst", "Marketing Manager", "Entrepreneur"],
      aptitude: (mathMark * 0.4) + (sstMark * 0.4) + (engMark * 0.2),
      interestDomains: ["Finance", "Business", "Leadership", "Communication"],
      riasecThemes: ["C", "E"] as RiasecCode[],
      getAnalysis: () => {
        const reasons = [];
        if (mathMark >= academicAverage) reasons.push(`Good numerical aptitude suitable for financial calculations (${Math.round(mathMark)}% vs average ${Math.round(academicAverage)}%)`);
        if (sstMark > academicAverage) reasons.push(`Strong social studies and economic comprehension (${Math.round(sstMark)}% vs average ${Math.round(academicAverage)}%)`);
        if ((interests["Finance"] ?? 5) > 6) reasons.push("Active interest in finance, markets, and investment");
        if ((interests["Business"] ?? 5) > 6) reasons.push("Preference for leadership, entrepreneurship, and organizational studies");

        return {
          reasons: reasons.length ? reasons : ["Aligned with organizational and commercial interest themes."],
          analysis: `Commerce is the ideal stream for careers in finance, business management, and administration. Your numerical competence and interest in corporate structures, economics, and leadership indicate a strong potential for success in this path.`
        };
      }
    },
    {
      name: "Arts & Humanities",
      subjects: ["History", "Geography", "Political Science", "Psychology", "Sociology", "English", "Legal Studies"],
      careers: ["Civil Services (IAS/IPS/IFS)", "Corporate Lawyer", "Psychologist / Counselor", "Graphic/UX Designer", "Journalist", "Writer / Editor"],
      aptitude: (sstMark * 0.6) + (engMark * 0.4),
      interestDomains: ["Art & Creativity", "Writing", "Communication", "Helping Others", "Current Affairs", "Law & Order"],
      riasecThemes: ["A", "S", "E"] as RiasecCode[],
      getAnalysis: () => {
        const reasons = [];
        if (sstMark > academicAverage) reasons.push(`Excellent aptitude in social sciences (${Math.round(sstMark)}% vs average ${Math.round(academicAverage)}%)`);
        if (engMark > academicAverage) reasons.push(`Strong verbal comprehension and language skills (${Math.round(engMark)}% vs average ${Math.round(academicAverage)}%)`);
        if ((interests["Art & Creativity"] ?? 5) > 6) reasons.push("Creative design and artistic self-expression focus");
        if ((interests["Writing"] ?? 5) > 6 || (interests["Communication"] ?? 5) > 6) reasons.push("Strong interest in communication and writing");
        if ((interests["Current Affairs"] ?? 5) > 6) reasons.push("Keen interest in societal affairs and governance");

        return {
          reasons: reasons.length ? reasons : ["Aligned with creative, communication, and societal analysis profiles."],
          analysis: `Arts and Humanities offer a rich path focusing on human society, literature, design, law, and administration. Your strong verbal reasoning, creative flair, and interest in human behaviour and society show an excellent fit for this stream.`
        };
      }
    }
  ];

  return streamDefinitions.map(def => {
    const aptScore = def.aptitude;
    const intScore = getInterestAvg(def.interestDomains);
    const riaScore = getRiasecAvg(def.riasecThemes);

    // Baseline calculation (40% Aptitude, 40% Interest, 20% RIASEC)
    let score = (aptScore * 0.40) + (intScore * 0.40) + (riaScore * 0.20);

    // Apply relative trend adjustments
    if (def.name.startsWith("Science")) {
      const avgScienceMath = (scienceMark + mathMark) / 2;
      const scienceDiff = avgScienceMath - academicAverage;
      if (scienceDiff > 5) score += Math.min(5, scienceDiff * 0.5);
      else if (scienceDiff < -5) score += Math.max(-8, scienceDiff * 0.8);
    } else if (def.name === "Commerce") {
      const commDiff = ((mathMark + sstMark) / 2) - academicAverage;
      if (commDiff > 5) score += Math.min(5, commDiff * 0.5);
      else if (commDiff < -5) score += Math.max(-8, commDiff * 0.8);
    } else if (def.name === "Arts & Humanities") {
      const artsDiff = ((sstMark + engMark) / 2) - academicAverage;
      if (artsDiff > 5) score += Math.min(5, artsDiff * 0.5);
      else if (artsDiff < -5) score += Math.max(-8, artsDiff * 0.8);
    }

    score = clamp(score, 0, 100);
    const roundedScore = Math.round(score);

    const matchLevel = roundedScore >= 75
      ? "High Match"
      : roundedScore >= 55
        ? "Moderate Match"
        : "Low Match";

    const { reasons, analysis } = def.getAnalysis();

    return {
      streamName: def.name,
      matchScore: roundedScore,
      matchLevel,
      reasons,
      subjects: def.subjects,
      careers: def.careers,
      suitabilityAnalysis: analysis
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
};

export const buildMarksFromSubjectRows = (rows: unknown[]) => {
  const marks: Record<string, number> = {};

  rows.forEach((row) => {
    const item = row as Partial<SubjectMarksInput>;
    const subject = typeof item.subject === "string" ? item.subject.trim() : "";
    const score = typeof item.marks === "number" ? item.marks : parseFloat(String(item.marks ?? ""));
    if (!subject || Number.isNaN(score)) return;

    const mappedSubjects = subjectAliases[subject] ?? [subject];
    mappedSubjects.forEach((mappedSubject) => {
      marks[mappedSubject] = marks[mappedSubject] === undefined
        ? clamp(score, 0, 100)
        : Math.round(((marks[mappedSubject] + clamp(score, 0, 100)) / 2) * 10) / 10;
    });
  });

  return marks;
};

export const buildInterestsFromSubjectRows = (rows: unknown[], freeText?: string) => {
  const interests: Record<string, number> = {};
  const addInterest = (domain: string, rating: number) => {
    interests[domain] = Math.max(interests[domain] ?? 0, rating);
  };

  rows.forEach((row) => {
    const item = row as Partial<SubjectMarksInput>;
    const subject = typeof item.subject === "string" ? item.subject.trim() : "";
    const rating = item.interest === "high" ? 9 : item.interest === "mid" ? 6 : item.interest === "low" ? 3 : undefined;
    if (!subject || !rating) return;

    const mappedSubjects = subjectAliases[subject] ?? [subject];
    mappedSubjects.forEach((mappedSubject) => {
      subjectInterestMap[mappedSubject]?.forEach((domain) => addInterest(domain, rating));
    });
  });

  const text = freeText?.toLowerCase() ?? "";
  interestKeywordMap.forEach(([domain, keywords]) => {
    if (keywords.some((keyword) => text.includes(keyword))) addInterest(domain, 8);
  });

  return interests;
};

export const buildInterestsFromQuizAnswers = (
  answers?: Record<string, number | string>,
  questions?: QuizQuestionInput[],
  customAnswers?: Record<number, string>,
) => {
  const interests: Record<string, number> = {};
  if (!answers) return interests;
  const addInterest = (domain: string, rating: number) => {
    interests[domain] = Math.max(interests[domain] ?? 0, rating);
  };

  const values = [
    ...Object.values(answers).filter((value): value is string => typeof value === "string"),
    ...Object.values(customAnswers ?? {}),
  ];
  const text = values.join(" ").toLowerCase();

  interestKeywordMap.forEach(([domain, keywords]) => {
    const matches = keywords.filter((keyword) => text.includes(keyword)).length;
    if (matches > 0) addInterest(domain, clamp(6 + matches, 0, 10));
  });

  Object.entries(answers).forEach(([questionIndex, value]) => {
    if (typeof value !== "number") return;
    const question = questions?.[Number(questionIndex)];
    const subject = question?.subject?.trim();
    const rating = value === 6 ? 8 : clamp(value * 2, 0, 10);

    if (subject) {
      subjectInterestMap[subject]?.forEach((domain) => addInterest(domain, rating));
    }

    const questionText = question?.question?.toLowerCase() ?? "";
    interestKeywordMap.forEach(([domain, keywords]) => {
      if (keywords.some((keyword) => questionText.includes(keyword)) && value >= 3) {
        addInterest(domain, rating);
      }
    });
  });

  return interests;
};
