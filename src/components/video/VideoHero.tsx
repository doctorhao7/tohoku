import React, { useState, useRef, useEffect } from 'react';
import { TOHOKU_VIDEOS, TOHOKU_PREFECTURES } from '../../data/mockTours';
import { ambientSound } from '../../utils/audioEngine';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Compass, 
  ChevronRight, 
  Sparkles,
  Search,
  Calendar,
  Users,
  MapPin
} from 'lucide-react';
import { TohokuPrefecture } from '../../types/tour';

interface VideoHeroProps {
  onSearchTours: (prefecture: TohokuPrefecture | 'All', date: string, guests: number) => void;
  onExploreAll: () => void;
}

export const VideoHero: React.FC<VideoHeroProps> = ({ onSearchTours, onExploreAll }) => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [selectedPrefecture, setSelectedPrefecture] = useState<TohokuPrefecture | 'All'>('All');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedGuests, setSelectedGuests] = useState<number>(2);

  const videoRef = useRef<HTMLVideoElement>(null);
  const activeVideo = TOHOKU_VIDEOS[activeVideoIndex];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay may be restricted by browser until user gesture
        setIsPlaying(false);
      });
    }
    setVideoLoaded(false);
  }, [activeVideoIndex]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleSoundscape = () => {
    const nextState = ambientSound.toggle();
    setIsAudioActive(nextState);
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen().catch(() => {});
      }
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchTours(selectedPrefecture, selectedDate, selectedGuests);
  };

  return (
    <div className="relative min-h-[92vh] lg:min-h-screen flex flex-col justify-between overflow-hidden bg-stone-950">
      {/* Background Video Engine */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <video
          ref={videoRef}
          className={`w-full h-full object-cover transition-opacity duration-1000 scale-105 filter brightness-[0.78] contrast-[1.08] ${
            videoLoaded ? 'opacity-100' : 'opacity-80'
          }`}
          autoPlay
          muted
          loop
          playsInline
          poster={activeVideo.fallbackPoster}
          onLoadedData={() => setVideoLoaded(true)}
        >
          <source src={activeVideo.videoUrl} type="video/mp4" />
          Your browser does not support HTML5 video.
        </video>

        {/* Ambient Film Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-stone-950/20 to-stone-950/80 pointer-events-none" />
      </div>

      {/* Top Bar / Audio & Video Control Ribbon */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-amber-400 uppercase bg-stone-900/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Tohoku Scenic Live Feed</span>
          <span className="text-stone-500">·</span>
          <span className="text-stone-300 font-serif-jp">{activeVideo.titleJp}</span>
        </div>

        {/* Player Media Controls */}
        <div className="flex items-center gap-2 bg-stone-900/80 backdrop-blur-md p-1.5 rounded-full border border-stone-800 text-stone-200">
          <button
            onClick={togglePlay}
            className="p-2 hover:bg-stone-800 rounded-full transition-colors"
            title={isPlaying ? "Pause Video" : "Play Video"}
            aria-label="Play/Pause video"
          >
            {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-amber-400" />}
          </button>

          <button
            onClick={toggleSoundscape}
            className={`p-2 rounded-full transition-colors flex items-center gap-1.5 ${
              isAudioActive ? 'bg-amber-500/20 text-amber-300' : 'hover:bg-stone-800 text-stone-300'
            }`}
            title={isAudioActive ? "Mute Ambient Mountain Stream" : "Play Ambient Mountain Stream Soundscape"}
            aria-label="Toggle ambient soundscape"
          >
            {isAudioActive ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="text-[11px] font-sans pr-1 hidden sm:inline">
              {isAudioActive ? 'Nature Stream On' : 'Nature Audio'}
            </span>
          </button>

          <button
            onClick={handleFullscreen}
            className="p-2 hover:bg-stone-800 rounded-full transition-colors hidden sm:block"
            title="Fullscreen Video"
            aria-label="Fullscreen video"
          >
            <Maximize2 className="w-4 h-4 text-stone-400 hover:text-white" />
          </button>
        </div>
      </div>

      {/* Hero Center Title & Editorial Typography */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 my-auto py-12 flex flex-col items-start justify-center">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="h-[1px] w-8 bg-amber-400" />
            <span className="text-xs sm:text-sm tracking-[0.3em] uppercase text-amber-300 font-semibold">
              The Sacred North · 奥羽六州
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08]">
            Discover Tohoku’s <br />
            <span className="font-serif-jp italic text-amber-200 font-normal">Living Wilderness</span> & Temples
          </h1>

          <p className="text-base sm:text-lg text-stone-300 max-w-2xl leading-relaxed drop-shadow-sm font-light">
            Real-time seat reservation for curated expeditions across Aomori, Akita, Iwate, Miyagi, Yamagata, and Fukushima. Instant mobile vouchers and automated email confirmations delivered directly to your inbox.
          </p>

          {/* Quick Value Badges */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-2 text-xs text-stone-300">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Real-Time Seat Inventory</span>
            </div>
            <span className="text-stone-600 hidden sm:inline">/</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Automated Booking Email Dispatch</span>
            </div>
            <span className="text-stone-600 hidden sm:inline">/</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              <span>English & Japanese Naturalist Guides</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Scenic Destination Switcher Ribbon */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pb-6 space-y-6">
        {/* Tourist Site Video Carousel Selector */}
        <div className="bg-stone-900/80 backdrop-blur-xl border border-stone-800/90 rounded-2xl p-3 sm:p-4 shadow-2xl">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs uppercase font-semibold tracking-wider text-stone-300">
                Tourist Site Video Showcase
              </span>
            </div>
            <span className="text-xs text-stone-400 hidden sm:inline">
              Click any site to switch live panoramic footage
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
            {TOHOKU_VIDEOS.map((item, idx) => {
              const isActive = idx === activeVideoIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveVideoIndex(idx)}
                  className={`group relative text-left p-2.5 rounded-xl transition-all duration-300 overflow-hidden border ${
                    isActive
                      ? 'bg-amber-950/40 border-amber-500/60 ring-1 ring-amber-500/40 shadow-lg'
                      : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 hover:bg-stone-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className={`font-mono ${isActive ? 'text-amber-400 font-semibold' : 'text-stone-400'}`}>
                      {item.prefecture}
                    </span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    )}
                  </div>
                  <div className={`text-xs font-semibold line-clamp-1 transition-colors ${isActive ? 'text-amber-200' : 'text-stone-200 group-hover:text-white'}`}>
                    {item.title.split(' ')[0]} {item.title.split(' ')[1]}
                  </div>
                  <div className="text-[10px] font-serif-jp text-stone-400 line-clamp-1">
                    {item.titleJp}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Real-time Reservation Search & Fast Booking Ribbon */}
        <form
          onSubmit={handleSearchSubmit}
          className="bg-stone-900/90 backdrop-blur-xl border border-stone-800 rounded-2xl p-3 sm:p-4 shadow-2xl flex flex-col md:flex-row items-stretch md:items-center gap-3"
        >
          {/* Prefecture Selector */}
          <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-stone-950/70 border border-stone-800/80 rounded-xl">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] uppercase font-mono text-stone-400">Prefecture</label>
              <select
                value={selectedPrefecture}
                onChange={(e) => setSelectedPrefecture(e.target.value as TohokuPrefecture | 'All')}
                className="w-full bg-transparent text-xs sm:text-sm font-medium text-stone-100 focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-stone-900 text-stone-100">All Tohoku Prefectures (6)</option>
                {TOHOKU_PREFECTURES.map((p) => (
                  <option key={p.name} value={p.name} className="bg-stone-900 text-stone-100">
                    {p.name} ({p.kanji})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Selector */}
          <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-stone-950/70 border border-stone-800/80 rounded-xl">
            <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] uppercase font-mono text-stone-400">Departure Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-medium text-stone-100 focus:outline-none cursor-pointer [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Guests Selector */}
          <div className="w-full md:w-36 flex items-center gap-3 px-3 py-2 bg-stone-950/70 border border-stone-800/80 rounded-xl">
            <Users className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] uppercase font-mono text-stone-400">Guests</label>
              <select
                value={selectedGuests}
                onChange={(e) => setSelectedGuests(Number(e.target.value))}
                className="w-full bg-transparent text-xs sm:text-sm font-medium text-stone-100 focus:outline-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                  <option key={num} value={num} className="bg-stone-900 text-stone-100">
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Check Availability CTA */}
          <button
            type="submit"
            className="md:w-auto px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg hover:shadow-amber-500/20 flex items-center justify-center gap-2 group shrink-0"
          >
            <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Check Live Availability</span>
          </button>
        </form>
      </div>
    </div>
  );
};
