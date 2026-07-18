import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4 mb-10">
          <Link href="/" className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <Logo className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
        </div>
        
        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-indigo-600">
          <p><strong>Last Updated: July 2026</strong></p>
          <p>At MemberPay (developed by Fusion Engine Technology), your privacy is our priority. This Privacy Policy outlines how we collect, use, and protect your information when you use our SaaS platform.</p>
          
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly to us when creating an account, including your name, business details, and contact information. We also process your members' data strictly on your behalf.</p>
          
          <h2>2. How We Use Your Data</h2>
          <p>We use your data to provide our services, process payments via Razorpay, send automated WhatsApp reminders, and improve our platform. We never sell your data to third parties.</p>
          
          <h2>3. Data Security</h2>
          <p>We implement bank-grade security measures to protect your data. All transactions are securely processed through Razorpay.</p>
          
          <h2>4. Contact Us</h2>
          <p>If you have any questions about this policy, please contact us at support@MemberPay.com.</p>
        </div>
      </div>
    </div>
  );
}
