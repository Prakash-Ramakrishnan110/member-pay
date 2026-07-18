'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';

function VerifyOTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '';

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (!phone) {
      router.replace('/login');
    }
  }, [phone, router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace with actual Supabase OTP verification
      console.log('Verifying OTP:', otp, 'for', phone);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock logic: 123456 simulates success for existing user
      // Any other 6-digit code simulates a new user going to onboarding
      if (otp === '123456') {
        router.push('/dashboard');
      } else {
        router.push('/onboarding');
      }
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setCountdown(30);
    // TODO: Trigger OTP resend
    console.log('Resending OTP to', phone);
  };

  if (!phone) return null;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-blue-600">Verify Phone</CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to +91 {phone}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              type="text"
              placeholder="000000"
              className="text-center text-2xl tracking-widest"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              disabled={isLoading}
              maxLength={6}
              autoFocus
              required
            />
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          </div>
          
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading || otp.length !== 6}>
            {isLoading ? 'Verifying...' : 'Verify & Continue'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 text-sm text-center">
        <div>
          {countdown > 0 ? (
            <span className="text-gray-500">Resend code in {countdown}s</span>
          ) : (
            <button 
              type="button" 
              onClick={handleResend}
              className="text-blue-600 hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>
        <Link href="/login" className="text-gray-500 hover:text-gray-900 underline">
          Change phone number
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function VerifyOTPPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Suspense fallback={<p>Loading...</p>}>
        <VerifyOTPForm />
      </Suspense>
    </div>
  );
}
