import React from 'react';
import { TourActivity } from '../../types/tour';
import { 
  Clock, 
  MapPin, 
  Users, 
  Star, 
  ChevronRight, 
  Eye, 
  PlayCircle,
  CalendarCheck
} from 'lucide-react';

interface TourCardProps {
  tour: TourActivity;
  onBookNow: (tour: TourActivity) => void;
  onPreviewVideo: (tour: TourActivity) => void;
}

export const TourCard: React.FC<TourCardProps> = ({ tour, onBookNow, onPreviewVideo }) => {
  // Compute total available seats across all upcoming schedules
  const allSlots = tour.schedules.flatMap(s => s.slots);
  const totalRemaining = allSlots.reduce((acc, slot) => acc + Math.max(0, slot.capacity - slot.bookedSeats), 0);
  
  // Earliest schedule remaining
  const firstDay = tour.schedules[0];
  const firstDayRemaining = firstDay ? firstDay.slots.reduce((acc, s) => acc + Math.max(0, s.capacity - s.bookedSeats), 0) : 0;

  return (
    <div className="group relative bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-lg hover:border-stone-700 transition-all duration-300 flex flex-col">
      {/* Top Media Image Banner */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-950">
        <img
          src={tour.heroImage}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Darkening Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-950/80 backdrop-blur-md border border-stone-800 text-[11px] font-mono text-stone-200">
            <span className="text-amber-400 font-bold">{tour.prefecture}</span>
            <span className="text-stone-400 font-serif-jp">{tour.prefectureJp}</span>
          </div>

          {/* Real-time Urgency Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-950/80 backdrop-blur-md border border-stone-800 text-[11px]">
            <span className={`w-1.5 h-1.5 rounded-full ${firstDayRemaining <= 3 ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
            <span className={firstDayRemaining <= 3 ? 'text-amber-300 font-medium' : 'text-stone-300'}>
              {firstDayRemaining <= 3 ? `Only ${firstDayRemaining} left today` : `${totalRemaining} slots available`}
            </span>
          </div>
        </div>

        {/* Video Preview Trigger */}
        <button
          onClick={() => onPreviewVideo(tour)}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-900/90 hover:bg-stone-800 text-stone-200 border border-stone-700/80 text-xs backdrop-blur-md transition-colors"
          title="Watch scenic preview clip"
        >
          <PlayCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Watch Clip</span>
        </button>

        {/* Live Active Viewers */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[10px] text-stone-300 bg-stone-950/70 px-2 py-0.5 rounded backdrop-blur-sm">
          <Eye className="w-3 h-3 text-amber-400" />
          <span>{tour.activeViewersCount || 3} looking now</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Unboxed Metadata with Typographic Separator (Zero-Pill discipline) */}
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <span>{tour.category}</span>
            <span aria-hidden="true">·</span>
            <span>{tour.duration}</span>
            <span aria-hidden="true">·</span>
            <span>{tour.difficulty}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-stone-100 group-hover:text-amber-300 transition-colors leading-snug">
            {tour.title}
          </h3>
          <p className="text-xs font-serif-jp text-stone-400">{tour.titleJp}</p>

          <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed font-light">
            {tour.shortDescription}
          </p>
        </div>

        {/* Highlights Preview */}
        <div className="space-y-1.5 py-2 border-t border-stone-800/80 text-xs text-stone-400">
          <div className="flex items-center gap-2 text-stone-300 text-[11px]">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{tour.meetingPoint}</span>
          </div>
          <div className="flex items-center gap-2 text-stone-400 text-[11px]">
            <Users className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span>Max {tour.maxGroupSize} travelers · English/Japanese Naturalist</span>
          </div>
        </div>

        {/* Footer: Rating, Pricing & Reservation CTA */}
        <div className="pt-3 border-t border-stone-800 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{tour.ratingScore.toFixed(2)}</span>
              <span className="text-stone-400 font-normal">({tour.reviewsCount})</span>
            </div>
            <div className="text-base font-bold text-stone-100 mt-0.5">
              ¥{tour.basePriceJPY.toLocaleString()}
              <span className="text-[11px] font-normal text-stone-400 ml-1">/ person</span>
            </div>
          </div>

          <button
            onClick={() => onBookNow(tour)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition-all shadow-md hover:shadow-amber-500/20 flex items-center gap-1.5 group-hover:translate-x-0.5"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Reserve Seat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
