import React from 'react';
import { LiveBookingNotification } from '../../types/tour';
import { Sparkles, MapPin, CheckCircle2 } from 'lucide-react';

interface LiveBookingTickerProps {
  notification: LiveBookingNotification | null;
  onDismiss: () => void;
}

export const LiveBookingTicker: React.FC<LiveBookingTickerProps> = ({
  notification,
  onDismiss
}) => {
  if (!notification) return null;

  return (
    <div className="fixed bottom-5 left-5 z-40 max-w-sm bg-stone-900/95 border border-amber-500/40 rounded-xl p-3.5 shadow-2xl backdrop-blur-md animate-slide-up flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
        <Sparkles className="w-4 h-4" />
      </div>

      <div className="space-y-0.5 min-w-0 flex-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-stone-200">{notification.guestName}</span>
          <span className="text-stone-500 font-mono text-[10px]">Just now</span>
        </div>
        <p className="text-xs text-amber-200/90 font-medium truncate">
          Reserved {notification.seats} {notification.seats === 1 ? 'seat' : 'seats'} · {notification.tourTitle}
        </p>
        <div className="flex items-center gap-1 text-[10px] text-stone-400">
          <MapPin className="w-3 h-3 text-amber-400" />
          <span>{notification.prefecture} Prefecture · Real-time update</span>
        </div>
      </div>

      <button
        onClick={onDismiss}
        className="text-stone-500 hover:text-stone-300 text-xs px-1"
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
};
