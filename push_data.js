
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lsnhzyknfuufscnpixve.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxzbmh6eWtuZnV1ZnNjbnBpeHZlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjQ5NTk5OCwiZXhwIjoyMDkyMDcxOTk4fQ.HqLf-9sfI0juUhHd06JiGsQl-8xkF0Z-DTUoqcprlOA';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function pushData() {
  console.log('🚀 Starting deep data enrichment...');

  const pushTable = async (tableName, data, nameField = 'name') => {
    console.log(`Checking ${tableName}...`);
    const { data: existing } = await supabase.from(tableName).select(nameField);
    const existingNames = new Set(existing?.map(item => item[nameField]) || []);
    
    const toInsert = data.filter(item => !existingNames.has(item[nameField]));
    
    if (toInsert.length > 0) {
      console.log(`Pushing ${toInsert.length} new records to ${tableName}...`);
      // Batch insert for better performance
      const batchSize = 50;
      for (let i = 0; i < toInsert.length; i += batchSize) {
        const batch = toInsert.slice(i, i + batchSize);
        const { error } = await supabase.from(tableName).insert(batch);
        if (error) console.error(`${tableName} Batch Error:`, error);
      }
    } else {
      console.log(`No new records to push for ${tableName}.`);
    }
  };

  // --- COLLEGES (All IITs, NITs, IIMs, NLUs + Top Central/Private) ---
  const colleges = [
    // IITs (23)
    { name: 'IIT Kharagpur', location: 'West Bengal', description: 'First IIT, known for engineering excellence.' },
    { name: 'IIT Bombay', location: 'Maharashtra', description: 'Top tier institute, leader in research.' },
    { name: 'IIT Madras', location: 'Tamil Nadu', description: 'Consistently ranked #1 in NIRF.' },
    { name: 'IIT Kanpur', location: 'Uttar Pradesh', description: 'Known for aerospace and computer science.' },
    { name: 'IIT Delhi', location: 'Delhi', description: 'Premier institute in the national capital.' },
    { name: 'IIT Guwahati', location: 'Assam', description: 'Leading institute in Northeast India.' },
    { name: 'IIT Roorkee', location: 'Uttarakhand', description: 'Oldest technical institution in Asia.' },
    { name: 'IIT Ropar', location: 'Punjab', description: 'Top second-generation IIT.' },
    { name: 'IIT Bhubaneswar', location: 'Odisha', description: 'Modern IIT with focus on innovation.' },
    { name: 'IIT Gandhinagar', location: 'Gujarat', description: 'Known for its interdisciplinary approach.' },
    { name: 'IIT Hyderabad', location: 'Telangana', description: 'Strong focus on AI and future technologies.' },
    { name: 'IIT Jodhpur', location: 'Rajasthan', description: 'Focus on technology and entrepreneurship.' },
    { name: 'IIT Patna', location: 'Bihar', description: 'Premier institute in East India.' },
    { name: 'IIT Indore', location: 'Madhya Pradesh', description: 'Top research-oriented second-gen IIT.' },
    { name: 'IIT Mandi', location: 'Himachal Pradesh', description: 'Picturesque campus with strong engineering roots.' },
    { name: 'IIT Varanasi (BHU)', location: 'Uttar Pradesh', description: 'Part of the historic BHU system.' },
    { name: 'IIT Palakkad', location: 'Kerala', description: 'Growing center for technical education in Kerala.' },
    { name: 'IIT Tirupati', location: 'Andhra Pradesh', description: 'Modern IIT in South India.' },
    { name: 'IIT Dhanbad (ISM)', location: 'Jharkhand', description: 'Famous for mining and earth sciences.' },
    { name: 'IIT Bhilai', location: 'Chhattisgarh', description: 'Focus on high-tech manufacturing.' },
    { name: 'IIT Goa', location: 'Goa', description: 'Technical education in the coastal state.' },
    { name: 'IIT Jammu', location: 'Jammu & Kashmir', description: 'Premier institute in North India.' },
    { name: 'IIT Dharwad', location: 'Karnataka', description: 'Focus on computer science and engineering.' },

    // NITs (31)
    { name: 'NIT Trichy', location: 'Tamil Nadu', description: 'Best among all NITs.' },
    { name: 'NIT Karnataka (Surathkal)', location: 'Karnataka', description: 'Leading NIT with coastal campus.' },
    { name: 'NIT Rourkela', location: 'Odisha', description: 'Large campus with massive research output.' },
    { name: 'NIT Warangal', location: 'Telangana', description: 'Highly prestigious NIT in South India.' },
    { name: 'NIT Calicut', location: 'Kerala', description: 'Premier technical institute in Kerala.' },
    { name: 'NIT Durgapur', location: 'West Bengal', description: 'Historic NIT in East India.' },
    { name: 'NIT Kurukshetra', location: 'Haryana', description: 'Strong focus on mechanical and civil eng.' },
    { name: 'MNIT Jaipur', location: 'Rajasthan', description: 'Leading NIT in North India.' },
    { name: 'MNNIT Allahabad', location: 'Uttar Pradesh', description: 'Top NIT for computer science.' },
    { name: 'VNIT Nagpur', location: 'Maharashtra', description: 'Premier institute in Central India.' },
    { name: 'SVNIT Surat', location: 'Gujarat', description: 'Leading NIT in Western India.' },
    { name: 'NIT Silchar', location: 'Assam', description: 'Key technical institute in the North-East.' },
    { name: 'NIT Jamshedpur', location: 'Jharkhand', description: 'Strong ties to the manufacturing industry.' },
    { name: 'NIT Bhopal (MANIT)', location: 'Madhya Pradesh', description: 'Large NIT with diverse engineering streams.' },
    { name: 'NIT Raipur', location: 'Chhattisgarh', description: 'Growth-focused NIT in Central India.' },
    { name: 'NIT Hamirpur', location: 'Himachal Pradesh', description: 'Leading institute in the Himalayas.' },
    { name: 'NIT Patna', location: 'Bihar', description: 'Historic institution in Patna.' },
    { name: 'NIT Goa', location: 'Goa', description: 'Growing NIT with strong faculty.' },
    { name: 'NIT Agartala', location: 'Tripura', description: 'Key education hub in Tripura.' },
    { name: 'NIT Srinagar', location: 'J&K', description: 'Historic NIT in North India.' },
    { name: 'NIT Manipur', location: 'Manipur', description: 'Technical education hub in Imphal.' },
    { name: 'NIT Meghalaya', location: 'Meghalaya', description: 'Growing NIT in Shillong.' },
    { name: 'NIT Nagaland', location: 'Nagaland', description: 'Key institute in Dimapur.' },
    { name: 'NIT Mizoram', location: 'Mizoram', description: 'Technical hub in Aizawl.' },
    { name: 'NIT Arunachal Pradesh', location: 'Arunachal Pradesh', description: 'Growth hub in Yupia.' },
    { name: 'NIT Delhi', location: 'Delhi', description: 'NIT serving the national capital.' },
    { name: 'NIT Puducherry', location: 'Puducherry', description: 'Technical institute in the coastal UT.' },
    { name: 'NIT Uttarakhand', location: 'Uttarakhand', description: 'Engineering excellence in Srinagar, UK.' },
    { name: 'NIT Andhra Pradesh', location: 'Andhra Pradesh', description: 'Newest NIT in Tadepalligudem.' },

    // IIMs (21)
    { name: 'IIM Ahmedabad', location: 'Gujarat', description: 'The top B-school in India.' },
    { name: 'IIM Bangalore', location: 'Karnataka', description: 'Leader in management research and training.' },
    { name: 'IIM Calcutta', location: 'West Bengal', description: 'The oldest IIM, strong in finance.' },
    { name: 'IIM Lucknow', location: 'Uttar Pradesh', description: 'Top management institute in North India.' },
    { name: 'IIM Indore', location: 'Madhya Pradesh', description: 'Known for its dual degree IPM program.' },
    { name: 'IIM Kozhikode', location: 'Kerala', description: 'Leading B-school in South India.' },
    { name: 'IIM Shillong', location: 'Meghalaya', description: 'The IIM in the clouds.' },
    { name: 'IIM Rohtak', location: 'Haryana', description: 'Fastest-growing new IIM.' },
    { name: 'IIM Raipur', location: 'Chhattisgarh', description: 'Strategic management hub in Central India.' },
    { name: 'IIM Ranchi', location: 'Jharkhand', description: 'Leading B-school in East India.' },
    { name: 'IIM Tiruchirappalli', location: 'Tamil Nadu', description: 'Known for academic excellence.' },
    { name: 'IIM Udaipur', location: 'Rajasthan', description: 'Focus on research and sustainability.' },
    { name: 'IIM Kashipur', location: 'Uttarakhand', description: 'Management hub in the foothills of Himalayas.' },
    { name: 'IIM Amritsar', location: 'Punjab', description: 'Newest B-school in North India.' },
    { name: 'IIM Bodh Gaya', location: 'Bihar', description: 'Growth-focused IIM in Bihar.' },
    { name: 'IIM Jammu', location: 'J&K', description: 'Strategic hub in North India.' },
    { name: 'IIM Sambalpur', location: 'Odisha', description: 'Leading B-school in Odisha.' },
    { name: 'IIM Sirmaur', location: 'Himachal Pradesh', description: 'Smallest and focused IIM.' },
    { name: 'IIM Visakhapatnam', location: 'Andhra Pradesh', description: 'Strategic hub in AP.' },
    { name: 'IIM Nagpur', location: 'Maharashtra', description: 'Leading B-school in Maharashtra.' },

    // NLUs (27)
    { name: 'NLSIU Bengaluru', location: 'Karnataka', description: 'Best law university in India.' },
    { name: 'NLU Delhi', location: 'Delhi', description: 'Top-tier law university in the capital.' },
    { name: 'NALSAR Hyderabad', location: 'Telangana', description: 'Premier institute for legal studies.' },
    { name: 'WBNUJS Kolkata', location: 'West Bengal', description: 'Leading law university in East India.' },
    { name: 'NLIU Bhopal', location: 'Madhya Pradesh', description: 'Historic law university.' },
    { name: 'GNLU Gandhinagar', location: 'Gujarat', description: 'Premier law university in West India.' },
    { name: 'RMLNLU Lucknow', location: 'Uttar Pradesh', description: 'Leading law school in UP.' },
    { name: 'RGNUL Patiala', location: 'Punjab', description: 'Top law university in North India.' },
    { name: 'CNLU Patna', location: 'Bihar', description: 'Leading law institute in Bihar.' },
    { name: 'NLU Jodhpur', location: 'Rajasthan', description: 'Top law school in Rajasthan.' },
    { name: 'HNLU Raipur', location: 'Chhattisgarh', description: 'Key law hub in Central India.' },

    // Top Central & State Universities
    { name: 'Jawaharlal Nehru University (JNU)', location: 'Delhi', description: 'Leading university for social sciences and arts.' },
    { name: 'University of Delhi (DU)', location: 'Delhi', description: 'Massive university system with top colleges like SRCC, St. Stephens.' },
    { name: 'Banaras Hindu University (BHU)', location: 'Uttar Pradesh', description: 'One of the largest residential universities in Asia.' },
    { name: 'University of Hyderabad (UoH)', location: 'Telangana', description: 'Leading research university in South India.' },
    { name: 'Aligarh Muslim University (AMU)', location: 'Uttar Pradesh', description: 'Historic central university.' },
    { name: 'Jamia Millia Islamia', location: 'Delhi', description: 'Top-ranked central university.' },
    { name: 'Anna University', location: 'Tamil Nadu', description: 'Technical education leader in South India.' },
    { name: 'Jadavpur University', location: 'West Bengal', description: 'Premier university for engineering and arts.' },
    { name: 'Savtribai Phule Pune University', location: 'Maharashtra', description: 'Oxford of the East.' },
    { name: 'University of Mumbai', location: 'Maharashtra', description: 'One of the oldest and largest universities.' },
    { name: 'University of Madras', location: 'Tamil Nadu', description: 'Historic university in South India.' },
    { name: 'Osmania University', location: 'Telangana', description: 'Historic institution in Hyderabad.' },
    { name: 'Panjab University', location: 'Chandigarh', description: 'Leading university in North India.' },

    // Private Giants
    { name: 'BITS Pilani (Dubai Campus)', location: 'Dubai, UAE', description: 'International campus of the premier Indian institute.' },
    { name: 'VIT Vellore', location: 'Tamil Nadu', description: 'Massive private university known for tech.' },
    { name: 'Manipal Academy of Higher Education', location: 'Karnataka', description: 'Premier private university system.' },
    { name: 'SRM Institute of Science and Technology', location: 'Tamil Nadu', description: 'Top private university hub.' },
    { name: 'BITS Pilani', location: 'Rajasthan', description: 'Top private engineering university.' }
  ];

  // --- SCHOOLS (Curated List of Top Schools) ---
  const schools = [
    { name: 'Delhi Public School, R.K. Puram', location: 'New Delhi', board: 'CBSE', description: 'Legendary academic performance.' },
    { name: 'The Doon School', location: 'Dehradun', board: 'CBSE', description: 'Indias most prestigious boarding school.' },
    { name: 'Mayo College', location: 'Ajmer', board: 'CBSE', description: 'Historic school for holistic growth.' },
    { name: 'Welham Girls School', location: 'Dehradun', board: 'ICSE', description: 'Top girls boarding school.' },
    { name: 'La Martiniere for Boys', location: 'Kolkata', board: 'ICSE', description: 'Prestigious colonial-era school.' },
    { name: 'Bishop Cotton Boys School', location: 'Bengaluru', board: 'ICSE', description: 'Leading school in South India.' },
    { name: 'St. Xavier’s Collegiate School', location: 'Kolkata', board: 'ICSE', description: 'Known for discipline and ethics.' },
    { name: 'Delhi Public School, Mathura Road', location: 'New Delhi', board: 'CBSE', description: 'Original DPS campus.' },
    { name: 'The Shri Ram School', location: 'Gurgaon', board: 'ICSE', description: 'Modern education leader.' },
    { name: 'Cathedral and John Connon School', location: 'Mumbai', board: 'ICSE', description: 'Elite school in South Mumbai.' },
    { name: 'Campian School', location: 'Mumbai', board: 'ICSE', description: 'Renowned for all-round development.' },
    { name: 'St. John’s High School', location: 'Chandigarh', board: 'CBSE', description: 'Leading school in North India.' },
    { name: 'Loyola School', location: 'Jamshedpur', board: 'ICSE', description: 'Premier school in Jharkhand.' },
    { name: 'Sanskriti School', location: 'New Delhi', board: 'CBSE', description: 'Preferred by civil servants families.' },
    { name: 'Loreto House', location: 'Kolkata', board: 'ICSE', description: 'Prestigious girls school.' },
    { name: 'The Heritage School', location: 'Gurgaon', board: 'CBSE', description: 'Leading in experiential learning.' },
    { name: 'Step by Step School', location: 'Noida', board: 'CBSE', description: 'Top-tier private school in NCR.' },
    { name: 'Inventure Academy', location: 'Bengaluru', board: 'ICSE', description: 'Innovative and inclusive school.' },
    { name: 'Mallya Aditi International', location: 'Bengaluru', board: 'ICSE', description: 'Known for creative education.' },
    { name: 'Treamis World School', location: 'Bengaluru', board: 'CBSE', description: 'Holistic development focus.' },
    { name: 'Chirec International', location: 'Hyderabad', board: 'CBSE', description: 'Top school in Hyderabad.' },
    { name: 'The Hyderabad Public School', location: 'Hyderabad', board: 'CBSE', description: 'Prestigious institution with alumni like Satya Nadella.' },
    { name: 'Gitanjali Senior School', location: 'Hyderabad', board: 'CBSE', description: 'Consistent academic leader.' },
    { name: 'Padma Seshadri Bala Bhavan (PSBB)', location: 'Chennai', board: 'CBSE', description: 'Academic powerhouse in Chennai.' },
    { name: 'Chettinad Vidyashram', location: 'Chennai', board: 'CBSE', description: 'Leading school in South India.' },
    { name: 'Dav Public School, Chandrasekharpur', location: 'Bhubaneswar', board: 'CBSE', description: 'Top school in Odisha.' },
    { name: 'Sai International School', location: 'Bhubaneswar', board: 'CBSE', description: 'Award-winning international school.' },
    { name: 'Scindia School', location: 'Gwalior', board: 'CBSE', description: 'Top boys boarding school on a fort.' },
    { name: 'Woodstock School', location: 'Mussoorie', board: 'IB', description: 'Oldest international boarding school.' },
    { name: 'Lawrence School, Sanawar', location: 'Himachal Pradesh', board: 'CBSE', description: 'Prestigious co-ed boarding school.' },
    { name: 'Lawrence School, Lovedale', location: 'Ooty', board: 'CBSE', description: 'Leading school in South India.' },
    { name: 'Pinegrove School', location: 'Subathu', board: 'CBSE', description: 'Premier residential school.' },
    { name: 'Sherwood College', location: 'Nainital', board: 'ICSE', description: 'Historic boarding school.' },
    { name: 'Bishop Cotton Girls School', location: 'Bengaluru', board: 'ICSE', description: 'Leading girls school.' },
    { name: 'Mount St. Mary’s School', location: 'New Delhi', board: 'CBSE', description: 'Renowned Catholic school.' },
    { name: 'Don Bosco School', location: 'Kolkata', board: 'ICSE', description: 'Leading institution in East India.' }
  ];

  // --- EXAMS (All major Indian entrance exams) ---
  const exams = [
    { name: 'JEE Main', authority: 'NTA', category: 'Engineering' },
    { name: 'JEE Advanced', authority: 'IITs', category: 'Engineering' },
    { name: 'NEET UG', authority: 'NTA', category: 'Medical' },
    { name: 'CAT', authority: 'IIMs', category: 'Management' },
    { name: 'CLAT', authority: 'Consortium of NLUs', category: 'Law' },
    { name: 'UPSC CSE', authority: 'UPSC', category: 'Government' },
    { name: 'NDA', authority: 'UPSC', category: 'Government' },
    { name: 'SSC CGL', authority: 'SSC', category: 'Government' },
    { name: 'GATE', authority: 'IITs/IISc', category: 'Engineering' },
    { name: 'XAT', authority: 'XLRI', category: 'Management' },
    { name: 'CMAT', authority: 'NTA', category: 'Management' },
    { name: 'SNAP', authority: 'Symbiosis', category: 'Management' },
    { name: 'NMAT', authority: 'GMAC', category: 'Management' },
    { name: 'CUET UG', authority: 'NTA', category: 'University' },
    { name: 'AILET', authority: 'NLU Delhi', category: 'Law' },
    { name: 'MH CET Law', authority: 'State CET Cell', category: 'Law' },
    { name: 'NIFT Entrance', authority: 'NIFT', category: 'Design' },
    { name: 'NID DAT', authority: 'NID', category: 'Design' },
    { name: 'UCEED', authority: 'IIT Bombay', category: 'Design' },
    { name: 'CEED', authority: 'IIT Bombay', category: 'Design' },
    { name: 'BITSAT', authority: 'BITS Pilani', category: 'Engineering' },
    { name: 'VITEEE', authority: 'VIT University', category: 'Engineering' },
    { name: 'SRMJEEE', authority: 'SRM Institute', category: 'Engineering' },
    { name: 'COMEDK UGET', authority: 'COMEDK', category: 'Engineering' },
    { name: 'WBJEE', authority: 'WBJEEB', category: 'Engineering' },
    { name: 'MHT CET', authority: 'State CET Cell', category: 'Engineering' },
    { name: 'KCET', authority: 'KEA', category: 'Engineering' },
    { name: 'TS EAMCET', authority: 'TSCHE', category: 'Engineering' },
    { name: 'AP EAPCET', authority: 'APSCHE', category: 'Engineering' },
    { name: 'GUJCET', authority: 'GSEB', category: 'Engineering' },
    { name: 'KEAM', authority: 'CEE Kerala', category: 'Engineering' },
    { name: 'TNEA', authority: 'Anna University', category: 'Engineering' },
    { name: 'UGC NET', authority: 'NTA', category: 'Research' },
    { name: 'CSIR NET', authority: 'NTA', category: 'Research' },
    { name: 'JAM', authority: 'IITs', category: 'Research' },
    { name: 'TIFR GS', authority: 'TIFR', category: 'Research' },
    { name: 'JEST', authority: 'SERB', category: 'Research' },
    { name: 'NEST', authority: 'NISER', category: 'Research' },
    { name: 'ICAR AIEEA', authority: 'NTA', category: 'Agriculture' },
    { name: 'NATA', authority: 'CoA', category: 'Architecture' },
    { name: 'CLAT PG', authority: 'Consortium of NLUs', category: 'Law' },
    { name: 'NEET PG', authority: 'NBE', category: 'Medical' },
    { name: 'INI CET', authority: 'AIIMS', category: 'Medical' },
    { name: 'AIBE', authority: 'BCI', category: 'Law' },
    { name: 'AFCAT', authority: 'IAF', category: 'Government' },
    { name: 'IBPS PO', authority: 'IBPS', category: 'Banking' },
    { name: 'SBI PO', authority: 'SBI', category: 'Banking' },
    { name: 'RBI Grade B', authority: 'RBI', category: 'Banking' },
    { name: 'MAT', authority: 'AIMA', category: 'Management' },
    { name: 'ATMA', authority: 'AIMS', category: 'Management' },
    { name: 'GRE', authority: 'ETS', category: 'Study Abroad' },
    { name: 'GMAT', authority: 'GMAC', category: 'Study Abroad' },
    { name: 'IELTS', authority: 'IDP/BC', category: 'Study Abroad' },
    { name: 'TOEFL', authority: 'ETS', category: 'Study Abroad' },
    { name: 'SAT', authority: 'College Board', category: 'Study Abroad' }
  ];

  await pushTable('colleges', colleges);
  await pushTable('schools', schools);
  await pushTable('exams', exams);

  console.log('✅ Deep data enrichment completed!');
}

pushData();
