// Shared exam data for ExamTracker and EntranceExams

export interface TrackerExam {
    id: string;
    name: string;
    fullName: string;
    category: "Engineering" | "Medical" | "Law" | "General" | "Design" | "Commerce" | "Civil Services";
    examDate: string;         // YYYY-MM-DD (real upcoming date)
    registrationEnd: string; // YYYY-MM-DD
    link: string;
}

export interface DetailExam {
    name: string;
    fullName: string;
    domain: string[];
    authority: string;
    frequency: string;
    eligibility: string;
    mode: string;
    registrationMonth: string[];
    examMonth: string[];
    resultMonth: string;
    website: string;
    keyFacts: string[];
    ageRange: { min: number; max: number };
    benefits: string[];
    syllabus: string;
}

// ------------------------------------------------------------------
// EXAM TRACKER DATA — with real 2026 dates for live countdowns
// ------------------------------------------------------------------
export const TRACKER_EXAMS: TrackerExam[] = [
    // Engineering
    {
        id: "jee-main-s1",
        name: "JEE Main Session 1",
        fullName: "Joint Entrance Examination (Main) – Session 1",
        category: "Engineering",
        examDate: "2027-01-24",
        registrationEnd: "2026-11-28",
        link: "https://jeemain.nta.ac.in/"
    },
    {
        id: "jee-main-s2",
        name: "JEE Main Session 2",
        fullName: "Joint Entrance Examination (Main) – Session 2",
        category: "Engineering",
        examDate: "2026-04-02",
        registrationEnd: "2026-03-07",
        link: "https://jeemain.nta.ac.in/"
    },
    {
        id: "jee-advanced",
        name: "JEE Advanced",
        fullName: "Joint Entrance Examination (Advanced)",
        category: "Engineering",
        examDate: "2026-05-24",
        registrationEnd: "2026-05-05",
        link: "https://jeeadv.ac.in/"
    },
    {
        id: "bitsat",
        name: "BITSAT",
        fullName: "BITS Admission Test",
        category: "Engineering",
        examDate: "2026-05-22",
        registrationEnd: "2026-04-10",
        link: "https://bitsadmission.com/"
    },
    {
        id: "viteee",
        name: "VITEEE",
        fullName: "VIT Engineering Entrance Examination",
        category: "Engineering",
        examDate: "2026-04-19",
        registrationEnd: "2026-03-31",
        link: "https://viteee.vit.ac.in/"
    },
    {
        id: "wbjee",
        name: "WBJEE",
        fullName: "West Bengal Joint Entrance Examination",
        category: "Engineering",
        examDate: "2026-04-26",
        registrationEnd: "2026-02-28",
        link: "https://wbjeeb.nic.in/"
    },
    {
        id: "kcet",
        name: "KCET",
        fullName: "Karnataka Common Entrance Test",
        category: "Engineering",
        examDate: "2026-04-16",
        registrationEnd: "2026-03-15",
        link: "https://kea.kar.nic.in/"
    },
    {
        id: "mhtcet",
        name: "MHT CET",
        fullName: "Maharashtra Common Entrance Test",
        category: "Engineering",
        examDate: "2026-05-04",
        registrationEnd: "2026-03-20",
        link: "https://cetcell.mahacet.org/"
    },
    {
        id: "srmjeee",
        name: "SRMJEEE",
        fullName: "SRM Joint Engineering Entrance Exam",
        category: "Engineering",
        examDate: "2026-04-15",
        registrationEnd: "2026-04-05",
        link: "https://www.srmist.edu.in/engineering/"
    },
    {
        id: "comedk",
        name: "COMEDK UGET",
        fullName: "Consortium of Medical Engineering and Dental Colleges of Karnataka – UGET",
        category: "Engineering",
        examDate: "2026-05-10",
        registrationEnd: "2026-03-31",
        link: "https://comedk.org/"
    },
    // Medical
    {
        id: "neet-ug",
        name: "NEET UG",
        fullName: "National Eligibility cum Entrance Test (UG)",
        category: "Medical",
        examDate: "2026-05-03",
        registrationEnd: "2026-03-09",
        link: "https://neet.nta.nic.in/"
    },
    {
        id: "neet-pg",
        name: "NEET PG",
        fullName: "National Eligibility cum Entrance Test (PG)",
        category: "Medical",
        examDate: "2026-06-15",
        registrationEnd: "2026-04-30",
        link: "https://nbe.edu.in/"
    },
    {
        id: "aiims-mbbs",
        name: "AIIMS MBBS (via NEET)",
        fullName: "All India Institute of Medical Sciences MBBS",
        category: "Medical",
        examDate: "2026-05-03",
        registrationEnd: "2026-03-09",
        link: "https://aiimsexams.ac.in/"
    },
    {
        id: "pgimer",
        name: "PGIMER",
        fullName: "Post Graduate Institute of Medical Education and Research Entrance",
        category: "Medical",
        examDate: "2026-07-05",
        registrationEnd: "2026-05-31",
        link: "https://pgimer.edu.in/"
    },
    // Law
    {
        id: "clat",
        name: "CLAT",
        fullName: "Common Law Admission Test",
        category: "Law",
        examDate: "2026-12-06",
        registrationEnd: "2026-11-02",
        link: "https://consortiumofnlus.ac.in/"
    },
    {
        id: "ailet",
        name: "AILET",
        fullName: "All India Law Entrance Test",
        category: "Law",
        examDate: "2026-12-06",
        registrationEnd: "2026-10-31",
        link: "https://nludelhi.ac.in/"
    },
    {
        id: "slat",
        name: "SLAT",
        fullName: "Symbiosis Law Admission Test",
        category: "Law",
        examDate: "2026-05-10",
        registrationEnd: "2026-04-20",
        link: "https://www.set-test.org/"
    },
    {
        id: "lsuit",
        name: "LSAT India",
        fullName: "Law School Admission Test India",
        category: "Law",
        examDate: "2027-01-17",
        registrationEnd: "2026-12-31",
        link: "https://discoverlaw.in/"
    },
    // Commerce / MBA
    {
        id: "cat",
        name: "CAT",
        fullName: "Common Admission Test",
        category: "Commerce",
        examDate: "2026-11-29",
        registrationEnd: "2026-09-20",
        link: "https://iimcat.ac.in/"
    },
    {
        id: "xat",
        name: "XAT",
        fullName: "Xavier Aptitude Test",
        category: "Commerce",
        examDate: "2027-01-03",
        registrationEnd: "2026-11-30",
        link: "https://xatonline.in/"
    },
    {
        id: "snap",
        name: "SNAP",
        fullName: "Symbiosis National Aptitude Test",
        category: "Commerce",
        examDate: "2026-12-13",
        registrationEnd: "2026-11-23",
        link: "https://www.snaptest.org/"
    },
    {
        id: "mat",
        name: "MAT",
        fullName: "Management Aptitude Test",
        category: "Commerce",
        examDate: "2026-02-16",
        registrationEnd: "2026-01-31",
        link: "https://www.aima.in/mat"
    },
    {
        id: "cmat",
        name: "CMAT",
        fullName: "Common Management Admission Test",
        category: "Commerce",
        examDate: "2026-03-22",
        registrationEnd: "2026-02-28",
        link: "https://cmat.nta.nic.in/"
    },
    // Design
    {
        id: "nid-dat",
        name: "NID DAT",
        fullName: "National Institute of Design Design Aptitude Test",
        category: "Design",
        examDate: "2027-01-10",
        registrationEnd: "2026-11-28",
        link: "https://admissions.nid.edu/"
    },
    {
        id: "nift",
        name: "NIFT",
        fullName: "National Institute of Fashion Technology Entrance",
        category: "Design",
        examDate: "2026-02-08",
        registrationEnd: "2026-01-06",
        link: "https://nift.ac.in/"
    },
    {
        id: "uceed",
        name: "UCEED",
        fullName: "Undergraduate Common Entrance Examination for Design",
        category: "Design",
        examDate: "2027-01-17",
        registrationEnd: "2026-11-10",
        link: "https://www.uceed.iitb.ac.in/"
    },
    // General
    {
        id: "cuet",
        name: "CUET UG",
        fullName: "Common University Entrance Test (UG)",
        category: "General",
        examDate: "2026-05-15",
        registrationEnd: "2026-03-26",
        link: "https://cuet.samarth.ac.in/"
    },
    {
        id: "cuet-pg",
        name: "CUET PG",
        fullName: "Common University Entrance Test (PG)",
        category: "General",
        examDate: "2026-03-13",
        registrationEnd: "2026-01-31",
        link: "https://cuet.nta.nic.in/cuet-pg"
    },
    {
        id: "du-ldc",
        name: "DU Combined Entrance",
        fullName: "Delhi University Combined Entrance Test",
        category: "General",
        examDate: "2026-06-01",
        registrationEnd: "2026-04-15",
        link: "https://du.ac.in/"
    },
    // Civil Services
    {
        id: "upsc-cse",
        name: "UPSC CSE Prelims",
        fullName: "Civil Services Examination – Prelims",
        category: "Civil Services",
        examDate: "2026-06-07",
        registrationEnd: "2026-03-25",
        link: "https://upsc.gov.in/"
    },
    {
        id: "ssc-cgl",
        name: "SSC CGL",
        fullName: "Combined Graduate Level Examination",
        category: "Civil Services",
        examDate: "2026-09-01",
        registrationEnd: "2026-07-31",
        link: "https://ssc.nic.in/"
    },
    {
        id: "ibps-po",
        name: "IBPS PO",
        fullName: "IBPS Probationary Officer Recruitment",
        category: "Civil Services",
        examDate: "2026-10-04",
        registrationEnd: "2026-08-20",
        link: "https://www.ibps.in/"
    }
];

// ------------------------------------------------------------------
// ENTRANCE EXAM DETAIL DATA — for info/detail page
// ------------------------------------------------------------------
export const DETAIL_EXAMS: DetailExam[] = [
    {
        name: "JEE Main", fullName: "Joint Entrance Examination (Main)",
        domain: ["engineering"], authority: "National Testing Agency (NTA)",
        frequency: "Twice a year (Jan & Apr)", eligibility: "12th PCM, min 75%",
        mode: "CBT (Online)", registrationMonth: ["Nov", "Feb"],
        examMonth: ["Jan", "Apr"], resultMonth: "Feb / May",
        website: "https://jeemain.nta.ac.in",
        keyFacts: ["Gateway to NITs, IIITs, CFTIs", "Qualifier for JEE Advanced", "75 questions, 3 hours", "Negative marking (-1 for wrong MCQ)", "Score is normalised across sessions"],
        ageRange: { min: 16, max: 21 },
        benefits: ["Direct admission to top centrally funded institutes", "Required step to qualify for IIT admissions", "Excellent ROI and placement records post-graduation"],
        syllabus: "Class 11 & 12 Physics, Chemistry, and Mathematics (NCERT based)."
    },
    {
        name: "JEE Advanced", fullName: "Joint Entrance Examination (Advanced)",
        domain: ["engineering"], authority: "IITs (rotating)",
        frequency: "Once a year (May/Jun)", eligibility: "Top 2.5 lakh JEE Main qualifiers",
        mode: "CBT (Online)", registrationMonth: ["Apr"],
        examMonth: ["May"], resultMonth: "Jun",
        website: "https://jeeadv.ac.in",
        keyFacts: ["Gateway to all 23 IITs", "2 papers of 3 hours each", "No fixed marking; varies yearly", "Only 2 attempts allowed", "Most competitive: ~1.7% conversion rate from Main"],
        ageRange: { min: 17, max: 21 },
        benefits: ["Gateway to top IITs in India", "Among the world’s most recognized undergraduate tech degrees", "Highest engineering starting salaries in India"],
        syllabus: "In-depth concepts in Physics, Chemistry, and Mathematics (applications based)."
    },
    {
        name: "NEET UG", fullName: "National Eligibility cum Entrance Test (UG)",
        domain: ["medical"], authority: "National Testing Agency (NTA)",
        frequency: "Once a year (May)", eligibility: "12th PCB, min 50% (Gen)",
        mode: "OMR (Pen & Paper)", registrationMonth: ["Feb–Mar"],
        examMonth: ["May"], resultMonth: "Jun",
        website: "https://neet.nta.nic.in",
        keyFacts: ["Gateway to MBBS, BDS, AYUSH, Nursing", "720 marks total (180×4)", "Negative marking (-1)", "State quota + All India quota seats", "~2 million candidates appear annually"],
        ageRange: { min: 17, max: 25 },
        benefits: ["Single medical entrance for all colleges in India", "Prestige in society as a medical doctor", "Guaranteed high demand career post-studies"],
        syllabus: "Class 11 & 12 Physics, Chemistry, and Biology (Botany & Zoology)."
    },
    {
        name: "NEET PG", fullName: "National Eligibility cum Entrance Test (PG)",
        domain: ["medical"], authority: "National Board of Examinations",
        frequency: "Once a year (Jun/Jul)", eligibility: "MBBS degree, completed internship",
        mode: "CBT (Online)", registrationMonth: ["Apr–May"],
        examMonth: ["Jun"], resultMonth: "Jul",
        website: "https://nbe.edu.in",
        keyFacts: ["Admission to MD/MS/Diploma courses", "200 MCQs, 3.5 hours", "+4 for correct, -1 for wrong", "Eligibility cut-off: 50th percentile (Gen)", "State quota & central counselling"],
        ageRange: { min: 22, max: 35 },
        benefits: ["Opportunity to specialize (Surgeon, Cardiologist, etc.)", "Massive leap in career trajectory and earnings", "Mandatory for senior roles in top hospitals"],
        syllabus: "All subjects covered during the 5.5 years of MBBS course."
    },
    {
        name: "BITSAT", fullName: "BITS Admission Test",
        domain: ["engineering"], authority: "BITS Pilani",
        frequency: "Once a year (May–Jun)", eligibility: "12th PCM min 75%, Physics+Chem+Maths 60%+",
        mode: "CBT (Online)", registrationMonth: ["Jan–Feb"],
        examMonth: ["May", "Jun"], resultMonth: "Jul",
        website: "https://www.bitsadmission.com",
        keyFacts: ["Admission to BITS Pilani/Goa/Hyderabad", "130 questions, 3 hours", "No negative marking for last 12 bonus questions", "12th toppers get direct admission", "English proficiency section included"],
        ageRange: { min: 16, max: 21 },
        benefits: ["Access to tier-1 private engineering campuses", "High flexibility with dual degree programs", "No reservation policy - purely merit based"],
        syllabus: "Physics, Chemistry, Maths, English Proficiency and Logical Reasoning."
    },
    {
        name: "CAT", fullName: "Common Admission Test",
        domain: ["commerce"], authority: "IIMs (rotating)",
        frequency: "Once a year (Nov)", eligibility: "Bachelor's degree 50% (Gen)",
        mode: "CBT (Online)", registrationMonth: ["Aug–Sep"],
        examMonth: ["Nov"], resultMonth: "Jan",
        website: "https://iimcat.ac.in",
        keyFacts: ["Gateway to IIMs + 1500+ MBA colleges", "VARC + DILR + QA sections", "40 TITA (no negative) + 120 MCQ", "Percentile-based shortlisting", "Score valid for 1 year"],
        ageRange: { min: 20, max: 30 },
        benefits: ["Gateway to the prestigious IIMs", "Fast-track entry into top corporate management blocks", "Highest salary packages globally"],
        syllabus: "Verbal Ability & Reading Comprehension, Data Interpretation & Logical Reasoning, Quantitative Ability."
    },
    {
        name: "XAT", fullName: "Xavier Aptitude Test",
        domain: ["commerce"], authority: "XLRI Jamshedpur",
        frequency: "Once a year (Jan)", eligibility: "Bachelor's degree any stream",
        mode: "CBT (Online)", registrationMonth: ["Aug–Nov"],
        examMonth: ["Jan"], resultMonth: "Jan",
        website: "https://xatonline.in",
        keyFacts: ["Admission to XLRI + 150+ business schools", "Decision Making — unique section", "3.5 hours exam + 25 min Essay", "Negative marking for unattempted beyond threshold", "Score valid for 2 years at some institutes"],
        ageRange: { min: 20, max: 30 },
        benefits: ["Direct entry to XLRI (best HR college in India)", "Accepted by many premier B-Schools", "Distinct assessment of decision making capacity"],
        syllabus: "Verbal & Logical Ability, Decision Making, Quantitative Ability & Data Interpretation, General Knowledge."
    },
    {
        name: "CLAT", fullName: "Common Law Admission Test",
        domain: ["law"], authority: "Consortium of NLUs",
        frequency: "Once a year (Dec)", eligibility: "12th pass 45% (Gen)",
        mode: "CBT (Online)", registrationMonth: ["Jul–Nov"],
        examMonth: ["Dec"], resultMonth: "Jan",
        website: "https://consortiumofnlus.ac.in",
        keyFacts: ["Admission to 22 National Law Universities", "120 questions, 2 hours", "Passage-based reading comprehension", "0.25 negative marking", "CLAT PG available for LLM admissions"],
        ageRange: { min: 16, max: 22 },
        benefits: ["Access to India's top National Law Universities", "Paves the way for prestigious legal firm roles", "First step to becoming a prominent judge or advisor"],
        syllabus: "English, Current Affairs, Legal Reasoning, Logical Reasoning, Quantitative Techniques."
    },
    {
        name: "AILET", fullName: "All India Law Entrance Test",
        domain: ["law"], authority: "National Law University Delhi",
        frequency: "Once a year (Dec)", eligibility: "12th pass 50% (Gen)",
        mode: "CBT (Online)", registrationMonth: ["Aug–Oct"],
        examMonth: ["Dec"], resultMonth: "Jan",
        website: "https://nludelhi.ac.in",
        keyFacts: ["Admission to NLU Delhi Only", "150 questions, 1.5 hours", "Section on Legal Aptitude", "Last AILET had ~200 BA LLB seats", "No negative marking"],
        ageRange: { min: 16, max: 22 },
        benefits: ["Direct admission to NLU Delhi", "Smaller, more concentrated batch size", "Exceptional alumni network in standard litigation"],
        syllabus: "English, General Knowledge, Legal Aptitude, Reasoning, Mathematics."
    },
    {
        name: "NIFT", fullName: "National Institute of Fashion Technology Entrance Test",
        domain: ["design"], authority: "National Institute of Fashion Technology",
        frequency: "Once a year (Feb)", eligibility: "12th pass any stream",
        mode: "CBT + Situation Test", registrationMonth: ["Nov–Jan"],
        examMonth: ["Feb"], resultMonth: "Apr",
        website: "https://nift.ac.in",
        keyFacts: ["B.Des, B.FTech admissions", "GAT + CAT (Creative Ability Test)", "Situation test for B.Des candidates", "16 NIFT campuses across India", "Strong industry placements"],
        ageRange: { min: 16, max: 23 },
        benefits: ["Supreme brand recognition in fashion tech", "Strong global connections & placements", "Holistic creative development atmosphere"],
        syllabus: "Quantitative Ability, Communication Ability, English Comprehension, Analytical Ability, General Knowledge & Current Affairs."
    },
    {
        name: "NID DAT", fullName: "National Institute of Design Design Aptitude Test",
        domain: ["design"], authority: "National Institute of Design",
        frequency: "Once a year (Jan)", eligibility: "12th pass any stream",
        mode: "CBT + Studio Test", registrationMonth: ["Oct–Nov"],
        examMonth: ["Jan"], resultMonth: "Apr",
        website: "https://admissions.nid.edu",
        keyFacts: ["B.Des at NID Ahmedabad + campuses", "Design Aptitude Test (DAT) in 2 phases", "Tests visual thinking, creativity", "Portfolio submission required for Studio test", "Highly competitive: ~2000 seats for lakhs of applicants"],
        ageRange: { min: 16, max: 23 },
        benefits: ["Top tier design institute in Asia", "Incredible learning curve through project-based learning", "Direct placements in global tech & design firms"],
        syllabus: "Visual Design, Thematic Color Arrangement, Memory Drawing, Proportions and Perspective."
    },
    {
        name: "UCEED", fullName: "Undergraduate Common Entrance Examination for Design",
        domain: ["design"], authority: "IIT Bombay",
        frequency: "Once a year (Jan)", eligibility: "12th pass any stream, max 2 attempts",
        mode: "CBT (Online)", registrationMonth: ["Oct–Nov"],
        examMonth: ["Jan"], resultMonth: "Mar",
        website: "https://www.uceed.iitb.ac.in",
        keyFacts: ["B.Des admissions to IIT Bombay, IIT Delhi, IIT Guwahati", "Part A: NAT + MSQ; Part B: Drawing", "3 hour exam", "Score is normalised", "25% weightage for 12th marks in final merit"],
        ageRange: { min: 16, max: 23 },
        benefits: ["Study design within elite IIT ecosystems", "Leveraging world-class tech facilities for design", "Excellent prospects in UX/UI & Product Design"],
        syllabus: "Visualization and spatial ability, Observation and design sensitivity, Environmental/Social awareness, Analytical thinking."
    },
    {
        name: "CUET", fullName: "Common University Entrance Test (UG)",
        domain: ["arts", "commerce", "law", "design"], authority: "National Testing Agency (NTA)",
        frequency: "Once a year (May–Jun)", eligibility: "12th pass",
        mode: "CBT (Online)", registrationMonth: ["Feb–Mar"],
        examMonth: ["May", "Jun"], resultMonth: "Jul",
        website: "https://cuet.samarth.ac.in",
        keyFacts: ["Central & State university admissions", "Domain-specific + General Test", "45+ Universities including DU, JNU, BHU", "No minimum marks needed to appear", "Replaces university-specific tests"],
        ageRange: { min: 16, max: 22 },
        benefits: ["Gateway to India's top Central Universities like DU & JNU", "Levels the playing field across different class 12 boards", "Enables students to apply to multiple colleges transparently"],
        syllabus: "Language, Subject-specific domains (NCERT Class 12 basis), and General Test ( जीके, Reasoning, Quant)."
    },
    {
        name: "GATE", fullName: "Graduate Aptitude Test in Engineering",
        domain: ["engineering"], authority: "IITs + IISc (rotating)",
        frequency: "Once a year (Feb)", eligibility: "B.E./B.Tech/B.Sc (Research)",
        mode: "CBT (Online)", registrationMonth: ["Sep–Oct"],
        examMonth: ["Feb"], resultMonth: "Mar",
        website: "https://gate2026.iitkgp.ac.in",
        keyFacts: ["M.Tech admissions to IITs, NITs", "PSU recruitment (BHEL, ONGC, GAIL, etc.)", "Score valid for 3 years", "30 subject papers available", "International students from SAARC countries also eligible"],
        ageRange: { min: 20, max: 28 },
        benefits: ["Direct recruitment in high-paying PSUs (IOCL, NTPC, etc.)", "Direct entry to M.Tech programs in IITs", "Government scholarships (stipend) during post-graduation"],
        syllabus: "General Aptitude, Engineering Mathematics, and core Engineering subjects."
    },
    {
        name: "UPSC CSE", fullName: "Civil Services Examination",
        domain: ["arts"], authority: "Union Public Service Commission",
        frequency: "Once a year (Jun Prelims)", eligibility: "Graduate any discipline, age 21–32",
        mode: "OMR + Written + Interview", registrationMonth: ["Feb–Mar"],
        examMonth: ["Jun", "Sep", "Mar"], resultMonth: "Apr (final)",
        website: "https://upsc.gov.in",
        keyFacts: ["3 stages: Prelims, Mains, Interview", "IAS, IPS, IFS, IRS and 20+ services", "Max 6 attempts (Gen)", "~0.1% selection rate from total applicants", "Optional subject of choice in Mains"],
        ageRange: { min: 21, max: 32 },
        benefits: ["Most prestigious government positions in India (IAS, IPS, IFS)", "Lifetime job security with heavy perks and responsibilities", "Platform to enact real societal change at policy level"],
        syllabus: "Indian History, Geography, Polity, Economics, Environment, Science, General Aptitude & specific Optional Subject."
    },
    {
        name: "CA Foundation", fullName: "Chartered Accountancy Foundation",
        domain: ["commerce"], authority: "ICAI",
        frequency: "Twice a year (May & Nov)", eligibility: "12th pass any stream",
        mode: "OMR + Descriptive", registrationMonth: ["Jan", "Jul"],
        examMonth: ["May", "Nov"], resultMonth: "Jun / Dec",
        website: "https://icai.org",
        keyFacts: ["Entry point to CA career", "4 papers over 4 days", "60% pass marks needed per paper", "Aggregate 50% needed across all papers", "Re-appear in remaining papers if partially cleared"],
        ageRange: { min: 16, max: 25 },
        benefits: ["First step to a lucrative and respected career as a CA", "Open doors to global finance and taxation consulting", "Empowers you to sign off audits for large corporations"],
        syllabus: "Principles of Accounting, Business Laws, Quantitative Aptitude, Business Economics."
    },
    {
        name: "SNAP", fullName: "Symbiosis National Aptitude Test",
        domain: ["commerce"], authority: "Symbiosis International University",
        frequency: "Once a year (Dec) — 3 attempts", eligibility: "Bachelor's degree 50%",
        mode: "CBT (Online)", registrationMonth: ["Aug–Nov"],
        examMonth: ["Dec"], resultMonth: "Jan",
        website: "https://www.snaptest.org",
        keyFacts: ["Admission to Symbiosis institutes", "General English, Analytical, Quantitative sections", "60 min exam, 60 questions", "Best of 3 attempts used", "Used by SIBM, SCMHRD among others"],
        ageRange: { min: 20, max: 30 },
        benefits: ["Entry to premium Symbiosis B-schools", "Multiple attempts permitted, lowering risk", "Highly focused on speed rather than raw mathematical difficulty"],
        syllabus: "General English, Quantitative, Data Interpretation & Data Sufficiency, Analytical & Logical Reasoning."
    },
    {
        name: "VITEEE", fullName: "VIT Engineering Entrance Examination",
        domain: ["engineering"], authority: "VIT University",
        frequency: "Once a year (Apr)", eligibility: "12th PCM min 70%",
        mode: "CBT (Online)", registrationMonth: ["Nov–Mar"],
        examMonth: ["Apr"], resultMonth: "May",
        website: "https://viteee.vit.ac.in",
        keyFacts: ["Admission to VIT campuses (Vellore, Chennai, AP, Bhopal)", "125 questions, 2.5 hours", "No negative marking", "Slot booking by merit basis", "Strong global placement record"],
        ageRange: { min: 16, max: 21 },
        benefits: ["Access to one of the most proactive placement cells in India", "World class campus infrastructure", "Strong emphasis on IT and software disciplines"],
        syllabus: "Physics, Chemistry, Mathematics, English, Aptitude."
    },
    {
        name: "WBJEE", fullName: "West Bengal Joint Entrance Examination",
        domain: ["engineering", "medical"], authority: "WBJEEB",
        frequency: "Once a year (Apr)", eligibility: "12th PCM 45%",
        mode: "OMR (Paper-based)", registrationMonth: ["Jan–Feb"],
        examMonth: ["Apr"], resultMonth: "Jun",
        website: "https://wbjeeb.nic.in",
        keyFacts: ["Engineering & pharmacy colleges in West Bengal", "Mathematics & Biology for medical", "3-hour exam", "Category A and B questions", "Negative marking applicable"],
        ageRange: { min: 16, max: 21 },
        benefits: ["Gateway to highly ranked state colleges like Jadavpur University", "Very low fee structures relative to private colleges", "Excellent core engineering domains"],
        syllabus: "Physics, Chemistry, and Mathematics (State and CBSC board level)."
    },
    {
        name: "SSC CGL", fullName: "Combined Graduate Level Examination",
        domain: ["arts", "commerce"], authority: "Staff Selection Commission",
        frequency: "Once a year (Sep–Oct)", eligibility: "Graduate any discipline, age 18–32",
        mode: "CBT (Online) + Descriptor", registrationMonth: ["Jun–Jul"],
        examMonth: ["Sep", "Oct"], resultMonth: "Jan",
        website: "https://ssc.nic.in",
        keyFacts: ["Central Government Group B & C posts", "4 Tiers: Exam → Descriptive → Skill → Medical", "Posts include Income Tax Inspector, CBI Sub-Inspector etc.", "Normalisation applied across sessions", "Highly competitive: 30 lakh+ applicants annually"],
        ageRange: { min: 18, max: 32 },
        benefits: ["Respectable Group B and C posts in ministries", "Immense job security and reliable promotions", "Great work-life balance compared to corporate counterparts"],
        syllabus: "General Intelligence & Reasoning, General Awareness, Quantitative Aptitude, English Comprehension."
    },
    {
        name: "IBPS PO", fullName: "IBPS Probationary Officer Recruitment",
        domain: ["commerce"], authority: "Institute of Banking Personnel Selection",
        frequency: "Once a year (Oct)", eligibility: "Graduate any discipline, age 20–30",
        mode: "CBT (Online)", registrationMonth: ["Jul–Aug"],
        examMonth: ["Oct", "Nov"], resultMonth: "Dec",
        website: "https://www.ibps.in",
        keyFacts: ["Recruitment to 11 nationalised banks as PO", "Prelims + Mains + Interview", "Rs 23,700+ starting salary", "Negative marking in Prelims and Mains", "Posting anywhere in India"],
        ageRange: { min: 20, max: 30 },
        benefits: ["Fast track career progression in national banks", "Excellent loan and housing perks as bankers", "Social security and central bank-aligned stability"],
        syllabus: "English Language, Quantitative Aptitude, Reasoning Ability, General Awareness, Computer Knowledge."
    }
];
