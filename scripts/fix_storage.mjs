import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ohfxjwotkgllccdiismc.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oZnhqd290a2dsbGNjZGlpc21jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5Mjk2MTU3NCwiZXhwIjoyMTA4NTM3NTc0fQ.fkdqJUDN-Y1J_uV-kjBSz8KmZvaXlq0DmbzI019npYg';

const supabase = createClient(supabaseUrl, serviceKey);

async function fixStorage() {
  // Update buckets to be public or ensure settings
  console.log('Updating payment-proofs to public so users can upload and view...');
  const res1 = await supabase.storage.updateBucket('payment-proofs', {
    public: true,
    fileSizeLimit: 10485760, // 10MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
  });
  console.log('Update payment-proofs:', res1);

  const res2 = await supabase.storage.updateBucket('listing-photos', {
    public: true,
    fileSizeLimit: 15728640, // 15MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  });
  console.log('Update listing-photos:', res2);

  const res3 = await supabase.storage.updateBucket('banners', {
    public: true,
    fileSizeLimit: 15728640, // 15MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  });
  console.log('Update banners:', res3);
}

fixStorage();
