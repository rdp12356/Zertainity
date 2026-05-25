-- ========================================================
-- CLEAN DATABASE: Remove all mock data
-- ========================================================
TRUNCATE careers, exams, schools, colleges CASCADE;

-- ========================================================
-- POPULATE REAL DATA: Curated Indian Educational Data
-- ========================================================

-- 1. REAL CAREERS (High Demand in India)
INSERT INTO careers (name, category, demand, education, official_source_url) VALUES
('Software Development Engineer (SDE)', 'Technology', 'Very High', 'B.Tech/B.E. in CS/IT', 'https://ncs.gov.in'),
('Data Scientist', 'Technology', 'Very High', 'B.Tech/M.Sc in Data Science/Stats', 'https://ncs.gov.in'),
('IAS Officer (Civil Services)', 'Government', 'Very High', 'Any Graduate + UPSC CSE', 'https://upsc.gov.in'),
('Chartered Accountant (CA)', 'Business', 'High', 'B.Com + ICAI Certification', 'https://icai.org'),
('Medical Doctor (MBBS)', 'Healthcare', 'Very High', 'MBBS + NEET PG', 'https://nmc.org.in'),
('Architect', 'Engineering', 'High', 'B.Arch + COA Registration', 'https://coa.gov.in'),
('Management Consultant', 'Business', 'High', 'MBA from Top Tier B-School', 'https://ncs.gov.in'),
('Digital Marketing Specialist', 'Business', 'High', 'Any Graduate + Certification', 'https://ncs.gov.in'),
('Investment Banker', 'Business', 'High', 'MBA (Finance) / CFA', 'https://ncs.gov.in'),
('Commercial Pilot', 'Aviation', 'Medium', '12th (PCM) + CPL License', 'https://dgca.gov.in'),
('Full Stack Web Developer', 'Technology', 'Very High', 'B.Tech/BCA/Any Graduate', 'https://ncs.gov.in'),
('Blockchain Developer', 'Technology', 'High', 'B.Tech/M.Tech', 'https://ncs.gov.in'),
('Cybersecurity Analyst', 'Technology', 'Very High', 'B.Tech/BCA + Security Certs', 'https://ncs.gov.in');

-- 2. REAL EXAMS (National & State Level)
INSERT INTO exams (name, category, authority, exam_window, official_website) VALUES
('JEE Main', 'Engineering', 'National Testing Agency (NTA)', 'January & April', 'https://jeemain.nta.nic.in'),
('JEE Advanced', 'Engineering', 'IITs (Rotational)', 'May/June', 'https://jeeadv.ac.in'),
('NEET UG', 'Medical', 'National Testing Agency (NTA)', 'May', 'https://neet.nta.nic.in'),
('CAT', 'Management', 'IIMs (Rotational)', 'November', 'https://iimcat.ac.in'),
('UPSC Civil Services', 'Government', 'Union Public Service Commission', 'June (Prelims)', 'https://upsc.gov.in'),
('CLAT', 'Law', 'Consortium of NLUs', 'December', 'https://consortiumofnlus.ac.in'),
('GATE', 'Engineering/Science', 'IITs/IISc', 'February', 'https://gate.iitk.ac.in'),
('NDA & NA', 'Defense', 'UPSC', 'April & September', 'https://upsc.gov.in'),
('BITSAT', 'Engineering', 'BITS Pilani', 'May/June', 'https://bitsadmission.com'),
('CUET UG', 'University Admission', 'National Testing Agency (NTA)', 'May/June', 'https://cuet.samarth.ac.in');

-- 3. REAL SCHOOLS (Top Tier Boards)
INSERT INTO schools (name, location, board, rating, website) VALUES
('Delhi Public School (DPS), R.K. Puram', 'New Delhi', 'CBSE', 4.9, 'https://dpsrkp.net'),
('The Doon School', 'Dehradun', 'IB/ICSE', 4.9, 'https://doonschool.com'),
('La Martiniere for Boys', 'Kolkata', 'ICSE/ISC', 4.8, 'https://lamartiniereforboys.co'),
('Campion School', 'Mumbai', 'ICSE', 4.8, 'https://campionschool.in'),
('St. Xavier''s Collegiate School', 'Kolkata', 'ICSE/WB Board', 4.8, 'https://sxcs.edu.in'),
('Modern School, Barakhamba Road', 'New Delhi', 'CBSE', 4.7, 'https://modernschool.net'),
('Mayo College', 'Ajmer', 'CBSE', 4.8, 'https://mayocollege.com'),
('Bishop Cotton Boys'' School', 'Bangalore', 'ICSE', 4.7, 'https://bishopcottonboysschool.edu.in'),
('Loreto House', 'Kolkata', 'ICSE', 4.7, 'https://loretohouse.edu.in'),
('Dhirubhai Ambani International School', 'Mumbai', 'IB/IGCSE', 4.9, 'https://dais.edu.in');

-- 4. REAL COLLEGES (Top NIRF Ranked)
INSERT INTO colleges (name, location, website, rating, rank) VALUES
('Indian Institute of Technology (IIT) Madras', 'Chennai', 'https://iitm.ac.in', 4.9, '#1 (Engineering)'),
('Indian Institute of Technology (IIT) Bombay', 'Mumbai', 'https://iitb.ac.in', 4.9, '#2 (Engineering)'),
('Indian Institute of Science (IISc)', 'Bangalore', 'https://iisc.ac.in', 4.9, '#1 (University)'),
('All India Institute of Medical Sciences (AIIMS)', 'New Delhi', 'https://aiims.edu', 4.9, '#1 (Medical)'),
('Indian Institute of Management (IIM) Ahmedabad', 'Ahmedabad', 'https://iima.ac.in', 4.9, '#1 (Management)'),
('St. Stephen''s College', 'New Delhi', 'https://ststephens.edu', 4.8, '#1 (Arts)'),
('Miranda House', 'New Delhi', 'https://mirandahouse.ac.in', 4.8, '#1 (College)'),
('National Law School of India University (NLSIU)', 'Bangalore', 'https://nls.ac.in', 4.8, '#1 (Law)'),
('Birla Institute of Technology and Science (BITS) Pilani', 'Pilani', 'https://bits-pilani.ac.in', 4.8, '#5 (Engineering)'),
('Vellore Institute of Technology (VIT)', 'Vellore', 'https://vit.ac.in', 4.7, '#10 (Engineering)');
;
