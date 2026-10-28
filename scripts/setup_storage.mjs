import { createClient } from '@supabase/supabase-js';

const url = 'https://ohfxjwotkgllccdiismc.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oZnhqd290a2dsbGNjZGlpc21jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5Mjk2MTU3NCwiZXhwIjoyMTA4NTM3NTc0fQ.fkdqJUDN-Y1J_uV-kjBSz8KmZvaXlq0DmbzI019npYg';

const supabase = createClient(url, serviceKey);

async function setupBuckets() {
  console.log('A configurar buckets no Supabase Storage...');

  const buckets = [
    { id: 'listing-photos', public: true },
    { id: 'banners', public: true },
    { id: 'payment-proofs', public: false } // Comprovativos privados
  ];

  for (const b of buckets) {
    const { data, error } = await supabase.storage.createBucket(b.id, {
      public: b.public,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/jpg', 'application/pdf']
    });

    if (error) {
      if (error.message?.includes('already exists') || error.message?.includes('Duplicate')) {
        console.log(`Bucket '${b.id}' já existe.`);
      } else {
        console.error(`Erro ao criar bucket '${b.id}':`, error.message);
      }
    } else {
      console.log(`Bucket '${b.id}' criado com sucesso! (Público: ${b.public})`);
    }
  }

  const { data: currentList } = await supabase.storage.listBuckets();
  console.log('Buckets atuais no projeto:', currentList?.map(b => b.name));
}

setupBuckets();
