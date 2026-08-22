import type { CareerRoleDetail } from "./types";

export const SCIENCE_EDUCATION_CAREER_DETAILS: Record<string, CareerRoleDetail> = {
  "school-teacher": {
    listName: "School Teacher",
    title: "School Teacher in India: B.Ed Degree, CTET/TET, KVS/NVS & Pedagogy Career",
    metaDescription:
      "Complete guide to becoming a School Teacher in India: B.Ed degree, CTET/State TET, PRT/TGT/PGT cadres, KVS/NVS recruitments, and NEP 2020 pedagogy.",
    intro:
      "School Teachers educate and mentor students across foundational, preparatory, middle, and secondary school stages in CBSE, ICSE, State Boards, and International (IB/Cambridge) schools. In India, statutory teaching qualifications are strictly regulated by the National Council for Teacher Education (NCTE). Under the New Education Policy (NEP 2020), teachers progress through three tiers: Primary Teacher (PRT - Classes 1 to 5), Trained Graduate Teacher (TGT - Classes 6 to 10), and Post Graduate Teacher (PGT - Classes 11 & 12). Qualification requires a bachelor's or master's degree in the teaching subject combined with a Bachelor of Education (B.Ed) and clearing the Central Teacher Eligibility Test (CTET).",
    typicalSubjects: [
      "Child Development, Educational Psychology & Learning Pedagogy",
      "Curriculum Design, Lesson Planning & Formative Assessment Techniques",
      "Inclusive Education for Diverse Learners & Special Needs (CWSN)",
      "Core Subject Discipline Mastery (Mathematics, Science, Social Sciences, Languages)"
    ],
    keyExams: [
      "CTET (Central Teacher Eligibility Test conducted by CBSE for Central Govt Schools)",
      "State Teacher Eligibility Tests (State TETs e.g. UPTET, MAHATET, KTET, TNTET)",
      "KVS / NVS / DSSSB Teacher Recruitment Examinations (for Kendriya Vidyalaya & Navodaya Vidyalayas)"
    ],
    colleges: [
      { name: "Regional Institutes of Education (NCERT RIE - Ajmer, Bhopal, Bhubaneswar, Mysuru)", context: "Apex statutory national teacher training institutes offering prestigious integrated 4-year B.Sc. B.Ed / B.A. B.Ed programs." },
      { name: "Central Institute of Education (CIE, Faculty of Education, University of Delhi)", context: "Pioneering Indian teacher education faculty renowned for pedagogical research and policy design." },
      { name: "Banaras Hindu University (Faculty of Education, BHU Kamachha Campus)", context: "Historic teacher education department with state-of-the-art model demonstration schools." },
      { name: "St. Xavier's College (Kolkata - Department of Education)", context: "Leading autonomous education department known for modern audio-visual teaching pedagogy." }
    ],
    ncoCode: "2330.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "National Council for Teacher Education (NCTE) / CBSE",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2330 - Secondary School Teachers", url: "https://www.ncs.gov.in" },
      { name: "National Council for Teacher Education (NCTE)", url: "https://ncte.gov.in" },
      { name: "Central Teacher Eligibility Test (CTET)", url: "https://ctet.nic.in" }
    ]
  },

  "college-professor": {
    listName: "College Professor",
    title: "College Professor in India: UGC NET / CSIR NET, Ph.D, Academic API & Tenure",
    metaDescription:
      "How to become an Assistant Professor in Indian Universities: Master's degree, UGC NET/JRF, Ph.D requirement, academic research publications, and CAS promotion.",
    intro:
      "College and University Professors lecture undergraduate and post-graduate students, mentor doctoral research scholars, publish peer-reviewed academic papers in indexed journals (Scopus / Web of Science), and direct funded research projects. Regulated by the University Grants Commission (UGC), entry begins at the rank of Assistant Professor (Academic Level 10), progressing through Associate Professor to full Professor (Academic Level 14). Mandatory eligibility requires a Master's degree with minimum 55% marks, qualifying the UGC NET / CSIR NET examination (or holding a Ph.D. under UGC 2018/2023 regulations).",
    typicalSubjects: [
      "Specialized Subject Mastery & Advanced Post-Graduate Seminar Pedagogy",
      "Research Methodology, Quantitative/Qualitative Data Analysis & Statistical Modeling",
      "Academic Publishing, Peer Review Ethics & Research Grant Proposal Writing",
      "University Governance, Examination Administration & Board of Studies Curriculum Reform"
    ],
    keyExams: [
      "UGC NET / JRF (University Grants Commission National Eligibility Test conducted by NTA)",
      "CSIR-UGC NET (for Science & Engineering academic disciplines)",
      "State Eligibility Tests (SET / SLET for state university assistant professor eligibility)"
    ],
    colleges: [
      { name: "Jawaharlal Nehru University (JNU New Delhi)", context: "India's highest NAAC-rated research university with renowned faculty in humanities, social sciences, and international studies." },
      { name: "University of Delhi (North & South Campuses)", context: "Premier central university employing thousands of top academic professors across 80+ constituent colleges." },
      { name: "Banaras Hindu University (BHU Varanasi)", context: "Largest residential university in Asia with extensive post-graduate departments and interdisciplinary research centers." },
      { name: "University of Hyderabad (HCU)", context: "Top central university renowned for biological sciences, chemistry, and humanities doctoral fellowships." }
    ],
    ncoCode: "2310.0100",
    skillLevel: "Level 4 (Professional / Doctoral)",
    regulatoryBody: "University Grants Commission (UGC)",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2310 - Higher Education Teaching Professionals", url: "https://www.ncs.gov.in" },
      { name: "University Grants Commission (UGC India)", url: "https://www.ugc.gov.in" },
      { name: "UGC NET Official Portal (NTA)", url: "https://ugcnet.nta.ac.in" }
    ]
  },

  "research-scientist": {
    listName: "Research Scientist",
    title: "Research Scientist in India: CSIR, IISc/IISER, Ph.D & Scientific Research",
    metaDescription:
      "Career pathway for Research Scientists in India: CSIR-UGC JRF, Ph.D at IISc/IISER/TIFR, scientific publications, and national laboratory positions.",
    intro:
      "Research Scientists conduct pure and applied scientific investigations across physics, chemistry, molecular biology, materials science, and computational algorithms. In India, research scientists work in apex national scientific laboratories (Council of Scientific & Industrial Research - CSIR, Department of Atomic Energy - DAE/BARC, Indian Space Research Organisation - ISRO, DRDO) and pharmaceutical/biotechnology R&D centers. The academic journey requires a Bachelor's in Science (B.Sc / BS-MS), a Master's degree (M.Sc / M.Tech), clearing national fellowship exams (CSIR-UGC JRF, GATE, JEST), and completing a Ph.D with postdoctoral research fellowships.",
    typicalSubjects: [
      "Advanced Theoretical Foundations (Quantum Mechanics, Thermodynamics, Molecular Biology, Organic Synthesis)",
      "Scientific Instrumentation (NMR, Mass Spectrometry, Electron Microscopy - TEM/SEM, XRD)",
      "Statistical Data Analysis, Computational Simulations & Python/MATLAB",
      "Scientific Paper Writing, Grant Applications & Laboratory Biosafety Protocols"
    ],
    keyExams: [
      "CSIR-UGC NET JRF (Junior Research Fellowship for national lab admissions)",
      "JEST (Joint Entrance Screening Test for premier physics/computational institutes)",
      "GATE (for scientific officer recruitments in BARC, ISRO, DRDO)",
      "TIFR Graduate School Admissions (GS Examination)"
    ],
    colleges: [
      { name: "Indian Institute of Science (IISc Bengaluru)", context: "India's highest globally ranked research institution with world-class interdisciplinary scientific research facilities." },
      { name: "Tata Institute of Fundamental Research (TIFR Mumbai / Hyderabad)", context: "Deemed research university dedicated to high-energy physics, astronomy, chemistry, and biological sciences." },
      { name: "Indian Institutes of Science Education and Research (IISER Pune, Kolkata, Mohali, Bhopal, Thiruvananthapuram, Tirupati, Berhampur)", context: "Institutes of National Importance offering 5-year integrated BS-MS degrees fostering early scientific research careers." },
      { name: "Bhabha Atomic Research Centre (BARC Training School, Mumbai)", context: "Apex nuclear research center recruiting Scientific Officers through OCES and DGFS programs." }
    ],
    ncoCode: "2111.0100",
    skillLevel: "Level 4 (Professional / Doctoral)",
    regulatoryBody: "Department of Science and Technology (DST) / CSIR / DAE",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2111 - Physicists, Chemists and Related Professionals", url: "https://www.ncs.gov.in" },
      { name: "Council of Scientific & Industrial Research (CSIR)", url: "https://www.csir.res.in" }
    ]
  },

  "commercial-pilot": {
    listName: "Commercial Pilot",
    title: "Commercial Pilot in India: DGCA CPL, Flying School Hours, Class 1 Medical & Airlines",
    metaDescription:
      "How to become a Commercial Airline Pilot in India: DGCA CPL license, 200 flying hours, Class 1/2 medical examinations, cadet pilot programs, and IGRUA.",
    intro:
      "Commercial Pilots operate multi-engine passenger jet aircraft, cargo freighters, and charter flights under Instrument Flight Rules (IFR). In India's booming civil aviation market (Air India, IndiGo, Akasa Air), pilots are responsible for flight route planning, pre-flight weight and balance calculations, navigation through adverse meteorological turbulence, and flight safety emergency protocols. The profession is strictly regulated by the Directorate General of Civil Aviation (DGCA). The standard path requires passing Class 12 with Physics & Mathematics, clearing DGCA Class 2 and Class 1 medical examinations, completing 200 flying hours at an approved Flying Training Organisation (FTO), passing DGCA theoretical ground exams (Air Navigation, Meteorology, Air Regulations, Technical General, RTR), and obtaining a Commercial Pilot Licence (CPL) followed by Type Rating.",
    typicalSubjects: [
      "Air Navigation, Radio Navigation & Flight Instrument Systems",
      "Aviation Meteorology & Weather Radar Interpretation",
      "Air Regulations, Aircraft Performance, Weight & Balance (DGCA CPL Papers)",
      "Radio Telephony Restricted (RTR Aero conducted by WPC, Ministry of Communications)"
    ],
    keyExams: [
      "IGRUA Entrance Exam (Indira Gandhi Rashtriya Uran Akademi Entrance)",
      "Airline Cadet Pilot Program Selection Tests (IndiGo, Air India Cadet Programs)",
      "DGCA CPL Theory Examinations (Conducted quarterly by Central Examination Organisation - CEO)"
    ],
    colleges: [
      { name: "Indira Gandhi Rashtriya Uran Akademi (IGRUA Amethi, UP)", context: "Autonomous national flying academy under Ministry of Civil Aviation, acknowledged as the premier flying school in South Asia with world-class twin-engine fleet and glass cockpits." },
      { name: "National Flying Training Institute (NFTI Gondia, Maharashtra / CAE)", context: "Premier pilot training academy operated in partnership with global aerospace training leader CAE." },
      { name: "Madhya Pradesh Flying Club (MPFC Indore / Bhopal)", context: "One of India's oldest and most respected flying training organizations with extensive cross-country training sectors." },
      { name: "Chimes Aviation Academy (CAA Dhana, Sagar, MP)", context: "Top private DGCA-approved flying academy with dedicated private airfield and Piper aircraft fleet." }
    ],
    ncoCode: "3153.0100",
    skillLevel: "Level 3/4 (Professional Licence / DGCA)",
    regulatoryBody: "Directorate General of Civil Aviation (DGCA) / Ministry of Civil Aviation",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 3153 - Aircraft Pilots", url: "https://www.ncs.gov.in" },
      { name: "Directorate General of Civil Aviation (DGCA India)", url: "https://www.dgca.gov.in" }
    ]
  },

  "hotel-general-manager": {
    listName: "Hotel General Manager",
    title: "Hotel General Manager in India: NCHMCT JEE, Luxury Hospitality & Hotel Operations",
    metaDescription:
      "Career guide to Hotel General Management in India: NCHMCT JEE for B.Sc Hospitality, luxury chain management training (IHCL/Oberoi), and hotel operations.",
    intro:
      "Hotel General Managers (GMs) direct all operational, financial, culinary, and guest service workflows of luxury hotels, resorts, and convention centers. In India's premier hospitality sector (Taj Hotels/IHCL, Oberoi Group, ITC Hotels, Marriott), hotel GMs manage revenue management (RevPAR, ADR), food and beverage operations, banquet sales, housekeeping standards, luxury guest experiences, and statutory hotel safety regulations. The standard educational foundation is a 3-year B.Sc in Hospitality and Hotel Administration from premier National Institutes of Hotel Management (IHMs) entered via the NCHMCT JEE, followed by corporate Management Training (MT) programs.",
    typicalSubjects: [
      "Food & Beverage Service Operations & Oenology",
      "Front Office Management, Global Distribution Systems (GDS) & Revenue Management",
      "Culinary Arts, Food Production & HACCP Food Safety Standards",
      "Hotel Financial Accounting, Facility Planning & Hospitality Law"
    ],
    keyExams: [
      "NCHMCT JEE (National Council for Hotel Management Joint Entrance Examination by NTA)",
      "Oberoi Centre of Learning and Development (OCLD Selection)",
      "Taj Management Training Programme (TMTP / IHCL Corporate Selection)"
    ],
    colleges: [
      { name: "Institute of Hotel Management (IHM Pusa, New Delhi)", context: "India's #1 ranked National Institute of Hotel Management with the highest corporate hospitality campus placements." },
      { name: "Oberoi Centre of Learning and Development (OCLD New Delhi)", context: "The elite corporate training academy of The Oberoi Group, universally recognized as a world benchmark for luxury hospitality leadership." },
      { name: "Institute of Hotel Management (IHM Mumbai - Dadar)", context: "Historic pioneer of hotel management education in South Asia (est. 1954) with legendary hospitality alumni." },
      { name: "Welcomgroup Graduate School of Hotel Administration (WGSHA Manipal)", context: "Premier private hotel management college run in close partnership with ITC Hotels." }
    ],
    ncoCode: "1411.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "National Council for Hotel Management and Catering Technology (NCHMCT) / Ministry of Tourism",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 1411 - Hotel Managers", url: "https://www.ncs.gov.in" },
      { name: "National Council for Hotel Management and Catering Technology (NCHMCT)", url: "https://nchm.gov.in" }
    ]
  },

  "agricultural-scientist": {
    listName: "Agricultural Scientist",
    title: "Agricultural Scientist in India: ICAR AIEEA, Agronomy, Soil Science & ARS Path",
    metaDescription:
      "Step-by-step path to Agricultural Science in India: B.Sc Agriculture, ICAR AIEEA exam, Agricultural Research Service (ARS), and IARI institutes.",
    intro:
      "Agricultural Scientists research and develop high-yielding crop varieties, climate-resilient drought-resistant hybrids, precision irrigation models, biological pest control, and sustainable soil fertility techniques to ensure national food security. In India, agricultural scientists work in research institutes under the Indian Council of Agricultural Research (ICAR), State Agricultural Universities (SAUs), seed biotechnology multinationals, and agrochemical firms. The career begins with a 4-year B.Sc (Honours) in Agriculture entered through ICAR AIEEA or state CETs, progressing to M.Sc and qualifying the Agricultural Research Service (ARS) examination conducted by the Agricultural Scientists Recruitment Board (ASRB).",
    typicalSubjects: [
      "Agronomy, Crop Physiology & Precision Farming",
      "Genetics, Plant Breeding & Seed Biotechnology",
      "Soil Science, Agricultural Chemistry & Soil Microbiology",
      "Plant Pathology, Agricultural Entomology & Post-Harvest Technology"
    ],
    keyExams: [
      "CUET-UG / ICAR AIEEA-UG (Conducted by NTA for 100% seats in Central Agricultural Universities and 20% ICAR quota in SAUs)",
      "ICAR AIEEA-PG (for post-graduate M.Sc Agriculture admissions)",
      "ARS Examination (Agricultural Research Service Exam by ASRB for Scientist posts)"
    ],
    colleges: [
      { name: "Indian Agricultural Research Institute (ICAR-IARI Pusa, New Delhi)", context: "The historic cradle of India's Green Revolution and apex deemed agricultural research university in South Asia." },
      { name: "Punjab Agricultural University (PAU Ludhiana)", context: "World-renowned agricultural university credited with transforming Indian food grain production and farm mechanization." },
      { name: "Tamil Nadu Agricultural University (TNAU Coimbatore)", context: "Leading Southern Indian agricultural university with cutting-edge plant breeding and nanotechnology laboratories." },
      { name: "Govind Ballabh Pant University of Agriculture and Technology (GBPUAT Pantnagar)", context: "India's first statutory agricultural university (est. 1960) with legendary farm extensions and research farms." }
    ],
    ncoCode: "2132.0200",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Indian Council of Agricultural Research (ICAR) / Ministry of Agriculture and Farmers Welfare",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2132 - Farming and Agronomic Advisers", url: "https://www.ncs.gov.in" },
      { name: "Indian Council of Agricultural Research (ICAR)", url: "https://icar.org.in" }
    ]
  },

  "special-educator": {
    listName: "Special Educator",
    title: "Special Educator in India: Inclusive Education, RCI Registration & B.Ed Special Ed",
    metaDescription:
      "Career pathway for Special Education Teachers in India: RCI registration, Individualized Education Programs (IEP), inclusive schools, and NIEPID institutes.",
    intro:
      "Special Educators design, adapt, and deliver individualized educational programs for children and young adults with diverse physical, sensory, intellectual, and developmental learning needs (including autism spectrum, ADHD, dyslexia, visual impairment, and hearing impairment). Under India's Rights of Persons with Disabilities (RPwD) Act 2016 and National Education Policy (NEP 2020), every school is mandated to integrate certified special educators. The statutory pathway requires a Rehabilitation Council of India (RCI) recognized B.Ed in Special Education or Diploma in Special Education (D.Ed.Spl.Ed) followed by Central Rehabilitation Register (CRR) licensing.",
    typicalSubjects: [
      "Inclusive Pedagogy, Individualized Education Plans (IEP) & Curriculum Adaptation",
      "Child Psychology, Neurodiversity & Developmental Assessment Scales",
      "Assistive Technologies, Braille Literacy & Indian Sign Language (ISL)",
      "Behavioral Intervention Plans (Applied Behavior Analysis - ABA Principles)"
    ],
    keyExams: [
      "All India Online Aptitude Test (AIOAT conducted by Rehabilitation Council of India)",
      "CUET-UG / Central University B.Ed Special Education Entrance Exams",
      "Central Teacher Eligibility Test (CTET Paper-I / Paper-II with Special Ed validation)"
    ],
    colleges: [
      { name: "National Institute for the Empowerment of Persons with Intellectual Disabilities (NIEPID Secunderabad)", context: "Apex national autonomous institute under Ministry of Social Justice & Empowerment." },
      { name: "Ali Yavar Jung National Institute of Speech and Hearing Disabilities (AYJNISHD Mumbai)", context: "Premier national institute for specialized education in hearing and speech communication disorders." },
      { name: "National Institute for the Visually Handicapped (NIVH Dehradun)", context: "Apex national center for visual impairment pedagogy, Braille production, and special education teacher training." },
      { name: "Jamia Millia Islamia (Faculty of Education - B.Ed Special Education, New Delhi)", context: "Top central university department offering accredited specialized teacher education degrees." }
    ],
    ncoCode: "2352.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Rehabilitation Council of India (RCI) / Ministry of Social Justice & Empowerment",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2352 - Special Needs Teachers", url: "https://www.ncs.gov.in" },
      { name: "Rehabilitation Council of India (RCI)", url: "https://rehabcouncil.nic.in" }
    ]
  },

  "educational-counselor": {
    listName: "Educational Counselor",
    title: "Educational & Career Counselor in India: Psychometric Testing & Student Guidance",
    metaDescription:
      "How to become an Educational and Career Counselor in India: MA/M.Sc Psychology, NCERT Diploma in Guidance and Counselling, school counseling, and career coaching.",
    intro:
      "Educational and Career Counselors assist school students, college undergraduates, and parents in making informed academic stream choices, evaluating career aptitudes, managing examination stress, and selecting suitable higher education pathways. In Indian schools (CBSE, ICSE, IB) and private career guidance consultancies, counselors administer standardized psychometric assessments, evaluate academic strengths, conduct behavioral counseling sessions, and facilitate college admissions strategy. Standard qualification involves a Master's degree in Psychology (M.A. / M.Sc Psychology) supplemented by the prestigious NCERT Diploma Course in Guidance and Counselling (DCGC).",
    typicalSubjects: [
      "Psychological Testing, Standardized Aptitude & RIASEC Assessment Inventories",
      "Adolescent Developmental Psychology & Academic Crisis Counseling",
      "Higher Education Curricula, Entrance Exam Matrices & Career Roadmapping",
      "Ethical Standards in Guidance Counseling & Parental Consultation"
    ],
    keyExams: [
      "NCERT DCGC Entrance Examination (Diploma Course in Guidance and Counselling)",
      "CUET-PG (for MA / M.Sc Applied Psychology in Central Universities)",
      "TISS-NET / CUET-PG (for MA in Applied Psychology / Counseling at TISS Mumbai)"
    ],
    colleges: [
      { name: "National Council of Educational Research and Training (NCERT New Delhi)", context: "Apex national education body offering the premier statutory Diploma in Guidance and Counselling (DCGC)." },
      { name: "Tata Institute of Social Sciences (TISS Mumbai)", context: "India's premier social science institute offering advanced clinical and school counseling psychology degrees." },
      { name: "Department of Psychology (University of Delhi)", context: "Historic department renowned for foundational psychometric research and counseling psychology cohorts." },
      { name: "Christ University (Department of Psychology, Bengaluru)", context: "Top private university with extensive practical internship ties with schools and career assessment centers." }
    ],
    ncoCode: "2423.0200",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "NCERT / Rehabilitation Council of India / UGC",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2423 - Personnel and Careers Professionals", url: "https://www.ncs.gov.in" },
      { name: "National Council of Educational Research and Training (NCERT)", url: "https://ncert.nic.in" }
    ]
  },

  "food-technologist": {
    listName: "Food Technologist",
    title: "Food Technologist in India: Food Safety, R&D, FSSAI & Quality Assurance",
    metaDescription:
      "Career pathway for Food Technologists in India: B.Tech Food Technology, FSSAI regulations, food processing, CFTRI Mysore, and FMCG quality control.",
    intro:
      "Food Technologists apply principles of chemistry, microbiology, and process engineering to develop safe, nutritious, packaged food products, formulate preservation techniques, and ensure strict compliance with the Food Safety and Standards Authority of India (FSSAI) norms. Working across major FMCG corporations (Nestle, ITC, Amul, Britannia) and food testing laboratories, food technologists optimize product shelf life, conduct sensory quality evaluations, and design nutritional packaging. Academic preparation starts with a 4-year B.Tech in Food Technology or B.Sc in Food Science, with apex research opportunities at CFTRI Mysore and NIFTEM Kundli.",
    typicalSubjects: [
      "Food Chemistry, Food Microbiology & Nutritional Bio-availability",
      "Food Processing & Preservation Technologies (Thermal, Cryogenic, Membrane)",
      "FSSAI Regulations, HACCP Certification & Food Safety Management Systems",
      "Sensory Analysis, Quality Assurance & Packaging Material Engineering"
    ],
    keyExams: [
      "JEE Main (for B.Tech Food Technology at NIFTEM Kundli / Thanjavur)",
      "CFTRI Entrance Examination (for M.Sc Food Technology at CSIR-CFTRI Mysore)",
      "GATE (Food Technology - XE/XL papers for M.Tech at IITs)"
    ],
    colleges: [
      { name: "CSIR-Central Food Technological Research Institute (CFTRI Mysore)", context: "The undisputed apex scientific research institute in Asia for food technology, grain processing, and food science." },
      { name: "National Institute of Food Technology Entrepreneurship and Management (NIFTEM Kundli / Thanjavur)", context: "Institute of National Importance under Ministry of Food Processing Industries." },
      { name: "Institute of Chemical Technology (ICT Mumbai - Food Engineering & Technology)", context: "Premier chemical and food technology university with legendary food science research laboratories." },
      { name: "IIT Kharagpur (Department of Agricultural and Food Engineering)", context: "Leading engineering department offering advanced food process engineering and automation degrees." }
    ],
    ncoCode: "2141.0300",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Food Safety and Standards Authority of India (FSSAI) / Ministry of Food Processing Industries",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2141 - Industrial and Production Engineers / Food Scientists", url: "https://www.ncs.gov.in" },
      { name: "Food Safety and Standards Authority of India (FSSAI)", url: "https://fssai.gov.in" }
    ]
  },

  "biotechnologist": {
    listName: "Biotechnologist",
    title: "Biotechnologist in India: Genetic Engineering, Biopharma, DBT & CSIR Labs",
    metaDescription:
      "Complete guide to Biotechnology careers in India: Recombinant DNA, biopharmaceuticals, GAT-B exam, vaccine manufacturing, and DBT institutes.",
    intro:
      "Biotechnologists harness cellular and biomolecular processes to develop life-saving biopharmaceuticals, monoclonal antibodies, recombinant vaccines, genetically engineered agricultural crops, and industrial bio-enzymes. In India's world-leading biopharmaceutical and vaccine manufacturing sector (Serum Institute of India, Biocon, Bharat Biotech, Dr. Reddy's), biotechnologists work in downstream purification, fermentation bioprocess engineering, and bioinformatics genomics research. The standard career trajectory begins with a B.Tech or B.Sc in Biotechnology followed by qualifying the Graduate Aptitude Test-Biotechnology (GAT-B) for fellowship-supported Master's programs.",
    typicalSubjects: [
      "Recombinant DNA Technology, Molecular Genetics & Gene Cloning",
      "Bioprocess Engineering, Fermentation Technology & Downstream Processing",
      "Immunology, Monoclonal Antibodies & Vaccine Development",
      "Bioinformatics, Structural Biology & Genomic Sequence Analysis"
    ],
    keyExams: [
      "GAT-B (Graduate Aptitude Test-Biotechnology conducted by Regional Centre for Biotechnology / DBT)",
      "JEE Main & State Engineering CETs (for B.Tech Biotechnology)",
      "CSIR-UGC NET (Life Sciences for Junior Research Fellowship)"
    ],
    colleges: [
      { name: "School of Biotechnology (Jawaharlal Nehru University - JNU New Delhi)", context: "Pioneering biotechnology department in India offering premier DBT-funded research programs." },
      { name: "Indian Institute of Science (IISc Bengaluru - Division of Biological Sciences)", context: "India's highest-ranked scientific research institution with cutting-edge structural biology and genetic engineering labs." },
      { name: "IIT Delhi / IIT Madras (Department of Biotechnology)", context: "Top engineering institutes offering interdisciplinary bioprocess engineering and synthetic biology degrees." },
      { name: "National Centre for Biological Sciences (NCBS-TIFR Bengaluru)", context: "World-class biological science research campus producing leading international biotechnology scholars." }
    ],
    ncoCode: "2131.0200",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Department of Biotechnology (DBT) / CSIR",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2131 - Biologists, Botanists, Zoologists and Related Professionals", url: "https://www.ncs.gov.in" },
      { name: "Department of Biotechnology (DBT), Ministry of Science and Technology", url: "https://dbtindia.gov.in" }
    ]
  },

  "merchant-navy-deck-officer": {
    listName: "Merchant Navy Officer (Deck / Engine)",
    title: "Merchant Navy Officer in India: Nautical Science, IMU-CET, DG Shipping & CoC",
    metaDescription:
      "Step-by-step career path in Merchant Navy (India): IMU-CET exam, B.Sc Nautical Science, B.Tech Marine Engineering, Directorate General of Shipping CoC, and global shipping.",
    intro:
      "Merchant Navy Deck and Engine Officers navigate, maneuver, and maintain commercial cargo vessels, oil tankers, container ships, and LNG carriers transporting international maritime trade across global oceans. Deck officers (progressing from Trainee Cadet to Master Mariner / Captain) manage celestial and satellite ship navigation, cargo stowage, and bridge watchkeeping; Engine officers (progressing to Chief Engineer) operate massive marine diesel propulsion engines, power generation boilers, and shipboard electrical systems. The mandatory statutory pathway requires clearing the Indian Maritime University Common Entrance Test (IMU-CET), completing a DG Shipping approved pre-sea training program, and passing Certificate of Competency (CoC) examinations.",
    typicalSubjects: [
      "Terrestrial & Celestial Ship Navigation, Radar & Electronic Chart Display (ECDIS)",
      "Naval Architecture, Ship Stability Calculations & Cargo Handling (IMDG Code)",
      "International Maritime Law, SOLAS, MARPOL & Colregs Navigation Rules",
      "Marine Engine Operation, Auxiliary Boilers & Shipboard Electrical Systems"
    ],
    keyExams: [
      "IMU-CET (Indian Maritime University Common Entrance Test for B.Sc Nautical Science / Marine Engineering)",
      "Directorate General of Shipping (DGS) 2nd Mate / Class IV Certificate of Competency (CoC) Examinations",
      "Company Sponsorship Tests (Synergy, Anglo-Eastern, Fleet Management, Maersk)"
    ],
    colleges: [
      { name: "Indian Maritime University (IMU Navi Mumbai / Chennai / Kolkata Campuses - T.S. Chanakya)", context: "The historic pioneer of Indian nautical training and premier central maritime university." },
      { name: "Marine Engineering and Research Institute (MERI Kolkata / IMU Kolkata)", context: "India's oldest and most prestigious marine engineering academy (est. 1949)." },
      { name: "Tolani Maritime Institute (TMI Induri, Pune)", context: "Top-ranked private maritime institute with state-of-the-art ship simulator and 100% placement track record." },
      { name: "Anglo-Eastern Maritime Academy (AEMA Karjat)", context: "Premier captive shipping academy providing direct international sponsorship and fleet berths." }
    ],
    ncoCode: "3152.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Directorate General of Shipping (DGS) / Ministry of Ports, Shipping and Waterways",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 3152 - Ships' Deck Officers and Pilots", url: "https://www.ncs.gov.in" },
      { name: "Directorate General of Shipping (DGS India)", url: "https://dgshipping.gov.in" }
    ]
  }
};
