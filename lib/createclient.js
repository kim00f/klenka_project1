import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  typeof window === "undefined"
    ? process.env.VITE_SUPABASE_URL
    : import.meta.env.VITE_SUPABASE_URL;

const supabaseAnonKey =
  typeof window === "undefined"
    ? process.env.VITE_SUPABASE_ANON_KEY
    : import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
