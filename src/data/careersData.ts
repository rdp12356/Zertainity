import { Code2, HeartPulse, Layers, Landmark, IndianRupee, Scale, Palette, FlaskConical, Briefcase, GraduationCap, Building2, Clock, Trophy, ChevronRight, Star, BookOpen } from "lucide-react";

export interface CareerDetail {
  title: string;
  category: string;
  categoryIcon: any;
  tagline: string;
  overview: string;
  entranceExams: string[];
  courses: Array<{ name: string; duration: string; type: "UG" | "PG" | "Diploma" | "Certificate" | "Professional" | "Preparation" | "Training" }>;
  topColleges: Array<{ name: string; location: string; rank?: string }>;
  salaryRange: { entry: string; mid: string; senior: string };
  skills: string[];
  roadmap: Array<{ phase: string; title: string; duration: string; description: string; tips: string[] }>;
  proTip: string;
}

export const CAREER_DETAILS: Record<string, CareerDetail> = {
  /* ── TECHNOLOGY & IT ── */
  "Software Engineer": {
    title: "Software Engineer",
    category: "Technology",
    categoryIcon: Code2,
    tagline: "Build the digital world, one line at a time.",
    overview: "Software engineers design, develop, and maintain software applications. In India, this is a core pillar of the economy, with hubs in Bangalore, Hyderabad, and Pune.",
    entranceExams: ["JEE Main", "JEE Advanced", "BITSAT", "VITEEE", "COMEDK"],
    courses: [
      { name: "B.Tech Computer Science & Engineering", duration: "4 years", type: "UG" },
      { name: "M.Tech Computer Science", duration: "2 years", type: "PG" },
      { name: "MCA (Master of Computer Applications)", duration: "2 years", type: "PG" }
    ],
    topColleges: [
      { name: "IIT Madras", location: "Chennai", rank: "NIRF #1" },
      { name: "IIT Delhi", location: "New Delhi", rank: "NIRF #2" },
      { name: "BITS Pilani", location: "Pilani", rank: "Top Private" }
    ],
    salaryRange: { entry: "₹4L - ₹12L", mid: "₹15L - ₹35L", senior: "₹40L - ₹1Cr+" },
    skills: ["Data Structures", "Algorithms", "System Design", "Cloud Computing", "Team Collaboration"],
    roadmap: [
      { phase: "School", title: "Foundation", duration: "Class 11-12", description: "Focus on PCM (Physics, Chemistry, Maths) and take Computer Science as an elective.", tips: ["Master C++/Python early", "Aim for 90%+ in Boards"] },
      { phase: "College", title: "Core Engineering", duration: "4 Years", description: "Complete B.Tech in CSE/IT. Focus on internships and competitive coding.", tips: ["Practice on LeetCode/CodeChef", "Build personal projects"] },
      { phase: "Career", title: "Professional Growth", duration: "Ongoing", description: "Start as a SDE-1 and progress to Senior Engineer, Architect, or Manager.", tips: ["Learn System Design", "Contribute to Open Source"] }
    ],
    proTip: "In the Indian tech market, niche skills like Cloud (AWS/Azure) or AI/ML command 30-50% higher salaries."
  },

  "Data Scientist": {
    title: "Data Scientist",
    category: "Technology",
    categoryIcon: Code2,
    tagline: "Turn raw data into business gold.",
    overview: "Data science combines statistics, programming, and domain expertise to extract insights from data. India is currently the second-largest hub for data science talent.",
    entranceExams: ["JAM (IIT)", "GATE", "ISI Admission Test", "CUET-PG"],
    courses: [
      { name: "B.Tech Data Science & AI", duration: "4 years", type: "UG" },
      { name: "M.Sc Statistics/Data Science", duration: "2 years", type: "PG" },
      { name: "PG Diploma in Data Science", duration: "1 year", type: "Diploma" }
    ],
    topColleges: [
      { name: "ISI Kolkata", location: "Kolkata", rank: "Best for Stats" },
      { name: "IIT Bombay", location: "Mumbai", rank: "Top Research" },
      { name: "IIIT Bangalore", location: "Bangalore", rank: "Industry Focus" }
    ],
    salaryRange: { entry: "₹6L - ₹15L", mid: "₹18L - ₹45L", senior: "₹50L - ₹1.5Cr+" },
    skills: ["Python/R", "Machine Learning", "Statistics", "SQL", "Data Visualization"],
    roadmap: [
      { phase: "Preparation", title: "Maths & Stats", duration: "School", description: "Strong focus on Probability, Linear Algebra, and Calculus.", tips: ["Take Applied Maths in 12th"] },
      { phase: "College", title: "Analytics Degree", duration: "3-4 Years", description: "Degree in Stats, Maths, or CS with a focus on data analysis.", tips: ["Master SQL and Python", "Do Kaggle competitions"] },
      { phase: "Career", title: "Industry Entry", duration: "Ongoing", description: "Entry-level roles like Data Analyst or Junior Scientist.", tips: ["Build a portfolio on GitHub", "Learn Big Data tools (Spark)"] }
    ],
    proTip: "Certifications from platforms like Coursera (DeepLearning.ai) are highly valued by Indian EdTech and Fintech companies."
  },

  /* ── MEDICAL ── */
  "Doctor (MBBS)": {
    title: "Doctor (MBBS)",
    category: "Medical",
    categoryIcon: HeartPulse,
    tagline: "The noble path of healing and service.",
    overview: "A doctor's path in India is rigorous, governed by the NMC. It requires high psychological resilience and a commitment to lifelong learning.",
    entranceExams: ["NEET-UG", "NEET-PG", "INICET", "FMGE (for foreign grads)"],
    courses: [
      { name: "MBBS", duration: "5.5 years", type: "UG" },
      { name: "MD / MS (Specialization)", duration: "3 years", type: "PG" },
      { name: "DM / MCh (Super-specialization)", duration: "3 years", type: "Professional" }
    ],
    topColleges: [
      { name: "AIIMS New Delhi", location: "Delhi", rank: "NIRF #1" },
      { name: "PGI Chandigarh", location: "Chandigarh", rank: "NIRF #2" },
      { name: "CMC Vellore", location: "Vellore", rank: "Top Private" }
    ],
    salaryRange: { entry: "₹8L - ₹15L", mid: "₹20L - ₹50L", senior: "₹60L - ₹2Cr+" },
    skills: ["Medical Diagnosis", "Patient Care", "Surgical Skills", "Empathy", "Research"],
    roadmap: [
      { phase: "Preparation", title: "NEET Coaching", duration: "Class 11-12", description: "Intensive focus on Biology, Physics, and Chemistry.", tips: ["Master NCERT textbooks", "Join a reputed test series"] },
      { phase: "College", title: "MBBS & Internship", duration: "5.5 Years", description: "4.5 years of academics + 1 year of compulsory rotatory internship.", tips: ["Focus on clinical postings", "Prepare for NEXT/NEET-PG early"] },
      { phase: "Service", title: "Specialization", duration: "3 Years", description: "Pursuing MD/MS in a specific field like Surgery, Radiology, or Cardiology.", tips: ["Publish research papers", "Gain hands-on surgical experience"] }
    ],
    proTip: "Post-MBBS, radiology and dermatology are currently the most competitive and highest-paying specializations in India."
  },

  /* ── GOVERNMENT ── */
  "Civil Services (IAS/IPS/IFS)": {
    title: "Civil Services (IAS/IPS/IFS)",
    category: "Government",
    categoryIcon: Landmark,
    tagline: "Represent the nation, serve the people.",
    overview: "UPSC Civil Services is considered India's toughest exam. It recruits officers for the administrative (IAS), police (IPS), and foreign (IFS) services.",
    entranceExams: ["UPSC CSE (Prelims, Mains, Interview)"],
    courses: [
      { name: "Any Graduation Degree", duration: "3-4 years", type: "UG" },
      { name: "Optional Subject Prep", duration: "1 year", type: "Preparation" },
      { name: "Foundation Course (LBSNAA)", duration: "3 months", type: "Training" }
    ],
    topColleges: [
      { name: "LBSNAA", location: "Mussoorie", rank: "IAS Training" },
      { name: "SVPNPA", location: "Hyderabad", rank: "IPS Training" },
      { name: "IGNFA", location: "Dehradun", rank: "IFS Training" }
    ],
    salaryRange: { entry: "₹56,100 (Basic)", mid: "₹1.2L - ₹2L", senior: "₹2.5L (Cabinet Sec)" },
    skills: ["Public Administration", "Policy Making", "Current Affairs", "Leadership", "Decision Making"],
    roadmap: [
      { phase: "College", title: "Foundational Year", duration: "Final Year", description: "Start reading NCERTs and newspapers (The Hindu/Express).", tips: ["Understand the syllabus fully", "Join a mock test group"] },
      { phase: "Preparation", title: "Advanced Study", duration: "1-2 Years", description: "Choose an optional subject and master General Studies.", tips: ["Practice answer writing daily", "Stay consistent with current affairs"] },
      { phase: "Service", title: "Cadre Allocation", duration: "Ongoing", description: "Field postings as SDM/ASP followed by district management.", tips: ["Understand ground realities", "Focus on public welfare"] }
    ],
    proTip: "Consistency beats intensity in UPSC. Don't study 18 hours for a month; study 8 hours for 18 months."
  },

  /* ── FINANCE ── */
  "Chartered Accountant (CA)": {
    title: "Chartered Accountant (CA)",
    category: "Finance",
    categoryIcon: IndianRupee,
    tagline: "The financial backbone of corporate India.",
    overview: "Administered by the ICAI, Chartered Accountancy is a highly respected professional course in India involving auditing, taxation, and financial management.",
    entranceExams: ["CA Foundation", "CA Intermediate", "CA Final"],
    courses: [
      { name: "Foundation Course", duration: "4-6 months", type: "Professional" },
      { name: "Intermediate Course", duration: "8 months", type: "Professional" },
      { name: "Articleship (Practical Training)", duration: "2 years", type: "Training" }
    ],
    topColleges: [
      { name: "SRCC", location: "Delhi", rank: "Best for Commerce" },
      { name: "St. Xavier's", location: "Mumbai", rank: "Top Choice" },
      { name: "LSR", location: "Delhi", rank: "Top Choice" }
    ],
    salaryRange: { entry: "₹8L - ₹15L", mid: "₹18L - ₹40L", senior: "₹50L - ₹5Cr+" },
    skills: ["Financial Accounting", "Auditing", "Taxation", "Strategic Management", "Law"],
    roadmap: [
      { phase: "Foundation", title: "Entry Point", duration: "Post 12th", description: "Clearing the first set of 4 papers on core commerce subjects.", tips: ["Focus on Law and Accounts", "Take mock exams"] },
      { phase: "Training", title: "Intermediate & Articleship", duration: "3 Years", description: "Intensive study + 2 years of mandatory internship under a practicing CA.", tips: ["Balance work and study meticulously", "Learn advanced Excel/SAP"] },
      { phase: "Graduate", title: "CA Final", duration: "Ongoing", description: "The final hurdle of 8 papers before qualifying as a CA.", tips: ["Master Direct & Indirect Taxes", "Join a study circle"] }
    ],
    proTip: "Completing your articleship from a 'Big 4' firm (PwC, Deloitte, EY, KPMG) significantly boosts your starting salary and global prospects."
  }
};
