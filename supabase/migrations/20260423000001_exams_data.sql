-- =========================================================================
-- ZERTAINITY - EXAMS TABLE AND SEED DATA
-- =========================================================================

-- Create exams table
CREATE TABLE IF NOT EXISTS public.exams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  authority TEXT NOT NULL,
  official_website TEXT,
  registration_window TEXT,
  exam_window TEXT,
  result_window TEXT,
  attempts TEXT,
  exam_mode TEXT,
  fee_info TEXT,
  eligibility_snapshot TEXT[],
  pathways TEXT[],
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view exams"
ON public.exams
FOR SELECT
USING (true);

-- Admin insert/update/delete policies
CREATE POLICY "Admins can manage exams"
ON public.exams
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Seed exams data
INSERT INTO public.exams (name, authority, official_website, registration_window, exam_window, result_window, attempts, exam_mode, fee_info, eligibility_snapshot, pathways, category) VALUES
-- Engineering
('JEE Main', 'National Testing Agency (NTA)', 'https://jeemain.nta.ac.in/', 'Nov-Jan & Feb-Mar', 'Jan & Apr', 'Within 1-2 weeks per session', '2 sessions/year; max 3 years after Class 12', 'CBT', 'General: Rs 1000, SC/ST/PwD: Rs 500', ARRAY['Class 12 appeared/appearing', 'Minimum 75% aggregate (General)'], ARRAY['B.Tech', 'B.E.', 'B.Arch', 'B.Plan', 'NIT/IIIT admissions'], 'Engineering'),
('JEE Advanced', 'IITs', 'https://jeeadv.ac.in/', 'After JEE Main results', 'May-June', '2-3 weeks after exam', 'Check current IIT rules', 'CBT', 'Rs 2800 (General), Rs 1400 (SC/ST/PwD)', ARRAY['Class 12 appeared/appearing', 'JEE Main qualified'], ARRAY['IIT B.Tech', 'IIT Dual Degree', 'IIT B.S.'], 'Engineering'),
('BITSAT', 'BITS Pilani', 'https://www.bitsadmission.com/', 'Jan-March', 'May-June', 'June', '2 attempts', 'CBT', 'Rs 3300 (Male), Rs 2800 (Female)', ARRAY['Class 12 with PCM', 'Minimum 75% aggregate'], ARRAY['B.Tech', 'B.Pharm', 'M.Sc'], 'Engineering'),
('VITEEE', 'VIT University', 'https://viteee.vit.ac.in/', 'Oct-March', 'April', 'April end', 'Multiple attempts', 'CBT', 'Rs 1350', ARRAY['Class 12 with PCM'], ARRAY['B.Tech', 'B.Tech Lateral'], 'Engineering'),
('SRMJEEE', 'SRM Institute', 'https://www.srmist.edu.in/admission-india/', 'Nov-May', 'April-May', 'May', 'Multiple attempts', 'CBT', 'Rs 1200', ARRAY['Class 12 with PCM'], ARRAY['B.Tech', 'B.Tech Lateral'], 'Engineering'),
('COMEDK UGET', 'COMEDK', 'https://comedk.org/', 'Feb-May', 'May', 'May end', 'Once a year', 'CBT', 'Rs 1800 (General), Rs 1000 (SC/ST)', ARRAY['Class 12 with PCM', 'Minimum 45%'], ARRAY['B.Tech', 'B.E.'], 'Engineering'),
('MHT CET', 'Maharashtra State CET', 'https://cetcell.mahacet.org/', 'Feb-April', 'April-May', 'June', 'Once a year', 'CBT', 'Rs 800 (General), Rs 600 (SC/ST)', ARRAY['Class 12 with PCM'], ARRAY['B.Tech', 'B.Pharm', 'B.Sc Agriculture'], 'Engineering'),
('WBJEE', 'West Bengal Board', 'https://wbjeeb.nic.in/', 'Dec-March', 'April', 'June', 'Once a year', 'CBT', 'Rs 500 (General), Rs 300 (SC/ST)', ARRAY['Class 12 with PCM'], ARRAY['B.Tech', 'B.E.', 'B.Pharm'], 'Engineering'),
('KIITEE', 'KIIT University', 'https://www.kiit.ac.in/', 'Nov-March', 'April', 'May', 'Multiple attempts', 'CBT', 'Rs 1500', ARRAY['Class 12 with PCM'], ARRAY['B.Tech', 'B.Tech Lateral'], 'Engineering'),
('MET', 'Manipal Academy', 'https://manipal.edu/', 'Oct-March', 'April-May', 'May', 'Multiple attempts', 'CBT', 'Rs 1400', ARRAY['Class 12 with PCM'], ARRAY['B.Tech', 'B.Sc', 'BBA'], 'Engineering'),

-- Medical
('NEET UG', 'National Testing Agency (NTA)', 'https://neet.nta.nic.in/', 'Feb-Mar', 'May', 'June', 'Once a year', 'Pen & Paper', 'Rs 1700 (General), Rs 1000 (SC/ST/PwD)', ARRAY['Class 12 with PCB', 'Minimum 50% (General), 40% (SC/ST/OBC)'], ARRAY['MBBS', 'BDS', 'BHMS', 'BAMS', 'B.V.Sc', 'B.Sc Nursing'], 'Medical'),
('NEET PG', 'National Board of Examinations', 'https://nbe.edu.in/', 'Sep-Oct', 'March', 'April', 'Once a year', 'CBT', 'Rs 3500 (General), Rs 2500 (SC/ST/OBC)', ARRAY['MBBS degree completed', '1 year internship'], ARRAY['MD', 'MS', 'Diploma'], 'Medical'),
('AIIMS PG', 'AIIMS New Delhi', 'https://www.aiimsexams.ac.in/', 'Sep-Oct', 'November', 'December', 'Once a year', 'CBT', 'Rs 1500', ARRAY['MBBS degree', '1 year internship'], ARRAY['MD', 'MS', 'M.Ch', 'DM'], 'Medical'),
('JIPMER', 'JIPMER Puducherry', 'https://jipmer.edu.in/', 'March-April', 'June', 'June', 'Once a year', 'CBT', 'Rs 1500', ARRAY['Class 12 with PCB', 'Minimum 50%'], ARRAY['MBBS', 'B.Sc Nursing', 'B.Paramedical'], 'Medical'),
('CMC Vellore PG', 'Christian Medical College', 'https://www.cmch-vellore.edu/', 'Oct-Nov', 'January', 'February', 'Once a year', 'Written + Interview', 'Rs 1000', ARRAY['MBBS degree completed'], ARRAY['MD', 'MS', 'Diploma'], 'Medical'),

-- Law
('CLAT', 'Consortium of NLUs', 'https://consortiumofnlus.ac.in/', 'Dec-March', 'May', 'May end', 'Once a year', 'CBT', 'Rs 4000 (General), Rs 3500 (SC/ST)', ARRAY['Class 12 with any stream', 'Minimum 45%'], ARRAY['BA LLB', 'BBA LLB', 'B.Com LLB', 'LLB', 'LLM'], 'Law'),
('AILET', 'NLU Delhi', 'https://nludelhi.ac.in/', 'Jan-March', 'May', 'May end', 'Once a year', 'Written', 'Rs 3000 (General), Rs 1000 (SC/ST)', ARRAY['Class 12 with any stream', 'Minimum 45%'], ARRAY['BA LLB', 'LLM', 'PhD'], 'Law'),
('SLAT', 'Symbiosis', 'https://www.setest.org/', 'Nov-March', 'March-April', 'April end', 'Once a year', 'CBT', 'Rs 2250', ARRAY['Class 12 with any stream', 'Minimum 45%'], ARRAY['BA LLB', 'BBA LLB'], 'Law'),
('LSAT India', 'Law School Admission Council', 'https://www.lsatindia.in/', 'Dec-March', 'March-April', 'April end', 'Once a year', 'CBT', 'Rs 3999', ARRAY['Class 12 with any stream', 'Minimum 45%'], ARRAY['BA LLB', 'BBA LLB', 'LLB'], 'Law'),

-- Management
('CAT', 'IIMs', 'https://iimcat.ac.in/', 'Aug-Oct', 'November', 'December', 'Once a year', 'CBT', 'Rs 2500 (General), Rs 1250 (SC/ST)', ARRAY['Bachelor''s degree with 50%', 'Final year students eligible'], ARRAY['MBA', 'PGP', 'Executive MBA'], 'Management'),
('XAT', 'XLRI Jamshedpur', 'https://www.xlri.ac.in/', 'Sep-Dec', 'January', 'January end', 'Once a year', 'CBT', 'Rs 2000 (General), Rs 1000 (SC/ST)', ARRAY['Bachelor''s degree with 45%', 'Final year students eligible'], ARRAY['MBA', 'PGDM'], 'Management'),
('CMAT', 'NTA', 'https://cmat.nta.nic.in/', 'Dec-Feb', 'March', 'April', 'Once a year', 'CBT', 'Rs 2000 (General), Rs 1000 (SC/ST)', ARRAY['Bachelor''s degree with 45%'], ARRAY['MBA', 'PGDM', 'MMS'], 'Management'),
('MAT', 'AIMA', 'https://mat.aima.in/', 'Feb, May, Sep, Dec', 'CBT: Feb/May/Sept/Dec, PBT: March', 'Within 3 weeks', '4 times a year', 'CBT/PBT', 'Rs 2100 (one form)', ARRAY['Bachelor''s degree with 45%'], ARRAY['MBA', 'PGDM'], 'Management'),
('NMAT', 'GMAC', 'https://www.nmat.org.in/', 'Sep-Dec', 'Oct-Jan', 'Within 2 weeks', '3 attempts', 'CBT', 'Rs 2800 + service tax', ARRAY['Bachelor''s degree with 45%'], ARRAY['MBA', 'PGDM'], 'Management'),
('SNAP', 'Symbiosis International', 'https://www.snaptest.org/', 'Sep-Nov', 'December', 'January', 'Once a year', 'CBT', 'Rs 2250 per attempt', ARRAY['Bachelor''s degree with 45%'], ARRAY['MBA', 'PGDM'], 'Management'),

-- Design
('NID DAT', 'National Institute of Design', 'https://www.nid.edu/', 'Oct-Dec', 'January', 'March', 'Once a year', 'Pen & Paper + Studio Test', 'Rs 3500 (General), Rs 1750 (SC/ST)', ARRAY['Class 12 any stream', 'Graduate also eligible'], ARRAY['B.Des', 'M.Des'], 'Design'),
('NIFT Entrance', 'NIFT', 'https://nift.ac.in/', 'Oct-Jan', 'February', 'March', 'Once a year', 'CBT + Situation Test', 'Rs 1500 (General), Rs 750 (SC/ST/PwD)', ARRAY['Class 12 any stream', 'Graduate also eligible'], ARRAY['B.Des', 'M.Des', 'B.FTech'], 'Design'),
('UCEED', 'IIT Bombay', 'https://www.uceed.ac.in/', 'Oct-Dec', 'January', 'March', 'Once a year', 'CBT', 'Rs 2000 (General), Rs 1000 (SC/ST)', ARRAY['Class 12 any stream', 'Age limit: 24 years'], ARRAY['B.Des', 'B.Des (IIT)', 'M.Des'], 'Design'),
('CEED', 'IIT Bombay', 'https://www.ceed.ac.in/', 'Oct-Dec', 'January', 'March', 'Once a year', 'CBT + Interview', 'Rs 2000 (General), Rs 1000 (SC/ST)', ARRAY['Bachelor''s degree in design', 'Or 5 year diploma'], ARRAY['M.Des', 'PhD'], 'Design'),

-- Government Jobs
('UPSC Civil Services', 'Union Public Service Commission', 'https://upsc.gov.in/', 'Feb-March', 'June-September', 'December-January', 'Unlimited attempts', 'Pen & Paper + Interview', 'Rs 400 (Prelims), Rs 750 (Mains)', ARRAY['Bachelor''s degree', 'Age: 21-32 years'], ARRAY['IAS', 'IPS', 'IFS', 'IRS', 'Other Group A Services'], 'Government'),
('UPSC NDA', 'Union Public Service Commission', 'https://upsc.gov.in/', 'Dec-Jan', 'April', 'May-June', 'Unlimited attempts (within age limit)', 'Pen & Paper + SSB', 'Rs 100', ARRAY['Class 12 passed', 'Age: 16.5-19.5 years'], ARRAY['Indian Military Academy', 'Naval Academy', 'Air Force Academy', 'Officer Training Academy'], 'Government'),
('SSC CGL', 'Staff Selection Commission', 'https://ssc.nic.in/', 'March-April', 'June-September', 'October-December', 'Unlimited attempts', 'CBT', 'Rs 200 (General)', ARRAY['Bachelor''s degree', 'Age: 18-32 years'], ARRAY['Group B', 'Group C posts'], 'Government'),
('SSC CHSL', 'Staff Selection Commission', 'https://ssc.nic.in/', 'March-April', 'June-July', 'October', 'Unlimited attempts', 'CBT', 'Rs 200 (General)', ARRAY['Class 12 passed', 'Age: 18-27 years'], ARRAY['LDC', 'DEO', 'Postal Assistant'], 'Government'),
('IBPS PO', 'Institute of Banking Personnel Selection', 'https://www.ibps.in/', 'August-September', 'October-November', 'December-January', 'Unlimited attempts', 'CBT', 'Rs 850 (General)', ARRAY['Bachelor''s degree', 'Age: 20-30 years'], ARRAY['Probationary Officer', 'Management Trainee'], 'Banking'),
('IBPS Clerk', 'Institute of Banking Personnel Selection', 'https://www.ibps.in/', 'July-August', 'November-December', 'February-March', 'Unlimited attempts', 'CBT', 'Rs 750 (General)', ARRAY['Bachelor''s degree', 'Age: 20-28 years'], ARRAY['Junior Associate', 'Clerk'], 'Banking'),
('SBI PO', 'State Bank of India', 'https://bank.sbi/careers', 'Sep-Oct', 'November-December', 'February-March', 'Unlimited attempts', 'CBT + Interview', 'Rs 750 (General)', ARRAY['Bachelor''s degree with 60%', 'Age: 21-30 years'], ARRAY['Probationary Officer'], 'Banking'),
('RBI Grade B', 'Reserve Bank of India', 'https://rbi.org.in/', 'Feb-March', 'March', 'August', 'Unlimited attempts', 'CBT + Interview', 'Rs 850 (General)', ARRAY['Bachelor''s degree with 60%', 'Age: 21-30 years'], ARRAY['Grade B Officer', 'Grade B (DEPR)', 'Grade B (DSIM)'], 'Banking'),

-- Professional
('CA Foundation', 'ICAI', 'https://www.icai.org/', 'Sep-Nov', 'November', 'January', '4 attempts per level', 'Pen & Paper', 'Rs 15000 (Registration)', ARRAY['Class 12 passed', 'Bachelor''s degree eligible for direct'], ARRAY['Chartered Accountant'], 'Professional'),
('CMA Foundation', 'ICMAI', 'https://icmai.in/', 'Feb-April', 'June', 'August', 'Multiple attempts', 'Pen & Paper', 'Rs 12000 (Registration)', ARRAY['Class 10+2 or Graduate'], ARRAY['Cost and Management Accountant'], 'Professional'),
('CS Executive', 'ICSI', 'https://www.icsi.edu/', 'Sep-March', 'June/December', 'August/February', 'Multiple attempts', 'Pen & Paper', 'Rs 12000 (Registration)', ARRAY['Class 12 or Graduate'], ARRAY['Company Secretary'], 'Professional'),
('GRE', 'ETS', 'https://www.ets.org/gre', 'Year-round', 'Year-round', '10-15 days', '5 times per year', 'CBT', 'Rs 22000', ARRAY['Bachelor''s degree'], ARRAY['Masters abroad', 'PhD'], 'Study Abroad'),
('TOEFL', 'ETS', 'https://www.ets.org/toefl', 'Year-round', 'Year-round', '4-8 days', 'Unlimited', 'CBT', 'Rs 16000', ARRAY['Any level'], ARRAY['Study abroad', 'Immigration'], 'Study Abroad'),
('IELTS', 'British Council/IDP', 'https://www.ielts.org', 'Year-round', 'Year-round', '13 days', 'Unlimited', 'Pen & Paper/CBT', 'Rs 15500', ARRAY['Any level'], ARRAY['Study abroad', 'Immigration', 'Work abroad'], 'Study Abroad'),
('GMAT', 'GMAC', 'https://www.gmat.org/', 'Year-round', 'Year-round', '3-4 weeks', '5 times per year', 'CBT', 'Rs 25000', ARRAY['Bachelor''s degree'], ARRAY['MBA abroad', 'Executive MBA'], 'Study Abroad'),
('SAT', 'College Board', 'https://www.collegeboard.org/', 'Year-round', 'Year-round', '2-3 weeks', 'Unlimited', 'CBT', 'Rs 7000', ARRAY['Class 9-12', 'No age limit'], ARRAY['Undergrad abroad', 'Scholarships'], 'Study Abroad'),

-- Research
('GATE', 'IIT Bombay', 'https://gate2024.iitr.ac.in/', 'Aug-Oct', 'February', 'March', '3 years validity', 'CBT', 'Rs 1500 (General), Rs 750 (SC/ST)', ARRAY['Bachelor''s degree in Engineering', 'Final year eligible'], ARRAY['M.Tech', 'PSU Jobs', 'PhD'], 'Research'),
('UGC NET', 'NTA', 'https://ugcnet.nta.nic.in/', 'April-May', 'June', 'August', 'Unlimited until qualified', 'CBT', 'Rs 1100 (General)', ARRAY['Master''s degree with 55%', 'Age: No limit (JRF)'], ARRAY['Assistant Professor', 'Junior Research Fellow', 'Senior Research Fellow'], 'Research'),
('CSIR NET', 'CSIR', 'https://csirnet.nta.nic.in/', 'March-April', 'June', 'September', 'Unlimited until qualified', 'CBT', 'Rs 1100 (General)', ARRAY['Master''s degree in Science', 'Age: 28 (JRF)'], ARRAY['Assistant Professor', 'JRF', 'SRF', 'PhD'], 'Research'),
('JAM', 'IIT Bombay', 'https://jam.iitr.ac.in/', 'Sep-Nov', 'February', 'March', '2 consecutive years', 'CBT', 'Rs 900 (General), Rs 600 (SC/ST)', ARRAY['Bachelor''s degree', '3 years duration'], ARRAY['M.Sc', 'M.Sc-PhD Dual', 'MSc-TEC', 'JRF'], 'Research')
ON CONFLICT DO NOTHING;

-- Verify
SELECT 'Total Exams' as info, COUNT(*) as count FROM public.exams;
SELECT name, category, pathways[1] as primary_pathway FROM public.exams ORDER BY category, name LIMIT 20;