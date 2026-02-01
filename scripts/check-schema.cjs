const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ybonhkyyvvlvjszoacwh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlib25oa3l5dnZsdmpzem9hY3doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4ODgxNDksImV4cCI6MjA4NTQ2NDE0OX0.F9-BMbjtncsdPrtA-k_7A1f8QpUmCvl2GVK2unceIgQ';

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
            console.log("No profiles found to check columns. (Table might be empty or RLS blocking)");
            // Try to see if we can just list rows even if empty? 
            // If empty, we can't see columns via Select * in JS client usually without type info.
            // But let's assume there is at least the user's profile.
        }
    }
}

checkSchema();
