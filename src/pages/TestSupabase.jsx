import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const TestSupabase = () => {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (message, type = 'info') => {
    setTestResults(prev => [...prev, { message, type, timestamp: new Date().toLocaleTimeString() }]);
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      // Test 1: Check environment variables
      addResult('🔍 Checking environment variables...', 'info');
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        addResult('❌ Missing environment variables', 'error');
        addResult('Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY', 'error');
        return;
      } else {
        addResult('✅ Environment variables loaded', 'success');
        addResult(`URL: ${supabaseUrl.substring(0, 30)}...`, 'info');
        addResult(`Key: ${supabaseKey.substring(0, 20)}...`, 'info');
      }

      // Test 2: Test Supabase client
      addResult('🔍 Testing Supabase client...', 'info');
      if (supabase) {
        addResult('✅ Supabase client available', 'success');
      } else {
        addResult('❌ Supabase client not available', 'error');
        return;
      }

      // Test 3: Test database connection
      addResult('🔍 Testing database connection...', 'info');
      const { data, error } = await supabase.from('cleaner_profiles').select('count').limit(1);
      if (error) {
        addResult(`❌ Database connection failed: ${error.message}`, 'error');
      } else {
        addResult('✅ Database connection successful', 'success');
      }

      // Test 4: Check tables
      addResult('🔍 Checking database tables...', 'info');
      const tables = ['cleaner_profiles', 'client_profiles', 'cleaner_services'];
      
      for (const table of tables) {
        try {
          const { error } = await supabase.from(table).select('count').limit(1);
          if (error) {
            addResult(`❌ Table ${table}: ${error.message}`, 'error');
          } else {
            addResult(`✅ Table ${table}: exists`, 'success');
          }
        } catch (e) {
          addResult(`❌ Table ${table}: error checking`, 'error');
        }
      }

      // Test 5: Test auth methods
      addResult('🔍 Testing authentication methods...', 'info');
      const authMethods = Object.keys(supabase.auth);
      addResult(`✅ Auth methods available: ${authMethods.join(', ')}`, 'success');

      // Test 6: Test profile creation (without actually creating)
      addResult('🔍 Testing profile table structure...', 'info');
      try {
        const { error } = await supabase
          .from('client_profiles')
          .select('id, user_id, first_name, last_name')
          .limit(1);
        
        if (error) {
          addResult(`❌ Profile table query failed: ${error.message}`, 'error');
        } else {
          addResult('✅ Profile table structure is correct', 'success');
        }
      } catch (e) {
        addResult(`❌ Profile table test failed: ${e.message}`, 'error');
      }

    } catch (error) {
      addResult(`❌ Test execution failed: ${error.message}`, 'error');
    } finally {
      setIsRunning(false);
      addResult('🏁 All tests completed', 'info');
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
              <h1 className="text-2xl font-bold text-foreground">Supabase Connection Test</h1>
              <p className="text-muted-foreground">Test your Supabase configuration and database connection</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={runTests}
                disabled={isRunning}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                {isRunning ? 'Running Tests...' : 'Run Tests'}
              </button>
              <button
                onClick={clearResults}
                className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/90"
              >
                Clear Results
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Test Results:</h3>
              {testResults.length === 0 ? (
                <p className="text-muted-foreground">Click "Run Tests" to start testing</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded text-sm ${
                        result.type === 'error' ? 'bg-error/10 text-error' :
                        result.type === 'success' ? 'bg-success/10 text-success' :
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
              <h3 className="font-semibold mb-2">What to Check:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Environment variables are loaded</li>
                <li>• Supabase client can be created</li>
                <li>• Database connection works</li>
                <li>• Required tables exist</li>
                <li>• Authentication methods are available</li>
                <li>• Profile tables are accessible</li>
              </ul>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">If Tests Fail:</h3>
              <ol className="text-sm text-muted-foreground space-y-1">
                <li>1. Check your `.env` file has the correct Supabase credentials</li>
                <li>2. Restart your development server after adding `.env`</li>
                <li>3. Verify your Supabase project is active</li>
                <li>4. Check that the database schema is applied</li>
                <li>5. Look at the specific error messages for guidance</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSupabase;
