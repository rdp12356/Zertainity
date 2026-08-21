import type { CareerRoleDetail } from "./types";

export const FINANCE_CAREER_DETAILS: Record<string, CareerRoleDetail> = {
  "chartered-accountant-ca": {
    listName: "Chartered Accountant (CA)",
    title: "Chartered Accountant (CA) in India: ICAI Route, Articleship & Exam Stages",
    metaDescription:
      "Complete guide to Chartered Accountancy in India: CA Foundation, Intermediate, 2-year mandatory articleship, CA Final, ICAI norms, and corporate audit roles.",
    intro:
      "Chartered Accountants (CA) in India are statutory financial authorities empowered by the Chartered Accountants Act, 1949 to audit company balance sheets, ensure corporate taxation compliance, provide strategic financial advice, and certify regulatory filings. Administered exclusively by the Institute of Chartered Accountants of India (ICAI), the CA qualification is exam-driven rather than college-dependent. Candidates clear three progressive levels: CA Foundation (post-12th), CA Intermediate (Group I & II), complete a mandatory 2-year practical articleship training under a practicing FCA, and clear the rigorous CA Final examination.",
    typicalSubjects: [
      "Advanced Financial Accounting & Reporting Standards (Ind AS / IFRS)",
      "Direct & Indirect Taxation Laws (Income Tax Act & GST Framework)",
      "Corporate Laws, Securities Laws & Economic Legislation",
      "Auditing Standards, Assurance & Forensic Investigation"
    ],
    keyExams: [
      "CA Foundation Examination (Conducted by ICAI thrice annually)",
      "CA Intermediate Examination (Groups 1 and 2)",
      "CA Final Examination (Final group clearance for ICAI membership)"
    ],
    colleges: [
      { name: "Institute of Chartered Accountants of India (ICAI - Statutory Professional Body)", context: "The sole statutory governing authority for CA examinations, syllabus governance, articleship monitoring, and licensing." },
      { name: "Shri Ram College of Commerce (SRCC Delhi - B.Com Hons alongside CA)", context: "Premier commerce college in Asia providing high-calibre peer network and flexible study hours for CA Foundation/Inter." },
      { name: "St. Xavier's College (Kolkata / Mumbai - Morning Commerce Batch)", context: "Famous for morning commerce batches designed specifically to accommodate CA articleship firm timings." },
      { name: "Loyola College (Chennai - Department of Commerce)", context: "Top Southern Indian commerce college producing numerous All-India CA Intermediate and Final rank holders." }
    ],
    ncoCode: "2411.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Institute of Chartered Accountants of India (ICAI)",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2411 - Accountants", url: "https://www.ncs.gov.in" },
      { name: "Institute of Chartered Accountants of India (ICAI)", url: "https://www.icai.org" }
    ]
  },

  "cost-accountant-cma": {
    listName: "Cost Accountant (CMA)",
    title: "Cost and Management Accountant (CMA) in India: ICMAI, Cost Audit & Industry Path",
    metaDescription:
      "How to become a Cost Accountant (CMA) in India: ICMAI Foundation, Inter, Final, statutory cost audits, manufacturing cost control, and PSU roles.",
    intro:
      "Cost and Management Accountants (CMA) specialize in cost accounting, operational efficiency, pricing policy, and statutory cost audits mandated under Section 148 of the Companies Act, 2013. Regulated by the Institute of Cost Accountants of India (ICMAI), CMAs determine unit product costs, eliminate industrial process waste, optimize capital allocation, and ensure compliance for manufacturing, energy, and pharmaceutical industries. The qualification is pursued through CMA Foundation, CMA Intermediate, mandatory industrial practical training, and CMA Final examinations.",
    typicalSubjects: [
      "Cost Accounting, Cost Management & Strategic Cost Control",
      "Financial Management & Business Valuation",
      "Corporate Laws, Direct Taxation & GST Operations",
      "Strategic Performance Management & Cost Audit Standards"
    ],
    keyExams: [
      "CMA Foundation (Conducted by ICMAI post-12th)",
      "CMA Intermediate (Groups 1 and 2)",
      "CMA Final Examination (Statutory certification for Cost & Management Accounting practice)"
    ],
    colleges: [
      { name: "Institute of Cost Accountants of India (ICMAI Headquarters Kolkata)", context: "The sole statutory governing body established by Parliament for CMA professional certification and cost auditing standards." },
      { name: "Narsee Monjee College of Commerce and Economics (NM College Mumbai)", context: "Premier Mumbai commerce institution with strong corporate cost accounting and financial advisory student cohorts." },
      { name: "Goenka College of Commerce and Business Administration (Kolkata)", context: "Historic Eastern Indian commerce institution with strong traditions in cost accounting and industrial taxation." },
      { name: "Madras Christian College (MCC Chennai - Commerce)", context: "Top undergraduate institution providing comprehensive foundation for ICMAI professional examination stages." }
    ],
    ncoCode: "2411.0200",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Institute of Cost Accountants of India (ICMAI)",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2411 - Cost Accountants", url: "https://www.ncs.gov.in" },
      { name: "Institute of Cost Accountants of India (ICMAI)", url: "https://icmai.in" }
    ]
  },

  "company-secretary-cs": {
    listName: "Company Secretary (CS)",
    title: "Company Secretary (CS) in India: ICSI Route, Corporate Governance & Secretarial Audit",
    metaDescription:
      "Guide to becoming a Company Secretary in India: CSEET, CS Executive, CS Professional, corporate governance, SEBI compliance, and Board of Directors advisory.",
    intro:
      "A Company Secretary (CS) is a key managerial personnel (KMP) under the Companies Act, 2013 responsible for corporate governance, board advisory, legal and regulatory compliance, and statutory secretarial audits. Regulated by the Institute of Company Secretaries of India (ICSI), a CS acts as the primary bridge between the Board of Directors, shareholders, stock exchanges (BSE/NSE), and regulatory authorities like SEBI and MCA. The qualification is earned by clearing the CS Executive Entrance Test (CSEET), CS Executive Programme, practical corporate governance training, and the CS Professional Programme.",
    typicalSubjects: [
      "Company Law, Corporate Restructuring & M&A Governance",
      "Securities Laws, Capital Markets & SEBI (LODR) Regulations",
      "Secretarial Audit Standards & Due Diligence",
      "Economic, Commercial & Intellectual Property Laws"
    ],
    keyExams: [
      "CSEET (CS Executive Entrance Test conducted quarterly by ICSI)",
      "CS Executive Programme Examination (Groups 1 and 2)",
      "CS Professional Programme Examination"
    ],
    colleges: [
      { name: "Institute of Company Secretaries of India (ICSI New Delhi / Noida)", context: "Statutory national body regulating the profession of Company Secretaries and corporate governance in India." },
      { name: "St. Xavier's College (Mumbai - Commerce)", context: "Top Mumbai college situated near corporate headquarters and the Bombay Stock Exchange (BSE), ideal for CS training." },
      { name: "Hansraj College (University of Delhi)", context: "Distinguished commerce faculty offering strong commercial law grounding for CSEET and Executive aspirants." },
      { name: "Symbiosis College of Arts & Commerce (Pune)", context: "Autonomous institution with dedicated corporate law coaching and legal compliance student clinics." }
    ],
    ncoCode: "2411.0300",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Institute of Company Secretaries of India (ICSI) / Ministry of Corporate Affairs",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2411 - Company Secretaries", url: "https://www.ncs.gov.in" },
      { name: "Institute of Company Secretaries of India (ICSI)", url: "https://www.icsi.edu" }
    ]
  },

  "investment-banker": {
    listName: "Investment Banker",
    title: "Investment Banker in India: M&A, Capital Markets, Valuation & IIM/CFA Route",
    metaDescription:
      "How to enter Investment Banking in India: Mergers & Acquisitions (M&A), financial modeling (DCF/LBO), IIM MBA, CFA charter, and bulge bracket banks.",
    intro:
      "Investment Bankers advise corporations, private equity funds, and governments on complex financial transactions including Initial Public Offerings (IPOs), Mergers & Acquisitions (M&A), leveraged buyouts (LBO), and corporate debt restructuring. In India's booming capital markets, investment bankers build financial models (Discounted Cash Flow, comparable company analysis), draft pitch books, and negotiate transaction term sheets. The standard elite entry route requires an MBA in Finance from premier Indian Institutes of Management (IIM Ahmedabad, Bangalore, Calcutta) or a Chartered Financial Analyst (CFA) charter alongside top-tier quantitative commerce degrees.",
    typicalSubjects: [
      "Corporate Finance, Valuation & Financial Statement Analysis",
      "Financial Modeling (DCF, LBO, Accretion/Dilution Analysis)",
      "Capital Markets, Securities Underwriting & Syndicate Management",
      "Mergers, Acquisitions & Corporate Restructuring Law"
    ],
    keyExams: [
      "CAT (Common Admission Test for top IIMs - IIM A/B/C/L/K/I)",
      "CFA Program (Chartered Financial Analyst Exams - Levels 1, 2, and 3)",
      "GMAT (for international and executive 1-year MBA programs at ISB Hyderabad)"
    ],
    colleges: [
      { name: "Indian Institute of Management Ahmedabad (IIM-A)", context: "India's #1 management institution with massive recruitment from global bulge bracket investment banks (Goldman Sachs, Morgan Stanley, J.P. Morgan)." },
      { name: "Indian Institute of Management Calcutta (IIM-C - Joka)", context: "Known as the finance powerhouse of Asia with legendary quantitative finance faculty and global investment banking alumni." },
      { name: "Indian School of Business (ISB Hyderabad / Mohali)", context: "Top global business school offering intensive post-graduate finance electives and investment banking placements." },
      { name: "Shri Ram College of Commerce (SRCC Delhi - B.Com / GBO)", context: "Feeder undergraduate institution for top global investment banking front-office analyst cohorts." }
    ],
    ncoCode: "2412.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Securities and Exchange Board of India (SEBI) / CFA Institute",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2412 - Financial Dealers & Investment Bankers", url: "https://www.ncs.gov.in" },
      { name: "Securities and Exchange Board of India (SEBI)", url: "https://www.sebi.gov.in" }
    ]
  },

  "financial-analyst": {
    listName: "Financial Analyst",
    title: "Financial Analyst in India: Equity Research, Financial Modeling & CFA Path",
    metaDescription:
      "Step-by-step career guide to Financial Analysis in India: Equity research, corporate FP&A, DCF valuation, CFA certification, and B.Com/MBA finance routes.",
    intro:
      "Financial Analysts evaluate financial data, analyze macroeconomic trends, examine public company quarterly earnings reports, and build financial forecasting models to guide investment decisions or corporate budgeting (FP&A). In India, financial analysts work in equity research brokerages, mutual fund houses (AMCs), wealth management firms, and corporate treasury departments. Preparation typically begins with a B.Com (Honours), BBA Finance, or B.Tech followed by an MBA in Finance or progressing through the Chartered Financial Analyst (CFA) program.",
    typicalSubjects: [
      "Financial Statement Analysis & Ratio Decomposition",
      "Macroeconomics, Microeconomics & Industry Structure Analysis",
      "Equity Valuation & Fixed Income Securities",
      "Financial Modeling in Microsoft Excel & Python for Finance"
    ],
    keyExams: [
      "CFA Exam (Chartered Financial Analyst Level 1, 2, 3)",
      "CAT / XAT / NMAT (for premier MBA in Finance)",
      "NISM Series VIII / Series XV (Equity Derivatives & Research Analyst Certification)"
    ],
    colleges: [
      { name: "Faculty of Management Studies (FMS Delhi)", context: "Top central university business school renowned for phenomenal return-on-investment and premier equity research placements." },
      { name: "Jamnalal Bajaj Institute of Management Studies (JBIMS Mumbai)", context: "The CEO Factory of India located in the heart of Mumbai's Nariman Point financial district." },
      { name: "St. Joseph's University (Bengaluru - School of Commerce)", context: "Leading Southern Indian commerce department with dedicated corporate finance and CFA preparation tie-ups." },
      { name: "Loyola College (Chennai - Department of Financial Planning)", context: "Top undergraduate institution providing rigorous foundations in security analysis and portfolio management." }
    ],
    ncoCode: "2413.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "SEBI / CFA Institute",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2413 - Financial Analysts", url: "https://www.ncs.gov.in" },
      { name: "National Institute of Securities Markets (NISM)", url: "https://www.nism.ac.in" }
    ]
  },

  "actuary": {
    listName: "Actuary",
    title: "Actuary in India: IAI ACET, Actuarial Science, Probability & Insurance Risk",
    metaDescription:
      "How to become an Actuary in India: IAI ACET exam, 13 core actuarial papers, life/general insurance pricing, pension mathematics, and top colleges.",
    intro:
      "Actuaries are mathematical risk specialists who apply probability theory, statistical modeling, compound interest mathematics, and financial economics to evaluate and price future financial risks. In India, fully certified Fellow Actuaries (FIAI) hold statutory responsibilities under the Insurance Regulatory and Development Authority of India (IRDAI) to sign off on insurance product pricing, company capital solvency, and pension liabilities. Administered by the Institute of Actuaries of India (IAI), students clear the Actuarial Common Entrance Test (ACET), followed by 13 rigorous professional paper examinations (Core Principles, Core Practices, Specialist Principles, Specialist Advanced).",
    typicalSubjects: [
      "Actuarial Mathematics & Financial Mathematics (Time Value of Money)",
      "Probability, Mathematical Statistics & Stochastic Processes",
      "Life Insurance Contingencies & Mortality Modeling",
      "Risk Modeling, Survival Models & Ruin Theory"
    ],
    keyExams: [
      "ACET (Actuarial Common Entrance Test conducted by IAI)",
      "IAI Professional Examinations (13 Papers: CS1, CS2, CM1, CM2, CB1, CB2, CP1, etc.)",
      "IFoA Examinations (Institute and Faculty of Actuaries, UK - equivalent mutual exemptions)"
    ],
    colleges: [
      { name: "Institute of Actuaries of India (IAI Statutory Body)", context: "The sole statutory governing body in India empowered to license and certify Associate and Fellow Actuaries." },
      { name: "Indian Statistical Institute (ISI Kolkata / Delhi)", context: "Supreme mathematical training ground producing top performers in core actuarial statistics and probability papers." },
      { name: "Chennai Mathematical Institute (CMI)", context: "Premier mathematics and computer science research institute with deep actuarial and quantitative finance pipelines." },
      { name: "St. Stephen's College / Hindu College (University of Delhi - B.Sc Mathematics)", context: "Top undergraduate mathematics programs whose students consistently clear multiple IAI core papers during degree." }
    ],
    ncoCode: "2120.0300",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Institute of Actuaries of India (IAI) / IRDAI",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2120 - Actuaries", url: "https://www.ncs.gov.in" },
      { name: "Institute of Actuaries of India (IAI)", url: "https://www.actuariesindia.org" }
    ]
  },

  "stock-broker": {
    listName: "Stock Broker",
    title: "Stock Broker in India: Trading, NISM Certifications, SEBI Registration & Equity Markets",
    metaDescription:
      "Career roadmap to becoming a Stock Broker & Sub-Broker in India: NISM Series VIII, SEBI broker regulations, algorithmic trading, and brokerages.",
    intro:
      "Stock Brokers and Securities Dealers facilitate the buying and selling of financial securities (equities, derivatives, commodities, currencies) on behalf of retail and institutional clients across stock exchanges (NSE, BSE, MCX). In India's fast-expanding financial ecosystem (Zerodha, Groww, AngelOne, ICICI Direct), modern stockbroking encompasses algorithmic trading execution, client relationship advisory, risk management margin systems, and SEBI compliance. Regulated by SEBI, practitioners obtain mandatory certifications from the National Institute of Securities Markets (NISM) to execute terminal orders and provide research advice.",
    typicalSubjects: [
      "Capital Markets & Indian Securities Exchange Architecture",
      "Equity Derivatives (Futures, Options, Greeks & Hedging Strategies)",
      "Technical Analysis, Candlestick Patterns & Price Action Trading",
      "SEBI Regulations, Prevention of Money Laundering (PMLA) & Investor Protection"
    ],
    keyExams: [
      "NISM Series VIII (Equity Derivatives Certification Examination)",
      "NISM Series V-A (Mutual Fund Distributors Certification Examination)",
      "NISM Series I (Currency Derivatives Certification Examination)",
      "NISM Series XVI (Commodity Derivatives Certification Examination)"
    ],
    colleges: [
      { name: "National Institute of Securities Markets (NISM Campus Patalganga, Navi Mumbai)", context: "Established by SEBI, offering premier post-graduate securities market and algorithmic trading programs." },
      { name: "BSE Institute Limited (Bombay Stock Exchange, Mumbai)", context: "Historic training institution located inside BSE Mumbai offering specialized capital market and trading certifications." },
      { name: "Narsee Monjee Institute of Management Studies (NMIMS Mumbai)", context: "Top management university located in India's financial capital with strong corporate brokerage recruitments." },
      { name: "K.J. Somaiya Institute of Management (Mumbai)", context: "Provides state-of-the-art Bloomberg financial trading terminal laboratories for live market simulation." }
    ],
    ncoCode: "3311.0100",
    skillLevel: "Level 3/4 (Associate Professional / Degree)",
    regulatoryBody: "Securities and Exchange Board of India (SEBI) / NISM",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 3311 - Securities & Finance Dealers", url: "https://www.ncs.gov.in" },
      { name: "National Stock Exchange of India (NSE)", url: "https://www.nseindia.com" }
    ]
  },

  "risk-manager": {
    listName: "Risk Manager",
    title: "Financial Risk Manager (FRM) in India: Credit, Market, Operational Risk & Basel Norms",
    metaDescription:
      "Guide to Financial Risk Management careers in India: Credit risk, Value at Risk (VaR), Basel III banking norms, GARP FRM certification, and MBA finance.",
    intro:
      "Risk Managers identify, quantify, and mitigate financial, market, credit, operational, and liquidity risks faced by banks, NBFCs, insurance companies, and fintech enterprises. In India's banking sector, risk managers implement Reserve Bank of India (RBI) prudential guidelines, Basel III capital adequacy norms, credit scoring algorithms, and stress testing models (Value at Risk - VaR). Standard career preparation involves an MBA in Finance or quantitative engineering background, paired with the globally prestigious Financial Risk Manager (FRM) certification by GARP (Global Association of Risk Professionals).",
    typicalSubjects: [
      "Quantitative Analysis & Probability Distribution Models",
      "Financial Markets, Products & Derivative Instruments",
      "Market Risk Measurement (VaR, Expected Shortfall, Stress Testing)",
      "Credit Risk Modeling (Expected Loss, PD, LGD, Basel Capital Accords)"
    ],
    keyExams: [
      "GARP FRM Exam (Financial Risk Manager Part 1 and Part 2)",
      "CAT / XAT / GMAT (for premier MBA in Finance and Banking)",
      "PRM (Professional Risk Managers' International Association Certification)"
    ],
    colleges: [
      { name: "Indian Institute of Management Bangalore (IIM-B)", context: "Top-ranked management institute with world-class faculty in financial risk modeling and economic policy." },
      { name: "National Institute of Bank Management (NIBM Pune)", context: "Apex autonomous institution established by RBI and commercial banks for banking risk management." },
      { name: "IIM Lucknow", context: "Leading business school renowned for analytical rigor in financial derivatives and credit risk." },
      { name: "SPJIMR (Mumbai)", context: "Top Mumbai business school with deep banking corporate mentorship and risk advisory placements." }
    ],
    ncoCode: "1211.0200",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Reserve Bank of India (RBI) / GARP",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 1211 - Financial Risk Managers", url: "https://www.ncs.gov.in" },
      { name: "Global Association of Risk Professionals (GARP)", url: "https://www.garp.org" }
    ]
  },

  "wealth-manager": {
    listName: "Wealth Manager",
    title: "Wealth Manager in India: Private Banking, HNI Portfolio Advisory & CFP Path",
    metaDescription:
      "How to become a Private Wealth Manager in India: HNI portfolio asset allocation, estate planning, Certified Financial Planner (CFP), and SEBI RIA norms.",
    intro:
      "Wealth Managers provide holistic financial planning, investment portfolio management, tax structuring, and estate planning to High-Net-Worth Individuals (HNIs), family offices, and business promoters. In India's fast-growing wealth market, wealth managers allocate capital across equity mutual funds, portfolio management services (PMS), alternative investment funds (AIFs), real estate investment trusts (REITs), and sovereign gold bonds. The profession requires a B.Com/BBA/MBA foundation combined with the Certified Financial Planner (CFP) credential and SEBI Registered Investment Advisor (RIA) certifications.",
    typicalSubjects: [
      "Personal Financial Planning & Wealth Accumulation Strategies",
      "Asset Allocation, Portfolio Construction & Rebalancing",
      "Retirement Planning, Trusts & Estate Law in India",
      "Direct Taxation, Capital Gains & SEBI RIA Regulations"
    ],
    keyExams: [
      "Certified Financial Planner (CFP Certification Examination - FPSB India)",
      "NISM Series X-A & X-B (Investment Adviser Level 1 and Level 2 Examinations)",
      "CAT / CMAT (for MBA in Wealth Management / Personal Finance)"
    ],
    colleges: [
      { name: "Financial Planning Standards Board (FPSB India)", context: "Principal standards-setting body for the Certified Financial Planner (CFP) designation in India." },
      { name: "NMIMS School of Business Management (Mumbai - MBA Banking & Wealth)", context: "Top private business school with deep placement ties to Mumbai's private banking headquarters." },
      { name: "Symbiosis Institute of Business Management (SIBM Pune)", context: "Renowned management institute offering specialized wealth management and retail financial advisory programs." },
      { name: "St. Xavier's College (Kolkata - Department of Commerce)", context: "Pioneering commerce faculty producing top investment advisors and wealth analysts." }
    ],
    ncoCode: "2412.0200",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "SEBI / Financial Planning Standards Board (FPSB India)",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2412 - Wealth Managers & Investment Advisers", url: "https://www.ncs.gov.in" },
      { name: "Financial Planning Standards Board India (FPSB)", url: "https://india.fpsb.org" }
    ]
  },

  "tax-consultant": {
    listName: "Tax Consultant",
    title: "Tax Consultant in India: GST, Direct Tax, Income Tax Act & Appellate Litigation",
    metaDescription:
      "Career guide for Tax Consultants in India: Income Tax Act 1961, GST litigation, international transfer pricing, CA/LL.B route, and corporate tax advisory.",
    intro:
      "Tax Consultants advise corporate enterprises and individual taxpayers on direct taxation (Income Tax Act, 1961), indirect taxation (Goods and Services Tax - GST), cross-border transfer pricing, and corporate tax restructuring. They draft legal responses to tax notices, handle assessments before the Income Tax Appellate Tribunal (ITAT), and design legally compliant tax-saving strategies. Practitioners in India are predominantly qualified Chartered Accountants (CA) or tax lawyers holding a Bachelor of Laws (LL.B) with specialized post-graduate diplomas in taxation laws.",
    typicalSubjects: [
      "Direct Tax Laws & Corporate Taxation Practice",
      "Goods and Services Tax (GST) Architecture, Invoicing & Input Tax Credit",
      "International Taxation, Double Taxation Avoidance Agreements (DTAA) & Transfer Pricing",
      "Tax Litigation, ITAT Procedures & Dispute Resolution Panels"
    ],
    keyExams: [
      "CA Final Direct & Indirect Tax Laws Papers (ICAI)",
      "All India Bar Examination (AIBE - for Tax Advocates)",
      "State Tax Practitioner / GST Practitioner Examinations"
    ],
    colleges: [
      { name: "National Law School of India University (NLSIU Bengaluru - Corporate & Tax Law)", context: "India's premier statutory law university offering world-class commercial and taxation legal scholarship." },
      { name: "Shri Ram College of Commerce (SRCC Delhi)", context: "Supreme commerce college known for unmatched expertise in direct tax legislation and GST analytics." },
      { name: "Government Law College (GLC Mumbai)", context: "Historic law college situated next to the Bombay High Court and tax appellate benches." },
      { name: "Institute of Chartered Accountants of India (ICAI Post-Qualification Certificate in International Taxation)", context: "Specialised post-qualification diploma for expert cross-border transfer pricing and BEPS advisory." }
    ],
    ncoCode: "2411.0400",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Central Board of Direct Taxes (CBDT) / CBIC / ICAI / Bar Council of India",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2411 - Taxation Specialists", url: "https://www.ncs.gov.in" },
      { name: "Income Tax Department, Government of India", url: "https://www.incometax.gov.in" }
    ]
  },

  "forensic-auditor": {
    listName: "Forensic Auditor",
    title: "Forensic Auditor in India: Financial Fraud Investigation, Benami Assets & CBI/SFIO",
    metaDescription:
      "How to become a Forensic Auditor in India: Forensic accounting, digital fraud detection, Serious Fraud Investigation Office (SFIO) audits, and CFE/FAFD path.",
    intro:
      "Forensic Auditors and Forensic Accountants investigate corporate financial fraud, money laundering, fund diversion, bribery, and accounting statement manipulations. In India, forensic auditors work with enforcement agencies (SFIO, CBI, Enforcement Directorate), corporate banks for non-performing asset (NPA) tracing, and leading audit firms. They analyze ledger transaction trails, extract digital evidence, and present forensic audit reports admissible in court under the Prevention of Money Laundering Act (PMLA). The qualification builds upon a CA, CMA, or LL.B degree combined with the ICAI Certificate Course on Forensic Accounting and Fraud Detection (FAFD) or the global Certified Fraud Examiner (CFE) credential.",
    typicalSubjects: [
      "Forensic Accounting Concepts, Red Flags & Fraud Schemes",
      "Digital Forensics, Electronic Evidence Discovery & Tally/SAP Data Extraction",
      "Anti-Money Laundering Laws (PMLA), Benami Property Transactions Act & IBC",
      "Expert Witness Testimony & Forensic Report Drafting for Courts"
    ],
    keyExams: [
      "FAFD (Certificate Course on Forensic Accounting and Fraud Detection by ICAI)",
      "CFE (Certified Fraud Examiner Examination by ACFE USA)",
      "CA Final / CMA Final Examination"
    ],
    colleges: [
      { name: "National Forensic Sciences University (NFSU Gandhinagar / Delhi)", context: "Institute of National Importance offering dedicated Master's degrees in Forensic Accounting and Fraud Investigation." },
      { name: "Institute of Chartered Accountants of India (FAFD Program)", context: "Apex regulatory body certifying chartered accountants in statutory forensic auditing and NPA investigation." },
      { name: "Indian Institute of Management Calcutta (IIM-C)", context: "Pioneering executive education in corporate financial crime governance and advanced fraud analytics." },
      { name: "Gujarat National Law University (GNLU Gandhinagar)", context: "Premier national law university specializing in economic crimes, white-collar crime trials, and anti-corruption laws." }
    ],
    ncoCode: "2411.0500",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "ICAI / Serious Fraud Investigation Office (SFIO) / ACFE",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2411 - Forensic Accountants and Auditors", url: "https://www.ncs.gov.in" },
      { name: "Ministry of Corporate Affairs (SFIO)", url: "https://sfio.gov.in" }
    ]
  },

  "bank-po-probationary-officer": {
    listName: "Bank PO (Probationary Officer)",
    title: "Bank PO in India: SBI PO, IBPS PO, Credit Appraisal & Commercial Banking Path",
    metaDescription:
      "Complete guide to becoming a Bank Probationary Officer in India: IBPS PO, SBI PO exams, credit sanctioning, NPA recovery, and public sector bank hierarchy.",
    intro:
      "A Bank Probationary Officer (Bank PO / Junior Management Grade Scale-I Officer) is an entry-level managerial officer in Public Sector Commercial Banks (such as State Bank of India, Punjab National Bank, Bank of Baroda). Bank POs handle retail banking operations, verify loan credit appraisals, manage branch cash reserves, sanction MSME/agricultural credit, and supervise customer service personnel during a 2-year probation period. Selection is strictly merit-based through competitive nationwide examinations conducted by the Institute of Banking Personnel Selection (IBPS) and State Bank of India (SBI).",
    typicalSubjects: [
      "Quantitative Aptitude, Data Interpretation & Numerical Ability",
      "Reasoning Ability (Puzzles, Seating Arrangements, Logical Syllogisms)",
      "Banking Awareness, RBI Monetary Policy & Financial Economy",
      "English Language Proficiency & Descriptive Essay/Letter Writing"
    ],
    keyExams: [
      "SBI PO Examination (Preliminary, Mains & Psychometric/Interview Round)",
      "IBPS PO / Management Trainee Examination (Participating Public Sector Banks)",
      "IBPS RRB Officer Scale-I Examination (Regional Rural Banks)"
    ],
    colleges: [
      { name: "Any Recognised University Graduation (UGC Approved)", context: "Graduation in any discipline (B.Com, B.Tech, B.Sc, B.A.) is the mandatory statutory eligibility for IBPS/SBI PO exams." },
      { name: "National Institute of Bank Management (NIBM Pune)", context: "Post-graduate banking institute offering premier fast-track career acceleration in treasury and corporate banking." },
      { name: "Manipal Academy of Banking (Manipal School of Banking Bengaluru)", context: "Pioneered the specialized 1-year Post Graduate Diploma in Banking & Finance (PGDBF) with guaranteed PSU/private bank officer placement." },
      { name: "Institute of Banking Personnel Selection (IBPS Mumbai)", context: "Autonomous apex testing organization conducting All-India recruitment for nationalized banks." }
    ],
    ncoCode: "2412.0300",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "Reserve Bank of India (RBI) / Indian Banks' Association (IBA) / IBPS",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2412 - Banking Officers", url: "https://www.ncs.gov.in" },
      { name: "Institute of Banking Personnel Selection (IBPS)", url: "https://www.ibps.in" }
    ]
  },

  "product-manager": {
    listName: "Product Manager",
    title: "Product Manager in India: Tech Products, Roadmap, UX & MBA/B.Tech Path",
    metaDescription:
      "How to become a Product Manager in India: PRDs, agile roadmaps, unit economics, engineering collaboration, and IIM/tier-1 B.Tech pathways.",
    intro:
      "Product Managers (PMs) define the product vision, strategy, and feature roadmap for software platforms, consumer apps, and B2B SaaS products. Sitting at the intersection of business, technology, and user experience (UX), PMs write Product Requirement Documents (PRDs), conduct customer discovery interviews, prioritize engineering sprints, and analyze product analytics (retention curves, conversion funnels). In India's product startup and tech ecosystem, PMs typically hold an engineering degree (B.Tech CS/EE) followed by an MBA from top business schools or transition from software engineering and UX roles.",
    typicalSubjects: [
      "Product Strategy, Competitive Analysis & Market Sizing",
      "User Research, Wireframing & UX Usability Testing",
      "Agile Scrum Methodologies, Sprint Planning & JIRA Workflows",
      "Product Metrics (North Star Metric, DAU/MAU, Cohort Retention, LTV/CAC)"
    ],
    keyExams: [
      "CAT / GMAT (for flagship MBA programs at IIM Ahmedabad, Bangalore, Calcutta, ISB)",
      "JEE Main & JEE Advanced (for foundational B.Tech degree)"
    ],
    colleges: [
      { name: "Indian Institute of Management Bangalore (IIM-B)", context: "Consistently ranked as India's premier B-school for digital product management and tech consulting recruitments." },
      { name: "Indian School of Business (ISB Hyderabad)", context: "Top 1-year MBA program with dedicated Product Management tracks and deep Silicon Valley / Bengaluru startup alumni networks." },
      { name: "IIT Bombay / IIT Delhi", context: "Produces high-calibre undergraduate APMs (Associate Product Managers) hired directly by top tech product firms." },
      { name: "Faculty of Management Studies (FMS Delhi)", context: "Top business school offering excellent corporate product management case competitions and placements." }
    ],
    ncoCode: "1219.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "AICTE / UGC",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 1219 - Digital Product & Business Managers", url: "https://www.ncs.gov.in" },
      { name: "NASSCOM Product Council", url: "https://nasscom.in" }
    ]
  },

  "management-consultant": {
    listName: "Management Consultant",
    title: "Management Consultant in India: Strategy, Case Interviews, MBB & IIM Route",
    metaDescription:
      "Complete guide to Management Consulting in India: Case interviews, McKinsey/BCG/Bain hiring, corporate turnaround strategy, and IIM/IIT colleges.",
    intro:
      "Management Consultants advise senior executives, boards of directors, and government ministries on high-stakes strategic challenges including market entry, corporate growth strategies, operational turnarounds, digital transformation, and organizational redesign. In India, top strategy consulting firms (McKinsey, Boston Consulting Group, Bain, Kearney) recruit graduates who demonstrate structured problem-solving, hypothesis-driven case interview mastery, quantitative modeling, and executive storytelling. The standard pathway is graduating at the top percentile of premier institutes (IITs/IIMs/SRCC) followed by rigorous case interview preparation.",
    typicalSubjects: [
      "Corporate Strategy, Market Sizing & Competitive Advantage (Porter's Five Forces)",
      "Financial Statement Decomposition & Unit Economics Analysis",
      "Hypothesis-Driven Problem Solving (Issue Trees & MECE Frameworks)",
      "Executive Storytelling, Data Visualization & Slide Synthesis"
    ],
    keyExams: [
      "CAT (Common Admission Test for flagship PGP programs at IIM A/B/C)",
      "GMAT (for ISB Hyderabad & global business schools)",
      "JEE Advanced (for premier IIT undergraduate engineering recruitment)"
    ],
    colleges: [
      { name: "Indian Institute of Management Ahmedabad (IIM-A)", context: "The undisputed capital of strategy consulting in India, with the highest concentration of MBB partner recruits." },
      { name: "Indian Institute of Management Calcutta (IIM-C)", context: "Historic business school producing elite management and quantitative financial strategy consultants." },
      { name: "Indian Institute of Technology Delhi (IIT Delhi)", context: "Top undergraduate engineering campus with active consulting clubs and direct front-office analyst recruitment." },
      { name: "Shri Ram College of Commerce (SRCC Delhi)", context: "Asia's premier undergraduate commerce college with consistent tier-1 strategy consulting placements." }
    ],
    ncoCode: "2421.0100",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "UGC / AICTE",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 2421 - Management and Organisation Analysts", url: "https://www.ncs.gov.in" },
      { name: "Management Consultants Association of India (MCAI)", url: "https://mcai.in" }
    ]
  },

  "operations-manager": {
    listName: "Operations Manager",
    title: "Operations Manager in India: Process Optimization, Lean Six Sigma & Plant Ops",
    metaDescription:
      "Career pathway for Operations Management in India: Supply chain execution, plant operations, quality control, Lean Six Sigma, and MBA Operations.",
    intro:
      "Operations Managers ensure that day-to-day business processes, manufacturing lines, logistics delivery networks, and service operations run at peak efficiency, lowest cost, and zero defect rates. In India's massive manufacturing sector and e-commerce delivery networks (Amazon, Flipkart, Delhivery), operations managers manage shift staffing, throughput capacity planning, vendor inventory procurement, and safety compliance. Educational preparation typically combines an engineering undergraduate degree (B.Tech) with an MBA in Operations Management from premier business schools like IIM Mumbai (formerly NITIE).",
    typicalSubjects: [
      "Operations Management, Capacity Planning & Line Balancing",
      "Total Quality Management (TQM), Lean Manufacturing & Six Sigma",
      "Inventory Management Models (EOQ, JIT, ABC Analysis)",
      "Project Management Methodologies (Critical Path Method, PERT)"
    ],
    keyExams: [
      "CAT (for flagship MBA in Operations at IIM Mumbai / IIMs)",
      "XAT / CMAT / SNAP (for leading business schools)",
      "JEE Main & State CETs (for foundational engineering degrees)"
    ],
    colleges: [
      { name: "IIM Mumbai (formerly National Institute of Industrial Engineering - NITIE)", context: "India's supreme Mecca for operations, manufacturing, and supply chain leadership." },
      { name: "SPJIMR Mumbai (Operations & Supply Chain Management Specialization)", context: "Top private business school with unique non-classroom learning and exceptional operations recruitment." },
      { name: "Symbiosis Institute of Operations Management (SIOM Nashik)", context: "India's only business school dedicated exclusively to engineers pursuing operations management." },
      { name: "IIT Kharagpur (Vinod Gupta School of Management - VGSoM)", context: "Top business school situated within IIT Kharagpur leveraging advanced industrial technology labs." }
    ],
    ncoCode: "1219.0200",
    skillLevel: "Level 4 (Professional / Degree)",
    regulatoryBody: "AICTE / UGC",
    lastReviewed: "August 2026",
    sources: [
      { name: "NCO-2015 Code 1219 - Business Operations Managers", url: "https://www.ncs.gov.in" },
      { name: "All India Management Association (AIMA)", url: "https://www.aima.in" }
    ]
  }
};
