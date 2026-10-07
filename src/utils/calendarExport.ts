import { Reservation } from '../types/tour';

/**
 * Generates an RFC-5545 compliant iCalendar (.ics) file string and triggers download
 */
export function downloadCalendarEvent(reservation: Reservation): void {
  // Parse date and time
  const [year, month, day] = reservation.date.split('-').map(Number);
  
  // Extract start time e.g. "08:30" from "08:30 - 12:00"
  const startMatch = reservation.slotTime.match(/(\d{2}):(\d{2})/);
  const startHour = startMatch ? parseInt(startMatch[1], 10) : 9;
  const startMinute = startMatch ? parseInt(startMatch[2], 10) : 0;

  // Assume 3.5 hour activity if no end time
  const endMatch = reservation.slotTime.match(/-\s*(\d{2}):(\d{2})/);
  const endHour = endMatch ? parseInt(endMatch[1], 10) : startHour + 3;
  const endMinute = endMatch ? parseInt(endMatch[2], 10) : startMinute + 30;

  const pad = (n: number) => n.toString().padStart(2, '0');

  const dtStart = `${year}${pad(month)}${pad(day)}T${pad(startHour)}${pad(startMinute)}00`;
  const dtEnd = `${year}${pad(month)}${pad(day)}T${pad(endHour)}${pad(endMinute)}00`;
  const now = new Date();
  const dtStamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Tohoku Horizons//Tour Activity Reservation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:booking-${reservation.id}@tohokutours.jp`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:Tohoku Tour: ${reservation.tourTitle}`,
    `DESCRIPTION:Confirmation ID: ${reservation.id}\\nTour: ${reservation.tourTitle} (${reservation.prefecture} Prefecture)\\nDeparture: ${reservation.slotTime}\\nGuests: ${reservation.totalSeats} (${reservation.adultsCount} Adults, ${reservation.childrenCount} Children)\\nMeeting Point: ${reservation.meetingPoint}\\n\\nPlease arrive 15 minutes before departure with comfortable walking shoes.`,
    `LOCATION:${reservation.meetingPoint}, ${reservation.prefecture}, Japan`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Tohoku_Tour_${reservation.id}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
