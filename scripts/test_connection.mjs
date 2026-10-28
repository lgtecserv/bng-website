import { createClient } from '@supabase/supabase-js';

const url = 'https://ohfxjwotkgllccdiismc.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oZnhqd290a2dsbGNjZGlpc21jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5Mjk2MTU3NCwiZXhwIjoyMTA4NTM3NTc0fQ.fkdqJUDN-Y1J_uV-kjBSz8KmZvaXlq0DmbzI019npYg';
const pubKey = 'sb_publishable_UeM95RFADZ96gx94HfgydQ_7xjH4HKY';

console.log('Testando conexão com Supabase...');

const adminClient = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
  try {
    // 1. Testa endpoint de auth / users
    const { data: users, error: userErr } = await adminClient.auth.admin.listUsers();
    console.log('Auth check:', userErr ? `Erro: ${userErr.message}` : `Sucesso! Total users: ${users.users.length}`);

    // 2. Testa requisição SQL via /pg/query se disponível ou endpoint do pg
    const resp = await fetch(`${url}/pg/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey
      },
      body: JSON.stringify({ query: 'SELECT current_database(), version();' })
    });
    console.log('PG Query HTTP status:', resp.status);
    if (resp.ok) {
      const json = await resp.json();
      console.log('PG Query result:', json);
    } else {
      const txt = await resp.text();
      console.log('PG Query body:', txt);
    }
  } catch (err) {
    console.error('Falha no teste:', err);
  }
}

run();
