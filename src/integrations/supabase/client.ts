// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cvnchkjnrvdczergiwib.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2bmNoa2pucnZkY3plcmdpd2liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MjA2MDAsImV4cCI6MjA2ODM5NjYwMH0.HJjH_8SJeo9fgD0-BM76FRY0X5rgLnqmUBc9yk0O2oc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});