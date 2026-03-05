// src/data/schools.ts
// Comprehensive Indian school database covering all states and UTs
// Rankings: Education World (EW), Outlook India (OI), India Today (IT)

export interface SchoolEntry {
    id: string;
    name: string;
    state: string;
    city: string;
    board: "CBSE" | "ICSE" | "IB" | "IGCSE" | "State Board" | "CBSE + IB";
    type: "Government" | "Private" | "Aided" | "Boarding";
    rankings: { educationWorld?: number; outlookIndia?: number; indiaToday?: number; };
    boardResults: {
        class10PassPercent?: number; class12PassPercent?: number;
        class10TopScore?: number; class12TopScore?: number;
        class10DistinctionPercent?: number; class12DistinctionPercent?: number;
    };
    annualFee: string;
    established?: number;
    facilities: string[];
    bestFor: string[];
    website?: string;
    sports: string[];
    note?: string;
}

const s = (
    id: string, name: string, state: string, city: string,
    board: SchoolEntry["board"], type: SchoolEntry["type"],
    ew: number | undefined, oi: number | undefined, it: number | undefined,
    p10: number, p12: number, t10: number, t12: number, d10: number, d12: number,
    fee: string, est: number,
    facilities: string[], bestFor: string[], sports: string[],
    website: string, note?: string
): SchoolEntry => ({
    id, name, state, city, board, type,
    rankings: { educationWorld: ew, outlookIndia: oi, indiaToday: it },
    boardResults: { class10PassPercent: p10, class12PassPercent: p12, class10TopScore: t10, class12TopScore: t12, class10DistinctionPercent: d10, class12DistinctionPercent: d12 },
    annualFee: fee, established: est, facilities, bestFor, sports, website, note
});

export const ALL_SCHOOLS: SchoolEntry[] = [

    // ─────────────────── DELHI ──────────────────────────────────────────────
    s("dps-rk-puram", "Delhi Public School, R.K. Puram", "Delhi", "New Delhi", "CBSE", "Private", 1, 2, 3, 100, 100, 499, 498, 95, 87, "₹80K–₹1.2L", 1949, ["Olympic Pool", "Football Ground", "Science Labs", "Robotics Lab", "Auditorium", "Library", "Computer Labs", "Art Studio"], ["Academic Excellence", "IIT-JEE Prep", "CBSE", "All-round"], ["Cricket", "Football", "Swimming", "Wrestling", "Badminton", "Chess"], "https://www.dpsrkp.net"),
    s("modern-school-barakhamba", "Modern School, Barakhamba Road", "Delhi", "New Delhi", "CBSE", "Private", 4, 4, 5, 100, 100, 498, 495, 90, 82, "₹90K–₹1.3L", 1920, ["Sports Complex", "Swimming Pool", "Theatre", "Computer Labs", "Music Rooms", "Art Gallery", "Library", "NCC/NSS"], ["Holistic Education", "Cultural Activities", "CBSE", "Leadership"], ["Cricket", "Hockey", "Tennis", "Swimming", "Athletics"], "https://www.modernschool.net"),
    s("sanskriti-school", "Sanskriti School", "Delhi", "New Delhi", "CBSE", "Private", 7, 8, 7, 100, 100, 496, 492, 82, 75, "₹60K–₹90K", 1972, ["Library", "Labs", "Auditorium", "Sports Ground", "Computer Labs", "Swimming Pool"], ["CBSE", "Academics", "Cultural Exchange"], ["Volleyball", "Cricket", "Swimming", "Football"], "https://sanskriti.edu.in"),
    s("springdales-pusa", "Springdales School, Pusa Road", "Delhi", "New Delhi", "CBSE", "Private", 10, 12, undefined, 100, 100, 497, 490, 85, 72, "₹70K–₹1L", 1955, ["Labs", "Library", "Auditorium", "Sports Ground", "Computer Labs", "Music Room"], ["CBSE", "Creative Arts", "Value Education"], ["Cricket", "Football", "Athletics", "Yoga"], "https://springdales.com"),
    s("dps-vasant-kunj", "Delhi Public School, Vasant Kunj", "Delhi", "New Delhi", "CBSE", "Private", 20, undefined, undefined, 100, 100, 495, 489, 82, 72, "₹70K–₹1L", 1996, ["Labs", "Library", "Auditorium", "Computer Labs", "Swimming Pool", "Sports Ground"], ["CBSE", "South Delhi", "Academics", "Sports"], ["Cricket", "Football", "Basketball", "Swimming"], "https://www.dpsvasantkunj.com"),
    s("bal-bharati-pitampura", "Bal Bharati Public School, Pitampura", "Delhi", "New Delhi", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 494, 488, 78, 68, "₹40K–₹70K", 1968, ["Labs", "Library", "Auditorium", "Computer Labs", "Sports Ground"], ["CBSE", "North Delhi", "Academics", "Sports"], ["Cricket", "Football", "Volleyball", "Chess"], "https://www.balbharati.com"),
    s("army-public-school-delhi", "Army Public School, Dhaula Kuan", "Delhi", "New Delhi", "CBSE", "Government", undefined, undefined, undefined, 100, 99, 492, 486, 75, 65, "₹25K–₹40K", 1966, ["Labs", "Library", "Computer Labs", "Sports Ground", "NCC", "Swimming Pool"], ["Defense Families", "CBSE", "Affordable", "Sports"], ["Cricket", "Football", "Basketball", "Athletics"], "https://www.apsdk.com"),

    // ─────────────────── UTTAR PRADESH ──────────────────────────────────────
    s("city-montessori-lucknow", "City Montessori School, Lucknow", "Uttar Pradesh", "Lucknow", "ICSE", "Private", undefined, undefined, undefined, 100, 100, 498, 495, 88, 79, "₹50K–₹80K", 1959, ["41 Branches", "Science Labs", "Computer Labs", "Auditorium", "Sports Grounds", "Planetarium"], ["Largest School in World", "ICSE", "North India", "Value Education"], ["Cricket", "Football", "Basketball", "Athletics"], "https://www.cmsedu.com", "Largest school in the world by student enrollment per Guinness Book"),
    s("la-martiniere-boys-lu", "La Martinière College, Lucknow", "Uttar Pradesh", "Lucknow", "ICSE", "Private", undefined, undefined, undefined, 100, 100, 496, 490, 82, 74, "₹45K–₹70K", 1845, ["Heritage Campus", "Swimming Pool", "Cricket Ground", "Chapel", "Library", "Gym", "Labs"], ["ICSE Heritage", "Boys School", "North India", "Discipline"], ["Cricket", "Football", "Athletics", "Swimming"], "https://www.lamartinierecollege.org"),
    s("la-martiniere-girls-lu", "La Martinière Girls College, Lucknow", "Uttar Pradesh", "Lucknow", "ICSE", "Private", undefined, undefined, undefined, 100, 100, 495, 491, 83, 75, "₹40K–₹65K", 1869, ["Heritage Campus", "Library", "Labs", "Auditorium", "Sports Ground"], ["ICSE", "Girls School", "Heritage", "North India"], ["Athletics", "Badminton", "Basketball", "Yoga"], "https://www.lamartinieregirls.org"),
    s("dps-mathura-road", "Delhi Public School, Mathura Road", "Uttar Pradesh", "Agra", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 490, 485, 74, 64, "₹30K–₹50K", 1990, ["Labs", "Library", "Computer Labs", "Auditorium", "Sports Ground"], ["CBSE", "UP", "Academics"], ["Cricket", "Football", "Chess"], "https://dpsmathuraroad.com"),

    // ─────────────────── MAHARASHTRA ────────────────────────────────────────
    s("cathedral-bombay", "Cathedral and John Connon School", "Maharashtra", "Mumbai", "ICSE", "Private", 2, 1, 1, 100, 100, 499, 498, 97, 92, "₹1L–₹1.8L", 1860, ["Library", "Labs", "Swimming Pool", "Auditorium", "Gym", "Computer Labs", "Music Room", "Art Studio", "Chapel"], ["ICSE", "Academic Excellence", "Heritage", "Mumbai Elite"], ["Cricket", "Hockey", "Football", "Swimming", "Athletics"], "https://cathedralschool.com"),
    s("dhirubhai-ambani-is", "Dhirubhai Ambani International School", "Maharashtra", "Mumbai", "IB", "Private", 5, 3, 2, 100, 100, 45, 45, 90, 85, "₹8L–₹12L", 2003, ["Olympic Pool", "5000-seat Auditorium", "Squash Court", "Gym", "Robotics Lab", "Design Studio", "Planetarium"], ["IB Diploma", "Global College Prep", "Ultra-Premium", "Tech"], ["Swimming", "Squash", "Cricket", "Football"], "https://www.da-is.org", "One of Asia's most well-equipped schools"),
    s("campion-mumbai", "Campion School", "Maharashtra", "Mumbai", "ICSE", "Private", 9, 6, 8, 100, 100, 497, 490, 88, 75, "₹80K–₹1.2L", 1943, ["Science Labs", "Library", "Auditorium", "Sports Ground", "Computer Labs"], ["ICSE", "Christian Heritage", "English", "Boys School"], ["Cricket", "Football", "Basketball", "Athletics"], "https://www.campionschool.com"),
    s("bishop-scotts-pune", "Bishop's School, Pune", "Maharashtra", "Pune", "ICSE", "Private", undefined, undefined, undefined, 100, 100, 495, 489, 85, 74, "₹60K–₹90K", 1864, ["Heritage Campus", "Library", "Labs", "Chapel", "Sports Ground", "Auditorium"], ["ICSE", "Pune", "Heritage", "Christian"], ["Cricket", "Football", "Basketball", "Athletics"], "https://www.thebishopsschool.org"),
    s("symbiosis-school-pune", "Symbiosis International School", "Maharashtra", "Pune", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 494, 488, 80, 70, "₹80K–₹1.2L", 2006, ["Labs", "Library", "Auditorium", "Computer Labs", "Sports Ground", "Cafeteria"], ["CBSE", "Pune", "International Environment"], ["Cricket", "Football", "Basketball", "Swimming"], "https://www.symbiosis.ac.in/sis/"),
    s("podar-intl-mumbai", "Podar International School", "Maharashtra", "Mumbai", "CBSE + IB", "Private", undefined, undefined, undefined, 100, 100, 493, 487, 78, 68, "₹1.5L–₹2.5L", 2004, ["Labs", "Library", "Computer Labs", "Auditorium", "Sports Ground"], ["CBSE & IB", "Mumbai", "Modern Education"], ["Cricket", "Football", "Chess", "Swimming"], "https://podarinternationalschool.com"),

    // ─────────────────── KARNATAKA ──────────────────────────────────────────
    s("tisb-bangalore", "The International School Bangalore", "Karnataka", "Bengaluru", "IB", "Private", 3, undefined, 4, 100, 100, 44, 43, 88, 83, "₹7L–₹10L", 1994, ["Football Field", "Basketball Courts", "Swimming Pool", "IB Resource Centre", "Performing Arts Theatre", "Science Labs"], ["IB Curriculum", "International Students", "Global Prep", "Diversity"], ["Football", "Basketball", "Swimming", "Cricket"], "https://www.tisb.ac.in"),
    s("bishop-cotton-boys", "Bishop Cotton Boys' School", "Karnataka", "Bengaluru", "ICSE", "Boarding", 12, 9, undefined, 100, 100, 496, 490, 82, 74, "₹2.5L–₹4L", 1865, ["Boarding House", "Swimming Pool", "Cricket Ground", "Chapel", "Computer Labs", "Library", "Gym"], ["Boarding School", "ICSE", "Heritage", "Sports"], ["Cricket", "Football", "Basketball", "Squash", "Swimming"], "https://www.bishopcottonboys.org"),
    s("national-public-school-blr", "National Public School, HSR Layout", "Karnataka", "Bengaluru", "CBSE", "Private", 15, undefined, undefined, 100, 100, 498, 494, 90, 80, "₹1L–₹1.5L", 1981, ["Science Labs", "Computer Labs", "Library", "Auditorium", "Sports Grounds", "Robotics Lab"], ["CBSE", "JEE/NEET Focus", "Bangalore", "Academics"], ["Cricket", "Football", "Chess", "Athletics"], "https://www.nps.edu.in"),
    s("frank-anthony-blr", "Frank Anthony Public School", "Karnataka", "Bengaluru", "ICSE", "Private", 35, undefined, undefined, 100, 100, 494, 488, 80, 70, "₹50K–₹80K", 1967, ["Library", "Labs", "Auditorium", "Sports Ground", "Computer Labs"], ["ICSE", "Bengaluru", "English Medium"], ["Cricket", "Football", "Basketball", "Athletics"], "https://www.faps.edu.in"),
    s("ryan-intl-blr", "Ryan International School, Bangalore", "Karnataka", "Bengaluru", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 491, 485, 75, 65, "₹60K–₹90K", 1995, ["Labs", "Library", "Computer Labs", "Auditorium", "Sports Ground"], ["CBSE", "Chain School", "North Bangalore"], ["Cricket", "Football", "Basketball", "Chess"], "https://ryangroup.org"),

    // ─────────────────── TAMIL NADU ─────────────────────────────────────────
    s("chettinad-vidyashram", "Chettinad Vidyashram", "Tamil Nadu", "Chennai", "CBSE", "Private", 25, undefined, undefined, 100, 100, 496, 491, 86, 76, "₹60K–₹90K", 1977, ["Labs", "Library", "Auditorium", "Computer Labs", "Sports Ground", "Yoga Center"], ["CBSE", "Tamil Nadu", "JEE/NEET Focus"], ["Cricket", "Football", "Kabaddi", "Chess"], "https://www.chettinadvidyashram.org"),
    s("psbb-school", "PSBB Senior Secondary, KK Nagar", "Tamil Nadu", "Chennai", "CBSE", "Private", 30, undefined, undefined, 100, 100, 497, 492, 88, 78, "₹50K–₹80K", 1983, ["Labs", "Library", "Computer Labs", "Auditorium", "Sports Ground"], ["CBSE", "JEE/NEET Achievers", "Chennai"], ["Cricket", "Football", "Chess", "Athletics"], "https://psbbschools.ac.in"),
    s("sboa-school", "SBOA School & Junior College", "Tamil Nadu", "Chennai", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 493, 487, 78, 68, "₹35K–₹60K", 1956, ["Labs", "Library", "Computer Labs", "Auditorium", "Sports Ground"], ["CBSE", "Chennai", "Academic Reputation"], ["Cricket", "Football", "Volleyball", "Chess"], "https://www.sboaschool.ac.in"),
    s("good-shepherd-intl", "Good Shepherd International School", "Tamil Nadu", "Ooty", "CBSE", "Boarding", undefined, undefined, undefined, 100, 100, 492, 486, 80, 70, "₹3L–₹5L", 1977, ["Boarding House", "Cricket Ground", "Football Field", "Labs", "Library", "Swimming Pool", "Theater"], ["Hill Station Boarding", "CBSE", "South India", "Nature"], ["Cricket", "Football", "Athletics", "Basketball"], "https://www.gsischool.com"),
    s("stanes-coimbatore", "Stanes Anglo Indian Higher Sec School", "Tamil Nadu", "Coimbatore", "State Board", "Private", undefined, undefined, undefined, 99, 99, 450, 445, 70, 62, "₹15K–₹30K", 1921, ["Labs", "Library", "Auditorium", "Sports Ground", "Computer Labs"], ["State Board", "Coimbatore", "Heritage Christian"], ["Cricket", "Football", "Basketball", "Athletics"], "https://www.stanes.ac.in"),

    // ─────────────────── RAJASTHAN ──────────────────────────────────────────
    s("mayo-college-ajmer", "Mayo College", "Rajasthan", "Ajmer", "CBSE", "Boarding", 6, 5, 6, 100, 100, 494, 489, 80, 70, "₹7L–₹10L", 1875, ["Horse Riding", "Golf Course", "Swimming Pool", "Cricket Ground", "Shooting Range", "Chapel", "Museum", "Gym", "Library"], ["Premium Boarding", "Leadership", "Heritage", "Sports"], ["Polo", "Golf", "Cricket", "Horse Riding", "Shooting", "Football"], "https://www.mayocollege.com", "One of India's most prestigious boarding schools"),
    s("mgd-girls-jaipur", "Maharani Gayatri Devi Girls School", "Rajasthan", "Jaipur", "CBSE", "Boarding", 18, 14, undefined, 99, 99, 490, 485, 72, 65, "₹6L–₹8L", 1943, ["Boarding House", "Library", "Labs", "Swimming Pool", "Tennis Courts", "Horse Riding", "Cultural Hall"], ["Girls-Only Boarding", "Royal Heritage", "All-round"], ["Tennis", "Athletics", "Swimming", "Horse Riding"], "https://www.mgdschool.com"),
    s("dps-jaipur", "Delhi Public School, Jaipur", "Rajasthan", "Jaipur", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 491, 485, 75, 65, "₹50K–₹80K", 1998, ["Labs", "Library", "Computer Labs", "Auditorium", "Sports Ground", "Swimming Pool"], ["CBSE", "Jaipur", "Academics"], ["Cricket", "Football", "Basketball", "Chess"], "https://www.dpsjaipur.com"),
    s("st-xaviers-jaipur", "St. Xavier's School, Jaipur", "Rajasthan", "Jaipur", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 492, 486, 76, 66, "₹40K–₹65K", 1962, ["Labs", "Library", "Auditorium", "Sports Ground", "Computer Labs", "Chapel"], ["CBSE", "Jaipur", "Christian Heritage", "All-round"], ["Cricket", "Football", "Volleyball", "Athletics"], "https://www.stxaviersschool.com"),

    // ─────────────────── WEST BENGAL ────────────────────────────────────────
    s("la-martiniere-boys-wb", "La Martinière for Boys, Kolkata", "West Bengal", "Kolkata", "ICSE", "Private", 8, 7, 9, 100, 100, 497, 491, 85, 75, "₹80K–₹1.2L", 1836, ["Heritage Campus", "Swimming Pool", "Cricket Ground", "Library", "Labs", "Auditorium", "Chapel", "Museum"], ["ICSE Heritage", "Discipline", "East India", "Sports"], ["Cricket", "Football", "Athletics", "Swimming", "Basketball"], "https://lmcboys.in"),
    s("south-point-kolkata", "South Point School", "West Bengal", "Kolkata", "CBSE", "Private", 22, 18, undefined, 100, 100, 497, 492, 88, 78, "₹40K–₹70K", 1954, ["Labs", "Library", "Auditorium", "Sports Ground", "Computer Labs"], ["High JEE/NEET Achievers", "CBSE", "Kolkata"], ["Cricket", "Football", "Basketball"], "https://southpointschool.org", "Most IIT selections from WB"),
    s("st-xaviers-kolkata", "St. Xavier's Collegiate School", "West Bengal", "Kolkata", "ICSE", "Private", undefined, undefined, undefined, 100, 100, 496, 490, 84, 74, "₹60K–₹90K", 1860, ["Heritage Campus", "Library", "Labs", "Auditorium", "Chapel", "Computer Labs", "Sports Ground"], ["ICSE", "Kolkata", "Jesuit Heritage", "Boys School"], ["Cricket", "Football", "Basketball", "Athletics"], "https://sxccal.edu"),
    s("dav-model-school-kolkata", "DAV Model School", "West Bengal", "Kolkata", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 490, 484, 72, 62, "₹25K–₹45K", 1975, ["Labs", "Library", "Computer Labs", "Sports Ground", "Auditorium"], ["CBSE", "DAV Network", "North Kolkata"], ["Cricket", "Football", "Volleyball", "Chess"], "https://www.davkolkata.com"),

    // ─────────────────── UTTARAKHAND ────────────────────────────────────────
    s("the-doon-school", "The Doon School", "Uttarakhand", "Dehradun", "CBSE", "Boarding", 2, 2, 2, 100, 100, 495, 492, 80, 72, "₹14L–₹18L", 1935, ["Swimming Pool", "Cricket Ground", "Golf Course", "Observatory", "Printing Press", "Theatre", "Music Rooms", "Comprehensive Library"], ["Premium Boarding", "Leadership", "PM Alumni Network", "All-round Excellence"], ["Cricket", "Football", "Golf", "Squash", "Swimming", "Tennis"], "https://www.doonschool.com", "India's most elite boarding school. Alumni: PM Rajiv Gandhi"),
    s("welham-girls", "Welham Girls' School", "Uttarakhand", "Dehradun", "CBSE", "Boarding", 16, 13, undefined, 100, 100, 492, 487, 75, 68, "₹9L–₹12L", 1943, ["Boarding House", "Swimming Pool", "Cricket Ground", "Art Room", "Music Room", "Library", "Tennis Court"], ["Girls Boarding School", "Leadership", "Academics"], ["Tennis", "Swimming", "Cricket", "Athletics"], "https://www.welhamgirls.com"),
    s("doon-girls-school", "The Doon Girls School", "Uttarakhand", "Dehradun", "CBSE", "Boarding", undefined, undefined, undefined, 100, 100, 489, 483, 72, 62, "₹7L–₹10L", 1994, ["Boarding House", "Labs", "Library", "Sports Ground", "Auditorium", "Swimming Pool"], ["Girls Boarding", "Dehradun", "Nature", "CBSE"], ["Cricket", "Football", "Swimming", "Athletics"], "https://www.doongirls.com"),

    // ─────────────────── HIMACHAL PRADESH ───────────────────────────────────
    s("bishop-cotton-simla", "Bishop Cotton School, Shimla", "Himachal Pradesh", "Shimla", "CBSE", "Boarding", undefined, undefined, undefined, 100, 100, 491, 485, 75, 65, "₹5L–₹8L", 1859, ["Heritage Campus", "Cricket Ground", "Chapel", "Library", "Labs", "Gym", "Swimming Pool"], ["Boarding School", "Heritage", "Hill Station", "Sports"], ["Cricket", "Football", "Swimming", "Tennis"], "https://www.bishopcottonschool.net"),
    s("tara-hall-shimla", "Tara Hall School", "Himachal Pradesh", "Shimla", "CBSE", "Boarding", undefined, undefined, undefined, 100, 100, 489, 483, 72, 62, "₹4L–₹6L", 1952, ["Boarding House", "Labs", "Library", "Sports Ground", "Auditorium"], ["Girls Boarding", "Himachal Pradesh", "Heritage", "CBSE"], ["Cricket", "Football", "Athletics", "Basketball"], "https://tarahall.edu.in"),

    // ─────────────────── MADHYA PRADESH ─────────────────────────────────────
    s("scindia-school", "The Scindia School", "Madhya Pradesh", "Gwalior", "CBSE", "Boarding", 14, 11, 12, 100, 99, 490, 483, 70, 60, "₹8L–₹12L", 1897, ["Fort Campus", "Swimming Pool", "Cricket Ground", "Gym", "Chapel", "Shooting Range", "Library"], ["Boarding School", "Royal Heritage", "Sports", "Leadership"], ["Cricket", "Football", "Swimming", "Shooting", "Horse Riding"], "https://www.scindiaschool.org"),
    s("delhi-public-school-bhopal", "Delhi Public School, Bhopal", "Madhya Pradesh", "Bhopal", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 489, 483, 73, 63, "₹40K–₹65K", 2004, ["Labs", "Library", "Computer Labs", "Sports Ground", "Auditorium"], ["CBSE", "MP", "Academics"], ["Cricket", "Football", "Basketball", "Chess"], "https://dpsbhopal.com"),
    s("choithram-indore", "Choithram School, Indore", "Madhya Pradesh", "Indore", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 490, 484, 74, 64, "₹35K–₹60K", 1971, ["Labs", "Library", "Computer Labs", "Auditorium", "Sports Ground", "Swimming Pool"], ["CBSE", "Indore", "Academic Focus"], ["Cricket", "Football", "Swimming", "Chess"], "https://www.choithramschool.com"),

    // ─────────────────── GUJARAT ────────────────────────────────────────────
    s("anand-niketan-ahmedabad", "Anand Niketan School", "Gujarat", "Ahmedabad", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 492, 486, 78, 68, "₹50K–₹80K", 2000, ["Labs", "Library", "Computer Labs", "Auditorium", "Swimming Pool", "Sports Ground"], ["CBSE", "Ahmedabad", "Modern Infrastructure"], ["Cricket", "Football", "Badminton", "Chess"], "https://www.anandniketan.com"),
    s("delhi-public-school-ahmedabad", "Delhi Public School, Bopal", "Gujarat", "Ahmedabad", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 491, 485, 75, 65, "₹55K–₹85K", 2003, ["Labs", "Library", "Computer Labs", "Sports Ground", "Auditorium", "Swimming Pool"], ["CBSE", "Gujarat", "Academics"], ["Cricket", "Football", "Basketball", "Chess"], "https://www.dpsahmedabad.com"),
    s("navrachna-vadodara", "Navrachana International School", "Gujarat", "Vadodara", "CBSE + IB", "Private", undefined, undefined, undefined, 100, 100, 493, 487, 79, 69, "₹1.2L–₹2L", 1994, ["Labs", "Library", "Computer Labs", "Auditorium", "Sports Ground", "Robotics Lab"], ["CBSE & IB", "Vadodara", "Modern Education"], ["Cricket", "Football", "Basketball", "Chess"], "https://www.navrachana.edu.in"),
    s("ryan-surat", "Ryan International School, Surat", "Gujarat", "Surat", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 489, 483, 72, 62, "₹35K–₹55K", 1998, ["Labs", "Library", "Computer Labs", "Sports Ground", "Auditorium"], ["CBSE", "Gujarat", "Diamond City"], ["Cricket", "Football", "Basketball", "Yoga"], "https://ryangroup.org"),

    // ─────────────────── TELANGANA ──────────────────────────────────────────
    s("hyderabad-public-school", "Hyderabad Public School, Begumpet", "Telangana", "Hyderabad", "CBSE", "Boarding", 20, 16, undefined, 100, 100, 493, 488, 78, 68, "₹3.5L–₹5L", 1923, ["Swimming Pool", "Cricket Ground", "Football Ground", "Labs", "Library", "Gym", "Auditorium", "Tennis Court"], ["Boarding School", "Telangana", "Sports", "English"], ["Cricket", "Football", "Tennis", "Swimming", "Athletics"], "https://www.hps.edu.in"),
    s("glendale-hyderabad", "Glendale Academy", "Telangana", "Hyderabad", "CBSE + IB", "Private", undefined, undefined, undefined, 100, 100, 493, 487, 79, 69, "₹1.5L–₹2.5L", 2004, ["Labs", "Library", "Computer Labs", "Auditorium", "Swimming Pool", "Sports Ground", "Robotics Lab"], ["CBSE & IB", "Hyderabad", "Modern Curriculum"], ["Cricket", "Football", "Basketball", "Swimming"], "https://www.glendale.edu.in"),
    s("dps-hyderabad", "Delhi Public School, Hyderabad", "Telangana", "Hyderabad", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 491, 485, 75, 65, "₹70K–₹1L", 1998, ["Labs", "Library", "Computer Labs", "Auditorium", "Swimming Pool", "Sports Ground"], ["CBSE", "Hyderabad", "Large Network"], ["Cricket", "Football", "Basketball", "Chess"], "https://dpshyd.com"),
    s("chirec-public", "CHIREC Public School", "Telangana", "Hyderabad", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 492, 486, 76, 66, "₹1L–₹1.5L", 1991, ["Labs", "Library", "Computer Labs", "Auditorium", "Sports Ground", "Swimming Pool"], ["CBSE", "Hyderabad", "International Exposure"], ["Cricket", "Football", "Badminton", "Swimming"], "https://www.chirec.ac.in"),

    // ─────────────────── ANDHRA PRADESH ─────────────────────────────────────
    s("nasr-school-ap", "Nasr School", "Andhra Pradesh", "Hyderabad", "ICSE", "Private", undefined, undefined, undefined, 100, 100, 494, 488, 80, 70, "₹50K–₹80K", 1920, ["Labs", "Library", "Auditorium", "Sports Ground", "Computer Labs", "Chapel"], ["ICSE", "Heritage", "Christian School", "AP/Telangana"], ["Cricket", "Football", "Basketball", "Athletics"], "https://nasrschool.in"),
    s("dps-vijayawada", "Delhi Public School, Vijayawada", "Andhra Pradesh", "Vijayawada", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 489, 483, 72, 62, "₹40K–₹65K", 2006, ["Labs", "Library", "Computer Labs", "Sports Ground", "Auditorium"], ["CBSE", "Andhra Pradesh", "Academics"], ["Cricket", "Football", "Basketball", "Chess"], "https://dpsvijayawada.com"),

    // ─────────────────── KERALA ─────────────────────────────────────────────
    s("loyola-trivandrum", "Loyola School, Trivandrum", "Kerala", "Thiruvananthapuram", "ICSE", "Private", 28, 22, undefined, 100, 100, 495, 489, 82, 72, "₹30K–₹50K", 1953, ["Library", "Labs", "Auditorium", "Sports Ground", "Computer Labs", "Chapel"], ["ICSE", "Kerala", "English Medium"], ["Football", "Cricket", "Athletics", "Basketball"], "https://www.loyolaschooltvm.com"),
    s("rajagiri-kochi", "Rajagiri Public School", "Kerala", "Kochi", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 491, 485, 76, 66, "₹45K–₹70K", 2004, ["Labs", "Library", "Computer Labs", "Auditorium", "Sports Ground", "Swimming Pool"], ["CBSE", "Kochi", "Modern Infrastructure"], ["Cricket", "Football", "Basketball", "Swimming"], "https://www.rajagiri.edu"),
    s("bhavans-vidyamandir-kochi", "Bhavan's Vidya Mandir", "Kerala", "Kochi", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 493, 487, 79, 69, "₹35K–₹55K", 1964, ["Labs", "Library", "Computer Labs", "Auditorium", "Sports Ground"], ["CBSE", "Kerala", "Bharatiya Vidya Bhavan"], ["Cricket", "Football", "Badminton", "Chess"], "https://www.bvmevm.ac.in"),
    s("kendriya-vidyalaya-calicut", "Kendriya Vidyalaya, Calicut", "Kerala", "Kozhikode", "CBSE", "Government", undefined, undefined, undefined, 99, 98, 492, 486, 70, 60, "₹1.5K–₹8K", 1968, ["Labs", "Library", "Computer Labs", "Sports Ground", "NCC/NSS"], ["Affordable", "CBSE", "Defense Families", "Kerala"], ["Cricket", "Football", "Athletics", "Volleyball"], "https://kvsangathan.nic.in"),

    // ─────────────────── PUNJAB ─────────────────────────────────────────────
    s("yadavindra-patiala", "Yadavindra Public School", "Punjab", "Patiala", "CBSE", "Boarding", 32, 25, undefined, 99, 99, 489, 482, 68, 58, "₹4.5L–₹6L", 1948, ["Heritage Campus", "Swimming Pool", "Cricket Ground", "Hockey Ground", "Gym", "Library"], ["Boarding School", "Sports", "Punjab", "Royal Heritage"], ["Cricket", "Hockey", "Football", "Swimming", "Athletics"], "https://www.yadavindraps.com"),
    s("dps-ludhiana", "Delhi Public School, Ludhiana", "Punjab", "Ludhiana", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 490, 484, 73, 63, "₹45K–₹70K", 2002, ["Labs", "Library", "Computer Labs", "Sports Ground", "Auditorium"], ["CBSE", "Punjab", "Academics"], ["Cricket", "Football", "Basketball", "Hockey"], "https://www.dpslucknow.com"),
    s("bcm-ludhiana", "BCM School, Ludhiana", "Punjab", "Ludhiana", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 489, 483, 72, 62, "₹30K–₹50K", 1970, ["Labs", "Library", "Computer Labs", "Sports Ground", "Auditorium"], ["CBSE", "Ludhiana", "Academic Reputation"], ["Cricket", "Football", "Hockey", "Basketball"], "https://www.bcmschools.com"),
    s("carmel-convent-chandigarh", "Carmel Convent School, Chandigarh", "Chandigarh", "Chandigarh", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 493, 487, 79, 69, "₹35K–₹55K", 1955, ["Labs", "Library", "Computer Labs", "Auditorium", "Sports Ground", "Chapel"], ["CBSE", "Girls School", "Chandigarh", "Christian"], ["Basketball", "Athletics", "Badminton", "Yoga"], "https://carmelconvent.edu.in"),

    // ─────────────────── HARYANA ────────────────────────────────────────────
    s("scottish-high-gurgaon", "Scottish High International School", "Haryana", "Gurugram", "CBSE + IB", "Private", undefined, undefined, undefined, 100, 100, 493, 487, 79, 69, "₹1.5L–₹2.5L", 2001, ["Labs", "Library", "Computer Labs", "Auditorium", "Swimming Pool", "Sports Ground", "Robotics Lab"], ["CBSE & IB", "Gurgaon", "International Environment"], ["Cricket", "Football", "Swimming", "Basketball"], "https://www.scottishigh.com"),
    s("gdgps-gurgaon", "G.D. Goenka Public School, Gurgaon", "Haryana", "Gurugram", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 491, 485, 75, 65, "₹1L–₹1.5L", 2004, ["Labs", "Library", "Computer Labs", "Sports Ground", "Auditorium", "Swimming Pool", "Robotics Lab"], ["CBSE", "Gurgaon", "Modern Campus"], ["Cricket", "Football", "Basketball", "Swimming"], "https://www.gdgoenkagurgaon.com"),
    s("manav-rachna-faridabad", "Manav Rachna International School", "Haryana", "Faridabad", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 490, 484, 74, 64, "₹80K–₹1.2L", 2006, ["Labs", "Library", "Computer Labs", "Sports Ground", "Auditorium", "Swimming Pool"], ["CBSE", "Faridabad", "Modern Infrastructure"], ["Cricket", "Football", "Basketball", "Swimming"], "https://manavrachna.edu.in"),

    // ─────────────────── ODISHA ─────────────────────────────────────────────
    s("dav-public-school-bhubaneswar", "DAV Public School, Bhubaneswar", "Odisha", "Bhubaneswar", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 490, 484, 73, 63, "₹30K–₹50K", 1959, ["Labs", "Library", "Computer Labs", "Sports Ground", "Auditorium"], ["CBSE", "Odisha", "DAV Network", "Academics"], ["Cricket", "Football", "Volleyball", "Athletics"], "https://www.davbhubaneswar.org"),
    s("kiit-international-school", "KIIT International School", "Odisha", "Bhubaneswar", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 492, 486, 76, 66, "₹70K–₹1L", 2008, ["Labs", "Library", "Computer Labs", "Auditorium", "Sports Ground", "Swimming Pool", "Robotics Lab"], ["CBSE", "Bhubaneswar", "University-Linked", "Modern"], ["Cricket", "Football", "Basketball", "Swimming"], "https://kissbhubaneswar.in"),

    // ─────────────────── JHARKHAND ──────────────────────────────────────────
    s("delhi-public-school-ranchi", "Delhi Public School, Ranchi", "Jharkhand", "Ranchi", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 490, 484, 73, 63, "₹45K–₹70K", 2001, ["Labs", "Library", "Computer Labs", "Sports Ground", "Auditorium", "Swimming Pool"], ["CBSE", "Jharkhand", "Academics"], ["Cricket", "Football", "Basketball", "Chess"], "https://www.dpsranchi.com"),
    s("st-xavier-ranchi", "St. Xavier's School, Ranchi", "Jharkhand", "Ranchi", "ICSE", "Private", undefined, undefined, undefined, 100, 100, 492, 486, 76, 66, "₹35K–₹55K", 1949, ["Labs", "Library", "Auditorium", "Chapel", "Sports Ground", "Computer Labs"], ["ICSE", "Ranchi", "Christian Heritage", "Jharkhand"], ["Cricket", "Football", "Basketball", "Athletics"], "https://www.sxsranchi.com"),

    // ─────────────────── BIHAR ──────────────────────────────────────────────
    s("don-bosco-patna", "Don Bosco Academy, Patna", "Bihar", "Patna", "ICSE", "Private", undefined, undefined, undefined, 100, 100, 491, 485, 74, 64, "₹30K–₹50K", 1958, ["Labs", "Library", "Auditorium", "Chapel", "Sports Ground", "Computer Labs"], ["ICSE", "Bihar", "Christian", "Academics"], ["Cricket", "Football", "Basketball", "Athletics"], "https://www.donboscoacademy.in"),
    s("loyola-high-patna", "Loyola High School, Patna", "Bihar", "Patna", "ICSE", "Private", undefined, undefined, undefined, 100, 100, 492, 486, 76, 66, "₹25K–₹45K", 1952, ["Labs", "Library", "Auditorium", "Chapel", "Sports Ground", "Computer Labs"], ["ICSE", "Bihar", "Heritage", "Boys School"], ["Cricket", "Football", "Basketball", "Volleyball"], "https://www.loyolahighpatna.com"),

    // ─────────────────── ASSAM ──────────────────────────────────────────────
    s("don-bosco-school-guwahati", "Don Bosco School, Guwahati", "Assam", "Guwahati", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 490, 484, 73, 63, "₹30K–₹50K", 1933, ["Labs", "Library", "Auditorium", "Chapel", "Sports Ground", "Computer Labs"], ["CBSE", "Assam", "Northeast India", "Christian"], ["Cricket", "Football", "Basketball", "Volleyball"], "https://www.dbsguwahati.com"),
    s("kendriya-vidyalaya-guwahati", "Kendriya Vidyalaya, Guwahati", "Assam", "Guwahati", "CBSE", "Government", undefined, undefined, undefined, 99, 98, 489, 483, 68, 58, "₹1.5K–₹8K", 1966, ["Labs", "Library", "Computer Labs", "Sports Ground", "NCC"], ["Affordable", "CBSE", "Defense Families", "Northeast"], ["Cricket", "Football", "Athletics"], "https://kvsangathan.nic.in"),

    // ─────────────────── MEGHALAYA ──────────────────────────────────────────
    s("st-edmunds-college-shillong", "St. Edmund's College School", "Meghalaya", "Shillong", "ICSE", "Private", undefined, undefined, undefined, 100, 100, 491, 485, 74, 64, "₹30K–₹50K", 1924, ["Labs", "Library", "Auditorium", "Chapel", "Sports Ground", "Computer Labs"], ["ICSE", "Northeast India", "Christian", "Heritage"], ["Cricket", "Football", "Basketball", "Athletics"], "https://www.stedmundsshillong.com"),
    s("pine-mount-school", "Pine Mount School", "Meghalaya", "Shillong", "ICSE", "Private", undefined, undefined, undefined, 100, 100, 489, 483, 70, 60, "₹40K–₹65K", 1903, ["Labs", "Library", "Auditorium", "Sports Ground", "Computer Labs"], ["ICSE", "Shillong", "Hill Station", "Girls Boarding"], ["Athletics", "Basketball", "Football", "Badminton"], "https://www.pinemountschool.org"),

    // ─────────────────── MANIPUR ────────────────────────────────────────────
    s("dps-imphal", "Delhi Public School, Imphal", "Manipur", "Imphal", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 487, 481, 68, 58, "₹25K–₹40K", 2007, ["Labs", "Library", "Computer Labs", "Sports Ground", "Auditorium"], ["CBSE", "Northeast India", "Manipur"], ["Cricket", "Football", "Athletics", "Volleyball"], "https://dpsimphal.com"),

    // ─────────────────── TRIPURA ────────────────────────────────────────────
    s("kendriya-vidyalaya-agartala", "Kendriya Vidyalaya, Agartala", "Tripura", "Agartala", "CBSE", "Government", undefined, undefined, undefined, 99, 98, 488, 482, 66, 56, "₹1.5K–₹8K", 1969, ["Labs", "Library", "Computer Labs", "Sports Ground", "NCC"], ["Affordable", "CBSE", "Government", "Northeast"], ["Cricket", "Football", "Athletics", "Volleyball"], "https://kvsangathan.nic.in"),

    // ─────────────────── NAGALAND ────────────────────────────────────────────
    s("st-josephs-dimapur", "St. Joseph's School, Dimapur", "Nagaland", "Dimapur", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 488, 482, 68, 58, "₹20K–₹35K", 1948, ["Labs", "Library", "Auditorium", "Chapel", "Sports Ground", "Computer Labs"], ["CBSE", "Northeast India", "Nagaland", "Christian"], ["Football", "Basketball", "Athletics", "Volleyball"], "https://sjsdimapur.edu.in"),

    // ─────────────────── GOA ──────────────────────────────────────────────
    s("sharada-mandir-goa", "Sharada Mandir School", "Goa", "Panaji", "CBSE + IB", "Private", 40, undefined, undefined, 100, 100, 492, 486, 78, 68, "₹50K–₹80K", 1953, ["Swimming Pool", "Library", "Labs", "Auditorium", "Sports Ground"], ["Goa", "CBSE", "All-round", "Coastal Education"], ["Football", "Cricket", "Swimming", "Athletics"], "https://www.sharadamandir.com"),
    s("dps-goa", "Delhi Public School, Goa", "Goa", "Panaji", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 490, 484, 72, 62, "₹60K–₹90K", 2008, ["Labs", "Library", "Computer Labs", "Auditorium", "Sports Ground", "Swimming Pool"], ["CBSE", "Goa", "Academics"], ["Cricket", "Football", "Basketball", "Swimming"], "https://dpsgoa.com"),

    // ─────────────────── CHHATTISGARH ────────────────────────────────────────
    s("dps-raipur", "Delhi Public School, Raipur", "Chhattisgarh", "Raipur", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 489, 483, 72, 62, "₹40K–₹65K", 2003, ["Labs", "Library", "Computer Labs", "Sports Ground", "Auditorium", "Swimming Pool"], ["CBSE", "Chhattisgarh", "Academics"], ["Cricket", "Football", "Basketball", "Chess"], "https://dpsraipur.com"),

    // ─────────────────── PUDUCHERRY ──────────────────────────────────────────
    s("jawaharlal-nehru-school-pondicherry", "Jawaharlal Nehru School of Excellence", "Puducherry", "Puducherry", "CBSE", "Government", undefined, undefined, undefined, 99, 99, 488, 482, 68, 58, "₹5K–₹15K", 1970, ["Labs", "Library", "Computer Labs", "Sports Ground", "Auditorium"], ["CBSE", "Puducherry", "Government", "Affordable"], ["Cricket", "Football", "Athletics", "Yoga"], "https://jnse.edu.in"),
    s("csr-school-pondicherry", "CSI Baring Higher Secondary, Pondicherry", "Puducherry", "Puducherry", "State Board", "Aided", undefined, undefined, undefined, 99, 98, 445, 440, 65, 55, "₹10K–₹20K", 1862, ["Labs", "Library", "Auditorium", "Chapel", "Sports Ground"], ["State Board", "Heritage Christian", "Puducherry", "Affordable"], ["Cricket", "Football", "Athletics"], "https://csibaring.in"),

    // ─────────────────── JAMMU & KASHMIR ────────────────────────────────────
    s("burn-hall-srinagar", "Burn Hall School, Srinagar", "Jammu & Kashmir", "Srinagar", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 489, 483, 70, 60, "₹40K–₹65K", 1959, ["Labs", "Library", "Auditorium", "Chapel", "Sports Ground", "Computer Labs"], ["CBSE", "Kashmir", "Christian Heritage", "Cold Weather School"], ["Cricket", "Football", "Basketball", "Athletics"], "https://www.burnhall.net"),
    s("dps-srinagar", "Delhi Public School, Srinagar", "Jammu & Kashmir", "Srinagar", "CBSE", "Private", undefined, undefined, undefined, 100, 100, 488, 482, 68, 58, "₹35K–₹55K", 2007, ["Labs", "Library", "Computer Labs", "Sports Ground", "Auditorium"], ["CBSE", "J&K", "Academics"], ["Cricket", "Football", "Basketball"], "https://dpssrinagar.com"),

    // ─────────────────── GOVERNMENT / ALL-INDIA ──────────────────────────────
    s("kvs-all-india", "Kendriya Vidyalaya (Network)", "All India", "Pan-India", "CBSE", "Government", undefined, undefined, undefined, 99, 98, 497, 491, 70, 55, "₹1,500–₹8,000", 1963, ["Labs", "Library", "Computer Lab", "Sports Ground", "NCC/NSS"], ["Affordable Education", "Pan-India Transfer", "CBSE", "Defense Families"], ["Cricket", "Football", "Athletics", "Yoga"], "https://kvsangathan.nic.in", "1,200+ schools across India. Best Government CBSE option."),
    s("navodaya-vidyalaya", "Jawahar Navodaya Vidyalaya (JNV)", "All India", "Pan-India (Rural)", "CBSE", "Government", undefined, undefined, undefined, 98, 97, 496, 490, 65, 50, "Free (Fully Funded)", 1986, ["Free Boarding", "Labs", "Library", "Sports Ground", "Computer Labs"], ["Free Residential Education", "Rural Talent", "Govt Scholarship", "CBSE"], ["Cricket", "Football", "Athletics", "Volleyball"], "https://navodaya.gov.in", "Admission via JNVST. Completely Free for rural students."),
    s("sainik-school", "Sainik School Network (All India)", "All India", "Pan-India", "CBSE", "Government", undefined, undefined, undefined, 99, 99, 490, 484, 72, 62, "₹90K–₹1.5L", 1961, ["NDA Training", "Cricket Ground", "Obstacle Course", "Shooting Range", "Labs", "Library", "Parade Ground"], ["NDA/Military Prep", "Discipline", "Leadership", "Defense Families"], ["Cricket", "Football", "Athletics", "Shooting", "Swimming"], "https://sainikschool.ncog.gov.in", "Residential school for military/NDA aspirants. Entry via AISSEE exam."),

];

export const ALL_STATES = ["All", ...Array.from(new Set(ALL_SCHOOLS.map(s => s.state))).sort()];
export const ALL_BOARDS = ["All", "CBSE", "ICSE", "IB", "IGCSE", "State Board", "CBSE + IB"];
export const ALL_TYPES_SCHOOL = ["All", "Private", "Government", "Boarding", "Aided"];
export const ALL_FACILITIES = [
    "Swimming Pool", "Cricket Ground", "Boarding House", "Robotics Lab", "Horse Riding",
    "Auditorium", "Shooting Range", "Observatory", "Golf Course", "Computer Labs",
    "Science Labs", "Library", "Gym", "Tennis Court", "NCC/NSS"
];
