import React from 'react';
import { Sparkles, ShieldCheck, MapPin, Users } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1C2541]/90 via-[#0B132B] to-[#0B132B] border border-slate-800 p-6 sm:p-8 mb-8 shadow-2xl">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-4">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Road to Devcon XI — Assurance Crowdfunding</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3 font-serif">
          The Meetup That Only Happens If We All Chip In
        </h1>

        <p className="text-lg text-amber-200/90 font-medium italic mb-4">
          "Everyone Chips In. The Promise Is Onchain."
        </p>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
          <strong className="text-white">Meera</strong> organizes the Road to Devcon chapter in <strong className="text-white">Indore</strong>.
          She is hosting a full-day Ethereum workshop for <strong className="text-white">60 college students</strong>.
          To lock in the conference hall, a venue deposit is required upfront.
          Previously, pledges via WhatsApp and UPI resulted in broken promises and out-of-pocket losses.
          With <strong className="text-indigo-300">Stepwell's smart contract</strong>, if the community hits the target before the deadline,
          funds are securely unlocked for the venue. If the target is missed, every pledger claims their ETH back automatically — no middleman, no delays.
        </p>

        {/* Quick event meta */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800/80 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-400" />
            <span>Indore, Madhya Pradesh</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <span>60 Students Target</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Trustless Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
};
