'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, CreditCard, User, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { useRouter } from 'next/navigation';

export function PortalDashboardClient({ member }: { member: any }) {
  const router = useRouter();
  
  const handleLogout = async () => {
    // Just delete cookie by setting maxAge to 0
    document.cookie = "member_portal_token=; max-age=0; path=/";
    router.push('/portal');
  };

  const businessName = member.businesses?.name || 'Your Gym';
  const upiId = member.businesses?.upi_id;

  const nextDueDate = new Date(member.next_due_date);
  const today = new Date();
  today.setHours(0,0,0,0);
  
  const diffTime = nextDueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let statusColor = 'text-green-600 bg-green-50';
  let statusIcon = <CheckCircle2 className="w-5 h-5 text-green-600" />;
  let statusText = 'Active & Paid';

  if (member.status === 'Inactive') {
    statusColor = 'text-red-600 bg-red-50';
    statusIcon = <AlertCircle className="w-5 h-5 text-red-600" />;
    statusText = 'Suspended';
  } else if (diffDays < 0) {
    statusColor = 'text-orange-600 bg-orange-50';
    statusIcon = <AlertCircle className="w-5 h-5 text-orange-600" />;
    statusText = 'Overdue';
  } else if (diffDays <= 3) {
    statusColor = 'text-yellow-600 bg-yellow-50';
    statusIcon = <AlertCircle className="w-5 h-5 text-yellow-600" />;
    statusText = 'Due Soon';
  }

  const handlePayNow = () => {
    if (upiId) {
      const link = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(businessName)}&am=${member.fee_amount}&cu=INR`;
      window.location.href = link;
    } else {
      alert("This business has not configured online payments yet. Please pay at the front desk.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Logo />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-700 hidden sm:block">
                Welcome, {member.name}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-slate-700">
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row gap-8 justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{businessName}</h1>
            <p className="text-slate-500">Your membership portal</p>
          </div>
          
          <div className={`px-4 py-2 rounded-full flex items-center gap-2 border ${statusColor.replace('text-', 'border-').replace('bg-', 'bg-').replace('600', '200')}`}>
            {statusIcon}
            <span className={`font-semibold ${statusColor.split(' ')[0]}`}>{statusText}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardHeader className="border-b border-slate-100 bg-white">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Membership Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Plan</p>
                  <p className="font-semibold text-slate-900">{member.plan_name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Billing Cycle</p>
                  <p className="font-semibold text-slate-900">{member.billing_cycle}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Fee Amount</p>
                  <p className="font-semibold text-slate-900">₹{member.fee_amount}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Join Date</p>
                  <p className="font-semibold text-slate-900">{new Date(member.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardHeader className="border-b border-slate-100 bg-white">
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-emerald-600" />
                Payment Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <p className="text-sm text-slate-500">Next Due Date</p>
                <p className={`text-2xl font-bold ${diffDays < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                  {nextDueDate.toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
                {diffDays < 0 && (
                  <p className="text-xs text-red-500 font-medium mt-1">Your payment is overdue by {Math.abs(diffDays)} days.</p>
                )}
              </div>
              
              <Button onClick={handlePayNow} className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg">
                <CreditCard className="w-5 h-5 mr-2" />
                Pay Now
              </Button>
            </CardContent>
          </Card>
        </div>

      </main>
    </div>
  );
}
