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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
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
          <div className="flex items-center gap-2">
            <Logo className="h-7 w-7 text-blue-600" />
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Member<span className="text-blue-600">Pay</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="#features" className="hover:text-blue-600 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="hover:text-blue-600 transition-colors">
              Pricing
            </Link>
            <Link href="#faq" className="hover:text-blue-600 transition-colors">
              FAQ
            </Link>
            <Link href="#contact" className="hover:text-blue-600 transition-colors">
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
                    'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 rounded-full px-6 transition-all',
                })
              )}
            >
              Start Free Trial <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 lg:pt-48 lg:pb-32 max-w-5xl mx-auto w-full z-10">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col items-center w-full">
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center bg-blue-50 border border-blue-100 text-blue-700 rounded-full px-4 py-1.5 text-sm font-medium mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
            MemberPay 2.0 is live
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6 max-w-4xl"
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
                    'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 rounded-full px-8 h-12 text-base font-semibold transition-all hover:-translate-y-0.5',
                })
              )}
            >
              Start Free Trial <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
            <Link
              href="#features"
              className={cn(
                buttonVariants({
                  variant: 'outline',
                  className:
                    'rounded-full px-8 h-12 text-base font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 transition-all',
                })
              )}
            >
              See how it works
            </Link>
          </motion.div>
        </motion.div>

        {/* Product Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-4xl relative mt-16"
        >
          <div className="relative w-full bg-white rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-200 p-3 overflow-hidden">
            {/* Fake Browser Header */}
            <div className="flex items-center gap-2 px-3 py-2.5 mb-3">
              <div className="w-3 h-3 rounded-full bg-slate-200"></div>
              <div className="w-3 h-3 rounded-full bg-slate-200"></div>
              <div className="w-3 h-3 rounded-full bg-slate-200"></div>
              <div className="ml-3 h-6 flex-1 max-w-xs rounded-md bg-slate-50 border border-slate-100"></div>
            </div>

            {/* Dashboard Content Mockup */}
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-6 flex flex-col gap-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-24 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-4 flex flex-col justify-end shadow-sm">
                  <div className="h-2 w-14 rounded-full bg-white/60 mb-2"></div>
                  <div className="h-5 w-20 rounded-md bg-white/90"></div>
                </div>
                <div className="h-24 rounded-xl bg-white border border-slate-200 p-4 flex flex-col justify-end shadow-sm">
                  <div className="h-2 w-14 rounded-full bg-slate-200 mb-2"></div>
                  <div className="h-5 w-20 rounded-md bg-slate-100"></div>
                </div>
                <div className="h-24 rounded-xl bg-white border border-slate-200 p-4 flex flex-col justify-end shadow-sm">
                  <div className="h-2 w-14 rounded-full bg-slate-200 mb-2"></div>
                  <div className="h-5 w-20 rounded-md bg-slate-100"></div>
                </div>
              </div>

              <div className="rounded-xl bg-white border border-slate-200 p-4 flex flex-col gap-3 shadow-sm">
                <div className="h-4 w-32 rounded-md bg-slate-100 mb-1"></div>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100"></div>
                      <div className="h-3 w-32 rounded-md bg-slate-100"></div>
                    </div>
                    <div className="h-6 w-16 rounded-full bg-emerald-100"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating Notification */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1, type: 'spring', bounce: 0.4 }}
            className="absolute -top-6 -right-6 md:-right-10 bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 p-4 flex items-center gap-3 z-20"
          >
            <div className="bg-emerald-50 p-2 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
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
            <span className="flex items-center gap-2 hover:text-slate-600 transition-colors">
              <Zap className="w-5 h-5" /> PulseFitness
            </span>
            <span className="flex items-center gap-2 hover:text-slate-600 transition-colors">
              <Activity className="w-5 h-5" /> CoreStudio
            </span>
            <span className="flex items-center gap-2 hover:text-slate-600 transition-colors">
              <PieChart className="w-5 h-5" /> ApexTuitions
            </span>
            <span className="font-serif italic hover:text-slate-600 transition-colors text-2xl">The Salon</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 relative">
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
              className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[240px]"
            >
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Smart Reminders</h3>
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
              className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[240px]"
            >
              <div className="h-12 w-12 rounded-xl bg-cyan-50 flex items-center justify-center mb-6">
                <CreditCard className="h-6 w-6 text-cyan-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Instant Payments</h3>
                <p className="text-slate-600 leading-relaxed">Accept UPI, cards, and netbanking via Razorpay.</p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
              className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[240px]"
            >
              <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-6">
                <Activity className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Real-time Analytics</h3>
                <p className="text-slate-600 leading-relaxed">Track MRR and churn on a beautiful dashboard.</p>
              </div>
            </motion.div>

            {/* Card 4 (Wide) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
              className="md:col-span-2 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[240px]"
            >
              <div className="h-12 w-12 rounded-xl bg-white/15 flex items-center justify-center mb-6">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Zero Setup Time</h3>
                <p className="text-blue-50 max-w-md leading-relaxed">
                  Import your members from Excel and start collecting payments in minutes. No tech knowledge
                  required.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-1">Free Trial</h3>
              <p className="text-slate-500 mb-6 text-sm">Try it risk-free for 7 days.</p>
              <div className="text-4xl font-extrabold text-slate-900 mb-8">
                ₹0<span className="text-base font-medium text-slate-400">/7 days</span>
              </div>
              <ul className="space-y-3 mb-10 flex-1 text-sm text-slate-600">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0" /> Manage up to 50 members
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0" /> Basic payment tracking
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0" /> Zero commissions
                </li>
              </ul>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({
                    className:
                      'w-full rounded-full h-12 text-base font-semibold border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 transition-all',
                  })
                )}
              >
                Get Started
              </Link>
            </motion.div>

            {/* Pro Monthly */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-1">Pro Monthly</h3>
              <p className="text-slate-500 mb-6 text-sm">For growing businesses.</p>
              <div className="text-4xl font-extrabold text-slate-900 mb-8">
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
                      'w-full rounded-full h-12 text-base font-semibold border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 transition-all',
                  })
                )}
              >
                Start Monthly
              </Link>
            </motion.div>

            {/* Pro Yearly (highlighted) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative bg-slate-900 rounded-2xl shadow-xl shadow-slate-900/20 p-8 flex flex-col md:-translate-y-4"
            >
              <div className="absolute -top-3 left-8 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Most popular
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Pro Yearly</h3>
              <p className="text-slate-400 mb-6 text-sm">Save ₹989 instantly.</p>
              <div className="text-4xl font-extrabold text-white mb-8">
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
                      'w-full rounded-full h-12 text-base font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-all',
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
          <div>
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
      <section id="contact" className="py-32 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 max-w-2xl">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Contact</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-3 mb-4 tracking-tight">
              Get in touch.
            </h2>
            <p className="text-lg text-slate-600">Send us a message and our team will get back to you within 24 hours.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-10">
              <form action="https://api.web3forms.com/submit" method="POST" className="space-y-6">
                <input type="hidden" name="access_key" value="402a86f7-a283-4e94-b95b-70ffccc94339" />
                <input type="hidden" name="subject" value="New Submission from MemberPay Landing Page" />
                <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">First name</label>
                    <input
                      type="text"
                      name="First Name"
                      required
                      className="w-full h-12 rounded-xl border border-slate-200 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Last name</label>
                    <input
                      type="text"
                      name="Last Name"
                      required
                      className="w-full h-12 rounded-xl border border-slate-200 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email address</label>
                  <input
                    type="email"
                    name="Email"
                    required
                    className="w-full h-12 rounded-xl border border-slate-200 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">How can we help?</label>
                  <select
                    name="Inquiry Type"
                    required
                    className="w-full h-12 rounded-xl border border-slate-200 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-slate-700 bg-white appearance-none"
                  >
                    <option value="">Select an option</option>
                    <option value="Sales">Sales &amp; pricing inquiry</option>
                    <option value="Demo">Request a demo</option>
                    <option value="Support">Customer support</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Message</label>
                  <textarea
                    name="Message"
                    required
                    className="w-full h-32 rounded-xl border border-slate-200 p-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all resize-none"
                    placeholder="Tell us more..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5"
                >
                  Send message
                </button>
              </form>
            </div>

            {/* Support Info */}
            <div className="flex flex-col justify-center gap-10">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Customer support</h3>
                <p className="text-slate-600 leading-relaxed">
                  Already using MemberPay? We offer dedicated WhatsApp and email support.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="p-3 bg-blue-50 rounded-xl shrink-0">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-slate-900">Email support</h4>
                    <p className="text-slate-500 text-sm mt-0.5">support@memberpay.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="p-3 bg-cyan-50 rounded-xl shrink-0">
                    <Smartphone className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-slate-900">WhatsApp support</h4>
                    <p className="text-slate-500 text-sm mt-0.5">Available for Pro plan members.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="p-3 bg-emerald-50 rounded-xl shrink-0">
                    <Globe className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-slate-900">Office</h4>
                    <p className="text-slate-500 text-sm mt-0.5">Bangalore, India</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            {/* Brand Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Logo className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold text-white tracking-tight">
                  Member<span className="text-blue-400">Pay</span>
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-6 max-w-sm">
                Smart membership and subscription management for growing businesses.
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Users className="h-4 w-4" />
                Built for gyms, studios, academies, and salons.
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Links</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/" className="hover:text-blue-400 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#features" className="hover:text-blue-400 transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-blue-400 transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-blue-400 transition-colors">
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
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    Gyms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    Coaching
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    Academies
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
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
                  <Link href="#faq" className="hover:text-blue-400 transition-colors">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-blue-400 transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-blue-400 transition-colors">
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
