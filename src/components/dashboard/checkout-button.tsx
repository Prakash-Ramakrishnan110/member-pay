'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createRazorpayOrder, verifyPaymentAndUpdatePlan } from '@/app/actions/checkout-actions';
import { CheckCircle2, Loader2, ArrowRight } from 'lucide-react';


interface CheckoutButtonProps {
  planName: string;
  planAmount: number;
  businessName: string;
  userPhone: string;
}

export function CheckoutButton({ planName, planAmount, businessName, userPhone }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-checkout-js')) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.id = 'razorpay-checkout-js';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);

      // 1. Load Script
      const res = await loadRazorpayScript();
      if (!res) {
        alert('Failed to load Razorpay SDK. Check your connection.');
        setLoading(false);
        return;
      }

      // 2. Create Order
      const orderData = await createRazorpayOrder(planAmount, planName);
      if (orderData.error) {
        alert(orderData.error);
        setLoading(false);
        return;
      }

      // 3. Open Checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'MemberPay',
        description: `${planName} Plan Subscription`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          const verification = await verifyPaymentAndUpdatePlan(
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature,
            planName
          );

          if (verification.error) {
            alert(verification.error);
          } else {
            alert(`Successfully upgraded to ${planName} Plan!`);
            // Refresh to see changes
            window.location.href = '/dashboard';
          }
        },
        prefill: {
          name: businessName,
          contact: userPhone,
        },
        theme: {
          color: '#4f46e5',
        },
      };

      const rzp1 = new (window as any).Razorpay(options);
      
      rzp1.on('payment.failed', function (response: any) {
        alert(response.error.description || 'Payment failed');
      });

      rzp1.open();

    } catch (error: any) {
      alert('An error occurred during checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleCheckout} 
      disabled={loading}
      className={planName === 'Pro' 
        ? "w-full bg-indigo-600 hover:bg-indigo-500 text-white h-14 text-lg font-bold rounded-xl shadow-lg" 
        : "w-full border border-slate-200 hover:bg-slate-50 text-slate-900 h-14 text-lg font-bold rounded-xl bg-white"}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...
        </>
      ) : (
        <>
          Upgrade to {planName} <ArrowRight className="w-5 h-5 ml-2" />
        </>
      )}
    </Button>
  );
}
