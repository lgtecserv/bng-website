import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ohfxjwotkgllccdiismc.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oZnhqd290a2dsbGNjZGlpc21jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5Mjk2MTU3NCwiZXhwIjoyMTA4NTM3NTc0fQ.fkdqJUDN-Y1J_uV-kjBSz8KmZvaXlq0DmbzI019npYg';

const supabase = createClient(supabaseUrl, serviceKey);

async function testTables() {
  const tableNames = ['listings', 'categories', 'banners', 'platform_config', 'profiles', 'properties', 'imoveis', 'anuncios', 'users'];
  for (const t of tableNames) {
    const { data, error } = await supabase.from(t).select('*').limit(1);
    if (error) {
      console.log(`Table ${t}: NOT FOUND (${error.message})`);
    } else {
      console.log(`Table ${t}: FOUND! rows: ${data?.length}`);
    }
  }
}

testTables();
