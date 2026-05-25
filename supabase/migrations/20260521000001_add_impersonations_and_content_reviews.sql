-- Create impersonations table for admin-preview tokens
CREATE TABLE IF NOT EXISTS public.impersonations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  token text NOT NULL UNIQUE,
  admin_id uuid NOT NULL,
  target_user_id uuid NOT NULL,
  expires_at timestamptz NOT NULL,
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_impersonations_token ON public.impersonations(token);
CREATE INDEX IF NOT EXISTS idx_impersonations_admin_id ON public.impersonations(admin_id);

-- Content review queue table
CREATE TABLE IF NOT EXISTS public.content_reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  content_kind text NOT NULL, -- 'career' | 'exam' | 'article' etc.
  content_id uuid, -- optional reference to existing content
  title text,
  submitter_id uuid,
  reviewer_id uuid,
  status text DEFAULT 'pending', -- pending|approved|rejected
  comments text,
  before_snapshot jsonb,
  after_snapshot jsonb,
  created_at timestamptz DEFAULT now(),
  reviewed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_content_reviews_status ON public.content_reviews(status);
