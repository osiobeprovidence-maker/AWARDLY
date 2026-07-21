import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Building2, Globe, FileText, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CreateOrg() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-gold-900/10 to-transparent pointer-events-none" />
      
      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-gold-500/10 rounded-2xl border border-gold-500/20 flex items-center justify-center mx-auto mb-6"
          >
            <Building2 className="h-8 w-8 text-gold-500" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-serif text-white mb-3"
          >
            Create your Organization
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-dark-300"
          >
            Set up your public page and community hub.
          </motion.p>
        </div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit} 
          className="glass-panel p-8 rounded-2xl border border-white/10 space-y-8"
        >
          {/* Form Sections */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-dark-200">Organization Name *</label>
              <Input icon={Building2} placeholder="e.g. African Music Awards" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-dark-200">Username *</label>
              <div className="relative flex items-center">
                <span className="absolute text-dark-500 text-sm left-4">awards.com/</span>
                <Input className="pl-28" placeholder="africanmusic" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-dark-200">Category</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Music', 'Technology', 'Education', 'Corporate'].map((cat) => (
                  <label key={cat} className="flex items-center justify-center px-4 py-3 border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-colors has-[:checked]:border-gold-500 has-[:checked]:bg-gold-500/10 text-sm text-dark-200 has-[:checked]:text-gold-400">
                    <input type="radio" name="category" value={cat} className="sr-only" />
                    {cat}
                  </label>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-dark-200">Short Description</label>
              <textarea 
                className="w-full flex min-h-[100px] rounded-lg border border-white/10 bg-dark-900/50 px-4 py-3 text-sm text-white placeholder:text-dark-500 backdrop-blur-sm transition-colors focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/50 resize-none"
                placeholder="What is your organization about?"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex justify-between items-center">
            <span className="text-xs text-dark-400 flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-gold-500" />
              You can change settings later
            </span>
            <Button type="submit" size="lg">
              Launch Dashboard
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
