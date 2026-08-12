import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kymgcmjvykymtbaqzxti.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_qi18dfjtk4FELdKDgcc3Ag_T3Xt-db4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);