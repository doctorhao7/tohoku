import React, { useState } from 'react';
import { Reservation } from '../../types/tour';
import { 
  X, 
  Search, 
  Calendar, 
  Clock, 
  MapPin, 
  Mail, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { downloadCalendarEvent } from '../../utils/calendarExport';

interface MyBookingsModalProps {
  reservations: Reservation[];
  isOpen: boolean;
  onClose: () => void;
  onOpenEmailModal: (reservation: Reservation) => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  reservations,
  isOpen,
  onClose,
  onOpenEmailModal
}) => {
  const [searchRef, setSearchRef] = useState('');

  if (!isOpen) return null;

  const filtered = reservations.filter(r => 
    !searchRef.trim() ||
    r.id.toLowerCase().includes(searchRef.toLowerCase()) ||
    r.leadGuest.email.toLowerCase().includes(searchRef.toLowerCase()) ||
    r.leadGuest.fullName.toLowerCase().includes(searchRef.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950">
          <div>
            <div className="text-xs uppercase font-mono tracking-widest text-amber-400">
              Customer Portal
            </div>
            <h2 className="text-base sm:text-lg font-bold text-stone-100">
              My Tohoku Tour Reservations
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 bg-stone-950/60 border-b border-stone-800">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Reference ID (e.g. THK-8921-X) or Email..."
              value={searchRef}
              onChange={(e) => setSearchRef(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
        </div>

        {/* Reservations List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {filtered.length > 0 ? (
            filtered.map((res) => (
              <div 
                key={res.id}
                className="bg-stone-950 border border-stone-800 rounded-xl p-4 sm:p-5 space-y-4 hover:border-stone-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800/80 pb-3">
                  <div>
                    <span className="text-[11px] font-mono uppercase text-amber-400 font-semibold">
                      Ref: {res.id}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-stone-100">
                      {res.tourTitle}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
                      Confirmed
                    </span>
                    <span className="text-xs font-mono font-bold text-stone-200">
                      ¥{res.totalPriceJPY.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-stone-300">
                  <div className="space-y-0.5">
                    <div className="text-[10px] text-stone-400 uppercase">Departure Date</div>
                    <div className="font-medium text-stone-200">{res.date}</div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-[10px] text-stone-400 uppercase">Time Slot</div>
                    <div className="font-mono text-stone-200">{res.slotTime}</div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-[10px] text-stone-400 uppercase">Travelers</div>
                    <div className="font-medium text-stone-200">{res.totalSeats} Guests</div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-[10px] text-stone-400 uppercase">Lead Traveler</div>
                    <div className="font-medium text-stone-200 truncate">{res.leadGuest.fullName}</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-800/60 text-xs">
                  <div className="flex items-center gap-1.5 text-stone-400 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span className="truncate max-w-[280px]">{res.meetingPoint}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadCalendarEvent(res)}
                      className="px-2.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-lg border border-stone-700/80 flex items-center gap-1.5 text-[11px]"
                    >
                      <Download className="w-3 h-3 text-amber-400" />
                      <span>Calendar</span>
                    </button>
                    <button
                      onClick={() => onOpenEmailModal(res)}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-lg flex items-center gap-1.5 text-[11px] transition-colors"
                    >
                      <Mail className="w-3 h-3" />
                      <span>View Confirmation Email</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-stone-400">
              No reservations found. If you just made a booking, it will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
