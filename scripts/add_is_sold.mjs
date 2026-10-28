import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ohfxjwotkgllccdiismc.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oZnhqd290a2dsbGNjZGlpc21jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5Mjk2MTU3NCwiZXhwIjoyMTA4NTM3NTc0fQ.fkdqJUDN-Y1J_uV-kjBSz8KmZvaXlq0DmbzI019npYg';

const supabase = createClient(supabaseUrl, serviceKey);

async function checkColumns() {
  const { data, error } = await supabase.from('listings').select('id, is_sold').limit(1);
  console.log('Result:', { data, error });
}

checkColumns();
