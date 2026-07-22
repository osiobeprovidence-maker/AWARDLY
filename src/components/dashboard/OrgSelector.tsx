import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, ChevronRight, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import type { Organization } from '../../types';

type OrgSelectorProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (org: Organization) => void;
};

export function OrgSelector({ open, onClose, onSelect }: OrgSelectorProps) {
  const { organizations } = useAuth();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-dark-950/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-dark-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <div>
                <h3 className="text-sm font-bold text-white">Choose Organization</h3>
                <p className="text-xs text-dark-400 mt-0.5">Select where to create your event</p>
              </div>
              <button onClick={onClose} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <X className="h-4 w-4 text-dark-400" />
              </button>
            </div>

            <div className="p-3 max-h-[400px] overflow-y-auto">
              {organizations.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <Building2 className="h-10 w-10 text-dark-500 mx-auto mb-3" />
                  <p className="text-dark-400 text-sm mb-4">You don't have any organizations yet</p>
                  <Button onClick={() => { onClose(); navigate('/onboarding'); }}>
                    <Plus className="h-4 w-4 mr-2" /> Create Organization
                  </Button>
                </div>
              ) : (
                <div className="space-y-1">
                  {organizations.map(org => (
                    <button
                      key={org.id}
                      onClick={() => { onSelect(org); onClose(); }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group text-left"
                    >
                      {org.logoUrl ? (
                        <img src={org.logoUrl} className="h-10 w-10 rounded-lg object-cover shrink-0" alt="" />
                      ) : (
                        <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: org.primaryColor + '20' }}>
                          <Building2 className="h-5 w-5" style={{ color: org.primaryColor }} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{org.name}</p>
                        <p className="text-xs text-dark-500">{org.memberCount} members · {org.eventCount} events</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-dark-500 group-hover:text-gold-500 transition-colors shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {organizations.length > 0 && (
              <div className="p-3 border-t border-white/5">
                <button
                  onClick={() => { onClose(); navigate('/onboarding'); }}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-white/10 text-dark-400 hover:text-gold-500 hover:border-gold-500/30 transition-all text-sm"
                >
                  <Plus className="h-4 w-4" /> Create New Organization
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
