'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/ui/logo';
import { Mail, Loader2, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const supabase = createClient();
    
    // We redirect them back to the login page with a hash to open a reset password modal, or to a specific reset page.
    // For now, let's just trigger the email.
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login?reset=true`,
    });

    setIsLoading(false);

    if (error) {
      alert(error.message);
    } else {
      setIsSuccess(true);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans selection:bg-blue-200 selection:text-blue-900 bg-slate-50 p-4">
        <div className="w-full max-w-md bg-white border border-slate-200 shadow-sm rounded-xl p-8 text-center animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
          <p className="text-slate-500 mb-6">
            If an account exists for <span className="font-semibold text-slate-700">{email}</span>, we&apos;ve sent password reset instructions.
          </p>
          <Link href="/login" className="block w-full">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Return to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex font-sans selection:bg-blue-200 selection:text-blue-900 bg-white">
      
      {/* Left Side: Branding (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-slate-950 p-12 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <Logo className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold tracking-tight text-white">Member<span className="text-blue-500">Pay</span></span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-medium text-white leading-tight mb-4">
              Forgot your password?
            </h2>
            <p className="text-slate-400 text-lg">
              Don&apos;t worry, it happens to the best of us. Enter your email address and we&apos;ll get you back into your account in no time.
            </p>
          </motion.div>
        </div>
        
        <div className="relative z-10 text-slate-500 text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> 256-bit secure encryption
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold tracking-tight text-slate-900">Member<span className="text-blue-600">Pay</span></span>
            </Link>
          </div>

          <div className="mb-8">
            <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700 mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Reset Password</h1>
            <p className="text-slate-500">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@gym.com"
                  className="pl-10 h-11 border-slate-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base mt-6 transition-all shadow-lg shadow-blue-600/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    Sending link...
                  </motion.span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Send Reset Link
                  <ArrowRight className="h-5 w-5" />
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
