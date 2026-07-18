'use client';

import { useState, useActionState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { completeOnboarding } from '@/app/actions/onboarding-actions';
import { Loader2, ArrowRight, CreditCard, CheckCircle2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { Logo } from '@/components/ui/logo';
import { WhatsAppClient } from '@/components/dashboard/whatsapp-client';
import { createClient } from '@/utils/supabase/client';

const initialState: { error?: string } = { error: undefined };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-11" 
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          Complete Setup
          <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [state, formAction] = useActionState(completeOnboarding, initialState);
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
    });
  }, []);

  const [businessData, setBusinessData] = useState({
    name: '',
    type: 'Gym',
    city: '',
    paymentType: 'manual',
    memberCount: '0-50',
    upiId: '',
    logoUrl: '',
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 font-sans text-slate-900">
      
      {/* Branding */}
      <div className="mb-8 flex items-center gap-2">
        <Logo className="h-8 w-8 text-blue-600" />
        <span className="text-2xl font-bold tracking-tight">Member<span className="text-blue-600">Pay</span></span>
      </div>
      
      {/* Main Container */}
      <div className="w-full max-w-lg bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Progress Bar */}
        <div className="w-full h-1 bg-slate-100">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
              {step === 1 && "Tell us about your business"}
              {step === 2 && "Setup your payments"}
              {step === 3 && "You're all set!"}
            </h1>
            <p className="text-slate-500 text-sm">
              {step === 1 && "Let's tailor your dashboard specifically for your needs."}
              {step === 2 && "Connect Razorpay to automate your fee collection."}
              {step === 3 && "Your profile is ready. Let's head to the dashboard."}
            </p>
          </div>
          
          <form action={formAction}>
            {/* Hidden inputs to pass state to server action */}
            <input type="hidden" name="name" value={businessData.name} />
            <input type="hidden" name="type" value={businessData.type} />
            <input type="hidden" name="city" value={businessData.city} />
            <input type="hidden" name="paymentSetup" value={businessData.paymentType} />
            <input type="hidden" name="memberCount" value={businessData.memberCount} />
            <input type="hidden" name="upiId" value={businessData.upiId} />
            <input type="hidden" name="logoUrl" value={businessData.logoUrl} />

            <div className="min-h-[220px]">
              {state.error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm flex items-center">
                  <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {state.error}
                </div>
              )}

              {/* Step 1: Business Details */}
              {step === 1 && (
                <div className="space-y-5 animate-in slide-in-from-right-8 fade-in duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="bname" className="text-sm font-medium text-slate-700">Business Name</Label>
                    <Input 
                      id="bname" 
                      placeholder="e.g. FitLife Gym" 
                      className="h-11 bg-white border-slate-300 text-slate-900 focus-visible:ring-blue-600 focus-visible:border-blue-600"
                      value={businessData.name} 
                      onChange={e => setBusinessData({...businessData, name: e.target.value})} 
                      required 
                    />
                  </div>


                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="btype" className="text-sm font-medium text-slate-700">Business Type</Label>
                      <select 
                        id="btype" 
                        className="flex h-11 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600" 
                        value={businessData.type} 
                        onChange={e => setBusinessData({...businessData, type: e.target.value})}
                      >
                        <option>Gym</option>
                        <option>Yoga Studio</option>
                        <option>Tuition/Coaching</option>
                        <option>Salon</option>
                        <option>Dance Class</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="memberCount" className="text-sm font-medium text-slate-700">Current Members</Label>
                      <select 
                        id="memberCount" 
                        className="flex h-11 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600" 
                        value={businessData.memberCount} 
                        onChange={e => setBusinessData({...businessData, memberCount: e.target.value})}
                      >
                        <option value="0-50">0 - 50</option>
                        <option value="51-200">51 - 200</option>
                        <option value="201-500">201 - 500</option>
                        <option value="500+">500+</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payments */}
              {step === 2 && (
                <div className="flex flex-col items-center justify-center space-y-5 h-full animate-in slide-in-from-right-8 fade-in duration-300 text-center">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2">
                    <CreditCard className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Payment Collection</h3>
                  <p className="text-slate-600 text-sm max-w-sm">
                    Not everyone has a payment gateway. How do you primarily collect fees?
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 w-full mt-4">
                    <div 
                      className={`border-2 rounded-xl p-4 cursor-pointer text-left transition-all ${businessData.paymentType === 'online' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}
                      onClick={() => setBusinessData({...businessData, paymentType: 'online'})}
                    >
                      <div className="font-semibold text-slate-900 text-sm mb-1">Online</div>
                      <div className="text-xs text-slate-500">Razorpay, Cards, Auto-UPI</div>
                    </div>
                    <div 
                      className={`border-2 rounded-xl p-4 cursor-pointer text-left transition-all ${businessData.paymentType === 'manual' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}
                      onClick={() => setBusinessData({...businessData, paymentType: 'manual'})}
                    >
                      <div className="font-semibold text-slate-900 text-sm mb-1">Manual</div>
                      <div className="text-xs text-slate-500">Cash, Direct PhonePe/GPay</div>
                    </div>
                  </div>

                  {/* Show UPI input if Online is selected */}
                  {businessData.paymentType === 'online' && (
                    <div className="w-full mt-6 space-y-2 animate-in slide-in-from-bottom-2 fade-in duration-300 text-left">
                      <Label htmlFor="upiId" className="text-sm font-medium text-slate-700">Enter your UPI ID to receive payments</Label>
                      <Input 
                        id="upiId" 
                        placeholder="e.g. gymname@okicici" 
                        className="h-11 bg-white border-slate-300 text-slate-900 focus-visible:ring-blue-600 focus-visible:border-blue-600"
                        value={businessData.upiId} 
                        onChange={e => setBusinessData({...businessData, upiId: e.target.value})}
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        You can also connect Razorpay later from your dashboard settings.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: WhatsApp Bot Setup */}
              {step === 3 && (
                <div className="flex flex-col items-center justify-center space-y-5 h-full animate-in slide-in-from-right-8 fade-in duration-300">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 text-center">Connect WhatsApp Bot</h3>
                  <p className="text-slate-600 text-sm text-center max-w-sm">
                    Connect your phone now so you can automatically send payment reminders to your members with one click later!
                  </p>
                  
                  <div className="w-full mt-4">
                    {userId ? (
                      <div className="scale-90 origin-top transform-gpu">
                        <WhatsAppClient businessId={userId} initialStatus="disconnected" />
                      </div>
                    ) : (
                      <div className="text-center py-4"><Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto"/></div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Success */}
              {step === 4 && (
                <div className="flex flex-col items-center justify-center space-y-4 h-full text-center animate-in zoom-in-95 fade-in duration-500 py-4">
                  <CheckCircle2 className="w-20 h-20 text-green-500" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Awesome, {businessData.name || 'Admin'}!</h3>
                    <p className="text-slate-500 text-sm">
                      Your workspace is ready. Let&apos;s go to your dashboard!
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Navigation Footer */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100">
              {step > 1 ? (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={prevStep} 
                  className="h-10 px-6 border-slate-300"
                >
                  Back
                </Button>
              ) : (
                <div /> // Spacer
              )}
              
              {step < 4 ? (
                <div className="flex gap-3">
                  {(step === 2 || step === 3) && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={nextStep}
                      className="h-10 px-6 text-slate-500"
                    >
                      Skip
                    </Button>
                  )}
                  <Button 
                    type="button" 
                    onClick={nextStep} 
                    disabled={step === 1 && !businessData.name}
                    className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-8"
                  >
                    Continue
                  </Button>
                </div>
              ) : (
                <div className="flex-1 ml-4">
                  <SubmitButton />
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
