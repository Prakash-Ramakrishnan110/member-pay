'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, QrCode, Phone, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { updateSettings } from '@/app/actions/settings-actions';

export function WhatsAppClient({ businessId, initialStatus }: { businessId: string, initialStatus: string }) {
  const [status, setStatus] = useState<'disconnected' | 'loading' | 'qr_ready' | 'connected'>(
    initialStatus === 'connected' ? 'connected' : 'disconnected'
  );
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connectDevice = async () => {
    setStatus('loading');
    setError(null);
    try {
      const response = await fetch(`/api/whatsapp/session`, {
        method: 'POST',
      });
      const data = await response.json();

      if (data.success) {
        if (data.qr) {
          setQrCode(data.qr);
          setStatus('qr_ready');
          
          // Poll for connection success
          const interval = setInterval(async () => {
             // We can poll our microservice or just assume they will scan it,
             // ideally the microservice has a status endpoint, but for now we'll simulate a check
             // Let's call a status endpoint if we had one. 
             // We can just ask them to click "I scanned it"
          }, 3000);
        } else if (data.message === 'Already connected') {
          setStatus('connected');
          await updateSettings({ whatsapp_session_status: 'connected' });
        }
      } else {
        setError(data.error || 'Failed to connect');
        setStatus('disconnected');
      }
    } catch (err) {
      setError('Cannot reach WhatsApp service. Make sure the Node server is running on port 3001.');
      setStatus('disconnected');
    }
  };

  const handleManualConfirm = async () => {
    setStatus('connected');
    await updateSettings({ whatsapp_session_status: 'connected' });
  };

  const handleDisconnect = async () => {
    setStatus('disconnected');
    setQrCode(null);
    await updateSettings({ whatsapp_session_status: 'disconnected' });
  };

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Phone className="w-6 h-6 text-emerald-600" />
          WhatsApp Automated Bot
        </h1>
        <p className="text-slate-500 font-medium text-sm mt-1">
          Connect your device to send automated payment reminders directly from your own phone number.
        </p>
      </div>

      <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-4">
          <h3 className="font-bold text-slate-900">Device Status</h3>
        </div>
        <CardContent className="p-8 flex flex-col items-center justify-center min-h-[300px] text-center space-y-6">
          
          {status === 'disconnected' && (
            <>
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                <QrCode className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-800">No Device Connected</h4>
                <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                  Scan the QR code to link your phone. Your phone must stay connected to the internet.
                </p>
              </div>
              <Button onClick={connectDevice} className="bg-emerald-600 hover:bg-emerald-700">
                Generate QR Code
              </Button>
              {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
            </>
          )}

          {status === 'loading' && (
            <>
              <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
              <p className="text-sm text-slate-500 font-medium animate-pulse">Starting WhatsApp Engine...</p>
            </>
          )}

          {status === 'qr_ready' && qrCode && (
            <div className="space-y-6 flex flex-col items-center animate-in zoom-in-95">
              <div>
                <h4 className="text-lg font-bold text-slate-800">Scan QR Code</h4>
                <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                  Open WhatsApp on your phone, tap Menu or Settings and select Linked Devices. Tap on Link a Device.
                </p>
              </div>
              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm inline-block">
                <Image src={qrCode} alt="WhatsApp QR Code" width={256} height={256} className="rounded-lg" />
              </div>
              <Button onClick={handleManualConfirm} className="bg-emerald-600 hover:bg-emerald-700">
                I have scanned it
              </Button>
            </div>
          )}

          {status === 'connected' && (
            <>
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-800">Device Connected</h4>
                <p className="text-sm text-emerald-600 font-medium mt-1">
                  Your WhatsApp bot is active and ready to send messages.
                </p>
              </div>
              <Button variant="outline" onClick={handleDisconnect} className="text-red-600 border-red-200 hover:bg-red-50">
                Disconnect Device
              </Button>
            </>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
