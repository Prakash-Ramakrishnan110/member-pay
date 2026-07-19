'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/ui/logo';
import { Mail, Loader2, ArrowRight, Lock, User, ShieldCheck, Activity, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';

export default function AuthPage() {
  const router = useRouter();
  const [authType, setAuthType] = useState<'signin' | 'signup'>('signin');
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Password Strength Logic
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-slate-200', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];

  const [checkEmail, setCheckEmail] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authType === 'signup' && getPasswordStrength(password) < 4) {
      alert("Please ensure your password meets all security requirements to protect against hackers.");
      return;
    }
    
    setIsLoading(true);

    const supabase = createClient();
    let errorMsg = null;

    if (authType === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });
      errorMsg = error?.message;
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      errorMsg = error?.message;
    }
    
    setIsLoading(false);
    
    if (errorMsg) {
      alert(errorMsg);
    } else {
      if (authType === 'signup') {
        setCheckEmail(true);
      } else {
        router.push('/dashboard');
      }
    }
  };

  if (checkEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans selection:bg-blue-200 selection:text-blue-900 bg-slate-50 p-4">
        <div className="w-full max-w-md bg-white border border-slate-200 shadow-sm rounded-xl p-8 text-center animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
          <p className="text-slate-500 mb-6">
            We&apos;ve sent a verification link to <span className="font-semibold text-slate-700">{email}</span>. Please click the link to activate your account.
          </p>
          <Button 
            onClick={() => {
              setCheckEmail(false);
              setAuthType('signin');
            }} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Return to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex font-sans selection:bg-blue-200 selection:text-blue-900 bg-white">
      
      {/* Left Side: Branding & Testimonial (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-slate-950 p-12 relative overflow-hidden">
        {/* Background glow */}
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
            <div className="mb-6 flex gap-1">
              {[1,2,3,4,5].map(star => (
                <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-3xl font-medium text-white leading-tight mb-6">
              &quot;Switching to MemberPay was the best decision for our studio. Managing memberships and collecting payments has never been this seamless and professional.&quot;
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold text-white border border-blue-500 shadow-lg shadow-blue-500/20">
                AS
              </div>
              <div>
                <div className="text-white font-semibold">Ananya Sharma</div>
                <div className="text-slate-400 text-sm">Founder, Zen Yoga Studio</div>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="relative z-10 text-slate-500 text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> 256-bit secure encryption
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold tracking-tight text-slate-900">Member<span className="text-blue-600">Pay</span></span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {authType === 'signin' ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-slate-500">
              {authType === 'signin' ? 'Enter your details to access your dashboard.' : 'Start your 1-week free trial. No credit card required.'}
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex p-1 bg-slate-100 rounded-lg mb-8 relative">
            <button
              onClick={() => setAuthType('signin')}
              className={cn(
                "flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-200 z-10",
                authType === 'signin' ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthType('signup')}
              className={cn(
                "flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-200 z-10",
                authType === 'signup' ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Sign Up
            </button>
            {/* Animated Pill */}
            <motion.div 
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-md shadow-sm border border-slate-200/50"
              animate={{ left: authType === 'signin' ? '4px' : 'calc(50%)' }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
            />
          </div>



          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {authType === 'signup' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2 overflow-hidden"
                >
                  <Label htmlFor="name" className="text-slate-700 font-medium">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Rahul Kumar"
                      className="pl-10 h-11 border-slate-200"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={authType === 'signup'}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                {authType === 'signin' && (
                  <Link href="/forgot-password" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-11 border-slate-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              {/* Password Strength Indicator (Signup Only) */}
              <AnimatePresence>
                {authType === 'signup' && password.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-2 space-y-2 overflow-hidden"
                  >
                    <div className="flex gap-1 h-1.5 mt-2">
                      {[1, 2, 3, 4].map((level) => (
                        <div 
                          key={level} 
                          className={cn(
                            "flex-1 rounded-full transition-colors duration-300",
                            getPasswordStrength(password) >= level ? strengthColors[getPasswordStrength(password)] : 'bg-slate-200'
                          )} 
                        />
                      ))}
                    </div>
                    <p className={cn("text-xs font-semibold", strengthColors[getPasswordStrength(password)].replace('bg-', 'text-'))}>
                      {strengthLabels[getPasswordStrength(password)]} Password
                    </p>
                    <ul className="text-xs text-slate-500 space-y-1 mt-1">
                      <li className="flex items-center gap-1">
                        <CheckCircle2 className={cn("h-3 w-3", password.length >= 8 ? "text-green-500" : "text-slate-300")} /> 8+ characters
                      </li>
                      <li className="flex items-center gap-1">
                        <CheckCircle2 className={cn("h-3 w-3", /[A-Z]/.test(password) ? "text-green-500" : "text-slate-300")} /> 1 uppercase letter
                      </li>
                      <li className="flex items-center gap-1">
                        <CheckCircle2 className={cn("h-3 w-3", /[0-9]/.test(password) ? "text-green-500" : "text-slate-300")} /> 1 number
                      </li>
                      <li className="flex items-center gap-1">
                        <CheckCircle2 className={cn("h-3 w-3", /[^A-Za-z0-9]/.test(password) ? "text-green-500" : "text-slate-300")} /> 1 special character
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
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
                    Authenticating...
                  </motion.span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {authType === 'signin' ? 'Sign In' : 'Start 1-Week Free Trial'}
                  <ArrowRight className="h-5 w-5" />
                </span>
              )}
            </Button>
          </form>

          {authType === 'signup' && (
            <p className="text-center text-sm text-slate-500 mt-6">
              By signing up, you agree to our <Link href="/terms" className="text-blue-600 font-semibold hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 font-semibold hover:underline">Privacy Policy</Link>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
