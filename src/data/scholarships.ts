export interface Scholarship {
    id: string;
    title: string;
    description: string;
    amount: string;
    deadline: string;
    eligibility: string[];
    category: "Merit-Based" | "Means-Based" | "Government" | "Private";
    link: string;
}

export const SCHOLARSHIPS: Scholarship[] = [
    // ----------------------------------------------------
    // GOVERNMENT SCHOLARSHIPS
    // ----------------------------------------------------
    {
        id: "gov-ntse",
        title: "National Talent Search Examination (NTSE)",
        description: "A flagship national-level scholarship program by NCERT to identify and nurture talented students.",
        amount: "₹1,250 - ₹2,000 per month",
        deadline: "November (Annually)",
        eligibility: ["Class 10 students", "Must clear Stage 1 (State) and Stage 2 (National)"],
        category: "Government",
        link: "https://ncert.nic.in/national-talent-examination.php"
    },
    {
        id: "gov-nmms",
        title: "National Means-cum-Merit Scholarship (NMMS)",
        description: "Awarded to meritorious students of economically weaker sections to arrest their drop out at class VIII and encourage them to continue study at secondary stage.",
        amount: "₹12,000 per annum",
        deadline: "November (Annually)",
        eligibility: ["Students studying in Class 8", "Family income less than ₹3,50,000", "Minimum 55% marks in Class 7"],
        category: "Government",
        link: "https://scholarships.gov.in/"
    },
    {
        id: "gov-inspire",
        title: "INSPIRE Scholarship for Higher Education (SHE)",
        description: "A scholarship program by the Department of Science and Technology (DST) to attract talent to the study of basic sciences.",
        amount: "₹80,000 per annum",
        deadline: "December (Annually)",
        eligibility: ["Top 1% in Class 12 Board exams", "Pursuing BSc/BS/Int. MSc/MS in Basic/Natural Sciences"],
        category: "Government",
        link: "https://online-inspire.gov.in/"
    },
    {
        id: "gov-pmss",
        title: "Prime Minister's Scholarship Scheme (PMSS)",
        description: "Scholarship to encourage higher technical and professional education for the dependent wards of Ex-Servicemen / Ex-Coast Guard personnel.",
        amount: "₹36,000 (Girls) / ₹30,000 (Boys) per annum",
        deadline: "December (Annually)",
        eligibility: ["Wards/widows of Ex-servicemen", "Enrolled in first year of professional/technical degree", "Min 60% in Class 12/Diploma"],
        category: "Government",
        link: "https://ksb.gov.in/"
    },
    {
        id: "gov-central-sector",
        title: "Central Sector Scheme of Scholarships for College and University Students",
        description: "Provides financial assistance to meritorious students from poor families to meet their day-to-day expenses while pursuing higher studies.",
        amount: "₹12,000 per annum (UG) / ₹20,000 per annum (PG)",
        deadline: "December (Annually)",
        eligibility: ["Above 80th percentile in Class 12 Boards", "Family income less than ₹4,50,000", "Not receiving any other scholarship"],
        category: "Government",
        link: "https://scholarships.gov.in/"
    },
    {
        id: "gov-post-matric-minority",
        title: "Post Matric Scholarships Scheme for Minorities",
        description: "Awarded to meritorious students belonging to minority communities (Muslim, Sikh, Christian, Buddhist, Jain, Parsi) to provide them better opportunities for higher education.",
        amount: "Admission fee + Maintenance allowance",
        deadline: "November (Annually)",
        eligibility: ["Students from minority communities", "Min 50% marks in previous final exam", "Family income less than ₹2,000,000 per annum"],
        category: "Government",
        link: "https://scholarships.gov.in/"
    },
    {
        id: "gov-mahadbt",
        title: "MahaDBT (Maharashtra Direct Benefit Transfer)",
        description: "An umbrella portal hosting various scholarships offered by the Government of Maharashtra for students domiciled in the state.",
        amount: "Variable (Tuition fee waiver, maintenance allowance)",
        deadline: "March (Annually)",
        eligibility: ["Domicile of Maharashtra", "Enrolled in recognized courses", "Income criteria varies by specific scheme"],
        category: "Government",
        link: "https://mahadbt.maharashtra.gov.in/"
    },
    {
        id: "gov-svmcm",
        title: "Swami Vivekananda Merit Cum Means Scholarship (SVMCM)",
        description: "A West Bengal government initiative to assist meritorious students belonging to economically backward families.",
        amount: "₹12,000 - ₹96,000 per annum depending on course",
        deadline: "February (Annually)",
        eligibility: ["Domicile of West Bengal", "Min 60% in State Board", "Family income less than ₹2,50,000"],
        category: "Government",
        link: "https://svmcm.wbhed.gov.in/"
    },
    {
        id: "gov-pmyasasvi",
        title: "PM YASASVI Pre-Matric and Post-Matric Scholarship",
        description: "A scheme by the Ministry of Social Justice and Empowerment for students belonging to OBC, EBC, and DNT categories.",
        amount: "₹4,000 - ₹20,000 per annum",
        deadline: "January (Annually)",
        eligibility: ["OBC/EBC/DNT categories", "Family income less than ₹2,50,000"],
        category: "Government",
        link: "https://yet.nta.ac.in/"
    },
    {
        id: "gov-national-overseas",
        title: "National Overseas Scholarship Scheme",
        description: "Facilitates low income students belonging to SC, Denotified Nomadic Tribes, Landless Agricultural Labourers and Traditional Artisans category to obtain higher education globally.",
        amount: "$15,400 (US) / £9,900 (UK) + Tuition Fees",
        deadline: "March (Annually)",
        eligibility: ["SC, DNT, Landless Agricultural Labourers", "Minimum 60% in qualifying exam", "Under 35 years old", "Family income < ₹8,000,000"],
        category: "Government",
        link: "https://nosmsje.gov.in/"
    },

    // ----------------------------------------------------
    // PRIVATE / CORPORATE SCHOLARSHIPS
    // ----------------------------------------------------
    {
        id: "priv-reliance",
        title: "Reliance Foundation Undergraduate Scholarships",
        description: "Aims to support meritorious students from across India with financial assistance to pursue their undergraduate college education.",
        amount: "Up to ₹2,00,000 over duration of degree",
        deadline: "October (Annually)",
        eligibility: ["Passed 12th with min 60%", "Must be enrolled in 1st year full-time UG in India", "Family income less than ₹15,00,000"],
        category: "Private",
        link: "https://reliancefoundation.org/scholarships"
    },
    {
        id: "priv-tata",
        title: "Tata Trusts Means Grant",
        description: "Aims to provide partial assistance to college students to meet their tuition fees for the academic year.",
        amount: "Partial funding of tuition fees",
        deadline: "January (Annually)",
        eligibility: ["College students studying in Mumbai/suburbs", "From a low-income family"],
        category: "Private",
        link: "https://www.tatatrusts.org/our-work/individual-grants-and-education"
    },
    {
        id: "priv-lic",
        title: "LIC Golden Jubilee Scholarship",
        description: "Supports meritorious students from economically weaker families to pursue higher education in recognized courses.",
        amount: "₹20,000 per annum (General) / ₹10,000 per annum (Special Girl Child)",
        deadline: "January (Annually)",
        eligibility: ["Passed Class 12 with min 60% marks", "Family income < ₹2,50,000", "Pursuing Medicine, Engineering, Graduation, Diploma"],
        category: "Private",
        link: "https://licindia.in/golden-jubilee-foundation"
    },
    {
        id: "priv-colgate",
        title: "Keep India Smiling Foundational Scholarship By Colgate",
        description: "Provides foundational support to individuals who are deserving and meritorious but lack resources to pursue their dreams.",
        amount: "₹20,000 to ₹50,000 per annum",
        deadline: "March (Annually)",
        eligibility: ["Students pursuing Class 11, Graduation, Diploma, Engineering, Vocational courses", "Family income < ₹5,00,000"],
        category: "Private",
        link: "https://www.colgate.com/en-in/keep-india-smiling"
    },
    {
        id: "priv-loreal",
        title: "L'Oréal India For Young Women In Science Scholarship",
        description: "Aimed at helping promising young women from economically disadvantaged backgrounds pursue their graduation in science fields.",
        amount: "Up to ₹2,50,000 spread over the duration of graduation",
        deadline: "October (Annually)",
        eligibility: ["Young women who have passed Class 12 in Science (PCB/PCM)", "Min 85% in PCM/PCB", "Family income < ₹6,00,000", "Max age 19 years"],
        category: "Private",
        link: "https://www.loreal.com/en/india/"
    },
    {
        id: "priv-adityabirla",
        title: "Aditya Birla Capital COVID Scholarship Program",
        description: "Provides financial assistance to students who have lost their parent(s) due to COVID-19 to ensure continuity of their education.",
        amount: "Up to ₹60,000 depending on course",
        deadline: "Depends on availability",
        eligibility: ["Lost parent(s) due to COVID-19", "Enrolled in Class 1 to 12 or UG courses"],
        category: "Private",
        link: "https://www.adityabirlacapital.com/"
    },
    {
        id: "priv-kotak",
        title: "Kotak Kanya Scholarship",
        description: "Provides financial support to meritorious girl students from underprivileged sections of society to pursue higher education.",
        amount: "Up to ₹1.5 lakh per year",
        deadline: "October (Annually)",
        eligibility: ["Girl students securing admission to first-year UG programs (Engineering, MBBS, Architecture, Design, etc.)", "Min 85% in Class 12", "Family income < ₹3,20,000"],
        category: "Private",
        link: "https://kotakeducation.org/"
    },
    {
        id: "priv-santoor",
        title: "Santoor Women's Scholarship",
        description: "Financial support for girl students from underprivileged backgrounds who wish to pursue higher education after grade 12.",
        amount: "₹24,000 per annum",
        deadline: "October (Annually)",
        eligibility: ["Girls from designated states (KA, AP, TS, CH)", "Passed class 10 and 12 from local government schools", "Enrolled in degree program"],
        category: "Private",
        link: "https://www.santoorscholarships.com/"
    },
    {
        id: "priv-sensodyne",
        title: "Sensodyne IDA Shining Star Scholarship",
        description: "Supports meritorious and underprivileged dental students across India.",
        amount: "₹1,05,000 per year for 4 years",
        deadline: "November (Annually)",
        eligibility: ["Pursuing first year of Bachelor of Dental Surgery (BDS)", "Min 60% in Class 12", "Family income < ₹8,00,000"],
        category: "Private",
        link: "https://www.sensodyne.in/shining-star-scholarship.html"
    },
    {
        id: "priv-mi",
        title: "Mi Scholarship",
        description: "Xiaomi India scholarship to alleviate the financial burden on low-income families and assist students in higher studies.",
        amount: "Up to ₹5,800 for Class 11/12; ₹3,800 for Undergraduates",
        deadline: "December (Annually)",
        eligibility: ["Indian students studying in Class 11/12 or undergraduate degree", "Min 70% in board exams", "Family income < ₹3,00,000"],
        category: "Private",
        link: "https://www.mi.com/in/about/scholarship"
    },

    // ----------------------------------------------------
    // MERIT-BASED SCHOLARSHIPS
    // ----------------------------------------------------
    {
        id: "merit-cbse-single-girl",
        title: "CBSE Merit Scholarship for Single Girl Child",
        description: "Provides scholarships to meritorious Single Girl Students who alone are the only child of their parents, to promote girl education.",
        amount: "₹500 per month for 2 years (Class 11, 12)",
        deadline: "October (Annually)",
        eligibility: ["Single Girl Child", "Passed CBSE Class 10 with min 60% marks", "Continuing education in Class 11/12 in CBSE school"],
        category: "Merit-Based",
        link: "https://cbse.gov.in/scholarship"
    },
    {
        id: "merit-aicte-pragati",
        title: "AICTE Pragati Scholarship for Girls",
        description: "An AICTE scheme aimed at providing assistance to the advancement of girls pursuing Technical Education.",
        amount: "₹50,000 per annum",
        deadline: "December (Annually)",
        eligibility: ["Girl child (max 2 per family)", "Admitted to 1st year or 2nd year (lateral) of Degree/Diploma in AICTE approved institution", "Family income < ₹8,00,000"],
        category: "Merit-Based",
        link: "https://www.aicte-india.org/schemes/students-development-schemes"
    },
    {
        id: "merit-kcf",
        title: "Kiran C Patel Merit Scholarship",
        description: "Rewards highly meritorious students pursuing higher education.",
        amount: "Variable",
        deadline: "Varies",
        eligibility: ["Top ranking students in board exams or competitive exams", "Admitted to prestigious Indian institutions"],
        category: "Merit-Based",
        link: "https://www.chhotubhaipatel.org/"
    },
    {
        id: "merit-ffe",
        title: "Foundation for Excellence (FFE) Scholarship",
        description: "Awards scholarships to exceptionally bright students with extreme financial constraints to pursue professional degrees in Engineering or Medical.",
        amount: "Up to ₹40,000 per annum",
        deadline: "December (Annually)",
        eligibility: ["First-year BE/BTech/MBBS students", "Exceptional performance in entrance exams (JEE/NEET/State)", "Family income < ₹3,00,000"],
        category: "Merit-Based",
        link: "https://ffe.org/"
    },
    {
        id: "merit-dr-apj",
        title: "Dr. APJ Abdul Kalam Ignite Awards",
        description: "An initiative by the National Innovation Foundation to harness the creative and innovative spirit of school children.",
        amount: "Recognition, prototypes, and patent support",
        deadline: "August (Annually)",
        eligibility: ["Students up to class 12 or those out of school up to the age of 17.5 years", "Must submit original technological ideas or innovations"],
        category: "Merit-Based",
        link: "https://nif.org.in/ignite"
    },
    {
        id: "merit-bose",
        title: "SN Bose Scholars Program",
        description: "Nurtures future innovators and leaders by providing Indian students an opportunity to experience world-class research facilities in the USA.",
        amount: "$2500 Stipend + Health Insurance + Airfare",
        deadline: "October (Annually)",
        eligibility: ["Indian citizens currently enrolled in a Bachelors or Masters degree", "Pursuing studies in Atmospheric and Earth Sciences, Chemical Sciences, Engineering, Mathematical and Computational Sciences, or Physical Sciences"],
        category: "Merit-Based",
        link: "https://www.shastriinstitute.org/"
    },
    {
        id: "merit-nurturance",
        title: "National Nurturance Scholarship",
        description: "Provides long term funding to top scoring students of national aptitude exams who pursue fundamental research.",
        amount: "₹10,000 per month",
        deadline: "Closed/Rolling",
        eligibility: ["Top rankers in science aptitude tests", "Enrolled in IISc, IISERs, NISER, or specific IITs for basic science degrees"],
        category: "Merit-Based",
        link: "https://www.iiseradmission.in/"
    },
    {
        id: "merit-fair-and-lovely",
        title: "Glow & Lovely Careers Scholarship",
        description: "Helps women pursue graduation and post-graduation by providing financial assistance.",
        amount: "₹25,000 to ₹50,000",
        deadline: "December (Annually)",
        eligibility: ["Women aged 15-30", "Min 60% in class 10 and 12", "Family income < ₹6,00,000", "Pursuing UG or PG degrees"],
        category: "Merit-Based",
        link: "https://www.glowandlovelycareers.in/en/scholarships-for-women"
    },
    {
        id: "merit-sbs",
        title: "Siksha 'O' Anusandhan (SOA) Scholarship",
        description: "Institution-specific scholarship rewarding meritorious candidates applying to SOA University.",
        amount: "Varies from 10% to 100% tuition waiver",
        deadline: "At the time of admission",
        eligibility: ["Admission to SOA based on SAAT or other national tests", "Minimum 90% in class 12 boards for high-tier scholarships"],
        category: "Merit-Based",
        link: "https://www.soa.ac.in/"
    },
    {
        id: "merit-kind",
        title: "KIND Circle Scholarship for Meritorious Students",
        description: "Aims to help meritorious students coming from underprivileged backgrounds to fulfill their dream of higher education.",
        amount: "Up to ₹50,000",
        deadline: "November (Annually)",
        eligibility: ["Students pursuing class 9 to 12, graduation, or vocational courses", "Min 60% in previous qualifying exam", "Family income < ₹4,00,000"],
        category: "Merit-Based",
        link: "https://www.kindcircle.org/"
    },

    // ----------------------------------------------------
    // MEANS-BASED SCHOLARSHIPS
    // ----------------------------------------------------
    {
        id: "means-jindal",
        title: "Sitaram Jindal Foundation Scholarship",
        description: "Given to poor and deserving students pursuing various courses, from class 11 to postgraduate, including diplomas and ITI.",
        amount: "₹500 to ₹3,200 per month",
        deadline: "Open All Year",
        eligibility: ["Class 11, 12, ITI, Diploma, UG, PG", "Minimum marks criteria varies by course (general cutoff: girls 60%, boys 65%)"],
        category: "Means-Based",
        link: "https://www.sitaramjindalfoundation.org/scholarships-for-students-in-bangalore.php"
    },
    {
        id: "means-hsdc",
        title: "HDFC Educational Crisis Scholarship Support",
        description: "Helps students whose families are facing a sudden crisis and need financial support to continue their education.",
        amount: "Up to ₹10,000 (School) / ₹25,000 (College)",
        deadline: "Variable",
        eligibility: ["Students who have experienced a crisis in past 2 years (death of earning member, critical illness, natural disaster)", "From class 6 to PG degree/diploma"],
        category: "Means-Based",
        link: "https://www.hdfcbank.com/"
    },
    {
        id: "means-vidyadhan",
        title: "Vidyadhan Scholarship Program",
        description: "A program by Sarojini Damodaran Foundation to sponsor college education for meritorious students from economically challenged families.",
        amount: "₹10,000 to ₹60,000 per year (depending on course/state)",
        deadline: "Varies by State (Usually between June and September)",
        eligibility: ["Completed Class 10 with minimum 90% or 9 CGPA", "Family income < ₹2,00,000", "State-specific domicile rules apply"],
        category: "Means-Based",
        link: "https://www.vidyadhan.org/"
    },
    {
        id: "means-aicte-saksham",
        title: "AICTE Saksham Scholarship Scheme",
        description: "Aimed at providing encouragement and support to specially-abled children to pursue Technical Education.",
        amount: "₹50,000 per annum",
        deadline: "December (Annually)",
        eligibility: ["Specially-abled student with disability > 40%", "Admitted to 1st year of Degree/Diploma at an AICTE approved institution", "Family income < ₹8,00,000"],
        category: "Means-Based",
        link: "https://www.aicte-india.org/schemes/students-development-schemes"
    },
    {
        id: "means-v-guard",
        title: "V-Guard Big Idea Scholarship",
        description: "Offers financial aid and mentorship to financially struggling students who show potential.",
        amount: "₹1,00,000 + Summer Internship",
        deadline: "August (Annually)",
        eligibility: ["Engineering / B-school students", "Idea competition winners", "Need-based assessment also applied"],
        category: "Means-Based",
        link: "https://www.vguard.in/bigidea"
    },
    {
        id: "means-fame",
        title: "FAME India Scholarship",
        description: "Scholarships for students with disabilities to pursue their education up to the college level.",
        amount: "Varies",
        deadline: "July (Annually)",
        eligibility: ["Students with recognized physical or intellectual disabilities", "Enrolled in standard educational or vocational training institutes", "Family income criteria applies"],
        category: "Means-Based",
        link: "https://www.fameindia.org/"
    },
    {
        id: "means-medhavi",
        title: "Medhavi National Scholarship Scheme",
        description: "An initiative under HRd Mission for students of all sections of society, specifically aiming to help lower-income groups achieve higher education.",
        amount: "Up to ₹8,000 per month",
        deadline: "Usually May (Through online exam)",
        eligibility: ["Any Indian citizen aged 16-40", "Class 10 minimum pass", "Assessed via the Medhavi Android App Scholarship exam"],
        category: "Means-Based",
        link: "https://www.medhavionline.org/"
    },
    {
        id: "means-begum-hazrat",
        title: "Begum Hazrat Mahal National Scholarship",
        description: "For meritorious girl students belonging to minority communities to assist them in continuing their higher secondary education.",
        amount: "₹5,000 for Class 9/10, ₹6,000 for Class 11/12",
        deadline: "November (Annually)",
        eligibility: ["Minority community girl students", "Studying in Class 9 to 12", "Min 50% in previous class", "Family income < ₹2,00,000"],
        category: "Means-Based",
        link: "https://scholarships.gov.in/"
    },
    {
        id: "means-concord",
        title: "Concord Biotech Limited Scholarship",
        description: "Provides financial aid to students belonging to low income families who are pursuing B.E./B.Tech courses.",
        amount: "₹40,000",
        deadline: "December (Annually)",
        eligibility: ["Students pursuing 1st-year BE/BTech (Any stream)", "Applicant must have scored min 50% in Class 10/12", "Family income < ₹3,00,000"],
        category: "Means-Based",
        link: "https://www.concordbiotech.com/sustainability"
    },
    {
        id: "means-rolls-royce",
        title: "Rolls-Royce Unnati Scholarship for Women Engineering Students",
        description: "Helps girl students pursuing engineering to complete their studies.",
        amount: "₹35,000",
        deadline: "August (Annually)",
        eligibility: ["Girls studying in 1st/2nd/3rd year of Engineering degree program", "Min 60% marks in Class 10/12 boards", "Family income < ₹4,00,000"],
        category: "Means-Based",
        link: "https://www.rolls-royce.com/"
    }
];
