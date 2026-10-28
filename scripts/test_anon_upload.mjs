import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ohfxjwotkgllccdiismc.supabase.co';
const anonKey = 'sb_publishable_UeM95RFADZ96gx94HfgydQ_7xjH4HKY';

const supabase = createClient(supabaseUrl, anonKey);

async function testUpload() {
  const dummyFile = Buffer.from('fake image content');
  const filePath = `test-${Date.now()}.jpg`;
  
  console.log('Testing upload to listing-photos...');
  const res1 = await supabase.storage.from('listing-photos').upload(filePath, dummyFile, { contentType: 'image/jpeg' });
  console.log('listing-photos result:', res1);

  console.log('Testing upload to payment-proofs...');
  const res2 = await supabase.storage.from('payment-proofs').upload(filePath, dummyFile, { contentType: 'image/jpeg' });
  console.log('payment-proofs result:', res2);
}

testUpload();
