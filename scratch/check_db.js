const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTable() {
  console.log('Checking notifications table...');
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Successfully fetched sample row:', data);
    if (data && data.length > 0) {
      console.log('Columns present:', Object.keys(data[0]));
    } else {
      console.log('Table is empty. Checking if we can insert a test row with dedup_key...');
      // Let's check table structure by attempting to select dedup_key
      const { data: testData, error: testError } = await supabase
        .from('notifications')
        .select('dedup_key')
        .limit(1);
      if (testError) {
        console.error('dedup_key select error:', testError.message);
      } else {
        console.log('dedup_key column EXISTS in database!');
      }
    }
  }
}

checkTable();
