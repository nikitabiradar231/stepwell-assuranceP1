import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { Gift, Sparkles, Plus, Loader2, Info } from 'lucide-react';
import { formatEth } from '../utils/formatters';
import { CampaignStatus } from '../config/contract';

interface DominantAssuranceCardProps {
  status: CampaignStatus;
  totalBonus: bigint | undefined;
  onFundBonus: (amount: string) => Promise<void>;
  isPending: boolean;
  isConfirming: boolean;
  error?: string | null;
}

export const DominantAssuranceCard: React.FC<DominantAssuranceCardProps> = ({
  status,
  totalBonus,
  onFundBonus,
  isPending,
  isConfirming,
  error
}) => {
  const { isConnected } = useAccount();
  const [bonusInput, setBonusInput] = useState<string>('0.05');
  const [showFundForm, setShowFundForm] = useState<boolean>(false);

  const isFundingActive = status === CampaignStatus.FUNDING;

  const handleFund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bonusInput || isNaN(Number(bonusInput)) || Number(bonusInput) <= 0) return;
    onFundBonus(bonusInput);
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Dominant Assurance Mechanism</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Stretch Goal Active
              </span>
            </div>
            <p className="text-xs text-slate-400">Organizer-funded bonus protecting early participants</p>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-right">
          <span className="text-[10px] text-slate-400 block uppercase font-semibold">Bonus Pool</span>
          <span className="text-sm font-extrabold text-amber-300 font-mono">
            {formatEth(totalBonus)} ETH
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed mb-4">
        To overcome hesitation among student participants, Meera can lock an assurance bonus into the contract.
        If the campaign hits its goal, the bonus funds the workshop refreshments.
        If the campaign falls short, <strong>100% of the bonus is distributed proportionally to pledgers on top of their full refund</strong>.
        Participants face zero downside!
      </p>

      {isFundingActive && isConnected && (
        <div>
          {!showFundForm ? (
            <button
              onClick={() => setShowFundForm(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Organizer: Fund the Bonus Pool</span>
            </button>
          ) : (
            <form onSubmit={handleFund} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Add Bonus ETH</span>
                <button
                  type="button"
                  onClick={() => setShowFundForm(false)}
                  className="text-slate-500 hover:text-slate-300"
                >
                  Cancel
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={bonusInput}
                  onChange={(e) => setBonusInput(e.target.value)}
                  placeholder="0.05"
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={isPending || isConfirming}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isPending || isConfirming ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>Deposit Bonus</span>
                </button>
              </div>

              {error && <p className="text-[11px] text-rose-400">{error}</p>}
            </form>
          )}
        </div>
      )}

      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-800/60 text-[11px] text-slate-400">
        <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
        <span>Bonus contributions are held separately from pledges and do not count toward reaching the target.</span>
      </div>
    </div>
  );
};
