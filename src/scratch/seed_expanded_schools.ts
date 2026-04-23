import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lsnhzyknfuufscnpixve.supabase.co';
const supabaseKey = 'sbp_5ac1951d12cade739b63111776f5f914d777aec3';
const supabase = createClient(supabaseUrl, supabaseKey);

const schools = [
  // Maharashtra
  { name: "Dhirubhai Ambani International School", location: "Mumbai, Maharashtra", board: "IB, IGCSE", grade_11_cutoff: 92, description: "Premier international school in Mumbai." },
  { name: "Bishop's School", location: "Pune, Maharashtra", board: "ICSE", grade_11_cutoff: 88, description: "One of the oldest schools in Pune." },
  { name: "Loyola High School", location: "Pune, Maharashtra", board: "SSC", grade_11_cutoff: 85, description: "Renowned Jesuit institution." },
  { name: "Campioun School", location: "Mumbai, Maharashtra", board: "ICSE", grade_11_cutoff: 90, description: "Elite boys' school in Fort, Mumbai." },
  { name: "Podar International School", location: "Nagpur, Maharashtra", board: "CBSE", grade_11_cutoff: 82, description: "Part of the prestigious Podar network." },

  // Delhi
  { name: "Modern School, Barakhamba Road", location: "New Delhi", board: "CBSE", grade_11_cutoff: 94, description: "Iconic school in central Delhi." },
  { name: "Delhi Public School, R.K. Puram", location: "New Delhi", board: "CBSE", grade_11_cutoff: 96, description: "Top-ranked school for academic excellence." },
  { name: "Sanskriti School", location: "New Delhi", board: "CBSE", grade_11_cutoff: 93, description: "Serving children of civil servants and general category." },
  { name: "Vasant Valley School", location: "New Delhi", board: "CBSE", grade_11_cutoff: 95, description: "Holistic development focused elite school." },
  { name: "The Mother's International School", location: "New Delhi", board: "CBSE", grade_11_cutoff: 94, description: "Known for its unique educational philosophy." },

  // Tamil Nadu
  { name: "Padma Seshadri Bala Bhavan (PSBB)", location: "Chennai, Tamil Nadu", board: "CBSE", grade_11_cutoff: 95, description: "Famous for academic rigor in Chennai." },
  { name: "The School (KFI)", location: "Chennai, Tamil Nadu", board: "ICSE", grade_11_cutoff: 85, description: "Krishnamurti Foundation school focusing on alternative education." },
  { name: "Chettinad Vidyashram", location: "Chennai, Tamil Nadu", board: "CBSE", grade_11_cutoff: 90, description: "Renowned for cultural and academic activities." },
  { name: "Don Bosco Matriculation High School", location: "Chennai, Tamil Nadu", board: "State Board", grade_11_cutoff: 88, description: "Historic institution in Egmore." },
  { name: "St. John's International Residential School", location: "Chennai, Tamil Nadu", board: "CBSE", grade_11_cutoff: 80, description: "Premier residential school." },

  // Karnataka
  { name: "Bishop Cotton Boys' School", location: "Bangalore, Karnataka", board: "ICSE", grade_11_cutoff: 90, description: "Leading boys' school in Bangalore." },
  { name: "Inventure Academy", location: "Bangalore, Karnataka", board: "IB, IGCSE", grade_11_cutoff: 88, description: "Contemporary international school." },
  { name: "The Valley School", location: "Bangalore, Karnataka", board: "ICSE", grade_11_cutoff: 82, description: "Alternative education center." },
  { name: "Sophia High School", location: "Bangalore, Karnataka", board: "ICSE", grade_11_cutoff: 92, description: "Elite girls' school." },
  { name: "National Public School (NPS)", location: "Indiranagar, Bangalore", board: "CBSE", grade_11_cutoff: 95, description: "Highly competitive academic school." },

  // Uttar Pradesh
  { name: "La Martiniere College", location: "Lucknow, Uttar Pradesh", board: "ICSE", grade_11_cutoff: 85, description: "Historic colonial-era school." },
  { name: "Delhi Public School", location: "Noida, Uttar Pradesh", board: "CBSE", grade_11_cutoff: 92, description: "Top school in Noida." },
  { name: "CMS - City Montessori School", location: "Lucknow, Uttar Pradesh", board: "ICSE", grade_11_cutoff: 88, description: "World's largest school by number of students." },
  { name: "Step by Step School", location: "Noida, Uttar Pradesh", board: "CBSE, IB", grade_11_cutoff: 94, description: "Modern elite school in NCR." },
  { name: "Seth M.R. Jaipuria School", location: "Lucknow, Uttar Pradesh", board: "CBSE", grade_11_cutoff: 85, description: "Traditional excellence in Lucknow." },

  // West Bengal
  { name: "La Martiniere for Boys", location: "Kolkata, West Bengal", board: "ICSE", grade_11_cutoff: 90, description: "Elite school in Kolkata." },
  { name: "St. Xavier's Collegiate School", location: "Kolkata, West Bengal", board: "ICSE", grade_11_cutoff: 92, description: "Prestigious Jesuit school." },
  { name: "The Heritage School", location: "Kolkata, West Bengal", board: "ICSE, IB", grade_11_cutoff: 85, description: "Modern institution with great infrastructure." },
  { name: "Loreto House", location: "Kolkata, West Bengal", board: "ICSE", grade_11_cutoff: 92, description: "Leading girls' school." },
  { name: "Don Bosco School, Park Circus", location: "Kolkata, West Bengal", board: "ICSE", grade_11_cutoff: 88, description: "Prominent boys' school." },

  // Gujarat
  { name: "Ahmedabad International School", location: "Ahmedabad, Gujarat", board: "IB, IGCSE", grade_11_cutoff: 85, description: "Leading international school in Gujarat." },
  { name: "The Riverside School", location: "Ahmedabad, Gujarat", board: "IGCSE", grade_11_cutoff: 80, description: "Award-winning experimental school." },
  { name: "St. Xavier's High School", location: "Loyola Hall, Ahmedabad", board: "Gujarat Board", grade_11_cutoff: 88, description: "Top school in Ahmedabad." },

  // Telangana
  { name: "Hyderabad Public School (HPS)", location: "Begumpet, Hyderabad", board: "ICSE", grade_11_cutoff: 85, description: "Historic school for the elite." },
  { name: "Chirec International School", location: "Hyderabad, Telangana", board: "IB, CBSE", grade_11_cutoff: 90, description: "Premier international school." },
  { name: "Oakridge International School", location: "Hyderabad, Telangana", board: "IB", grade_11_cutoff: 88, description: "Part of Nord Anglia Education." },

  // Kerala
  { name: "Loyola School", location: "Thiruvananthapuram, Kerala", board: "ICSE, CBSE", grade_11_cutoff: 90, description: "Top-ranked school in Kerala." },
  { name: "Pallikoodam", location: "Kottayam, Kerala", board: "ICSE", grade_11_cutoff: 80, description: "Founded by Mary Roy, focused on creative learning." },
  { name: "Trivandrum International School", location: "Thiruvananthapuram, Kerala", board: "IB, IGCSE", grade_11_cutoff: 82, description: "First IB school in Kerala." }
];

async function seedSchools() {
  console.log('Starting school seeding...');
  const { data, error } = await supabase
    .from('schools')
    .upsert(schools, { onConflict: 'name,location' });

  if (error) {
    console.error('Error seeding schools:', error);
  } else {
    console.log('Successfully seeded schools across different states!');
  }
}

seedSchools();
