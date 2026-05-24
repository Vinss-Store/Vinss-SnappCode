import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://aovizizjygqtqmtujofq.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvdml6aXpqeWdxdHFtdHVqb2ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NTQyNjEsImV4cCI6MjA5NTEzMDI2MX0.x0YXf3WlvqIjgNdXydw-cMHvnDEdsbw-weyZjJRuwUU";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);