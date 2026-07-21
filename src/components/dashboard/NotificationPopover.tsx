import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, CheckCircle2, MessageSquare, Zap, Clock, Info, Trophy, Radio } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../../lib/toast';

interface Notification {
  id: string;
  type: 'vote' | 'comment' | 'event' | 'system';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  { id: '1', type: 'vote', title: 'Viral Threshold Reached', message: 'The Headies 2026 just reached 1M global votes! Trending status activated.', time: '2m ago', isRead: false },
  { id: '2', type: 'comment', title: 'New Community Discussion', message: '14 users commented on your recent Hub Feed update about Rookie of the Year.', time: '14m ago', isRead: false },
  { id: '3', type: 'event', title: 'Broadcast Success', message: 'Your Live Broadcast "Pre-Award Dinner" peaked at 124k concurrent viewers.', time: '2h ago', isRead: true },
  { id: '4', type: 'system', title: 'Payout Processed', message: 'Monetization payout for May 2026 has been successfully settled to your account.', time: '1d ago', isRead: true },
];

export function NotificationPopover({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { toast } = useToast();
  const [notifications, setNotifications] = React.useState(mockNotifications);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast('All notifications marked as read', 'success');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-16 right-0 w-96 bg-dark-900 border border-white/10 rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-dark-950/40">
               <div>
                  <h3 className="text-white font-serif text-lg leading-none mb-1">Notifications</h3>
                  <p className="text-[10px] font-bold text-dark-500 uppercase tracking-widest">Global Hub Activity</p>
               </div>
               <button className="text-[10px] font-bold text-gold-500 uppercase tracking-widest hover:text-white transition-colors" onClick={markAllRead}>Mark all read</button>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
               {notifications.map((notif) => (
                 <div 
                   key={notif.id} 
                   className={`p-5 flex items-start gap-4 hover:bg-white/5 transition-all cursor-pointer border-b border-white/5 last:border-0 ${!notif.isRead ? 'bg-gold-500/[0.02]' : ''}`}
                 >
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                      notif.type === 'vote' ? 'bg-gold-500/10 text-gold-500' :
                      notif.type === 'comment' ? 'bg-sky-500/10 text-sky-500' :
                      notif.type === 'event' ? 'bg-emerald-500/10 text-emerald-500' :
                      'bg-white/5 text-dark-400'
                    }`}>
                       {notif.type === 'vote' && <Trophy className="h-5 w-5" />}
                       {notif.type === 'comment' && <MessageSquare className="h-5 w-5" />}
                       {notif.type === 'event' && <Radio className="h-5 w-5" />}
                       {notif.type === 'system' && <Zap className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 space-y-1">
                       <div className="flex items-center justify-between">
                          <h4 className="text-white text-sm font-medium">{notif.title}</h4>
                          <span className="text-[10px] text-dark-500 font-medium">{notif.time}</span>
                       </div>
                       <p className="text-xs text-dark-400 leading-relaxed">{notif.message}</p>
                    </div>
                    {!notif.isRead && (
                      <div className="h-2 w-2 rounded-full bg-gold-500 mt-2" />
                    )}
                 </div>
               ))}
            </div>

            <div className="p-4 bg-dark-950/40 text-center">
               <Button variant="ghost" className="w-full text-[10px] font-bold uppercase tracking-widest text-dark-400" onClick={() => { toast('Full notification archive coming soon', 'info'); onClose(); }}>View All Archive</Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


