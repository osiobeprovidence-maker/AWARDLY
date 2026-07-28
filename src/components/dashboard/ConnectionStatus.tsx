import React, { useState, useEffect, useRef } from 'react';
import { useConvexConnectionState } from 'convex/react';
import { Wifi, WifiOff, RefreshCw, ChevronUp, ChevronDown, Clock, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';

export function ConnectionStatus() {
  const state = useConvexConnectionState();
  const [expanded, setExpanded] = useState(false);
  const [lastDisconnect, setLastDisconnect] = useState<Date | null>(null);
  const [downtime, setDowntime] = useState<number | null>(null);
  const wasConnected = useRef(state.isWebSocketConnected);
  const reconnectTime = useRef<Date | null>(null);

  useEffect(() => {
    if (wasConnected.current && !state.isWebSocketConnected) {
      setLastDisconnect(new Date());
      reconnectTime.current = null;
    }
    if (!wasConnected.current && state.isWebSocketConnected) {
      if (lastDisconnect) {
        setDowntime(Date.now() - lastDisconnect.getTime());
      }
      reconnectTime.current = new Date();
    }
    wasConnected.current = state.isWebSocketConnected;
  }, [state.isWebSocketConnected, lastDisconnect]);

  const isHealthy = state.isWebSocketConnected && state.connectionRetries === 0;
  const isReconnecting = !state.isWebSocketConnected && state.hasEverConnected;
  const isOffline = !state.isWebSocketConnected && !state.hasEverConnected;

  if (isHealthy && !expanded) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium backdrop-blur-xl border transition-all shadow-lg',
          isHealthy && 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
          isReconnecting && 'bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse',
          isOffline && 'bg-rose-500/10 border-rose-500/20 text-rose-400',
        )}
      >
        {isHealthy && <Wifi className="h-3.5 w-3.5" />}
        {isReconnecting && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
        {isOffline && <WifiOff className="h-3.5 w-3.5" />}

        <span className="hidden sm:inline">
          {isHealthy && 'Connected'}
          {isReconnecting && 'Reconnecting…'}
          {isOffline && 'Offline'}
        </span>

        {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
      </button>

      {expanded && (
        <div className="mt-2 p-4 rounded-xl bg-dark-900/95 backdrop-blur-xl border border-white/10 text-xs space-y-3 w-64 shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="text-dark-400">Status</span>
            <span className={cn(
              'font-medium',
              isHealthy && 'text-emerald-400',
              isReconnecting && 'text-amber-400',
              isOffline && 'text-rose-400',
            )}>
              {isHealthy ? 'Connected' : isReconnecting ? 'Reconnecting' : 'Offline'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-dark-400">WebSocket</span>
            <span className={cn(
              'flex items-center gap-1.5',
              state.isWebSocketConnected ? 'text-emerald-400' : 'text-rose-400',
            )}>
              <span className={cn(
                'h-1.5 w-1.5 rounded-full',
                state.isWebSocketConnected ? 'bg-emerald-400' : 'bg-rose-400',
              )} />
              {state.isWebSocketConnected ? 'Open' : 'Closed'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-dark-400">Retries</span>
            <span className="text-white font-medium">{state.connectionRetries}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-dark-400">Reconnects</span>
            <span className="text-white font-medium">{state.connectionCount}</span>
          </div>

          {state.hasInflightRequests && (
            <div className="flex items-center justify-between">
              <span className="text-dark-400">Inflight</span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <Activity className="h-3 w-3 animate-pulse" /> Pending
              </span>
            </div>
          )}

          {downtime !== null && (
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-dark-400">Last Downtime</span>
              <span className="text-white font-medium flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                {downtime < 1000 ? '<1s' : `${(downtime / 1000).toFixed(1)}s`}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
