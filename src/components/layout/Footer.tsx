import React from 'react';
import { Compass, Mail, Phone, MapPin, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC<{ onOpenManager: () => void }> = ({ onOpenManager }) => {
  return (
    <footer className="w-full bg-stone-950 border-t border-stone-800 text-stone-400 text-xs py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-stone-100 font-serif-jp text-lg font-bold">
              <Compass className="w-5 h-5 text-amber-400" />
              <span>東北 HORIZONS</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed font-light">
              Official activity reservation system for licensed nature expeditions, spiritual pilgrimages, and heritage walks across the Tohoku region of Japan.
            </p>
            <div className="text-[11px] text-stone-400">
              Registered Travel Agency License No. 3-8419 · Japan Tourism Agency
            </div>
          </div>

          {/* Col 2: Hub Stations */}
          <div className="space-y-2">
            <div className="text-stone-200 font-semibold uppercase font-mono text-[11px] tracking-wider">
              Departure Hubs
            </div>
            <ul className="space-y-1.5 text-xs text-stone-400">
              <li>JR Shin-Aomori Station (North Tohoku Hub)</li>
              <li>JR Morioka Station (Iwate & Sanriku Hub)</li>
              <li>JR Sendai Station (Miyagi Central Hub)</li>
              <li>JR Yamagata Station (Mountain & Onsen Hub)</li>
              <li>JR Akita Station & Kakunodate Terminal</li>
              <li>JR Koriyama / Aizu-Wakamatsu (Fukushima Hub)</li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Automated Emails */}
          <div className="space-y-2">
            <div className="text-stone-200 font-semibold uppercase font-mono text-[11px] tracking-wider">
              Customer Support
            </div>
            <ul className="space-y-1.5 text-xs text-stone-400">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>reservations@tohokutours.jp</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>[demo contact] (Sendai Office)</span>
              </li>
              <li className="text-[11px] text-stone-400 pt-1">
                Automated confirmation emails are dispatched instantly upon checkout. Check spam folder if not received within 60 seconds.
              </li>
            </ul>
          </div>

          {/* Col 4: Management & Operations */}
          <div className="space-y-2">
            <div className="text-stone-200 font-semibold uppercase font-mono text-[11px] tracking-wider">
              Tour Operations
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Tohoku naturalists and mountain guides use our real-time availability desk to regulate group size and ecological impact.
            </p>
            <button
              onClick={onOpenManager}
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium underline underline-offset-4"
            >
              <span>Switch to Tour Operator Desk</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400">
          <div>
            © {new Date().getFullYear()} Tohoku Horizons Travel Group KK. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Real-Time Availability Protocol</span>
            <span aria-hidden="true">·</span>
            <span>Automated Confirmation Engine</span>
            <span aria-hidden="true">·</span>
            <span>Tohoku Video Showcase</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
