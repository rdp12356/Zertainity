export interface DegreeOption {
  name: string;
  shortName: string;
  duration: string;
  eligibility: string;
  coreSubjects: string[];
  entranceExams: string[];
  approximateFees: string;
  careerOptions: string[];
  higherStudies: string[];
  mathematicalIntensity: "High" | "Medium" | "Low";
  practicalLabWeight: string;
  whoItSuits: string;
  whoMayNotEnjoy: string;
}

export interface DegreeComparisonGroup {
  id: string;
  title: string;
  category: string;
  description: string;
  degrees: DegreeOption[];
  verdictGuidance: string;
}

export const DEGREE_COMPARISONS: DegreeComparisonGroup[] = [
  {
    id: "tech-degrees",
    title: "B.Tech Computer Science vs BCA vs B.Sc Computer Science",
    category: "Technology",
    description: "Compare India's three primary undergraduate computing pathways to determine the optimal balance of engineering rigor, software development speed, and math intensity.",
    degrees: [
      {
        name: "Bachelor of Technology in Computer Science & Engineering",
        shortName: "B.Tech CSE",
        duration: "4 Years (8 Semesters)",
        eligibility: "Class 12 Science (Physics, Mathematics compulsory + Chemistry/CS/IT)",
        coreSubjects: [
          "Data Structures & Algorithms",
          "Computer Architecture & Microprocessors",
          "Operating Systems & Distributed Computing",
          "Compiler Design & Theory of Computation",
          "Database Management Systems & Cloud Networks",
        ],
        entranceExams: ["JEE Main", "JEE Advanced", "BITSAT", "State CETs (MHT-CET, KCET, WBJEE)"],
        approximateFees: "₹4L – ₹18L (Government: ₹2L–₹8L; Private: ₹8L–₹22L)",
        careerOptions: ["Software Development Engineer (SDE)", "Cloud / DevOps Engineer", "Systems Architect", "Cybersecurity Specialist"],
        higherStudies: ["M.Tech (via GATE)", "MS in Computer Science abroad (GRE)", "MBA (CAT/GMAT)"],
        mathematicalIntensity: "High",
        practicalLabWeight: "Heavy engineering labs, hardware microcontrollers, capstone industry project",
        whoItSuits: "Students who enjoy deep algorithmic math, computer hardware-software interfaces, and aim for product-based tech companies.",
        whoMayNotEnjoy: "Students looking to avoid intensive engineering mathematics (Calculus, Linear Algebra, Discrete Math) and Physics.",
      },
      {
        name: "Bachelor of Computer Applications",
        shortName: "BCA",
        duration: "3 Years (or 4 Years with NEP Honours)",
        eligibility: "Class 12 in any stream (Commerce/Science/Arts); Mathematics or Informatics Practices preferred/required by many universities",
        coreSubjects: [
          "Object-Oriented Programming (Java, Python, C++)",
          "Web Technologies (HTML/CSS/JS, React, Node)",
          "Relational Database Management (SQL, Oracle)",
          "Software Engineering & System Analysis",
          "Mobile Application Development (Android/iOS)",
        ],
        entranceExams: ["CUET-UG", "IPU CET", "State BCA Entrances", "Direct Merit Admission"],
        approximateFees: "₹1.5L – ₹6L (Affordable government and private colleges)",
        careerOptions: ["Full-Stack Web Developer", "Database Administrator", "Application Support Engineer", "QA Automation Tester"],
        higherStudies: ["MCA (Master of Computer Applications - Nimcet)", "MBA IT / Systems", "M.Sc Computer Science"],
        mathematicalIntensity: "Medium",
        practicalLabWeight: "Heavy software programming labs, database design, web application development",
        whoItSuits: "Commerce or Science students who want hands-on software development without heavy hardware/engineering physics prerequisites.",
        whoMayNotEnjoy: "Students aiming for immediate semiconductor hardware engineering or hardware-level systems architecture.",
      },
      {
        name: "Bachelor of Science in Computer Science / Data Science",
        shortName: "B.Sc CS",
        duration: "3 to 4 Years (NEP Research Pathway)",
        eligibility: "Class 12 with Mathematics and Science stream",
        coreSubjects: [
          "Discrete Mathematics & Probability Statistics",
          "Algorithm Analysis & Numerical Computing",
          "Data Analysis & Statistical Computing (R/Python)",
          "Artificial Intelligence Fundamentals",
          "Computational Logic & Graph Theory",
        ],
        entranceExams: ["CUET-UG (Central Universities)", "State University Entrances"],
        approximateFees: "₹50k – ₹3.5L (Central/State Universities highly subsidized)",
        careerOptions: ["Data Analyst", "Junior Data Scientist", "Quantitative Researcher", "Scientific Programmer"],
        higherStudies: ["M.Sc Data Science / Statistics", "MCA", "Ph.D in Computational Science"],
        mathematicalIntensity: "High",
        practicalLabWeight: "Theoretical computer science research, statistical computing laboratories",
        whoItSuits: "Students passionate about data science, statistical modeling, algorithms, and academic/research trajectories.",
        whoMayNotEnjoy: "Students looking strictly for commercial web design without quantitative mathematics.",
      },
    ],
    verdictGuidance:
      "If you have Physics-Math and clear JEE/CETs, B.Tech CSE provides the broadest campus placement umbrella. If you come from Commerce or want an affordable, code-first application track, BCA + MCA is an exceptional equivalent. If you love quantitative analytics and data science, B.Sc CS is ideal.",
  },

  {
    id: "finance-degrees",
    title: "B.Com (Hons) + CA vs BBA + MBA Finance vs CFA Charter",
    category: "Finance",
    description: "Compare India's apex financial pathways: statutory auditing via ICAI, corporate strategy via MBA Finance, and global investment analysis via CFA.",
    degrees: [
      {
        name: "Bachelor of Commerce (Hons) + Chartered Accountancy (ICAI)",
        shortName: "B.Com + CA",
        duration: "B.Com: 3 Years | CA: 4 to 5 Years total",
        eligibility: "Class 12 in any stream (Commerce with Mathematics/Accountancy recommended)",
        coreSubjects: [
          "Financial Accounting & Reporting Standards (Ind AS / IFRS)",
          "Direct & Indirect Taxation (Income Tax Act, GST)",
          "Corporate Law & Companies Act 2013",
          "Statutory Auditing & Forensic Accounting",
        ],
        entranceExams: ["CA Foundation (ICAI)", "CUET-UG (for B.Com Hons in SRCC / Central Universities)"],
        approximateFees: "₹1.5L – ₹4L (Excluding private tuition; ICAI fees are highly affordable)",
        careerOptions: ["Statutory Auditor", "Tax Consultant", "Chief Financial Officer (CFO)", "Forensic Auditor"],
        higherStudies: ["ICAI Post-Qualification Diplomas (DISA, FAFD)", "LL.B (Tax Law)", "Executive MBA"],
        mathematicalIntensity: "Medium (High Arithmetic & Taxation Precision)",
        practicalLabWeight: "2 Years of mandatory practical Articleship training under a practicing FCA",
        whoItSuits: "Highly disciplined students with exceptional stamina for multi-stage professional exams, auditing rules, and tax law.",
        whoMayNotEnjoy: "Students who struggle with self-paced professional exams without fixed classroom schedules.",
      },
      {
        name: "Bachelor of Business Administration + MBA in Finance",
        shortName: "BBA + MBA Finance",
        duration: "BBA: 3 Years | MBA: 2 Years",
        eligibility: "Class 12 (Any stream) for BBA | Graduation in any discipline for MBA",
        coreSubjects: [
          "Corporate Finance & Working Capital Management",
          "Business Valuation & Mergers & Acquisitions",
          "Strategic Management & Marketing Strategy",
          "Financial Markets & Commercial Banking",
        ],
        entranceExams: ["IPMAT (for IIM Integrated 5-Yr MBA)", "CAT", "XAT", "GMAT", "NMAT"],
        approximateFees: "BBA: ₹3L–₹10L | Top MBA: ₹15L–₹28L (IIMs/ISB)",
        careerOptions: ["Investment Banking Associate", "Corporate FP&A Manager", "Management Consultant", "Private Equity Analyst"],
        higherStudies: ["Executive Education", "Doctoral Program in Management (FPM / Ph.D)"],
        mathematicalIntensity: "Medium",
        practicalLabWeight: "Summer corporate internships, live industry capstones, business case competitions",
        whoItSuits: "Students with strong communication, leadership, presentation, and analytical problem-solving skills.",
        whoMayNotEnjoy: "Students seeking low-cost education without taking student educational loans.",
      },
      {
        name: "Chartered Financial Analyst (CFA Institute, USA)",
        shortName: "CFA Charter",
        duration: "2 to 3 Years (Levels 1, 2, 3 alongside graduation / work)",
        eligibility: "Undergraduate degree or in final 2 years of undergraduate study",
        coreSubjects: [
          "Ethical and Professional Standards",
          "Quantitative Methods & Financial Reporting Analysis",
          "Equity Investments & Fixed Income Securities",
          "Derivatives, Alternative Investments & Portfolio Management",
        ],
        entranceExams: ["CFA Level 1, Level 2, Level 3 Computer-Based Exams"],
        approximateFees: "₹2.5L – ₹4.5L (Registration + Exam fees paid in USD)",
        careerOptions: ["Portfolio Manager", "Equity Research Analyst", "Hedge Fund Analyst", "Wealth Manager"],
        higherStudies: ["CFA Charter is globally recognized as the gold standard in asset management"],
        mathematicalIntensity: "High (Financial Mathematics, Time Value, Statistics)",
        practicalLabWeight: "Requires 4,000 hours of qualified professional investment work experience to use the charter",
        whoItSuits: "Students aiming specifically for equity research, mutual fund portfolio management, and global capital markets.",
        whoMayNotEnjoy: "Students seeking statutory legal audit signing rights in India (which only CA provides).",
      },
    ],
    verdictGuidance:
      "Choose CA if you want statutory signing powers, tax mastery, and lowest cost. Choose MBA Finance from a top B-school if you want corporate leadership and high-stakes consulting. Add CFA if your dream is equity research and portfolio management.",
  },

  {
    id: "medical-degrees",
    title: "MBBS vs BDS vs BAMS vs B.Sc Nursing",
    category: "Medical",
    description: "Compare India's healthcare degrees across allopathy, dentistry, Ayurveda, and critical nursing care.",
    degrees: [
      {
        name: "Bachelor of Medicine and Bachelor of Surgery",
        shortName: "MBBS",
        duration: "5.5 Years (4.5 Years Academic + 1 Year Rotating Internship)",
        eligibility: "Class 12 Science with Physics, Chemistry, Biology (PCB) and English (Min 50% marks)",
        coreSubjects: [
          "Human Anatomy, Physiology & Biochemistry",
          "Pathology, Microbiology & Pharmacology",
          "Forensic Medicine & Community Medicine",
          "General Medicine, Surgery, OBGYN, Paediatrics",
        ],
        entranceExams: ["NEET-UG (Mandatory for all government and private medical colleges in India)"],
        approximateFees: "Govt Colleges: ₹50k – ₹3L | Private/Deemed: ₹40L – ₹1.2Cr+",
        careerOptions: ["Medical Officer", "General Physician", "Post-Graduate Residency (MD/MS)", "Hospital Clinician"],
        higherStudies: ["MD / MS (via INI-CET / NEET-PG / NExT)", "DM / M.Ch Super-Speciality"],
        mathematicalIntensity: "Low (Heavy Memorization & Clinical Reasoning)",
        practicalLabWeight: "Intense daily bedside clinical postings, cadaver dissection, operation theatre rotations",
        whoItSuits: "Students with profound empathy, immense academic stamina, and dedication to a 10+ year clinical journey.",
        whoMayNotEnjoy: "Students seeking quick 3-year degree completion and early corporate work hours.",
      },
      {
        name: "Bachelor of Dental Surgery",
        shortName: "BDS",
        duration: "5 Years (4 Years Academic + 1 Year Internship)",
        eligibility: "Class 12 Science PCB (NEET-UG Qualified)",
        coreSubjects: [
          "Dental Anatomy & Oral Histology",
          "Prosthodontics, Crown & Bridge",
          "Oral and Maxillofacial Surgery",
          "Orthodontics & Conservative Dentistry",
        ],
        entranceExams: ["NEET-UG"],
        approximateFees: "Govt Colleges: ₹1L – ₹4L | Private Colleges: ₹10L – ₹25L",
        careerOptions: ["Dental Surgeon", "Orthodontist (post-MDS)", "Cosmetic Dentofacial Specialist", "Private Clinic Owner"],
        higherStudies: ["MDS (Master of Dental Surgery via NEET-MDS)"],
        mathematicalIntensity: "Low",
        practicalLabWeight: "Extensive manual micro-motor dexterity, tooth extraction clinics, denture fabrication",
        whoItSuits: "Students who love manual artistic dexterity, clinical independence, and predictable private practice hours.",
        whoMayNotEnjoy: "Students who dislike fine manual motor work inside oral cavities.",
      },
      {
        name: "Bachelor of Ayurvedic Medicine and Surgery",
        shortName: "BAMS",
        duration: "5.5 Years (4.5 Years + 1 Year Internship)",
        eligibility: "Class 12 Science PCB (NEET-UG Qualified)",
        coreSubjects: [
          "Kriya Sharir (Physiology) & Rachana Sharir (Anatomy)",
          "Dravyaguna Vigyan (Herbal Pharmacology)",
          "Kayachikitsa (Internal Medicine) & Panchakarma",
          "Shalya Tantra (Surgical Techniques)",
        ],
        entranceExams: ["NEET-UG (AYUSH Counselling)"],
        approximateFees: "Govt Colleges: ₹50k – ₹2L | Private Colleges: ₹8L – ₹18L",
        careerOptions: ["Ayurvedic Medical Officer", "Panchakarma Consultant", "Wellness Center Director", "Herbal Pharma R&D"],
        higherStudies: ["MD/MS Ayurveda (via AIAPGET)"],
        mathematicalIntensity: "Low",
        practicalLabWeight: "Panchakarma therapy wards, botanical herbarium extraction, integrated modern clinical diagnosis",
        whoItSuits: "Students interested in holistic natural medicine, Sanskrit classical texts, and integrative healthcare.",
        whoMayNotEnjoy: "Students looking strictly for Western pharmaceutical surgical practice.",
      },
      {
        name: "Bachelor of Science in Nursing",
        shortName: "B.Sc Nursing",
        duration: "4 Years",
        eligibility: "Class 12 PCB (Physics, Chemistry, Biology) + English",
        coreSubjects: [
          "Medical-Surgical Nursing & Emergency ICU Care",
          "Maternal & Child Health Nursing (Midwifery)",
          "Pharmacology & Pathophysiology for Nurses",
          "Community Health & Nursing Administration",
        ],
        entranceExams: ["AIIMS Nursing Entrance", "State Nursing CETs", "NEET-UG (select colleges)"],
        approximateFees: "Govt Colleges: ₹20k – ₹1L | Private Colleges: ₹2L – ₹6L",
        careerOptions: ["Critical Care ICU Nurse", "Operation Theatre Nurse", "AIIMS Nursing Officer (NORCET)", "Overseas Registered Nurse (NCLEX/OET)"],
        higherStudies: ["M.Sc Nursing", "Nurse Practitioner in Critical Care (NPCC)"],
        mathematicalIntensity: "Low",
        practicalLabWeight: "Intense hospital ward rotations, patient telemetry monitoring, IV medication administration",
        whoItSuits: "Compassionate, high-resilience students seeking rapid domestic employment and unmatched global migration opportunities (US, UK, Canada, Australia).",
        whoMayNotEnjoy: "Students who cannot handle high-stress physical shift duties in intensive care units.",
      },
    ],
    verdictGuidance:
      "If you secure top NEET ranks, MBBS remains India's premier clinical medical path. If you want manual clinical art with independent practice, BDS is great. For global international mobility within 4 years, B.Sc Nursing is unmatched.",
  },

  {
    id: "legal-degrees",
    title: "5-Year Integrated BA LLB / BBA LLB vs 3-Year LLB",
    category: "Legal",
    description: "Compare India's primary legal education pathways: direct 5-year integrated law post-12th vs 3-year graduate law.",
    degrees: [
      {
        name: "5-Year Integrated Bachelor of Arts + Bachelor of Laws",
        shortName: "B.A. LL.B (Hons)",
        duration: "5 Years (10 Semesters)",
        eligibility: "Class 12 in any stream (Commerce, Humanities, Science) with minimum 45% marks",
        coreSubjects: [
          "Constitutional Law & Jurisprudence",
          "Criminal Law (BNS/BNSS) & Law of Torts",
          "Political Science, Sociology & Legal History",
          "Civil Procedure Code & Law of Evidence",
          "International Law & Human Rights",
        ],
        entranceExams: ["CLAT-UG (for 24 National Law Universities)", "AILET (NLU Delhi)", "SLAT (Symbiosis)"],
        approximateFees: "NLUs: ₹10L – ₹18L (5 Years total residential) | State Law Colleges: ₹1L – ₹4L",
        careerOptions: ["Litigation Advocate", "Judicial Officer (PCS-J)", "Public Prosecutor", "Civil Service Legal Expert"],
        higherStudies: ["LL.M (via CLAT-PG)", "Ph.D in Law", "Judicial Clerkships"],
        mathematicalIntensity: "Low",
        practicalLabWeight: "Moot court competitions, legal aid clinics, mandatory annual court internships",
        whoItSuits: "Students straight out of Class 12 passionate about constitutional rights, courtroom advocacy, and public policy.",
        whoMayNotEnjoy: "Students unsure about law who prefer exploring broad undergraduate subjects first.",
      },
      {
        name: "5-Year Integrated Bachelor of Business Administration + LL.B",
        shortName: "B.B.A. LL.B (Hons)",
        duration: "5 Years (10 Semesters)",
        eligibility: "Class 12 in any stream (Commerce/Maths beneficial)",
        coreSubjects: [
          "Company Law & Corporate Restructuring",
          "Mergers, Acquisitions & Securities Law (SEBI)",
          "Financial Accounting & Managerial Economics",
          "Intellectual Property Rights & Commercial Arbitration",
          "Contract Drafting & International Trade Law",
        ],
        entranceExams: ["CLAT-UG", "AILET", "SLAT", "LSAT-India"],
        approximateFees: "₹10L – ₹20L total",
        careerOptions: ["Corporate Law Firm Associate", "In-House Legal Counsel", "FinTech Legal Advisor", "Arbitration Specialist"],
        higherStudies: ["LL.M in Corporate & Commercial Law", "MBA in Business Law"],
        mathematicalIntensity: "Low to Medium (Business Accounting & Valuation)",
        practicalLabWeight: "Corporate deal simulations, arbitration moot courts, corporate law firm internships",
        whoItSuits: "Students aspiring for top tier-1 corporate law firms (CAM, SAM, AZB, Trilegal) and corporate M&A deals.",
        whoMayNotEnjoy: "Students who prefer constitutional litigation and trial court criminal law over commercial contracts.",
      },
      {
        name: "3-Year Bachelor of Laws (Post-Graduation)",
        shortName: "3-Year LL.B",
        duration: "3 Years (6 Semesters)",
        eligibility: "Bachelor's degree in any discipline (B.A., B.Sc., B.Com, B.Tech) with min 45–50% marks",
        coreSubjects: [
          "Constitutional Law & Administrative Law",
          "Law of Crimes & Criminal Procedure Code",
          "Property Law & Transfer of Property Act",
          "Drafting, Pleading and Conveyancing",
          "Professional Ethics & Bar-Bench Relations",
        ],
        entranceExams: ["CUET-PG (for Delhi University / BHU Law)", "MH-CET Law (3-Year)", "State Law Entrances"],
        approximateFees: "Govt Faculty of Law (DU/GLC): ₹15k – ₹60k total (Extremely affordable)",
        careerOptions: ["Trial Court Advocate", "Corporate Legal Counsel", "Judicial Officer", "Legal Journalist"],
        higherStudies: ["LL.M", "Judicial Services (PCS-J)"],
        mathematicalIntensity: "Low",
        practicalLabWeight: "Court observations, trial litigation drafting, legal aid defense camps",
        whoItSuits: "Graduates in engineering, science, or commerce who decide to pivot into law with clear mature conviction.",
        whoMayNotEnjoy: "Class 12 school-leavers (ineligible until completing an undergraduate degree).",
      },
    ],
    verdictGuidance:
      "If you are finishing Class 12, the 5-year integrated NLU route (CLAT) saves 1 year and offers superior corporate placements. If you already have a degree or want affordable litigation training, Delhi University or GLC Mumbai's 3-year LL.B is legendary.",
  },
];
