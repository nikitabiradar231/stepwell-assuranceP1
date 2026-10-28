import React from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Lock, Cpu, Sparkles } from 'lucide-react';

export const TransparencyExplainer: React.FC = () => {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white font-serif">
            How The Smart Contract Guarantees Fairness
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Rules encoded in immutable Solidity 0.8.24 code on Ethereum
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Phase 1: Before Deadline */}
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center text-xs font-bold font-mono">
                1
              </span>
              <h3 className="font-bold text-sm text-white">Before the Deadline</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <span>Anyone can pledge test ETH to support the Indore workshop.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <span>Campaign terms (target, deadline, beneficiary) are <strong>immutable</strong> and cannot be altered by anyone.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <span>Funds cannot be withdrawn or collected prematurely.</span>
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-amber-300/80 font-medium">
            Status: Pledging Active
          </div>
        </div>

        {/* Phase 2: Success Outcome */}
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-xs font-bold font-mono">
                2
              </span>
              <h3 className="font-bold text-sm text-white">Outcome: Target Met</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>The campaign succeeds because the community reached the venue deposit.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Only the designated beneficiary (Meera) can collect the funds.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>The contract strictly enforces a single one-time payout.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Refunds are disabled under successful campaign rules.</span>
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-300/80 font-medium">
            Venue Confirmed & Locked In
          </div>
        </div>

        {/* Phase 3: Failure Outcome */}
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center text-xs font-bold font-mono">
                3
              </span>
              <h3 className="font-bold text-sm text-white">Outcome: Target Missed</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <XCircle className="w-3.5 h-3.5 text-rose-400 mt-0.5 flex-shrink-0" />
                <span>The campaign fails because the goal was not met in time.</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-3.5 h-3.5 text-rose-400 mt-0.5 flex-shrink-0" />
                <span>Each participant independently claims their own 100% refund.</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-3.5 h-3.5 text-rose-400 mt-0.5 flex-shrink-0" />
                <span>No loops or batching: Meera cannot block or delay refunds.</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-3.5 h-3.5 text-rose-400 mt-0.5 flex-shrink-0" />
                <span>Plus proportional share of the dominant-assurance bonus!</span>
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-rose-300/80 font-medium">
            100% Capital Recovery Guarantee
          </div>
        </div>
      </div>

      {/* Security Guarantee Pills */}
      <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-sky-400" />
          <span>Non-upgradeable & No Admin Backdoor</span>
        </div>
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <span>Checks-Effects-Interactions & OpenZeppelin ReentrancyGuard</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Open-Source Foundry Tested Suite (31 Tests Passed)</span>
        </div>
      </div>
    </div>
  );
};
