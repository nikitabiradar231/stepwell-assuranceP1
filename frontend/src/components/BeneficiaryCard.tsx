import React from 'react';
import { useAccount } from 'wagmi';
import { Award, CheckCircle2, ShieldCheck, Loader2, ExternalLink, Lock } from 'lucide-react';
import { formatEth, formatAddress, etherscanTxLink } from '../utils/formatters';
import { CampaignStatus } from '../config/contract';

interface BeneficiaryCardProps {
  status: CampaignStatus;
  totalPledged: bigint | undefined;
  totalBonus: bigint | undefined;
  beneficiary: string | undefined;
  collected: boolean | undefined;
  onCollect: () => Promise<void>;
  isPending: boolean;
  isConfirming: boolean;
  isConfirmed: boolean;
  txHash?: `0x${string}`;
  error?: string | null;
  chainId?: number;
}

export const BeneficiaryCard: React.FC<BeneficiaryCardProps> = ({
  status,
  totalPledged,
  totalBonus,
  beneficiary,
  collected,
  onCollect,
  isPending,
  isConfirming,
  isConfirmed,
  txHash,
  error,
  chainId = 11155111
}) => {
  const { address } = useAccount();

  const isSuccess = status === CampaignStatus.SUCCESS;
  const isCompleted = status === CampaignStatus.COMPLETED || !!collected || isConfirmed;
  const isBeneficiaryConnected = !!address && !!beneficiary && address.toLowerCase() === beneficiary.toLowerCase();

  const totalPayout = (totalPledged ?? 0n) + (totalBonus ?? 0n);

  return (
    <div className={`p-6 rounded-3xl border shadow-xl transition-all ${
      isCompleted
        ? 'bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-900 border-indigo-500/30'
        : isSuccess
        ? 'bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/30'
        : 'bg-slate-900/90 border-slate-800'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-xl border ${
          isCompleted
            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
            : isSuccess
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : 'bg-slate-800 text-slate-400 border-slate-700'
        }`}>
          <Award className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Beneficiary Payout Collection</h3>
          <p className="text-xs text-slate-400">Reserved for Meera to book the Indore venue</p>
        </div>
      </div>

      {isCompleted ? (
        <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-center text-xs text-indigo-200">
          <CheckCircle2 className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
          <h4 className="font-bold text-sm text-white mb-1">Funds Successfully Collected!</h4>
          <p className="text-slate-300 mb-3">
            The campaign payout was transferred to beneficiary <span className="font-mono text-white">{formatAddress(beneficiary)}</span>. The venue deposit is secured!
          </p>
          {txHash && (
            <a
              href={etherscanTxLink(txHash, chainId)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold"
            >
              <span>View Collection Tx on Etherscan</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      ) : isSuccess ? (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
            <p className="font-semibold mb-1">Campaign Target Reached!</p>
            <p className="text-slate-300">
              The deadline has passed and the community successfully reached the funding goal. Only the designated beneficiary address (<span className="font-mono text-white">{formatAddress(beneficiary)}</span>) can trigger the one-time withdrawal.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Total Pledged by Community:</span>
              <span className="font-mono text-white font-bold">{formatEth(totalPledged)} ETH</span>
            </div>
            {totalBonus && totalBonus > 0n && (
              <div className="flex items-center justify-between text-amber-300">
                <span>Bonus Pool Added to Budget:</span>
                <span className="font-mono font-bold">+{formatEth(totalBonus)} ETH</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-sm font-bold text-white">
              <span>Total Payout to Beneficiary:</span>
              <span className="font-mono text-emerald-400 text-base">{formatEth(totalPayout)} ETH</span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
              {error}
            </div>
          )}

          {isBeneficiaryConnected ? (
            <button
              onClick={() => onCollect()}
              disabled={isPending || isConfirming}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Confirming in Beneficiary Wallet...</span>
                </>
              ) : isConfirming ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Collecting Funds on Sepolia...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Collect {formatEth(totalPayout)} ETH as Beneficiary</span>
                </>
              )}
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400 flex items-center gap-3">
              <Lock className="w-5 h-5 text-slate-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-300">Collection Restricted</p>
                <p>Connect using the beneficiary account ({formatAddress(beneficiary)}) to collect funds.</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400">
          Collection is only permitted if the campaign passes its deadline with total pledges meeting or exceeding the target.
        </div>
      )}
    </div>
  );
};
