import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';

export function Signup() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signUp(name, email);
    navigate('/onboarding');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel p-8 sm:p-10 rounded-2xl w-full"
    >
      <div className="mb-8 text-center sm:text-left">
        <h2 className="text-2xl font-serif text-white mb-2">Create an account</h2>
        <p className="text-dark-400 text-sm">Join the platform to launch your community.</p>
      </div>

      <AnimatePresence mode="wait">
        {!showEmailForm ? (
          <motion.div
            key="options"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <Button 
              variant="outline" 
              className="w-full h-14 border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-3"
              onClick={() => {
                signUp('New User', 'user@example.com');
                navigate('/onboarding');
              }}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign up with Google
            </Button>

            <Button 
              variant="outline" 
              className="w-full h-14 border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-3"
              onClick={() => setShowEmailForm(true)}
            >
              <Mail className="h-5 w-5 text-gold-500" />
              Sign up with Email
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <button 
              onClick={() => setShowEmailForm(false)}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-dark-500 hover:text-gold-500 transition-colors mb-6 group"
            >
              <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
              Back to options
            </button>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-dark-300 ml-1">Full Name</label>
                <Input icon={User} placeholder="Jane Doe" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-medium text-dark-300 ml-1">Email Address</label>
                <Input type="email" icon={Mail} placeholder="jane@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-medium text-dark-300 ml-1">Password</label>
                <Input type="password" icon={Lock} placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              <Button type="submit" className="w-full mt-4">
                Continue
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 text-center text-sm text-dark-400">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-gold-500 hover:text-gold-400 font-medium transition-colors">
          Sign in
        </Link>
      </div>
    </motion.div>
  );
}
