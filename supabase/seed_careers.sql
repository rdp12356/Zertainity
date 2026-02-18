-- Seed 'career_paths' with initial data
-- We will use a simple mapping logic in Results.tsx for now, but this data will be available.

INSERT INTO public.career_paths (title, category, description, recommended_streams) VALUES
('Computer Science & Engineering', 'Technology', 'Focus on software, algorithms, and systems.', ARRAY['Science (PCM)', 'Science (PCM + CS)']),
('Medicine & Surgery', 'Medical', 'Diagnose and treat illnesses.', ARRAY['Science (PCB)']),
('Chartered Accountancy', 'Finance', 'Audit, taxation, and financial management.', ARRAY['Commerce', 'Commerce + Maths']),
('Business Management', 'Business', 'Leadership, strategy, and operations.', ARRAY['Commerce', 'Humanities', 'Science']),
('Architecture', 'Design', 'Design and planning of buildings.', ARRAY['Science (PCM)', 'Science + Design']),
('Journalism & Mass Comm', 'Media', 'Reporting, writing, and communication.', ARRAY['Humanities', 'Commerce']),
('Data Science', 'Technology', 'Analyze complex data to drive decisions.', ARRAY['Science (PCM)', 'Commerce + Maths']),
('Psychology', 'Social Sciences', 'Study of mind and behavior.', ARRAY['Humanities', 'Science (PCB)']),
('Law', 'Legal', 'Justice, regulations, and advocacy.', ARRAY['Humanities', 'Commerce']),
('Fine Arts', 'Arts', 'Creative expression through visual media.', ARRAY['Arts', 'Humanities']);

-- Enable RLS for career_paths if not already done
ALTER TABLE public.career_paths ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to career_paths" ON public.career_paths FOR SELECT USING (true);
