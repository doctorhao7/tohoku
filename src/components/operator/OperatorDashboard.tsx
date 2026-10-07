import React, { useState } from 'react';
import { TourActivity, Reservation, AutomatedEmailLog, TohokuPrefecture } from '../../types/tour';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search, 
  Sliders, 
  Play, 
  Pause, 
  Plus, 
  Minus, 
  Send, 
  Eye, 
  FileText,
  Clock,
  MapPin,
  RefreshCw,
  QrCode
} from 'lucide-react';

interface OperatorDashboardProps {
  tours: TourActivity[];
  reservations: Reservation[];
  emailLogs: AutomatedEmailLog[];
  onUpdateSlotCapacity: (tourId: string, date: string, slotId: string, delta: number) => void;
  onToggleSlotStatus: (tourId: string, date: string, slotId: string) => void;
  onCheckInReservation: (reservationId: string) => void;
  onCancelReservation: (reservationId: string) => void;
  onViewConfirmationEmail: (reservation: Reservation) => void;
  onResendConfirmationEmail: (reservationId: string) => void;
  isSimulatingLive: boolean;
  onToggleSimulation: () => void;
}

export const OperatorDashboard: React.FC<OperatorDashboardProps> = ({
  tours,
  reservations,
  emailLogs,
  onUpdateSlotCapacity,
  onToggleSlotStatus,
  onCheckInReservation,
  onCancelReservation,
  onViewConfirmationEmail,
  onResendConfirmationEmail,
  isSimulatingLive,
  onToggleSimulation
}) => {
  const [activeTab, setActiveTab] = useState<'reservations' | 'availability' | 'emails'>('reservations');
  const [reservationSearch, setReservationSearch] = useState('');
  const [selectedTourFilter, setSelectedTourFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');

  // Stats calculation
  const totalRevenue = reservations
    .filter(r => r.status !== 'cancelled')
    .reduce((sum, r) => sum + r.totalPriceJPY, 0);

  const activeReservationsCount = reservations.filter(r => r.status !== 'cancelled').length;
  
  // Total capacity and booked seats across all tours
  let totalCapacity = 0;
  let totalBooked = 0;
  tours.forEach(t => {
    t.schedules.forEach(s => {
      s.slots.forEach(slot => {
        totalCapacity += slot.capacity;
        totalBooked += slot.bookedSeats;
      });
    });
  });

  const occupancyRate = totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;

  // Filtered reservations
  const filteredReservations = reservations.filter(r => {
    const matchesSearch = 
      !reservationSearch.trim() ||
      r.id.toLowerCase().includes(reservationSearch.toLowerCase()) ||
      r.leadGuest.fullName.toLowerCase().includes(reservationSearch.toLowerCase()) ||
      r.leadGuest.email.toLowerCase().includes(reservationSearch.toLowerCase()) ||
      r.tourTitle.toLowerCase().includes(reservationSearch.toLowerCase());

    const matchesTour = selectedTourFilter === 'All' || r.tourId === selectedTourFilter;
    const matchesStatus = selectedStatusFilter === 'All' || r.status === selectedStatusFilter;

    return matchesSearch && matchesTour && matchesStatus;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">
      {/* Top Header & Simulation Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-wider text-amber-400 font-semibold">
              Operator Operations & Reservation Desk
            </span>
            <span className="text-stone-500">·</span>
            <span className="text-xs text-stone-400">Live Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-100 mt-1">
            Tohoku Tour Activity Operations
          </h1>
          <p className="text-xs text-stone-400 font-light mt-0.5">
            Real-time capacity tracking, booking adjustments, and automated customer confirmation email dispatch center.
          </p>
        </div>

        {/* Live Simulation Banner */}
        <div className="flex items-center gap-3 bg-stone-900 border border-stone-800 rounded-xl p-3 shrink-0">
          <div className="text-xs">
            <div className="font-semibold text-stone-200 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isSimulatingLive ? 'bg-emerald-400 animate-ping' : 'bg-stone-500'}`} />
              <span>Real-Time Traffic Simulator</span>
            </div>
            <div className="text-[11px] text-stone-400">
              {isSimulatingLive ? 'Simulating incoming bookings & seat holds' : 'Simulation paused'}
            </div>
          </div>
          <button
            onClick={onToggleSimulation}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isSimulatingLive
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            {isSimulatingLive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isSimulatingLive ? 'Stop Sim' : 'Start Sim'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Bookings */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Confirmed Bookings</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-stone-100 font-mono">
            {activeReservationsCount}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Guaranteed departures</span>
          </div>
        </div>

        {/* KPI 2: Total Revenue */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Total Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-stone-100 font-mono">
            ¥{totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-400">
            ≈ ${(totalRevenue / 152).toFixed(0)} USD
          </div>
        </div>

        {/* KPI 3: Occupancy Rate */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Tohoku Fleet Occupancy</span>
            <Sliders className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-stone-100 font-mono">
            {occupancyRate}%
          </div>
          <div className="text-[11px] text-stone-400">
            {totalBooked} of {totalCapacity} seats filled
          </div>
        </div>

        {/* KPI 4: Automated Emails */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Automated Emails Sent</span>
            <Mail className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-stone-100 font-mono">
            {emailLogs.length}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>100% instant delivery</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
        <button
          onClick={() => setActiveTab('reservations')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'reservations'
              ? 'bg-amber-500 text-stone-950 shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
          }`}
        >
          Customer Reservations ({reservations.length})
        </button>
        <button
          onClick={() => setActiveTab('availability')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'availability'
              ? 'bg-amber-500 text-stone-950 shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
          }`}
        >
          Real-Time Capacity Controller
        </button>
        <button
          onClick={() => setActiveTab('emails')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'emails'
              ? 'bg-amber-500 text-stone-950 shadow-md'
              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
          }`}
        >
          Automated Email Logs ({emailLogs.length})
        </button>
      </div>

      {/* Tab 1: Reservations Table */}
      {activeTab === 'reservations' && (
        <div className="space-y-4">
          {/* Table Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search reference ID, guest name, email..."
                value={reservationSearch}
                onChange={(e) => setReservationSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-stone-300 focus:outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked_in">Checked In</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={selectedTourFilter}
                onChange={(e) => setSelectedTourFilter(e.target.value)}
                className="px-3 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-stone-300 focus:outline-none cursor-pointer max-w-[200px] truncate"
              >
                <option value="All">All Tours</option>
                {tours.map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table View */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950/80 text-[11px] uppercase tracking-wider text-stone-400 border-b border-stone-800 font-mono">
                  <tr>
                    <th className="py-3.5 px-4">Ref ID</th>
                    <th className="py-3.5 px-4">Lead Guest</th>
                    <th className="py-3.5 px-4">Tour & Prefecture</th>
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4">Guests</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/80">
                  {filteredReservations.map((res) => {
                    return (
                      <tr key={res.id} className="hover:bg-stone-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-medium text-amber-300">
                          {res.id}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-stone-100">{res.leadGuest.fullName}</div>
                          <div className="text-[11px] text-stone-400 font-mono">{res.leadGuest.email}</div>
                        </td>
                        <td className="py-3.5 px-4 max-w-[240px]">
                          <div className="font-medium text-stone-200 truncate">{res.tourTitle}</div>
                          <div className="text-[11px] text-stone-400">{res.prefecture} Prefecture</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-stone-200">{res.date}</div>
                          <div className="text-[11px] text-stone-400 font-mono">{res.slotTime}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          {res.totalSeats} ({res.adultsCount}A / {res.childrenCount}C)
                        </td>
                        <td className="py-3.5 px-4 font-mono font-medium text-stone-200">
                          ¥{res.totalPriceJPY.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          {res.status === 'confirmed' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950/70 border border-emerald-500/30 text-emerald-400">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Confirmed</span>
                            </span>
                          )}
                          {res.status === 'checked_in' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-sky-950/70 border border-sky-500/30 text-sky-400">
                              <QrCode className="w-3 h-3" />
                              <span>Checked In</span>
                            </span>
                          )}
                          {res.status === 'cancelled' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-stone-800 text-stone-400">
                              <XCircle className="w-3 h-3" />
                              <span>Cancelled</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                          {/* View Email Button */}
                          <button
                            onClick={() => onViewConfirmationEmail(res)}
                            className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg transition-colors inline-flex items-center gap-1"
                            title="View / Resend Confirmation Email"
                          >
                            <Mail className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-[11px]">Email</span>
                          </button>

                          {/* Check-In Button */}
                          {res.status === 'confirmed' && (
                            <button
                              onClick={() => onCheckInReservation(res.id)}
                              className="p-1.5 bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800 rounded-lg transition-colors inline-flex items-center gap-1 text-[11px]"
                              title="Mark guest as checked-in"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              <span>Check-In</span>
                            </button>
                          )}

                          {/* Cancel Button */}
                          {res.status !== 'cancelled' && (
                            <button
                              onClick={() => onCancelReservation(res.id)}
                              className="p-1.5 bg-stone-800 hover:bg-red-950 hover:text-red-300 text-stone-400 rounded-lg transition-colors text-[11px]"
                              title="Cancel reservation & release seats"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredReservations.length === 0 && (
              <div className="p-8 text-center text-xs text-stone-400">
                No reservations match the filter criteria.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Real-Time Availability Controller */}
      {activeTab === 'availability' && (
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-2">
            <h3 className="text-sm font-semibold text-stone-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Real-Time Seat & Capacity Controller</span>
            </h3>
            <p className="text-xs text-stone-400">
              Directly increment or decrement available seats in real-time. Changes immediately update customer-facing inventory without reloading.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tours.map((tour) => (
              <div key={tour.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-amber-400 uppercase">{tour.prefecture} Prefecture</span>
                    <h4 className="text-sm font-bold text-stone-100">{tour.title}</h4>
                  </div>
                  <span className="text-xs font-mono text-stone-400">¥{tour.basePriceJPY.toLocaleString()}</span>
                </div>

                <div className="space-y-3 pt-2 border-t border-stone-800">
                  {tour.schedules.slice(0, 2).map((sched) => (
                    <div key={sched.date} className="bg-stone-950 p-3 rounded-xl border border-stone-800/80 space-y-2">
                      <div className="text-[11px] font-semibold text-stone-300 uppercase tracking-wide flex items-center justify-between">
                        <span>Date: {sched.date}</span>
                        <span className="text-stone-500">Live Departure Slots</span>
                      </div>

                      <div className="space-y-2">
                        {sched.slots.map((slot) => {
                          const remaining = Math.max(0, slot.capacity - slot.bookedSeats);
                          return (
                            <div key={slot.id} className="flex items-center justify-between p-2 bg-stone-900/80 rounded-lg text-xs">
                              <div>
                                <div className="font-semibold text-stone-200">{slot.time}</div>
                                <div className="text-[11px] text-stone-400">{slot.label}</div>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <div className="font-mono font-bold text-amber-300">
                                    {remaining} / {slot.capacity}
                                  </div>
                                  <div className="text-[10px] text-stone-400">
                                    {slot.bookedSeats} booked
                                  </div>
                                </div>

                                {/* +/- Seats adjuster */}
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => onUpdateSlotCapacity(tour.id, sched.date, slot.id, -1)}
                                    disabled={slot.bookedSeats >= slot.capacity}
                                    className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 disabled:opacity-30"
                                    title="Book a seat (Decrease remaining)"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => onUpdateSlotCapacity(tour.id, sched.date, slot.id, 1)}
                                    disabled={slot.bookedSeats <= 0}
                                    className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 disabled:opacity-30"
                                    title="Release a seat (Increase remaining)"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Automated Email Logs */}
      {activeTab === 'emails' && (
        <div className="space-y-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-stone-100 flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>Automated Email Dispatch Queue</span>
              </h3>
              <p className="text-xs text-stone-400">
                All confirmation emails, pre-trip reminders, and itinerary updates sent to travelers.
              </p>
            </div>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-950/80 text-[11px] uppercase tracking-wider text-stone-400 border-b border-stone-800 font-mono">
                <tr>
                  <th className="py-3 px-4">Sent At</th>
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {emailLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-800/40">
                    <td className="py-3 px-4 font-mono text-stone-400 text-[11px]">
                      {new Date(log.sentAt).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-stone-200">{log.recipientName}</div>
                      <div className="text-[11px] text-stone-400 font-mono">{log.recipientEmail}</div>
                    </td>
                    <td className="py-3 px-4 text-stone-300 font-medium max-w-md truncate">
                      {log.subject}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        <span className="capitalize">{log.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          const target = reservations.find(r => r.id === log.reservationId);
                          if (target) onViewConfirmationEmail(target);
                        }}
                        className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded text-[11px] font-medium transition-colors"
                      >
                        View Email
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
