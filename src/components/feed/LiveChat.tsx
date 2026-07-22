import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { useChatMessages, timeAgo, showToast } from '../../lib/feedData';

export function LiveChat() {
  const { messages, send } = useChatMessages();
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (autoScroll) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, autoScroll]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    setAutoScroll(scrollHeight - scrollTop - clientHeight < 50);
  };

  const handleSend = () => {
    if (input.trim()) {
      send(input.trim());
      setInput('');
      setAutoScroll(true);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
        <MessageSquare className="h-4 w-4 text-gold-500" />
        <h3 className="text-[11px] font-bold text-white uppercase tracking-widest">Live Chat</h3>
        <span className="ml-auto text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">{messages.length}</span>
      </div>
      <div ref={containerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-4 py-2 space-y-3 min-h-0 max-h-96 lg:max-h-[500px]">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2.5 ${msg.user.id === 'me' ? 'flex-row-reverse' : ''}`}>
            <img src={msg.user.avatar} alt={msg.user.name} className="h-6 w-6 rounded-full object-cover shrink-0 border border-white/10" referrerPolicy="no-referrer" />
            <div className={`max-w-[80%] ${msg.user.id === 'me' ? 'text-right' : ''}`}>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[9px] font-bold text-dark-400">{msg.user.name}</span>
                <span className="text-[8px] text-dark-600">{timeAgo(msg.timestamp)}</span>
              </div>
              <div className={`inline-block px-3 py-1.5 rounded-xl text-[11px] leading-relaxed ${
                msg.user.id === 'me' ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20' : 'bg-white/5 text-dark-200 border border-white/5'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="p-3 border-t border-white/5">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-[11px] text-white placeholder:text-dark-600 outline-none focus:border-gold-500/30 transition-colors"
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} disabled={!input.trim()} className="h-9 w-9 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 hover:bg-gold-500/20 disabled:opacity-30 transition-colors shrink-0">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
