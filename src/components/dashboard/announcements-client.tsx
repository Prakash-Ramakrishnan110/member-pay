'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Megaphone, Loader2 } from 'lucide-react';
import { sendBulkAnnouncement } from '@/app/actions/announcement-actions';

interface AnnouncementsClientProps {
  businessId: string;
  stats: {
    activeCount: number;
    inactiveCount: number;
    expiringSoonCount: number;
  };
}

export function AnnouncementsClient({ stats }: AnnouncementsClientProps) {
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<{ successCount: number; failCount: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [audience, setAudience] = useState<'All Active' | 'Inactive' | 'Expiring Soon'>('All Active');
  
  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);
    setResult(null);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const message = formData.get('message') as string;
    
    if (!message.trim()) {
      setError('Message cannot be empty');
      setIsSending(false);
      return;
    }

    const res = await sendBulkAnnouncement(audience, message);
    if (res.error) {
      setError(res.error);
    } else {
      setResult({ successCount: res.successCount || 0, failCount: res.failCount || 0 });
    }
    
    setIsSending(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-blue-600" />
          Bulk Announcements
        </h1>
        <p className="text-slate-500 font-medium text-sm mt-1">
          Send mass WhatsApp messages to your members for holidays, offers, or gym closures.
        </p>
      </div>

      <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-4">
          <h3 className="font-bold text-slate-900">Compose Message</h3>
        </div>
        <CardContent className="p-6">
          <form onSubmit={handleSend} className="space-y-6">
            
            <div className="space-y-2">
              <Label>Select Audience</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div 
                  className={`border rounded-xl p-4 cursor-pointer transition-all ${audience === 'All Active' ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50/50' : 'border-slate-200 hover:border-blue-300'}`}
                  onClick={() => setAudience('All Active')}
                >
                  <div className="font-semibold text-slate-900">All Active</div>
                  <div className="text-xs text-slate-500 mt-1">{stats.activeCount} members</div>
                </div>

                <div 
                  className={`border rounded-xl p-4 cursor-pointer transition-all ${audience === 'Expiring Soon' ? 'border-orange-500 ring-1 ring-orange-500 bg-orange-50/50' : 'border-slate-200 hover:border-orange-300'}`}
                  onClick={() => setAudience('Expiring Soon')}
                >
                  <div className="font-semibold text-slate-900">Expiring in 7 Days</div>
                  <div className="text-xs text-slate-500 mt-1">{stats.expiringSoonCount} members</div>
                </div>

                <div 
                  className={`border rounded-xl p-4 cursor-pointer transition-all ${audience === 'Inactive' ? 'border-slate-800 ring-1 ring-slate-800 bg-slate-100' : 'border-slate-200 hover:border-slate-400'}`}
                  onClick={() => setAudience('Inactive')}
                >
                  <div className="font-semibold text-slate-900">Inactive/Churned</div>
                  <div className="text-xs text-slate-500 mt-1">{stats.inactiveCount} members</div>
                </div>

              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <p className="text-xs text-slate-500">Available variables: {`{{name}}`}</p>
              <Textarea 
                id="message" 
                name="message" 
                rows={6}
                placeholder="Hi {{name}}, we are closed tomorrow for Diwali! Happy Holidays! 🎆" 
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            {result && (
              <div className="p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-medium">
                Announcement finished!
                <ul className="mt-2 list-disc list-inside">
                  <li>Messages sent successfully: {result.successCount}</li>
                  {result.failCount > 0 && <li>Messages failed: {result.failCount} (Check if WhatsApp device is connected)</li>}
                </ul>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end">
              <Button type="submit" disabled={isSending} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                {isSending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                ) : 'Send Announcement'}
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
