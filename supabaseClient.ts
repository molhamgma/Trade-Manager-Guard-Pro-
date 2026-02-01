
import { createClient } from '@supabase/supabase-js';
// import { Database } from '../types_db';
// Using 'any' for now to prevent module resolution errors.
type Database = any;

// Provided by User
const supabaseUrl = 'https://ybonhkyyvvlvjszoacwh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlib25oa3l5dnZsdmpzem9hY3doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4ODgxNDksImV4cCI6MjA4NTQ2NDE0OX0.F9-BMbjtncsdPrtA-k_7A1f8QpUmCvl2GVK2unceIgQ';

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
