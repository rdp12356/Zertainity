export interface CollegeCutoff {
    id: string;
    collegeName: string;
    exam: "JEE Main" | "NEET" | "CUET" | "MHT-CET" | "BITSAT";
    course: string;
    category: "General" | "OBC" | "SC" | "ST" | "EWS";
    closingRank: number;
    homeState: boolean;
    location: string;
    type: "IIT" | "NIT" | "IIIT" | "GFTI" | "AIIMS" | "State" | "Private";
}

export const CUTOFF_DATA: CollegeCutoff[] = [
    // --- JEE Main (Engineering) ---
    { id: "c1", collegeName: "NIT Trichy", exam: "JEE Main", course: "Computer Science", category: "General", closingRank: 1500, homeState: false, location: "Tamil Nadu", type: "NIT" },
    { id: "c2", collegeName: "NIT Trichy", exam: "JEE Main", course: "Computer Science", category: "General", closingRank: 4000, homeState: true, location: "Tamil Nadu", type: "NIT" },
    { id: "c3", collegeName: "NIT Trichy", exam: "JEE Main", course: "Mechanical", category: "General", closingRank: 12000, homeState: false, location: "Tamil Nadu", type: "NIT" },
    { id: "c4", collegeName: "NIT Surathkal", exam: "JEE Main", course: "Computer Science", category: "General", closingRank: 1800, homeState: false, location: "Karnataka", type: "NIT" },
    { id: "c5", collegeName: "NIT Warangal", exam: "JEE Main", course: "Electronics", category: "OBC", closingRank: 4500, homeState: false, location: "Telangana", type: "NIT" },
    { id: "c6", collegeName: "IIIT Hyderabad", exam: "JEE Main", course: "Computer Science", category: "General", closingRank: 800, homeState: false, location: "Telangana", type: "IIIT" },
    { id: "c7", collegeName: "DTU Delhi", exam: "JEE Main", course: "Software Engineering", category: "General", closingRank: 8000, homeState: true, location: "Delhi", type: "State" },
    { id: "c8", collegeName: "NSUT Delhi", exam: "JEE Main", course: "Computer Science", category: "SC", closingRank: 35000, homeState: true, location: "Delhi", type: "State" },
    { id: "c9", collegeName: "NIT Rourkela", exam: "JEE Main", course: "Civil", category: "General", closingRank: 25000, homeState: false, location: "Odisha", type: "NIT" },
    { id: "c10", collegeName: "PEC Chandigarh", exam: "JEE Main", course: "Electrical", category: "General", closingRank: 22000, homeState: false, location: "Chandigarh", type: "GFTI" },
    { id: "c11", collegeName: "NIT Calicut", exam: "JEE Main", course: "Architecture", category: "General", closingRank: 800, homeState: false, location: "Kerala", type: "NIT" },
    { id: "c12", collegeName: "VJTI Mumbai", exam: "JEE Main", course: "Information Technology", category: "General", closingRank: 15000, homeState: false, location: "Maharashtra", type: "State" },

    // --- NEET (Medical) ---
    { id: "m1", collegeName: "AIIMS Delhi", exam: "NEET", course: "MBBS", category: "General", closingRank: 55, homeState: false, location: "Delhi", type: "AIIMS" },
    { id: "m2", collegeName: "JIPMER Puducherry", exam: "NEET", course: "MBBS", category: "General", closingRank: 250, homeState: false, location: "Puducherry", type: "State" },
    { id: "m3", collegeName: "Maulana Azad Medical College", exam: "NEET", course: "MBBS", category: "General", closingRank: 90, homeState: false, location: "Delhi", type: "State" },
    { id: "m4", collegeName: "Grant Medical College", exam: "NEET", course: "MBBS", category: "General", closingRank: 1800, homeState: true, location: "Maharashtra", type: "State" },
    { id: "m5", collegeName: "KEM Hospital", exam: "NEET", course: "MBBS", category: "OBC", closingRank: 3500, homeState: true, location: "Maharashtra", type: "State" },
    { id: "m6", collegeName: "Madras Medical College", exam: "NEET", course: "MBBS", category: "SC", closingRank: 15000, homeState: true, location: "Tamil Nadu", type: "State" },

    // --- CUET (Central Universities) - Mock mapped to ranks for logic simplicity ---
    { id: "cu1", collegeName: "SRCC, Delhi University", exam: "CUET", course: "B.Com (Hons)", category: "General", closingRank: 100, homeState: false, location: "Delhi", type: "State" },
    { id: "cu2", collegeName: "Hindu College, DU", exam: "CUET", course: "BA Political Science", category: "General", closingRank: 200, homeState: false, location: "Delhi", type: "State" },
    { id: "cu3", collegeName: "St. Stephen's, DU", exam: "CUET", course: "BSc Physics", category: "General", closingRank: 150, homeState: false, location: "Delhi", type: "State" },
    { id: "cu4", collegeName: "BHU Varanasi", exam: "CUET", course: "BA Arts", category: "OBC", closingRank: 5000, homeState: false, location: "Uttar Pradesh", type: "State" },
    { id: "cu5", collegeName: "JNU Delhi", exam: "CUET", course: "BA Foreign Languages", category: "General", closingRank: 300, homeState: false, location: "Delhi", type: "State" },

    // --- MHT-CET (Maharashtra Engineering) ---
    { id: "mh1", collegeName: "VJTI Mumbai", exam: "MHT-CET", course: "Computer Engineering", category: "General", closingRank: 150, homeState: true, location: "Maharashtra", type: "State" },
    { id: "mh2", collegeName: "COEP Pune", exam: "MHT-CET", course: "Mechanical", category: "General", closingRank: 900, homeState: true, location: "Maharashtra", type: "State" },
    { id: "mh3", collegeName: "SPIT Mumbai", exam: "MHT-CET", course: "Computer Science", category: "OBC", closingRank: 600, homeState: true, location: "Maharashtra", type: "State" },
    { id: "mh4", collegeName: "PICT Pune", exam: "MHT-CET", course: "IT", category: "General", closingRank: 1100, homeState: true, location: "Maharashtra", type: "Private" },

    // --- BITSAT ---
    { id: "b1", collegeName: "BITS Pilani", exam: "BITSAT", course: "Computer Science", category: "General", closingRank: 300, homeState: false, location: "Rajasthan", type: "Private" },
    { id: "b2", collegeName: "BITS Goa", exam: "BITSAT", course: "Electronics", category: "General", closingRank: 1500, homeState: false, location: "Goa", type: "Private" },
    { id: "b3", collegeName: "BITS Hyderabad", exam: "BITSAT", course: "Mechanical", category: "General", closingRank: 3500, homeState: false, location: "Telangana", type: "Private" }
];
