// Test script for Supabase connection
// Run this in your browser console to test Supabase setup

// Test 1: Check if environment variables are loaded
console.log('Environment Variables Check:');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY);

// Test 2: Test Supabase client creation
try {
  const { createClient } = await import('@supabase/supabase-js');
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing environment variables');
    console.log('Create a .env file with:');
    console.log('VITE_SUPABASE_URL=your_project_url');
    console.log('VITE_SUPABASE_ANON_KEY=your_anon_key');
  } else {
    console.log('✅ Environment variables loaded');
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client created');
    
    // Test 3: Test basic connection
    const { data, error } = await supabase.from('cleaner_profiles').select('count').limit(1);
    if (error) {
      console.error('❌ Database connection failed:', error);
    } else {
      console.log('✅ Database connection successful');
    }
    
    // Test 4: Test auth methods
    console.log('✅ Auth methods available:', Object.keys(supabase.auth));
    
  }
} catch (error) {
  console.error('❌ Error testing Supabase:', error);
}

// Test 5: Check if tables exist
async function checkTables() {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
    
    const tables = ['cleaner_profiles', 'client_profiles', 'cleaner_services'];
    
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('count').limit(1);
        if (error) {
          console.log(`❌ Table ${table}:`, error.message);
        } else {
          console.log(`✅ Table ${table}: exists`);
        }
      } catch (e) {
        console.log(`❌ Table ${table}: error checking`);
      }
    }
  } catch (error) {
    console.error('Error checking tables:', error);
  }
}

// Run table check
checkTables();
