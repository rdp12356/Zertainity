-- Add missing columns to exams table
ALTER TABLE exams 
ADD COLUMN IF NOT EXISTS how_to_apply text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS things_to_know text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS official_notice_url text,
ADD COLUMN IF NOT EXISTS apply_url text,
ADD COLUMN IF NOT EXISTS last_verified_on timestamp with time zone DEFAULT now();

-- Ensure revamp_admin is in the permission enum (if not already there)
-- Note: We already did this in a previous turn, but it's good to be safe.
-- However, we can't easily check enum values in a simple ALTER.
-- Since the previous Turn 1134 already did it, we focus on columns.
;
