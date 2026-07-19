import { Loader2 } from 'lucide-react';

export default function DashboardLoading() {
  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center space-y-4 text-slate-500">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <p className="text-sm font-medium animate-pulse">Loading...</p>
    </div>
  );
}
