import { useState, useCallback } from 'react';
import { initializePayment, verifyPayment, generateReference, PaystackInitializeResponse } from '../lib/paystack';

interface UsePaystackPaymentOptions {
  email: string;
  amount: number;
  currency?: string;
  reference?: string;
  onSuccess?: (response: PaystackInitializeResponse['data'] & { verified: boolean }) => void;
  onError?: (error: Error) => void;
}

export function usePaystackPayment(options: UsePaystackPaymentOptions) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pay = useCallback(async (metadata?: Record<string, any>) => {
    setIsProcessing(true);
    setError(null);

    try {
      const reference = options.reference || generateReference();
      const callbackUrl = `${window.location.origin}/payment/callback?ref=${reference}`;

      const initResult = await initializePayment({
        email: options.email,
        amount: options.amount,
        currency: options.currency || 'NGN',
        reference,
        callback_url: callbackUrl,
        metadata: {
          ...metadata,
          reference,
          custom_fields: [
            {
              display_name: 'Organization',
              variable_name: 'organization',
              value: metadata?.orgId || '',
            },
          ],
        },
      });

      if (!initResult.status) {
        throw new Error(initResult.message || 'Failed to initialize payment');
      }

      const { authorization_url } = initResult.data;

      // Store pending payment state for callback page to pick up
      sessionStorage.setItem('paystack_pending', JSON.stringify({
        reference,
        email: options.email,
        amount: options.amount,
        onSuccess: true,
      }));

      // Redirect to Paystack checkout (avoids COOP popup issues)
      window.location.href = authorization_url;
    } catch (err: any) {
      const message = err.message || 'Payment failed';
      setError(message);
      options.onError?.(err);
      setIsProcessing(false);
    }
  }, [options]);

  return { pay, isProcessing, error };
}
