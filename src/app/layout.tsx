import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://memberpay.vercel.app'),
  title: {
    default: "MemberPay - Automated Subscription Billing & Payments in India",
    template: "%s | MemberPay"
  },
  description: "The ultimate dashboard for gyms, coaching centers, and studios in India. Auto-send WhatsApp payment reminders, manage members, and collect fees via Razorpay automatically.",
  keywords: ["Member Pay", "MemberPay", "gym billing software", "subscription billing India", "Razorpay integration", "WhatsApp payment reminders", "coaching center management software", "recurring payments India"],
  authors: [{ name: "MemberPay" }],
  creator: "MemberPay",
  publisher: "MemberPay",
  verification: {
    google: 'google8e575a756c39b615.html',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "MemberPay - Automated Subscription Billing",
    description: "Auto-send WhatsApp payment reminders and collect fees via Razorpay automatically for your gym or studio.",
    url: 'https://memberpay.vercel.app',
    siteName: 'MemberPay',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MemberPay - Automated Subscription Billing',
    description: 'Auto-send WhatsApp payment reminders and collect fees via Razorpay automatically.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  }
};

export const viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
