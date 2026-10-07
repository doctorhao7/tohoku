import React, { useState } from 'react';
import { TourActivity, TohokuPrefecture, ActivityCategory } from '../../types/tour';
import { TourCard } from './TourCard';
import { TOHOKU_PREFECTURES } from '../../data/mockTours';
import { 
  Filter, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  SlidersHorizontal,
  MapPin,
  RefreshCw
} from 'lucide-react';

interface TourCatalogProps {
  tours: TourActivity[];
  onBookNow: (tour: TourActivity) => void;
  onPreviewVideo: (tour: TourActivity) => void;
  filterPrefecture: TohokuPrefecture | 'All';
  onFilterPrefectureChange: (pref: TohokuPrefecture | 'All') => void;
}

export const TourCatalog: React.FC<TourCatalogProps> = ({
  tours,
  onBookNow,
  onPreviewVideo,
  filterPrefecture,
  onFilterPrefectureChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | 'All'>('All');
  const [sortBy, setSortBy] = useState<'recommended' | 'priceAsc' | 'priceDesc' | 'availability'>('recommended');

  const categories: (ActivityCategory | 'All')[] = [
    'All',
    'Nature & Trekking',
    'Spiritual & Temples',
    'Onsen & Heritage',
    'Culinary & Crafts'
  ];

  // Filtering logic
  const filteredTours = tours.filter((tour) => {
    const matchesPrefecture = filterPrefecture === 'All' || tour.prefecture === filterPrefecture;
    const matchesCategory = selectedCategory === 'All' || tour.category === selectedCategory;
    const matchesQuery = 
      !searchQuery.trim() ||
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.titleJp.includes(searchQuery) ||
      tour.prefecture.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.meetingPoint.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesPrefecture && matchesCategory && matchesQuery;
  });

  // Sorting logic
  const sortedTours = [...filteredTours].sort((a, b) => {
    if (sortBy === 'priceAsc') return a.basePriceJPY - b.basePriceJPY;
    if (sortBy === 'priceDesc') return b.basePriceJPY - a.basePriceJPY;
    if (sortBy === 'availability') {
      const getRemaining = (t: TourActivity) => 
        t.schedules.flatMap(s => s.slots).reduce((acc, slot) => acc + (slot.capacity - slot.bookedSeats), 0);
      return getRemaining(b) - getRemaining(a);
    }
    // Recommended default: rating and reviews
    return b.ratingScore * b.reviewsCount - a.ratingScore * a.reviewsCount;
  });

  // Total available seats across all filtered tours
  const totalAvailableSeats = sortedTours.reduce((acc, t) => {
    return acc + t.schedules.flatMap(s => s.slots).reduce((sub, slot) => sub + Math.max(0, slot.capacity - slot.bookedSeats), 0);
  }, 0);

  return (
    <section id="tours-catalog" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-800 pb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-amber-400 uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Tohoku Real-Time Reservation Inventory</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-100">
            Curated Tohoku Expeditions
          </h2>
          <p className="text-sm text-stone-400 max-w-2xl font-light">
            Live availability updated automatically as travelers book. Select any date to inspect remaining seats, lock your departure, and receive instant confirmation vouchers.
          </p>
        </div>

        {/* Real-time inventory pill counter */}
        <div className="flex items-center gap-3 bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 shrink-0">
          <div className="text-right">
            <div className="text-xs text-stone-400">Total Live Capacity</div>
            <div className="text-lg font-bold text-amber-300 font-mono">
              {totalAvailableSeats} Seats Available
            </div>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        </div>
      </div>

      {/* Control Bar: Prefecture buttons, Category buttons, and Search */}
      <div className="space-y-4">
        {/* Prefecture Filter Tabs (Segmented controls) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
          <button
            onClick={() => onFilterPrefectureChange('All')}
            className={`px-3.5 py-2 rounded-xl font-medium transition-all shrink-0 border ${
              filterPrefecture === 'All'
                ? 'bg-amber-500 text-stone-950 font-bold border-amber-500 shadow-md'
                : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700 hover:text-white'
            }`}
          >
            All Prefectures (6)
          </button>
          {TOHOKU_PREFECTURES.map((pref) => {
            const isSelected = filterPrefecture === pref.name;
            return (
              <button
                key={pref.name}
                onClick={() => onFilterPrefectureChange(pref.name)}
                className={`px-3.5 py-2 rounded-xl font-medium transition-all shrink-0 flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 font-bold border-amber-500 shadow-md'
                    : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700 hover:text-white'
                }`}
              >
                <span>{pref.name}</span>
                <span className={`text-[11px] font-serif-jp ${isSelected ? 'text-stone-900/80' : 'text-stone-400'}`}>
                  {pref.kanji}
                </span>
              </button>
            );
          })}
        </div>

        {/* Secondary Bar: Categories + Search + Sort */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
                    isSelected
                      ? 'bg-stone-800 text-amber-300 font-medium border border-stone-700'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box & Sort dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search waterfall, temple, onsen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-stone-900 border border-stone-800 rounded-lg text-xs text-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 bg-stone-900 border border-stone-800 rounded-lg text-xs text-stone-300 focus:outline-none cursor-pointer"
            >
              <option value="recommended">Featured / High Rating</option>
              <option value="availability">Highest Seat Availability</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tour Cards Grid */}
      {sortedTours.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {sortedTours.map((tour) => (
            <TourCard
              key={tour.id}
              tour={tour}
              onBookNow={onBookNow}
              onPreviewVideo={onPreviewVideo}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-stone-900/50 border border-stone-800 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center mx-auto text-stone-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-stone-200">No tours match your criteria</h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Try resetting your prefecture or category filters to explore all available Tohoku activities.
          </p>
          <button
            onClick={() => {
              onFilterPrefectureChange('All');
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded-lg transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};
