'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function MemberPortalLogin() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!/^[0-9]{10}$/.test(phone)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call to send OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep('OTP');
    } catch (err) {
      setError('Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, successful verification would set a cookie/token
      router.push('/portal');
    } catch (err) {
      setError('Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Member Login</CardTitle>
          <CardDescription>
            {step === 'PHONE' 
              ? 'Enter your registered phone number to view your membership details.' 
              : `Enter the 6-digit code sent to +91 ${phone}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'PHONE' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-100 px-3 text-sm text-gray-500">
                    +91
                  </span>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="9999999999"
                    className="rounded-l-none"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    disabled={isLoading}
                    maxLength={10}
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading || phone.length !== 10}>
                {isLoading ? 'Sending OTP...' : 'Get OTP'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
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
                {isLoading ? 'Verifying...' : 'Login securely'}
              </Button>
              <div className="text-center pt-2">
                <button 
                  type="button" 
                  onClick={() => setStep('PHONE')}
                  className="text-sm text-gray-500 hover:text-gray-900 underline"
                >
                  Change phone number
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
