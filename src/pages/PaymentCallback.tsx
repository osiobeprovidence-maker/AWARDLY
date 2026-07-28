import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { verifyPayment } from '../lib/paystack';

export function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [message, setMessage] = useState('');

  const reference = searchParams.get('ref') || searchParams.get('trxref');

  useEffect(() => {
    if (!reference) {
      setStatus('failed');
      setMessage('No payment reference found.');
      return;
    }

    let mounted = true;
    const verify = async () => {
      try {
        const result = await verifyPayment(reference);
        if (!mounted) return;

        if (result.status && result.data.status === 'success') {
          setStatus('success');
          setMessage(`Payment of ₦${(result.data.amount / 100).toLocaleString()} confirmed.`);
          sessionStorage.removeItem('paystack_pending');
        } else {
          setStatus('failed');
          setMessage(result.data.gateway_response || 'Payment was not completed.');
        }
      } catch {
        if (!mounted) return;
        setStatus('failed');
        setMessage('Could not verify payment status. Please check your email.');
      }
    };

    verify();
    return () => { mounted = false; };
  }, [reference]);

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Card className="text-center">
          <div className="space-y-6 py-4">
            {status === 'verifying' && (
              <>
                <div className="mx-auto h-16 w-16 rounded-2xl bg-gold-500/10 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-gold-500 animate-spin" />
                </div>
                <div>
                  <h2 className="text-xl font-serif text-white">Verifying Payment</h2>
                  <p className="text-sm text-dark-400 mt-2">Please wait while we confirm your payment…</p>
                </div>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="mx-auto h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-xl font-serif text-white">Payment Confirmed</h2>
                  <p className="text-sm text-dark-400 mt-2">{message}</p>
                </div>
                <Button onClick={() => navigate('/dashboard')} className="w-full">
                  Return to Dashboard
                </Button>
              </>
            )}

            {status === 'failed' && (
              <>
                <div className="mx-auto h-16 w-16 rounded-2xl bg-rose-500/10 flex items-center justify-center">
                  <XCircle className="h-8 w-8 text-rose-500" />
                </div>
                <div>
                  <h2 className="text-xl font-serif text-white">Payment Not Completed</h2>
                  <p className="text-sm text-dark-400 mt-2">{message}</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => navigate(-1)} className="flex-1">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
                  </Button>
                  <Button onClick={() => navigate('/dashboard')} className="flex-1">
                    Dashboard
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
