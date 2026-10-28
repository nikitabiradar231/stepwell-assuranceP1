import React, { useState, useEffect } from 'react';
import { Clock, Info } from 'lucide-react';
import { formatTimestamp, formatTimeRemaining } from '../utils/formatters';

interface CountdownTimerProps {
  deadline: bigint | undefined;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ deadline }) => {
  const [now, setNow] = useState<number>(() => Math.floor(Date.now() / 1000));

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const deadlineNum = deadline ? Number(deadline) : 0;
  const remainingSeconds = Math.max(0, deadlineNum - now);
  const { days, hours, minutes, seconds, isExpired } = formatTimeRemaining(remainingSeconds);

  return (
    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Clock className="w-4 h-4 text-sky-400" />
          <span>Campaign Deadline</span>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {formatTimestamp(deadline)}
        </span>
      </div>

      {isExpired ? (
        <div className="py-3 px-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
          <span className="text-sm font-semibold text-rose-400">
            Deadline has passed. Campaign pledging is closed.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <span className="block text-xl sm:text-2xl font-bold text-white font-mono">{days}</span>
            <span className="text-[10px] uppercase font-semibold text-slate-400">Days</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <span className="block text-xl sm:text-2xl font-bold text-white font-mono">{hours}</span>
            <span className="text-[10px] uppercase font-semibold text-slate-400">Hours</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <span className="block text-xl sm:text-2xl font-bold text-white font-mono">{minutes}</span>
            <span className="text-[10px] uppercase font-semibold text-slate-400">Mins</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <span className="block text-xl sm:text-2xl font-bold text-amber-300 font-mono">{seconds}</span>
            <span className="text-[10px] uppercase font-semibold text-slate-400">Secs</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-1.5 mt-3 text-[11px] text-slate-400">
        <Info className="w-3.5 h-3.5 flex-shrink-0 text-slate-500" />
        <span>Live countdown is informational. The smart contract's onchain timestamp is authoritative.</span>
      </div>
    </div>
  );
};
