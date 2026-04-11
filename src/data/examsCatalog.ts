export type ExamCatalogItem = {
  id: string;
  name: string;
  authority: string;
  officialWebsite: string;
  officialNoticeUrl: string;
  applyUrl: string;
  lastVerifiedOn: string;
  upcomingExamDate?: string;
  registrationWindow: string;
  correctionWindow?: string;
  examWindow: string;
  resultWindow: string;
  attempts: string;
  examMode?: string;
  feeInfo?: string;
  officialSupport?: string;
  eligibilitySnapshot?: string[];
  documentsChecklist?: string[];
  thingsToKnow: string[];
  howToApply: string[];
  commonMistakes?: string[];
  afterExamSteps?: string[];
  prepPriorities?: string[];
  whoShouldChoose?: string[];
  pathways: string[];
};

const BASE_EXAMS_CATALOG: ExamCatalogItem[] = [
  {
    id: "jee-main",
    name: "JEE Main",
    authority: "National Testing Agency (NTA)",
    officialWebsite: "https://jeemain.nta.ac.in/",
    officialNoticeUrl: "https://jeemain.nta.ac.in/information-bulletin/",
    applyUrl: "https://jeemain.nta.ac.in/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "Session-wise (typically Nov-Jan and Feb-Mar)",
    examWindow: "Session 1: Jan; Session 2: Apr",
    resultWindow: "Usually within 1-2 weeks per session",
    attempts: "2 sessions/year; max 3 consecutive years after Class 12",
    thingsToKnow: [
      "Use only nta.ac.in / jeemain.nta.ac.in notices for final deadlines.",
      "Category certificates and photo/signature specs are strict.",
      "Keep application number and registered email/mobile secure."
    ],
    howToApply: [
      "Open official JEE Main portal and read latest information bulletin.",
      "Register with valid email/mobile and create password.",
      "Fill form, upload documents, and verify all details before final submit.",
      "Pay fee using official payment gateway and download confirmation page."
    ],
    prepPriorities: [
      "Master NCERT basics in Physics, Chemistry, and Math before advanced sets.",
      "Take timed mocks weekly and analyze mistakes chapter-wise.",
      "Revise formulas and high-weight topics with a fixed weekly cycle."
    ],
    whoShouldChoose: [
      "Students targeting NIT/IIIT and top engineering colleges.",
      "Students comfortable with PCM and objective questions.",
      "Students planning to attempt JEE Advanced after Main."
    ],
    pathways: ["B.Tech", "B.E.", "B.Arch (with Paper 2)", "B.Plan", "NIT/IIIT admissions", "JEE Advanced eligibility"]
  },
  {
    id: "jee-advanced",
    name: "JEE Advanced",
    authority: "IITs (through designated organizing IIT)",
    officialWebsite: "https://jeeadv.ac.in/",
    officialNoticeUrl: "https://jeeadv.ac.in/",
    applyUrl: "https://jeeadv.ac.in/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "After JEE Main ranks are released",
    examWindow: "Typically May-June",
    resultWindow: "Usually 2-3 weeks after exam",
    attempts: "As per latest IIT rules (check current bulletin)",
    thingsToKnow: [
      "Only eligible JEE Main candidates can register.",
      "Exam pattern can change yearly; read current syllabus and sample paper notices.",
      "Seat allocation happens through JoSAA after results."
    ],
    howToApply: [
      "Check eligibility and rank cutoff announcement on official website.",
      "Login with JEE Main credentials and complete advanced registration.",
      "Upload required category and identity documents.",
      "Pay registration fee and download admit card when released."
    ],
    pathways: ["IIT B.Tech", "IIT Dual Degree", "IIT B.S.", "Top research and engineering tracks"]
  },
  {
    id: "neet-ug",
    name: "NEET UG",
    authority: "National Testing Agency (NTA)",
    officialWebsite: "https://neet.nta.nic.in/",
    officialNoticeUrl: "https://neet.nta.nic.in/information-bulletin/",
    applyUrl: "https://neet.nta.nic.in/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "Typically Feb-Mar",
    examWindow: "Typically May",
    resultWindow: "Usually June",
    attempts: "No fixed attempt cap currently; subject to latest NMC/NTA rules",
    thingsToKnow: [
      "Single-window exam for MBBS/BDS and many allied courses.",
      "Class 12 PCB eligibility criteria must be satisfied.",
      "Counselling is separate after results (All India + State)."
    ],
    howToApply: [
      "Read official information bulletin and eligibility rules carefully.",
      "Register on official portal and complete profile details.",
      "Upload photo, signature, and documents exactly as per format.",
      "Pay fee, submit, and keep confirmation PDF for counselling."
    ],
    prepPriorities: [
      "Study NCERT Biology line-by-line with regular active recall.",
      "Practice Physics numericals and Chemistry MCQs in timed sessions.",
      "Use full mocks to improve accuracy and reduce negative marking."
    ],
    whoShouldChoose: [
      "Students aiming for MBBS/BDS/AYUSH and allied medical programs.",
      "Students with strong PCB fundamentals.",
      "Students ready for consistent mock-and-revision preparation."
    ],
    pathways: ["MBBS", "BDS", "BAMS", "BHMS", "BUMS", "BSMS", "BVSc & AH (as notified)"]
  },
  {
    id: "cuet-ug",
    name: "CUET UG",
    authority: "National Testing Agency (NTA)",
    officialWebsite: "https://cuet.nta.nic.in/",
    officialNoticeUrl: "https://cuet.nta.nic.in/",
    applyUrl: "https://cuet.nta.nic.in/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "Typically Feb-Apr",
    examWindow: "Typically May-June",
    resultWindow: "Usually July",
    attempts: "Yearly examination cycle",
    thingsToKnow: [
      "Subject mapping must match target university course requirements.",
      "Each university has its own counselling/admission process after scores.",
      "Domain subject choice mistakes can affect eligibility."
    ],
    howToApply: [
      "Check subject requirements for each target university/program.",
      "Register on CUET portal and select correct language/domain/general tests.",
      "Upload documents and pay applicable fee.",
      "Track exam city slip, admit card, and university counselling notices."
    ],
    pathways: ["Central University UG admissions", "B.Sc", "B.Com", "B.A.", "Interdisciplinary UG programs"]
  },
  {
    id: "clat-ug",
    name: "CLAT UG",
    authority: "Consortium of NLUs",
    officialWebsite: "https://consortiumofnlus.ac.in/",
    officialNoticeUrl: "https://consortiumofnlus.ac.in/clat-2026/",
    applyUrl: "https://consortiumofnlus.ac.in/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "Typically Jul-Oct",
    correctionWindow: "Limited correction window after form close (as notified)",
    examWindow: "Typically Dec",
    resultWindow: "Usually within a few weeks",
    attempts: "As per latest consortium eligibility rules",
    examMode: "Computer-based objective test (English, GK/Current Affairs, Legal Reasoning, Logical Reasoning, Quantitative Techniques)",
    feeInfo: "Application fee is category-based (typically lower for SC/ST/BPL). NLU counselling fee is separate.",
    officialSupport: "Use Consortium helpdesk, candidate login notifications, and official FAQs only.",
    eligibilitySnapshot: [
      "Class 12 pass/appearing students can apply as per current notification",
      "Minimum qualifying percentage depends on category and official rulebook",
      "Check reservation, domicile, and NLU-specific seat rules before counselling",
    ],
    documentsChecklist: [
      "Passport-size photo and signature in exact format",
      "Class 10 and Class 12 details/marks",
      "Valid photo ID and active email/mobile",
      "Category/PwD certificates (if claiming reservation)",
      "Payment receipt and submitted application copy",
    ],
    thingsToKnow: [
      "CLAT mainly covers 5-year integrated law admissions in participating NLUs.",
      "Counselling preference order is critical; wrong order can cost better options.",
      "Keep backup exams like AILET and college-specific law tests in your plan.",
      "Read each NLU's fee structure and seat matrix before locking choices."
    ],
    howToApply: [
      "Create account on Consortium portal and verify email/mobile.",
      "Fill profile, education, and reservation details exactly as per documents.",
      "Upload files in required size/format and complete payment.",
      "Download confirmation page and keep login credentials secure.",
      "After result, register for counselling and lock NLU preferences carefully."
    ],
    commonMistakes: [
      "Leaving counselling registration for the last day",
      "Random NLU preference order without checking rank trends and fees",
      "Mismatch in name/category details vs uploaded certificates",
      "Ignoring counselling rounds and document verification deadlines",
    ],
    afterExamSteps: [
      "Download scorecard and check official rank list",
      "Register for counselling immediately and pay counselling fee",
      "Prepare realistic NLU preference list based on rank and priorities",
      "Keep originals and scanned copies ready for admission verification",
    ],
    prepPriorities: [
      "Practice reading comprehension and legal reasoning daily under time limits.",
      "Track current affairs with weekly revision notes.",
      "Take sectional and full mocks to improve attempt strategy."
    ],
    whoShouldChoose: [
      "Students targeting integrated 5-year law programs in NLUs.",
      "Students strong in reading speed and reasoning.",
      "Students ready to handle counselling preference decisions carefully."
    ],
    pathways: ["BA LLB (Hons)", "BBA LLB", "Integrated law programs", "Law careers"]
  },
  {
    id: "upsc-cse",
    name: "UPSC Civil Services Examination",
    authority: "Union Public Service Commission",
    officialWebsite: "https://www.upsc.gov.in/",
    officialNoticeUrl: "https://upsconline.nic.in/",
    applyUrl: "https://upsconline.nic.in/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "Typically Jan-Feb for prelims cycle",
    examWindow: "Prelims: May-Jun; Mains: Sep; Interview: next year",
    resultWindow: "Final list usually released in following year",
    attempts: "Depends on category; check current UPSC notification",
    thingsToKnow: [
      "3-stage process: Prelims, Mains, Interview.",
      "Age limits and attempts vary by category and are strictly enforced.",
      "Only official notification PDF defines valid rules each year."
    ],
    howToApply: [
      "Read annual CSE notification on upsc.gov.in.",
      "Complete One-Time Registration (OTR) on UPSC portal.",
      "Submit CSE form, choose exam center and optional details as required.",
      "Download e-admit card and preserve all acknowledgement details."
    ],
    prepPriorities: [
      "Build NCERT and standard-book foundation before advanced prep.",
      "Practice Prelims MCQs and Mains answer writing in parallel.",
      "Create a monthly current-affairs revision and test routine."
    ],
    whoShouldChoose: [
      "Graduates targeting IAS, IPS, IFS, and other civil services.",
      "Students ready for a long-term, disciplined preparation cycle.",
      "Students comfortable with a 3-stage exam process."
    ],
    pathways: ["IAS", "IPS", "IFS", "IRS", "Central Services Group A/B"]
  },
  {
    id: "ailet",
    name: "AILET",
    authority: "National Law University, Delhi",
    officialWebsite: "https://nationallawuniversitydelhi.in/",
    officialNoticeUrl: "https://nationallawuniversitydelhi.in/ailet",
    applyUrl: "https://nationallawuniversitydelhi.in/ailet",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "Typically Aug-Nov",
    correctionWindow: "Short correction window (if announced by NLU Delhi)",
    examWindow: "Typically Dec",
    resultWindow: "Usually within 2-4 weeks",
    attempts: "As per NLU Delhi notification",
    examMode: "Computer-based objective test for NLU Delhi admissions",
    feeInfo: "Application fee is category-based; counselling/admission payments are separate.",
    officialSupport: "Use NLU Delhi admissions portal notices and helpdesk contacts only.",
    eligibilitySnapshot: [
      "Class 12 pass/appearing candidates can apply for BA LLB (Hons), as notified",
      "Eligibility percentages and age policies are as per latest AILET brochure",
      "Reservation and supernumerary seats follow NLU Delhi rules",
    ],
    documentsChecklist: [
      "Recent passport-size photo and signature",
      "Class 10/12 details",
      "Valid ID proof and active mobile/email",
      "Category/PwD/EWS certificate (if applicable)",
      "Payment proof and final submitted form",
    ],
    thingsToKnow: [
      "Separate exam from CLAT for NLU Delhi admissions.",
      "Eligibility and reservation categories are notification-driven.",
      "Counselling timelines are tight; monitor portal notices closely.",
      "AILET and CLAT preparation overlap, but pattern and cutoffs differ."
    ],
    howToApply: [
      "Open AILET admission portal and read latest brochure.",
      "Complete registration with valid email and mobile number.",
      "Fill personal, category, and qualification details accurately.",
      "Pay fee and keep submitted application PDF.",
      "Track admit card, answer key notices, and counselling schedule."
    ],
    commonMistakes: [
      "Assuming CLAT and AILET timelines are identical",
      "Not checking NLU Delhi-specific eligibility and reservation rules",
      "Missing correction/admit card windows",
      "Late response during counselling/document verification",
    ],
    afterExamSteps: [
      "Download scorecard and check NLU Delhi merit updates",
      "Complete counselling and seat confirmation actions on time",
      "Keep originals ready for document verification",
      "Keep backup law college options ready in parallel",
    ],
    pathways: ["BA LLB (Hons) at NLU Delhi", "LLM (as notified)", "Law careers"]
  },
  {
    id: "cuet-pg",
    name: "CUET PG",
    authority: "National Testing Agency (NTA)",
    officialWebsite: "https://pgcuet.samarth.ac.in/",
    officialNoticeUrl: "https://pgcuet.samarth.ac.in/",
    applyUrl: "https://pgcuet.samarth.ac.in/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "Typically Dec-Feb",
    examWindow: "Typically Mar-Apr",
    resultWindow: "Usually Apr-May",
    attempts: "Yearly cycle",
    thingsToKnow: [
      "Course-specific test papers vary by university and subject.",
      "Admission counselling is done separately by participating universities.",
      "Read both CUET PG and target university eligibility criteria."
    ],
    howToApply: [
      "Check exam paper code for intended PG program.",
      "Register and fill academic details on official CUET PG portal.",
      "Upload documents and complete payment.",
      "Track admit card, scorecard, and university counselling schedules."
    ],
    pathways: ["MA", "MSc", "MCom", "PG professional programs"]
  },
  {
    id: "gate",
    name: "GATE",
    authority: "IITs and IISc (rotational conducting institute)",
    officialWebsite: "https://gate2026.iitk.ac.in/",
    officialNoticeUrl: "https://gate2026.iitk.ac.in/",
    applyUrl: "https://goaps.iisc.ac.in/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "Typically Aug-Oct",
    examWindow: "Typically Feb",
    resultWindow: "Usually Mar",
    attempts: "Yearly cycle",
    thingsToKnow: [
      "Used for MTech admissions and many PSU recruitment pipelines.",
      "Paper code and eligibility rules must match your qualification.",
      "Score validity is usually multiple years for admissions."
    ],
    howToApply: [
      "Create account on GOAPS portal and verify details.",
      "Select paper code, exam city, and upload required files.",
      "Pay fee and submit application.",
      "Download admit card and preserve scorecard."
    ],
    prepPriorities: [
      "Prioritize core subjects plus engineering mathematics.",
      "Solve previous-year questions paper-wise and topic-wise.",
      "Use mocks to improve speed, accuracy, and calculator use."
    ],
    whoShouldChoose: [
      "Students targeting MTech/ME admissions in IITs/IISc/top institutes.",
      "Students exploring PSU roles where GATE score is accepted.",
      "Graduates with strong discipline-specific technical basics."
    ],
    pathways: ["MTech", "ME", "PSU jobs (as notified)", "Research programs"]
  },
  {
    id: "iit-jam",
    name: "IIT JAM",
    authority: "IITs (rotational conducting institute)",
    officialWebsite: "https://jam2026.iitb.ac.in/",
    officialNoticeUrl: "https://jam2026.iitb.ac.in/",
    applyUrl: "https://jam2026.iitb.ac.in/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "Typically Sep-Oct",
    examWindow: "Typically Feb",
    resultWindow: "Usually Mar",
    attempts: "Yearly cycle",
    thingsToKnow: [
      "For MSc and related PG science admissions in IITs and participating institutes.",
      "Admission choice filling is separate after result declaration.",
      "Subject-specific eligibility applies for each program."
    ],
    howToApply: [
      "Read JAM brochure for subject-wise eligibility and syllabus.",
      "Register on official JAM portal.",
      "Submit exam form with correct paper choice and documents.",
      "After result, complete admission form and preference filling."
    ],
    pathways: ["MSc", "Joint MSc-PhD", "Integrated PG science tracks"]
  },
  {
    id: "cat",
    name: "CAT",
    authority: "IIMs (conducting institute varies yearly)",
    officialWebsite: "https://iimcat.ac.in/",
    officialNoticeUrl: "https://iimcat.ac.in/",
    applyUrl: "https://iimcat.ac.in/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "Typically Aug-Sep",
    examWindow: "Typically Nov",
    resultWindow: "Usually Jan",
    attempts: "Yearly cycle",
    thingsToKnow: [
      "Score acceptance differs by institute and program.",
      "Final admissions include GD/PI/WAT in many institutes.",
      "Work experience and profile can affect final calls."
    ],
    howToApply: [
      "Create candidate profile on CAT portal.",
      "Fill academic and work details carefully.",
      "Select preferred test cities and pay fee.",
      "Download admit card and track result and institute shortlists."
    ],
    prepPriorities: [
      "Build sectional plans for VARC, DILR, and QA.",
      "Take mocks consistently and analyze percentile trends by section.",
      "Improve question selection and time management under pressure."
    ],
    whoShouldChoose: [
      "Students aiming for IIMs and top MBA/PGDM institutes.",
      "Students comfortable with aptitude and logic-heavy exams.",
      "Students ready for post-exam interviews and profile rounds."
    ],
    pathways: ["MBA/PGDM", "Management roles", "Consulting and business analytics"]
  },
  {
    id: "xat",
    name: "XAT",
    authority: "XLRI Jamshedpur",
    officialWebsite: "https://xatonline.in/",
    officialNoticeUrl: "https://xatonline.in/",
    applyUrl: "https://xatonline.in/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "Typically Jul-Nov",
    examWindow: "Typically Jan",
    resultWindow: "Usually Jan-Feb",
    attempts: "Yearly cycle",
    thingsToKnow: [
      "Accepted by XLRI and multiple business schools.",
      "Sectional and overall cutoffs differ by institute.",
      "GK section may be used differently across admission processes."
    ],
    howToApply: [
      "Register at official XAT portal.",
      "Fill profile and preferred exam city.",
      "Pay fee and keep payment receipt.",
      "Download admit card and check score release updates."
    ],
    pathways: ["MBA/PGDM", "HR management", "Business management"]
  },
  {
    id: "nift",
    name: "NIFT Entrance Exam",
    authority: "National Institute of Fashion Technology",
    officialWebsite: "https://www.nift.ac.in/",
    officialNoticeUrl: "https://www.nift.ac.in/admissions",
    applyUrl: "https://www.nift.ac.in/admissions",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "Typically Nov-Jan",
    examWindow: "Typically Feb",
    resultWindow: "Usually Mar-Apr",
    attempts: "As per NIFT eligibility rules",
    thingsToKnow: [
      "Different components: CAT, GAT, and situation/portfolio rounds.",
      "Program-wise eligibility differs for UG and PG.",
      "Keep design portfolio preparation timeline realistic."
    ],
    howToApply: [
      "Read admission prospectus on NIFT official site.",
      "Register and complete exam form with correct program selection.",
      "Upload documents and pay exam fee.",
      "Track admit card and later stage test/interview announcements."
    ],
    pathways: ["Fashion Design", "Fashion Communication", "Accessory Design", "Design careers"]
  },
  {
    id: "nid-dat",
    name: "NID DAT",
    authority: "National Institute of Design",
    officialWebsite: "https://admissions.nid.edu/",
    officialNoticeUrl: "https://admissions.nid.edu/",
    applyUrl: "https://admissions.nid.edu/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "Typically Sep-Nov",
    examWindow: "Prelims: Dec-Jan; Mains: Mar-Apr",
    resultWindow: "Usually after each stage",
    attempts: "As per NID eligibility conditions",
    thingsToKnow: [
      "Two-stage process: DAT Prelims and DAT Mains.",
      "Program and campus choices impact seat availability.",
      "Portfolio and studio test preparation is important."
    ],
    howToApply: [
      "Register on official NID admissions portal.",
      "Fill application details and upload required files.",
      "Pay fees and download acknowledgement.",
      "Attend Prelims and eligible Mains rounds as scheduled."
    ],
    pathways: ["B.Des", "M.Des", "Product design", "UX and communication design"]
  },
  {
    id: "uceed",
    name: "UCEED",
    authority: "IIT Bombay (for UCEED)",
    officialWebsite: "https://www.uceed.iitb.ac.in/",
    officialNoticeUrl: "https://www.uceed.iitb.ac.in/",
    applyUrl: "https://www.uceed.iitb.ac.in/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "Typically Oct-Nov",
    examWindow: "Typically Jan",
    resultWindow: "Usually Mar",
    attempts: "As per latest UCEED rules",
    thingsToKnow: [
      "Used for B.Des admissions in participating institutes.",
      "Seat allotment process is separate after score declaration.",
      "Eligibility and age rules are strict."
    ],
    howToApply: [
      "Register at official UCEED portal.",
      "Complete exam form with academic and category details.",
      "Pay fee and save confirmation.",
      "After result, complete B.Des admission application process."
    ],
    pathways: ["B.Des", "Industrial design", "Interaction design"]
  },
  {
    id: "ceed",
    name: "CEED",
    authority: "IIT Bombay (for CEED)",
    officialWebsite: "https://www.ceed.iitb.ac.in/",
    officialNoticeUrl: "https://www.ceed.iitb.ac.in/",
    applyUrl: "https://www.ceed.iitb.ac.in/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "Typically Oct-Nov",
    examWindow: "Typically Jan",
    resultWindow: "Usually Mar",
    attempts: "Yearly cycle",
    thingsToKnow: [
      "Used for M.Des and design PG admissions in participating institutes.",
      "Scorecard alone does not guarantee admission; studio/interview can apply.",
      "Portfolio quality strongly influences final selection."
    ],
    howToApply: [
      "Register on CEED portal and submit application.",
      "Upload documents and complete payment.",
      "Appear for CEED written exam.",
      "Apply separately to design institutes after result."
    ],
    pathways: ["M.Des", "Design PG specialization", "UX and product design"]
  },
  {
    id: "nda",
    name: "NDA & NA Examination",
    authority: "Union Public Service Commission",
    officialWebsite: "https://www.upsc.gov.in/",
    officialNoticeUrl: "https://upsconline.nic.in/",
    applyUrl: "https://upsconline.nic.in/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "NDA I: Dec-Jan; NDA II: May-Jun (typical)",
    examWindow: "NDA I: Apr; NDA II: Sep",
    resultWindow: "Written result usually in 1-2 months",
    attempts: "As per age and eligibility limits in UPSC notice",
    thingsToKnow: [
      "Includes written exam and SSB interview stages.",
      "Medical standards are strict and role-specific.",
      "Check latest age/date-of-birth criteria carefully."
    ],
    howToApply: [
      "Complete OTR and NDA form on UPSC online portal.",
      "Select preferred exam center and submit application.",
      "Download admit card before exam.",
      "If qualified, follow SSB call letter instructions."
    ],
    pathways: ["Army officer training", "Navy officer training", "Air Force officer training"]
  },
  {
    id: "cds",
    name: "CDS Examination",
    authority: "Union Public Service Commission",
    officialWebsite: "https://www.upsc.gov.in/",
    officialNoticeUrl: "https://upsconline.nic.in/",
    applyUrl: "https://upsconline.nic.in/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "CDS I/II forms released twice yearly",
    examWindow: "Typically Apr and Sep",
    resultWindow: "Written result usually in 1-2 months",
    attempts: "As per age and academy eligibility criteria",
    thingsToKnow: [
      "Entry depends on academy and graduation stream.",
      "Written + SSB + medical stages apply.",
      "Physical fitness preparation should start early."
    ],
    howToApply: [
      "Apply through UPSC portal during active notification window.",
      "Choose academy preference as per eligibility.",
      "Download admit card and appear for written exam.",
      "Track SSB call-up and final merit list updates."
    ],
    pathways: ["IMA", "INA", "AFA", "OTA"]
  },
  {
    id: "ssc-cgl",
    name: "SSC CGL",
    authority: "Staff Selection Commission",
    officialWebsite: "https://ssc.gov.in/",
    officialNoticeUrl: "https://ssc.gov.in/",
    applyUrl: "https://ssc.gov.in/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "Typically annual notification cycle",
    examWindow: "Tier I/II as scheduled by SSC",
    resultWindow: "Tier-wise results over multiple months",
    attempts: "Subject to age and post eligibility",
    thingsToKnow: [
      "Multiple tiers; syllabus and post preferences matter.",
      "Post-specific physical/skill tests may apply.",
      "Document verification is strict."
    ],
    howToApply: [
      "Create account on SSC portal and complete profile.",
      "Apply for CGL when notification opens.",
      "Pay fee and download admit card by region.",
      "Track tier-wise result and post allocation updates."
    ],
    pathways: ["Central government Group B/C posts", "Income Tax", "Audit", "Ministry roles"]
  },
  {
    id: "ssc-chsl",
    name: "SSC CHSL",
    authority: "Staff Selection Commission",
    officialWebsite: "https://ssc.gov.in/",
    officialNoticeUrl: "https://ssc.gov.in/",
    applyUrl: "https://ssc.gov.in/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "Typically annual cycle",
    examWindow: "Tier I/II as notified",
    resultWindow: "Tier-wise across the cycle",
    attempts: "As per age and eligibility criteria",
    thingsToKnow: [
      "Primarily for 12th-pass level central government roles.",
      "Typing/skill test can be qualifying requirement.",
      "Keep identity and education documents ready."
    ],
    howToApply: [
      "Register on SSC portal and apply for CHSL.",
      "Complete fee payment and exam city preference.",
      "Download admit card region-wise.",
      "Appear in tiers and complete document verification."
    ],
    pathways: ["LDC", "JSA", "DEO", "Central clerical roles"]
  },
  {
    id: "ibps-po",
    name: "IBPS PO",
    authority: "Institute of Banking Personnel Selection",
    officialWebsite: "https://www.ibps.in/",
    officialNoticeUrl: "https://www.ibps.in/",
    applyUrl: "https://www.ibps.in/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "Typically Aug-Sep",
    examWindow: "Prelims: Oct; Mains: Nov (typical)",
    resultWindow: "Stage-wise over several months",
    attempts: "As per age and category limits",
    thingsToKnow: [
      "Three phases: Prelims, Mains, Interview.",
      "Negative marking rules apply.",
      "Provisional allotment depends on vacancies and preferences."
    ],
    howToApply: [
      "Register and fill PO form on IBPS portal.",
      "Upload documents and complete payment.",
      "Download call letters for each stage.",
      "Attend interview and track final allotment."
    ],
    pathways: ["Probationary Officer", "Public sector banking career"]
  },
  {
    id: "sbi-po",
    name: "SBI PO",
    authority: "State Bank of India",
    officialWebsite: "https://sbi.co.in/",
    officialNoticeUrl: "https://sbi.co.in/web/careers",
    applyUrl: "https://sbi.co.in/web/careers",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "Typically Sep-Oct",
    examWindow: "Prelims/Mains as notified",
    resultWindow: "Stage-wise over recruitment cycle",
    attempts: "As per SBI recruitment notification",
    thingsToKnow: [
      "Prelims, Mains, and interview/group exercise stages can apply.",
      "Official SBI careers page is the final authority.",
      "Category-wise cutoffs vary each cycle."
    ],
    howToApply: [
      "Open SBI careers recruitment notification.",
      "Register and submit online application.",
      "Pay fee and keep acknowledgment details.",
      "Download admit card for each stage and monitor updates."
    ],
    pathways: ["Probationary Officer at SBI", "Banking operations and management"]
  },
  {
    id: "ca-foundation",
    name: "CA Foundation",
    authority: "Institute of Chartered Accountants of India (ICAI)",
    officialWebsite: "https://www.icai.org/",
    officialNoticeUrl: "https://www.icai.org/post.html?post_id=16173",
    applyUrl: "https://eservices.icai.org/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "Exam form windows vary by attempt",
    examWindow: "Typically May/Jun and Nov/Dec sessions",
    resultWindow: "Usually within 6-8 weeks",
    attempts: "Multiple attempts as per ICAI scheme",
    thingsToKnow: [
      "Registration and exam forms are separate steps.",
      "Syllabus and paper pattern may update under new scheme.",
      "Article training starts after intermediate level progression."
    ],
    howToApply: [
      "Register under Foundation course via ICAI portal.",
      "Complete exam form when session window opens.",
      "Pay fees and verify center details.",
      "Download admit card and preserve result records."
    ],
    pathways: ["CA Intermediate", "CA Final", "Audit and finance careers"]
  },
  {
    id: "cma-foundation",
    name: "CMA Foundation",
    authority: "Institute of Cost Accountants of India",
    officialWebsite: "https://icmai.in/",
    officialNoticeUrl: "https://icmai.in/studentswebsite/",
    applyUrl: "https://icmai.in/studentswebsite/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "As notified each session",
    examWindow: "Typically Jun and Dec",
    resultWindow: "Usually within 1-2 months",
    attempts: "As per ICMAI rules",
    thingsToKnow: [
      "Registration deadlines and exam form deadlines are separate.",
      "CMA route includes intermediate and final levels.",
      "Training requirements apply for final qualification."
    ],
    howToApply: [
      "Register for CMA Foundation on student portal.",
      "Fill exam form in active exam cycle.",
      "Pay fees and keep confirmation receipt.",
      "Track admit card and result notifications."
    ],
    pathways: ["CMA Intermediate", "CMA Final", "Costing and management accounting"]
  },
  {
    id: "cseet",
    name: "CSEET",
    authority: "Institute of Company Secretaries of India (ICSI)",
    officialWebsite: "https://www.icsi.edu/",
    officialNoticeUrl: "https://www.icsi.edu/student/",
    applyUrl: "https://smash.icsi.edu/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "Multiple windows across the year",
    examWindow: "Typically Jan, May, Jul, Nov",
    resultWindow: "Usually within 2-3 weeks",
    attempts: "As per ICSI regulations",
    thingsToKnow: [
      "Entry test for Company Secretary executive program.",
      "Remote proctored/center mode may vary by cycle.",
      "Check technical requirements and exam guidelines beforehand."
    ],
    howToApply: [
      "Create account on ICSI portal and register for CSEET.",
      "Upload required documents and complete payment.",
      "Download admit card/hall ticket.",
      "After qualification, proceed to executive registration."
    ],
    pathways: ["CS Executive", "CS Professional", "Corporate compliance careers"]
  },
  {
    id: "ugc-net",
    name: "UGC NET",
    authority: "National Testing Agency (on behalf of UGC)",
    officialWebsite: "https://ugcnet.nta.ac.in/",
    officialNoticeUrl: "https://ugcnet.nta.ac.in/",
    applyUrl: "https://ugcnet.nta.ac.in/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "Typically twice yearly cycles",
    examWindow: "As notified by NTA",
    resultWindow: "Usually 4-8 weeks",
    attempts: "Multiple attempts; age limits apply for JRF",
    thingsToKnow: [
      "Separate qualification categories: JRF and Assistant Professor.",
      "Subject code must match PG specialization eligibility.",
      "Certificate validity rules differ by category."
    ],
    howToApply: [
      "Read subject-wise eligibility and latest notification.",
      "Register and fill online form on UGC NET portal.",
      "Pay fee and submit required documents.",
      "Track city intimation, admit card, and scorecard release."
    ],
    pathways: ["Assistant Professor eligibility", "JRF", "PhD and research tracks"]
  },
  {
    id: "csir-net",
    name: "CSIR UGC NET",
    authority: "National Testing Agency / CSIR",
    officialWebsite: "https://csirnet.nta.ac.in/",
    officialNoticeUrl: "https://csirnet.nta.ac.in/",
    applyUrl: "https://csirnet.nta.ac.in/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "As notified per session",
    examWindow: "Typically twice yearly",
    resultWindow: "Usually within 1-2 months",
    attempts: "Multiple attempts; category-age rules apply",
    thingsToKnow: [
      "Focused on science subjects and research eligibility.",
      "JRF and Lectureship outcomes have different implications.",
      "Check subject and age criteria carefully."
    ],
    howToApply: [
      "Review official notification for subject eligibility.",
      "Register and complete online application.",
      "Upload documents, pay fee, and submit.",
      "Track admit card and result announcements."
    ],
    pathways: ["JRF", "Lectureship eligibility", "Science research careers"]
  },
  {
    id: "gpat",
    name: "GPAT",
    authority: "National Board of Examinations in Medical Sciences",
    officialWebsite: "https://natboard.edu.in/",
    officialNoticeUrl: "https://natboard.edu.in/",
    applyUrl: "https://natboard.edu.in/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "As notified annually",
    examWindow: "Typically once a year",
    resultWindow: "Usually within 4-8 weeks",
    attempts: "Yearly cycle",
    thingsToKnow: [
      "Used for M.Pharm admissions and scholarship considerations.",
      "Participating institute criteria may vary.",
      "Official brochure defines current syllabus and pattern."
    ],
    howToApply: [
      "Check GPAT notification on NBE/NBEMS portal.",
      "Register and fill application details.",
      "Upload files and pay fee.",
      "Download admit card and retain scorecard for admissions."
    ],
    pathways: ["M.Pharm", "Pharma research", "Regulatory and industry roles"]
  },
  {
    id: "nchm-jee",
    name: "NCHM JEE",
    authority: "National Testing Agency / NCHMCT",
    officialWebsite: "https://nchmjee.nta.nic.in/",
    officialNoticeUrl: "https://nchmjee.nta.nic.in/",
    applyUrl: "https://nchmjee.nta.nic.in/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "Typically Feb-Apr",
    examWindow: "Typically May",
    resultWindow: "Usually Jun",
    attempts: "Yearly cycle",
    thingsToKnow: [
      "For hospitality program admissions in participating institutes.",
      "Counselling is conducted after result publication.",
      "Institute fees and hostel policies vary."
    ],
    howToApply: [
      "Register on official NCHM JEE portal.",
      "Fill details, upload documents, and submit fee.",
      "Download admit card and appear for exam.",
      "Participate in counselling rounds after results."
    ],
    pathways: ["BSc Hospitality and Hotel Administration", "Hospitality careers", "Tourism operations"]
  },
  {
    id: "icar-aieea",
    name: "ICAR AIEEA",
    authority: "National Testing Agency / Indian Council of Agricultural Research",
    officialWebsite: "https://icar.nta.nic.in/",
    officialNoticeUrl: "https://icar.nta.nic.in/",
    applyUrl: "https://icar.nta.nic.in/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "As notified yearly",
    examWindow: "Typically Jun-Jul",
    resultWindow: "Usually within 4-8 weeks",
    attempts: "Yearly cycle",
    thingsToKnow: [
      "Supports UG/PG agriculture admissions in participating institutions.",
      "Subject stream and quota eligibility must match rules.",
      "Counselling schedule is separate after score release."
    ],
    howToApply: [
      "Read ICAR AIEEA information bulletin.",
      "Register and fill exam form online.",
      "Upload required documents and pay fee.",
      "Track admit card, scorecard, and counselling notices."
    ],
    pathways: ["Agriculture UG", "Agri PG", "Agri research and extension careers"]
  },
  {
    id: "imu-cet",
    name: "IMU CET",
    authority: "Indian Maritime University",
    officialWebsite: "https://www.imu.edu.in/",
    officialNoticeUrl: "https://www.imu.edu.in/",
    applyUrl: "https://www.imu.edu.in/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "Typically Mar-May",
    examWindow: "Typically Jun",
    resultWindow: "Usually Jul",
    attempts: "Yearly cycle",
    thingsToKnow: [
      "Medical and eyesight standards are critical for seafaring tracks.",
      "Sponsorship opportunities differ by company and program.",
      "Document checks during counselling are strict."
    ],
    howToApply: [
      "Open IMU admissions portal and read latest prospectus.",
      "Register, fill profile, and select program preference.",
      "Upload documents and complete payment.",
      "Appear for CET and follow counselling/admission process."
    ],
    pathways: ["Nautical Science", "Marine Engineering", "Naval architecture", "Maritime management"]
  },
  {
    id: "bitsat",
    name: "BITSAT",
    authority: "BITS Pilani",
    officialWebsite: "https://www.bitsadmission.com/",
    officialNoticeUrl: "https://www.bitsadmission.com/",
    applyUrl: "https://www.bitsadmission.com/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "Session-wise; typically Jan-Apr",
    examWindow: "Typically May-Jun",
    resultWindow: "Score shown after exam; admission rounds follow",
    attempts: "As per BITS notification",
    thingsToKnow: [
      "Separate admission process from JEE-based counselling.",
      "Iteration rounds and preference freezing are important.",
      "Board marks criteria apply as per institute policy."
    ],
    howToApply: [
      "Register on official BITS admission portal.",
      "Fill application and slot booking details.",
      "Pay fee and download hall ticket.",
      "Submit preference form and track iteration results."
    ],
    pathways: ["B.E.", "B.Pharm", "MSc integrated programs"]
  },
  {
    id: "viteee",
    name: "VITEEE",
    authority: "Vellore Institute of Technology",
    officialWebsite: "https://viteee.vit.ac.in/",
    officialNoticeUrl: "https://viteee.vit.ac.in/",
    applyUrl: "https://viteee.vit.ac.in/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "Typically Nov-Mar",
    examWindow: "Typically Apr",
    resultWindow: "Usually Apr-May",
    attempts: "Yearly cycle",
    thingsToKnow: [
      "Counselling and branch allotment based on rank and preference.",
      "Multiple campuses and fee categories may apply.",
      "Check eligibility and board mark requirements."
    ],
    howToApply: [
      "Apply through official VITEEE portal.",
      "Submit personal and academic details with documents.",
      "Pay fee and book slot if required.",
      "Participate in counselling after rank publication."
    ],
    pathways: ["B.Tech programs", "Engineering careers", "Technology pathways"]
  },
  {
    id: "wbjee",
    name: "WBJEE",
    authority: "West Bengal Joint Entrance Examinations Board",
    officialWebsite: "https://wbjeeb.nic.in/",
    officialNoticeUrl: "https://wbjeeb.nic.in/",
    applyUrl: "https://wbjeeb.nic.in/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "Typically Dec-Jan",
    examWindow: "Typically Apr",
    resultWindow: "Usually Jun",
    attempts: "Yearly cycle",
    thingsToKnow: [
      "State-level entrance for engineering and related programs.",
      "Counselling rounds are conducted separately.",
      "Domicile and category rules affect seat access."
    ],
    howToApply: [
      "Register on WBJEEB portal and complete form.",
      "Upload required documents and pay fee.",
      "Download admit card and appear for exam.",
      "Follow counselling and seat allotment announcements."
    ],
    pathways: ["B.Tech", "B.Pharm", "State engineering admissions"]
  },
  {
    id: "mht-cet",
    name: "MHT CET",
    authority: "State Common Entrance Test Cell, Maharashtra",
    officialWebsite: "https://cetcell.mahacet.org/",
    officialNoticeUrl: "https://cetcell.mahacet.org/",
    applyUrl: "https://cetcell.mahacet.org/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "Typically Jan-Mar",
    examWindow: "Typically Apr-May",
    resultWindow: "Usually Jun",
    attempts: "Yearly cycle",
    thingsToKnow: [
      "Separate groups exist for PCB and PCM tracks.",
      "CAP counselling process is required for seat allotment.",
      "State and institute quota rules apply."
    ],
    howToApply: [
      "Apply through CET Cell Maharashtra portal.",
      "Select correct group and exam details.",
      "Pay fees and submit form.",
      "Track admit card, result, and CAP counselling schedule."
    ],
    pathways: ["Engineering", "Pharmacy", "Health science admissions (as notified)"]
  },
  {
    id: "comedk-uget",
    name: "COMEDK UGET",
    authority: "Consortium of Medical, Engineering and Dental Colleges of Karnataka",
    officialWebsite: "https://www.comedk.org/",
    officialNoticeUrl: "https://www.comedk.org/",
    applyUrl: "https://www.comedk.org/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "Typically Feb-Apr",
    examWindow: "Typically May",
    resultWindow: "Usually May-Jun",
    attempts: "Yearly cycle",
    thingsToKnow: [
      "Primarily for engineering admissions in participating Karnataka institutions.",
      "Counselling is mandatory for seat allocation.",
      "Eligibility and document verification rules are strict."
    ],
    howToApply: [
      "Register on official COMEDK portal.",
      "Fill application and upload required files.",
      "Pay fee and download test admission ticket.",
      "Participate in counselling after result announcement."
    ],
    pathways: ["B.E./B.Tech", "Private engineering colleges in Karnataka"]
  },
  {
    id: "npat",
    name: "NPAT",
    authority: "NMIMS",
    officialWebsite: "https://www.npat.in/",
    officialNoticeUrl: "https://www.npat.in/",
    applyUrl: "https://www.npat.in/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "Typically Dec-May",
    examWindow: "Typically Jan-May",
    resultWindow: "Cycle-based updates",
    attempts: "As per NMIMS policy",
    thingsToKnow: [
      "Different NPAT streams exist for management, commerce, and other programs.",
      "Campus and program preferences affect final allotment.",
      "Multiple attempt options may be available depending on policy."
    ],
    howToApply: [
      "Register on official NPAT portal.",
      "Choose program(s), campus preferences, and exam slot.",
      "Pay fee and confirm test booking.",
      "Track merit list and admission instructions."
    ],
    pathways: ["BBA", "B.Com", "Economics and management UG tracks"]
  },
  {
    id: "ipmat",
    name: "IPMAT",
    authority: "IIM Indore / IIM Rohtak (separate exams)",
    officialWebsite: "https://www.iimidr.ac.in/",
    officialNoticeUrl: "https://www.iimidr.ac.in/programmes/ipm/",
    applyUrl: "https://www.iimidr.ac.in/programmes/ipm/",
    lastVerifiedOn: "2026-04-11",
    registrationWindow: "Typically Feb-Apr",
    examWindow: "Typically May",
    resultWindow: "Usually Jun-Jul",
    attempts: "As per each IIM's age and eligibility criteria",
    thingsToKnow: [
      "IPMAT Indore and IPMAT Rohtak have separate forms and patterns.",
      "Interview and profile assessment stages usually follow written test.",
      "Age cutoff is strict for integrated program admissions."
    ],
    howToApply: [
      "Check each participating IIM's official IPM portal.",
      "Register separately for each exam if applying to multiple institutes.",
      "Pay fees and complete application with documents.",
      "Track admit cards, results, and interview calls."
    ],
    pathways: ["Integrated Program in Management", "BBA+MBA track"]
  }
];

const inferCategory = (name: string, pathways: string[]):
  | "Engineering"
  | "Medical"
  | "Law"
  | "Design"
  | "Management"
  | "Government"
  | "Banking"
  | "Professional"
  | "Research"
  | "Hospitality"
  | "Agriculture"
  | "Maritime"
  | "Other" => {
  const haystack = `${name} ${pathways.join(" ")}`.toLowerCase();

  if (/(jee|bitsat|viteee|wbjee|mht cet|comedk|b\.tech|engineering)/.test(haystack)) return "Engineering";
  if (/(neet|mbbs|bds|bhms|bams|medical|pharm|gpat)/.test(haystack)) return "Medical";
  if (/(clat|ailet|llb|law)/.test(haystack)) return "Law";
  if (/(nift|nid|uceed|ceed|design|ux|fashion)/.test(haystack)) return "Design";
  if (/(cat|xat|ipmat|npat|mba|pgdm|management)/.test(haystack)) return "Management";
  if (/(upsc|nda|cds|ssc|ias|ips|ifs|civil services|central government)/.test(haystack)) return "Government";
  if (/(ibps|sbi|bank|po)/.test(haystack)) return "Banking";
  if (/(ca|cma|cseet|company secretary|chartered account)/.test(haystack)) return "Professional";
  if (/(gate|jam|ugc net|csir|jrf|research|phd)/.test(haystack)) return "Research";
  if (/(nchm|hotel|hospitality|tourism)/.test(haystack)) return "Hospitality";
  if (/(icar|agri|agriculture)/.test(haystack)) return "Agriculture";
  if (/(imu|maritime|marine|nautical)/.test(haystack)) return "Maritime";

  return "Other";
};

const defaultDetailsByCategory = (category: ReturnType<typeof inferCategory>) => {
  const commonDocs = [
    "Passport-size photo and signature in official format",
    "Valid government photo ID",
    "Class 10/12 or qualifying exam details",
    "Category/EWS/PwD certificate (if applicable)",
    "Active email ID and mobile number",
  ];

  const commonMistakes = [
    "Applying without fully reading the latest official notice",
    "Typing errors in name, category, or qualification details",
    "Wrong exam paper/program selection",
    "Ignoring correction window deadlines",
    "Not saving payment and confirmation proof",
  ];

  const commonAfter = [
    "Download and store admit card, response sheet, and scorecard",
    "Track counselling/admission/recruitment timeline separately",
    "Prepare realistic preference/order list before counselling",
    "Keep originals and scanned copies ready for verification",
  ];

  const commonPrep = [
    "Understand latest official syllabus and exam pattern first",
    "Use previous year papers and timed mocks regularly",
    "Follow a weekly revision plan for weak and high-weight topics",
  ];

  const commonWho = [
    "Students who match the exam's eligibility and target pathway",
    "Students ready for structured preparation over multiple months",
    "Students willing to track official notices and deadlines carefully",
  ];

  if (category === "Engineering") {
    return {
      mode: "Usually computer-based test with objective questions",
      fee: "Application fee varies by category and number of papers/sessions",
      support: "Use official exam helpdesk and portal notices only",
      correction: "Short correction window is usually provided after form close",
      eligibility: [
        "Usually Class 12 with PCM subjects or equivalent",
        "Board marks and attempt rules depend on latest official notice",
      ],
      docs: commonDocs,
      mistakes: commonMistakes,
      after: commonAfter,
      prep: commonPrep,
      who: commonWho,
    };
  }

  if (category === "Medical") {
    return {
      mode: "Usually objective test in pen-paper or computer-based mode",
      fee: "Fee is category-based; counselling payments are usually separate",
      support: "Use official authority portal and helpdesk channels",
      correction: "Correction window availability depends on the exam authority",
      eligibility: [
        "Usually Class 12 with PCB subjects",
        "Age and category criteria are as per the latest official notice",
      ],
      docs: commonDocs,
      mistakes: commonMistakes,
      after: commonAfter,
      prep: commonPrep,
      who: commonWho,
    };
  }

  if (category === "Law") {
    return {
      mode: "Mostly computer-based objective test for UG/PG law admissions",
      fee: "Application fee is category-based; counselling fee is separate",
      support: "Use official consortium/university law admission portal",
      correction: "Limited correction is usually allowed for selected fields",
      eligibility: [
        "Usually Class 12 pass/appearing for UG law entrances",
        "Marks, age, and reservation rules depend on official notification",
      ],
      docs: commonDocs,
      mistakes: commonMistakes,
      after: commonAfter,
      prep: commonPrep,
      who: commonWho,
    };
  }

  if (category === "Design") {
    return {
      mode: "Written aptitude test followed by studio/portfolio/interview rounds in many institutes",
      fee: "Fee varies by institute, program, and category",
      support: "Use official design institute admissions portals",
      correction: "Correction windows may be short and field-restricted",
      eligibility: [
        "Eligibility depends on target design program (UG/PG)",
        "Portfolio/studio test rounds can be part of final selection",
      ],
      docs: commonDocs,
      mistakes: commonMistakes,
      after: commonAfter,
      prep: commonPrep,
      who: commonWho,
    };
  }

  if (category === "Government" || category === "Banking") {
    return {
      mode: "Usually multi-stage process (prelims/mains/skill/interview as applicable)",
      fee: "Fee exemptions/relaxations may apply by category",
      support: "Follow only official commission/board/agency portals",
      correction: "Some exams allow limited corrections; verify field-level rules",
      eligibility: [
        "Age limits and relaxation rules are strictly enforced",
        "Qualification requirements vary by post and notification",
      ],
      docs: commonDocs,
      mistakes: commonMistakes,
      after: commonAfter,
      prep: commonPrep,
      who: commonWho,
    };
  }

  if (category === "Professional" || category === "Research") {
    return {
      mode: "Mode and stages depend on authority and session",
      fee: "Fee differs by session, category, and level",
      support: "Use official institute/testing portal and bulletin",
      correction: "Correction options are exam-specific",
      eligibility: [
        "Eligibility depends on target level and subject specialization",
        "Always verify latest brochure before final submission",
      ],
      docs: commonDocs,
      mistakes: commonMistakes,
      after: commonAfter,
      prep: commonPrep,
      who: commonWho,
    };
  }

  return {
    mode: "Exam mode and stages are defined in the latest official notification",
    fee: "Fee varies by category and exam cycle",
    support: "Use only official website and helpdesk channels",
    correction: "If correction window exists, use it before final deadline",
    eligibility: [
      "Eligibility changes by exam, program, and category",
      "Check official bulletin for final criteria",
    ],
    docs: commonDocs,
    mistakes: commonMistakes,
    after: commonAfter,
    prep: commonPrep,
    who: commonWho,
  };
};

const enrichExam = (exam: ExamCatalogItem): ExamCatalogItem => {
  const category = inferCategory(exam.name, exam.pathways);
  const defaults = defaultDetailsByCategory(category);

  return {
    ...exam,
    upcomingExamDate: exam.upcomingExamDate ?? exam.examWindow,
    correctionWindow: exam.correctionWindow ?? defaults.correction,
    examMode: exam.examMode ?? defaults.mode,
    feeInfo: exam.feeInfo ?? defaults.fee,
    officialSupport: exam.officialSupport ?? defaults.support,
    eligibilitySnapshot: exam.eligibilitySnapshot ?? defaults.eligibility,
    documentsChecklist: exam.documentsChecklist ?? defaults.docs,
    commonMistakes: exam.commonMistakes ?? defaults.mistakes,
    afterExamSteps: exam.afterExamSteps ?? defaults.after,
    prepPriorities: exam.prepPriorities ?? defaults.prep,
    whoShouldChoose: exam.whoShouldChoose ?? defaults.who,
  };
};

export const EXAMS_CATALOG: ExamCatalogItem[] = BASE_EXAMS_CATALOG.map(enrichExam);
