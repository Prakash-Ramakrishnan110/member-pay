'use client';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-8">
        <span className="text-xl font-bold text-blue-600">FitLife Gym Portal</span>
        <span className="text-sm text-gray-500">Powered by MemberPay</span>
      </header>
      <main className="flex-1 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
