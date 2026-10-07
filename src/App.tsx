/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  TourActivity, 
  Reservation, 
  AutomatedEmailLog, 
  TohokuPrefecture, 
  LiveBookingNotification 
} from './types/tour';
import { 
  INITIAL_TOURS, 
  INITIAL_RESERVATIONS, 
  INITIAL_EMAIL_LOGS 
} from './data/mockTours';
import { Navbar } from './components/layout/Navbar';
import { VideoHero } from './components/video/VideoHero';
import { TourCatalog } from './components/tours/TourCatalog';
import { TohokuRegionalGuide } from './components/content/TohokuRegionalGuide';
import { BookingModal } from './components/booking/BookingModal';
import { ConfirmationEmailModal } from './components/email/ConfirmationEmailModal';
import { VideoPreviewModal } from './components/video/VideoPreviewModal';
import { MyBookingsModal } from './components/modals/MyBookingsModal';
import { OperatorDashboard } from './components/operator/OperatorDashboard';
import { LiveBookingTicker } from './components/common/LiveBookingTicker';
import { Footer } from './components/layout/Footer';
import { ambientSound } from './utils/audioEngine';

export default function App() {
  // Core application state
  const [tours, setTours] = useState<TourActivity[]>(() => {
    const saved = localStorage.getItem('thk_tours');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_TOURS;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('thk_reservations');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_RESERVATIONS;
  });

  const [emailLogs, setEmailLogs] = useState<AutomatedEmailLog[]>(() => {
    const saved = localStorage.getItem('thk_email_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_EMAIL_LOGS;
  });

  // Views & Modals
  const [currentView, setCurrentView] = useState<'guest' | 'operator'>('guest');
  const [filterPrefecture, setFilterPrefecture] = useState<TohokuPrefecture | 'All'>('All');
  
  const [selectedTourForBooking, setSelectedTourForBooking] = useState<TourActivity | null>(null);
  const [bookingDefaultDate, setBookingDefaultDate] = useState<string>('');
  const [bookingDefaultGuests, setBookingDefaultGuests] = useState<number>(2);

  const [selectedTourForVideo, setSelectedTourForVideo] = useState<TourActivity | null>(null);
  
  const [activeEmailReservation, setActiveEmailReservation] = useState<Reservation | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);

  // Audio state
  const [isSoundActive, setIsSoundActive] = useState(false);

  // Live simulation & Ticker
  const [isSimulatingLive, setIsSimulatingLive] = useState(true);
  const [currentNotification, setCurrentNotification] = useState<LiveBookingNotification | null>(null);
  const simulationTimerRef = useRef<number | null>(null);

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('thk_tours', JSON.stringify(tours));
  }, [tours]);

  useEffect(() => {
    localStorage.setItem('thk_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('thk_email_logs', JSON.stringify(emailLogs));
  }, [emailLogs]);

  // Real-time Booking Simulation Effect
  useEffect(() => {
    if (!isSimulatingLive) {
      if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
      return;
    }

    const mockGuestNames = [
      'David Miller', 'Yuki Takahashi', 'Sophie Laurent', 'Chen Wei', 
      'Liam O’Connor', 'Hannah Schmidt', 'Kenji Sato', 'Mia Rossi'
    ];

    simulationTimerRef.current = window.setInterval(() => {
      // Pick random tour with availability
      const tourIndex = Math.floor(Math.random() * tours.length);
      const targetTour = tours[tourIndex];
      if (!targetTour || targetTour.schedules.length === 0) return;

      const scheduleIndex = Math.floor(Math.random() * targetTour.schedules.length);
      const targetSchedule = targetTour.schedules[scheduleIndex];
      if (!targetSchedule || targetSchedule.slots.length === 0) return;

      const availableSlots = targetSchedule.slots.filter(s => s.capacity > s.bookedSeats);
      if (availableSlots.length === 0) return;

      const targetSlot = availableSlots[Math.floor(Math.random() * availableSlots.length)];
      const seatsToBook = Math.min(2, targetSlot.capacity - targetSlot.bookedSeats);

      if (seatsToBook > 0) {
        // Decrement slot capacity in real-time
        setTours(prev => prev.map(t => {
          if (t.id !== targetTour.id) return t;
          return {
            ...t,
            schedules: t.schedules.map(s => {
              if (s.date !== targetSchedule.date) return s;
              return {
                ...s,
                slots: s.slots.map(slot => {
                  if (slot.id !== targetSlot.id) return slot;
                  return { ...slot, bookedSeats: slot.bookedSeats + seatsToBook };
                })
              };
            })
          };
        }));

        const randomGuest = mockGuestNames[Math.floor(Math.random() * mockGuestNames.length)];
        const notif: LiveBookingNotification = {
          id: `sim-${Date.now()}`,
          guestName: randomGuest,
          tourTitle: targetTour.title,
          seats: seatsToBook,
          prefecture: targetTour.prefecture,
          timestamp: new Date().toLocaleTimeString()
        };

        setCurrentNotification(notif);
        // Clear after 6 seconds
        setTimeout(() => {
          setCurrentNotification(prev => (prev?.id === notif.id ? null : prev));
        }, 6000);
      }
    }, 18000); // Trigger every 18 seconds for subtle realism

    return () => {
      if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
    };
  }, [isSimulatingLive, tours]);

  // Audio Toggle
  const handleToggleSound = () => {
    const next = ambientSound.toggle();
    setIsSoundActive(next);
  };

  // Search from Hero
  const handleSearchTours = (pref: TohokuPrefecture | 'All', date: string, guests: number) => {
    setFilterPrefecture(pref);
    setBookingDefaultDate(date);
    setBookingDefaultGuests(guests);
    const catalogEl = document.getElementById('tours-catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Open booking modal
  const handleBookNow = (tour: TourActivity) => {
    setSelectedTourForBooking(tour);
  };

  // Confirm reservation handler (Real-Time Availability Decrement + Automated Confirmation Email)
  const handleConfirmReservation = (newReservation: Reservation) => {
    // 1. Decrement available seats in real-time
    setTours(prev => prev.map(tour => {
      if (tour.id !== newReservation.tourId) return tour;
      return {
        ...tour,
        schedules: tour.schedules.map(sched => {
          if (sched.date !== newReservation.date) return sched;
          return {
            ...sched,
            slots: sched.slots.map(slot => {
              if (slot.id !== newReservation.timeSlotId) return slot;
              return {
                ...slot,
                bookedSeats: slot.bookedSeats + newReservation.totalSeats
              };
            })
          };
        })
      };
    }));

    // 2. Add to reservations list
    setReservations(prev => [newReservation, ...prev]);

    // 3. Generate automated confirmation email log
    const newEmailLog: AutomatedEmailLog = {
      id: `EML-${Date.now().toString().slice(-4)}`,
      reservationId: newReservation.id,
      recipientEmail: newReservation.leadGuest.email,
      recipientName: newReservation.leadGuest.fullName,
      subject: `Booking Confirmed: ${newReservation.tourTitle} [Ref: ${newReservation.id}]`,
      type: 'booking_confirmation',
      sentAt: new Date().toISOString(),
      status: 'delivered',
      tourTitle: newReservation.tourTitle,
      date: newReservation.date,
      time: newReservation.slotTime
    };

    setEmailLogs(prev => [newEmailLog, ...prev]);

    // 4. Close booking modal and immediately open the Automated Confirmation Email viewer
    setSelectedTourForBooking(null);
    setActiveEmailReservation(newReservation);
    setIsEmailModalOpen(true);
  };

  // Resend confirmation email
  const handleResendEmail = (reservationId: string, customEmail?: string) => {
    const res = reservations.find(r => r.id === reservationId);
    if (!res) return;

    const recipient = customEmail || res.leadGuest.email;
    const newLog: AutomatedEmailLog = {
      id: `EML-${Date.now().toString().slice(-4)}`,
      reservationId: res.id,
      recipientEmail: recipient,
      recipientName: res.leadGuest.fullName,
      subject: `Booking Confirmed: ${res.tourTitle} [Ref: ${res.id}]`,
      type: 'booking_confirmation',
      sentAt: new Date().toISOString(),
      status: 'delivered',
      tourTitle: res.tourTitle,
      date: res.date,
      time: res.slotTime
    };

    setEmailLogs(prev => [newLog, ...prev]);
  };

  // Operator Actions: Slot seat adjustment
  const handleUpdateSlotCapacity = (tourId: string, date: string, slotId: string, delta: number) => {
    setTours(prev => prev.map(t => {
      if (t.id !== tourId) return t;
      return {
        ...t,
        schedules: t.schedules.map(s => {
          if (s.date !== date) return s;
          return {
            ...s,
            slots: s.slots.map(slot => {
              if (slot.id !== slotId) return slot;
              // delta: -1 means 1 seat booked, +1 means 1 seat released
              const newBooked = Math.max(0, Math.min(slot.capacity, slot.bookedSeats - delta));
              return { ...slot, bookedSeats: newBooked };
            })
          };
        })
      };
    }));
  };

  // Operator Actions: Toggle slot active status
  const handleToggleSlotStatus = (tourId: string, date: string, slotId: string) => {
    setTours(prev => prev.map(t => {
      if (t.id !== tourId) return t;
      return {
        ...t,
        schedules: t.schedules.map(s => {
          if (s.date !== date) return s;
          return {
            ...s,
            slots: s.slots.map(slot => {
              if (slot.id !== slotId) return slot;
              return { ...slot, isActive: !slot.isActive };
            })
          };
        })
      };
    }));
  };

  // Operator Actions: Check-in
  const handleCheckInReservation = (reservationId: string) => {
    setReservations(prev => prev.map(r => {
      if (r.id !== reservationId) return r;
      return { ...r, status: 'checked_in' };
    }));
  };

  // Operator Actions: Cancel
  const handleCancelReservation = (reservationId: string) => {
    const res = reservations.find(r => r.id === reservationId);
    if (!res) return;

    // Release seats
    setTours(prev => prev.map(t => {
      if (t.id !== res.tourId) return t;
      return {
        ...t,
        schedules: t.schedules.map(s => {
          if (s.date !== res.date) return s;
          return {
            ...s,
            slots: s.slots.map(slot => {
              if (slot.id !== res.timeSlotId) return slot;
              return {
                ...slot,
                bookedSeats: Math.max(0, slot.bookedSeats - res.totalSeats)
              };
            })
          };
        })
      };
    }));

    setReservations(prev => prev.map(r => {
      if (r.id !== reservationId) return r;
      return { ...r, status: 'cancelled' };
    }));
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        reservationsCount={reservations.length}
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
        isSoundActive={isSoundActive}
        onToggleSound={handleToggleSound}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'guest' ? (
          <>
            {/* Landing Page Video Showcase of Tohoku Tourist Sites */}
            <VideoHero
              onSearchTours={handleSearchTours}
              onExploreAll={() => {
                const catalogEl = document.getElementById('tours-catalog');
                if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Tour Activities Catalog with Real-Time Availability Tracking */}
            <TourCatalog
              tours={tours}
              onBookNow={handleBookNow}
              onPreviewVideo={(tour) => setSelectedTourForVideo(tour)}
              filterPrefecture={filterPrefecture}
              onFilterPrefectureChange={setFilterPrefecture}
            />

            {/* Tohoku 6-Prefecture Cultural & Regional Guide */}
            <TohokuRegionalGuide
              onSelectPrefecture={(pref) => {
                setFilterPrefecture(pref);
                const catalogEl = document.getElementById('tours-catalog');
                if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </>
        ) : (
          /* Operator / Reservation Desk */
          <div className="pt-20">
            <OperatorDashboard
              tours={tours}
              reservations={reservations}
              emailLogs={emailLogs}
              onUpdateSlotCapacity={handleUpdateSlotCapacity}
              onToggleSlotStatus={handleToggleSlotStatus}
              onCheckInReservation={handleCheckInReservation}
              onCancelReservation={handleCancelReservation}
              onViewConfirmationEmail={(res) => {
                setActiveEmailReservation(res);
                setIsEmailModalOpen(true);
              }}
              onResendConfirmationEmail={handleResendEmail}
              isSimulatingLive={isSimulatingLive}
              onToggleSimulation={() => setIsSimulatingLive(!isSimulatingLive)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onOpenManager={() => setCurrentView('operator')} />

      {/* Real-time Booking Modal */}
      {selectedTourForBooking && (
        <BookingModal
          tour={selectedTourForBooking}
          isOpen={!!selectedTourForBooking}
          onClose={() => setSelectedTourForBooking(null)}
          onConfirmReservation={handleConfirmReservation}
          defaultDate={bookingDefaultDate}
          defaultGuests={bookingDefaultGuests}
        />
      )}

      {/* Automated Confirmation Email Viewer Modal */}
      <ConfirmationEmailModal
        reservation={activeEmailReservation}
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onResendEmail={handleResendEmail}
      />

      {/* Video Clip Preview Modal */}
      {selectedTourForVideo && (
        <VideoPreviewModal
          tour={selectedTourForVideo}
          isOpen={!!selectedTourForVideo}
          onClose={() => setSelectedTourForVideo(null)}
          onBookNow={handleBookNow}
        />
      )}

      {/* Customer Portal: My Bookings Modal */}
      <MyBookingsModal
        reservations={reservations}
        isOpen={isMyBookingsOpen}
        onClose={() => setIsMyBookingsOpen(false)}
        onOpenEmailModal={(res) => {
          setActiveEmailReservation(res);
          setIsEmailModalOpen(true);
        }}
      />

      {/* Live Booking Ticker */}
      <LiveBookingTicker
        notification={currentNotification}
        onDismiss={() => setCurrentNotification(null)}
      />
    </div>
  );
}
