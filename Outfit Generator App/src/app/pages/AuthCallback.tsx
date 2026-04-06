import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Button } from '../components/ui/button';

export function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const userID = searchParams.get('userID');
        const email = searchParams.get('email');
        const name = searchParams.get('name');
        const errorParam = searchParams.get('error');
    
        if (errorParam) {
          setError(decodeURIComponent(errorParam));
          setIsProcessing(false);
          return;
        }
    
        if (!userID || !email) {
          setError('Authentication failed. Missing user information.');
          setIsProcessing(false);
          return;
        }
    
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userID', userID);
        localStorage.setItem('userEmail', email);
        if (name) localStorage.setItem('userName', name);
    
        await new Promise(resolve => setTimeout(resolve, 1000));
    
        const userProfile = localStorage.getItem('userProfile');
        if (userProfile) {
          const profile = JSON.parse(userProfile);
          if (profile.onboardingComplete) {
            navigate('/app');
          } else {
            navigate('/onboarding');
          }
        } else {
          navigate('/onboarding');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('An unexpected error occurred during authentication.');
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [navigate, searchParams]);

  const handleRetry = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-full">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">
            {isProcessing ? 'Completing Sign In' : 'Authentication Error'}
          </CardTitle>
          <CardDescription>
            {isProcessing
              ? 'Please wait while we set up your account...'
              : 'There was a problem signing you in'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
              <p className="text-sm text-gray-600">Authenticating with Google...</p>
            </div>
          ) : error ? (
            <>
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <Button onClick={handleRetry} className="w-full">
                Return to Login
              </Button>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
