
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    const email = 'molhamgma@gmail.com';
    const password = 'TempP@ssw0rd!ChangeMe'; // change after first login

    // 1) create user via admin
    const { data: user, error: createErr } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        app_metadata: { role: 'admin' },
    });

    if (createErr) {
        console.error('Error creating user:', createErr);
        process.exit(1);
    }

    console.log('Created user:', user);

    // 2) upsert profile in public.profiles
    const userId = user.user?.id;

    if (!userId) {
        console.error('No user id returned');
        process.exit(1);
    }

    const { error: upsertErr } = await supabase.from('profiles').upsert({
        id: userId,
        full_name: 'Molham',
        username: 'molham',
        role: 'admin',
        updated_at: new Date().toISOString(),
    });

    if (upsertErr) {
        console.error('Error upserting profile:', upsertErr);
        process.exit(1);
    }

    console.log('Profile upserted for user', userId);
    console.log('Done — user is admin.');
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
