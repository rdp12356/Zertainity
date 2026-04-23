-- =========================================================================
-- ZERTAINITY - CAREERS TABLE AND SEED DATA
-- Push careers from careersCatalog.ts to database
-- =========================================================================

-- Create careers table
CREATE TABLE IF NOT EXISTS public.careers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  demand TEXT NOT NULL CHECK (demand IN ('Very High', 'High', 'Medium', 'Low')),
  education TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view careers"
ON public.careers
FOR SELECT
USING (true);

-- Admin insert/update/delete policies
CREATE POLICY "Admins can manage careers"
ON public.careers
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Seed careers data from careersCatalog.ts
INSERT INTO public.careers (name, category, demand, education) VALUES
-- Technology
('Software Engineer', 'Technology', 'Very High', 'B.Tech/B.E. Computer Science'),
('Data Scientist', 'Technology', 'Very High', 'B.Tech + Analytics/Statistics'),
('Data Engineer', 'Technology', 'Very High', 'B.Tech/MCA + Big Data'),
('UI/UX Designer', 'Technology', 'High', 'Design Degree/Portfolio'),
('Cybersecurity Analyst', 'Technology', 'Very High', 'B.Tech CS + Security Certifications'),
('Cloud Architect', 'Technology', 'Very High', 'B.Tech + AWS/Azure Certifications'),
('AI/ML Engineer', 'Technology', 'Very High', 'B.Tech/M.Tech AI/ML'),
('DevOps Engineer', 'Technology', 'High', 'B.Tech CS + DevOps Tools'),
('Mobile App Developer', 'Technology', 'High', 'B.Tech CS/BCA'),
('Game Developer', 'Technology', 'Medium', 'B.Tech CS + Game Design'),
('Blockchain Developer', 'Technology', 'High', 'B.Tech CS + Blockchain Auth'),
('Full Stack Developer', 'Technology', 'Very High', 'B.Tech/MCA/Bootcamp'),
('Network Administrator', 'Technology', 'Medium', 'B.Sc/B.Tech + CCNA'),
('Site Reliability Eng (SRE)', 'Technology', 'High', 'B.Tech + Server Tools'),
('Database Administrator', 'Technology', 'High', 'B.Tech/BCA/MCA'),
-- Engineering
('Mechanical Engineer', 'Engineering', 'High', 'B.Tech Mechanical'),
('Civil Engineer', 'Engineering', 'High', 'B.Tech Civil'),
('Electrical Engineer', 'Engineering', 'High', 'B.Tech Electrical'),
('Electronics Engineer', 'Engineering', 'High', 'B.Tech Electronics (ECE)'),
('Aeronautical Engineer', 'Engineering', 'Medium', 'B.Tech Aeronautical'),
('Chemical Engineer', 'Engineering', 'Medium', 'B.Tech Chemical'),
('Automobile Engineer', 'Engineering', 'Medium', 'B.Tech Automobile'),
('Petroleum Engineer', 'Engineering', 'Medium', 'B.Tech Petroleum'),
('Robotics Engineer', 'Engineering', 'High', 'B.Tech Robotics/Mechatronics'),
('Marine Engineer', 'Engineering', 'Medium', 'B.Tech Marine Engineering'),
('Textile Engineer', 'Engineering', 'Medium', 'B.Tech Textile Tech'),
('Mining Engineer', 'Engineering', 'Medium', 'B.Tech Mining'),
('Industrial Engineer', 'Engineering', 'High', 'B.Tech Industrial'),
('Environmental Engineer', 'Engineering', 'High', 'B.Tech Environmental Eng'),
('Sound Engineer', 'Engineering', 'Medium', 'Diploma/Degree Sound Eng'),
-- Medical
('Doctor (MBBS)', 'Medical', 'Very High', 'MBBS + MD/MS'),
('Dentist', 'Medical', 'High', 'BDS/MDS'),
('Ayurvedic Doctor (BAMS)', 'Medical', 'High', 'BAMS + MD Ayurveda'),
('Homeopathic Doctor (BHMS)', 'Medical', 'High', 'BHMS'),
('Pharmacist', 'Medical', 'Medium', 'B.Pharm/M.Pharm/D.Pharm'),
('Nurse', 'Medical', 'High', 'B.Sc Nursing / GNM'),
('Physiotherapist', 'Medical', 'Medium', 'BPT/MPT'),
('Medical Lab Technician', 'Medical', 'Medium', 'B.Sc MLT'),
('Radiologist', 'Medical', 'High', 'MBBS + MD Radiology'),
('Veterinarian', 'Medical', 'Medium', 'BVSc & AH'),
-- Healthcare
('Psychologist / Therapist', 'Healthcare', 'High', 'M.A./M.Sc Psychology + RCI'),
('Nutritionist / Dietitian', 'Healthcare', 'High', 'B.Sc/M.Sc Nutrition'),
('Optometrist', 'Healthcare', 'Medium', 'B.Optom'),
('Speech Therapist', 'Healthcare', 'Medium', 'BASLP'),
('Healthcare Administrator', 'Healthcare', 'High', 'MBA Hospital Management'),
-- Finance
('Chartered Accountant (CA)', 'Finance', 'High', 'CA Course (ICAI)'),
('Cost Accountant (CMA)', 'Finance', 'High', 'ICWAI/CMA Course'),
('Company Secretary (CS)', 'Finance', 'Medium', 'CS Course (ICSI)'),
('Investment Banker', 'Finance', 'High', 'MBA Finance/CA/CFA'),
('Financial Analyst', 'Finance', 'High', 'BBA/MBA Finance/CFA'),
('Actuary', 'Finance', 'Medium', 'Actuarial Science + IAI Exams'),
('Stock Broker / Trader', 'Finance', 'Medium', 'Commerce Degree + NISM'),
('Mutual Fund Manager', 'Finance', 'High', 'MBA Finance + NISM'),
('Bank PO / Clerk', 'Finance', 'Very High', 'Any Degree + IBPS/SBI PO'),
('GST Consultant', 'Finance', 'High', 'B.Com/CA/Law'),
('Wealth Manager', 'Finance', 'Medium', 'MBA Finance/CFP'),
('Credit Risk Analyst', 'Finance', 'High', 'BBA/MBA Finance/FRM'),
-- Business
('Business Analyst', 'Business', 'High', 'BBA/MBA/B.Tech'),
('Management Consultant', 'Business', 'High', 'MBA Top Tier'),
('Product Manager', 'Business', 'Very High', 'B.Tech + MBA / Certification'),
('Supply Chain Manager', 'Business', 'High', 'MBA Operations/Logistics'),
('HR Manager', 'Business', 'Medium', 'MBA HR'),
('Operations Manager', 'Business', 'High', 'MBA Operations'),
('E-Commerce Manager', 'Business', 'High', 'BBA/MBA'),
('Scrum Master / Agile', 'Business', 'Medium', 'CSM Certification'),
('Startup Founder / Entrepreneur', 'Business', 'High', 'Any Degree + Skill'),
('CSR Manager', 'Business', 'Medium', 'MBA/MSW'),
-- Government
('Civil Services (IAS/IPS/IFS)', 'Government', 'Very High', 'Any Degree + UPSC CSE'),
('Indian Revenue Service (IRS)', 'Government', 'High', 'Any Degree + UPSC CSE'),
('State Civil Services (PCS)', 'Government', 'High', 'Any Degree + State PSC'),
('Defense Services (Army/Navy/AF)', 'Government', 'High', '12th/Degree + NDA/CDS/AFCAT'),
('Railway Services (RRB)', 'Government', 'High', 'B.Tech/Graduation + RRB'),
('Staff Selection Commission (SSC)', 'Government', 'Very High', '12th/Degree + SSC CGL/CHSL'),
('Police Sub-Inspector / DSP', 'Government', 'High', 'Degree + State Police Exams'),
('Income Tax Inspector', 'Government', 'High', 'Degree + SSC CGL'),
('Forest Ranger', 'Government', 'Medium', 'B.Sc Science/Environment + PSC'),
('Block Development Officer (BDO)', 'Government', 'High', 'Degree + State PSC'),
('Paramilitary Forces (CAPF/CRPF)', 'Government', 'High', 'Degree + UPSC CAPF'),
('Postal Services Officer', 'Government', 'Medium', 'Degree + Postal Exams'),
-- Legal
('Litigation Lawyer', 'Legal', 'High', 'BA LLB/LLB'),
('Corporate Lawyer', 'Legal', 'High', 'BA LLB + Corp Law Specialization'),
('Judge / Magistrate', 'Legal', 'High', 'LLB + State Judicial Services Exam'),
('Cyber Law Expert', 'Legal', 'High', 'LLB + Cyber Law Certification'),
('Intellectual Property (IP) Lawyer', 'Legal', 'Medium', 'LLB + IP Law'),
('Tax Lawyer', 'Legal', 'High', 'B.Com LLB / CA + LLB'),
-- Education
('School Teacher (PGT/TGT)', 'Education', 'Very High', 'B.A/B.Sc + B.Ed + TET/CTET'),
('University Professor / Lecturer', 'Education', 'High', 'Masters + NET / PhD'),
('School Principal / Admin', 'Education', 'Medium', 'M.Ed + Experience'),
('Education Counselor', 'Education', 'High', 'M.A Psychology / Counseling'),
('Special Educator', 'Education', 'High', 'B.Ed Special Education'),
('Curriculum Designer / EdTech Dev', 'Education', 'High', 'Degree + EdTech Experience'),
-- Science
('Research Scientist (DRDO/ISRO/CSIR)', 'Science', 'High', 'M.Sc/M.Tech/PhD'),
('Biotechnologist', 'Science', 'Medium', 'B.Sc/B.Tech Biotech'),
('Microbiologist', 'Science', 'Medium', 'M.Sc Microbiology'),
('Pharmacologist', 'Science', 'High', 'M.Pharm / PhD'),
('Forensic Scientist', 'Science', 'Medium', 'M.Sc Forensic Science'),
('Geologist', 'Science', 'Medium', 'B.Sc/M.Sc Geology'),
('Meteorologist', 'Science', 'Medium', 'M.Sc Meteorology/Physics'),
('Food Technologist', 'Science', 'High', 'B.Tech/M.Sc Food Tech'),
-- Media
('Journalist / Reporter', 'Media', 'Medium', 'BJMC / Mass Communication'),
('Digital Content Writer / Copywriter', 'Media', 'High', 'Any Degree + Portfolio'),
('Film/Video Editor', 'Media', 'High', 'Editing Course / BFA'),
('Public Relations (PR) Manager', 'Media', 'Medium', 'MBA / Mass Comm'),
('News Anchor', 'Media', 'Medium', 'Journalism / Broadcasting'),
('Social Media Influencer/Creator', 'Media', 'Medium', 'None. Requires Niche/Audience'),
('Screenwriter', 'Media', 'Medium', 'Creative Writing / Media Degree'),
-- Design
('Architect', 'Design', 'High', 'B.Arch + COA Registration'),
('Interior Designer', 'Design', 'High', 'B.Des Interior Design'),
('Fashion Designer', 'Design', 'High', 'B.Des Fashion (NIFT)'),
('Graphic Designer', 'Design', 'High', 'B.Des / Portfolio'),
('3D Animator / VFX Artist', 'Design', 'High', 'Animation Degree/Arena/MAAC'),
('Industrial/Product Designer', 'Design', 'Medium', 'B.Des/M.Des (NID/IIT)'),
('Photographer / Videographer', 'Design', 'Medium', 'Fine Arts / Portfolio'),
-- Marketing
('Digital Marketing Manager', 'Marketing', 'Very High', 'BBA/MBA + Digital Certs'),
('SEO Specialist / Growth Hacker', 'Marketing', 'High', 'Any Degree + SEO Experience'),
('Brand Manager', 'Marketing', 'High', 'MBA Marketing'),
('B2B Sales Manager', 'Marketing', 'Very High', 'BBA/MBA/B.Tech'),
-- Hospitality
('Hotel Manager', 'Hospitality', 'High', 'BHM (Hotel Management)'),
('Chef / Culinary Artist', 'Hospitality', 'High', 'Diploma Culinary Arts / BHM'),
('Event Manager', 'Hospitality', 'Medium', 'Event Management Course'),
('Travel Consultant / Guide', 'Tourism', 'Medium', 'Travel & Tourism Degree'),
('Cabin Crew / Air Hostess', 'Hospitality', 'Medium', '12th + Cabin Crew Training'),
-- Aviation
('Commercial Pilot', 'Aviation', 'High', '12th PCM + CPL License'),
('Air Traffic Controller (ATC)', 'Aviation', 'Medium', 'B.Tech + AAI Training'),
('Aircraft Maintenance Engineer (AME)', 'Aviation', 'Medium', 'AME License (DGCA)'),
-- Maritime
('Merchant Navy Officer (Deck/Engine)', 'Maritime', 'High', 'B.Sc Nautical Science / Marine Eng (IMU)'),
-- Agriculture
('Agricultural Officer', 'Agriculture', 'High', 'B.Sc Agriculture + IBPS AFO'),
('Agronomist', 'Agriculture', 'Medium', 'M.Sc Agronomy'),
('Dairy Technologist', 'Agriculture', 'Medium', 'B.Tech Dairy Tech'),
('Sericulturist / Fishery Scientist', 'Agriculture', 'Low', 'B.Sc Sericulture / Fisheries'),
-- Sports
('Sports Coach / PE Teacher', 'Sports', 'High', 'B.P.Ed / NIS Diploma'),
('Fitness Trainer / Yoga Instructor', 'Sports', 'High', 'Fitness Cert/Yoga Certification (QCI)'),
('Sports Manager', 'Sports', 'Medium', 'MBA Sports Management'),
('Sports Physiotherapist', 'Sports', 'Medium', 'BPT + Sports Science'),
-- Social Sciences
('Social Worker / NGO Admin', 'Social Sciences', 'Medium', 'BSW / MSW'),
('Policy Analyst', 'Social Sciences', 'Medium', 'Public Policy Degree')
ON CONFLICT (name) DO NOTHING;

-- Verify data
SELECT 'Total Careers' as table_name, COUNT(*) as count FROM public.careers;