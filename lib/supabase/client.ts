import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Default to empty string if env vars are not defined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://igbpxesaulnzqaiqdjol.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnYnB4ZXNhdWxuenFhaXFkam9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyOTEyMzYsImV4cCI6MjA0OTg2NzIzNn0.G6NsqYzhAgn6EurprNJhYgUGbec6U3GCxKA1UBMcqJo';

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);