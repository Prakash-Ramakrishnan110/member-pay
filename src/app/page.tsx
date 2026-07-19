'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import {
  CheckCircle2,
  MessageSquare,
  Zap,
  Smartphone,
  ArrowRight,
  ChevronDown,
  Activity,
  CreditCard,
  PieChart,
  Globe,
  Users,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/logo';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const floatAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-md group"
      >
        <span className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
          {question}
        </span>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-slate-400 transition-transform duration-300 group-hover:text-blue-600 shrink-0 ml-4',
            isOpen && 'rotate-180 text-blue-600'
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
            <p className="pt-4 text-slate-600 leading-relaxed pr-8">{answer}</p>
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
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-50/50 rounded-b-[100%] blur-[80px] pointer-events-none -z-10" />

      {/* Navigation */}
      <nav
        className={cn(
          'fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent',
          scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-slate-200 py-4' : 'bg-transparent py-6'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-2 group cursor-pointer">
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }}>
              <Logo className="h-7 w-7 text-blue-600" />
            </motion.div>
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              Member<span className="text-blue-600">Pay</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="#features" className="hover:text-blue-600 transition-colors hover:-translate-y-0.5 inline-block">
              Features
            </Link>
            <Link href="#pricing" className="hover:text-blue-600 transition-colors hover:-translate-y-0.5 inline-block">
              Pricing
            </Link>
            <Link href="#faq" className="hover:text-blue-600 transition-colors hover:-translate-y-0.5 inline-block">
              FAQ
            </Link>
            <Link href="#contact" className="hover:text-blue-600 transition-colors hover:-translate-y-0.5 inline-block">
              Contact
            </Link>
          </div>
          <div className="flex gap-4 items-center">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors hidden sm:block"
            >
              Login
            </Link>
            <Link
              href="/login"
              className={cn(
                buttonVariants({
                  variant: 'default',
                  className:
                    'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 rounded-full px-4 sm:px-6 text-xs sm:text-sm whitespace-nowrap transition-all hover:shadow-blue-600/40 hover:-translate-y-0.5 hover:scale-105',
                })
              )}
            >
              Start Free Trial <ArrowRight className="ml-1.5 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform hidden sm:inline-block" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 lg:pt-48 lg:pb-32 max-w-5xl mx-auto w-full z-10">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col items-center w-full">
          <motion.div
            variants={fadeUp}
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer inline-flex items-center bg-blue-50 border border-blue-100 text-blue-700 rounded-full px-4 py-1.5 text-sm font-medium mb-8 hover:bg-blue-100 transition-colors"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
            MemberPay 2.0 is live
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6 max-w-4xl"
          >
            Simplify your payments.
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Grow your business.
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
            Automate member management, WhatsApp payment reminders, and recurring billing. Stop chasing payments
            and start focusing on your business.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4 mb-4">
            <Link
              href="/login"
              className={cn(
                buttonVariants({
                  className:
                    'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 rounded-full px-8 h-12 text-base font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-blue-600/40 hover:scale-105 group',
                })
              )}
            >
              Start Free Trial <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#features"
              className={cn(
                buttonVariants({
                  variant: 'outline',
                  className:
                    'rounded-full px-8 h-12 text-base font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-md',
                })
              )}
            >
              See how it works
            </Link>
          </motion.div>
        </motion.div>

        {/* Product Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-4xl relative mt-16 group"
        >
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-full bg-white rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-200 p-3 overflow-hidden group-hover:shadow-3xl group-hover:shadow-blue-500/10 transition-shadow duration-500"
          >
            {/* Fake Browser Header */}
            <div className="flex items-center gap-2 px-3 py-2.5 mb-3">
              <div className="w-3 h-3 rounded-full bg-slate-200 group-hover:bg-red-400 transition-colors"></div>
              <div className="w-3 h-3 rounded-full bg-slate-200 group-hover:bg-amber-400 transition-colors delay-75"></div>
              <div className="w-3 h-3 rounded-full bg-slate-200 group-hover:bg-emerald-400 transition-colors delay-150"></div>
              <div className="ml-3 h-6 flex-1 max-w-xs rounded-md bg-slate-50 border border-slate-100 group-hover:border-slate-200 transition-colors"></div>
            </div>

            {/* Dashboard Content Mockup */}
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-6 flex flex-col gap-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-24 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-4 flex flex-col justify-end shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div className="text-blue-100 text-xs font-medium mb-1">Total Revenue</div>
                  <div className="text-white text-2xl font-bold">₹1,24,500</div>
                </div>
                <div className="h-24 rounded-xl bg-white border border-slate-200 p-4 flex flex-col justify-end shadow-sm hover:shadow-lg hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div className="text-slate-500 text-xs font-medium mb-1">Active Members</div>
                  <div className="text-slate-900 text-2xl font-bold">245</div>
                </div>
                <div className="h-24 rounded-xl bg-white border border-slate-200 p-4 flex flex-col justify-end shadow-sm hover:shadow-lg hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div className="text-slate-500 text-xs font-medium mb-1">Pending Payments</div>
                  <div className="text-slate-900 text-2xl font-bold">₹12,400</div>
                </div>
              </div>

              <div className="rounded-xl bg-white border border-slate-200 p-4 flex flex-col gap-3 shadow-sm">
                <div className="text-sm font-semibold text-slate-800 mb-2">Recent Transactions</div>
                {[
                  { name: 'Rahul Sharma', amount: '₹4,500', plan: 'Pro Plan' },
                  { name: 'Priya Patel', amount: '₹2,000', plan: 'Basic Plan' },
                  { name: 'Amit Kumar', amount: '₹4,500', plan: 'Pro Plan' },
                ].map((tx, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-slate-100 p-3 hover:bg-slate-50 hover:border-blue-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                        {tx.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800">{tx.name}</div>
                        <div className="text-xs text-slate-500">{tx.plan}</div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">+{tx.amount}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Floating Notification */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: [0, -10, 0],
            }}
            transition={{ 
              opacity: { delay: 1, duration: 0.5 },
              scale: { delay: 1, type: 'spring', bounce: 0.5 },
              y: { delay: 1.5, duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute -top-6 -right-6 md:-right-10 bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 p-4 flex items-center gap-3 z-20"
          >
            <div className="bg-emerald-50 p-2 rounded-full relative">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-emerald-400 rounded-full opacity-20 blur-sm"
              />
              <CheckCircle2 className="w-6 h-6 text-emerald-500 relative z-10" />
            </div>
            <div className="text-left">
              <div className="text-base font-bold text-slate-900">₹4,500 Paid</div>
              <div className="text-xs text-slate-500 font-medium">Razorpay · UPI</div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Social Proof */}
      <section className="py-16 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-8">
          <p className="text-sm font-semibold tracking-wide uppercase text-slate-400">
            Trusted by growing businesses
          </p>
          <div className="flex flex-wrap justify-center gap-x-14 gap-y-6 text-xl font-bold text-slate-400">
            <span className="flex items-center gap-2 hover:text-slate-600 hover:scale-105 transition-all cursor-pointer">
              <Zap className="w-5 h-5 text-amber-400" /> PulseFitness
            </span>
            <span className="flex items-center gap-2 hover:text-slate-600 hover:scale-105 transition-all cursor-pointer">
              <Activity className="w-5 h-5 text-blue-400" /> CoreStudio
            </span>
            <span className="flex items-center gap-2 hover:text-slate-600 hover:scale-105 transition-all cursor-pointer">
              <PieChart className="w-5 h-5 text-emerald-400" /> ApexTuitions
            </span>
            <span className="font-serif italic hover:text-slate-600 hover:scale-105 transition-all text-2xl cursor-pointer">The Salon</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-2xl mb-20">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Features</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-3 mb-6 tracking-tight">
              Everything you need to scale.
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              MemberPay provides a complete toolkit to manage memberships, collect payments, and keep your
              cashflow healthy — without the manual chasing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 (Wide) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
              className="group md:col-span-2 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-2 hover:border-blue-200 transition-all duration-300 flex flex-col justify-between min-h-[240px]"
            >
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">Smart Reminders</h3>
                <p className="text-slate-600 max-w-md leading-relaxed">
                  Automated WhatsApp messages sent before due dates to ensure timely payments and keep your
                  cashflow healthy.
                </p>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
              className="group bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-2 hover:border-cyan-200 transition-all duration-300 flex flex-col justify-between min-h-[240px]"
            >
              <div className="h-12 w-12 rounded-xl bg-cyan-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-cyan-100 transition-all duration-300">
                <CreditCard className="h-6 w-6 text-cyan-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-cyan-600 transition-colors">Instant Payments</h3>
                <p className="text-slate-600 leading-relaxed">Accept UPI, cards, and netbanking via Razorpay.</p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
              className="group bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-2 hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between min-h-[240px]"
            >
              <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300">
                <Activity className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">Real-time Analytics</h3>
                <p className="text-slate-600 leading-relaxed">Track MRR and churn on a beautiful dashboard.</p>
              </div>
            </motion.div>

            {/* Card 4 (Wide) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
              className="group md:col-span-2 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between min-h-[240px] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-150 transition-transform duration-700">
                 <Sparkles className="h-48 w-48 text-white" />
              </div>
              <div className="relative z-10">
                <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300 backdrop-blur-sm">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform">Zero Setup Time</h3>
                  <p className="text-blue-50 max-w-md leading-relaxed group-hover:text-white transition-colors">
                    Import your members from Excel and start collecting payments in minutes. No tech knowledge
                    required.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-slate-50/50 border-y border-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Pricing</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-3 mb-4 tracking-tight">
              Honest, simple pricing.
            </h2>
            <p className="text-lg text-slate-600">All plans include a 1 week free trial.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
            {/* Trial */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-2 hover:border-blue-200 transition-all duration-300"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">Free Trial</h3>
              <p className="text-slate-500 mb-6 text-sm">Try it risk-free for 7 days.</p>
              <div className="text-4xl font-extrabold text-slate-900 mb-8 group-hover:scale-105 transform origin-left transition-transform">
                ₹0<span className="text-base font-medium text-slate-400">/7 days</span>
              </div>
              <ul className="space-y-3 mb-10 flex-1 text-sm text-slate-600">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-slate-300 group-hover:text-blue-600 transition-colors shrink-0" /> Manage up to 50 members
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-slate-300 group-hover:text-blue-600 transition-colors shrink-0" /> Basic payment tracking
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-slate-300 group-hover:text-blue-600 transition-colors shrink-0" /> Zero commissions
                </li>
              </ul>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({
                    className:
                      'w-full rounded-full h-12 text-base font-semibold border border-slate-200 bg-white text-slate-900 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-700 transition-all',
                  })
                )}
              >
                Get Started
              </Link>
            </motion.div>

            {/* Pro Monthly */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-2 hover:border-blue-200 transition-all duration-300"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">Pro Monthly</h3>
              <p className="text-slate-500 mb-6 text-sm">For growing businesses.</p>
              <div className="text-4xl font-extrabold text-slate-900 mb-8 group-hover:scale-105 transform origin-left transition-transform">
                ₹499<span className="text-base font-medium text-slate-400">/mo</span>
              </div>
              <ul className="space-y-3 mb-10 flex-1 text-sm text-slate-600">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0" /> Unlimited members
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0" /> Auto WhatsApp reminders
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0" /> Smart verifications
                </li>
              </ul>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({
                    className:
                      'w-full rounded-full h-12 text-base font-semibold border border-slate-200 bg-white text-slate-900 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all',
                  })
                )}
              >
                Start Monthly
              </Link>
            </motion.div>

            {/* Pro Yearly (highlighted) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative bg-slate-900 rounded-2xl shadow-2xl shadow-slate-900/20 p-8 flex flex-col md:-translate-y-4 hover:-translate-y-6 hover:shadow-blue-500/20 transition-all duration-300 border border-slate-800 hover:border-blue-500/50"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="absolute -top-3 left-8 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg shadow-blue-500/30">
                Most popular
              </div>
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">Pro Yearly</h3>
              <p className="text-slate-400 mb-6 text-sm group-hover:text-slate-300 transition-colors">Save ₹989 instantly.</p>
              <div className="text-4xl font-extrabold text-white mb-8 group-hover:scale-105 transform origin-left transition-transform">
                ₹4,999<span className="text-base font-medium text-slate-400">/yr</span>
              </div>
              <ul className="space-y-3 mb-10 flex-1 text-sm text-slate-300">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-cyan-400 shrink-0" /> Everything in Monthly
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-cyan-400 shrink-0" /> 2 months free
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-cyan-400 shrink-0" /> Priority onboarding
                </li>
              </ul>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({
                    className:
                      'w-full rounded-full h-12 text-base font-semibold bg-white text-slate-900 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all relative z-10',
                  })
                )}
              >
                Upgrade to Yearly
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">FAQ</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Questions? We've got answers.
            </h2>
          </div>
          <div className="bg-white p-2 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40">
            <FAQItem
              question="Do you take a percentage of my payments?"
              answer="No! We charge a flat monthly subscription fee. Your members pay you directly via Razorpay, and any standard transaction fees are charged by Razorpay, not us."
            />
            <FAQItem
              question="Can I import my existing members from Excel?"
              answer="Yes! You can easily bulk upload your existing members via a CSV/Excel file, or our support team can do it for you for free."
            />
            <FAQItem
              question="Do my members need to download an app?"
              answer="No app is required! Members receive a secure Razorpay payment link via WhatsApp. They click and pay in their browser."
            />
            <FAQItem
              question="How do automated reminders work?"
              answer="MemberPay automatically sends a WhatsApp reminder 3 days before the due date, and follows up if the payment becomes overdue."
            />
          </div>
        </div>
      </section>

      {/* Contact & Customer Support Section */}
      <section id="contact" className="py-32 bg-slate-50/50 border-y border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50/50 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-16 max-w-2xl">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Contact</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-3 mb-4 tracking-tight">
              Get in touch.
            </h2>
            <p className="text-lg text-slate-600">Send us a message and our team will get back to you within 24 hours.</p>
          </div>
          <div className="max-w-2xl mx-auto">
            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 md:p-10 hover:shadow-2xl hover:shadow-blue-500/5 transition-shadow duration-500"
            >
              <form action="https://api.web3forms.com/submit" method="POST" className="space-y-6">
                <input type="hidden" name="access_key" value="402a86f7-a283-4e94-b95b-70ffccc94339" />
                <input type="hidden" name="subject" value="New Submission from MemberPay Landing Page" />
                <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-slate-700 group-focus-within:text-blue-600 transition-colors">First name</label>
                    <input
                      type="text"
                      name="First Name"
                      required
                      className="w-full h-12 rounded-xl border border-slate-200 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all hover:border-slate-300"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-slate-700 group-focus-within:text-blue-600 transition-colors">Last name</label>
                    <input
                      type="text"
                      name="Last Name"
                      required
                      className="w-full h-12 rounded-xl border border-slate-200 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all hover:border-slate-300"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-sm font-medium text-slate-700 group-focus-within:text-blue-600 transition-colors">Email address</label>
                  <input
                    type="email"
                    name="Email"
                    required
                    className="w-full h-12 rounded-xl border border-slate-200 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all hover:border-slate-300"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2 group">
                  <label className="text-sm font-medium text-slate-700 group-focus-within:text-blue-600 transition-colors">How can we help?</label>
                  <select
                    name="Inquiry Type"
                    required
                    className="w-full h-12 rounded-xl border border-slate-200 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-slate-700 bg-white appearance-none hover:border-slate-300 cursor-pointer"
                  >
                    <option value="">Select an option</option>
                    <option value="Sales">Sales &amp; pricing inquiry</option>
                    <option value="Demo">Request a demo</option>
                    <option value="Support">Customer support</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2 group">
                  <label className="text-sm font-medium text-slate-700 group-focus-within:text-blue-600 transition-colors">Message</label>
                  <textarea
                    name="Message"
                    required
                    className="w-full h-32 rounded-xl border border-slate-200 p-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all resize-none hover:border-slate-300"
                    placeholder="Tell us more..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-1 hover:shadow-blue-600/40 active:scale-[0.98]"
                >
                  Send message
                </button>
              </form>
            </motion.div>


          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            {/* Brand Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6 group cursor-pointer">
                <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }}>
                  <Logo className="h-6 w-6 text-blue-400" />
                </motion.div>
                <span className="text-xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                  Member<span className="text-blue-400">Pay</span>
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-6 max-w-sm">
                Smart membership and subscription management for growing businesses.
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors">
                <Users className="h-4 w-4" />
                Built for gyms, studios, academies, and salons.
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Links</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-transform">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#features" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-transform">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-transform">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-transform">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Solutions</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-transform">
                    Gyms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-transform">
                    Coaching
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-transform">
                    Academies
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-transform">
                    Salons
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#faq" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-transform">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-transform">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-transform">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-800 gap-4 text-sm text-slate-500">
            <div>© 2026 MemberPay. All rights reserved.</div>
            <div>
              Designed &amp; developed by{' '}
              <a
                href="https://fusionengine.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Fusion Engine Technology
              </a>
              .
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
