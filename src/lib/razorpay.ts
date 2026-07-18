/**
 * Mock Razorpay API Wrapper for MVP
 * In a production environment, this would use the 'razorpay' npm package.
 */

export interface PaymentLinkRequest {
  amount: number; // in paise
  currency: string;
  accept_partial: boolean;
  reference_id: string;
  description: string;
  customer: {
    name: string;
    contact: string;
  };
  notify: {
    sms: boolean;
    email: boolean;
  };
  reminder_enable: boolean;
}

export const createPaymentLink = async (request: PaymentLinkRequest, keys: { keyId: string; keySecret: string }) => {
  console.log('[Razorpay Mock] Creating payment link with keys:', keys.keyId);
  console.log('[Razorpay Mock] Request payload:', request);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Return a mock response matching Razorpay's format
  return {
    id: `plink_${Math.random().toString(36).substring(7)}`,
    reference_id: request.reference_id,
    amount: request.amount,
    currency: request.currency,
    status: 'created',
    short_url: `https://rzp.io/i/${Math.random().toString(36).substring(5)}`,
    created_at: Math.floor(Date.now() / 1000),
  };
};

export const fetchPaymentStatus = async (paymentLinkId: string, keys: { keyId: string; keySecret: string }) => {
  console.log(`[Razorpay Mock] Fetching status for link: ${paymentLinkId}`);
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Randomly simulate Paid or Pending for mock purposes
  const statuses = ['paid', 'pending'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

  return {
    id: paymentLinkId,
    status: randomStatus,
    amount_paid: randomStatus === 'paid' ? 120000 : 0,
  };
};
