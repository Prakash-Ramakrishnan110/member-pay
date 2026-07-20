'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, CreditCard, Settings, LogOut, Tags, BarChart3, ShieldCheck, Bell, ShieldAlert, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DashboardLayoutProps {
  children: React.ReactNode;
  businessName?: string;
  logoUrl?: string;
  isSuperAdmin?: boolean;
  subscriptionStatus?: string;
  planId?: string | null;
  createdAt?: string;
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/members', label: 'Members', icon: Users },
  { href: '/payments', label: 'Payments', icon: CreditCard },
  { href: '/plans', label: 'Plans', icon: Tags },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
  { href: '/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/billing', label: 'Billing', icon: CreditCard },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const mobileNavItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/members', label: 'Members', icon: Users },
  { href: '/payments', label: 'Pay', icon: CreditCard },
  { href: '/reports', label: 'Stats', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function DashboardLayout({ children, businessName, logoUrl, isSuperAdmin, subscriptionStatus, planId, createdAt }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const getInitials = (name: string) => {
    return name ? name.substring(0, 2).toUpperCase() : 'MP';
  };

  // Calculate Badge
  let badgeContent = null;
  if (planId) {
    // Has active plan
    badgeContent = (
      <div className="hidden lg:flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
        <span className="text-xs font-bold text-emerald-700">Pro Member</span>
      </div>
    );
  } else if (createdAt) {
    // In Trial
    const trialStartDate = new Date(createdAt);
    const today = new Date();
    const diffTime = Math.max(0, today.getTime() - trialStartDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const daysLeft = Math.max(0, 7 - diffDays);

    if (daysLeft > 0) {
      badgeContent = (
        <div className="hidden lg:flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
          <span className="text-xs font-bold text-indigo-700">Free Trial</span>
          <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded-md ml-1">{daysLeft} Days Left</span>
        </div>
      );
    } else {
      badgeContent = (
        <div className="hidden lg:flex items-center gap-2 bg-red-50 border border-red-100 px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span className="text-xs font-bold text-red-700">Trial Expired</span>
          <Link href="/billing" className="text-xs font-medium text-red-600 bg-red-100 px-1.5 py-0.5 rounded-md ml-1 hover:bg-red-200 transition-colors">Upgrade</Link>
        </div>
      );
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-900 text-slate-300 md:flex">
        <div className="flex h-16 items-center border-b border-slate-800 px-6 gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-8 w-8 object-cover rounded-lg shadow-sm border border-slate-800" />
          ) : (
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm ring-1 ring-white/10">
              {getInitials(businessName || '')}
            </div>
          )}
          <span className="text-lg font-bold text-white truncate tracking-tight">{businessName || 'MemberPay'}</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
          
          {/* Super Admin Link */}
          {isSuperAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors text-slate-400 hover:bg-slate-800 hover:text-white mt-4 border border-slate-700 bg-slate-800/50"
            >
              <ShieldAlert className="h-5 w-5 text-red-400" />
              <span className="text-red-400 font-semibold">Super Admin</span>
            </Link>
          )}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 pb-16 md:pb-0">
        {/* Mobile Header */}
        <header className="flex h-16 items-center border-b bg-white px-4 md:hidden gap-3 justify-between">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-8 w-8 object-cover rounded-lg shadow-sm border border-slate-100" />
            ) : (
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                {getInitials(businessName || '')}
              </div>
            )}
            <span className="text-lg font-bold text-slate-800 truncate tracking-tight">{businessName || 'MemberPay'}</span>
          </div>
          <button onClick={handleSignOut} className="p-2 text-slate-500 hover:text-red-600 transition-colors">
            <LogOut className="h-5 w-5" />
          </button>
        </header>

        {/* Desktop SaaS Header */}
        <header className="hidden md:flex h-16 items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-sm px-8 sticky top-0 z-30">
          <div className="flex items-center text-sm font-medium text-slate-600">
            <span className="capitalize">{pathname.split('/')[1] || 'Dashboard'}</span>
          </div>
          <div className="flex items-center gap-5">
            {badgeContent}
            
            <DropdownMenu>
              <DropdownMenuTrigger className="relative text-slate-400 hover:text-slate-600 transition-colors outline-none">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="px-2 py-1.5 text-sm font-semibold text-slate-900">Notifications</div>
                <DropdownMenuSeparator />
                <div className="p-6 text-sm text-slate-500 text-center flex flex-col items-center">
                  <Bell className="h-10 w-10 text-slate-200 mb-3" />
                  <p className="font-medium text-slate-900">You're all caught up!</p>
                  <p className="text-xs mt-1">No new alerts right now.</p>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-semibold text-xs shadow-sm hover:ring-2 hover:ring-slate-200 transition-all cursor-pointer">
                  {getInitials(businessName || '')}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm font-semibold text-slate-900">My Account</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/settings" />}>
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/billing" />}>
                  Billing & Plans
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-6 lg:p-8 bg-slate-50/50 min-h-[calc(100vh-4rem)]">{children}</div>
      </main>

      {/* Bottom Nav for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-white md:hidden overflow-x-auto">
        {mobileNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 w-full h-full text-xs font-medium transition-colors',
                isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
