import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { ArrowLeft, Globe, Briefcase, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-200 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Contact Info */}
        <div className="bg-slate-900 text-white p-12 md:w-2/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <ArrowLeft className="w-5 h-5 text-indigo-400" />
              </Link>
              <Logo className="w-6 h-6 text-indigo-400" />
              <span className="text-xl font-bold tracking-tight">Member<span className="text-indigo-400">Pay</span></span>
            </div>
            
            <h2 className="text-3xl font-extrabold mb-4">Get in touch</h2>
            <p className="text-slate-400 font-medium mb-10 leading-relaxed">
              Have questions about pricing, features, or need a custom demo? Our team at MemberPay is here to help.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/20 rounded-full"><Globe className="w-5 h-5 text-indigo-400" /></div>
                <a href="#" className="font-medium hover:text-white transition-colors">MemberPay HQ</a>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/20 rounded-full"><Briefcase className="w-5 h-5 text-indigo-400" /></div>
                <a href="https://prakash-portfolio-alpha.vercel.app" target="_blank" rel="noreferrer" className="font-medium hover:text-white transition-colors">Developer Portfolio</a>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/20 rounded-full"><MapPin className="w-5 h-5 text-indigo-400" /></div>
                <div className="font-medium">MemberPay, India</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-12 md:w-3/5">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h3>
          <form action="https://api.web3forms.com/submit" method="POST" className="space-y-6">
            <input type="hidden" name="access_key" value="402a86f7-a283-4e94-b95b-70ffccc94339" />
            <input type="hidden" name="subject" value="New Submission from MemberPay Contact Page" />
            <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">First Name</label>
                <input type="text" name="First Name" required className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" placeholder="John" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Last Name</label>
                <input type="text" name="Last Name" required className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" placeholder="Doe" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <input type="email" name="Email" required className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" placeholder="john@example.com" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Message</label>
              <textarea name="Message" required className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none" placeholder="How can we help you?"></textarea>
            </div>

            <button type="submit" className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
