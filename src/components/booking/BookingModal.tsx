import React, { useState } from 'react';
import { TourActivity, TimeSlot, DaySchedule, Reservation, GuestDetails } from '../../types/tour';
import confetti from 'canvas-confetti';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  Check, 
  CreditCard,
  Eye
} from 'lucide-react';

interface BookingModalProps {
  tour: TourActivity | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmReservation: (reservation: Reservation) => void;
  defaultDate?: string;
  defaultGuests?: number;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  tour,
  isOpen,
  onClose,
  onConfirmReservation,
  defaultDate,
  defaultGuests = 2,
}) => {
  if (!isOpen || !tour) return null;

  // Determine available schedules or fallback
  const schedules: DaySchedule[] = tour.schedules;
  const initialDate = defaultDate && schedules.find(s => s.date === defaultDate)
    ? defaultDate
    : schedules[0]?.date || '';

  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const currentSchedule = schedules.find(s => s.date === selectedDate) || schedules[0];
  
  // Default to first slot with available seats
  const firstAvailableSlot = currentSchedule?.slots.find(s => s.capacity > s.bookedSeats) || currentSchedule?.slots[0];
  const [selectedSlotId, setSelectedSlotId] = useState<string>(firstAvailableSlot?.id || '');

  const activeSlot = currentSchedule?.slots.find(s => s.id === selectedSlotId) || firstAvailableSlot;

  // Guests count
  const [adults, setAdults] = useState<number>(Math.min(defaultGuests, 4));
  const [children, setChildren] = useState<number>(0);

  // Guest details form
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [country, setCountry] = useState<string>('Japan / International');
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [dietaryNotes, setDietaryNotes] = useState<string>('');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totalGuests = adults + children;
  const remainingSeats = activeSlot ? Math.max(0, activeSlot.capacity - activeSlot.bookedSeats) : 0;
  const isSlotFull = remainingSeats < totalGuests;

  // Pricing calculation
  const adultPrice = activeSlot?.priceJPY || tour.basePriceJPY;
  const childPrice = Math.round(adultPrice * 0.7);
  const totalPriceJPY = (adults * adultPrice) + (children * childPrice);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    const sched = schedules.find(s => s.date === date);
    if (sched && sched.slots.length > 0) {
      const avail = sched.slots.find(s => s.capacity > s.bookedSeats) || sched.slots[0];
      setSelectedSlotId(avail.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please enter the lead traveler full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address to receive your confirmation.');
      return;
    }
    if (totalGuests <= 0) {
      setErrorMessage('Please select at least 1 traveler.');
      return;
    }
    if (isSlotFull) {
      setErrorMessage(`Selected slot only has ${remainingSeats} seats available. Please adjust party size or select another departure.`);
      return;
    }
    if (!activeSlot) {
      setErrorMessage('Please select a valid time slot.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const reservationId = `THK-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
      
      const newReservation: Reservation = {
        id: reservationId,
        tourId: tour.id,
        tourTitle: tour.title,
        tourTitleJp: tour.titleJp,
        prefecture: tour.prefecture,
        date: selectedDate,
        timeSlotId: activeSlot.id,
        timeSlotLabel: activeSlot.label,
        slotTime: activeSlot.time,
        leadGuest: {
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim() || '',
          country: country.trim(),
          specialRequests: specialRequests.trim() || undefined,
          dietaryNotes: dietaryNotes.trim() || undefined
        },
        adultsCount: adults,
        childrenCount: children,
        totalSeats: totalGuests,
        unitPriceJPY: adultPrice,
        totalPriceJPY,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        confirmationEmailSent: true,
        emailSentAt: new Date().toISOString(),
        qrCodeToken: `${reservationId}-${tour.prefecture.toUpperCase()}-${activeSlot.id}`,
        meetingPoint: tour.meetingPoint
      };

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      setIsSubmitting(false);
      onConfirmReservation(newReservation);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Banner */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold font-mono">
                  Real-Time Booking Engine
                </span>
                <span className="text-stone-500 text-xs">·</span>
                <span className="text-stone-400 text-xs">{tour.prefecture} Prefecture</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-stone-100 line-clamp-1">
                {tour.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Viewing Urgency Bar */}
        <div className="px-6 py-2 bg-amber-950/30 border-b border-amber-900/30 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>
              <strong>{tour.activeViewersCount || 4} travelers</strong> are checking seats for this activity right now.
            </span>
          </div>
          <span className="hidden sm:inline text-amber-400/80 font-mono text-[11px]">
            Live Inventory Sync Active
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-red-950/50 border border-red-500/30 rounded-xl text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Date & Slot Selection (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Select Date */}
              <div>
                <label className="flex items-center justify-between text-xs font-semibold text-stone-200 uppercase tracking-wider mb-2">
                  <span>1. Select Departure Date</span>
                  <span className="text-stone-400 font-normal">Real-Time Available Dates</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {schedules.map((sched) => {
                    const isSelected = sched.date === selectedDate;
                    const dateObj = new Date(sched.date);
                    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                    const monthDay = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    
                    // Total remaining seats for this date
                    const totalRemaining = sched.slots.reduce(
                      (acc, s) => acc + Math.max(0, s.capacity - s.bookedSeats),
                      0
                    );

                    return (
                      <button
                        type="button"
                        key={sched.date}
                        onClick={() => handleDateChange(sched.date)}
                        className={`p-3 rounded-xl text-left border transition-all ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 text-stone-100 ring-1 ring-amber-500/40'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                        }`}
                      >
                        <div className="text-[11px] font-mono uppercase">{dayName}</div>
                        <div className="text-sm font-bold text-stone-100">{monthDay}</div>
                        <div className="mt-1 flex items-center gap-1.5 text-[10px]">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              totalRemaining > 4
                                ? 'bg-emerald-400'
                                : totalRemaining > 0
                                ? 'bg-amber-400'
                                : 'bg-red-400'
                            }`}
                          />
                          <span className={isSelected ? 'text-amber-300' : 'text-stone-400'}>
                            {totalRemaining > 0 ? `${totalRemaining} seats left` : 'Sold Out'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Time Slot Selection with Live Capacity Tracking */}
              <div>
                <label className="flex items-center justify-between text-xs font-semibold text-stone-200 uppercase tracking-wider mb-2">
                  <span>2. Select Time Slot</span>
                  <span className="text-stone-400 font-normal">Remaining Seats Tracked</span>
                </label>

                <div className="space-y-2">
                  {currentSchedule?.slots.map((slot) => {
                    const isSelected = slot.id === selectedSlotId;
                    const remaining = Math.max(0, slot.capacity - slot.bookedSeats);
                    const percentFilled = Math.min(100, Math.round((slot.bookedSeats / slot.capacity) * 100));
                    const isFull = remaining === 0;

                    return (
                      <button
                        type="button"
                        key={slot.id}
                        disabled={isFull}
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                          isFull
                            ? 'opacity-40 bg-stone-950/40 border-stone-800/60 cursor-not-allowed'
                            : isSelected
                            ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/40'
                            : 'bg-stone-950 border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <Clock className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-stone-400'}`} />
                            <div>
                              <div className="text-sm font-semibold text-stone-100">{slot.time}</div>
                              <div className="text-xs text-stone-400">{slot.label}</div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm font-bold text-amber-300">
                              ¥{slot.priceJPY.toLocaleString()} <span className="text-xs font-normal text-stone-400">/ adult</span>
                            </div>
                            <div className="text-[11px]">
                              {isFull ? (
                                <span className="text-red-400 font-medium">Sold Out</span>
                              ) : remaining <= 3 ? (
                                <span className="text-amber-400 font-medium animate-pulse">
                                  Only {remaining} {remaining === 1 ? 'seat' : 'seats'} left!
                                </span>
                              ) : (
                                <span className="text-emerald-400 font-medium">
                                  {remaining} of {slot.capacity} seats available
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Capacity meter */}
                        <div className="mt-2.5 w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              percentFilled > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${percentFilled}%` }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Guests Count */}
              <div>
                <label className="block text-xs font-semibold text-stone-200 uppercase tracking-wider mb-2">
                  3. Select Party Size
                </label>

                <div className="grid grid-cols-2 gap-3 bg-stone-950 border border-stone-800 rounded-xl p-3">
                  {/* Adults */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-stone-200">Adults (12+)</div>
                      <div className="text-[11px] text-stone-400">¥{adultPrice.toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="w-5 text-center text-sm font-bold text-stone-100">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults(Math.min(remainingSeats - children, adults + 1))}
                        disabled={adults + children >= remainingSeats}
                        className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center font-bold text-xs disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex items-center justify-between border-l border-stone-800 pl-3">
                    <div>
                      <div className="text-xs font-medium text-stone-200">Children (4-11)</div>
                      <div className="text-[11px] text-stone-400">¥{childPrice.toLocaleString()} (30% off)</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="w-5 text-center text-sm font-bold text-stone-100">{children}</span>
                      <button
                        type="button"
                        onClick={() => setChildren(Math.min(remainingSeats - adults, children + 1))}
                        disabled={adults + children >= remainingSeats}
                        className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center font-bold text-xs disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {isSlotFull && (
                  <p className="text-xs text-amber-400 mt-2 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Party size exceeds remaining seats ({remainingSeats} available).</span>
                  </p>
                )}
              </div>
            </div>

            {/* Right Column: Lead Traveler Details & Instant Confirmation (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <span className="text-xs font-semibold text-stone-200 uppercase tracking-wider">
                    4. Traveler Details
                  </span>
                  <span className="text-[11px] text-amber-400 font-mono">Email automated</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-stone-300 mb-1">
                      Full Name (Lead Traveler) <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kenji Tanaka or Sarah Jenkins"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 mb-1">
                      Email Address <span className="text-amber-400">* (Instant confirmation sent here)</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-stone-300 mb-1">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        placeholder="+81 90..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-300 mb-1">Country / Region</label>
                      <input
                        type="text"
                        placeholder="e.g. Japan, USA"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-300 mb-1">Dietary / Mobility Requirements (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Vegetarian, Gluten-free, slow walking pace"
                      value={dietaryNotes}
                      onChange={(e) => setDietaryNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Price Calculation & Checkout Box */}
              <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 space-y-3">
                <div className="text-xs font-semibold text-stone-200 uppercase tracking-wider border-b border-stone-800 pb-2 flex items-center justify-between">
                  <span>Reservation Summary</span>
                  <span className="text-emerald-400 font-normal">Real-Time Lock</span>
                </div>

                <div className="space-y-1.5 text-xs text-stone-300">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Total Travelers:</span>
                    <span className="font-medium text-stone-100">{totalGuests} Guests</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Date & Slot:</span>
                    <span className="font-mono text-stone-200">{selectedDate} ({activeSlot?.time})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Tohoku Tax & Insurance:</span>
                    <span className="text-emerald-400">Included</span>
                  </div>
                  <div className="border-t border-stone-800 pt-2 flex justify-between items-baseline font-bold">
                    <span className="text-stone-100">Total Price:</span>
                    <div className="text-right">
                      <div className="text-xl text-amber-400">¥{totalPriceJPY.toLocaleString()} JPY</div>
                      <div className="text-[10px] text-stone-400 font-normal">
                        ≈ ${(totalPriceJPY / 152).toFixed(1)} USD
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-2 text-[11px] text-stone-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded border-stone-700 text-amber-500 focus:ring-0"
                    />
                    <span>
                      I agree to the free 48h cancellation policy and acknowledge automated confirmation will be sent to my email.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isSlotFull || !agreeTerms}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm rounded-xl transition-all shadow-lg hover:shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                      <span>Locking Seats & Generating Email...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Confirm Reservation (Instant Voucher)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
