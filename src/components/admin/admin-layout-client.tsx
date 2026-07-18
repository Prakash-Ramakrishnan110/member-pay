'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, CreditCard, Settings, Building2, ShieldAlert, LogOut, Activity } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const adminNavItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/customers', label: 'Customers', icon: Building2 },
  { href: '/admin/revenue', label: 'Revenue', icon: CreditCard },
  { href: '/admin/members', label: 'Global Members', icon: Users },
  { href: '/admin/logs', label: 'Activity Logs', icon: Activity },
  { href: '/admin/settings', label: 'Platform Config', icon: Settings },
];

export function AdminLayoutClient({ children, userEmail }: { children: React.ReactNode, userEmail?: string }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-950 text-slate-300 md:flex">
        <div className="flex h-16 items-center border-b border-slate-800 px-6 gap-3">
          <div className="bg-red-500/20 p-2 rounded-lg">
            <ShieldAlert className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight">Super Admin</span>
          </div>
        </div>
        
        <nav className="flex-1 space-y-1 p-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
            Management
          </div>
          {adminNavItems.map((item) => {
            // Exact match for /admin to avoid highlighting it on /admin/customers
            const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
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
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}

          <div className="mt-8 mb-4 border-t border-slate-800 pt-8">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
              Switch Context
            </div>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-700 bg-slate-800/50"
            >
              <LogOut className="h-4 w-4 rotate-180" />
              Return to Business View
            </Link>
          </div>
        </nav>
        
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white text-xs font-bold">
            SA
          </div>
          <div className="flex flex-col truncate">
            <span className="text-sm font-medium text-white truncate">Founder</span>
            <span className="text-xs text-slate-500 truncate">{userEmail}</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between border-b border-slate-200 bg-white px-8 sticky top-0 z-30">
          <h1 className="text-xl font-semibold text-slate-800 capitalize">
            {pathname === '/admin' ? 'Overview' : pathname.split('/').pop()?.replace('-', ' ')}
          </h1>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Platform Live
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-8 flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
