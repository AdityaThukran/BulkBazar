const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://uqdlpcxhgavvrufkrvxy.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxZGxwY3hoZ2F2dnJ1Zmtydnh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NTQxODQsImV4cCI6MjA5OTUzMDE4NH0.RPEZ7-flWzLAJeJuDRXNoVsHOm22Ba-ulP_9tb_6Pj8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log('Logging in aditya@gmail.com...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'aditya@gmail.com',
    password: 'Aditya@27'
  });

  if (authError) {
    console.error('Authentication failed:', authError.message);
    process.exit(1);
  }

  const userId = authData.user.id;
  console.log(`Successfully authenticated! User ID: ${userId}`);

  // Calculate dynamic expiry dates
  const addDays = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const seedProducts = [
    {
      user_id: userId,
      name: 'Maruti Suzuki Fronx LED Headlamp Assembly',
      description: 'OEM replacement LED headlight assemblies for Maruti Suzuki Fronx (2023-24). Original factory sealed packaging. Perfect dead stock liquidation lot for automotive parts distributors and retail garages looking to stock genuine components at deep clearance pricing.',
      category: 'Auto Parts',
      quantity: 100,
      unit: 'kits',
      price: 374000,
      mrp: 600000,
      condition: 'new',
      status: 'active',
      image_url: '/mock-images/headlamp.png',
      expiry_date: null
    },
    {
      user_id: userId,
      name: 'FreshTomato Organic Ketchup (500g Glass Bottles)',
      description: 'Expiring Soon Bulk Lot of premium organic tomato ketchup glass bottles. Ideal for supermarket chains, grocery outlets, discount retail shops, and food trucks. Manufactured from fresh vine-ripened organic tomatoes. Fast clearance needed.',
      category: 'FMCG',
      quantity: 1500,
      unit: 'bottles',
      price: 45000,
      mrp: 150000,
      condition: 'new',
      status: 'active',
      image_url: '/mock-images/ketchup.png',
      expiry_date: addDays(15) // Expiring in 15 days
    },
    {
      user_id: userId,
      name: 'Paracetamol 650mg Tablets Bulk Lot',
      description: 'Pharmaceutical grade Paracetamol 650mg tablets. Wholesale surplus stock due to inventory restructuring. Batch fully certified with all quality assurance reports available. Packaged in boxes of 100 strips.',
      category: 'Pharma',
      quantity: 500,
      unit: 'boxes',
      price: 95000,
      mrp: 300000,
      condition: 'new',
      status: 'active',
      image_url: '/mock-images/paracetamol.png',
      expiry_date: addDays(25) // Expiring in 25 days
    },
    {
      user_id: userId,
      name: 'Carded Organic Pure Cotton Yarn Spools',
      description: 'High-quality 40s carded organic pure cotton yarn spools. Ideal for weaving, knitting mills, garment manufacturers, and textile craft retailers. Raw white color with high tensile strength.',
      category: 'Textiles',
      quantity: 2000,
      unit: 'spools',
      price: 180000,
      mrp: 320000,
      condition: 'new',
      status: 'active',
      image_url: '/mock-images/cotton_yarn.png',
      expiry_date: null
    },
    {
      user_id: userId,
      name: 'Organic Urea Nitrogen Fertilizer Bags (50kg)',
      description: 'Season clearance stock of high-grade organic Urea nitrogen fertilizer (46% nitrogen). Neatly stored in dry climate-controlled warehouses. Heavy duty 50kg bag packaging. Essential stock for agricultural retail co-ops.',
      category: 'Agriculture',
      quantity: 200,
      unit: 'bags',
      price: 60000,
      mrp: 120000,
      condition: 'new',
      status: 'active',
      image_url: '/mock-images/fertilizer.png',
      expiry_date: null
    }
  ];

  console.log('Seeding products...');
  const { error: insertError } = await supabase
    .from('products')
    .insert(seedProducts);

  if (insertError) {
    console.error('Failed to seed products:', insertError.message);
    process.exit(1);
  }

  console.log('Seeding completed successfully! 5 high-quality products added.');
}

run();
