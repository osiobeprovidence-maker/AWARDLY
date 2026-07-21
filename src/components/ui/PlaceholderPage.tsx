import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Construction, Sparkles, Calendar, Settings, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: React.ElementType;
  features?: string[];
}

export function PlaceholderPage({ title, description, icon: Icon, features = [] }: PlaceholderPageProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="text-dark-400 hover:text-white">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center text-center py-16"
      >
        <div className="relative mb-8">
          <div className="h-24 w-24 rounded-3xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
            <Icon className="h-12 w-12 text-gold-500" />
          </div>
          <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-dark-800 border border-white/10 flex items-center justify-center">
            <Construction className="h-4 w-4 text-gold-500" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 mb-6">
          <Sparkles className="h-3 w-3 text-gold-500" />
          <span className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">Coming Soon</span>
        </div>

        <h1 className="text-3xl font-serif text-white mb-3">{title}</h1>
        <p className="text-dark-400 max-w-md mb-8 leading-relaxed">{description}</p>

        {features.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg w-full mb-10">
            {features.map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-left"
              >
                <div className="h-2 w-2 rounded-full bg-gold-500 shrink-0" />
                <span className="text-sm text-dark-300">{feature}</span>
              </motion.div>
            ))}
          </div>
        )}

        <p className="text-xs text-dark-500 mb-8">This module is currently under development.</p>

        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          Return to Dashboard
        </Button>
      </motion.div>
    </div>
  );
}
