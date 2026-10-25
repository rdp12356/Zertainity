/** Compatibility factory: use the application's shared browser Supabase client. */
import { supabase } from '@/integrations/supabase/client';

export function createClient() {
  return supabase;
}
