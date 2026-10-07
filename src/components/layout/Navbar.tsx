import React from 'react';
import { 
  Compass, 
  Volume2, 
  VolumeX, 
  Ticket, 
  Sliders, 
  Sparkles,
  Shield,
  Layers
} from 'lucide-react';
import { ambientSound } from '../../utils/audioEngine';

interface NavbarProps {
  currentView: 'guest' | 'operator';
  onViewChange: (view: 'guest' | 'operator') => void;
  reservationsCount: number;
  onOpenMyBookings: () => void;
  isSoundActive: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  reservationsCount,
  onOpenMyBookings,
  isSoundActive,
  onToggleSound
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-stone-950/85 backdrop-blur-xl border-b border-stone-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => onViewChange('guest')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:border-amber-400/60 transition-colors shadow-sm">
            <Compass className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-45 transition-transform duration-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-jp text-base sm:text-lg font-bold tracking-wider text-stone-100 group-hover:text-amber-300 transition-colors">
                東北 HORIZONS
              </span>
              <span className="hidden md:inline text-[10px] font-mono tracking-widest text-amber-400 uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Live Inventory
              </span>
            </div>
            <p className="text-[10px] text-stone-400 font-mono tracking-wide hidden sm:block">
              Tohoku Tour Reservations & Automated Confirmation
            </p>
          </div>
        </div>

        {/* View Switcher & Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Soundscape Quick Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-xl border text-xs transition-all flex items-center gap-1.5 ${
              isSoundActive
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
            title={isSoundActive ? "Mute Nature Audio" : "Play Tohoku Nature Audio"}
            aria-label="Toggle ambient sound"
          >
            {isSoundActive ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="text-[11px] hidden lg:inline">
              {isSoundActive ? 'Audio Stream' : 'Muted'}
            </span>
          </button>

          {/* My Bookings Button */}
          <button
            onClick={onOpenMyBookings}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 rounded-xl text-xs transition-colors relative"
          >
            <Ticket className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">My Bookings</span>
            {reservationsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px] flex items-center justify-center">
                {reservationsCount}
              </span>
            )}
          </button>

          {/* View Mode Toggle: Guest vs Operator Desk */}
          <div className="bg-stone-900 p-1 rounded-xl border border-stone-800 flex items-center text-xs">
            <button
              onClick={() => onViewChange('guest')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                currentView === 'guest'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Traveler View
            </button>
            <button
              onClick={() => onViewChange('operator')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                currentView === 'operator'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Operator Desk</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
