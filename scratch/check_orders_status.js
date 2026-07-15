const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testPitchStatus() {
  console.log('Testing custom status insertion...');
  const { data, error } = await supabase
    .from('orders')
    .insert([{
      quantity: 1,
      total_price: 100,
      status: 'pitch',
      buyer_name: 'Test Buyer',
      buyer_email: 'test@buyer.com'
    }])
    .select();

  if (error) {
    console.error('Insert Error:', error.message);
  } else {
    console.log('Insert Success! Row inserted:', data);
    // Cleanup
    const { error: delErr } = await supabase
      .from('orders')
      .delete()
      .eq('id', data[0].id);
    if (delErr) {
      console.error('Cleanup Error:', delErr.message);
    } else {
      console.log('Cleanup Success!');
    }
  }
}

testPitchStatus();
