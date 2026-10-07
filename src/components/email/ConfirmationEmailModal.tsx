import React, { useState } from 'react';
import { Reservation } from '../../types/tour';
import { QrCodeSvg } from '../common/QrCodeSvg';
import { downloadCalendarEvent } from '../../utils/calendarExport';
import { 
  CheckCircle2, 
  Mail, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Send, 
  X, 
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface ConfirmationEmailModalProps {
  reservation: Reservation | null;
  isOpen: boolean;
  onClose: () => void;
  onResendEmail?: (reservationId: string, customEmail?: string) => void;
}

export const ConfirmationEmailModal: React.FC<ConfirmationEmailModalProps> = ({
  reservation,
  isOpen,
  onClose,
  onResendEmail
}) => {
  const [copied, setCopied] = useState(false);
  const [resendEmailInput, setResendEmailInput] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'inbox' | 'html'>('preview');

  if (!isOpen || !reservation) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(reservation.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCalendar = () => {
    downloadCalendarEvent(reservation);
  };

  const handleResend = (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = resendEmailInput.trim() || reservation.leadGuest.email;
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setResendSuccess(true);
      if (onResendEmail) {
        onResendEmail(reservation.id, targetEmail);
      }
      setTimeout(() => setResendSuccess(false), 4000);
    }, 800);
  };

  const formattedDate = new Date(reservation.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const emailRawHtml = `<!DOCTYPE html>
<html>
<head><title>Reservation Confirmed - Tohoku Horizons</title></head>
<body style="font-family: sans-serif; background: #0c0a09; color: #f5f5f4; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background: #1c1917; border-radius: 12px; padding: 32px; border: 1px solid #292524;">
    <h1 style="color: #f59e0b; margin: 0 0 8px 0;">TOHOKU HORIZONS</h1>
    <h2 style="margin: 0 0 16px 0;">Booking Confirmed: ${reservation.tourTitle}</h2>
    <p>Reference: <strong>${reservation.id}</strong></p>
    <p>Date: ${formattedDate} (${reservation.slotTime})</p>
    <p>Guests: ${reservation.totalSeats} (${reservation.adultsCount} Adults, ${reservation.childrenCount} Children)</p>
    <p>Meeting Point: ${reservation.meetingPoint}</p>
    <p>Total Paid: ¥${reservation.totalPriceJPY.toLocaleString()}</p>
  </div>
</body>
</html>`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">Automated Email System</span>
                <span className="text-stone-500 text-xs">·</span>
                <span className="text-stone-400 text-xs">Delivered instantly</span>
              </div>
              <h2 className="text-base font-semibold text-stone-100 flex items-center gap-2">
                Customer Confirmation Email
              </h2>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center bg-stone-800/80 p-0.5 rounded-lg border border-stone-700/60 text-xs">
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1 rounded-md transition-all ${
                  viewMode === 'preview'
                    ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                Voucher View
              </button>
              <button
                onClick={() => setViewMode('inbox')}
                className={`px-3 py-1 rounded-md transition-all ${
                  viewMode === 'inbox'
                    ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                Client Inbox
              </button>
              <button
                onClick={() => setViewMode('html')}
                className={`px-3 py-1 rounded-md transition-all ${
                  viewMode === 'html'
                    ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                Raw HTML
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="px-6 py-2.5 bg-stone-950/40 border-b border-stone-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-300">
            <span>Booking Ref:</span>
            <code className="px-2 py-0.5 bg-stone-800 text-amber-300 rounded font-mono font-medium text-xs">
              {reservation.id}
            </code>
            <button
              onClick={handleCopyId}
              className="p-1 hover:text-white text-stone-400 transition-colors"
              title="Copy Reference ID"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCalendar}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-md transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Add to Calendar (.ics)</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-md transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Voucher</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
          {viewMode === 'inbox' && (
            <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 text-xs space-y-2 text-stone-300">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <span className="text-stone-500">From:</span>
                <span className="font-mono text-stone-200">Tohoku Horizons Reservations &lt;reservations@tohokutours.jp&gt;</span>
              </div>
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <span className="text-stone-500">To:</span>
                <span className="font-mono text-amber-300">{reservation.leadGuest.email} ({reservation.leadGuest.fullName})</span>
              </div>
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <span className="text-stone-500">Subject:</span>
                <span className="font-semibold text-stone-100">Booking Confirmed: {reservation.tourTitle} [Ref: {reservation.id}]</span>
              </div>
              <div className="flex items-center justify-between text-stone-500 pt-1">
                <span>Security:</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> DKIM Verified · TLS 1.3 Encrypted
                </span>
              </div>
            </div>
          )}

          {viewMode === 'html' ? (
            <div className="bg-stone-950 border border-stone-800 rounded-xl p-4">
              <pre className="text-xs font-mono text-amber-300/90 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {emailRawHtml}
              </pre>
            </div>
          ) : (
            /* Email / Voucher Document Body */
            <div className="bg-stone-950 border border-stone-800/90 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
              {/* Email Top Branding Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-serif-jp tracking-wider text-amber-400">東北 HORIZONS</span>
                    <span className="text-xs uppercase tracking-widest text-stone-500 font-mono">Tohoku Region, Japan</span>
                  </div>
                  <h1 className="text-2xl font-bold text-stone-100 mt-1">Tour Reservation Confirmed</h1>
                  <p className="text-xs text-stone-400 mt-0.5">Official digital confirmation & mobile boarding voucher</p>
                </div>

                <div className="flex flex-col items-start sm:items-end">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Booking Confirmed & Guaranteed</span>
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono mt-1.5">
                    Issued: {new Date(reservation.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Main Ticket Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left: Key Tour Info */}
                <div className="md:col-span-2 space-y-5">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">Activity Experience</span>
                    <h3 className="text-xl font-bold text-stone-100 mt-1 leading-snug">
                      {reservation.tourTitle}
                    </h3>
                    <p className="text-sm font-serif-jp text-stone-400 mt-0.5">{reservation.tourTitleJp}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3 border-y border-stone-800/80">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[11px] text-stone-400 uppercase tracking-wide">Reserved Date</div>
                        <div className="text-sm font-medium text-stone-200">{formattedDate}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[11px] text-stone-400 uppercase tracking-wide">Departure Slot</div>
                        <div className="text-sm font-medium text-stone-200">{reservation.slotTime}</div>
                        <div className="text-xs text-stone-400">{reservation.timeSlotLabel}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[11px] text-stone-400 uppercase tracking-wide">Guests</div>
                        <div className="text-sm font-medium text-stone-200">
                          {reservation.totalSeats} {reservation.totalSeats === 1 ? 'Traveler' : 'Travelers'}
                        </div>
                        <div className="text-xs text-stone-400">
                          {reservation.adultsCount} Adults{reservation.childrenCount > 0 ? `, ${reservation.childrenCount} Children` : ''}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[11px] text-stone-400 uppercase tracking-wide">Prefecture & Location</div>
                        <div className="text-sm font-medium text-stone-200">{reservation.prefecture} Prefecture</div>
                        <div className="text-xs text-stone-400">Tohoku, Japan</div>
                      </div>
                    </div>
                  </div>

                  {/* Meeting Point Box */}
                  <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold text-stone-200">
                        <MapPin className="w-4 h-4 text-amber-400" />
                        <span>Trailhead / Meeting Point</span>
                      </div>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(reservation.meetingPoint + ', ' + reservation.prefecture + ', Japan')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2"
                      >
                        <span>Open in Google Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-sm text-stone-300 font-medium">{reservation.meetingPoint}</p>
                    <p className="text-xs text-stone-400">
                      Please arrive 15 minutes before departure. Look for the Tohoku Horizons staff member holding a cedar wood sign.
                    </p>
                  </div>
                </div>

                {/* Right: Boarding QR Code Voucher */}
                <div className="flex flex-col items-center justify-center p-5 bg-stone-900/60 border border-stone-800 rounded-xl text-center space-y-3">
                  <span className="text-[11px] uppercase tracking-wider text-stone-400 font-mono">Mobile Boarding QR</span>
                  <div className="bg-white p-2.5 rounded-xl shadow-lg">
                    <QrCodeSvg value={reservation.qrCodeToken} size={130} />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-mono font-semibold text-amber-300">{reservation.id}</div>
                    <div className="text-[11px] text-stone-400">Scan at trailhead for instant contactless check-in</div>
                  </div>
                </div>
              </div>

              {/* Lead Guest & Pricing Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-stone-800">
                <div className="space-y-2 text-xs">
                  <div className="font-semibold text-stone-300 uppercase tracking-wider text-[11px]">Primary Guest Information</div>
                  <div className="space-y-1 text-stone-300">
                    <p><span className="text-stone-400">Lead Traveler:</span> <span className="font-medium text-stone-100">{reservation.leadGuest.fullName}</span></p>
                    <p><span className="text-stone-400">Email:</span> <span className="font-mono text-stone-100">{reservation.leadGuest.email}</span></p>
                    <p><span className="text-stone-400">Phone:</span> <span className="font-mono text-stone-100">{reservation.leadGuest.phone}</span></p>
                    <p><span className="text-stone-400">Country:</span> {reservation.leadGuest.country}</p>
                    {reservation.leadGuest.specialRequests && (
                      <p className="text-amber-300/80 bg-amber-950/20 p-2 rounded border border-amber-900/30">
                        <span className="text-amber-400 font-medium">Special Request:</span> {reservation.leadGuest.specialRequests}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="font-semibold text-stone-300 uppercase tracking-wider text-[11px]">Payment Summary</div>
                  <div className="bg-stone-900/80 rounded-lg p-3 border border-stone-800/80 space-y-1.5 text-stone-300">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Adults (x{reservation.adultsCount}):</span>
                      <span>¥{(reservation.adultsCount * reservation.unitPriceJPY).toLocaleString()}</span>
                    </div>
                    {reservation.childrenCount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-stone-400">Children (x{reservation.childrenCount}):</span>
                        <span>¥{(reservation.childrenCount * Math.round(reservation.unitPriceJPY * 0.7)).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-stone-400 text-[11px]">
                      <span>Japan Consumption Tax (10%):</span>
                      <span>Included</span>
                    </div>
                    <div className="border-t border-stone-800 pt-1.5 flex justify-between font-semibold text-stone-100 text-sm">
                      <span>Total Paid:</span>
                      <span className="text-amber-400">¥{reservation.totalPriceJPY.toLocaleString()} JPY</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pre-Trip Preparation & Guidelines */}
              <div className="border-t border-stone-800 pt-5 text-xs text-stone-400 space-y-3">
                <div className="flex items-center gap-2 font-semibold text-stone-300 text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Important Traveler Advisory & Cancellation Terms</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] leading-relaxed">
                  <div className="bg-stone-900/40 p-2.5 rounded-lg border border-stone-800/50">
                    <strong className="text-stone-300 block mb-1">Weather & Footwear</strong>
                    Tohoku mountain weather changes rapidly. Sturdy waterproof footwear and layered rain gear are strictly recommended.
                  </div>
                  <div className="bg-stone-900/40 p-2.5 rounded-lg border border-stone-800/50">
                    <strong className="text-stone-300 block mb-1">Free Cancellation</strong>
                    100% full refund available up to 48 hours prior to activity departure. Weather safety cancellations receive full immediate refunds.
                  </div>
                  <div className="bg-stone-900/40 p-2.5 rounded-lg border border-stone-800/50">
                    <strong className="text-stone-300 block mb-1">Emergency Dispatch</strong>
                    24/7 Field Operations Office in Sendai: [demo contact] or reply directly to this automated email.
                  </div>
                </div>
              </div>

              {/* Email Footer */}
              <div className="border-t border-stone-800/80 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-400 text-center sm:text-left">
                <div>
                  © 2026 Tohoku Horizons Travel Group KK. Registered Japan Travel Agency No. 3-8419.
                </div>
                <div>
                  Sendai · Morioka · Aomori · Yamagata
                </div>
              </div>
            </div>
          )}

          {/* Interactive Resend Dispatch Bar */}
          <div className="bg-stone-950/90 border border-stone-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-200">
                <Send className="w-4 h-4 text-amber-400" />
                <span>Trigger Automated Email Dispatch</span>
              </div>
              <span className="text-[11px] text-stone-400">Simulate customer delivery</span>
            </div>

            <form onSubmit={handleResend} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder={reservation.leadGuest.email || "recipient@example.com"}
                value={resendEmailInput}
                onChange={(e) => setResendEmailInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-xs text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={isResending}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
              >
                {isResending ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Automated Confirmation Email</span>
                  </>
                )}
              </button>
            </form>

            {resendSuccess && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-2 rounded-lg animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  Automated confirmation email successfully dispatched to <strong>{resendEmailInput || reservation.leadGuest.email}</strong>. Delivery log recorded.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-stone-800 bg-stone-950/80 flex items-center justify-between text-xs">
          <span className="text-stone-400 hidden sm:inline">
            A confirmation copy has been automatically queued for dispatch.
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
