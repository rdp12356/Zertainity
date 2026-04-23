-- =========================================================================
-- ZERTAINITY - SEED DATA: COLLEGES AND SCHOOLS
-- Run this in Supabase SQL Editor to populate the database
-- =========================================================================

-- =========================================================================
-- PART 1: TOP INDIAN ENGINEERING COLLEGES
-- =========================================================================

INSERT INTO public.colleges (name, location, latitude, longitude, courses, cutoffs, description) VALUES
-- IITs
('Indian Institute of Technology Bombay', 'Mumbai, Maharashtra', 19.1334, 72.9213, ARRAY['B.Tech', 'M.Tech', 'PhD', 'B.Des', 'M.Sc', 'MBA'], 'JEE Advanced: Top 2500 rank', 'IIT Bombay is one of the premier engineering institutes in India known for excellence in technical education and research.'),
('Indian Institute of Technology Delhi', 'New Delhi', 28.5452, 77.1926, ARRAY['B.Tech', 'M.Tech', 'PhD', 'MBA', 'M.Sc'], 'JEE Advanced: Top 3000 rank', 'IIT Delhi is a leading technical university with world-class research facilities and industry connections.'),
('Indian Institute of Technology Madras', 'Chennai, Tamil Nadu', 12.9922, 80.2336, ARRAY['B.Tech', 'M.Tech', 'PhD', 'M.Sc', 'MBA'], 'JEE Advanced: Top 2500 rank', 'IIT Madras is known for excellent academics and research in engineering and technology.'),
('Indian Institute of Technology Kanpur', 'Kanpur, Uttar Pradesh', 26.5123, 80.2329, ARRAY['B.Tech', 'M.Tech', 'PhD', 'M.Sc'], 'JEE Advanced: Top 3500 rank', 'IIT Kanpur is renowned for its rigorous academic programs and research output.'),
('Indian Institute of Technology Kharagpur', 'Kharagpur, West Bengal', 22.3149, 87.3105, ARRAY['B.Tech', 'M.Tech', 'PhD', 'M.Sc', 'MBA'], 'JEE Advanced: Top 4000 rank', 'IIT Kharagpur is known for its vast campus and excellent placement records.'),
('Indian Institute of Technology Roorkee', 'Roorkee, Uttarakhand', 29.8650, 77.8936, ARRAY['B.Tech', 'M.Tech', 'PhD', 'M.Sc'], 'JEE Advanced: Top 3500 rank', 'IIT Roorkee is one of the oldest technical institutions in Asia.'),
('Indian Institute of Technology Guwahati', 'Guwahati, Assam', 26.1893, 91.6913, ARRAY['B.Tech', 'M.Tech', 'PhD', 'M.Sc'], 'JEE Advanced: Top 4000 rank', 'IIT Guwahati is known for its beautiful campus and excellent academic programs.'),
('Indian Institute of Technology Hyderabad', 'Hyderabad, Telangana', 17.5958, 78.1312, ARRAY['B.Tech', 'M.Tech', 'PhD', 'M.Sc'], 'JEE Advanced: Top 4500 rank', 'IIT Hyderabad is known for interdisciplinary research and innovation.'),
('Indian Institute of Technology Varanasi', 'Varanasi, Uttar Pradesh', 25.2582, 82.9915, ARRAY['B.Tech', 'M.Tech', 'PhD', 'B.Pharm', 'M.Pharm'], 'JEE Advanced: Top 6000 rank', 'IIT BHU combines ancient heritage with modern technical education.'),
('Indian Institute of Technology Indore', 'Indore, Madhya Pradesh', 22.5204, 75.9206, ARRAY['B.Tech', 'M.Tech', 'PhD', 'M.Sc'], 'JEE Advanced: Top 5000 rank', 'IIT Indore is known for its research-oriented approach and excellent faculty.'),

-- NITs
('National Institute of Technology Trichy', 'Tiruchirappalli, Tamil Nadu', 10.7607, 78.6922, ARRAY['B.Tech', 'M.Tech', 'PhD'], 'JEE Main: Top 20000 rank', 'NIT Trichy is one of the top NITs in India with excellent placement records.'),
('National Institute of Technology Surathkal', 'Mangalore, Karnataka', 12.7815, 74.8013, ARRAY['B.Tech', 'M.Tech', 'PhD'], 'JEE Main: Top 25000 rank', 'NITK Surathkal is known for its strong engineering programs and beachside campus.'),
('National Institute of Technology Warangal', 'Warangal, Telangana', 17.9784, 79.5941, ARRAY['B.Tech', 'M.Tech', 'PhD'], 'JEE Main: Top 30000 rank', 'NIT Warangal is known for its excellent academic infrastructure.'),
('National Institute of Technology Calicut', 'Kozhikode, Kerala', 11.2791, 75.6008, ARRAY['B.Tech', 'M.Tech', 'PhD'], 'JEE Main: Top 25000 rank', 'NIT Calicut is known for its rigorous academic curriculum.'),
('National Institute of Technology Rourkela', 'Rourkela, Odisha', 22.2535, 84.9041, ARRAY['B.Tech', 'M.Tech', 'PhD'], 'JEE Main: Top 30000 rank', 'NIT Rourkela offers excellent engineering education with good placement opportunities.'),
('National Institute of Technology Kurukshetra', 'Kurukshetra, Haryana', 29.9695, 76.8523, ARRAY['B.Tech', 'M.Tech', 'PhD'], 'JEE Main: Top 35000 rank', 'NIT Kurukshetra is known for its strong academic programs.'),
('National Institute of Technology Goa', 'Farmagudi, Goa', 15.4065, 73.9676, ARRAY['B.Tech', 'M.Tech', 'PhD'], 'JEE Main: Top 40000 rank', 'NIT Goa offers quality engineering education with modern facilities.'),
('National Institute of Technology Puducherry', 'Puducherry', 11.9431, 79.8311, ARRAY['B.Tech', 'M.Tech'], 'JEE Main: Top 45000 rank', 'NIT Puducherry provides excellent engineering education in a serene environment.'),

-- IIITs
('International Institute of Information Technology Hyderabad', 'Hyderabad, Telangana', 17.4457, 78.3497, ARRAY['B.Tech', 'M.Tech', 'PhD', 'M.Sc'], 'JEE Main: Top 15000 rank', 'IIIT Hyderabad is known for its excellence in IT and computer science.'),
('International Institute of Information Technology Bangalore', 'Bengaluru, Karnataka', 12.9157, 77.6676, ARRAY['B.Tech', 'M.Tech', 'PhD'], 'JEE Main: Top 20000 rank', 'IIIT Bangalore is a premier institute for IT and software engineering.'),
('International Institute of Information Technology Allahabad', 'Prayagraj, Uttar Pradesh', 25.4303, 81.7708, ARRAY['B.Tech', 'M.Tech', 'PhD'], 'JEE Main: Top 25000 rank', 'IIIT Allahabad is known for its strong IT and software programs.'),

-- Top Private Engineering Colleges
('Birla Institute of Technology and Science Pilani', 'Pilani, Rajasthan', 28.3678, 75.5867, ARRAY['B.Tech', 'M.Tech', 'PhD', 'MBA'], 'JEE Main: Top 15000 rank or BITSAT', 'BITS Pilani is a deemed university known for its rigorous academics and placements.'),
('Vellore Institute of Technology', 'Vellore, Tamil Nadu', 12.9585, 79.1564, ARRAY['B.Tech', 'M.Tech', 'PhD', 'MBA'], 'JEE Main: Top 50000 rank or VITEEE', 'VIT is one of the largest private engineering colleges in India.'),
('Anna University', 'Chennai, Tamil Nadu', 13.0827, 80.2707, ARRAY['B.Tech', 'M.Tech', 'PhD'], 'Tamil Nadu State Rank: Top 500', 'Anna University is a premier technical university in Tamil Nadu.'),
('Jadavpur University', 'Kolkata, West Bengal', 22.4949, 88.3709, ARRAY['B.Tech', 'M.Tech', 'PhD', 'B.Sc', 'M.Sc'], 'JEE Main: Top 10000 rank', 'Jadavpur University is known for its excellent engineering programs.'),
('Thapar Institute of Engineering and Technology', 'Patiala, Punjab', 30.3529, 76.3626, ARRAY['B.Tech', 'M.Tech', 'PhD'], 'JEE Main: Top 30000 rank', 'Thapar University is known for its strong industry connections.'),
('Manipal Academy of Higher Education', 'Manipal, Karnataka', 13.3389, 74.7903, ARRAY['B.Tech', 'M.Tech', 'MBBS', 'B.Pharm', 'MBA'], 'MET or Class 12 marks', 'Manipal is a deemed university known for diverse programs.'),
('SRM Institute of Science and Technology', 'Chennai, Tamil Nadu', 13.0904, 80.2747, ARRAY['B.Tech', 'M.Tech', 'MBBS', 'B.Pharm', 'MBA'], 'SRMJEE or Class 12 marks', 'SRM is one of the largest private universities in India.'),
('Amrita Vishwa Vidyapeetham', 'Coimbatore, Tamil Nadu', 11.0468, 76.9287, ARRAY['B.Tech', 'M.Tech', 'MBBS', 'B.Sc', 'MBA'], 'AEEE or Class 12 marks', 'Amrita is a deemed university known for its excellent research output.'),

-- Medical Colleges
('All India Institute of Medical Sciences New Delhi', 'New Delhi', 28.5672, 77.2100, ARRAY['MBBS', 'MD', 'MS', 'PhD', 'B.Sc Nursing'], 'NEET UG: Top 100 rank', 'AIIMS New Delhi is the premier medical college in India.'),
('Post Graduate Institute of Medical Education and Research', 'Chandigarh', 30.7644, 76.7881, ARRAY['MBBS', 'MD', 'MS', 'DM', 'M.Ch', 'PhD'], 'NEET PG: Top 100 rank', 'PGIMER Chandigarh is one of the top medical research institutes.'),
('Christian Medical College Vellore', 'Vellore, Tamil Nadu', 12.9249, 79.1327, ARRAY['MBBS', 'MD', 'MS', 'B.Sc Nursing', 'Diploma'], 'NEET UG: Top 1000 rank', 'CMC Vellore is a premier medical college with excellent healthcare.'),
('National Institute of Mental Health and Neurosciences', 'Bengaluru, Karnataka', 12.9439, 77.6236, ARRAY['MBBS', 'MD', 'DM', 'M.Ch', 'PhD'], 'NEET PG: Top 500 rank', 'NIMHANS is the top neuroscience institute in India.'),
('Sanjay Gandhi Postgraduate Institute of Medical Sciences', 'Lucknow, Uttar Pradesh', 26.8467, 80.9462, ARRAY['MBBS', 'MD', 'MS', 'DM', 'M.Ch', 'PhD'], 'NEET PG: Top 500 rank', 'SGPGIMS is a premier medical institute in North India.'),
('Amrita Institute of Medical Sciences', 'Kochi, Kerala', 10.0319, 76.3283, ARRAY['MBBS', 'MD', 'MS', 'DM', 'M.Ch'], 'NEET UG: Top 5000 rank', 'Amrita Kochi is a super-specialty medical college.'),
('King George Medical University', 'Lucknow, Uttar Pradesh', 26.8381, 80.9938, ARRAY['MBBS', 'MD', 'MS', 'DM', 'M.Ch', 'BDS'], 'NEET UG: Top 5000 rank', 'KGMU is a leading medical university in North India.'),
('Lady Hardinge Medical College', 'New Delhi', 28.6315, 77.2067, ARRAY['MBBS', 'MD', 'MS', 'B.Sc Nursing'], 'NEET UG: Top 1000 rank', 'LHMC is a premier medical college for women in India.'),

-- Law Colleges
('National Law School of India University', 'Bengaluru, Karnataka', 12.9352, 77.6245, ARRAY['BA LLB', 'LLB', 'LLM', 'PhD'], 'CLAT: Top 100 rank', 'NLSIU Bangalore is the top law college in India.'),
('National Law University', 'Delhi', 28.6932, 77.2101, ARRAY['BA LLB', 'LLB', 'LLM', 'PhD'], 'CLAT: Top 500 rank', 'NLU Delhi is one of the top law schools in India.'),
('Symbiosis International University', 'Pune, Maharashtra', 18.5377, 73.9095, ARRAY['BA LLB', 'LLB', 'LLM', 'MBA'], 'SET or CLAT', 'Symbiosis is known for its excellent law programs.'),
('NALSAR University of Law', 'Hyderabad, Telangana', 17.4483, 78.5489, ARRAY['BA LLB', 'LLB', 'LLM', 'PhD'], 'CLAT: Top 300 rank', 'NALSAR is one of the top law universities in India.'),
('West Bengal National University of Juridical Sciences', 'Kolkata, West Bengal', 22.4949, 88.3709, ARRAY['BA LLB', 'LLB', 'LLM', 'PhD'], 'CLAT: Top 200 rank', 'WBNUJS is a premier law university in East India.'),

-- Management Colleges
('Indian Institute of Management Ahmedabad', 'Ahmedabad, Gujarat', 23.0225, 72.5714, ARRAY['MBA', 'PGP', 'Executive MBA', 'FPM'], 'CAT: Top 99 percentile', 'IIM Ahmedabad is the top B-school in India.'),
('Indian Institute of Management Bangalore', 'Bengaluru, Karnataka', 12.9141, 77.6102, ARRAY['MBA', 'PGP', 'EMBA', 'FPM'], 'CAT: Top 99 percentile', 'IIM Bangalore is one of the top B-schools in Asia.'),
('Indian Institute of Management Calcutta', 'Kolkata, West Bengal', 22.4952, 88.3662, ARRAY['MBA', 'PGP', 'EMBA', 'FPM'], 'CAT: Top 99 percentile', 'IIM Calcutta is known for its finance and analytics programs.'),
('Indian Institute of Management Kozhikode', 'Kozhikode, Kerala', 11.2499, 75.7656, ARRAY['MBA', 'PGP', 'EMBA', 'FPM'], 'CAT: Top 95 percentile', 'IIM Kozhikode is known for its liberal environment.'),
('XLRI Jamshedpur', 'Jamshedpur, Jharkhand', 22.8046, 86.2024, ARRAY['MBA', 'PGDM', 'Executive GDPM'], 'XAT: Top 95 percentile', 'XLRI is a premier B-school known for HR and finance.'),
('SP Jain Institute of Management and Research', 'Mumbai, Maharashtra', 19.2293, 72.8393, ARRAY['MBA', 'PGDM'], 'CAT: Top 95 percentile', 'SPJIMR is known for its innovative pedagogy.'),
('Jamnalal Bajaj Institute of Management Studies', 'Mumbai, Maharashtra', 18.9438, 72.8231, ARRAY['MBA', 'PGDM'], 'CAT: Top 98 percentile', 'JBIMS is the top B-school in Maharashtra.'),
('Management Development Institute', 'Gurgaon, Haryana', 28.4273, 77.0407, ARRAY['MBA', 'PGDM', 'Executive MBA'], 'CAT: Top 95 percentile', 'MDI Gurgaon is known for its corporate connections.'),

-- Commerce & Arts Colleges
('Shri Ram College of Commerce', 'Delhi', 28.7368, 77.1757, ARRAY['B.Com', 'M.Com', 'MBA', 'BBA'], 'CUET: Top 1000 rank', 'SRCC is the top commerce college in India.'),
('Lady Shri Ram College for Women', 'New Delhi', 28.7368, 77.1993, ARRAY['BA', 'B.Com', 'B.Sc', 'MA'], 'CUET: Top 500 rank', 'LSR is one of the top arts colleges for women.'),
('St. Stephen''s College', 'New Delhi', 28.6934, 77.2098, ARRAY['BA', 'B.Sc', 'MA', 'M.Sc'], 'CUET: Top 500 rank', 'St. Stephen''s is a premier liberal arts college.'),
('Delhi School of Economics', 'New Delhi', 28.6915, 77.2056, ARRAY['B.A. Economics', 'M.A. Economics', 'M.Phil', 'PhD'], 'CUET: Top 300 rank', 'DSE is the top economics department in India.'),
('Madras Christian College', 'Chennai, Tamil Nadu', 13.0329, 80.2538, ARRAY['BA', 'B.Sc', 'B.Com', 'MA', 'M.Sc'], 'Class 12 marks', 'MCC is one of the oldest and most prestigious colleges.'),
('St. Joseph''s College of Commerce', 'Bengaluru, Karnataka', 12.9355, 77.6267, ARRAY['B.Com', 'BBA', 'M.Com'], 'Class 12 marks', 'SJCC is a top commerce college in Karnataka.'),

-- Architecture Colleges
('School of Planning and Architecture Delhi', 'New Delhi', 28.6927, 77.2107, ARRAY['B.Arch', 'M.Arch', 'M.Plan', 'PhD'], 'NATA: Top 500 rank', 'SPA Delhi is the top architecture college in India.'),
('College of Engineering Guindy', 'Chennai, Tamil Nadu', 13.0833, 80.2667, ARRAY['B.E', 'M.E', 'PhD', 'B.Arch'], 'Tamil Nadu EA: Top 500 rank', 'CEG is the oldest engineering college in South Asia.'),
('School of Planning and Architecture Vijayawada', 'Vijayawada, Andhra Pradesh', 16.5062, 80.6376, ARRAY['B.Arch', 'B.Plan', 'M.Arch', 'M.Plan'], 'NATA: Top 1000 rank', 'SPA Vijayawada is known for planning and architecture programs.'),
('National Institute of Design', 'Ahmedabad, Gujarat', 23.0384, 72.5649, ARRAY['B.Des', 'M.Des', 'PhD'], 'NID DAT: Top 200 rank', 'NID is the premier design institute in India.'),
('MIT Institute of Design', 'Pune, Maharashtra', 18.5382, 73.9335, ARRAY['B.Des', 'M.Des'], 'MITID DAT', 'MITID is a leading design institute in India.'),

-- International Colleges (with branch campuses in India)
(' Manipal University Jaipur', 'Jaipur, Rajasthan', 26.8828, 75.5680, ARRAY['B.Tech', 'BBA', 'MBBS', 'B.Sc', 'M.Tech'], 'MET or Class 12 marks', 'Manipal Jaipur offers diverse programs with excellent infrastructure.'),
('VIT University Vellore', 'Vellore, Tamil Nadu', 12.9585, 79.1564, ARRAY['B.Tech', 'M.Tech', 'B.Sc', 'M.Sc', 'MBA'], 'VITEEE or Class 12 marks', 'VIT Vellore is known for its excellent placement record.'),
('Lovely Professional University', 'Jalandhar, Punjab', 31.2497, 75.5530, ARRAY['B.Tech', 'BBA', 'B.Sc', 'MBA', 'B.Arch', 'MBBS'], 'LPUNEST or Class 12 marks', 'LPU is one of the largest universities in India.'),
('Chandigarh University', 'Chandigarh', 30.6913, 76.7655, ARRAY['B.Tech', 'BBA', 'BCA', 'MBA', 'B.Arch'], 'CUCET or Class 12 marks', 'CU is known for its excellent placement records.'),
('University of Petroleum and Energy Studies', 'Dehradun, Uttarakhand', 30.3402, 78.0671, ARRAY['B.Tech', 'BBA', 'MBA', 'B.Sc', 'M.Sc'], 'UPESAT or Class 12 marks', 'UPES is known for its energy and engineering programs.')
ON CONFLICT DO NOTHING;

-- =========================================================================
-- PART 2: TOP INDIAN SCHOOLS (CBSE/ICSE)
-- =========================================================================

INSERT INTO public.schools (name, location, latitude, longitude, board, grade_11_cutoff, description) VALUES
-- Delhi NCR Top Schools
('Delhi Public School R.K. Puram', 'New Delhi', 28.5692, 77.1170, 'CBSE', 95, 'DPS R.K. Puram is one of the top CBSE schools in India with excellent academics.'),
('Delhi Public School Mathura Road', 'New Delhi', 28.5742, 77.2889, 'CBSE', 93, 'DPS Mathura Road is known for its excellent academic record and infrastructure.'),
('Mayo College', 'Ajmer, Rajasthan', 26.4631, 74.6409, 'CBSE', 90, 'Mayo College is one of the oldest and most prestigious boarding schools in India.'),
('The Cathedral and John Connon School', 'Mumbai, Maharashtra', 18.9218, 72.8332, 'ICSE', 92, 'Cathedral School is one of the oldest and most prestigious schools in India.'),
('St. Francis School', 'Durgapur, West Bengal', 23.5204, 87.3119, 'ICSE', 88, 'St. Francis is known for its excellent academic standards.'),
('Vasant Valley School', 'New Delhi', 28.6014, 77.1029, 'CBSE', 92, 'Vasant Valley is one of the top CBSE schools in Delhi.'),
('Modern School Barakhamba Road', 'New Delhi', 28.6349, 77.2199, 'CBSE', 93, 'Modern School is a prestigious school in central Delhi.'),
('The Indian School', 'Mumbai, Maharashtra', 18.9548, 72.8049, 'ICSE', 90, 'The Indian School is known for its excellent academic record.'),

-- Mumbai Top Schools
('Shri Ram College of Commerce', 'Mumbai, Maharashtra', 19.0760, 72.8777, 'CBSE', 91, 'Shri Ram College is known for commerce education excellence.'),
('Dhirubhai Ambani International School', 'Mumbai, Maharashtra', 19.1070, 72.8267, 'ICSE', 95, 'DAIS is a premium international school with excellent academics.'),
('Bombay Scottish School', 'Mumbai, Maharashtra', 18.9423, 72.8148, 'ICSE', 90, 'Bombay Scottish is one of the oldest and most prestigious schools in Mumbai.'),
('St. Xavier''s School', 'Mumbai, Maharashtra', 18.9428, 72.8238, 'ICSE', 89, 'St. Xavier''s is known for its excellent academic and co-curricular programs.'),
('The J.B. Petit School', 'Mumbai, Maharashtra', 18.9519, 72.8049, 'ICSE', 88, 'J.B. Petit is a premier school for girls in Mumbai.'),
('Sanskriti School', 'Mumbai, Maharashtra', 19.0250, 72.8671, 'CBSE', 92, 'Sanskriti School is known for its holistic education approach.'),

-- Bengaluru Top Schools
('National Public School', 'Bengaluru, Karnataka', 12.9352, 77.6245, 'CBSE', 93, 'NPS is one of the top CBSE schools in Bangalore.'),
('Bishop''s School', 'Bengaluru, Karnataka', 12.9848, 77.5968, 'ICSE', 90, 'Bishop''s School is known for its excellent academic standards.'),
('St. Joseph''s School', 'Bengaluru, Karnataka', 12.9357, 77.6199, 'ICSE', 88, 'St. Joseph''s is a prestigious school in Bangalore.'),
('Jain International School', 'Bengaluru, Karnataka', 13.0356, 77.5971, 'CBSE', 91, 'JIS is known for its excellent academic record.'),
('EuroSchool', 'Bengaluru, Karnataka', 12.9692, 77.7500, 'CBSE', 88, 'EuroSchool is known for its modern teaching methodology.'),

-- Chennai Top Schools
('Lakshmi School', 'Chennai, Tamil Nadu', 13.0827, 80.2707, 'CBSE', 92, 'Lakshmi School is one of the top schools in Chennai.'),
('St. Joseph''s Anglo Indian Higher Secondary School', 'Chennai, Tamil Nadu', 13.0823, 80.2615, 'ICSE', 90, 'St. Joseph''s is known for its excellent academic record.'),
('Don Bosco Matriculation Higher Secondary School', 'Chennai, Tamil Nadu', 13.0735, 80.2875, 'ICSE', 89, 'Don Bosco is known for its discipline and academics.'),
('Lady Andal School', 'Chennai, Tamil Nadu', 13.0831, 80.2629, 'ICSE', 88, 'Lady Andal is a prestigious school for girls in Chennai.'),
('PSBB School', 'Chennai, Tamil Nadu', 13.0820, 80.2750, 'CBSE', 91, 'PSBB is known for its excellent academic standards.'),

-- Kolkata Top Schools
('La Martinière for Boys', 'Kolkata, West Bengal', 22.5410, 88.3561, 'ICSE', 91, 'La Martinière is one of the most prestigious schools in Kolkata.'),
('St. Stephen''s School', 'Kolkata, West Bengal', 22.5389, 88.3548, 'ICSE', 89, 'St. Stephen''s is known for its excellent academic record.'),
('Mahatma Gandhi School', 'Kolkata, West Bengal', 22.5726, 88.3639, 'CBSE', 90, 'MG School is known for its holistic education approach.'),
('Delhi Public School', 'Kolkata, West Bengal', 22.5679, 88.3512, 'CBSE', 92, 'DPS Kolkata is one of the top CBSE schools in East India.'),
('Jodhpur School', 'Kolkata, West Bengal', 22.5023, 88.3651, 'ICSE', 88, 'Jodhpur School is known for its excellent academic standards.'),

-- Hyderabad Top Schools
('Hyderabad Public School', 'Hyderabad, Telangana', 17.4256, 78.4829, 'CBSE', 92, 'HPS is one of the top schools in Hyderabad.'),
('St. Mary''s College', 'Hyderabad, Telangana', 17.4258, 78.4831, 'ICSE', 90, 'St. Mary''s is known for its excellent academic record.'),
('Chirec International School', 'Hyderabad, Telangana', 17.4473, 78.3817, 'IB', 88, 'Chirec offers IB and CBSE curricula with excellent academics.'),
('Oakridge International School', 'Hyderabad, Telangana', 17.4063, 78.5523, 'IB', 90, 'Oakridge is a premium international school in Hyderabad.'),
('Gitanjali Senior School', 'Hyderabad, Telangana', 17.4936, 78.4012, 'CBSE', 91, 'Gitanjali is known for its excellent academic standards.'),

-- Pune Top Schools
('Symbiosis International School', 'Pune, Maharashtra', 18.5382, 73.9335, 'CBSE', 92, 'Symbiosis is known for its excellent academic record.'),
('St. Peter''s School', 'Pune, Maharashtra', 18.4892, 73.8995, 'ICSE', 90, 'St. Peter''s is known for its holistic education approach.'),
('The Bishop''s School', 'Pune, Maharashtra', 18.5167, 73.9356, 'ICSE', 89, 'The Bishop''s School is one of the oldest schools in Pune.'),
('Maharashtra Metro School', 'Pune, Maharashtra', 18.5102, 73.9358, 'CBSE', 87, 'Maharashtra Metro is known for its modern teaching methodology.'),
('St. Mary''s School', 'Pune, Maharashtra', 18.5094, 73.8880, 'ICSE', 88, 'St. Mary''s is known for its excellent academic standards.'),

-- Ahmedabad Top Schools
('St. Xavier''s School', 'Ahmedabad, Gujarat', 23.0384, 72.5649, 'ICSE', 91, 'St. Xavier''s is a premier school in Ahmedabad.'),
('The School of Kalolsavam', 'Ahmedabad, Gujarat', 23.0267, 72.5852, 'CBSE', 89, 'The School of Kalolsavam is known for its excellent academics.'),
('Shri Umiya School', 'Ahmedabad, Gujarat', 23.0572, 72.6344, 'CBSE', 88, 'Shri Umiya School is known for its academic excellence.'),
('Nirma School', 'Ahmedabad, Gujarat', 23.0503, 72.5167, 'CBSE', 92, 'Nirma School is known for its excellent academic record.'),
('Gurukul School', 'Ahmedabad, Gujarat', 23.0567, 72.5892, 'CBSE', 90, 'Gurukul School is known for its holistic education.'),

-- Chandigarh Top Schools
('St. Stephen''s School', 'Chandigarh', 30.7083, 76.7447, 'CBSE', 91, 'St. Stephen''s is a premier school in Chandigarh.'),
('Sacred Heart College', 'Chandigarh', 30.7103, 76.7452, 'ICSE', 89, 'Sacred Heart is known for its excellent academic standards.'),
('MGM School', 'Chandigarh', 30.7201, 76.7643, 'CBSE', 90, 'MGM School is known for its holistic education.'),
('Dhanbad School', 'Chandigarh', 30.7432, 76.7689, 'CBSE', 88, 'Dhanbad School is known for its academic excellence.'),
('Kendriya Vidyalaya', 'Chandigarh', 30.7644, 76.7881, 'CBSE', 87, 'KV Chandigarh is a premier central government school.'),

-- Jaipur Top Schools
('Maharaja''s School', 'Jaipur, Rajasthan', 26.9124, 75.7873, 'CBSE', 92, 'Maharaja''s School is one of the oldest and most prestigious schools in Jaipur.'),
('St. Xavier''s School', 'Jaipur, Rajasthan', 26.9196, 75.7897, 'ICSE', 90, 'St. Xavier''s is known for its excellent academic standards.'),
('St. Teresa''s School', 'Jaipur, Rajasthan', 26.8967, 75.7456, 'CBSE', 89, 'St. Teresa''s is known for its holistic education approach.'),
('Springdales School', 'Jaipur, Rajasthan', 26.8543, 75.8234, 'CBSE', 88, 'Springdales is known for its modern teaching methodology.'),
('Ryan International School', 'Jaipur, Rajasthan', 26.8389, 75.8023, 'CBSE', 87, 'Ryan International is known for its excellent academics.'),

-- Top Boarding Schools
('The Doon School', 'Dehradun, Uttarakhand', 30.3165, 78.0662, 'CBSE', 90, 'The Doon School is one of the most prestigious boarding schools in India.'),
('Welham Girls'' School', 'Dehradun, Uttarakhand', 30.3130, 78.0536, 'ICSE', 88, 'Welham Girls is a premier boarding school for girls.'),
('St. Paul''s School', 'Darjeeling, West Bengal', 27.0419, 88.2658, 'ICSE', 87, 'St. Paul''s is known for its excellent academic record.'),
('St. Joseph''s School', 'Darjeeling, West Bengal', 27.0450, 88.2643, 'ICSE', 86, 'St. Joseph''s is known for its discipline and academics.'),
('Lawrence School Sanawar', 'Sanawar, Himachal Pradesh', 30.1621, 77.9312, 'CBSE', 85, 'Lawrence School Sanawar is one of the oldest boarding schools in India.'),
('RIMT Public School', 'Punjab', 30.8518, 75.6417, 'CBSE', 84, 'RIMT is known for its excellent academic infrastructure.'),
('MGD School', 'Jaipur, Rajasthan', 26.9234, 75.8234, 'CBSE', 86, 'MGD School is known for its academic excellence.'),
('Mayo College Girls School', 'Ajmer, Rajasthan', 26.4631, 74.6409, 'CBSE', 85, 'Mayo Girls is a premier boarding school for girls.')
ON CONFLICT DO NOTHING;

-- =========================================================================
-- PART 3: VERIFY DATA
-- =========================================================================

-- Check total counts
SELECT 
  'Total Colleges' as table_name, COUNT(*) as count FROM public.colleges
UNION ALL
SELECT 
  'Total Schools' as table_name, COUNT(*) as count FROM public.schools;

-- Show sample data
SELECT 'Sample Colleges:' as info;
SELECT name, location, courses[1] as primary_course FROM public.colleges LIMIT 10;

SELECT 'Sample Schools:' as info;
SELECT name, location, board FROM public.schools LIMIT 10;