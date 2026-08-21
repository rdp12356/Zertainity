import type { CareerRoleDetail } from "./types";

export const TECHNOLOGY_CAREER_DETAILS: Record<string, CareerRoleDetail> = {
  "software-engineer": {
    listName: "Software Engineer",
    title: "Software Engineer in India: Path After 12th & Degree Roadmap",
    metaDescription:
      "Complete guide to becoming a Software Engineer in India: B.Tech CS vs BCA, JEE Main/Advanced, coding rounds, and top Indian engineering institutes.",
    intro:
      "Software engineering in India spans enterprise backend platforms, distributed microservices, and consumer tech. Most engineers pursue a 4-year B.Tech or B.E. in Computer Science or Information Technology through national and state engineering entrances. Alternatively, students enter via BCA followed by MCA. While tier-1 college brands facilitate initial campus placement drives, long-term technical trajectory is strictly governed by mastery of Data Structures and Algorithms (DSA), low-level systems design, Git workflows, and demonstrable production code on GitHub or open-source repositories.",
    typicalSubjects: [
      "Mathematics (Calculus, Linear Algebra, Discrete Math)",
      "Physics (Mechanics & Electromagnetism for engineering entrance)",
      "Computer Science (Data Structures, Algorithms, OOP)",
      "English & Technical Communication"
    ],
    keyExams: [
      "JEE Main & JEE Advanced (IITs, NITs, IIITs)",
      "BITSAT (BITS Pilani, Goa, Hyderabad)",
      "State Engineering CETs (MHT-CET, WBJEE, KCET, TANCET)",
      "NIMCET (for MCA admissions post-BCA/B.Sc)"
    ],
    colleges: [
      { name: "IIT Bombay / IIT Delhi / IIT Madras", context: "Apex technical institutions with rigorous CS curricula, top research labs, and tier-1 product firm recruitments." },
      { name: "BITS Pilani (Pilani, Goa, Hyderabad)", context: "Top private merit-only institution featuring strong industry practice school internships and zero attendance policy." },
      { name: "IIIT Hyderabad / IIIT Delhi", context: "Specialised computing institutes with globally recognised competitive programming cultures and advanced research centres." },
      { name: "Top State Government Colleges (COEP Pune, VJTI Mumbai, Jadavpur University)", context: "High return-on-investment state colleges with strong alumni networks across Indian tech hubs." }
    ],
    ncoCode: "2512.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "AICTE / UGC",
    lastReviewed: "August 2026",
    sources: [
      { name: "National Classification of Occupations (NCO-2015) - Ministry of Labour & Employment", url: "https://www.ncs.gov.in" },
      { name: "Joint Entrance Examination (JEE Apex Board / NTA)", url: "https://jeemain.nta.nic.in" }
    ]
  },

  "data-scientist": {
    listName: "Data Scientist",
    title: "Data Scientist in India: Education Roadmap, Statistics & AI",
    metaDescription:
      "How to build a Data Science career in India: Mathematics, Python, SQL, Machine Learning pipelines, and top degree pathways after 12th.",
    intro:
      "Data science in the Indian market requires a combination of mathematical rigor, applied statistical modelling, and scalable computational engineering. Professionals formulate business hypotheses, construct predictive models, and deploy machine learning pipelines into production environments. Undergraduate foundations typically begin with B.Tech in Computer Science/Data Science, B.Stat/B.Math, or quantitative economics. Employers prioritise candidates who demonstrate hands-on competence with SQL, Python (pandas, scikit-learn), experimental design (A/B testing), and model explainability over purely theoretical knowledge.",
    typicalSubjects: [
      "Probability & Mathematical Statistics",
      "Linear Algebra & Multivariable Calculus",
      "Python / R Programming & SQL",
      "Machine Learning & Data Mining"
    ],
    keyExams: [
      "ISI Admission Test (Indian Statistical Institute B.Stat / M.Stat)",
      "JEE Main & JEE Advanced (for B.Tech Data Science / CS)",
      "CUET-UG (for B.Sc Statistics / Mathematics Honours in Central Universities)",
      "GATE CS / Data Science & AI (for premier M.Tech / MS programmes)"
    ],
    colleges: [
      { name: "Indian Statistical Institute (ISI Kolkata / Bengaluru)", context: "Premier national institute dedicated to statistical science and mathematical analytics with deep research pipelines." },
      { name: "IIT Madras / IIT Kharagpur (BS & B.Tech Data Science)", context: "Pioneering formal 4-year data science and artificial intelligence undergraduate degree programs." },
      { name: "Chennai Mathematical Institute (CMI)", context: "Renowned centre for pure mathematics, computer science, and data analytics with international faculty." },
      { name: "Delhi University (Hindu College / St. Stephen's College - B.Sc Stats)", context: "Rigorous undergraduate statistics grounding leading into premier global data science master's tracks." }
    ],
    ncoCode: "2511.0200",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "UGC / AICTE",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2511 - Ministry of Labour & Employment", url: "https://www.ncs.gov.in" },
      { name: "Indian Statistical Institute Academic Council", url: "https://www.isical.ac.in" }
    ]
  },

  "data-engineer": {
    listName: "Data Engineer",
    title: "Data Engineer in India: Big Data Architecture & Pipelines",
    metaDescription:
      "Step-by-step career path to becoming a Data Engineer in India: Spark, SQL, Cloud Warehouses, Kafka, and B.Tech/MCA eligibility.",
    intro:
      "Data Engineers build, optimise, and maintain the data pipelines and distributed storage architectures that power modern analytics and AI models. In India's enterprise and startup ecosystem, data engineers manage petabyte-scale data lakes, streaming architectures (Apache Kafka, Flink), and distributed processing frameworks (Spark). Entry routes are predominantly through B.Tech in Computer Science or Information Technology. Success in this domain demands deep proficiency in SQL, Python/Scala, cloud data warehouses (BigQuery, Snowflake, Redshift), and orchestration tools like Apache Airflow.",
    typicalSubjects: [
      "Database Management Systems & Distributed Databases",
      "Operating Systems & Linux Internal Architecture",
      "Data Structures & Object-Oriented Programming (Java / Scala / Python)",
      "Computer Networks & Cloud Storage Systems"
    ],
    keyExams: [
      "JEE Main & JEE Advanced (B.Tech Computer Science / IT)",
      "State Engineering CETs (MHT-CET, WBJEE, KCET)",
      "GATE Computer Science & Information Technology",
      "NIMCET (for MCA degrees with Big Data specialisations)"
    ],
    colleges: [
      { name: "IIT Roorkee / IIT Guwahati", context: "Leading technical universities with advanced distributed systems laboratories and big data infrastructure courses." },
      { name: "NIT Trichy / NIT Surathkal", context: "Top National Institutes of Technology with high campus recruitment across cloud infrastructure and data platform companies." },
      { name: "IIIT Bangalore", context: "Specialised postgraduate and integrated engineering school known for database engines and cloud computing partnerships." },
      { name: "DTU (Delhi Technological University)", context: "Strong computing department with dedicated coursework in enterprise software architecture and big data engineering." }
    ],
    ncoCode: "2511.0300",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "AICTE / UGC",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2511 - Data Pipeline & Systems Engineering", url: "https://www.ncs.gov.in" },
      { name: "National Board of Accreditation (NBA India)", url: "https://www.nbaind.org" }
    ]
  },

  "ui-ux-designer": {
    listName: "UI/UX Designer",
    title: "UI/UX Designer in India: Design Degrees, UCEED/NID & Portfolios",
    metaDescription:
      "How to become a UI/UX Designer in India: B.Des degrees, UCEED, NID DAT, wireframing, user research, and interaction design portfolios.",
    intro:
      "UI/UX Design in India focuses on digital product interfaces, user psychology, information architecture, and accessibility standards across mobile and web applications. Aspiring designers enter through Bachelor of Design (B.Des) programs via competitive design aptitude exams or through human-computer interaction (HCI) tracks after engineering or visual arts degrees. Hiring across Indian product companies is strictly portfolio-driven: candidate evaluations focus on usability research case studies, wireframing, high-fidelity interactive prototyping (Figma), design system governance, and user testing methodology.",
    typicalSubjects: [
      "Design Thinking & User Empathy Research",
      "Information Architecture & Interaction Design",
      "Visual Hierarchy, Typography & Colour Theory",
      "Cognitive Psychology & Accessibility Standards (WCAG)"
    ],
    keyExams: [
      "UCEED (Undergraduate Common Entrance Examination for Design - IIT Bombay)",
      "NID DAT (National Institute of Design Design Aptitude Test)",
      "NIFT Entrance Exam (for Communication Design)",
      "SEED (Symbiosis Entrance Exam for Design)"
    ],
    colleges: [
      { name: "National Institute of Design (NID Ahmedabad / Bengaluru)", context: "India's premier statutory design institute with dedicated interaction design and communication design disciplines." },
      { name: "IDC School of Design (IIT Bombay)", context: "Apex technical design school offering integrated B.Des and M.Des programs with heavy focus on digital product ergonomics." },
      { name: "Department of Design (IIT Delhi / IIT Guwahati)", context: "Combines technical engineering foundations with user-centred product design and interactive media research." },
      { name: "Srishti Manipal Institute of Art, Design and Technology (Bengaluru)", context: "Top private design school situated in India's tech capital with extensive startup and design agency mentorship." }
    ],
    ncoCode: "2166.0200",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Ministry of Commerce & Industry / AICTE",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2166 - Graphic & Multimedia Designers", url: "https://www.ncs.gov.in" },
      { name: "UCEED / CEED Office - IIT Bombay", url: "https://www.uceed.iitb.ac.in" }
    ]
  },

  "cybersecurity-analyst": {
    listName: "Cybersecurity Analyst",
    title: "Cybersecurity Analyst in India: Ethical Hacking, CERT-In & Certifications",
    metaDescription:
      "Guide to Cybersecurity careers in India: SOC operations, CEH/CompTIA certifications, network security, and B.Tech Cyber Security pathways.",
    intro:
      "Cybersecurity Analysts protect enterprise infrastructure, digital banking networks, and government critical infrastructure from cyber threats and data breaches. In India, cybersecurity roles encompass Security Operations Centre (SOC) monitoring, vulnerability assessment, penetration testing (VAPT), and regulatory compliance under CERT-In guidelines and the Digital Personal Data Protection (DPDP) Act. Standard preparation involves a B.Tech in Computer Science or Cyber Security, supplemented by hands-on labs (TryHackMe, HackTheBox) and globally recognised industry credentials such as CompTIA Security+, CEH, and OSCP.",
    typicalSubjects: [
      "Computer Networks (TCP/IP, Routing Protocols, Firewalls)",
      "Cryptography & Network Security",
      "Operating Systems & Linux Kernel Security",
      "Ethical Hacking & Vulnerability Assessment"
    ],
    keyExams: [
      "JEE Main & JEE Advanced (for B.Tech Information Security / CS)",
      "State Engineering CETs (MHT-CET, KCET, WBJEE)",
      "GATE Computer Science & Cyber Security",
      "Industry Certifications (CompTIA Security+, CEH, OSCP)"
    ],
    colleges: [
      { name: "National Forensic Sciences University (NFSU Gandhinagar / Delhi)", context: "Institution of National Importance specialising in digital forensics, cyber defence, and homeland security." },
      { name: "IIT Kanpur (C3iHub / Department of Computer Science)", context: "Leading national centre for cyber security research, critical infrastructure protection, and malware analysis." },
      { name: "IIIT Allahabad (B.Tech & M.Tech Cyber Law & Information Security)", context: "Specialised computing institute with dedicated curriculum covering technical security and Indian cyber laws." },
      { name: "Amrita Vishwa Vidyapeetham (Center for Cyber Security Systems)", context: "Home to India's top ranked CTF (Capture The Flag) competitive hacking team with global rankings." }
    ],
    ncoCode: "2529.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "AICTE / CERT-In",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2529 - ICT Security Professionals", url: "https://www.ncs.gov.in" },
      { name: "Indian Computer Emergency Response Team (CERT-In)", url: "https://www.cert-in.org.in" }
    ]
  },

  "cloud-architect": {
    listName: "Cloud Architect",
    title: "Cloud Architect in India: Enterprise Cloud, AWS/Azure & System Design",
    metaDescription:
      "Path to becoming a Cloud Architect in India: Distributed systems, AWS/Azure/GCP certifications, infrastructure design, and B.Tech roadmap.",
    intro:
      "Cloud Architects design, migrate, and govern scalable enterprise infrastructure on public and hybrid cloud platforms such as AWS, Microsoft Azure, and Google Cloud Platform. In the Indian enterprise landscape, architects ensure multi-region high availability, cost optimisation (FinOps), identity security, and disaster recovery. This is a senior technical specialization that evolves from foundational software engineering or systems administration after 4–8 years of hands-on experience, supported by a formal B.Tech in CS/IT and professional architect-level cloud certifications.",
    typicalSubjects: [
      "Distributed Computing & Microservices Architecture",
      "Computer Networks & Virtual Private Clouds (VPC)",
      "Infrastructure as Code (Terraform, CloudFormation)",
      "Data Storage, Caching & Disaster Recovery Design"
    ],
    keyExams: [
      "JEE Main / State CETs (Undergraduate B.Tech CS/IT foundation)",
      "GATE Computer Science (for M.Tech Cloud & Distributed Systems)",
      "AWS Certified Solutions Architect (Associate & Professional)",
      "Microsoft Certified: Azure Solutions Architect Expert"
    ],
    colleges: [
      { name: "IIT Hyderabad", context: "Pioneering technical institute with advanced cloud computing curricula and strong industry-sponsored cloud research labs." },
      { name: "BITS Pilani", context: "Excellent engineering foundations with active industry practice school placements in major cloud hyperscalers." },
      { name: "Vellore Institute of Technology (VIT Vellore)", context: "Offers specialised B.Tech computing tracks with dedicated cloud and virtualisation academic coursework." },
      { name: "PES University (Bengaluru)", context: "Strong industry integration with top Bengaluru technology enterprises and cloud infrastructure startups." }
    ],
    ncoCode: "2523.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "AICTE / UGC",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2523 - Computer Network & Systems Architects", url: "https://www.ncs.gov.in" },
      { name: "Ministry of Electronics and Information Technology (MeitY)", url: "https://www.meity.gov.in" }
    ]
  },

  "ai-ml-engineer": {
    listName: "AI/ML Engineer",
    title: "AI/ML Engineer in India: Deep Learning, LLMs & MLOps Career Path",
    metaDescription:
      "Complete guide to AI/ML engineering in India: Linear algebra, PyTorch, Transformers, MLOps, and premier B.Tech/M.Tech degree routes.",
    intro:
      "Artificial Intelligence and Machine Learning Engineers design, train, fine-tune, and deploy machine learning models, neural networks, and Large Language Models (LLMs) into scalable software systems. In India, AI/ML engineers work across conversational AI, computer vision in healthcare, autonomous driving, and financial fraud detection. The standard educational pathway requires a B.Tech in Computer Science or Artificial Intelligence with heavy emphasis on linear algebra, multivariate calculus, optimization algorithms, PyTorch, and MLOps deployment tools (Docker, Triton, Kubernetes).",
    typicalSubjects: [
      "Linear Algebra, Probability & Vector Calculus",
      "Neural Networks & Deep Learning Architectures",
      "Natural Language Processing & Computer Vision",
      "MLOps, Model Serving & High-Performance Computing"
    ],
    keyExams: [
      "JEE Main & JEE Advanced (for premier B.Tech AI & Data Engineering)",
      "GATE Data Science & Artificial Intelligence (DA) / CS",
      "BITSAT / State CETs",
      "IIIT Post-Graduate Entrance Exam (PGEE)"
    ],
    colleges: [
      { name: "IIT Hyderabad (Department of AI)", context: "First institution in India to launch a dedicated 4-year B.Tech in Artificial Intelligence with world-class computing clusters." },
      { name: "IISc Bengaluru (Department of Computational and Data Sciences)", context: "India's premier scientific research institute leading national breakthroughs in deep learning and mathematical AI." },
      { name: "IIT Delhi (Yardi School of Artificial Intelligence)", context: "Dedicated school of AI conducting interdisciplinary research across machine learning, robotics, and NLP." },
      { name: "IIIT Hyderabad (Kohli Center on Intelligent Systems)", context: "Renowned globally for research publications in computer vision, robotics, and natural language processing." }
    ],
    ncoCode: "2512.0300",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "AICTE / UGC",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2512 - AI and Software Specialists", url: "https://www.ncs.gov.in" },
      { name: "GATE DA Official Syllabus - National Coordination Board", url: "https://gate2026.iitr.ac.in" }
    ]
  },

  "devops-engineer": {
    listName: "DevOps Engineer",
    title: "DevOps Engineer in India: CI/CD, Kubernetes, Linux & Cloud Systems",
    metaDescription:
      "How to become a DevOps Engineer in India: Linux internals, Docker, Kubernetes, CI/CD automation pipelines, and engineering degree pathways.",
    intro:
      "DevOps Engineers bridge software development and IT operations by automating build, testing, and deployment pipelines to ensure rapid, reliable software delivery. In the Indian tech ecosystem, DevOps professionals manage Infrastructure as Code (Terraform), container orchestration (Kubernetes), continuous integration/continuous deployment (GitHub Actions, Jenkins), and observability stacks (Prometheus, Grafana). Entry begins through a B.Tech in Computer Science, Information Technology, or Electronics, accompanied by demonstrable mastery of Linux systems administration and cloud platforms.",
    typicalSubjects: [
      "Linux Operating System Internals & Bash Scripting",
      "Computer Networking (DNS, SSL/TLS, Load Balancing)",
      "Containerisation & Orchestration (Docker, Kubernetes)",
      "Continuous Integration & Continuous Delivery (CI/CD)"
    ],
    keyExams: [
      "JEE Main & State Engineering CETs (B.Tech CS/IT foundation)",
      "Linux Foundation Certified System Administrator (LFCS)",
      "Certified Kubernetes Administrator (CKA)",
      "AWS / Azure DevOps Engineer Professional Certifications"
    ],
    colleges: [
      { name: "NIT Surathkal / NIT Warangal", context: "Top National Institutes of Technology with strong infrastructure engineering and networking coursework." },
      { name: "IIIT Allahabad", context: "Rigorous computer networking and software engineering curricula with active student-run cloud infrastructure." },
      { name: "Thapar Institute of Engineering & Technology (Patiala)", context: "Well-established engineering university with strong cloud infrastructure corporate recruitment." },
      { name: "Manipal Institute of Technology (MIT Manipal)", context: "Modern computing labs with extensive software delivery and DevOps industry electives." }
    ],
    ncoCode: "2512.0400",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "AICTE / UGC",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2512 - Systems Automation & Software Engineers", url: "https://www.ncs.gov.in" },
      { name: "National Skill Development Corporation (NSDC India)", url: "https://www.nsdcindia.org" }
    ]
  },

  "mobile-app-developer": {
    listName: "Mobile App Developer",
    title: "Mobile App Developer in India: Android, iOS, Flutter & React Native",
    metaDescription:
      "Career guide for Mobile App Developers in India: Kotlin, Swift, Flutter, Play Store / App Store publishing, and B.Tech/BCA degree routes.",
    intro:
      "Mobile App Developers build native and cross-platform applications for Android and iOS devices. Given India's mobile-first consumer economy with over 750 million smartphone users, mobile engineers build high-performance consumer apps in fintech, e-commerce, and digital public goods (like UPI apps). Developers specialize in native Android (Kotlin, Jetpack Compose), iOS (Swift, SwiftUI), or cross-platform frameworks (Flutter, React Native). Educational entry is typically via B.Tech CS, BCA, or B.Sc IT, with recruitment heavily dependent on published live apps on the Google Play Store or Apple App Store.",
    typicalSubjects: [
      "Object-Oriented Programming (Kotlin / Java / Swift)",
      "Mobile UI Architecture & State Management",
      "RESTful APIs, WebSockets & Local Database Storage (Room, CoreData)",
      "Mobile App Security & Performance Profiling"
    ],
    keyExams: [
      "JEE Main & State Engineering CETs (B.Tech CS / IT)",
      "NIMCET / State MCA Common Entrance Tests",
      "University BCA / B.Sc Computer Science Entrance Tests"
    ],
    colleges: [
      { name: "VIT Vellore / Chennai", context: "Extensive software development clubs and active mobile hackathon ecosystem with top placement records." },
      { name: "SRM Institute of Science and Technology (KTR Campus)", context: "Large computing faculty offering dedicated mobile application development laboratory tracks." },
      { name: "Amity University / Chandigarh University", context: "Popular undergraduate BCA and B.Tech programmes with modern mobile development electives." },
      { name: "Christ University (Bengaluru - BCA)", context: "Top rated BCA programme in India with strong practical software project requirements." }
    ],
    ncoCode: "2514.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "AICTE / UGC",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2514 - Applications Programmers", url: "https://www.ncs.gov.in" },
      { name: "All India Council for Technical Education (AICTE)", url: "https://www.aicte-india.org" }
    ]
  },

  "game-developer": {
    listName: "Game Developer",
    title: "Game Developer in India: Unity, Unreal Engine, C++ & 3D Math",
    metaDescription:
      "How to become a Game Developer in India: Unreal Engine, Unity, 3D linear algebra, physics simulation, and game engineering degree paths.",
    intro:
      "Game Developers program interactive gameplay mechanics, physics simulations, 3D graphics rendering, and multiplayer networking for console, PC, and mobile gaming platforms. India's gaming sector has evolved rapidly from outsourcing to domestic game publishing and indie game production. Core technical roles demand strong foundations in C++, C#, 3D vector mathematics, shaders, memory optimisation, and game engines like Unreal Engine and Unity. Most developers hold a B.Tech in Computer Science or specialised B.Sc/B.Tech in Game Programming.",
    typicalSubjects: [
      "3D Linear Algebra, Trigonometry & Physics Simulation",
      "C++ and C# Object-Oriented Programming",
      "Computer Graphics, Shaders & Rendering Pipelines",
      "Game Engine Architecture (Unreal Engine / Unity)"
    ],
    keyExams: [
      "JEE Main / State CETs (for B.Tech Computer Science foundation)",
      "Aptitude Tests for specialised Game Design & Development institutes"
    ],
    colleges: [
      { name: "IIIT Hyderabad", context: "Pioneering research in computer graphics, virtual reality, and interactive visual computing." },
      { name: "Backstage Pass Institute of Gaming and Technology (Hyderabad / Bengaluru)", context: "Dedicated gaming college offering specialized bachelor's degrees in game programming and game art." },
      { name: "Rubika India (Pune)", context: "International campus of the famed French digital animation and video game design school." },
      { name: "National Institute of Design (NID Bengaluru - Digital Game Design)", context: "Postgraduate master's discipline focusing on game mechanics, interactive storytelling, and player psychology." }
    ],
    ncoCode: "2513.0200",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "AICTE / UGC",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2513 - Interactive Software & Game Developers", url: "https://www.ncs.gov.in" },
      { name: "AVGC Center of Excellence - Ministry of Information & Broadcasting", url: "https://mib.gov.in" }
    ]
  },

  "blockchain-developer": {
    listName: "Blockchain Developer",
    title: "Blockchain Developer in India: Solidity, Web3, Smart Contracts & Cryptography",
    metaDescription:
      "Guide to becoming a Blockchain & Smart Contract Developer in India: Solidity, Rust, Ethereum, cryptography, and B.Tech CS pathways.",
    intro:
      "Blockchain Developers build decentralized applications (dApps), secure smart contracts, and distributed ledger protocols. In India, blockchain engineers work across financial DeFi protocols, supply chain provenance, decentralized identity, and institutional settlement layers. Mastery requires foundational expertise in cryptography (zero-knowledge proofs, hashing, public-key infrastructure), consensus algorithms, and domain languages such as Solidity, Rust, and Go. Standard preparation begins with a B.Tech in Computer Science paired with verified smart contract security audits on GitHub.",
    typicalSubjects: [
      "Applied Cryptography & Number Theory",
      "Distributed Systems & Consensus Mechanisms (PoS, PBFT)",
      "Smart Contract Programming (Solidity / Rust / Vyper)",
      "Web3 Security & Vulnerability Auditing"
    ],
    keyExams: [
      "JEE Main & JEE Advanced (for B.Tech CS foundation)",
      "State Engineering CETs (MHT-CET, WBJEE, KCET)",
      "GATE Computer Science (for cryptography research tracks)"
    ],
    colleges: [
      { name: "IIT Madras (Center for Distributed Ledger Technologies)", context: "Pioneering national research in blockchain interoperability, smart contracts, and cryptographic proofs." },
      { name: "IIT Bombay", context: "Leading computer science department with advanced elective courses in cryptography and distributed computing." },
      { name: "IIIT Hyderabad", context: "Renowned distributed systems and cybersecurity research groups with active Web3 innovation labs." },
      { name: "BITS Pilani", context: "Vibrant developer community with major hackathon wins across global decentralized protocol ecosystems." }
    ],
    ncoCode: "2512.0500",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "AICTE / UGC",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2512 - Distributed Software Developers", url: "https://www.ncs.gov.in" },
      { name: "National Informatics Centre (NIC Blockchain Technology COE)", url: "https://blockchain.gov.in" }
    ]
  },

  "full-stack-developer": {
    listName: "Full Stack Developer",
    title: "Full Stack Developer in India: Frontend, Backend, Databases & System Design",
    metaDescription:
      "How to become a Full Stack Developer in India: React, Node.js, Next.js, PostgreSQL, Docker, and degree pathways after 12th.",
    intro:
      "Full Stack Developers architect, build, and deploy entire web applications from responsive frontends to scalable backend services, database layers, and cloud infrastructure. In India's product startups and IT service firms, full-stack engineers handle end-to-end features using modern stacks like React, Next.js, Node.js/TypeScript, Python, and PostgreSQL. Entry is accessible via B.Tech Computer Science, BCA/MCA, or intensive coding bootcamps when combined with an exceptional portfolio of full-stack production deployments.",
    typicalSubjects: [
      "Client-Side Engineering (HTML5, CSS3, Modern TypeScript, React)",
      "Server-Side Engineering (Node.js, Express, Go, Python/Django)",
      "Database Systems (PostgreSQL, MongoDB, Redis Caching)",
      "API Architecture (REST, GraphQL) & Cloud Deployment (Docker, Vercel, AWS)"
    ],
    keyExams: [
      "JEE Main & State Engineering CETs (for 4-year B.Tech CS/IT)",
      "NIMCET (for MCA route post-graduation)",
      "CUET-UG / University Entrance for BCA and B.Sc Computing"
    ],
    colleges: [
      { name: "IIT Roorkee / IIT BHU", context: "Tier-1 engineering institutions with robust full-stack software development and open-source contribution cultures." },
      { name: "NIT Calicut / NIT Rourkela", context: "High-placement National Institutes of Technology with strong campus recruitment in full-stack product development." },
      { name: "Delhi Technological University (DTU)", context: "Top Delhi state technical university with deep industry connections across Gurgaon and Noida tech corridors." },
      { name: "Symbiosis Institute of Computer Studies and Research (SICSR Pune)", context: "Pioneering private computing institute offering top-tier BCA and MCA programmes with modern full-stack curricula." }
    ],
    ncoCode: "2512.0200",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "AICTE / UGC",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2512 - Web and Full Stack Software Developers", url: "https://www.ncs.gov.in" },
      { name: "NASSCOM FutureSkills Prime", url: "https://futureskillsprime.in" }
    ]
  },

  "network-administrator": {
    listName: "Network Administrator",
    title: "Network Administrator in India: Routing, Cisco CCNA & Enterprise IT",
    metaDescription:
      "Step-by-step career path to Network Administration in India: CCNA, CCNP, routers, firewalls, B.Sc/B.Tech, and enterprise IT infrastructure.",
    intro:
      "Network Administrators configure, manage, and troubleshoot local area networks (LANs), wide area networks (WANs), enterprise routers, switches, and perimeter firewalls. In India, network administrators maintain uptime for banking networks, telecommunications providers (5G infrastructure), data centres, and corporate offices. Educational entry typically begins through a B.Sc in Computer Science/IT, BCA, or B.Tech, backed by industry-standard networking credentials such as Cisco Certified Network Associate (CCNA) and Network+.",
    typicalSubjects: [
      "Computer Networking (OSI & TCP/IP 7-Layer Models)",
      "Routing Protocols (BGP, OSPF) & Switching Architecture (VLANs)",
      "Network Security, VPNs & Firewall Configuration",
      "Network Automation with Python & Ansible"
    ],
    keyExams: [
      "State Engineering CETs / University Entrances (B.Tech / B.Sc IT)",
      "Cisco Certified Network Associate (CCNA 200-301)",
      "Cisco Certified Network Professional (CCNP Enterprise)",
      "CompTIA Network+ Certification"
    ],
    colleges: [
      { name: "College of Engineering, Guindy (Anna University, Chennai)", context: "Premier government technical college with century-old engineering legacy and advanced telecommunications labs." },
      { name: "Jamia Millia Islamia (New Delhi - Department of Computer Engineering)", context: "Central university with strong networking and communication engineering research centres." },
      { name: "Hindustan Institute of Technology and Science (Chennai)", context: "Offers specialized networking and telecommunications labs certified by global networking vendors." },
      { name: "St. Xavier's College (Kolkata / Mumbai - B.Sc Computer Science)", context: "Top undergraduate science programs providing rigorous foundations in computer hardware and network theory." }
    ],
    ncoCode: "2522.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "AICTE / UGC",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2522 - Network and Systems Administrators", url: "https://www.ncs.gov.in" },
      { name: "Telecommunication Engineering Center (TEC India)", url: "https://tec.gov.in" }
    ]
  },

  "site-reliability-eng-sre": {
    listName: "Site Reliability Eng (SRE)",
    title: "Site Reliability Engineer (SRE) in India: High Availability & Chaos Engineering",
    metaDescription:
      "How to become an SRE in India: SLO/SLA management, Linux internals, distributed systems, incident response, and B.Tech CS roadmap.",
    intro:
      "Site Reliability Engineers (SREs) apply software engineering principles to operations problems, ensuring large-scale internet services achieve ultra-high availability (99.99% uptime). In India's high-traffic platforms (UPI payment switches, e-commerce, cloud platforms), SREs write automation code to eliminate repetitive toil, manage Service Level Objectives (SLOs) and error budgets, and conduct chaos engineering tests. The career path stems from a B.Tech in Computer Science, requiring strong systems programming (Go/Python/C), Linux kernel tuning, and distributed tracing skills.",
    typicalSubjects: [
      "Operating Systems & Linux Kernel Systems Programming",
      "Distributed Systems Consensus, Caching & Load Balancing",
      "Observability Stacks (Prometheus, OpenTelemetry, Grafana)",
      "Incident Response & Root Cause Analysis (RCA)"
    ],
    keyExams: [
      "JEE Main & JEE Advanced (B.Tech Computer Science)",
      "GATE Computer Science & Information Technology",
      "Certified Kubernetes Administrator (CKA)",
      "Google Cloud Professional Cloud DevOps Engineer"
    ],
    colleges: [
      { name: "IIT Madras / IIT Bombay", context: "Top tier computer science departments producing leading infrastructure and reliability engineers globally." },
      { name: "IIIT Hyderabad", context: "Pioneering systems engineering research with deep industry partnerships across enterprise reliability engineering." },
      { name: "NIT Surathkal", context: "Top National Institute of Technology with extensive high-performance computing clusters and systems research." },
      { name: "BIT Mesra (Ranchi)", context: "Prestigious engineering institute with proven placement track records in platform reliability and systems engineering." }
    ],
    ncoCode: "2523.0200",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "AICTE / UGC",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2523 - Systems and Reliability Engineers", url: "https://www.ncs.gov.in" },
      { name: "Ministry of Electronics and Information Technology (MeitY)", url: "https://www.meity.gov.in" }
    ]
  },

  "database-administrator": {
    listName: "Database Administrator",
    title: "Database Administrator (DBA) in India: PostgreSQL, Oracle & High Availability",
    metaDescription:
      "Career guide for Database Administrators in India: SQL query tuning, replication, backup recovery, PostgreSQL/Oracle, and B.Tech/BCA routes.",
    intro:
      "Database Administrators (DBAs) design, secure, and maintain enterprise relational and NoSQL database management systems. In India's banking, public sector, and healthcare sectors, DBAs are responsible for high-throughput transactional integrity (ACID properties), index optimisation, automated backup replication, role-based database security, and zero-downtime database upgrades. The standard educational foundation is a B.Tech in CS/IT, BCA, or MCA, accompanied by vendor-neutral (PostgreSQL) or vendor-specific (Oracle OCP) database administration credentials.",
    typicalSubjects: [
      "Relational Database Management Systems & Relational Algebra",
      "Query Performance Tuning, Indexing & Query Execution Plans",
      "Database Backup, Disaster Recovery & High Availability Replication",
      "Database Security, Encryption & Access Control"
    ],
    keyExams: [
      "JEE Main & State CETs (B.Tech CS/IT)",
      "NIMCET (for Master of Computer Applications)",
      "Oracle Certified Professional (OCP) / PostgreSQL Certified Professional"
    ],
    colleges: [
      { name: "Jadavpur University (Kolkata - Faculty of Engineering)", context: "Top-ranked state engineering faculty known for strong database internal architectures and operating system research." },
      { name: "NIT Warangal", context: "Leading National Institute of Technology with dedicated curriculum in enterprise database systems and transaction processing." },
      { name: "PSG College of Technology (Coimbatore)", context: "Renowned autonomous engineering college with deep industrial software connections and database laboratories." },
      { name: "Veermata Jijabai Technological Institute (VJTI Mumbai)", context: "Historic technical institute with top placement track records in Mumbai's banking and financial technology databases." }
    ],
    ncoCode: "2521.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "AICTE / UGC",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2521 - Database Designers and Administrators", url: "https://www.ncs.gov.in" },
      { name: "National Board of Accreditation", url: "https://www.nbaind.org" }
    ]
  }
};
