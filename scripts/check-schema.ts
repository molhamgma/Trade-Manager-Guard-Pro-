import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = 'https://ybonhkyyvvlvjszoacwh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOnN1cGFiYXNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4ODgxNDksImV4cCI6MjA4NTQ2NDE0OX0.F9-BMbjtncsdPrtA-k_7A1f8QpUmCvl2GVK2unceIgQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkSchema() {
    console.log("Fetching one profile to check columns...");
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

    if (error) {
        console.error("Error fetching profiles:", error);
    } else {
        if (data && data.length > 0) {
            console.log("Actual Columns:", Object.keys(data[0]));
        } else {
            console.log("No profiles found to check columns.");
            // Try inserting a dummy to fail and see error? No, might violate constraints.
        }
    }
}

checkSchema();
