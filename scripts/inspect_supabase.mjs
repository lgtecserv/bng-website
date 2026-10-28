import { createClient } from '@supabase/supabase-js';

const url = 'https://ohfxjwotkgllccdiismc.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oZnhqd290a2dsbGNjZGlpc21jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5Mjk2MTU3NCwiZXhwIjoyMTA4NTM3NTc0fQ.fkdqJUDN-Y1J_uV-kjBSz8KmZvaXlq0DmbzI019npYg';

const adminClient = createClient(url, serviceKey);

async function inspect() {
  const resp = await fetch(`${url}/rest/v1/?apikey=${serviceKey}`, {
    headers: { 'Authorization': `Bearer ${serviceKey}` }
  });
  console.log('OpenAPI Swagger status:', resp.status);
  if (resp.ok) {
    const spec = await resp.json();
    console.log('Definitions/Tables in Swagger:', Object.keys(spec.definitions || {}));
  } else {
    console.log(await resp.text());
  }
}

inspect();
