import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ohfxjwotkgllccdiismc.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oZnhqd290a2dsbGNjZGlpc21jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5Mjk2MTU3NCwiZXhwIjoyMTA4NTM3NTc0fQ.fkdqJUDN-Y1J_uV-kjBSz8KmZvaXlq0DmbzI019npYg';

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
  console.log('--- USERS ---');
  const { data: users, error: errU } = await supabase.auth.admin.listUsers();
  if (errU) console.error('Users error:', errU);
  else {
    console.log(`Found ${users.users.length} users:`);
    users.users.forEach(u => {
      console.log(`- ${u.id}: ${u.email} (confirmed: ${u.email_confirmed_at}, metadata: ${JSON.stringify(u.user_metadata)})`);
    });
  }

  console.log('\n--- LISTINGS TABLE TEST ---');
  const { data: listings, error: errL } = await supabase.from('listings').select('*').limit(5);
  if (errL) console.error('Listings error:', errL);
  else console.log(`Listings count: ${listings?.length}`);
}

main().catch(console.error);
