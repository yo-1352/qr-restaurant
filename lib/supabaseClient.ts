import { createClient } from '@supabase/supabase-js';

// This creates a single Supabase client you can import in your components.
// It uses the public (anon) key, safe for client-side usage.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

