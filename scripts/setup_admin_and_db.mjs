import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ohfxjwotkgllccdiismc.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oZnhqd290a2dsbGNjZGlpc21jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5Mjk2MTU3NCwiZXhwIjoyMTA4NTM3NTc0fQ.fkdqJUDN-Y1J_uV-kjBSz8KmZvaXlq0DmbzI019npYg';

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
  console.log('=== VERIFICANDO CONEXÃO E TABELAS SUPABASE ===');

  const adminUsersToCreate = [
    {
      email: 'lgtecserv@gmail.com',
      password: '123456',
      fullName: 'Administrador LG Tecserv',
      phone: '+258 84 000 0001',
      role: 'admin'
    },
    {
      email: 'grupobngoficial@gmail.com',
      password: '123456',
      fullName: 'Grupo BNG Oficial Admin',
      phone: '+258 84 000 0002',
      role: 'admin'
    }
  ];

  for (const userDef of adminUsersToCreate) {
    console.log(`\nProcessando utilizador: ${userDef.email}...`);
    
    // 1. Verificar se utilizador já existe
    const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
    const existing = listData?.users?.find(u => u.email === userDef.email);

    let userId = existing?.id;

    if (!existing) {
      console.log(`Criando utilizador Auth para ${userDef.email}...`);
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: userDef.email,
        password: userDef.password,
        email_confirm: true,
        user_metadata: {
          full_name: userDef.fullName,
          phone: userDef.phone,
          role: 'admin'
        }
      });

      if (createError) {
        console.error(`Erro ao criar utilizador ${userDef.email}:`, createError.message);
        continue;
      }
      userId = newUser.user.id;
      console.log(`Utilizador criado com sucesso! ID: ${userId}`);
    } else {
      console.log(`Utilizador já existe com ID: ${userId}. Atualizando senha e metadados...`);
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: userDef.password,
        email_confirm: true,
        user_metadata: {
          full_name: userDef.fullName,
          phone: userDef.phone,
          role: 'admin'
        }
      });
      if (updateError) {
        console.error(`Erro ao atualizar utilizador ${userDef.email}:`, updateError.message);
      } else {
        console.log(`Senha e metadados atualizados com sucesso para ${userDef.email}.`);
      }
    }

    // 2. Inserir ou atualizar na tabela `profiles`
    if (userId) {
      console.log(`Atualizando perfil na tabela 'profiles'...`);
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: userId,
          full_name: userDef.fullName,
          phone: userDef.phone,
          whatsapp: userDef.phone,
          role: 'admin',
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.warn(`Aviso ao atualizar profiles (${userDef.email}):`, profileError.message);
      } else {
        console.log(`Perfil 'admin' salvo com sucesso na tabela 'profiles' para ${userDef.email}!`);
      }
    }
  }

  // 3. Verificar estado das tabelas do sistema
  console.log('\n=== VERIFICANDO DEMAIS TABELAS ===');
  const tables = ['categories', 'platform_config', 'banners', 'listings', 'listing_fee_payments'];
  for (const t of tables) {
    const { count, error } = await supabaseAdmin.from(t).select('*', { count: 'exact', head: true });
    console.log(`Tabela '${t}':`, error ? `Erro: ${error.message}` : `Total de registos: ${count}`);
  }
}

main().catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
