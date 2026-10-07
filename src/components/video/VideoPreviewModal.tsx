import React, { useRef } from 'react';
import { TourActivity } from '../../types/tour';
import { X, MapPin, Sparkles, CalendarCheck } from 'lucide-react';

interface VideoPreviewModalProps {
  tour: TourActivity | null;
  isOpen: boolean;
  onClose: () => void;
  onBookNow: (tour: TourActivity) => void;
}

export const VideoPreviewModal: React.FC<VideoPreviewModalProps> = ({
  tour,
  isOpen,
  onClose,
  onBookNow
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  if (!isOpen || !tour) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-widest text-amber-400">
              Tohoku Tourist Site Video
            </span>
            <span className="text-stone-500">·</span>
            <span className="text-xs text-stone-300 font-serif-jp">{tour.titleJp}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black overflow-hidden">
          <video
            ref={videoRef}
            src={tour.videoClipUrl}
            poster={tour.videoPoster}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          >
            Your browser does not support HTML5 video.
          </video>
        </div>

        {/* Video Info & Book CTA */}
        <div className="p-6 bg-stone-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
              <MapPin className="w-3.5 h-3.5" />
              <span>{tour.prefecture} Prefecture · {tour.meetingPoint}</span>
            </div>
            <h3 className="text-lg font-bold text-stone-100">{tour.title}</h3>
            <p className="text-xs text-stone-400 max-w-xl font-light">{tour.videoTitle}</p>
          </div>

          <button
            onClick={() => {
              onClose();
              onBookNow(tour);
            }}
            className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shrink-0 flex items-center gap-2"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Check Availability & Book</span>
          </button>
        </div>
      </div>
    </div>
  );
};
