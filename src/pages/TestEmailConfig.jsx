import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import Button from '../components/ui/Button';
import Icon from '../components/AppIcon';

const TestEmailConfig = () => {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testEmail, setTestEmail] = useState('test@example.com');

  const addResult = (message, type = 'info') => {
    setTestResults(prev => [...prev, { message, type, timestamp: new Date().toLocaleTimeString() }]);
  };

  const runEmailTest = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      // Test 1: Check Supabase client
      addResult('🔍 Testing Supabase client...', 'info');
      if (supabase) {
        addResult('✅ Supabase client available', 'success');
      } else {
        addResult('❌ Supabase client not available', 'error');
        return;
      }

      // Test 2: Check auth methods
      addResult('🔍 Testing authentication methods...', 'info');
      const authMethods = Object.keys(supabase.auth);
      addResult(`✅ Auth methods available: ${authMethods.join(', ')}`, 'success');

      // Test 3: Test email signup (this will create a test user and profile)
      addResult('🔍 Testing email signup process...', 'info');
      
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'testpassword123',
        options: {
          data: {
            user_type: 'client',
            first_name: 'Test',
            last_name: 'User',
            phone: '+1234567890'
          }
        }
      });

      if (error) {
        addResult(`❌ Email signup failed: ${error.message}`, 'error');
      } else if (data.user) {
        addResult('✅ Test user created successfully', 'success');
        addResult(`📧 User ID: ${data.user.id}`, 'info');
        addResult(`📧 User metadata: ${JSON.stringify(data.user.user_metadata)}`, 'info');
        
        // Test 4: Wait for profile creation by database trigger
        addResult('🔍 Waiting for profile creation by database trigger...', 'info');
        
        // Wait for the trigger to process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Test 5: Check if profile was created
        addResult('🔍 Checking if profile was created...', 'info');
        
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('client_profiles')
            .select('*')
            .eq('user_id', data.user.id)
            .single();
            
          if (profileError) {
            addResult(`❌ Profile not found: ${profileError.message}`, 'error');
            addResult('💡 Check if the database trigger is working correctly', 'info');
          } else {
            addResult('✅ Profile created successfully by database trigger!', 'success');
            addResult(`📋 Profile data: ${JSON.stringify(profileData)}`, 'info');
          }
        } catch (profileError) {
          addResult(`❌ Profile check failed: ${profileError.message}`, 'error');
        }
        
        // Clean up: Delete the test user (optional)
        addResult('🔍 Cleaning up test user...', 'info');
        try {
          const { error: deleteError } = await supabase.auth.admin.deleteUser(data.user.id);
          if (deleteError) {
            addResult(`⚠️ Could not delete test user: ${deleteError.message}`, 'warning');
          } else {
            addResult('✅ Test user cleaned up', 'success');
          }
        } catch (cleanupError) {
          addResult(`⚠️ Cleanup failed: ${cleanupError.message}`, 'warning');
        }
        
      } else {
        addResult('❌ No user data returned from signup', 'error');
      }
      
    } catch (error) {
      addResult(`❌ Test execution failed: ${error.message}`, 'error');
    } finally {
      setIsRunning(false);
      addResult('🏁 Profile creation test completed', 'info');
    }
  };

  const testProfileCreation = async () => {
    setIsRunning(true);
    addResult('🔍 Testing profile creation for authenticated user...', 'info');
    
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        addResult('❌ No authenticated user found', 'error');
        return;
      }
      
      addResult(`✅ Authenticated user: ${user.email}`, 'success');
      addResult(`👤 User type: ${user.user_metadata?.user_type || 'Not set'}`, 'info');
      addResult(`📋 User metadata: ${JSON.stringify(user.user_metadata)}`, 'info');
      
      // Check if profile exists
      const userType = user.user_metadata?.user_type;
      if (userType) {
        const profileTable = userType === 'cleaner' ? 'cleaner_profiles' : 'client_profiles';
        addResult(`🔍 Checking profile in table: ${profileTable}`, 'info');
        
        const { data: profileData, error: profileError } = await supabase
          .from(profileTable)
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (profileError) {
          addResult(`❌ Profile not found: ${profileError.message}`, 'error');
        } else {
          addResult('✅ Profile found!', 'success');
          addResult(`📋 Profile data: ${JSON.stringify(profileData)}`, 'info');
        }
      } else {
        addResult('❌ No user type found in metadata', 'error');
      }
      
    } catch (error) {
      addResult(`❌ Profile creation test failed: ${error.message}`, 'error');
    } finally {
      setIsRunning(false);
    }
  };

  const testEmailVerification = async () => {
    setIsRunning(true);
    addResult('🔍 Testing email verification configuration...', 'info');
    
    try {
      // Test 1: Check if we can get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        addResult('❌ No authenticated user found', 'error');
        addResult('💡 You need to be logged in to test email verification', 'info');
        return;
      }
      
      addResult(`✅ Authenticated user: ${user.email}`, 'success');
      addResult(`📧 Email confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`, 'info');
      addResult(`👤 User type: ${user.user_metadata?.user_type || 'Not set'}`, 'info');
      
      // Test 2: Check if user needs verification
      if (user.email_confirmed_at) {
        addResult('✅ User email already confirmed', 'success');
        addResult('💡 No verification needed for this user', 'info');
        return;
      }
      
      // Test 3: Try to resend verification email
      addResult('🔍 Attempting to resend verification email...', 'info');
      
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: user.email
      });
      
      if (resendError) {
        addResult(`❌ Failed to resend verification email: ${resendError.message}`, 'error');
        
        // Check for specific error types
        if (resendError.message.includes('rate limit')) {
          addResult('⚠️ Rate limit exceeded. Wait a few minutes before trying again.', 'warning');
        } else if (resendError.message.includes('not found')) {
          addResult('⚠️ User not found. Try signing up again.', 'warning');
        } else if (resendError.message.includes('already confirmed')) {
          addResult('✅ User email already confirmed (status may be outdated)', 'success');
        }
      } else {
        addResult('✅ Verification email sent successfully!', 'success');
        addResult('📧 Check your inbox for the verification link', 'info');
      }
      
    } catch (error) {
      addResult(`❌ Email verification test failed: ${error.message}`, 'error');
    } finally {
      setIsRunning(false);
    }
  };

  const checkSupabaseConfig = async () => {
    setIsRunning(true);
    addResult('🔍 Checking Supabase configuration...', 'info');
    
    try {
      // Test 1: Check environment variables
      addResult('🔍 Checking environment variables...', 'info');
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl) {
        addResult('❌ VITE_SUPABASE_URL is missing', 'error');
      } else {
        addResult(`✅ VITE_SUPABASE_URL: ${supabaseUrl.substring(0, 20)}...`, 'success');
      }
      
      if (!supabaseKey) {
        addResult('❌ VITE_SUPABASE_ANON_KEY is missing', 'error');
      } else {
        addResult(`✅ VITE_SUPABASE_ANON_KEY: ${supabaseKey.substring(0, 20)}...`, 'success');
      }
      
      // Test 2: Check Supabase client
      if (supabase) {
        addResult('✅ Supabase client available', 'success');
      } else {
        addResult('❌ Supabase client not available', 'error');
        return;
      }
      
      // Test 3: Check auth methods
      const authMethods = Object.keys(supabase.auth);
      addResult(`✅ Auth methods available: ${authMethods.join(', ')}`, 'success');
      
      // Test 4: Check if we can connect to Supabase
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          addResult(`❌ Cannot connect to Supabase: ${error.message}`, 'error');
        } else {
          addResult('✅ Successfully connected to Supabase', 'success');
        }
      } catch (connError) {
        addResult(`❌ Connection test failed: ${connError.message}`, 'error');
      }
      
    } catch (error) {
      addResult(`❌ Configuration check failed: ${error.message}`, 'error');
    } finally {
      setIsRunning(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Supabase Email Configuration Test</h1>
              <p className="text-muted-foreground">Test your email verification setup and debug issues</p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={runEmailTest}
                disabled={isRunning}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                {isRunning ? 'Running Test...' : 'Run Email Test'}
              </Button>
              <Button
                onClick={testProfileCreation}
                disabled={isRunning}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isRunning ? 'Testing...' : 'Test Profile Creation'}
              </Button>
              <Button
                onClick={testEmailVerification}
                disabled={isRunning}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {isRunning ? 'Testing...' : 'Test Email Verification'}
              </Button>
              <Button
                onClick={checkSupabaseConfig}
                disabled={isRunning}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                {isRunning ? 'Checking...' : 'Check Supabase Config'}
              </Button>
              <Button
                onClick={clearResults}
                className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/90"
              >
                Clear Results
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Test Email Address:
            </label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="w-full p-2 border border-border rounded-md"
              placeholder="test@example.com"
            />
            <p className="text-xs text-muted-foreground mt-1">
              This email will be used to test the signup process. Make sure it's a valid email you can access.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Test Results:</h3>
              {testResults.length === 0 ? (
                <p className="text-muted-foreground">Click "Run Email Test" to start testing</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded text-sm ${
                        result.type === 'error' ? 'bg-error/10 text-error' :
                        result.type === 'success' ? 'bg-success/10 text-success' :
                        result.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-info/10 text-info'
                      }`}
                    >
                      <span className="font-mono text-xs opacity-70">[{result.timestamp}]</span> {result.message}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">What This Test Checks:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Supabase client connection</li>
                <li>• Authentication methods availability</li>
                <li>• Email signup process</li>
                <li>• Email confirmation status</li>
                <li>• Profile creation</li>
                <li>• Email sending functionality</li>
              </ul>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">If Test Fails:</h3>
              <ol className="text-sm text-muted-foreground space-y-1">
                <li>1. Check your Supabase project settings</li>
                <li>2. Verify email confirmations are enabled</li>
                <li>3. Check email templates are configured</li>
                <li>4. Verify redirect URLs are set correctly</li>
                <li>5. Check Supabase logs for errors</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestEmailConfig;
