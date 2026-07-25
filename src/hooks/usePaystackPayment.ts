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
      const callbackUrl = `${window.location.origin}/payment/callback`;

      const initResult = await initializePayment({
        email: options.email,
        amount: options.amount,
        currency: options.currency || 'NGN',
        reference,
        callback_url: callbackUrl,
        metadata: {
          ...metadata,
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

      const { authorization_url, access_code, reference: ref } = initResult.data;

      const popup = window.open(
        authorization_url,
        'paystack_checkout',
        'width=500,height=700,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      return new Promise<void>((resolve, reject) => {
        const pollTimer = setInterval(async () => {
          try {
            if (!popup || popup.closed) {
              clearInterval(pollTimer);
              try {
                const verifyResult = await verifyPayment(ref);
                if (verifyResult.status && verifyResult.data.status === 'success') {
                  options.onSuccess?.({
                    ...initResult.data,
                    verified: true,
                  });
                  resolve();
                } else {
                  const err = new Error('Payment was not completed');
                  setError(err.message);
                  options.onError?.(err);
                  reject(err);
                }
              } catch {
                const err = new Error('Could not verify payment status');
                setError(err.message);
                options.onError?.(err);
                reject(err);
              }
              setIsProcessing(false);
            }
          } catch {
            // keep polling
          }
        }, 2000);

        setTimeout(() => {
          clearInterval(pollTimer);
          if (popup && !popup.closed) {
            popup.close();
          }
          setIsProcessing(false);
        }, 300000);
      });
    } catch (err: any) {
      const message = err.message || 'Payment failed';
      setError(message);
      options.onError?.(err);
      setIsProcessing(false);
    }
  }, [options]);

  return { pay, isProcessing, error };
}
