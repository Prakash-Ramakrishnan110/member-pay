'use client';

import { useState, useActionState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateSettings } from '@/app/actions/settings-actions';
import { Building2, MessageSquare, CreditCard, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateSettingsAction = async (prevState: any, formData: FormData) => {
  const data = {
    business_name: formData.get('business_name'),
    city: formData.get('city'),
    enable_online_payments: formData.get('enable_online_payments') === 'on',
    upi_id: formData.get('upi_id') || null,
    enable_whatsapp_click_to_chat: formData.get('enable_whatsapp_click_to_chat') === 'on',
    whatsapp_template: formData.get('whatsapp_template') || `Hi {{name}},

This is a gentle reminder from {{business_name}} that your gym membership fee is due.

*Member Details:*
👤 Name: {{name}}
🏋️ Plan: {{plan_name}}
📅 Due Date: {{due_date}}
💰 Amount Due: ₹{{amount}}

Please click the secure link below to view your invoice and complete your payment via Google Pay, PhonePe, or Paytm:
👉 {{payment_link}}

Thank you!`
  };

  const result = await updateSettings(data);
  if (result.error) {
    return { error: result.error, success: false };
  }
  return { success: true, error: null };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SettingsClient({ initialSettings, userPhone }: { initialSettings: any, userPhone: string }) {
  const [state, formAction] = useActionState(updateSettingsAction, { error: null, success: false });
  const [enableOnline, setEnableOnline] = useState(initialSettings?.enable_online_payments ?? true);
  const [enableWhatsApp, setEnableWhatsApp] = useState(initialSettings?.enable_whatsapp_click_to_chat ?? true);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (state.success) {
      setShowMessage(true);
      const timer = setTimeout(() => setShowMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [state.success]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      
      <form action={formAction} className="space-y-6">
        
        {/* Settings Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Workspace Settings
            </h1>
            <p className="text-slate-500 font-medium text-sm mt-1">
              Manage your business profile, payment collection preferences, and WhatsApp reminders.
            </p>
          </div>
          <div className="flex gap-2 shrink-0 items-center">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold h-9 px-4 rounded-md shadow-sm">
              Save All Settings
            </Button>
          </div>
        </div>

        {showMessage && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl border border-emerald-200 text-sm font-bold flex items-center gap-2 max-w-sm mx-auto shadow-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            Settings saved successfully!
          </motion.div>
        )}

        {state.error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl border border-red-200 text-sm font-bold flex items-center max-w-sm mx-auto">
            {state.error}
          </div>
        )}

        {/* 3-Column Grid Layout */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* General Profile Card */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col h-full">
            <Card className="border-slate-200 shadow-sm overflow-hidden rounded-2xl flex-1 flex flex-col">
              <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">General Profile</h3>
                </div>
              </div>
              <CardContent className="p-6 flex-1 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="business_name" className="text-slate-700 font-semibold text-xs uppercase tracking-wider">Business Name</Label>
                  <Input id="business_name" name="business_name" defaultValue={initialSettings?.business_name || 'My Gym'} required className="bg-slate-50 border-slate-200 rounded-xl font-medium" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-slate-700 font-semibold text-xs uppercase tracking-wider">City</Label>
                  <Input id="city" name="city" defaultValue={initialSettings?.city || ''} className="bg-slate-50 border-slate-200 rounded-xl font-medium" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-700 font-semibold text-xs uppercase tracking-wider">Owner Phone</Label>
                  <Input id="phone" defaultValue={userPhone} disabled className="bg-slate-100 text-slate-400 cursor-not-allowed rounded-xl font-medium" />
                  <p className="text-[10px] text-slate-500 mt-1">This is your login ID and cannot be changed here.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Setup Card */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col h-full">
            <Card className="border-slate-200 shadow-sm overflow-hidden rounded-2xl flex-1 flex flex-col">
              <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Payments</h3>
                </div>
              </div>
              <CardContent className="p-6 flex-1 space-y-6">
                
                <div className="space-y-2">
                  <Label htmlFor="upi_id" className="text-slate-700 font-semibold text-xs uppercase tracking-wider">UPI ID (0% Fees)</Label>
                  <Input 
                    id="upi_id" 
                    name="upi_id"
                    placeholder="e.g. gymname@okicici" 
                    defaultValue={initialSettings?.upi_id || ''}
                    className="bg-slate-50 border-slate-200 rounded-xl font-medium"
                  />
                  <p className="text-[10px] text-slate-500">
                    Used to generate automated QR codes.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wider cursor-pointer flex-1">Auto Links</Label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" name="enable_online_payments" className="sr-only peer" checked={enableOnline} onChange={e => setEnableOnline(e.target.checked)} />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">
                    Send automated Razorpay collection links to members.
                  </p>

                  {enableOnline && initialSettings?.razorpay_account_id && (
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                      <p className="text-[10px] font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> Razorpay Active</p>
                      <p className="text-xs text-blue-800 font-mono mt-1 break-all">{initialSettings.razorpay_account_id}</p>
                    </div>
                  )}
                  {enableOnline && !initialSettings?.razorpay_account_id && (
                    <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl">
                      <p className="text-[10px] text-orange-800 font-bold uppercase">Setup Pending</p>
                      <p className="text-xs text-orange-700 mt-1">Complete KYC onboarding to activate links.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* WhatsApp Settings Card */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col h-full">
            <Card className="border-slate-200 shadow-sm overflow-hidden rounded-2xl flex-1 flex flex-col">
              <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">WhatsApp</h3>
                </div>
              </div>
              <CardContent className="p-6 flex-1 flex flex-col space-y-4">
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wider cursor-pointer">Reminders</Label>
                    <p className="text-[10px] text-slate-500 mt-0.5">Click-to-chat buttons.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="enable_whatsapp_click_to_chat" className="sr-only peer" checked={enableWhatsApp} onChange={e => setEnableWhatsApp(e.target.checked)} />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="pb-4 border-b border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-slate-700 font-semibold text-xs uppercase tracking-wider">Automated Bot</Label>
                    {initialSettings?.whatsapp_session_status === 'connected' ? (
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">Connected</span>
                    ) : (
                      <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-bold">Disconnected</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 mb-3">Send messages automatically using your own number.</p>
                  <Button variant="outline" type="button" size="sm" className="w-full text-xs" onClick={() => window.location.href = '/settings/whatsapp'}>
                    {initialSettings?.whatsapp_session_status === 'connected' ? 'Manage Connection' : 'Connect Device'}
                  </Button>
                </div>

                
                {enableWhatsApp && (
                  <div className="flex-1 flex flex-col space-y-2 animate-in fade-in">
                    <Label htmlFor="whatsapp_template" className="text-slate-700 font-semibold text-xs uppercase tracking-wider">Template</Label>
                    <Textarea 
                      id="whatsapp_template"
                      name="whatsapp_template"
                      defaultValue={initialSettings?.whatsapp_template || `Hi {{name}},\n\nThis is a gentle reminder from {{business_name}} that your gym membership fee is due.\n\n*Member Details:*\n👤 Name: {{name}}\n🏋️ Plan: {{plan_name}}\n📅 Due Date: {{due_date}}\n💰 Amount Due: ₹{{amount}}\n\nPlease click the secure link below to view your invoice and complete your payment via Google Pay, PhonePe, or Paytm:\n👉 {{payment_link}}\n\nThank you!`}
                      className="flex-1 min-h-[200px] resize-none bg-slate-50 border-slate-200 rounded-xl text-xs font-medium text-slate-700 p-3"
                    />
                    <div className="bg-slate-100 rounded-lg p-2 mt-2">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Variables</p>
                      <div className="flex flex-wrap gap-1">
                        {['{{name}}', '{{amount}}', '{{due_date}}', '{{business_name}}', '{{plan_name}}', '{{payment_link}}'].map(tag => (
                          <span key={tag} className="font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] text-slate-600 shadow-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </form>
    </div>
  );
}
