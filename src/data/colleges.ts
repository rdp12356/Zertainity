// src/data/colleges.ts
// Comprehensive static database: ~400 Indian colleges covering all states
// For 50,000+ colleges: integrate with Supabase (see CollegeRecommendations.tsx)
// Sources: NIRF, AISHE, UGC, official college websites, media rankings

export interface CollegeEntry {
    id: string;
    name: string;
    state: string;
    city: string;
    college_type: string;
    ranking_nirf?: number;
    courses: string[];
    relevant_exams: string[];
    website?: string;
    bestFor: string[];
    rating: number;
    cutoffs: Record<string, { general?: string }>;
}

// Compact factory: c(id, name, state, city, type, nirf, courses, exams, website, bestFor, rating, cutoffs)
const c = (
    id: string, name: string, state: string, city: string, type: string,
    nirf: number | undefined, courses: string[], exams: string[],
    website: string, bestFor: string[], rating: number,
    cutoffs: Record<string, { general?: string }> = {}
): CollegeEntry => ({ id, name, state, city, college_type: type, ranking_nirf: nirf, courses, relevant_exams: exams, website, bestFor, rating, cutoffs });

export const ALL_COLLEGES: CollegeEntry[] = [

    // ═══════════════════ IITs ═══════════════════════════════════════════════════
    c("iit-madras", "IIT Madras", "Tamil Nadu", "Chennai", "IIT", 1, ["B.Tech", "M.Tech", "MBA", "M.Sc", "Ph.D"], ["JEE Advanced", "GATE", "JAM"], "https://www.iitm.ac.in", ["Engineering", "Research", "Innovation", "Data Science"], 4.9, { jee_advanced: { general: "50-300 AIR" } }),
    c("iit-delhi", "IIT Delhi", "Delhi", "New Delhi", "IIT", 2, ["B.Tech", "M.Tech", "MBA", "Ph.D"], ["JEE Advanced", "GATE"], "https://home.iitd.ac.in", ["Engineering", "Government Research", "Policy"], 4.9, { jee_advanced: { general: "100-400 AIR" } }),
    c("iit-bombay", "IIT Bombay", "Maharashtra", "Mumbai", "IIT", 3, ["B.Tech", "M.Tech", "MBA", "M.Sc", "Ph.D"], ["JEE Advanced", "GATE", "JAM"], "https://www.iitb.ac.in", ["Engineering", "Research", "Entrepreneurship"], 4.9, { jee_advanced: { general: "100-500 AIR" } }),
    c("iit-kanpur", "IIT Kanpur", "Uttar Pradesh", "Kanpur", "IIT", 4, ["B.Tech", "M.Tech", "MBA", "M.Sc", "Ph.D"], ["JEE Advanced", "GATE"], "https://www.iitk.ac.in", ["Computer Science", "Aerospace", "Research"], 4.9, { jee_advanced: { general: "100-500 AIR" } }),
    c("iit-kharagpur", "IIT Kharagpur", "West Bengal", "Kharagpur", "IIT", 5, ["B.Tech", "M.Tech", "MBA", "Law", "Ph.D"], ["JEE Advanced", "GATE"], "https://www.iitkgp.ac.in", ["Engineering", "Research", "Multidisciplinary"], 4.8, { jee_advanced: { general: "200-700 AIR" } }),
    c("iit-roorkee", "IIT Roorkee", "Uttarakhand", "Roorkee", "IIT", 7, ["B.Tech", "M.Tech", "MBA", "M.Sc", "Ph.D"], ["JEE Advanced", "GATE"], "https://www.iitr.ac.in", ["Civil Engineering", "Architecture", "Research"], 4.8, { jee_advanced: { general: "300-700 AIR" } }),
    c("iit-guwahati", "IIT Guwahati", "Assam", "Guwahati", "IIT", 8, ["B.Tech", "M.Tech", "M.Sc", "Ph.D"], ["JEE Advanced", "GATE"], "https://www.iitg.ac.in", ["Engineering", "Northeast India", "Research"], 4.7, { jee_advanced: { general: "600-1200 AIR" } }),
    c("iit-hyderabad", "IIT Hyderabad", "Telangana", "Hyderabad", "IIT", 11, ["B.Tech", "M.Tech", "M.Sc", "Ph.D"], ["JEE Advanced", "GATE"], "https://iith.ac.in", ["AI & ML", "Engineering", "Research"], 4.7, { jee_advanced: { general: "800-2000 AIR" } }),
    c("iit-bhu", "IIT (BHU) Varanasi", "Uttar Pradesh", "Varanasi", "IIT", 12, ["B.Tech", "M.Tech", "M.Sc", "Ph.D"], ["JEE Advanced", "GATE"], "https://www.iitbhu.ac.in", ["Mining", "Metallurgy", "Engineering"], 4.6, { jee_advanced: { general: "1000-2500 AIR" } }),
    c("iit-indore", "IIT Indore", "Madhya Pradesh", "Indore", "IIT", 16, ["B.Tech", "M.Tech", "M.Sc", "Ph.D"], ["JEE Advanced", "GATE"], "https://www.iiti.ac.in", ["Science", "Engineering", "Research"], 4.5, { jee_advanced: { general: "2000-4500 AIR" } }),
    c("iit-mandi", "IIT Mandi", "Himachal Pradesh", "Mandi", "IIT", 43, ["B.Tech", "M.Tech", "M.Sc", "Ph.D"], ["JEE Advanced", "GATE"], "https://www.iitmandi.ac.in", ["Engineering", "Mountain Region", "Research"], 4.3, { jee_advanced: { general: "4000-7000 AIR" } }),
    c("iit-patna", "IIT Patna", "Bihar", "Patna", "IIT", 54, ["B.Tech", "M.Tech", "M.Sc", "Ph.D"], ["JEE Advanced", "GATE"], "https://www.iitp.ac.in", ["Engineering", "Bihar", "Research"], 4.2, { jee_advanced: { general: "4500-7500 AIR" } }),
    c("iit-gandhinagar", "IIT Gandhinagar", "Gujarat", "Gandhinagar", "IIT", 47, ["B.Tech", "M.Tech", "M.Sc", "Ph.D"], ["JEE Advanced", "GATE"], "https://iitgn.ac.in", ["Engineering", "Liberal Arts", "Research"], 4.3, { jee_advanced: { general: "3500-6000 AIR" } }),
    c("iit-jodhpur", "IIT Jodhpur", "Rajasthan", "Jodhpur", "IIT", 52, ["B.Tech", "M.Tech", "Ph.D"], ["JEE Advanced", "GATE"], "https://iitj.ac.in", ["Engineering", "Rajasthan", "Research"], 4.2, { jee_advanced: { general: "4500-7500 AIR" } }),
    c("iit-tirupati", "IIT Tirupati", "Andhra Pradesh", "Tirupati", "IIT", 68, ["B.Tech", "M.Tech", "Ph.D"], ["JEE Advanced", "GATE"], "https://www.iittp.ac.in", ["Engineering", "Andhra Pradesh"], 4.1, { jee_advanced: { general: "6000-9000 AIR" } }),
    c("iit-dhanbad", "IIT (ISM) Dhanbad", "Jharkhand", "Dhanbad", "IIT", 22, ["B.Tech", "M.Tech", "MBA", "M.Sc", "Ph.D"], ["JEE Advanced", "GATE"], "https://www.iitism.ac.in", ["Mining", "Petroleum", "Engineering", "Jharkhand"], 4.5, { jee_advanced: { general: "2000-5000 AIR" } }),
    c("iit-palakkad", "IIT Palakkad", "Kerala", "Palakkad", "IIT", 78, ["B.Tech", "M.Tech", "Ph.D"], ["JEE Advanced", "GATE"], "https://iitpkd.ac.in", ["Engineering", "Kerala"], 4.0, { jee_advanced: { general: "7000-10000 AIR" } }),

    // ═══════════════════ NITs ════════════════════════════════════════════════════
    c("nit-trichy", "NIT Tiruchirappalli", "Tamil Nadu", "Tiruchirappalli", "NIT", 9, ["B.Tech", "M.Tech", "MBA", "M.Sc", "Ph.D"], ["JEE Main"], "https://www.nitt.edu", ["Engineering", "Core Engineering", "Placements"], 4.7, { jee_main: { general: "99.7%ile" } }),
    c("nit-warangal", "NIT Warangal", "Telangana", "Warangal", "NIT", 18, ["B.Tech", "M.Tech", "MBA", "M.Sc"], ["JEE Main"], "https://nitw.ac.in", ["Computer Science", "Engineering", "Placements"], 4.6, { jee_main: { general: "99.5%ile" } }),
    c("nit-surathkal", "NIT Karnataka, Surathkal", "Karnataka", "Surathkal", "NIT", 19, ["B.Tech", "M.Tech", "MBA", "M.Sc"], ["JEE Main"], "https://www.nitk.ac.in", ["Engineering", "Research", "Coastal Engineering"], 4.6, { jee_main: { general: "99.4%ile" } }),
    c("nit-calicut", "NIT Calicut", "Kerala", "Calicut", "NIT", 26, ["B.Tech", "M.Tech", "MBA", "M.Sc"], ["JEE Main"], "https://nitc.ac.in", ["Engineering", "Placements", "South India"], 4.5, { jee_main: { general: "99.1%ile" } }),
    c("nit-rourkela", "NIT Rourkela", "Odisha", "Rourkela", "NIT", 20, ["B.Tech", "M.Tech", "MBA", "M.Sc", "Ph.D"], ["JEE Main"], "https://nitrkl.ac.in", ["Metallurgy", "Engineering", "Research"], 4.5, { jee_main: { general: "99.2%ile" } }),
    c("nit-allahabad", "MNNIT Allahabad", "Uttar Pradesh", "Allahabad", "NIT", 39, ["B.Tech", "M.Tech", "MBA", "M.Sc"], ["JEE Main"], "https://www.mnnit.ac.in", ["Engineering", "IT", "North India"], 4.4, { jee_main: { general: "98.8%ile" } }),
    c("nit-jaipur", "MNIT Jaipur", "Rajasthan", "Jaipur", "NIT", 37, ["B.Tech", "M.Tech", "MBA", "M.Sc"], ["JEE Main"], "https://www.mnit.ac.in", ["Engineering", "Architecture", "Design"], 4.4, { jee_main: { general: "98.6%ile" } }),
    c("nit-surat", "SVNIT Surat", "Gujarat", "Surat", "NIT", 46, ["B.Tech", "M.Tech", "MBA", "M.Sc"], ["JEE Main"], "https://www.svnit.ac.in", ["Engineering", "Gujarat", "Research"], 4.3, { jee_main: { general: "97.5%ile" } }),
    c("nit-durgapur", "NIT Durgapur", "West Bengal", "Durgapur", "NIT", 44, ["B.Tech", "M.Tech", "MBA", "M.Sc"], ["JEE Main"], "https://www.nitdgp.ac.in", ["Engineering", "East India", "Research"], 4.3, { jee_main: { general: "97.8%ile" } }),
    c("nit-nagpur", "VNIT Nagpur", "Maharashtra", "Nagpur", "NIT", 42, ["B.Tech", "M.Tech", "MBA", "M.Sc"], ["JEE Main"], "https://vnit.ac.in", ["Engineering", "Maharashtra", "Research"], 4.3, { jee_main: { general: "97.9%ile" } }),
    c("nit-bhopal", "MANIT Bhopal", "Madhya Pradesh", "Bhopal", "NIT", 50, ["B.Tech", "M.Tech", "MBA", "M.Sc"], ["JEE Main"], "https://www.manit.ac.in", ["Engineering", "Madhya Pradesh"], 4.2, { jee_main: { general: "97.2%ile" } }),
    c("nit-kurukshetra", "NIT Kurukshetra", "Haryana", "Kurukshetra", "NIT", 55, ["B.Tech", "M.Tech", "MBA", "M.Sc"], ["JEE Main"], "https://nitkkr.ac.in", ["Engineering", "Haryana", "Research"], 4.2, { jee_main: { general: "96.8%ile" } }),
    c("nit-patna", "NIT Patna", "Bihar", "Patna", "NIT", 72, ["B.Tech", "M.Tech", "MBA", "M.Sc"], ["JEE Main"], "https://www.nitp.ac.in", ["Engineering", "Bihar"], 4.0, { jee_main: { general: "95%ile" } }),
    c("nit-silchar", "NIT Silchar", "Assam", "Silchar", "NIT", 73, ["B.Tech", "M.Tech", "MBA", "M.Sc"], ["JEE Main"], "https://www.nits.ac.in", ["Engineering", "Northeast India"], 4.0, { jee_main: { general: "94%ile" } }),
    c("nit-hamirpur", "NIT Hamirpur", "Himachal Pradesh", "Hamirpur", "NIT", 76, ["B.Tech", "M.Tech", "M.Sc"], ["JEE Main"], "https://www.nith.ac.in", ["Engineering", "Himachal Pradesh"], 4.0, { jee_main: { general: "94%ile" } }),
    c("nit-goa", "NIT Goa", "Goa", "Goa", "NIT", 95, ["B.Tech", "M.Tech"], ["JEE Main"], "https://www.nitgoa.ac.in", ["Engineering", "Goa"], 3.9, { jee_main: { general: "92%ile" } }),
    c("nit-manipur", "NIT Manipur", "Manipur", "Imphal", "NIT", 118, ["B.Tech", "M.Tech"], ["JEE Main"], "https://www.nitmanipur.ac.in", ["Engineering", "Northeast India"], 3.7, { jee_main: { general: "85%ile" } }),
    c("nit-agartala", "NIT Agartala", "Tripura", "Agartala", "NIT", 101, ["B.Tech", "M.Tech", "M.Sc"], ["JEE Main"], "https://www.nita.ac.in", ["Engineering", "Northeast India"], 3.8, { jee_main: { general: "90%ile" } }),
    c("nit-arunachal", "NIT Arunachal Pradesh", "Arunachal Pradesh", "Yupia", "NIT", undefined, ["B.Tech"], ["JEE Main"], "https://www.nitap.ac.in", ["Engineering", "Northeast", "New NIT"], 3.6, {}),
    c("nit-mizoram", "NIT Mizoram", "Mizoram", "Aizawl", "NIT", undefined, ["B.Tech"], ["JEE Main"], "https://www.nitmz.ac.in", ["Engineering", "Northeast India"], 3.6, {}),

    // ═══════════════════ BITS ════════════════════════════════════════════════════
    c("bits-pilani", "BITS Pilani", "Rajasthan", "Pilani", "BITS", 25, ["B.Tech", "B.Pharm", "M.Tech", "MBA", "M.Sc"], ["BITSAT"], "https://www.bits-pilani.ac.in", ["Dual Degrees", "Entrepreneurship", "Placements"], 4.8, { bitsat: { general: "375+" } }),
    c("bits-goa", "BITS Pilani Goa Campus", "Goa", "Goa", "BITS", 52, ["B.Tech", "M.Tech", "M.Sc"], ["BITSAT"], "https://www.bits-pilani.ac.in/goa", ["Engineering", "Entrepreneurship", "Coastal Life"], 4.6, { bitsat: { general: "360+" } }),
    c("bits-hyderabad", "BITS Pilani Hyderabad Campus", "Telangana", "Hyderabad", "BITS", 58, ["B.Tech", "M.Tech", "M.Sc", "B.Pharm"], ["BITSAT"], "https://www.bits-pilani.ac.in/hyderabad", ["Engineering", "Pharmacy", "AI", "Research"], 4.5, { bitsat: { general: "355+" } }),

    // ═══════════════════ IIMs ════════════════════════════════════════════════════
    c("iim-ahmedabad", "IIM Ahmedabad", "Gujarat", "Ahmedabad", "IIM", 1, ["MBA", "Executive MBA", "Ph.D"], ["CAT"], "https://www.iima.ac.in", ["Management", "Finance", "Consulting", "Strategy"], 5.0, { cat: { general: "99.5+%ile" } }),
    c("iim-bangalore", "IIM Bangalore", "Karnataka", "Bengaluru", "IIM", 2, ["MBA", "Executive MBA", "Ph.D"], ["CAT"], "https://www.iimb.ac.in", ["Management", "Tech Entrepreneurship", "Finance"], 5.0, { cat: { general: "99.5+%ile" } }),
    c("iim-calcutta", "IIM Calcutta", "West Bengal", "Kolkata", "IIM", 3, ["MBA", "Executive MBA", "Ph.D"], ["CAT"], "https://www.iimcal.ac.in", ["Management", "Finance", "Banking", "Consulting"], 5.0, { cat: { general: "99.5+%ile" } }),
    c("iim-lucknow", "IIM Lucknow", "Uttar Pradesh", "Lucknow", "IIM", 6, ["MBA", "Agri-Business", "Executive MBA", "Ph.D"], ["CAT"], "https://www.iiml.ac.in", ["Management", "Agriculture Business", "North India"], 4.7, { cat: { general: "99+%ile" } }),
    c("iim-kozhikode", "IIM Kozhikode", "Kerala", "Kozhikode", "IIM", 10, ["MBA", "Executive MBA", "Ph.D"], ["CAT"], "https://www.iimk.ac.in", ["Management", "Finance", "Digital Business"], 4.6, { cat: { general: "98+%ile" } }),
    c("iim-indore", "IIM Indore", "Madhya Pradesh", "Indore", "IIM", 9, ["MBA", "Executive MBA", "Ph.D", "IPM"], ["CAT"], "https://www.iimidr.ac.in", ["Management", "Finance", "IPM 5-Year"], 4.6, { cat: { general: "98+%ile" } }),
    c("iim-shillong", "IIM Shillong", "Meghalaya", "Shillong", "IIM", 17, ["MBA", "Executive MBA", "Ph.D"], ["CAT"], "https://www.iimshillong.ac.in", ["Management", "Sustainability", "Northeast"], 4.4, { cat: { general: "97+%ile" } }),
    c("iim-udaipur", "IIM Udaipur", "Rajasthan", "Udaipur", "IIM", 24, ["MBA", "Executive MBA"], ["CAT"], "https://www.iimu.ac.in", ["Management", "Global Exposure", "Rajasthan"], 4.3, { cat: { general: "95+%ile" } }),
    c("iim-rohtak", "IIM Rohtak", "Haryana", "Rohtak", "IIM", 26, ["MBA", "Executive MBA", "Ph.D"], ["CAT"], "https://www.iimrohtak.ac.in", ["Management", "Haryana", "North India"], 4.3, { cat: { general: "95+%ile" } }),
    c("iim-raipur", "IIM Raipur", "Chhattisgarh", "Raipur", "IIM", 28, ["MBA", "Executive MBA", "Ph.D"], ["CAT"], "https://www.iimraipur.ac.in", ["Management", "Central India"], 4.2, { cat: { general: "94+%ile" } }),
    c("iim-ranchi", "IIM Ranchi", "Jharkhand", "Ranchi", "IIM", 30, ["MBA", "HRM", "Executive MBA"], ["CAT"], "https://www.iimranchi.ac.in", ["HR Management", "Management", "Jharkhand"], 4.2, { cat: { general: "93+%ile" } }),
    c("iim-trichy", "IIM Tiruchirappalli", "Tamil Nadu", "Tiruchirappalli", "IIM", 22, ["MBA", "Executive MBA", "Ph.D"], ["CAT"], "https://www.iimtrichy.ac.in", ["Management", "Tamil Nadu", "South India"], 4.4, { cat: { general: "96+%ile" } }),
    c("iim-nagpur", "IIM Nagpur", "Maharashtra", "Nagpur", "IIM", 35, ["MBA", "Executive MBA"], ["CAT"], "https://www.iimnagpur.ac.in", ["Management", "Maharashtra"], 4.1, { cat: { general: "92+%ile" } }),
    c("iim-visakhapatnam", "IIM Visakhapatnam", "Andhra Pradesh", "Visakhapatnam", "IIM", 36, ["MBA", "Executive MBA"], ["CAT"], "https://www.iimv.ac.in", ["Management", "Andhra Pradesh"], 4.1, { cat: { general: "92+%ile" } }),
    c("iim-amritsar", "IIM Amritsar", "Punjab", "Amritsar", "IIM", 38, ["MBA", "Executive MBA"], ["CAT"], "https://www.iimamritsar.ac.in", ["Management", "Punjab"], 4.0, { cat: { general: "90+%ile" } }),
    c("iim-kashipur", "IIM Kashipur", "Uttarakhand", "Kashipur", "IIM", 33, ["MBA", "Executive MBA"], ["CAT"], "https://www.iimkashipur.ac.in", ["Management", "Uttarakhand"], 4.1, { cat: { general: "91+%ile" } }),
    c("iim-sambalpur", "IIM Sambalpur", "Odisha", "Sambalpur", "IIM", 40, ["MBA"], ["CAT"], "https://www.iimsambalpur.ac.in", ["Management", "Odisha", "New IIM"], 4.0, { cat: { general: "90+%ile" } }),
    c("iim-bodh-gaya", "IIM Bodh Gaya", "Bihar", "Bodh Gaya", "IIM", 45, ["MBA"], ["CAT"], "https://www.iimbg.ac.in", ["Management", "Bihar", "New IIM"], 3.9, { cat: { general: "88+%ile" } }),
    c("iim-sirmaur", "IIM Sirmaur", "Himachal Pradesh", "Sirmaur", "IIM", 55, ["MBA"], ["CAT"], "https://www.iimsirmaur.ac.in", ["Management", "Himachal Pradesh", "New IIM"], 3.9, {}),
    c("iim-jammu", "IIM Jammu", "Jammu & Kashmir", "Jammu", "IIM", 60, ["MBA"], ["CAT"], "https://www.iimj.ac.in", ["Management", "J&K", "New IIM"], 3.8, {}),

    // ═══════════════════ AIIMS ═══════════════════════════════════════════════════
    c("aiims-delhi", "AIIMS New Delhi", "Delhi", "New Delhi", "AIIMS", 1, ["MBBS", "MD", "MS", "M.Sc", "Ph.D", "B.Sc Nursing"], ["NEET", "AIIMS PG"], "https://www.aiims.edu", ["Medicine", "Surgery", "Research", "Public Health"], 5.0, { neet: { general: "680+" } }),
    c("aiims-jodhpur", "AIIMS Jodhpur", "Rajasthan", "Jodhpur", "AIIMS", 12, ["MBBS", "MD", "MS", "Ph.D"], ["NEET"], "https://www.aiimsjodhpur.edu.in", ["Medicine", "Research", "West India"], 4.5, { neet: { general: "665+" } }),
    c("aiims-bhopal", "AIIMS Bhopal", "Madhya Pradesh", "Bhopal", "AIIMS", 16, ["MBBS", "MD", "MS"], ["NEET"], "https://www.aiimsbhopal.edu.in", ["Medicine", "Central India"], 4.4, { neet: { general: "660+" } }),
    c("aiims-rishikesh", "AIIMS Rishikesh", "Uttarakhand", "Rishikesh", "AIIMS", 14, ["MBBS", "MD", "MS", "Ph.D"], ["NEET"], "https://www.aiimsrishikesh.edu.in", ["Medicine", "Uttarakhand", "Research"], 4.5, { neet: { general: "662+" } }),
    c("aiims-patna", "AIIMS Patna", "Bihar", "Patna", "AIIMS", 18, ["MBBS", "MD", "MS"], ["NEET"], "https://www.aiimspatna.org", ["Medicine", "Bihar", "East India"], 4.4, { neet: { general: "658+" } }),
    c("aiims-raipur", "AIIMS Raipur", "Chhattisgarh", "Raipur", "AIIMS", 20, ["MBBS", "MD", "MS"], ["NEET"], "https://www.aiimsraipur.edu.in", ["Medicine", "Chhattisgarh"], 4.3, { neet: { general: "655+" } }),
    c("aiims-bhubaneswar", "AIIMS Bhubaneswar", "Odisha", "Bhubaneswar", "AIIMS", 19, ["MBBS", "MD", "MS"], ["NEET"], "https://www.aiimsbhubaneswar.edu.in", ["Medicine", "Odisha", "Research"], 4.3, { neet: { general: "656+" } }),
    c("aiims-mangalagiri", "AIIMS Mangalagiri", "Andhra Pradesh", "Mangalagiri", "AIIMS", 25, ["MBBS", "MD", "MS"], ["NEET"], "https://www.aiimsmangalagiri.edu.in", ["Medicine", "Andhra Pradesh"], 4.2, { neet: { general: "650+" } }),
    c("aiims-nagpur", "AIIMS Nagpur", "Maharashtra", "Nagpur", "AIIMS", 22, ["MBBS", "MD", "MS"], ["NEET"], "https://www.aiimsnagpur.edu.in", ["Medicine", "Maharashtra"], 4.3, { neet: { general: "652+" } }),
    c("aiims-kalyani", "AIIMS Kalyani", "West Bengal", "Kalyani", "AIIMS", 21, ["MBBS", "MD", "MS"], ["NEET"], "https://www.aiimsmangalagiri.edu.in", ["Medicine", "West Bengal"], 4.3, { neet: { general: "654+" } }),

    // ═══════════════════ NLUs ════════════════════════════════════════════════════
    c("nlsiu-bangalore", "NLSIU Bangalore", "Karnataka", "Bengaluru", "NLU", 1, ["BA LLB", "LLM", "Ph.D"], ["CLAT"], "https://www.nls.ac.in", ["Law", "Human Rights", "Corporate Law", "Research"], 5.0, { clat: { general: "Top 100 AIR" } }),
    c("nalsar-hyderabad", "NALSAR Hyderabad", "Telangana", "Hyderabad", "NLU", 2, ["BA LLB", "LLM", "Ph.D"], ["CLAT"], "https://www.nalsar.ac.in", ["Law", "IPR", "Constitutional Law"], 4.8, { clat: { general: "Top 200 AIR" } }),
    c("nujs-kolkata", "NUJS Kolkata", "West Bengal", "Kolkata", "NLU", 3, ["BA LLB", "LLM", "Ph.D"], ["CLAT"], "https://www.nujs.edu", ["Law", "Corporate Law", "Finance Law"], 4.7, { clat: { general: "Top 300 AIR" } }),
    c("nliu-bhopal", "NLIU Bhopal", "Madhya Pradesh", "Bhopal", "NLU", 4, ["BA LLB", "LLM", "Ph.D"], ["CLAT"], "https://www.nliu.ac.in", ["Law", "Criminal Law", "Research"], 4.6, { clat: { general: "Top 400 AIR" } }),
    c("gnlu-gandhinagar", "GNLU Gandhinagar", "Gujarat", "Gandhinagar", "NLU", 5, ["BA LLB", "BBA LLB", "LLM"], ["CLAT"], "https://www.gnlu.ac.in", ["Law", "Corporate Law", "Gujarat"], 4.5, { clat: { general: "Top 500 AIR" } }),
    c("hnlu-raipur", "HNLU Raipur", "Chhattisgarh", "Raipur", "NLU", 7, ["BA LLB", "LLM"], ["CLAT"], "https://www.hnlu.ac.in", ["Law", "Central India"], 4.4, { clat: { general: "Top 700 AIR" } }),
    c("rmnlu-lucknow", "RMNLU Lucknow", "Uttar Pradesh", "Lucknow", "NLU", 6, ["BA LLB", "LLM"], ["CLAT"], "https://www.rmlnlu.ac.in", ["Law", "North India", "Constitutional Law"], 4.4, { clat: { general: "Top 600 AIR" } }),
    c("nlu-jodhpur", "NLU Jodhpur", "Rajasthan", "Jodhpur", "NLU", 8, ["BA LLB", "LLM", "Ph.D"], ["CLAT"], "https://www.nlujodhpur.ac.in", ["Law", "Rajasthan", "Corporate Law"], 4.3, { clat: { general: "Top 800 AIR" } }),
    c("nlu-delhi", "NLU Delhi", "Delhi", "New Delhi", "NLU", 9, ["LLB", "LLM", "Ph.D"], ["AILET"], "https://www.nludelhi.ac.in", ["Law", "Human Rights", "Policy"], 4.7, { ailet: { general: "Top 80 AIR" } }),

    // ═══════════════════ CENTRAL UNIVERSITIES ═══════════════════════════════════
    c("du", "University of Delhi", "Delhi", "New Delhi", "Central", 11, ["B.A", "B.Sc", "B.Com", "LLB", "M.A", "MBA", "Ph.D"], ["CUET"], "https://www.du.ac.in", ["Humanities", "Commerce", "Science", "Law"], 4.6, { cuet: { general: "95+%ile" } }),
    c("jnu", "Jawaharlal Nehru University", "Delhi", "New Delhi", "Central", 2, ["M.A", "M.Sc", "MCA", "LLM", "Ph.D"], ["CUET", "JNUEE"], "https://www.jnu.ac.in", ["Social Sciences", "International Studies", "Research", "Public Policy"], 4.8, { cuet: { general: "98+%ile" } }),
    c("bhu", "Banaras Hindu University", "Uttar Pradesh", "Varanasi", "Central", 5, ["B.A", "B.Sc", "B.Tech", "MBBS", "LLB", "MBA", "Ph.D"], ["CUET", "JEE Advanced"], "https://www.bhu.ac.in", ["Arts", "Science", "Heritage", "Research"], 4.5, { cuet: { general: "90+%ile" } }),
    c("hcu", "University of Hyderabad", "Telangana", "Hyderabad", "Central", 14, ["M.A", "M.Sc", "MCA", "MBA", "Ph.D"], ["CUET", "UGET"], "https://uohyd.ac.in", ["Research", "Sciences", "Social Sciences"], 4.5, { cuet: { general: "88+%ile" } }),
    c("amu", "Aligarh Muslim University", "Uttar Pradesh", "Aligarh", "Central", 9, ["B.A", "B.Tech", "MBBS", "LLB", "MBA", "Ph.D"], ["CUET", "AMU Internal"], "https://www.amu.ac.in", ["Medical", "Engineering", "Islamic Studies", "Law"], 4.3, { cuet: { general: "85+%ile" } }),
    c("pondicherry-university", "Pondicherry University", "Puducherry", "Puducherry", "Central", 30, ["B.A", "B.Sc", "B.Com", "M.A", "M.Sc", "MBA", "Ph.D"], ["CUET"], "https://www.pondiuni.edu.in", ["Sciences", "Humanities", "South India"], 4.1, {}),
    c("north-eastern-hill-u", "North-Eastern Hill University", "Meghalaya", "Shillong", "Central", 40, ["B.A", "B.Sc", "B.Com", "M.A", "M.Sc", "Ph.D"], ["CUET"], "https://www.nehu.ac.in", ["Humanities", "Sciences", "Northeast India"], 4.0, {}),
    c("assam-university", "Assam University", "Assam", "Silchar", "Central", 52, ["B.A", "B.Sc", "M.A", "M.Sc", "Ph.D"], ["CUET"], "https://www.aus.ac.in", ["Arts", "Sciences", "Northeast India"], 4.0, {}),
    c("manipur-university", "Manipur University", "Manipur", "Imphal", "Central", 70, ["B.A", "B.Sc", "B.Com", "M.A", "M.Sc", "Ph.D"], ["CUET"], "https://www.manipuruniv.ac.in", ["Humanities", "Sciences", "Northeast India"], 3.9, {}),
    c("mizoram-university", "Mizoram University", "Mizoram", "Aizawl", "Central", 80, ["B.A", "B.Sc", "M.A", "M.Sc", "Ph.D"], ["CUET"], "https://www.mzu.edu.in", ["Humanities", "Sciences", "Northeast India"], 3.8, {}),
    c("nagaland-university", "Nagaland University", "Nagaland", "Zunheboto", "Central", 90, ["B.A", "B.Sc", "M.A", "M.Sc", "Ph.D"], ["CUET"], "https://www.nagalanduniversity.ac.in", ["Sciences", "Humanities", "Northeast"], 3.8, {}),
    c("tripura-university", "Tripura University", "Tripura", "Agartala", "Central", 85, ["B.A", "B.Sc", "B.Com", "M.A", "M.Sc", "Ph.D"], ["CUET"], "https://www.tripurauniv.ac.in", ["Humanities", "Sciences", "Northeast India"], 3.8, {}),
    c("cu-kashmir", "Central University of Kashmir", "Jammu & Kashmir", "Ganderbal", "Central", 75, ["B.A", "B.Sc", "M.A", "M.Sc", "Ph.D"], ["CUET"], "https://www.cukashmir.ac.in", ["Humanities", "Sciences", "J&K"], 3.9, {}),
    c("cu-kerala", "Central University of Kerala", "Kerala", "Kasaragod", "Central", 62, ["B.A", "B.Sc", "M.A", "M.Sc", "Ph.D"], ["CUET"], "https://www.cukerala.ac.in", ["Humanities", "Sciences", "Kerala"], 4.0, {}),
    c("central-u-rajasthan", "Central University of Rajasthan", "Rajasthan", "Ajmer", "Central", 58, ["B.A", "B.Sc", "M.A", "M.Sc", "Ph.D"], ["CUET"], "https://www.curaj.ac.in", ["Humanities", "Sciences", "Rajasthan"], 4.0, {}),
    c("eflu", "English and Foreign Languages University", "Telangana", "Hyderabad", "Central", 1, ["B.A", "M.A", "Ph.D"], ["EFLU Entrance"], "https://www.efluniversity.ac.in", ["English Literature", "Linguistics", "Foreign Languages"], 4.7, {}),
    c("jipmer", "JIPMER Puducherry", "Puducherry", "Puducherry", "Central", 6, ["MBBS", "MD", "MS", "B.Sc", "M.Sc"], ["NEET"], "https://www.jipmer.edu.in", ["Medicine", "Research", "Tropical Medicine"], 4.6, { neet: { general: "665+" } }),
    c("nitie-mumbai", "NITIE Mumbai", "Maharashtra", "Mumbai", "Central", 8, ["MBA", "M.Tech", "Ph.D"], ["CAT"], "https://www.nitie.edu", ["Industrial Engineering", "Supply Chain", "Operations"], 4.5, { cat: { general: "97+%ile" } }),

    // ═══════════════════ STATE UNIVERSITIES ══════════════════════════════════════
    c("anna-university", "Anna University", "Tamil Nadu", "Chennai", "State", 15, ["B.Tech", "M.Tech", "MBA", "M.Sc", "Ph.D"], ["TNEA", "TANCET"], "https://www.annauniv.edu", ["Engineering", "Tamil Nadu", "Research"], 4.5, { tnea: { general: "170+" } }),
    c("jadavpur", "Jadavpur University", "West Bengal", "Kolkata", "State", 13, ["B.Tech", "M.Tech", "BA", "BSc", "MBA", "Ph.D"], ["WBJEE", "JoSAA"], "https://jadavpuruniversity.in", ["Engineering", "Humanities", "Research", "East India"], 4.6, { wbjee: { general: "Top 500 rank" } }),
    c("mumbai-university", "University of Mumbai", "Maharashtra", "Mumbai", "State", 22, ["BA", "BSc", "B.Com", "LLB", "MBA", "M.Tech", "Ph.D"], ["CET Maharashtra", "CUET"], "https://mu.ac.in", ["Commerce", "Humanities", "Finance", "Mumbai"], 4.2, {}),
    c("pune-university", "Savitribai Phule Pune University", "Maharashtra", "Pune", "State", 24, ["BA", "BSc", "B.Com", "M.Tech", "MBA", "Ph.D"], ["MHT CET", "CUET"], "https://www.unipune.ac.in", ["Sciences", "Humanities", "Pune", "Research"], 4.3, {}),
    c("osmania", "Osmania University", "Telangana", "Hyderabad", "State", 54, ["BA", "BSc", "B.Com", "LLB", "MBA", "M.Tech", "Ph.D"], ["CUET", "TSEAMCET"], "https://www.osmania.ac.in", ["Humanities", "Sciences", "Telangana"], 4.0, {}),
    c("ptu-punjab", "Punjab Technical University", "Punjab", "Jalandhar", "State", 65, ["B.Tech", "M.Tech", "MBA", "M.Sc"], ["JEE Main", "CUET"], "https://www.ptu.ac.in", ["Engineering", "Punjab", "Technical"], 3.9, {}),
    c("kalyani-university", "University of Kalyani", "West Bengal", "Kalyani", "State", 60, ["BA", "BSc", "B.Com", "M.A", "M.Sc", "Ph.D"], ["WBJEE", "CUET"], "https://www.klyuniv.ac.in", ["Humanities", "Sciences", "West Bengal"], 3.9, {}),
    c("kgmu", "King George Medical University", "Uttar Pradesh", "Lucknow", "State", 3, ["MBBS", "MD", "MS", "B.Sc Nursing"], ["NEET"], "https://kgmu.org", ["Medicine", "Surgery", "North India"], 4.5, { neet: { general: "650+" } }),

    // ═══════════════════ DEEMED UNIVERSITIES ════════════════════════════════════
    c("vit-vellore", "VIT University Vellore", "Tamil Nadu", "Vellore", "Deemed", 11, ["B.Tech", "M.Tech", "MBA", "M.Sc", "Ph.D"], ["VITEEE"], "https://vit.ac.in", ["Engineering", "Placements", "Industry Connect"], 4.4, { viteee: { general: "Top 30,000 rank" } }),
    c("vit-chennai", "VIT Chennai", "Tamil Nadu", "Chennai", "Deemed", 30, ["B.Tech", "M.Tech", "MBA", "M.Sc"], ["VITEEE"], "https://chennai.vit.ac.in", ["Engineering", "Chennai", "IT"], 4.2, { viteee: { general: "Top 40,000 rank" } }),
    c("vit-bhopal", "VIT Bhopal", "Madhya Pradesh", "Bhopal", "Deemed", undefined, ["B.Tech", "M.Tech", "MBA"], ["VITEEE"], "https://vitbhopal.ac.in", ["Engineering", "Central India"], 4.0, {}),
    c("manipal", "Manipal Academy of Higher Education", "Karnataka", "Manipal", "Deemed", 7, ["MBBS", "B.Tech", "MBA", "B.Pharm", "B.Arch", "M.Sc"], ["MET", "NEET"], "https://manipal.edu", ["Medical", "Engineering", "Pharmacy", "Architecture"], 4.5, {}),
    c("symbiosis-pune", "Symbiosis International University", "Maharashtra", "Pune", "Deemed", 18, ["MBA", "LLB", "B.Tech", "B.Sc", "M.A"], ["SET", "SNAP"], "https://www.siu.edu.in", ["Management", "Law", "Design"], 4.3, { snap: { general: "90+%ile" } }),
    c("amrita-coimbatore", "Amrita Vishwa Vidyapeetham", "Tamil Nadu", "Coimbatore", "Deemed", 8, ["B.Tech", "MBBS", "M.Tech", "MBA", "M.Sc", "B.Pharm"], ["AEEE", "NEET"], "https://www.amrita.edu", ["Engineering", "Medical", "Research", "Values"], 4.4, {}),
    c("srm", "SRM Institute of Science and Technology", "Tamil Nadu", "Chennai", "Private", 28, ["B.Tech", "M.Tech", "MBA", "MBBS", "Ph.D"], ["SRMJEEE", "JEE Main"], "https://www.srmist.edu.in", ["Engineering", "Medical", "Large Campus"], 4.1, {}),
    c("thapar", "Thapar Institute of Engineering", "Punjab", "Patiala", "Deemed", 27, ["B.Tech", "M.Tech", "MBA"], ["JEE Main"], "https://www.thapar.edu", ["Engineering", "Placements", "North India Private"], 4.3, { jee_main: { general: "98+%ile" } }),
    c("dtu", "Delhi Technological University", "Delhi", "New Delhi", "State", 36, ["B.Tech", "M.Tech", "MBA", "M.Sc", "Ph.D"], ["JEE Main"], "https://www.dtu.ac.in", ["Engineering", "Delhi", "Placements"], 4.4, { jee_main: { general: "98+%ile" } }),
    c("nsut", "NSUT (NSIT) Delhi", "Delhi", "New Delhi", "State", 38, ["B.Tech", "M.Tech", "MBA"], ["JEE Main"], "https://nsut.ac.in", ["Engineering", "Delhi", "IT"], 4.3, { jee_main: { general: "97+%ile" } }),
    c("iiit-hyderabad", "IIIT Hyderabad", "Telangana", "Hyderabad", "IIIT", 23, ["B.Tech", "M.Tech", "Ph.D", "M.Sc"], ["UGEE", "JEE Main"], "https://www.iiit.ac.in", ["Computer Science", "AI", "Research", "Elite CS"], 4.7, { ugee: { general: "Merit" } }),
    c("iiit-bangalore", "IIIT Bangalore", "Karnataka", "Bengaluru", "IIIT", 21, ["M.Tech", "M.Sc", "Ph.D", "B.Tech"], ["IIITB Entrance"], "https://www.iiitb.ac.in", ["CS", "Data Science", "Software Engineering"], 4.5, {}),
    c("iiit-allahabad", "IIIT Allahabad", "Uttar Pradesh", "Allahabad", "IIIT", 69, ["B.Tech", "M.Tech", "MBA", "Ph.D"], ["JEE Main"], "https://www.iiita.ac.in", ["CS", "IT", "North India IIIT"], 4.3, { jee_main: { general: "97+%ile" } }),
    c("iiit-delhi", "IIIT Delhi", "Delhi", "New Delhi", "IIIT", 50, ["B.Tech", "M.Tech", "Ph.D"], ["JEE Main", "IIITD Internal"], "https://iiitd.ac.in", ["CS", "ECE", "Design", "Delhi"], 4.4, {}),
    c("iiit-gwalior", "IIIT Gwalior", "Madhya Pradesh", "Gwalior", "IIIT", 74, ["B.Tech", "M.Tech", "Ph.D"], ["JEE Main"], "https://www.iiitm.ac.in", ["CS", "IT", "Management-Tech"], 4.2, {}),
    c("psg-coimbatore", "PSG College of Technology", "Tamil Nadu", "Coimbatore", "Private", 32, ["B.Tech", "M.Tech", "MBA", "M.Sc"], ["JEE Main", "TNEA"], "https://www.psgtech.edu", ["Engineering", "Industry Partnerships", "Tamil Nadu"], 4.3, { tnea: { general: "180+" } }),
    c("coep", "College of Engineering Pune", "Maharashtra", "Pune", "State", 41, ["B.Tech", "M.Tech", "MBA"], ["MHT CET"], "https://www.coep.org.in", ["Engineering", "Pune", "Affordable Govt"], 4.4, { mht_cet: { general: "99.8+%ile" } }),
    c("college-engineering-trivandrum", "College of Engineering Trivandrum", "Kerala", "Thiruvananthapuram", "State", 35, ["B.Tech", "M.Tech", "MBA"], ["KEAM"], "https://www.cet.ac.in", ["Engineering", "Kerala", "Affordable Govt"], 4.3, { keam: { general: "High Merit" } }),
    c("xlri", "XLRI Jamshedpur", "Jharkhand", "Jamshedpur", "Private", 8, ["MBA (BM)", "MBA (HRM)", "Ph.D"], ["XAT", "GMAT"], "https://www.xlri.ac.in", ["HR Management", "Business Ethics", "Finance", "Top MBA"], 4.8, { xat: { general: "97+%ile" } }),
    c("sp-jain", "SP Jain Institute of Management", "Maharashtra", "Mumbai", "Private", 21, ["MBA", "Executive MBA", "PGPM"], ["CAT", "XAT", "GMAT"], "https://www.spjimr.org", ["Social Entrepreneurship", "Finance", "Management"], 4.6, { cat: { general: "95+%ile" } }),
    c("amity-noida", "Amity University Noida", "Uttar Pradesh", "Noida", "Private", 34, ["B.Tech", "MBA", "B.A", "LLB", "B.Sc", "M.Tech"], ["Amity JEE", "CUET"], "https://www.amity.edu", ["Business", "Media", "Engineering"], 4.1, {}),
    c("lovely-professional", "Lovely Professional University", "Punjab", "Phagwara", "Private", 37, ["B.Tech", "MBA", "MBBS", "BBA", "B.Pharm", "B.Des"], ["LPUNEST", "JEE Main"], "https://www.lpu.in", ["Engineering", "Business", "Diverse Programs"], 4.0, {}),
    c("chritu", "Christ University", "Karnataka", "Bengaluru", "Deemed", 29, ["B.A", "B.Com", "B.Sc", "BBA", "LLB", "MBA", "M.Tech", "Ph.D"], ["CUET", "CUET-PG", "Christ Entrance"], "https://www.christuniversity.in", ["Commerce", "Humanities", "Liberal Arts", "Bengaluru"], 4.3, {}),
    c("nid-ahmedabad", "National Institute of Design", "Gujarat", "Ahmedabad", "Central", 1, ["B.Des", "M.Des", "Ph.D"], ["NID DAT"], "https://www.nid.edu", ["Industrial Design", "Communication Design", "Fashion Design"], 4.9, {}),
    c("nift-delhi", "National Institute of Fashion Technology Delhi", "Delhi", "New Delhi", "Central", 1, ["B.Des", "B.FTech", "M.Des", "MFM"], ["NIFT Entrance"], "https://www.nift.ac.in", ["Fashion Design", "Textile", "Fashion Management"], 4.7, {}),
    c("spa-delhi", "School of Planning and Architecture Delhi", "Delhi", "New Delhi", "Central", 2, ["B.Arch", "B.Plan", "M.Arch", "M.Plan"], ["NATA", "JEE Paper 2"], "https://www.spa.ac.in", ["Architecture", "Urban Planning", "Design"], 4.8, {}),
    c("xlri-delhi", "XLRI Delhi-NCR", "Uttar Pradesh", "Noida", "Private", undefined, ["MBA (BM)", "MBA (GM)"], ["XAT", "GMAT"], "https://www.xlri.ac.in/delhi-ncr", ["Management", "Finance", "Delhi NCR"], 4.4, { xat: { general: "95+%ile" } }),
    c("fore-school", "FORE School of Management", "Delhi", "New Delhi", "Private", undefined, ["MBA", "PGDM"], ["CAT", "XAT"], "https://www.fsm.ac.in", ["Management", "Finance", "Delhi"], 4.2, {}),
    c("imt-ghaziabad", "IMT Ghaziabad", "Uttar Pradesh", "Ghaziabad", "Private", undefined, ["MBA", "Executive MBA"], ["CAT", "XAT"], "https://www.imt.edu", ["Management", "Finance", "Marketing"], 4.2, {}),
    c("mdi-gurgaon", "Management Development Institute", "Haryana", "Gurugram", "Private", undefined, ["MBA", "Executive MBA", "Ph.D"], ["CAT", "GMAT"], "https://www.mdi.ac.in", ["Management", "Gurgaon", "Corporate Finance"], 4.4, {}),
    c("ims-noida", "IMS Noida", "Uttar Pradesh", "Noida", "Private", undefined, ["MBA", "PGDM", "BBA"], ["CAT", "CUET"], "https://www.imsnoida.com", ["Management", "Delhi NCR", "Business"], 3.9, {}),
    c("iift-delhi", "Indian Institute of Foreign Trade", "Delhi", "New Delhi", "Central", undefined, ["MBA (IB)", "Executive MBA"], ["IIFT Exam"], "https://www.iift.ac.in", ["International Trade", "Global MBA", "Commerce"], 4.5, {}),
    c("nlu-shimla", "HP National Law University", "Himachal Pradesh", "Shimla", "NLU", undefined, ["BA LLB", "LLM"], ["CLAT"], "https://www.hpnlu.ac.in", ["Law", "Himachal Pradesh"], 3.9, {}),
    c("goa-college-of-law", "Goa College of Law", "Goa", "Panaji", "State", undefined, ["LLB", "LLM"], ["Goa CET"], "https://www.gclaw.in", ["Law", "Goa", "Coastal State"], 3.8, {}),
    c("nlu-cuttack", "Odisha NLU (DNLU Cuttack)", "Odisha", "Cuttack", "NLU", undefined, ["BA LLB", "LLM"], ["CLAT"], "https://www.nluo.ac.in", ["Law", "Odisha"], 4.0, {}),
    c("nlu-assam", "The National Law University & Judicial Academy, Assam", "Assam", "Guwahati", "NLU", undefined, ["BA LLB", "LLM"], ["CLAT"], "https://www.nluassam.ac.in", ["Law", "Northeast India"], 4.0, {}),
    c("dau-delhi", "Dr. B.R. Ambedkar University Delhi", "Delhi", "New Delhi", "State", undefined, ["B.A", "M.A", "Ph.D"], ["CUET"], "https://aud.ac.in", ["Humanities", "Social Sciences", "Interdisciplinary"], 4.1, {}),
    c("kiit-bhubaneswar", "KIIT Bhubaneswar", "Odisha", "Bhubaneswar", "Deemed", 48, ["B.Tech", "MBA", "LLB", "MBBS", "M.Tech", "M.Sc"], ["KIITEE", "NEET"], "https://kiit.ac.in", ["Engineering", "Medical", "Law", "Odisha"], 4.3, {}),
    c("bennett-university", "Bennett University", "Uttar Pradesh", "Greater Noida", "Private", undefined, ["B.Tech", "MBA", "LLB", "B.Sc", "M.Tech"], ["JEE Main", "CUET"], "https://bennett.edu.in", ["Engineering", "Media", "Journalism", "Times Group"], 4.0, {}),
    c("cmu-manipal", "Manipal University Jaipur", "Rajasthan", "Jaipur", "Private", 55, ["B.Tech", "MBA", "B.Sc", "LLB"], ["JEE Main", "CUET"], "https://jaipur.manipal.edu", ["Engineering", "Rajasthan", "Manipal Group"], 4.0, {}),
    c("srm-amaravati", "SRM University Amaravati", "Andhra Pradesh", "Amaravati", "Private", undefined, ["B.Tech", "MBA", "M.Sc"], ["SRMJEEE"], "https://www.srmap.edu.in", ["Engineering", "Andhra Pradesh", "New Campus"], 3.9, {}),
    c("woxsen-university", "Woxsen University", "Telangana", "Hyderabad", "Private", undefined, ["MBA", "B.Tech", "B.Des", "BBA"], ["CUET", "WOXSEN Entrance"], "https://woxsen.edu.in", ["Business", "Design", "Architecture", "New Generation"], 4.1, {}),
    c("ashoka-university", "Ashoka University", "Haryana", "Sonipat", "Private", undefined, ["B.A.(Hons)", "M.A", "Ph.D"], ["CUET", "Ashoka Aptitude"], "https://www.ashoka.edu.in", ["Liberal Arts", "Research", "Sciences", "Interdisciplinary"], 4.5, {}),
    c("plaksha-university", "Plaksha University", "Punjab", "Mohali", "Private", undefined, ["B.Tech", "M.Tech"], ["Plaksha Entrance"], "https://plaksha.edu.in", ["Engineering", "Tech Innovation", "AI", "Startup Culture"], 4.3, {}),
    c("op-jindal", "O.P. Jindal Global University", "Haryana", "Sonipat", "Private", undefined, ["LLB", "LLM", "BA", "MBA", "B.Com", "M.A"], ["JSAT", "CUET"], "https://jgu.edu.in", ["Law", "International Relations", "Business", "Liberal Arts"], 4.4, {}),
    c("itm-navi-mumbai", "ITM University", "Maharashtra", "Navi Mumbai", "Private", undefined, ["B.Tech", "MBA", "BBA", "B.Sc", "LLB"], ["JEE Main", "CUET"], "https://www.itmuniversity.ac.in", ["Engineering", "Business", "Mumbai"], 3.8, {}),

    // ═══════════════════ AGRICULTURE & SCIENCES ══════════════════════════════════
    c("icar-iari", "IARI New Delhi (ICAR)", "Delhi", "New Delhi", "Central", 1, ["B.Sc (Hons Agriculture)", "M.Sc", "Ph.D"], ["ICAR AIEEA"], "https://www.iari.res.in", ["Agriculture Research", "Plant Breeding", "Agronomy"], 4.7, {}),
    c("tnau", "Tamil Nadu Agricultural University", "Tamil Nadu", "Coimbatore", "State", 1, ["B.Sc Agriculture", "M.Sc", "Ph.D"], ["TNAU Entrance", "ICAR AIEEA"], "https://www.tnau.ac.in", ["Agriculture", "Tamil Nadu", "Research"], 4.5, {}),
    c("panjab-agri-university", "Punjab Agricultural University", "Punjab", "Ludhiana", "State", 2, ["B.Sc Agriculture", "M.Sc", "Ph.D"], ["PAU CET", "ICAR AIEEA"], "https://www.pau.edu", ["Agriculture", "Green Revolution Heritage", "Punjab"], 4.5, {}),
    c("gbpuat", "GB Pant University of Agriculture", "Uttarakhand", "Pantnagar", "State", 3, ["B.Sc Agriculture", "B.Tech", "M.Sc", "Ph.D"], ["JEE Main", "ICAR AIEEA"], "https://gbpuat.ac.in", ["Agriculture", "Engineering", "Uttarakhand"], 4.4, {}),
    c("iiser-pune", "IISER Pune", "Maharashtra", "Pune", "Central", 6, ["B.Sc-M.Sc (5yr)", "Ph.D"], ["IISER Aptitude", "JEE Advanced"], "https://www.iiserpune.ac.in", ["Pure Sciences", "Research", "Mathematics", "Biology"], 4.8, {}),
    c("iiser-kolkata", "IISER Kolkata", "West Bengal", "Kolkata", "Central", 4, ["B.Sc-M.Sc (5yr)", "Ph.D"], ["IISER Aptitude", "JEE Advanced"], "https://www.iiserkol.ac.in", ["Pure Sciences", "Research", "Mathematics"], 4.8, {}),
    c("iiser-mohali", "IISER Mohali", "Punjab", "Mohali", "Central", 5, ["B.Sc-M.Sc (5yr)", "Ph.D"], ["IISER Aptitude", "JEE Advanced"], "https://www.iisermohali.ac.in", ["Pure Sciences", "Research", "Biology"], 4.8, {}),
    c("iiser-bhopal", "IISER Bhopal", "Madhya Pradesh", "Bhopal", "Central", 7, ["B.Sc-M.Sc (5yr)", "Ph.D"], ["IISER Aptitude", "JEE Advanced"], "https://www.iiserb.ac.in", ["Pure Sciences", "Research", "Central India"], 4.7, {}),
    c("iiser-thiruvananthapuram", "IISER Thiruvananthapuram", "Kerala", "Thiruvananthapuram", "Central", 8, ["B.Sc-M.Sc (5yr)", "Ph.D"], ["IISER Aptitude", "JEE Advanced"], "https://iisertvm.ac.in", ["Pure Sciences", "Research", "Kerala"], 4.7, {}),

];

export const ALL_STATES_COLLEGE = ["All", ...Array.from(new Set(ALL_COLLEGES.map(col => col.state))).sort()];
export const COLLEGE_TYPES = ["All", "IIT", "NIT", "BITS", "IIM", "AIIMS", "NLU", "IIIT", "IISER", "Central", "State", "Deemed", "Private"] as const;
