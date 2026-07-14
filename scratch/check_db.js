const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: orders, error: err1 } = await supabase
    .from('orders')
    .select('*, products(name, quantity)');
  if (err1) console.error(err1);
  console.log('Orders in DB:', JSON.stringify(orders, null, 2));

  const { data: products, error: err2 } = await supabase
    .from('products')
    .select('*');
  if (err2) console.error(err2);
  console.log('Products in DB:', JSON.stringify(products, null, 2));
}

check();
