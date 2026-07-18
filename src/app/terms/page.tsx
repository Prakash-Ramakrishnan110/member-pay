import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4 mb-10">
          <Link href="/" className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <Logo className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Terms of Service</h1>
        </div>
        
        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-indigo-600">
          <p><strong>Last Updated: July 2026</strong></p>
          <p>Welcome to MemberPay, powered by Fusion Engine Technology. By using our platform, you agree to these terms.</p>
          
          <h2>1. Service Description</h2>
          <p>MemberPay is a SaaS platform providing membership management, automated WhatsApp reminders, and payment collection tools via Razorpay integration.</p>
          
          <h2>2. User Responsibilities</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
          
          <h2>3. Payments & Subscriptions</h2>
          <p>We charge a flat monthly subscription fee as outlined on our pricing page. We do not take a percentage of your member collections. Razorpay transaction fees are separate and charged directly by Razorpay.</p>
          
          <h2>4. Termination</h2>
          <p>You may cancel your subscription at any time. We reserve the right to suspend or terminate accounts that violate our terms or engage in fraudulent activities.</p>
        </div>
      </div>
    </div>
  );
}
