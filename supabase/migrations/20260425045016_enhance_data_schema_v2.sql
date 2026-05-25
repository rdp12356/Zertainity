
-- Enhance careers table
ALTER TABLE careers ADD COLUMN IF NOT EXISTS tagline text;
ALTER TABLE careers ADD COLUMN IF NOT EXISTS overview text;
ALTER TABLE careers ADD COLUMN IF NOT EXISTS salary_entry text;
ALTER TABLE careers ADD COLUMN IF NOT EXISTS salary_mid text;
ALTER TABLE careers ADD COLUMN IF NOT EXISTS salary_senior text;
ALTER TABLE careers ADD COLUMN IF NOT EXISTS skills text[];
ALTER TABLE careers ADD COLUMN IF NOT EXISTS entrance_exams text[];

-- Enhance colleges table
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS rank text;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS rating numeric;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS website text;

-- Enhance schools table
ALTER TABLE schools ADD COLUMN IF NOT EXISTS rating numeric;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS website text;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS fee_range text;

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  key text PRIMARY KEY,
  value jsonb,
  updated_at timestamp with time zone DEFAULT now()
);

-- Insert default settings
INSERT INTO site_settings (key, value) VALUES 
('site_config', '{"title": "Zertainity", "maintenance": false, "contact_email": "support@zertainity.com", "hero_title": "India''s Best Career Guidance Platform"}'::jsonb)
ON CONFLICT (key) DO NOTHING;
;
