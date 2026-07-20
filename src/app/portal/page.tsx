import { PortalLoginClient } from '@/components/portal/portal-login-client';
import { Logo } from '@/components/ui/logo';

export default function PortalLoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-900">
          Member Portal Login
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Sign in with your registered phone number.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm ring-1 ring-slate-200 sm:rounded-xl sm:px-10">
          <PortalLoginClient />
        </div>
      </div>
    </div>
  );
}
