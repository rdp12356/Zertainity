import type { CareerEditorial } from "./careerEditorialTypes";

export const CAREER_EDITORIAL: Record<string, CareerEditorial> = {
  "software-engineer": {
    "workOverview": "Software engineers turn requirements into reliable software. The work can include understanding a user problem, designing a solution, writing and reviewing code, testing it, fixing defects, improving performance, and maintaining systems after release. Most roles involve teamwork and communication as much as writing code.",
    "routesAfter12th": [
      "B.Tech/B.E. in Computer Science, IT, or a related branch is a common route; check each institution's Class 12 subject and entrance requirements.",
      "BCA or B.Sc. Computer Science/IT can also lead to software roles. Compare the curriculum, internship access, and whether further study is needed for your target roles.",
      "Use the first year to learn programming fundamentals, data structures, databases, networking, and version control rather than collecting certificates without projects."
    ],
    "skillsToBuild": [
      "Programming fundamentals and problem decomposition",
      "Data structures, algorithms, databases, and basic computer networks",
      "Testing, debugging, version control, and secure coding habits",
      "Writing clear documentation and explaining technical decisions"
    ],
    "practicalWork": [
      "Build a small application that solves a real, clearly described problem; include tests, setup instructions, and a short demo.",
      "Improve an existing open-source project through a documented bug fix or documentation contribution.",
      "Deploy a project and write a short post-mortem describing one bug, how you diagnosed it, and what you changed."
    ],
    "realityChecks": [
      "A degree or a certificate does not guarantee a software job; practical ability, communication, and interview preparation matter.",
      "A large part of the job is reading existing code, fixing issues, reviewing changes, and maintaining systems.",
      "Choose a course by checking its actual syllabus, faculty, project work, and internship access—not only its advertised placement headline."
    ],
    "sources": [
      {
        "label": "ACM / IEEE-CS / AAAI Computer Science Curricula 2023",
        "url": "https://csed.acm.org/"
      },
      {
        "label": "NPTEL course catalogue",
        "url": "https://www.nptel.ac.in/courses"
      }
    ]
  },
  "doctor-mbbs": {
    "workOverview": "A doctor assesses symptoms, examines patients, interprets investigations, explains options, makes clinical decisions, documents care, and works with a wider healthcare team. The day-to-day experience differs between hospitals, primary care, emergency medicine, and later specialisations.",
    "routesAfter12th": [
      "Plan for Physics, Chemistry, Biology/Biotechnology, and English in line with the current NEET-UG and NMC eligibility rules.",
      "Qualify through NEET-UG and participate in the applicable counselling process. Admission depends on rank, seat availability, category rules, preferences, and current regulations.",
      "The MBBS course includes academic and clinical training followed by the prescribed compulsory internship. Specialisation is a later decision, not an automatic outcome of the undergraduate degree."
    ],
    "skillsToBuild": [
      "Strong foundations in biology, chemistry, and physics",
      "Careful observation, listening, and clear patient communication",
      "Ethical judgement, teamwork, and accurate record keeping",
      "Emotional resilience and willingness to keep learning"
    ],
    "practicalWork": [
      "Read the official NEET-UG bulletin and understand the current eligibility and counselling process before planning a preparation schedule.",
      "Speak with practising doctors or medical students about clinical placements, duty hours, and the emotional demands of the profession.",
      "Explore biology and public-health topics through credible learning resources; do not attempt clinical procedures outside supervised training."
    ],
    "realityChecks": [
      "Medical education is long and demanding. The time, fees, bonds, and service conditions vary by institution and state.",
      "A NEET score does not itself guarantee a particular college or specialisation; counselling and current seat rules matter.",
      "Clinical responsibility involves real patients and high stakes. Interest in biology alone is not enough to establish fit."
    ],
    "sources": [
      {
        "label": "NEET-UG official admission bulletin",
        "url": "https://neet.nta.nic.in/admission-bulletin/"
      },
      {
        "label": "National Medical Commission",
        "url": "https://www.nmc.org.in/"
      }
    ]
  },
  "chartered-accountant-ca": {
    "workOverview": "Chartered Accountants work across audit and assurance, taxation, financial reporting, business finance, risk, and advisory. Depending on the role, the work may involve checking evidence, interpreting standards and laws, preparing or reviewing statements, analysing controls, and explaining financial consequences to clients or management.",
    "routesAfter12th": [
      "Commerce is a useful foundation, especially Accountancy, Economics, Business Studies, and Mathematics/Applied Mathematics where available, but check ICAI's current eligibility rules rather than assuming one school stream is compulsory.",
      "Under ICAI's current scheme, students can register for Foundation after Class 10 and appear for the Foundation examination after satisfying the Class 12 requirements. Read the latest ICAI registration and examination rules.",
      "The broad route includes Foundation, Intermediate, prescribed practical training, self-paced modules, and Final. The New Scheme introduced two years of practical training; verify the latest sequence and deadlines directly with ICAI."
    ],
    "skillsToBuild": [
      "Financial accounting and the ability to explain why entries are made",
      "Taxation, business law, audit concepts, and professional ethics",
      "Excel and careful handling of financial data",
      "Clear writing, client communication, and disciplined exam preparation"
    ],
    "practicalWork": [
      "Take a listed company's annual report and explain its revenue, profit, cash flow, debt, and one important accounting policy in plain language.",
      "Practise preparing a simple bank reconciliation and a basic set of financial statements using fictional data.",
      "Compare the same company's results across two years and explain what changed without confusing profit with cash flow."
    ],
    "realityChecks": [
      "CA is an examination-and-training pathway, not a conventional campus degree. Progress depends on clearing each stage and completing prescribed requirements.",
      "The practical training period is valuable work experience, but it also creates a demanding balance between office responsibilities and exam preparation.",
      "The qualification opens several fields; it does not mean every CA spends their career doing statutory audits."
    ],
    "sources": [
      {
        "label": "ICAI announcement on the New Scheme of Education and Training",
        "url": "https://www.icai.org/post/announcement-new-scheme-of-education-and-training"
      },
      {
        "label": "ICAI syllabus under the New Scheme",
        "url": "https://www.icai.org/post/syllabus-nset"
      }
    ]
  },
  "civil-services-ias-ips-ifs": {
    "workOverview": "Civil servants work on implementing laws and public programmes, managing public institutions, advising on policy, coordinating departments, and responding to administrative problems. The exact responsibilities depend on the service, cadre, posting, seniority, and the needs of government.",
    "routesAfter12th": [
      "Complete a recognised bachelor's degree. There is no single compulsory undergraduate subject for the Civil Services Examination; choose a degree you can study seriously and complete well.",
      "Understand the three broad stages of the UPSC Civil Services Examination: Preliminary, Main, and Personality Test. The official notification defines the current eligibility, syllabus, attempts, and application rules.",
      "Build a sustainable foundation in reading, writing, the Constitution, history, geography, economics, science, and current affairs. Use official notifications and previous papers rather than coaching claims as the final authority."
    ],
    "skillsToBuild": [
      "Reading complex material and identifying the central issue",
      "Structured writing, evidence-based argument, and clear communication",
      "Understanding public institutions, budgets, laws, and policy trade-offs",
      "Ethical reasoning, judgement, and sustained self-management"
    ],
    "practicalWork": [
      "Choose one public policy issue and write a one-page brief: problem, evidence, affected groups, options, risks, and a measurable outcome.",
      "Read a Union or state budget document and explain one department's allocation in plain language.",
      "Practise writing balanced answers from official reports and primary documents, not only opinion posts."
    ],
    "realityChecks": [
      "The examination is highly competitive and has multiple stages; preparation does not guarantee selection.",
      "Aspirants should protect their education and build employable skills alongside preparation rather than treating an uncertain exam result as the only plan.",
      "The service is public responsibility, not simply status. Transfers, public scrutiny, difficult decisions, and administrative constraints are part of the work."
    ],
    "sources": [
      {
        "label": "UPSC Civil Services Examination official notices",
        "url": "https://www.upsc.gov.in/examinations/active-examinations"
      },
      {
        "label": "UPSC examination notification archive",
        "url": "https://www.upsc.gov.in/exams-related-info/exam-notification/archives"
      }
    ]
  },
  "data-scientist": {
    "workOverview": "Data scientists investigate questions using data. A project can involve defining a measurable problem, collecting and cleaning data, exploring patterns, selecting statistical or machine-learning methods, checking whether results are reliable, and explaining what the findings do—and do not—support.",
    "routesAfter12th": [
      "A quantitative degree can be a strong base: B.Sc. Statistics/Mathematics/Computer Science, B.Tech in a relevant branch, or Economics with substantial statistics and computing.",
      "BCA and other degrees can work when paired with deliberate study of probability, statistics, programming, and databases. Check the depth of mathematics in the course syllabus.",
      "Mathematics in Classes 11–12 is especially helpful for many data-science programmes and later technical work; check individual admission requirements."
    ],
    "skillsToBuild": [
      "Probability, statistics, sampling, and experimental design",
      "Python or R, SQL, and data cleaning",
      "Data visualisation and communicating uncertainty",
      "Model evaluation, reproducibility, and domain understanding"
    ],
    "practicalWork": [
      "Choose a public dataset, write a clear question before analysing it, and publish a reproducible notebook with data limitations.",
      "Create a dashboard that answers three specific questions; explain the audience and what decisions it can support.",
      "Compare a simple baseline with a more complex model and show where the complex model fails."
    ],
    "realityChecks": [
      "Many entry-level roles are closer to data analysis, reporting, and data engineering than advanced machine learning.",
      "A polished chart can still be misleading. Sampling bias, missing data, leakage, and weak evaluation can invalidate a conclusion.",
      "A portfolio is strongest when it explains the question, method, assumptions, limitations, and decision—not just the model score."
    ],
    "sources": [
      {
        "label": "NPTEL: Python for Data Science (IIT Madras)",
        "url": "https://www.nptel.ac.in/courses/106106212"
      },
      {
        "label": "NPTEL: Scalable Data Science",
        "url": "https://www.nptel.ac.in/courses/106105186"
      },
      {
        "label": "NPTEL course catalogue",
        "url": "https://www.nptel.ac.in/courses"
      }
    ]
  },
  "ai-ml-engineer": {
    "workOverview": "AI and machine-learning engineers build systems that use data and models inside real products. Work can include preparing data, choosing a baseline, training or adapting a model, evaluating errors, deploying it, monitoring behaviour, and managing reliability, privacy, and safety risks.",
    "routesAfter12th": [
      "A strong foundation in Computer Science, Mathematics, Statistics, or a related engineering/science degree is a useful route. Choose a programme with algorithms, programming, probability, linear algebra, and substantial project work.",
      "An AI-labelled degree is not automatically better than a rigorous Computer Science or Mathematics programme. Compare the syllabus, lab access, faculty, and internships.",
      "Build programming and mathematics first. Specialise in machine learning after you can explain the fundamentals behind the tools you use."
    ],
    "skillsToBuild": [
      "Python, data structures, algorithms, and software engineering",
      "Linear algebra, calculus, probability, and statistics",
      "Model training, evaluation metrics, error analysis, and deployment",
      "Data privacy, security, fairness, and responsible system evaluation"
    ],
    "practicalWork": [
      "Build a small model with a documented baseline, train/test split, evaluation metrics, and an error analysis.",
      "Deploy a model behind a simple API and monitor latency, failures, and input drift using a small test dataset.",
      "Write a model card explaining intended use, limitations, known failure cases, and the risks of misuse."
    ],
    "realityChecks": [
      "Many jobs advertised as AI/ML engineering still require strong software engineering and data skills.",
      "Research-heavy roles may require postgraduate study or specialised experience; a short course alone is not equivalent to that preparation.",
      "A model that performs well on one test set may fail in the real world. Evaluation, monitoring, and responsible deployment are core parts of the job."
    ],
    "sources": [
      {
        "label": "NIST AI Risk Management Framework",
        "url": "https://www.nist.gov/itl/ai-risk-management-framework"
      },
      {
        "label": "NPTEL course catalogue",
        "url": "https://www.nptel.ac.in/courses"
      }
    ]
  },
  "architect": {
    "workOverview": "Architects develop building and spatial designs while balancing how a place should work, look, feel, and perform. Projects move through briefs, sketches, drawings, models, regulations, material choices, coordination with engineers, client discussions, and construction-stage decisions.",
    "routesAfter12th": [
      "Check the current B.Arch eligibility rules carefully. Mathematics and other subject requirements can apply, and admission routes may use NATA or JEE Main Paper 2 depending on the institution and counselling process.",
      "Choose a five-year B.Arch programme only after confirming that the institution and course have the required Council of Architecture approval for the relevant academic year.",
      "During the course, expect studio projects, design critique, technical subjects, history, building systems, and practical training—not only drawing."
    ],
    "skillsToBuild": [
      "Spatial reasoning, drawing, visual communication, and design iteration",
      "Building materials, structures, climate response, and construction methods",
      "CAD/BIM tools used by the programme and practice",
      "Listening to clients, teamwork, and understanding building regulations"
    ],
    "practicalWork": [
      "Keep a sketchbook of spaces you use; record circulation, light, ventilation, accessibility, and how people move through them.",
      "Create a small design brief for a library room or bus shelter and show the site constraints, users, concept, and revisions.",
      "Visit buildings respectfully and study how design decisions affect comfort, safety, and accessibility."
    ],
    "realityChecks": [
      "Architecture education is studio-intensive and often involves long project cycles and substantial model-making or software work.",
      "A degree, professional registration, and permission to practise are separate matters; follow the current Architects Act and Council of Architecture requirements.",
      "The best design must still respond to budget, materials, site conditions, climate, safety, and client needs."
    ],
    "sources": [
      {
        "label": "Council of Architecture: architectural education and approved institutions",
        "url": "https://coa.gov.in/institutionStatus.php"
      },
      {
        "label": "JEE Main official documents",
        "url": "https://jeemain.nta.nic.in/documents/"
      }
    ]
  },
  "investment-banker": {
    "workOverview": "Investment bankers advise organisations on raising capital and strategic transactions such as mergers and acquisitions. Analyst work can include financial modelling, company and industry research, due diligence, valuation support, preparing presentations, and coordinating transaction processes with clients and professional teams.",
    "routesAfter12th": [
      "Commerce, Economics, Finance, Mathematics, Statistics, and other analytical undergraduate routes can all provide relevant foundations. Choose a degree with strong accounting, quantitative, and communication components.",
      "Internships, finance projects, case competitions, and evidence of analytical work can help you test the field and build experience. Recruitment routes vary by firm and campus.",
      "An MBA or a professional qualification such as the CFA Program may support some career paths, but neither is a guaranteed entry ticket to investment banking."
    ],
    "skillsToBuild": [
      "Financial accounting, corporate finance, valuation, and business analysis",
      "Excel-based financial modelling and careful spreadsheet checks",
      "Research, concise presentations, and persuasive written communication",
      "Attention to detail, teamwork, professional ethics, and stamina under deadlines"
    ],
    "practicalWork": [
      "Build a simple three-statement model using a public company's annual report and clearly label every assumption.",
      "Prepare a short company profile and valuation overview using public information; explain the uncertainties rather than presenting a single value as fact.",
      "Create a short acquisition case study using public announcements and explain strategic fit, key risks, and questions that require due diligence."
    ],
    "realityChecks": [
      "Front-office investment banking roles are selective and hiring routes vary significantly by employer, city, and year.",
      "The work can be deadline-heavy and involve long hours, revisions, and client pressure; prestige and compensation do not describe the full experience.",
      "CFA, CA, MBA, or a finance degree can build relevant knowledge, but none guarantees a role. Relevant experience and recruitment access matter."
    ],
    "sources": [
      {
        "label": "CFA Institute: What is an Investment Banker?",
        "url": "https://www.cfainstitute.org/programs/cfa-program/careers/investment-banker"
      },
      {
        "label": "CFA Institute: Mapping India's finance workforce",
        "url": "https://www.cfainstitute.org/discover/mapping-indias-finance-workforce"
      },
      {
        "label": "CFA Institute: Financial modelling skills",
        "url": "https://www.cfainstitute.org/programs/cfa-program/candidate-resources/practical-skills-modules/financial-modelling"
      }
    ]
  }
};
