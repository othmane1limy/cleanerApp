import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const token = searchParams.get('token');
  const type = searchParams.get('type');
  
  // Also check for error parameters from URL
  const urlError = searchParams.get('error');
  const urlErrorDescription = searchParams.get('error_description');

  useEffect(() => {
    // Check if there's an error in the URL first
    if (urlError) {
      console.error('URL Error:', urlError, urlErrorDescription);
      setError(`Verification failed: ${urlErrorDescription || urlError}`);
      setVerificationStatus('error');
      return;
    }

    if (token && type === 'signup') {
      verifyEmail();
    } else if (!token) {
      setError('No verification token found. Please check your email for the verification link.');
      setVerificationStatus('error');
    }
  }, [token, type, urlError, urlErrorDescription]);

  const verifyEmail = async () => {
    try {
      setVerificationStatus('verifying');
      setError('');

      console.log('Verifying email with token:', token);
      console.log('Token type:', type);

      // Try to verify the email
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup'
      });

      if (error) {
        console.error('Email verification error:', error);
        setError(`Verification failed: ${error.message}`);
        setVerificationStatus('error');
        return;
      }

      if (data?.user) {
        console.log('Email verified successfully:', data.user);
        setVerificationStatus('success');
        
        // Wait a moment for auth state to update and database trigger to run
        setTimeout(() => {
          // Redirect based on user type
          const userType = data.user.user_metadata?.user_type;
          console.log('Redirecting user type:', userType);
          
          if (userType === 'cleaner') {
            navigate('/cleaner-dashboard');
          } else {
            navigate('/client-profile');
          }
        }, 2000);
      } else {
        setError('Verification completed but no user data returned');
        setVerificationStatus('error');
      }
    } catch (error) {
      console.error('Verification exception:', error);
      setError(`Verification failed: ${error.message}`);
      setVerificationStatus('error');
    }
  };

  const resendVerificationEmail = async () => {
    try {
      setIsResending(true);
      setResendMessage('');

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setResendMessage('No user found. Please try signing up again.');
        return;
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email
      });

      if (error) {
        setResendMessage(`Failed to resend email: ${error.message}`);
      } else {
        setResendMessage('Verification email sent successfully! Please check your inbox.');
      }
    } catch (error) {
      setResendMessage(`Error resending email: ${error.message}`);
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case 'verifying':
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Verifying Your Email</h2>
            <p className="text-muted-foreground">Please wait while we verify your email address...</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h2 className="text-xl font-semibold mb-2">Email Verified Successfully!</h2>
            <p className="text-muted-foreground mb-4">
              Your account has been activated and profile is being created...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Redirecting in a moment...</p>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <h2 className="text-xl font-semibold mb-2">Verification Failed</h2>
            <p className="text-red-600 mb-4">{error}</p>
            
            {urlError && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Debug Info:</strong> Error: {urlError}, Description: {urlErrorDescription}
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              <Button
                onClick={resendVerificationEmail}
                disabled={isResending}
                className="w-full"
              >
                {isResending ? 'Sending...' : 'Resend Verification Email'}
              </Button>
              {resendMessage && (
                <p className={`text-sm ${resendMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                  {resendMessage}
                </p>
              )}
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="w-full"
              >
                Go to Login
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-card rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground">Email Verification</h1>
            <p className="text-muted-foreground">
              {verificationStatus === 'verifying' 
                ? 'Please wait while we verify your email...'
                : 'Complete your account setup'
              }
            </p>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
