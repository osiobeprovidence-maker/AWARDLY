import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Globe, Edit3, ShieldCheck, Info, Save, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { VotingRules } from '../../types';

interface RulesManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (source: 'global' | 'custom', rules?: VotingRules) => void;
  categoryName: string;
  globalRules: VotingRules;
  initialSource: 'global' | 'custom';
  initialCustomRules?: VotingRules;
}

export function RulesManagerModal({
  isOpen,
  onClose,
  onSave,
  categoryName,
  globalRules,
  initialSource,
  initialCustomRules
}: RulesManagerModalProps) {
  const [source, setSource] = React.useState<'global' | 'custom'>(initialSource);
  const [rules, setRules] = React.useState<VotingRules>(initialCustomRules || { ...globalRules });

  const handleSave = () => {
    onSave(source, source === 'custom' ? rules : undefined);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl max-h-[90vh] bg-dark-900 border border-white/10 rounded-3xl shadow-2xl z-[70] flex flex-col overflow-hidden"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-dark-900/50 backdrop-blur-md sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-serif text-white italic">Manage Voting Rules</h2>
                <p className="text-xs text-dark-400 mt-1">Configure how fans participate in <span className="text-gold-500 font-bold">{categoryName}</span></p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              {/* Rules Source Selector */}
              {!categoryName.includes('Organization Defaults') && (
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Rules Source</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setSource('global')}
                      className={`flex flex-col items-start p-4 rounded-2xl border transition-all text-left ${
                        source === 'global' 
                          ? 'bg-gold-500/10 border-gold-500 shadow-lg shadow-gold-500/5' 
                          : 'bg-white/5 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className={`h-4 w-4 ${source === 'global' ? 'text-gold-500' : 'text-dark-400'}`} />
                        <span className={`text-xs font-bold uppercase tracking-widest ${source === 'global' ? 'text-gold-500' : 'text-dark-400'}`}>Use Global</span>
                      </div>
                      <p className="text-[10px] text-dark-500 leading-relaxed">Inherit the organization's default voting policies and requirements.</p>
                    </button>

                    <button
                      onClick={() => setSource('custom')}
                      className={`flex flex-col items-start p-4 rounded-2xl border transition-all text-left ${
                        source === 'custom' 
                          ? 'bg-gold-500/10 border-gold-500 shadow-lg shadow-gold-500/5' 
                          : 'bg-white/5 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Edit3 className={`h-4 w-4 ${source === 'custom' ? 'text-gold-500' : 'text-dark-400'}`} />
                        <span className={`text-xs font-bold uppercase tracking-widest ${source === 'custom' ? 'text-gold-500' : 'text-dark-400'}`}>Custom Rules</span>
                      </div>
                      <p className="text-[10px] text-dark-500 leading-relaxed">Create specific rules and restrictions for this unique category.</p>
                    </button>
                  </div>
                </div>
              )}

              {source === 'global' && !categoryName.includes('Organization Defaults') ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 opacity-60 pointer-events-none"
                >
                  <div className="p-4 rounded-2xl bg-white/5 border border-dashed border-white/10">
                     <div className="flex items-center gap-2 mb-4">
                        <Info className="h-4 w-4 text-gold-500" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Global Rules Preview</span>
                     </div>
                     <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                           <p className="text-[8px] font-bold text-dark-500 uppercase tracking-widest mb-1">Eligibility</p>
                           <p className="text-[10px] text-white">{globalRules.eligibility}</p>
                        </div>
                        <div>
                           <p className="text-[8px] font-bold text-dark-500 uppercase tracking-widest mb-1">Daily Limit</p>
                           <p className="text-[10px] text-white">{globalRules.dailyLimit} Votes</p>
                        </div>
                        <div>
                           <p className="text-[8px] font-bold text-dark-500 uppercase tracking-widest mb-1">Paid Voting</p>
                           <p className="text-[10px] text-white">{globalRules.isPaid ? 'Enabled' : 'Disabled'}</p>
                        </div>
                        <div>
                           <p className="text-[8px] font-bold text-dark-500 uppercase tracking-widest mb-1">Verification</p>
                           <p className="text-[10px] text-white">{globalRules.verificationRequired ? 'Required' : 'Optional'}</p>
                        </div>
                     </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Rule Title</label>
                      <Input 
                        value={rules.title} 
                        onChange={(e) => setRules({ ...rules, title: e.target.value })}
                        placeholder="e.g. Standard Fan Voting" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Daily Vote Limit</label>
                      <Input 
                        type="number"
                        value={rules.dailyLimit} 
                        onChange={(e) => setRules({ ...rules, dailyLimit: parseInt(e.target.value) })}
                        placeholder="10" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Rich Description</label>
                    <textarea 
                      value={rules.description}
                      onChange={(e) => setRules({ ...rules, description: e.target.value })}
                      className="w-full min-h-[100px] bg-dark-950 border border-white/5 rounded-xl p-4 text-white text-xs outline-none focus:ring-1 focus:ring-gold-500/50"
                      placeholder="Explain how users should vote in this category..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Eligibility</label>
                       <Input 
                         value={rules.eligibility}
                         onChange={(e) => setRules({ ...rules, eligibility: e.target.value })}
                         placeholder="e.g. Verified Users Only" 
                       />
                    </div>
                    <div className="space-y-4 pt-6">
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-dark-300 uppercase tracking-widest">Paid Voting</span>
                          <button 
                            onClick={() => setRules({ ...rules, isPaid: !rules.isPaid })}
                            className={`w-10 h-5 rounded-full transition-colors relative ${rules.isPaid ? 'bg-gold-500' : 'bg-dark-800'}`}
                          >
                            <div className={`absolute top-1 h-3 w-3 rounded-full bg-dark-950 transition-all ${rules.isPaid ? 'right-1' : 'left-1'}`} />
                          </button>
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-dark-300 uppercase tracking-widest">Verification Required</span>
                          <button 
                            onClick={() => setRules({ ...rules, verificationRequired: !rules.verificationRequired })}
                            className={`w-10 h-5 rounded-full transition-colors relative ${rules.verificationRequired ? 'bg-gold-500' : 'bg-dark-800'}`}
                          >
                            <div className={`absolute top-1 h-3 w-3 rounded-full bg-dark-950 transition-all ${rules.verificationRequired ? 'right-1' : 'left-1'}`} />
                          </button>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Voting Starts</label>
                       <Input 
                         type="datetime-local"
                         value={rules.startDate}
                         onChange={(e) => setRules({ ...rules, startDate: e.target.value })}
                         icon={Clock} 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Voting Ends</label>
                       <Input 
                         type="datetime-local"
                         value={rules.endDate}
                         onChange={(e) => setRules({ ...rules, endDate: e.target.value })}
                         icon={Clock} 
                       />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Duplicate Policy</label>
                    <Input 
                      value={rules.duplicatePolicy}
                      onChange={(e) => setRules({ ...rules, duplicatePolicy: e.target.value })}
                      placeholder="e.g. One vote per device/account" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Fraud Prevention Notes</label>
                    <textarea 
                      value={rules.fraudPrevention}
                      onChange={(e) => setRules({ ...rules, fraudPrevention: e.target.value })}
                      className="w-full min-h-[80px] bg-dark-950 border border-white/5 rounded-xl p-4 text-white text-xs outline-none focus:ring-1 focus:ring-gold-500/50"
                      placeholder="Explain measures taken to prevent fraudulent voting..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Terms & Conditions</label>
                    <textarea 
                      value={rules.terms}
                      onChange={(e) => setRules({ ...rules, terms: e.target.value })}
                      className="w-full min-h-[80px] bg-dark-950 border border-white/5 rounded-xl p-4 text-white text-[10px] outline-none focus:ring-1 focus:ring-gold-500/50"
                      placeholder="Legal terms for participating in this specific category..."
                    />
                  </div>
                </motion.div>
              )}
            </div>

            <div className="p-6 border-t border-white/5 bg-dark-950/50 backdrop-blur-md flex items-center justify-end gap-4">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSave} className="px-8 h-12 shadow-xl shadow-gold-500/10">
                <Save className="h-4 w-4 mr-2" /> Save Rules
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
