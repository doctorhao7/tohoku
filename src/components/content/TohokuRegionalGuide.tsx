import React from 'react';
import { TOHOKU_PREFECTURES } from '../../data/mockTours';
import { TohokuPrefecture } from '../../types/tour';
import { Compass, Sparkles, MapPin, ArrowRight } from 'lucide-react';

interface TohokuRegionalGuideProps {
  onSelectPrefecture: (prefecture: TohokuPrefecture) => void;
}

export const TohokuRegionalGuide: React.FC<TohokuRegionalGuideProps> = ({ onSelectPrefecture }) => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 border-t border-stone-800/80">
      <div className="space-y-4 mb-12">
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-amber-400 uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Regional Geography & Highlights</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-stone-100">
          The Six Provinces of Tohoku · 奥羽六州
        </h2>
        <p className="text-sm text-stone-400 max-w-2xl font-light">
          Stretching across northern Honshu, Tohoku remains Japan’s most spiritually preserved landscape—shielded by the Ou Mountains, enriched by geothermal waters, and celebrated in classical poetry.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOHOKU_PREFECTURES.map((p) => (
          <div
            key={p.name}
            className="group relative bg-stone-900/70 border border-stone-800 rounded-2xl p-6 hover:border-amber-500/40 hover:bg-stone-900 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                  {p.name} Prefecture
                </span>
                <span className="text-lg font-serif-jp text-stone-500 group-hover:text-amber-300 transition-colors">
                  {p.kanji}
                </span>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed font-light">
                {p.description}
              </p>

              <div className="pt-2 text-xs text-stone-400">
                <span className="text-stone-500 block text-[10px] uppercase font-mono mb-1">Key Sanctuaries</span>
                <span className="text-stone-300 font-medium">{p.highlights}</span>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-stone-800/60 flex items-center justify-between">
              <button
                onClick={() => onSelectPrefecture(p.name)}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 transition-colors group-hover:translate-x-1"
              >
                <span>View {p.name} Activities & Slots</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
