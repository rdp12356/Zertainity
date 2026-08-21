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
  }
};
