const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Create client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

const rand = Math.floor(Math.random() * 100000);
const sellerEmail = `seller_${rand}@test.com`;
const buyerEmail = `buyer_${rand}@test.com`;
const password = 'Password123!';

async function runTest() {
  console.log('--- STARTING END-TO-END FLOW TEST ---');
  let sellerAuth = null;
  let buyerAuth = null;
  let productId = null;
  let orderId = null;

  try {
    // 1. Sign up Seller
    console.log(`\n1. Signing up Seller: ${sellerEmail}`);
    const { data: sData, error: sErr } = await supabase.auth.signUp({
      email: sellerEmail,
      password: password
    });
    if (sErr) throw sErr;
    sellerAuth = sData.user;
    console.log('Seller Auth User ID:', sellerAuth.id);

    // Create Seller Profile
    const { error: sProfErr } = await supabase
      .from('profiles')
      .insert([{
        id: sellerAuth.id,
        full_name: 'Test Seller',
        company: 'Seller Corp',
        role: 'seller'
      }]);
    if (sProfErr) throw sProfErr;
    console.log('Seller profile created.');

    // 2. Sign up Buyer
    console.log(`\n2. Signing up Buyer: ${buyerEmail}`);
    const { data: bData, error: bErr } = await supabase.auth.signUp({
      email: buyerEmail,
      password: password
    });
    if (bErr) throw bErr;
    buyerAuth = bData.user;
    console.log('Buyer Auth User ID:', buyerAuth.id);

    // Create Buyer Profile
    const { error: bProfErr } = await supabase
      .from('profiles')
      .insert([{
        id: buyerAuth.id,
        full_name: 'Test Buyer',
        company: 'Buyer Retail',
        role: 'buyer'
      }]);
    if (bProfErr) throw bProfErr;
    console.log('Buyer profile created.');

    // 3. Create Product as Seller
    console.log('\n3. Creating Product as Seller...');
    // Sign in as seller to establish session
    const { error: sSignInErr } = await supabase.auth.signInWithPassword({
      email: sellerEmail,
      password: password
    });
    if (sSignInErr) throw sSignInErr;

    const { data: productData, error: prodErr } = await supabase
      .from('products')
      .insert([{
        user_id: sellerAuth.id,
        name: 'Test Cotton T-Shirt',
        description: 'Test Description',
        category: 'Textiles',
        quantity: 100,
        unit: 'pieces',
        price: 150,
        mrp: 300,
        condition: 'new',
        status: 'active'
      }])
      .select()
      .single();
    if (prodErr) throw prodErr;
    productId = productData.id;
    console.log('Product created. ID:', productId, 'Initial Qty:', productData.quantity);

    // 4. Place Order as Buyer
    console.log('\n4. Placing Order as Buyer...');
    // Sign in as buyer to establish session
    const { error: bSignInErr } = await supabase.auth.signInWithPassword({
      email: buyerEmail,
      password: password
    });
    if (bSignInErr) throw bSignInErr;

    const { data: orderData, error: orderErr } = await supabase
      .from('orders')
      .insert([{
        product_id: productId,
        seller_id: sellerAuth.id,
        buyer_id: buyerAuth.id,
        buyer_name: 'Test Buyer',
        buyer_email: buyerEmail,
        quantity: 10,
        total_price: 1500,
        status: 'pending'
      }])
      .select()
      .single();
    if (orderErr) throw orderErr;
    orderId = orderData.id;
    console.log('Order placed successfully. ID:', orderId, 'Qty:', orderData.quantity);

    // 5. Query Orders as Buyer
    console.log('\n5. Querying Orders as Buyer...');
    const { data: buyerOrders, error: bQueryErr } = await supabase
      .from('orders')
      .select('*, products(name, unit, category, profiles(full_name, company))')
      .eq('buyer_id', buyerAuth.id);
    if (bQueryErr) throw bQueryErr;
    console.log('Buyer sees orders count:', buyerOrders.length);
    if (buyerOrders.length > 0) {
      console.log('First order details (from Buyer perspective):');
      console.log('- Product Name:', buyerOrders[0].products?.name);
      console.log('- Seller Name:', buyerOrders[0].products?.profiles?.full_name);
      console.log('- Seller Company:', buyerOrders[0].products?.profiles?.company);
    }

    // 6. Query Orders as Seller
    console.log('\n6. Querying Orders as Seller...');
    // Sign in as seller
    const { error: sSignInErr2 } = await supabase.auth.signInWithPassword({
      email: sellerEmail,
      password: password
    });
    if (sSignInErr2) throw sSignInErr2;

    const { data: sellerOrders, error: sQueryErr } = await supabase
      .from('orders')
      .select('*, products(name, unit, category)')
      .eq('seller_id', sellerAuth.id);
    if (sQueryErr) throw sQueryErr;
    console.log('Seller sees orders count:', sellerOrders.length);

    // 7. Fulfill Order as Seller (Deliver)
    console.log('\n7. Fulfilling Order as Seller...');
    // Simulate handleUpdateOrderStatus logic
    const { data: fetchOrderData, error: fOrderErr } = await supabase
      .from('orders')
      .select('product_id, quantity, status')
      .eq('id', orderId)
      .single();
    if (fOrderErr) throw fOrderErr;

    if (fetchOrderData.status !== 'delivered') {
      const { data: fetchProductData, error: fProdErr } = await supabase
        .from('products')
        .select('quantity')
        .eq('id', fetchOrderData.product_id)
        .single();
      if (fProdErr) throw fProdErr;

      const newQty = fetchProductData.quantity - fetchOrderData.quantity;

      const { error: uProdErr } = await supabase
        .from('products')
        .update({ quantity: newQty })
        .eq('id', fetchOrderData.product_id);
      if (uProdErr) throw uProdErr;

      const { error: uOrderErr } = await supabase
        .from('orders')
        .update({ status: 'delivered' })
        .eq('id', orderId);
      if (uOrderErr) throw uOrderErr;
      console.log('Order set to delivered. Product quantity updated to:', newQty);
    }

    // Verify product qty in DB
    const { data: finalProd, error: finalProdErr } = await supabase
      .from('products')
      .select('quantity')
      .eq('id', productId)
      .single();
    if (finalProdErr) throw finalProdErr;
    console.log('\nFinal Product Qty in DB:', finalProd.quantity);

  } catch (err) {
    console.error('\nTEST FAILED WITH ERROR:', err);
  } finally {
    console.log('\n--- CLEANING UP TEST DATA ---');
    // Sign back in as seller to delete product
    if (sellerAuth) {
      await supabase.auth.signInWithPassword({ email: sellerEmail, password });
      if (productId) {
        await supabase.from('products').delete().eq('id', productId);
      }
      // Profiles are deleted cascade on auth user delete in Supabase admin,
      // but here we can just leave auth user since it's a test env or manually delete them if we had admin keys.
    }
    console.log('--- TEST FINISHED ---');
  }
}

runTest();
