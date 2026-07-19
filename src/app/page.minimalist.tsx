'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import {
  CheckCircle2,
  MessageSquare,
  Zap,
  ArrowRight,
  ChevronDown,
  Activity,
  CreditCard,
  PieChart,
  Globe,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/logo';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 rounded-md group"
      >
        <span className="text-base font-semibold text-slate-900 transition-colors">
          {question}
        </span>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-slate-400 transition-transform duration-200 shrink-0 ml-4',
            isOpen && 'rotate-180 text-slate-900'
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pt-4 text-slate-600 text-sm leading-relaxed pr-8">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900 selection:bg-slate-200 selection:text-slate-900 overflow-x-hidden">
      
      {/* Navigation */}
      <nav
        className={cn(
          'fixed top-0 w-full z-50 transition-all duration-200 border-b',
          scrolled ? 'bg-white/90 backdrop-blur-md border-slate-200 py-4 shadow-sm' : 'bg-white border-slate-200 py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6 text-slate-900" />
            <span className="text-xl font-bold tracking-tight text-slate-900">
              MemberPay
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="#features" className="hover:text-slate-900 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="hover:text-slate-900 transition-colors">
              Pricing
            </Link>
            <Link href="#faq" className="hover:text-slate-900 transition-colors">
              FAQ
            </Link>
          </div>
          <div className="flex gap-4 items-center">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors hidden sm:block"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className={cn(
                buttonVariants({
                  variant: 'default',
                  className:
                    'bg-slate-900 hover:bg-slate-800 text-white rounded-md px-5 text-sm transition-all shadow-sm',
                })
              )}
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative flex flex-col items-center justify-center text-center px-6 pt-40 pb-24 lg:pt-52 lg:pb-32 max-w-5xl mx-auto w-full z-10">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col items-center w-full">
          
          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-6xl lg:text-[72px] font-bold text-slate-900 tracking-tight leading-[1.05] mb-6 max-w-4xl"
          >
            Manage memberships <br className="hidden md:block" /> with complete clarity.
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl leading-relaxed">
            The professional operating system for gyms, studios, and academies. Automate payments, send WhatsApp reminders, and eliminate manual tracking.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4 mb-4">
            <Link
              href="/login"
              className={cn(
                buttonVariants({
                  className:
                    'bg-slate-900 hover:bg-slate-800 text-white shadow-sm rounded-md px-8 h-12 text-sm font-medium transition-all w-full sm:w-auto',
                })
              )}
            >
              Start Free Trial
            </Link>
            <Link
              href="#contact"
              className={cn(
                buttonVariants({
                  variant: 'outline',
                  className:
                    'rounded-md px-8 h-12 text-sm font-medium border-slate-200 text-slate-900 hover:bg-slate-50 transition-all w-full sm:w-auto',
                })
              )}
            >
              Contact Sales
            </Link>
          </motion.div>
        </motion.div>

        {/* Minimalist Product Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-5xl relative mt-20"
        >
          <div className="relative w-full bg-slate-50 rounded-xl border border-slate-200 p-2 overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)]">
            <div className="rounded-lg bg-white border border-slate-200 p-8 flex flex-col gap-8 h-[400px]">
              {/* Header Mockup */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div className="h-4 w-32 rounded bg-slate-100"></div>
                <div className="h-8 w-24 rounded bg-slate-100"></div>
              </div>
              {/* Stats Mockup */}
              <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-lg border border-slate-100 p-5 flex flex-col gap-2">
                    <div className="h-3 w-16 rounded bg-slate-100"></div>
                    <div className="h-6 w-24 rounded bg-slate-200"></div>
                  </div>
                ))}
              </div>
              {/* List Mockup */}
              <div className="flex flex-col gap-4 mt-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex justify-between items-center pb-4 border-b border-slate-50">
                    <div className="flex gap-4 items-center">
                      <div className="h-8 w-8 rounded-full bg-slate-100"></div>
                      <div className="flex flex-col gap-2">
                        <div className="h-3 w-32 rounded bg-slate-200"></div>
                        <div className="h-2 w-20 rounded bg-slate-100"></div>
                      </div>
                    </div>
                    <div className="h-6 w-16 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold flex items-center justify-center">PAID</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Social Proof */}
      <section className="py-16 border-y border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-slate-500">
            Trusted by modern businesses
          </p>
          <div className="flex flex-wrap justify-center gap-x-16 gap-y-8 text-xl font-bold text-slate-300">
            <span className="flex items-center gap-2 hover:text-slate-900 transition-colors grayscale">
              <Zap className="w-5 h-5" /> PulseFitness
            </span>
            <span className="flex items-center gap-2 hover:text-slate-900 transition-colors grayscale">
              <Activity className="w-5 h-5" /> CoreStudio
            </span>
            <span className="flex items-center gap-2 hover:text-slate-900 transition-colors grayscale">
              <PieChart className="w-5 h-5" /> ApexTuitions
            </span>
            <span className="font-serif italic hover:text-slate-900 transition-colors text-2xl grayscale">The Salon</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-20 text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 mb-6 tracking-tight">
              A professional foundation for your operations.
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              MemberPay provides the precise tools required to manage memberships, automate collections, and maintain a clear financial overview.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm flex flex-col min-h-[220px]">
              <div className="h-10 w-10 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center mb-6">
                <MessageSquare className="h-5 w-5 text-slate-900" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Automated Reminders</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Dispatch WhatsApp notifications prior to billing dates, ensuring consistent cashflow without manual intervention.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm flex flex-col min-h-[220px]">
              <div className="h-10 w-10 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center mb-6">
                <CreditCard className="h-5 w-5 text-slate-900" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Secure Payments</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Process transactions instantly via Razorpay, supporting UPI, credit cards, and direct bank transfers.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm flex flex-col min-h-[220px]">
              <div className="h-10 w-10 rounded-md border border-slate-200 bg-slate-50 flex items-center justify-center mb-6">
                <Activity className="h-5 w-5 text-slate-900" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Data Analytics</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Monitor Monthly Recurring Revenue (MRR) and retention metrics through a clear, organized dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Transparent Pricing
            </h2>
            <p className="text-base text-slate-600">Start with a 7-day trial. Cancel anytime.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
            {/* Pro Monthly */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 flex flex-col">
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Monthly</h3>
              <p className="text-slate-500 mb-6 text-sm">Flexible billing for growing teams.</p>
              <div className="text-5xl font-bold text-slate-900 mb-8">
                ₹499<span className="text-lg font-medium text-slate-400">/mo</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1 text-sm text-slate-700">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-slate-900 shrink-0" /> Unlimited members
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-slate-900 shrink-0" /> Auto WhatsApp reminders
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-slate-900 shrink-0" /> Payment tracking dashboard
                </li>
              </ul>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({
                    className:
                      'w-full rounded-md h-12 text-sm font-medium border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 transition-all',
                  })
                )}
              >
                Select Monthly
              </Link>
            </div>

            {/* Pro Yearly (highlighted) */}
            <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-10 flex flex-col relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-slate-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Recommended
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Yearly</h3>
              <p className="text-slate-400 mb-6 text-sm">Save ₹989 annually.</p>
              <div className="text-5xl font-bold text-white mb-8">
                ₹4,999<span className="text-lg font-medium text-slate-500">/yr</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1 text-sm text-slate-300">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-white shrink-0" /> Everything in Monthly
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-white shrink-0" /> 2 months free
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-white shrink-0" /> Priority support
                </li>
              </ul>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({
                    className:
                      'w-full rounded-md h-12 text-sm font-medium bg-white text-slate-900 hover:bg-slate-100 transition-all',
                  })
                )}
              >
                Select Yearly
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>
          <div>
            <FAQItem
              question="Do you take a percentage of my payments?"
              answer="No. We charge a flat subscription fee. Your members pay you directly via Razorpay, and any standard transaction fees are charged by your payment gateway."
            />
            <FAQItem
              question="Can I import my existing members?"
              answer="Yes. You can bulk upload your existing members via a CSV file, ensuring a seamless transition to our platform."
            />
            <FAQItem
              question="Do members need to download an app?"
              answer="No app is required. Members receive a secure Razorpay payment link via WhatsApp and can complete the transaction in their standard mobile browser."
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-16 justify-between items-start">
          <div className="max-w-lg">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
              Ready to streamline your business?
            </h2>
            <p className="text-slate-600 text-base mb-8">
              Join the businesses using MemberPay to automate their operations and secure their cashflow.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-700 text-sm">
                <MessageSquare className="h-5 w-5 text-slate-400" />
                support@memberpay.com
              </div>
              <div className="flex items-center gap-3 text-slate-700 text-sm">
                <Globe className="h-5 w-5 text-slate-400" />
                Bangalore, India
              </div>
            </div>
          </div>
          <div className="w-full max-w-md bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Request a Demo</h3>
            <form action="https://api.web3forms.com/submit" method="POST" className="space-y-4">
              <input type="hidden" name="access_key" value="402a86f7-a283-4e94-b95b-70ffccc94339" />
              <input type="hidden" name="subject" value="Demo Request" />
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Work Email</label>
                <input
                  type="email"
                  name="Email"
                  required
                  className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all"
                  placeholder="name@company.com"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Company Name</label>
                <input
                  type="text"
                  name="Company"
                  required
                  className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all"
                  placeholder="Acme Studio"
                />
              </div>
              <button
                type="submit"
                className="w-full h-10 mt-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-all"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Logo className="h-5 w-5 text-slate-900" />
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              MemberPay
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
          </div>
          <div className="text-sm text-slate-500">
            © 2026 MemberPay. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
