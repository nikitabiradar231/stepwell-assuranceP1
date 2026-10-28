import React from 'react';
import { useAccount } from 'wagmi';
import { RotateCcw, AlertTriangle, CheckCircle2, Loader2, ExternalLink, Gift, ShieldAlert } from 'lucide-react';
import { formatEth, etherscanTxLink } from '../utils/formatters';
import { CampaignStatus } from '../config/contract';

interface RefundCardProps {
  status: CampaignStatus;
  userPledge: bigint;
  userBonusShare: bigint;
  userRefundClaimed: boolean;
  onClaimRefund: () => Promise<void>;
  isPending: boolean;
  isConfirming: boolean;
  isConfirmed: boolean;
  txHash?: `0x${string}`;
  error?: string | null;
  chainId?: number;
}

export const RefundCard: React.FC<RefundCardProps> = ({
  status,
  userPledge,
  userBonusShare,
  userRefundClaimed,
  onClaimRefund,
  isPending,
  isConfirming,
  isConfirmed,
  txHash,
  error,
  chainId = 11155111
}) => {
  const { isConnected } = useAccount();

  const isFailed = status === CampaignStatus.FAILED;
  const isFunding = status === CampaignStatus.FUNDING;
  const isSuccess = status === CampaignStatus.SUCCESS || status === CampaignStatus.COMPLETED;

  const totalRefundable = userPledge + userBonusShare;
  const hasRefundableBalance = userPledge > 0n;

  return (
    <div className={`p-6 rounded-3xl border shadow-xl transition-all ${
      isFailed
        ? 'bg-gradient-to-b from-rose-950/40 via-slate-900 to-slate-900 border-rose-500/30'
        : 'bg-slate-900/90 border-slate-800'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-xl border ${
          isFailed
            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            : 'bg-slate-800 text-slate-400 border-slate-700'
        }`}>
          <RotateCcw className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Refund Claim Interface</h3>
          <p className="text-xs text-slate-400">Permissionless individual refund recovery</p>
        </div>
      </div>

      {!isConnected ? (
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center text-xs text-slate-300">
          Connect your wallet to check your refundable pledge balance.
        </div>
      ) : isFunding ? (
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400">
          <div className="flex items-center gap-2 font-semibold text-amber-300 mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Campaign Still In Progress</span>
          </div>
          Refunds are locked while pledging is active. If the campaign reaches its target by the deadline, the beneficiary collects the funds. If it falls short, refunds unlock immediately after the deadline.
        </div>
      ) : isSuccess ? (
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400">
          <div className="flex items-center gap-2 font-semibold text-emerald-400 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Campaign Met Target Successfully</span>
          </div>
          Refunds are not available for successful campaigns under the base assurance rules. The funds are designated for the venue deposit.
        </div>
      ) : (userRefundClaimed || isConfirmed) ? (
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center text-xs text-emerald-300">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
          <p className="font-bold text-sm mb-1">Refund Successfully Claimed!</p>
          <p className="text-slate-400">Your original pledge and bonus share have already been returned to your wallet.</p>
        </div>
      ) : !hasRefundableBalance ? (
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400 text-center">
          <ShieldAlert className="w-5 h-5 text-slate-500 mx-auto mb-1.5" />
          <p className="font-semibold text-slate-300">No Refundable Contribution</p>
          <p>The connected address did not record an active pledge for this campaign.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200">
            <p className="font-semibold mb-1">Target Not Met Before Deadline</p>
            <p className="text-slate-300">
              The campaign did not hit its goal. You are entitled to 100% of your ETH back directly from the smart contract, plus your proportional share of Meera's assurance bonus pool.
            </p>
          </div>

          {/* Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Your Original Pledge:</span>
              <span className="font-mono text-white font-bold">{formatEth(userPledge)} ETH</span>
            </div>
            {userBonusShare > 0n && (
              <div className="flex items-center justify-between text-amber-300">
                <span className="flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5" />
                  <span>Dominant Assurance Bonus:</span>
                </span>
                <span className="font-mono font-bold">+{formatEth(userBonusShare)} ETH</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-sm font-bold text-white">
              <span>Total Available to Claim:</span>
              <span className="font-mono text-emerald-400 text-base">{formatEth(totalRefundable)} ETH</span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
              {error}
            </div>
          )}

          {txHash && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
              <span>{isConfirming ? 'Processing refund...' : 'Refund confirmed on Sepolia!'}</span>
              <a
                href={etherscanTxLink(txHash, chainId)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 font-semibold text-emerald-400 hover:underline"
              >
                <span>View</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          <button
            onClick={() => onClaimRefund()}
            disabled={isPending || isConfirming}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Confirm Refund in Wallet...</span>
              </>
            ) : isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Withdrawing from Contract...</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4" />
                <span>Claim {formatEth(totalRefundable)} ETH Refund</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
