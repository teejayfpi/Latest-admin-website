import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nyoauzqezpxeonmrxxgi.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55b2F1enFlenB4ZW9ubXJ4eGdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODI3MzUsImV4cCI6MjA4OTg1ODczNX0.5WfECoO2Xu5VfBzFbQd2CA8rIeBVnOkiKmnnbYRA8VU";

// Service role key for admin operations (server-side only)
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || "";

// Create client-side Supabase client (read-only operations)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create admin client with service role (for admin operations)
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : supabase;

export type { SupabaseClient } from "@supabase/supabase-js";
