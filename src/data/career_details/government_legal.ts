import type { CareerRoleDetail } from "./types";

export const GOVERNMENT_LEGAL_CAREER_DETAILS: Record<string, CareerRoleDetail> = {
  "civil-services-ias-ips-ifs": {
    listName: "Civil Services (IAS/IPS/IFS)",
    title: "UPSC Civil Services (IAS/IPS/IFS) in India: Examination Stages & Cadre Governance",
    metaDescription:
      "Comprehensive guide to UPSC CSE in India: Prelims (GS & CSAT), Mains (9 written papers), Personality Test, cadre allocation, and LBSNAA foundation.",
    intro:
      "The Indian Civil Services (Indian Administrative Service - IAS, Indian Police Service - IPS, Indian Foreign Service - IFS) represent the apex executive and diplomatic administrative machinery of the Republic of India. Selected through the three-tier Civil Services Examination (CSE) conducted by the Union Public Service Commission (UPSC), officers govern district administration (District Magistrate / Collector), maintain internal law and order (Superintendent of Police), formulate public policy across central ministries, and represent India's geopolitical interests abroad. Eligibility is graduation in any discipline from a recognized university.",
    typicalSubjects: [
      "General Studies (Indian Polity, Governance, Constitution, History & Geography)",
      "Macroeconomics, Sustainable Development, Environment & Science/Tech",
      "Ethics, Integrity and Aptitude (Case Studies & Moral Philosophy)",
      "Chosen Optional Subject (e.g. PSIR, Sociology, Public Administration, Law, History)"
    ],
    keyExams: [
      "UPSC Civil Services Preliminary Examination (GS Paper-I & CSAT Qualifying)",
      "UPSC Civil Services Main Examination (9 Descriptive Written Papers)",
      "UPSC Personality Test / Interview (Conducted at Dholpur House, New Delhi)"
    ],
    colleges: [
      { name: "Lal Bahadur Shastri National Academy of Administration (LBSNAA Mussoorie)", context: "Apex national civil service training institute where all selected All-India Services officers undergo the Foundation Course." },
      { name: "Jawaharlal Nehru University (JNU New Delhi)", context: "Central research university renowned for exceptional performance in UPSC CSE social sciences optional subjects." },
      { name: "St. Stephen's College / Hindu College (University of Delhi)", context: "Historic liberal arts and science colleges with long traditions of producing top-rank civil servants." },
      { name: "National Law School of India University (NLSIU Bengaluru)", context: "Produces top law graduates who consistently secure high All-India ranks in the civil services." }
    ],
    ncoCode: "1112.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Union Public Service Commission (UPSC) / Department of Personnel and Training (DoPT)",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 1112 - Senior Government Officials", url: "https://www.ncs.gov.in" },
      { name: "Union Public Service Commission (UPSC)", url: "https://upsc.gov.in" }
    ]
  },

  "state-psc-officer": {
    listName: "State PSC Officer",
    title: "State PSC Officer in India: Deputy Collector, DSP, SDM & State Civil Services",
    metaDescription:
      "How to crack State Public Service Commission exams in India: Deputy Collector / SDM, DSP, revenue administration, state syllabus, and gazetted ranks.",
    intro:
      "State Public Service Commission Officers (such as Sub-Divisional Magistrate / Deputy Collector, Deputy Superintendent of Police - DSP, Block Development Officer - BDO) form the backbone of state provincial administration. Selected through competitive state civil services examinations (such as UPPSC, MPSC, BPSC, KPSC, TNPSC), officers execute state government developmental schemes, manage tehsil revenue courts, resolve local land disputes, and maintain regional law and order. The pathway requires graduation in any discipline followed by mastery of general studies and state-specific geography, history, and local language legislation.",
    typicalSubjects: [
      "State-Specific History, Culture, Geography & Local Economy",
      "Indian Polity, Public Administration & Panchayati Raj Systems",
      "Land Revenue Code, Tenancy Laws & Disaster Management",
      "General Mental Ability & Regional State Language Proficiency"
    ],
    keyExams: [
      "State Public Service Commission Combined Civil Services Exams (e.g. UPPSC PCS, MPSC Rajyaseva, BPSC CCE, TNPSC Group 1, KPSC KAS)"
    ],
    colleges: [
      { name: "Any UGC-Recognised Degree College / Central University", context: "Graduation in any stream is the statutory requirement across all state public service commissions." },
      { name: "Sardar Patel Institute of Public Administration (SPIPA Ahmedabad)", context: "Premier state-run administrative training academy supporting civil service aspirants." },
      { name: "Yashwantrao Chavan Academy of Development Administration (YASHADA Pune)", context: "Apex administrative training institute of the Government of Maharashtra for state gazetted officers." },
      { name: "Anna Institute of Management (Chennai)", context: "Top state administrative training academy for Tamil Nadu civil servants and Group 1 probationers." }
    ],
    ncoCode: "1112.0200",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "State Public Service Commissions / State Department of General Administration",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 1112 - Senior Provincial Officials", url: "https://www.ncs.gov.in" },
      { name: "Department of Personnel and Training (DoPT)", url: "https://dopt.gov.in" }
    ]
  },

  "ssc-cgl-officer": {
    listName: "SSC CGL Officer",
    title: "SSC CGL Officer in India: Income Tax Inspector, ASO, GST Inspector & CBI Sub-Inspector",
    metaDescription:
      "Complete guide to Staff Selection Commission (SSC CGL) in India: Tier-1 & Tier-2 exams, Group B Gazetted & Non-Gazetted posts, and central ministry postings.",
    intro:
      "Staff Selection Commission Combined Graduate Level (SSC CGL) Officers serve as Group 'B' and 'C' central government officers across ministries, directorates, and intelligence bodies. Prized posts include Assistant Section Officer (ASO in Central Secretariat Services / Ministry of External Affairs), Inspector of Income Tax (CBDT), Central Excise & GST Inspector (CBIC), Enforcement Officer (ED), and Sub-Inspector in the Central Bureau of Investigation (CBI). Selection is governed by rigorous computer-based examinations testing quantitative math, reasoning, English comprehension, and general awareness.",
    typicalSubjects: [
      "Quantitative Aptitude (Arithmetic, Advanced Algebra, Geometry, Trigonometry)",
      "English Language Comprehension & Grammar",
      "General Intelligence & Logical Reasoning",
      "General Awareness, Indian Constitution & Computer Knowledge Module"
    ],
    keyExams: [
      "SSC CGL Tier-I Computer Based Examination",
      "SSC CGL Tier-II Examination (Paper-I Mathematical & English Abilities + Data Entry Speed Test)"
    ],
    colleges: [
      { name: "Any Recognised University Graduation (B.A., B.Sc., B.Com, B.Tech)", context: "Undergraduate degree in any discipline is the sole statutory educational requirement." },
      { name: "Delhi University (Kirori Mal College / Ramjas College)", context: "Central university colleges with massive student participation and success in SSC CGL and central recruitments." },
      { name: "Banaras Hindu University (BHU Varanasi)", context: "Historic central institution whose graduates feature prominently across central ministerial cadres." },
      { name: "Patna University / University of Allahabad", context: "Renowned traditional universities with historic academic grounding in competitive government civil examinations." }
    ],
    ncoCode: "3359.0100",
    skillLevel: "Level 3/4 (Degree / Associate Professional)",
    regulatoryBody: "Staff Selection Commission (SSC) / Ministry of Personnel, Public Grievances and Pensions",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 3359 - Government Associate Professionals", url: "https://www.ncs.gov.in" },
      { name: "Staff Selection Commission (SSC)", url: "https://ssc.gov.in" }
    ]
  },

  "defense-officer-army-navy-air": {
    listName: "Defense Officer (Army/Navy/Air)",
    title: "Commissioned Defense Officer in India: NDA, CDS, SSB Interview & Armed Forces",
    metaDescription:
      "How to become a Commissioned Officer in the Indian Army, Navy, or Air Force: NDA after 12th, CDS post-graduation, 5-day SSB interview, and military academies.",
    intro:
      "Commissioned Defense Officers lead combat units, strategic warships, fighter jet squadrons, and technological corps in the Indian Army, Indian Navy, and Indian Air Force. Officers bear operational command responsibility for national territorial integrity, border defense, airborne tactical strikes, and naval maritime security. Entry routes include the National Defence Academy (NDA) immediately after Class 12 (PCM required for Navy/Air Force), or the Combined Defence Services (CDS) / AFCAT examinations post-graduation, followed by the rigorous 5-day Services Selection Board (SSB) psychometric and obstacle interview.",
    typicalSubjects: [
      "Mathematics & General Ability (NDA / CDS Written Standards)",
      "Military History, International Geopolitics & Tactical Leadership",
      "Physical Endurance, Obstacle Navigation & Officer Like Qualities (OLQ)",
      "Aero-Technical / Nautical / Weapon Engineering Disciplines"
    ],
    keyExams: [
      "NDA & NA Examination (Conducted biannually by UPSC for Class 12 candidates)",
      "CDS Examination (Conducted biannually by UPSC for graduates)",
      "AFCAT (Air Force Common Admission Test)",
      "5-Day SSB Interview (Psychological Tests, GTO Tasks & Conference)"
    ],
    colleges: [
      { name: "National Defence Academy (NDA Khadakwasla, Pune)", context: "The world's first tri-service military academy training cadets of the Army, Navy, and Air Force together." },
      { name: "Indian Military Academy (IMA Dehradun)", context: "Historic cradle of officership for the Indian Army, commissioning Second Lieutenants." },
      { name: "Indian Naval Academy (INA Ezhimala, Kerala)", context: "Asia's largest naval academy offering 4-year B.Tech naval engineering and seamanship training." },
      { name: "Air Force Academy (AFA Dundigal, Hyderabad)", context: "Apex flying and aeronautical academy training fighter pilots and flying officers for the IAF." }
    ],
    ncoCode: "0110.0100",
    skillLevel: "Level 4 (Commissioned Officer / Degree)",
    regulatoryBody: "Ministry of Defence / Integrated Defence Staff (IDS)",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 0110 - Commissioned Armed Forces Officers", url: "https://www.ncs.gov.in" },
      { name: "Join Indian Army / Navy / Air Force Official Portals", url: "https://joinindianarmy.nic.in" }
    ]
  },

  "police-sub-inspector": {
    listName: "Police Sub-Inspector",
    title: "Police Sub-Inspector (SI) in India: Investigation, Law Enforcement & CrPC/BNS",
    metaDescription:
      "Career pathway for Police Sub-Inspectors in India: State Police SI exams, physical efficiency tests (PET), criminal investigation, and police training academies.",
    intro:
      "A Police Sub-Inspector (SI) is the primary investigating officer (IO) under the criminal procedure code, authorized to register First Information Reports (FIRs), conduct crime scene investigations, issue arrest warrants, and submit charge-sheets in criminal courts. Stationed in state police forces or Central Armed Police Forces (CAPF: BSF, CRPF, CISF, ITBP via SSC CPO), SIs manage police station law and order, VIP security protocols, and crime prevention patrols. Entry requires graduation in any discipline followed by clearing written exams, physical efficiency/measurement tests (PET/PMT), and 1 year of state police academy training.",
    typicalSubjects: [
      "Criminal Law & Procedure (Bharatiya Nyaya Sanhita - BNS / CrPC / Indian Evidence Act)",
      "Crime Scene Forensics, Fingerprint Evidence & Ballistics",
      "Police Administration, Crowd Control & Tactical Weapon Handling",
      "General Studies, Reasoning & Regional Language Legislation"
    ],
    keyExams: [
      "State Police Sub-Inspector Recruitment Exams (e.g. UP Police SI, Maharashtra Police SI, Tamil Nadu Police SI)",
      "SSC CPO Examination (for Sub-Inspector in Delhi Police & Central Armed Police Forces)"
    ],
    colleges: [
      { name: "Any UGC-Recognised Degree Graduation", context: "Graduation in Arts, Science, Commerce, or Engineering is the standard statutory eligibility requirement." },
      { name: "Rashtriya Raksha University (RRU Gandhinagar)", context: "Institution of National Importance under Ministry of Home Affairs pioneering national security, policing, and criminology degrees." },
      { name: "State Police Training Academies (PTC Moradabad, MPA Nashik, KPA Thrissur)", context: "State government police academies providing intensive tactical, legal, and physical drill probationer training." },
      { name: "National Forensic Sciences University (NFSU)", context: "Offers advanced post-graduate diplomas in criminal investigation, cyber crime policing, and forensic evidence." }
    ],
    ncoCode: "3355.0100",
    skillLevel: "Level 3/4 (Degree / Law Enforcement)",
    regulatoryBody: "Ministry of Home Affairs / State Police Departments",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 3355 - Police Inspectors & Detectives", url: "https://www.ncs.gov.in" },
      { name: "Bureau of Police Research and Development (BPRD)", url: "https://bprd.nic.in" }
    ]
  },

  "judge-magistrate": {
    listName: "Judge / Magistrate",
    title: "Judge & Magistrate in India: Judicial Services Examination (PCS-J) & LL.B Path",
    metaDescription:
      "How to become a Civil Judge / Judicial Magistrate in India: B.A. LL.B degree, Judicial Services Examination (PCS-J), trial court proceedings, and High Court career.",
    intro:
      "Judges and Judicial Magistrates preside over civil and criminal courts, interpret statutory legislation, evaluate evidence admissibility, and deliver binding legal judgments. In India's judicial hierarchy, law graduates enter the subordinate judiciary as Civil Judge (Junior Division) / Judicial Magistrate First Class (JMFC) through the highly competitive State Judicial Services Examination (PCS-J) conducted by State High Courts and Public Service Commissions. Progression leads to Additional District & Sessions Judge, Principal District Judge, and elevation to High Courts and the Supreme Court of India.",
    typicalSubjects: [
      "Constitutional Law & Jurisprudence",
      "Civil Procedure Code (CPC) & Specific Relief Act",
      "Criminal Procedure Code (CrPC / BNSS) & Penal Law (BNS)",
      "Law of Evidence, Contract Act & Judgment Writing Technique"
    ],
    keyExams: [
      "State Judicial Services Examination (PCS-J: Preliminary, Mains & Viva-Voce)",
      "Higher Judicial Services Examination (HJS - for practicing advocates with 7+ years bar standing)",
      "CLAT-UG / AILET (for 5-year integrated B.A. LL.B / BBA LL.B degree)"
    ],
    colleges: [
      { name: "National Law School of India University (NLSIU Bengaluru)", context: "India's premier statutory law university producing top judicial officers and Supreme Court advocates." },
      { name: "Faculty of Law, University of Delhi (Campus Law Centre - CLC Delhi)", context: "Historic law faculty that has educated dozens of Supreme Court Judges, Chief Justices of India, and Union Law Ministers." },
      { name: "National Law University, Delhi (NLU Delhi)", context: "Top national law university located in the capital with renowned faculty in constitutional and criminal trial procedure." },
      { name: "State Judicial Academies (e.g. National Judicial Academy Bhopal)", context: "Apex statutory training academy providing continuing judicial education and judgment-writing seminars to judges." }
    ],
    ncoCode: "2612.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Supreme Court of India / State High Courts / Bar Council of India",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2612 - Judges", url: "https://www.ncs.gov.in" },
      { name: "Supreme Court of India Official Portal", url: "https://main.sci.gov.in" }
    ]
  },

  "corporate-lawyer": {
    listName: "Corporate Lawyer",
    title: "Corporate Lawyer in India: Mergers & Acquisitions, Private Equity & Top Law Firms",
    metaDescription:
      "Complete guide to Corporate Law in India: 5-year integrated B.A./BBA LL.B, CLAT entrance, M&A due diligence, SEBI compliance, and tier-1 law firm careers.",
    intro:
      "Corporate Lawyers advise business corporations, venture capital funds, and multinational enterprises on commercial transactions, corporate restructuring, venture financing, intellectual property licensing, and regulatory compliance. Practicing in top Indian law firms (Cyril Amarchand Mangaldas, Shardul Amarchand Mangaldas, AZB & Partners, Trilegal) or as in-house general counsel, corporate lawyers draft shareholder agreements, manage cross-border M&A transactions, and ensure adherence to SEBI, RBI, and Competition Commission of India (CCI) mandates. The primary pathway is a 5-year integrated B.A. LL.B or BBA LL.B from a National Law University (NLU) entered via CLAT.",
    typicalSubjects: [
      "Company Law, Corporate Restructuring & Joint Ventures",
      "Securities Regulations & Capital Markets (SEBI Mandates)",
      "Mergers, Acquisitions & Competition / Anti-Trust Law",
      "Contract Drafting, Commercial Due Diligence & Negotiation"
    ],
    keyExams: [
      "CLAT (Common Law Admission Test for 24 National Law Universities)",
      "AILET (All India Law Entrance Test for NLU Delhi)",
      "SLAT (Symbiosis Law Admission Test for Symbiosis Law Schools)",
      "AIBE (All India Bar Examination conducted by the Bar Council of India)"
    ],
    colleges: [
      { name: "National Law School of India University (NLSIU Bengaluru)", context: "The pioneer of 5-year integrated law education in India, dominating domestic and international tier-1 corporate law firm placements." },
      { name: "NALSAR University of Law (Hyderabad)", context: "Consistently top-ranked national law university renowned for banking, commercial transactions, and corporate law scholarship." },
      { name: "The West Bengal National University of Juridical Sciences (WBNUJS Kolkata)", context: "Top national law school producing exceptional corporate M&A associates and in-house legal counsels." },
      { name: "Symbiosis Law School (SLS Pune)", context: "Premier private law school with exceptional corporate law placement track records in Mumbai and Delhi." }
    ],
    ncoCode: "2611.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Bar Council of India (BCI)",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2611 - Lawyers and Legal Professionals", url: "https://www.ncs.gov.in" },
      { name: "Bar Council of India (BCI)", url: "https://www.barcouncilofindia.org" },
      { name: "Consortium of National Law Universities (CLAT)", url: "https://consortiumofnlus.ac.in" }
    ]
  },

  "criminal-lawyer": {
    listName: "Criminal Lawyer",
    title: "Criminal Lawyer in India: Trial Advocacy, Bail Matters, BNS/BNSS & Sessions Court",
    metaDescription:
      "How to become a Criminal Defense Lawyer in India: LL.B degree, trial court cross-examination, criminal appeals, Bar Council enrollment, and High Court practice.",
    intro:
      "Criminal Lawyers (Criminal Defense Advocates) defend individuals, organizations, or public figures accused of criminal offenses under the Bharatiya Nyaya Sanhita (BNS), Prevention of Money Laundering Act (PMLA), NDPS Act, and special criminal statutes. Practicing before Magistrate Courts, Sessions Courts, High Courts, and the Supreme Court of India, criminal advocates argue anticipatory and regular bail applications, conduct intense cross-examination of prosecution witnesses, and argue trial defense. The pathway requires a 3-year LL.B (post-graduation) or 5-year integrated B.A. LL.B, followed by enrollment with a State Bar Council and clearing the All India Bar Examination (AIBE).",
    typicalSubjects: [
      "Criminal Substantive Law (BNS / Indian Penal Code)",
      "Criminal Procedural Law (BNSS / Code of Criminal Procedure)",
      "Law of Evidence & Forensic Medico-Legal Examination",
      "Trial Court Advocacy, Cross-Examination & Criminal Appellate Practice"
    ],
    keyExams: [
      "CLAT-UG / AILET (for 5-Year integrated law degrees)",
      "CUET-PG / Delhi University LL.B Entrance Exam (for 3-Year LL.B)",
      "All India Bar Examination (AIBE by Bar Council of India)"
    ],
    colleges: [
      { name: "Campus Law Centre (Faculty of Law, University of Delhi)", context: "India's premier training ground for trial court and appellate criminal defense advocates." },
      { name: "Government Law College (GLC Mumbai)", context: "Asia's oldest law institution (est. 1855) located directly opposite the Mumbai Sessions Court and Bombay High Court." },
      { name: "National Law University, Jodhpur (NLU Jodhpur)", context: "Leading national law university renowned for criminal jurisprudence and trial advocacy moot court teams." },
      { name: "ILS Law College (Pune)", context: "Historic autonomous law college with legendary trial advocacy alumni across Indian High Courts." }
    ],
    ncoCode: "2611.0200",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Bar Council of India (BCI)",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2611 - Advocates and Legal Counsel", url: "https://www.ncs.gov.in" },
      { name: "Bar Council of India (BCI)", url: "https://www.barcouncilofindia.org" }
    ]
  },

  "cyber-lawyer": {
    listName: "Cyber Lawyer",
    title: "Cyber Lawyer in India: IT Act 2000, DPDP Act 2023, Data Privacy & Cybercrime",
    metaDescription:
      "Career roadmap for Cyber Lawyers in India: IT Act, Digital Personal Data Protection Act, cyber fraud litigation, tech transactions, and B.A. LL.B path.",
    intro:
      "Cyber Lawyers specialize in legal issues governing cyberspace, internet transactions, data protection, and digital crime. In India, cyber lawyers handle corporate compliance under the Digital Personal Data Protection (DPDP) Act, 2023, data breach liability, cloud computing contracts, intermediary guidelines compliance under the IT Act, 2000, and representation before Cyber Appellate Adjudicating Officers and High Courts. Preparation involves an integrated B.A./BBA LL.B or B.Tech LL.B combined with specialized post-graduate diplomas in Cyber Law & Information Security.",
    typicalSubjects: [
      "Information Technology Act, 2000 & Digital Personal Data Protection (DPDP) Act",
      "Electronic Evidence Admissibility (Section 65B Certificate Norms)",
      "Cybercrime Investigation, Hacking, Phishing & Financial Fraud Laws",
      "Cloud Computing Contracts, Artificial Intelligence Governance & Intermediary Liability"
    ],
    keyExams: [
      "CLAT / AILET / LSAT India (for law graduation)",
      "All India Bar Examination (AIBE for litigation rights)"
    ],
    colleges: [
      { name: "National Forensic Sciences University (NFSU Gandhinagar - School of Cyber Law)", context: "Unique national institute combining digital forensics technology with cyber law litigation training." },
      { name: "IIIT Allahabad (M.Tech / MS Cyber Law & Information Security)", context: "Pioneered techno-legal education bridging computer science security with Indian cyber jurisprudence." },
      { name: "Gujarat National Law University (GNLU Gandhinagar)", context: "Leading NLU with dedicated Center for Internet Governance and Cyber Security Law." },
      { name: "Indian Law Institute (ILI New Delhi)", context: "Deemed university under the Supreme Court of India offering premier specialized post-graduate diplomas in Cyber Law." }
    ],
    ncoCode: "2611.0300",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Bar Council of India (BCI) / Ministry of Electronics and Information Technology (MeitY)",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2611 - Cyber Law Specialists", url: "https://www.ncs.gov.in" },
      { name: "Ministry of Electronics and Information Technology (MeitY)", url: "https://www.meity.gov.in" }
    ]
  },

  "legal-advisor": {
    listName: "Legal Advisor",
    title: "Legal Advisor in India: In-House Legal Counsel, Contract Governance & Compliance",
    metaDescription:
      "Step-by-step path to becoming a Corporate In-House Legal Advisor in India: Contract drafting, statutory compliance, risk management, and LL.B/LL.M degree.",
    intro:
      "Legal Advisors (In-House Legal Counsel) work directly within corporations, banks, healthcare networks, and public institutions to manage legal risks, draft commercial vendor contracts, oversee intellectual property assets, and ensure strict compliance with statutory regulations. Unlike law firm litigators, in-house legal advisors participate directly in business strategy, advising leadership on joint ventures, labor laws, consumer protection claims, and external litigation management. The career requires an LL.B from a recognized university, often complemented by an LL.M in Corporate Law or a Company Secretary (CS) qualification.",
    typicalSubjects: [
      "Commercial Contract Drafting & Vendor Service Level Agreements (SLAs)",
      "Labor Laws, Industrial Disputes & Workplace POSH Compliance",
      "Consumer Protection Act & Alternative Dispute Resolution (Arbitration/Mediation)",
      "Regulatory Compliance Audits & Litigation Management"
    ],
    keyExams: [
      "CLAT / State Law CETs (for LL.B degree)",
      "All India Bar Examination (AIBE)"
    ],
    colleges: [
      { name: "National Law University, Jodhpur (B.B.A. LL.B Corporate Honors)", context: "Premier national law school with specialized management-law integration producing top in-house legal counsels." },
      { name: "Symbiosis Law School (SLS Noida / Pune)", context: "Top private law school with extensive corporate internship pipelines across leading Indian multinational firms." },
      { name: "Amity Law School (Noida / Delhi)", context: "Well-established law institution with active corporate legal placement cells across NCR corporate hubs." },
      { name: "School of Law, Christ University (Bengaluru)", context: "Leading private law school with deep connections to Bengaluru's tech and venture capital ecosystem." }
    ],
    ncoCode: "2619.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Bar Council of India (BCI)",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2619 - Legal Professionals", url: "https://www.ncs.gov.in" },
      { name: "Bar Council of India (BCI)", url: "https://www.barcouncilofindia.org" }
    ]
  },

  "public-prosecutor": {
    listName: "Public Prosecutor",
    title: "Public Prosecutor in India: Assistant Public Prosecutor (APP), State Trials & CrPC",
    metaDescription:
      "How to become a Public Prosecutor (APP/PP) in India: State PSC Assistant Prosecution Officer exams, criminal trial prosecution, and victim advocacy.",
    intro:
      "Public Prosecutors (Assistant Public Prosecutors - APP / District Public Prosecutors) represent the State in criminal prosecutions before Magistrates and Sessions Courts on behalf of victims of crime and society at large. As ministers of justice, prosecutors present evidence gathered by the police, examine witnesses, argue charges during trial, and oppose bail applications. In India, APPs are recruited through state Public Service Commission competitive examinations (APO / APP exams) open to law graduates with designated courtroom trial experience.",
    typicalSubjects: [
      "Criminal Substantive Law (BNS / Indian Penal Code)",
      "Criminal Procedure Code (BNSS / CrPC) & Police Station Protocols",
      "Law of Evidence, Burden of Proof & Examination-in-Chief",
      "Criminology, Victimology & Sentencing Jurisprudence"
    ],
    keyExams: [
      "State Public Service Commission Assistant Prosecution Officer (APO / APP) Exams",
      "All India Bar Examination (AIBE)"
    ],
    colleges: [
      { name: "Faculty of Law, Banaras Hindu University (BHU Varanasi)", context: "Historic national law faculty known for outstanding scholarship in criminal trial prosecution and evidence law." },
      { name: "Campus Law Centre (University of Delhi)", context: "Produces top government prosecutors and standing counsels for state and central prosecution directorates." },
      { name: "National Law Institute University (NLIU Bhopal)", context: "Pioneering NLU offering dedicated post-graduate scholarship in criminal law, forensics, and justice administration." },
      { name: "Government Law College (GLC Mumbai)", context: "Direct clinical exposure to Mumbai's criminal prosecution courts and public prosecutor chambers." }
    ],
    ncoCode: "2611.0400",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "State Directorate of Prosecution / High Courts / Bar Council of India",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2611 - Public Prosecutors", url: "https://www.ncs.gov.in" },
      { name: "Ministry of Law and Justice, Government of India", url: "https://lawmin.gov.in" }
    ]
  },

  "patent-attorney": {
    listName: "Patent Attorney",
    title: "Patent Attorney in India: Patent Agent Examination, IPO, STEM & IP Law",
    metaDescription:
      "Career guide for Patent Attorneys & Agents in India: Indian Patent Agent Exam (CGPDTM), patent drafting, STEM degree + LL.B, and global IP litigation.",
    intro:
      "Patent Attorneys draft, file, prosecute, and litigate patent applications protecting inventions in biotechnology, pharmaceuticals, artificial intelligence, and mechanical engineering. In India, practicing before the Indian Patent Office (Controller General of Patents, Designs and Trade Marks - CGPDTM) requires qualifying the statutory Indian Patent Agent Examination. When combined with a law degree (LL.B), patent attorneys litigate patent infringement disputes before High Courts and draft international patent filings under the Patent Cooperation Treaty (PCT). Eligibility requires a science, pharmacy, or engineering degree.",
    typicalSubjects: [
      "Indian Patents Act, 1970 & Patent Rules",
      "Patent Specification Drafting, Claims Construction & Prior Art Search",
      "Intellectual Property International Treaties (PCT, TRIPS Agreement, Paris Convention)",
      "Patent Litigation, Infringement Analysis & Compulsory Licensing"
    ],
    keyExams: [
      "Indian Patent Agent Examination (Conducted annually by CGPDTM, Ministry of Commerce & Industry)",
      "All India Bar Examination (AIBE - for full Patent Advocate standing)"
    ],
    colleges: [
      { name: "IIT Kharagpur (Rajiv Gandhi School of Intellectual Property Law - RGSOIPL)", context: "India's only national law school requiring a mandatory Science/Engineering/Pharmacy degree for LL.B admission, specialising in IP and patent law." },
      { name: "National Law School of India University (NLSIU Bengaluru - Center for IP Education & Research)", context: "Apex statutory research center leading national patent policy and pharmaceutical patent jurisprudence." },
      { name: "NALSAR University of Law (Hyderabad - Center for Intellectual Property Rights)", context: "Top national law university offering advanced post-graduate diplomas in patent drafting and technological IP assets." },
      { name: "Department of Science and Technology (DST Women Scientist Scheme - WOS-C in IP)", context: "Pioneering government program providing specialized patent agent training and stipends to female scientists and engineers." }
    ],
    ncoCode: "2611.0500",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Controller General of Patents, Designs and Trade Marks (CGPDTM) / Bar Council of India",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2611 - Patent Agents and Attorneys", url: "https://www.ncs.gov.in" },
      { name: "Intellectual Property India (CGPDTM)", url: "https://ipindia.gov.in" }
    ]
  },

  "rbi-grade-b-officer": {
    listName: "RBI Grade B Officer",
    title: "RBI Grade B Officer in India: Central Banking, Monetary Policy & Financial Regulation",
    metaDescription:
      "How to crack RBI Grade B in India: Phase-1 & Phase-2 exams, Economic and Social Issues (ESI), Finance & Management, and central bank career path.",
    intro:
      "Reserve Bank of India (RBI) Grade 'B' Officers (Direct Recruit Managers) formulate monetary policy, regulate commercial banks and NBFCs, manage national foreign exchange reserves ($650B+), oversee the national currency issuance, and maintain payment system financial stability (UPI, NEFT, RTGS). Direct recruitment is conducted through the prestigious nationwide RBI Grade B examination, testing Economic and Social Issues (ESI), Finance & Management (FM), and quantitative reasoning. Officers work at RBI Central Office Mumbai and regional branches, enjoying immense policy influence, high compensation, and international deputations to the IMF and World Bank.",
    typicalSubjects: [
      "Macroeconomics, Monetary Policy Transmission & Inflation Targeting",
      "Indian Financial System, Banking Regulations & Capital Markets",
      "Corporate Governance, Organizational Behavior & Leadership",
      "Descriptive English Writing, Economic Essay & Précis"
    ],
    keyExams: [
      "RBI Grade 'B' Phase-I Online Examination (General Awareness, Reasoning, Quant, English)",
      "RBI Grade 'B' Phase-II Examination (Paper 1: ESI, Paper 2: English, Paper 3: Finance & Management)",
      "RBI Grade 'B' Interview (Conducted at RBI Central Office, Mumbai)"
    ],
    colleges: [
      { name: "Any UGC-Recognised Graduation (Minimum 60% marks in Graduation/12th/10th)", context: "Graduation in any discipline is eligible; engineering, economics, and commerce graduates feature prominently." },
      { name: "Delhi School of Economics (DSE Delhi - M.A. Economics)", context: "India's apex economics department producing top central bankers, chief economic advisors, and RBI policy researchers." },
      { name: "Indira Gandhi Institute of Development Research (IGIDR Mumbai)", context: "Advanced research institute established directly by the Reserve Bank of India specializing in macroeconomic policy." },
      { name: "National Institute of Bank Management (NIBM Pune)", context: "Premier banking institute established by RBI providing specialized financial regulation and risk management education." }
    ],
    ncoCode: "2412.0400",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Reserve Bank of India (RBI)",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2412 - Central Banking Officers", url: "https://www.ncs.gov.in" },
      { name: "Reserve Bank of India (RBI Opportunities)", url: "https://opportunities.rbi.org.in" }
    ]
  },

  "indian-forest-service-ifs": {
    listName: "Indian Forest Service (IFS)",
    title: "Indian Forest Service (IFS) in India: Wildlife Conservation, Ecology & UPSC IFS",
    metaDescription:
      "Complete guide to UPSC Indian Forest Service (IFS): Prelims via CSE, IFS Mains, Forestry/Botany/Zoology optionals, wildlife preservation, and IGNFA training.",
    intro:
      "The Indian Forest Service (IFS) is one of the three All-India Services (alongside IAS and IPS) constituted under Article 312 of the Constitution. IFS officers manage and conserve national parks, wildlife sanctuaries, tiger reserves, state forest resources, and ecological watersheds. Officers serve as Divisional Forest Officers (DFO), Conservators of Forests, and Principal Chief Conservators of Forests (PCCF), enforcing the Wildlife Protection Act and Forest Conservation Act. Candidates must hold a bachelor's degree with at least one science subject (Botany, Chemistry, Forestry, Geology, Mathematics, Physics, Zoology, Agriculture, or Engineering), clear the UPSC CSE Prelims, and write the specialized UPSC IFS Main Examination.",
    typicalSubjects: [
      "General English & General Knowledge",
      "Two Optional Subjects from approved Science/Engineering list (e.g. Forestry, Botany, Zoology, Agriculture, Chemical/Civil/Mechanical Engineering)",
      "Wildlife Ecology, Biodiversity Conservation & Environmental Jurisprudence"
    ],
    keyExams: [
      "UPSC Civil Services (Preliminary) Examination (Used as the common screening stage)",
      "UPSC Indian Forest Service (Main) Examination (6 Descriptive Written Papers)",
      "UPSC IFS Personality Test and Walking Endurance Fitness Test"
    ],
    colleges: [
      { name: "Indira Gandhi National Forest Academy (IGNFA Dehradun)", context: "Apex statutory national academy where selected IFS probationers undergo 2 years of rigorous forestry, wildlife, and weapon training." },
      { name: "Forest Research Institute (FRI Dehradun - Deemed University)", context: "India's premier historic forestry research institution offering advanced master's in forestry and wood science." },
      { name: "Dr. Yashwant Singh Parmar University of Horticulture and Forestry (Nauni, Solan)", context: "Pioneering state forestry university producing top merit candidates in UPSC IFS examinations." },
      { name: "Wildlife Institute of India (WII Dehradun)", context: "Apex national wildlife research institution providing specialized biodiversity and tiger conservation training." }
    ],
    ncoCode: "2132.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Ministry of Environment, Forest and Climate Change (MoEFCC) / UPSC",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2132 - Forestry and Conservation Professionals", url: "https://www.ncs.gov.in" },
      { name: "Ministry of Environment, Forest and Climate Change (MoEFCC)", url: "https://moef.gov.in" }
    ]
  },

  "diplomat-ifs": {
    listName: "Diplomat (IFS)",
    title: "Diplomat (Indian Foreign Service - IFS): Foreign Policy, Embassies & MEA Career",
    metaDescription:
      "How to become an Indian Diplomat (IFS): UPSC CSE top rank cutoffs, Foreign Service Institute (SSSIFS), bilateral diplomacy, and United Nations postings.",
    intro:
      "Officers of the Indian Foreign Service (IFS) represent the Republic of India abroad across Indian Embassies, High Commissions, and permanent missions to the United Nations in New York and Geneva. Diplomats negotiate bilateral trade treaties, navigate international geopolitical crises, promote Indian commercial and cultural diplomacy, and protect Indian expatriate citizens worldwide. Selected through the top percentile ranks of the UPSC Civil Services Examination, IFS probationers undergo intensive training in international law, diplomatic protocol, geopolitical history, and master a compulsory foreign language (such as Arabic, Mandarin, Russian, French, Spanish, or German) at the Sushma Swaraj Institute of Foreign Service (SSSIFS).",
    typicalSubjects: [
      "International Relations, Geopolitics & Foreign Policy Strategy",
      "Public International Law, Treaties & Maritime UNCLOS Norms",
      "Diplomatic Trade Negotiations, Strategic Security & Global Economics",
      "Compulsory Foreign Language Acquisition"
    ],
    keyExams: [
      "UPSC Civil Services Examination (CSE: Preliminary, Mains & Personality Interview)",
      "Foreign Service Institute (SSSIFS) Compulsory Foreign Language (CFL) Qualifying Examination",
      "United Nations Young Professionals Programme (UN YPP Examination - Global Diplomatic Track)"
    ],
    colleges: [
      { name: "Sushma Swaraj Institute of Foreign Service (SSSIFS New Delhi)", context: "Apex diplomatic training academy of the Ministry of External Affairs where all Indian diplomats undergo rigorous diplomatic training." },
      { name: "School of International Studies (SIS, Jawaharlal Nehru University, New Delhi)", context: "India's premier international relations research school whose alumni form a substantial portion of the diplomatic corps." },
      { name: "St. Stephen's College / Hindu College (University of Delhi)", context: "Produces numerous top UPSC merit rankers who choose the Indian Foreign Service as their first preference." },
      { name: "Jadavpur University (Department of International Relations, Kolkata)", context: "Historic Eastern Indian international relations department with distinguished diplomatic alumni." }
    ],
    ncoCode: "1112.0300",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Ministry of External Affairs (MEA) / UPSC",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 1112 - Foreign Affairs Officials", url: "https://www.ncs.gov.in" },
      { name: "Ministry of External Affairs, Government of India", url: "https://www.mea.gov.in" }
    ]
  },

  "indian-revenue-service-irs": {
    listName: "Indian Revenue Service (IRS) Officer",
    title: "Indian Revenue Service (IRS) Officer: Income Tax, Customs & Central GST Cadre",
    metaDescription:
      "Career guide for Indian Revenue Service (IRS) Officers: UPSC CSE ranks, NADT Nagpur / NACIN training, tax investigation, transfer pricing, and revenue policy.",
    intro:
      "Officers of the Indian Revenue Service (IRS - comprising IRS Income Tax and IRS Customs & Indirect Taxes) administer the sovereign direct and indirect taxation systems of the Government of India. Selected through the Union Public Service Commission Civil Services Examination (UPSC CSE), IRS officers manage regional tax assessments, conduct anti-evasion raids, investigate cross-border transfer pricing discrepancies, and shape national fiscal policy under the Department of Revenue (Ministry of Finance). Foundation training is conducted at the National Academy of Direct Taxes (NADT Nagpur) and National Academy of Customs, Indirect Taxes & Narcotics (NACIN Faridabad).",
    typicalSubjects: [
      "Direct Taxation Jurisprudence (Income Tax Act 1961 & International Tax Law)",
      "Indirect Taxation & Goods and Services Tax (CGST, IGST & Customs Act)",
      "Financial Investigation, Anti-Money Laundering (PMLA) & Forensic Auditing",
      "Public Finance, Macroeconomic Fiscal Policy & Administrative Law"
    ],
    keyExams: [
      "UPSC Civil Services Examination (CSE Preliminary, Mains & Interview)",
      "NADT / NACIN Departmental Promotional Examinations"
    ],
    colleges: [
      { name: "National Academy of Direct Taxes (NADT Nagpur)", context: "Apex national training academy where IRS (Income Tax) probationers complete their 16-month professional tax administration course." },
      { name: "National Academy of Customs, Indirect Taxes & Narcotics (NACIN Faridabad)", context: "Premier academy training IRS (Customs & Indirect Taxes) probationers in customs enforcement and GST administration." },
      { name: "Shri Ram College of Commerce (SRCC Delhi)", context: "Top commerce institution whose graduates consistently achieve high ranks in the civil services revenue cadre." },
      { name: "National Law School of India University (NLSIU Bengaluru)", context: "Produces law graduates with strong statutory interpretation skills suited for tax administration." }
    ],
    ncoCode: "1112.0400",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Central Board of Direct Taxes (CBDT) / Central Board of Indirect Taxes and Customs (CBIC)",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 1112 - Senior Government Officials", url: "https://www.ncs.gov.in" },
      { name: "Central Board of Direct Taxes (CBDT)", url: "https://incometaxindia.gov.in" }
    ]
  },

  "litigation-lawyer": {
    listName: "Litigation Lawyer",
    title: "Litigation Lawyer in India: Trial Courts, High Courts & Supreme Court Practice",
    metaDescription:
      "Complete pathway to becoming a Litigation Advocate in India: AIBE examination, Bar Council enrollment, trial advocacy, High Court briefs, and senior counsel tracks.",
    intro:
      "Litigation Lawyers (Advocates) represent citizens, corporations, and government bodies in adversarial legal proceedings across District Courts, High Courts, the Supreme Court of India, and specialized tribunals (NCLT, NGT, CAT). Litigation advocates draft petitions, conduct cross-examinations of witnesses, argue constitutional and statutory interpretations before judges, and obtain interlocutory injunctions. The mandatory pathway requires a 5-year integrated BA LLB / BBA LLB or 3-year LLB from a Bar Council of India (BCI) approved institution, clearing the All India Bar Examination (AIBE), and training under established senior trial advocates.",
    typicalSubjects: [
      "Code of Civil Procedure (CPC 1908) & Law of Injunctions",
      "Criminal Procedure (BNSS / CrPC), Bharatiya Nyaya Sanhita & Indian Evidence Act",
      "Constitutional Law of India (Writ Jurisprudence under Article 32 & 226)",
      "Courtroom Cross-Examination, Oral Arguments & Legal Drafting"
    ],
    keyExams: [
      "CLAT-UG / AILET (Common Law Admission Test for National Law Universities)",
      "CUET-UG / State Law CETs (for 5-year and 3-year LLB programs)",
      "All India Bar Examination (AIBE conducted by the Bar Council of India)"
    ],
    colleges: [
      { name: "National Law School of India University (NLSIU Bengaluru)", context: "India's top-ranked law school producing leading advocates practicing before the Supreme Court and High Courts." },
      { name: "Faculty of Law (University of Delhi - Campus Law Centre)", context: "Historic institution that has produced the highest number of Supreme Court judges, Attorneys General, and senior litigators." },
      { name: "National Academy of Legal Studies and Research (NALSAR Hyderabad)", context: "Premier law university celebrated for constitutional law research and trial advocacy excellence." },
      { name: "ILSR / Government Law College (GLC Mumbai)", context: "Asia's oldest law school situated adjacent to the Bombay High Court with unmatched practical courtroom apprentice heritage." }
    ],
    ncoCode: "2611.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Bar Council of India (BCI) / State Bar Councils",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2611 - Lawyers and Advocates", url: "https://www.ncs.gov.in" },
      { name: "Bar Council of India (BCI)", url: "https://www.barcouncilofindia.org" }
    ]
  },

  "tax-lawyer": {
    listName: "Tax Lawyer",
    title: "Tax Lawyer in India: Direct Tax Litigation, GST Tribunals & High Court Practice",
    metaDescription:
      "Career guide for Tax Lawyers in India: Income Tax Appellate Tribunal (ITAT), GST disputes, corporate restructuring, transfer pricing, and BCI law routes.",
    intro:
      "Tax Lawyers specialize in statutory tax controversy, advisory planning, and litigation before the Income Tax Appellate Tribunal (ITAT), Customs Excise and Service Tax Appellate Tribunal (CESTAT), High Courts, and the Supreme Court. They defend corporations and high-net-worth individuals against tax reassessment orders, handle GST classification disputes, advise on mergers and cross-border M&A tax consequences, and represent clients during enforcement directorate proceedings. Entering this specialized field requires an LLB degree, enrollment with the Bar Council, and deep mastery of direct and indirect tax statutes.",
    typicalSubjects: [
      "Income Tax Act 1961 & International Tax Treaties (DTAA)",
      "Goods and Services Tax (GST) Acts & Anti-Profiteering Regulations",
      "Corporate Restructuring & Cross-Border Transfer Pricing Litigation",
      "Appellate Advocacy & Writ Jurisdiction in Fiscal Matters"
    ],
    keyExams: [
      "CLAT-UG / AILET (for premier law schools)",
      "All India Bar Examination (AIBE for certificate of practice)",
      "CA / CS Qualifying Examinations (Optional complementary dual-qualification track)"
    ],
    colleges: [
      { name: "National Law School of India University (NLSIU Bengaluru)", context: "Apex law institute offering advanced electives in corporate taxation and international commercial arbitration." },
      { name: "National Law University Delhi (NLU Delhi)", context: "Leading central law university with specialized centres for commercial law and direct tax litigation." },
      { name: "The West Bengal National University of Juridical Sciences (WBNUJS Kolkata)", context: "Top National Law University with distinguished tax law faculty and strong corporate law placements." },
      { name: "Faculty of Law (University of Delhi)", context: "Premier law centre producing eminent tax jurists and senior counsel arguing before the Delhi High Court." }
    ],
    ncoCode: "2611.0200",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Bar Council of India (BCI) / Income Tax Appellate Tribunal",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2611 - Lawyers", url: "https://www.ncs.gov.in" },
      { name: "Income Tax Appellate Tribunal (ITAT)", url: "https://itat.gov.in" }
    ]
  },

  "block-development-officer-bdo": {
    listName: "Block Development Officer (BDO)",
    title: "Block Development Officer (BDO) in India: Rural Development & Panchayati Raj",
    metaDescription:
      "How to become a Block Development Officer (BDO) in India: State PSC examinations (UPPSC, BPSC, MPSC), rural administration, MGNREGA execution, and tehsil governance.",
    intro:
      "Block Development Officers (BDOs) are key gazetted administrative leaders responsible for executing rural development schemes, socio-economic welfare programs, and infrastructure projects across rural community development blocks. Selected through State Public Service Commission (State PSC) exams, BDOs supervise the implementation of MGNREGA employment works, rural housing (PMAY-G), sanitation campaigns (Swachh Bharat), and coordinate with Gram Panchayats and elected block samiti representatives. The career demands exceptional grassroots leadership, public grievance redressal capability, and rural governance acumen.",
    typicalSubjects: [
      "Rural Sociology, Agrarian Economics & Community Development Planning",
      "Panchayati Raj Institutions (73rd Constitutional Amendment Act)",
      "Government Welfare Program Execution & Social Audit Methodologies",
      "State Revenue Administration & Disaster Relief Coordination"
    ],
    keyExams: [
      "State Public Service Commission Combined Civil Services Exams (UPPSC, BPSC, MPSC, MPPSC, JPSC)"
    ],
    colleges: [
      { name: "Any UGC-Recognized Degree College / University", context: "A bachelor's degree in any discipline is the statutory qualification to appear for State PSC examinations." },
      { name: "National Institute of Rural Development & Panchayati Raj (NIRDPR Hyderabad)", context: "Apex autonomous organization under Ministry of Rural Development for rural administration capacity building." },
      { name: "Tata Institute of Social Sciences (TISS Mumbai)", context: "Premier social science institute with specialized programs in rural development and public governance." },
      { name: "State Administrative Training Academies (e.g. ATI Mysore, BIPARD Patna)", context: "State government academies providing foundational administrative training to selected state civil servants." }
    ],
    ncoCode: "1112.0500",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "State Public Service Commissions / Ministry of Panchayati Raj",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 1112 - Senior Government Officials", url: "https://www.ncs.gov.in" },
      { name: "Ministry of Rural Development, Government of India", url: "https://rural.nic.in" }
    ]
  },

  "railway-services-officer": {
    listName: "Railway Services (RRB / IRMS) Officer",
    title: "Indian Railway Management Service (IRMS) & RRB Officer in India",
    metaDescription:
      "Career pathway in Indian Railways: IRMS recruitment, UPSC Civil Services, RRB NTPC Officers, railway operations, locomotive maintenance, and NAIR Vadodara.",
    intro:
      "Officers in the Indian Railways—recruited through the Indian Railway Management Service (IRMS) via UPSC and the Railway Recruitment Board (RRB)—manage one of the largest rail transportation networks in the world. Officers lead train traffic operations, locomotive rolling stock maintenance, signaling and telecommunications infrastructure, freight terminal logistics, and passenger safety. Probationers complete specialized managerial and technical training at the National Academy of Indian Railways (NAIR Vadodara) and the Indian Railway Institute of Transport Management (IRITM Lucknow).",
    typicalSubjects: [
      "Railway Operations Management, Line Capacity & Timetable Scheduling",
      "Railway Signaling Systems, Telecommunications & Automatic Train Protection (Kavach)",
      "Freight Logistics, Revenue Optimization & Multimodal Connectivity",
      "Transport Economics, Industrial Safety Norms & Rail Disaster Management"
    ],
    keyExams: [
      "UPSC Indian Railway Management Service (IRMS) / Civil Services Examination",
      "UPSC Engineering Services Examination (ESE for Railway Technical Cadre)",
      "RRB Non-Technical Popular Categories (RRB NTPC for Station Master / Traffic Apprentice)"
    ],
    colleges: [
      { name: "National Academy of Indian Railways (NAIR Vadodara)", context: "Apex training institute for Group 'A' and 'B' officers of Indian Railways providing centralized management induction." },
      { name: "Gati Shakti Vishwavidyalaya (Vadodara)", context: "Central university under Ministry of Railways specializing in transportation systems and logistics engineering." },
      { name: "Indian Railway Institute of Transport Management (IRITM Lucknow)", context: "Premier training institute dedicated to railway traffic, operations, and freight logistics leadership." },
      { name: "IIT Roorkee / IIT Kharagpur", context: "Leading engineering institutions with specialized railway technology and infrastructure research centres." }
    ],
    ncoCode: "1112.0600",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Railway Board / Ministry of Railways (Govt of India)",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 1112 - Senior Government Officials", url: "https://www.ncs.gov.in" },
      { name: "Ministry of Railways, Government of India", url: "https://indianrailways.gov.in" }
    ]
  }
};
