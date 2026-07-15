const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdminUser() {
  console.log('Creating Admin Account...');
  const email = 'admin@bulkbazar.in';
  const password = 'adminpass123';
  
  try {
    // 1. Sign up the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password
    });

    if (signUpError) {
      console.log('Sign up error (could already exist):', signUpError.message);
      // Try to sign in to fetch user id
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        throw new Error('Failed to sign up or sign in: ' + signInError.message);
      }

      console.log('Admin already exists. Updating role to admin...');
      const { error: profileErr } = await supabase
        .from('profiles')
        .upsert({
          id: signInData.user.id,
          full_name: 'BulkBazar Platform Admin',
          company: 'BulkBazar HQ',
          role: 'admin'
        });
      if (profileErr) throw profileErr;
      console.log('Admin profile updated/verified successfully!');
    } else {
      console.log('Sign up successful! Creating profile...');
      const { error: profileErr } = await supabase
        .from('profiles')
        .insert([{
          id: signUpData.user.id,
          full_name: 'BulkBazar Platform Admin',
          company: 'BulkBazar HQ',
          role: 'admin'
        }]);
      if (profileErr) throw profileErr;
      console.log('Admin profile created successfully!');
    }
  } catch (err) {
    console.error('Error creating admin user:', err.message);
  }
}

createAdminUser();
