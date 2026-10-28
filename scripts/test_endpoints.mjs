const url = 'https://ohfxjwotkgllccdiismc.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oZnhqd290a2dsbGNjZGlpc21jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5Mjk2MTU3NCwiZXhwIjoyMTA4NTM3NTc0fQ.fkdqJUDN-Y1J_uV-kjBSz8KmZvaXlq0DmbzI019npYg';

async function testEndpoints() {
  const endpoints = [
    '/pg/query',
    '/database/query',
    '/api/query',
    '/rest/v1/rpc',
    '/storage/v1/bucket'
  ];

  for (const ep of endpoints) {
    const res = await fetch(`${url}${ep}`, {
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey
      }
    });
    console.log(ep, res.status);
    if (ep === '/storage/v1/bucket') {
      console.log('Buckets:', await res.json());
    }
  }
}

testEndpoints();
