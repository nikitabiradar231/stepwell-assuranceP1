import React, { useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { parseEther } from 'viem';
import { Coins, ArrowRight, CheckCircle2, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { formatEth, etherscanTxLink } from '../utils/formatters';
import { CampaignStatus } from '../config/contract';

interface PledgeCardProps {
  status: CampaignStatus;
  userPledge: bigint;
  userOriginalPledge: bigint;
  onPledge: (amount: string) => Promise<void>;
  isPending: boolean;
  isConfirming: boolean;
  isConfirmed: boolean;
  txHash?: `0x${string}`;
  error?: string | null;
  chainId?: number;
}

const PRESETS = ['0.01', '0.02', '0.05', '0.1'];

export const PledgeCard: React.FC<PledgeCardProps> = ({
  status,
  userPledge,
  userOriginalPledge,
  onPledge,
  isPending,
  isConfirming,
  isConfirmed,
  txHash,
  error,
  chainId = 11155111
}) => {
  const { isConnected, address } = useAccount();
  const { data: balance } = useBalance({ address });
  const [amount, setAmount] = useState<string>('0.02');
  const [inputError, setInputError] = useState<string | null>(null);

  const isFundingActive = status === CampaignStatus.FUNDING;

  const handleAmountChange = (val: string) => {
    setAmount(val);
    setInputError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setInputError('Please enter a valid ETH amount greater than 0.');
      return;
    }

    try {
      const val = parseEther(amount);
      if (balance && val > balance.value) {
        setInputError('Amount exceeds your available ETH balance.');
        return;
      }
    } catch {
      setInputError('Invalid number format.');
      return;
    }

    onPledge(amount);
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Chip In for the Meetup</h3>
            <p className="text-xs text-slate-400">Pledge test ETH to guarantee the venue</p>
          </div>
        </div>

        {(userPledge > 0n || userOriginalPledge > 0n) && (
          <div className="px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-right">
            <span className="text-[10px] text-indigo-300 block">Your Pledge</span>
            <span className="text-xs font-bold text-white font-mono">{formatEth(userPledge > 0n ? userPledge : userOriginalPledge)} ETH</span>
          </div>
        )}
      </div>

      {!isFundingActive ? (
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
          <AlertCircle className="w-6 h-6 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-white mb-1">Pledging is Closed</p>
          <p className="text-xs text-slate-400">
            The campaign deadline has passed. The contract rejects any new pledges.
          </p>
        </div>
      ) : !isConnected ? (
        <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 text-center">
          <p className="text-sm font-medium text-slate-300 mb-2">
            Connect your Web3 wallet to pledge ETH toward the Indore workshop.
          </p>
          <p className="text-xs text-slate-400">
            MetaMask or any injected browser wallet on Sepolia is supported.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount input */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span>Amount (ETH)</span>
              <span>Balance: {formatEth(balance?.value)} ETH</span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.05"
                disabled={isPending || isConfirming}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono text-lg focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                ETH
              </span>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handleAmountChange(p)}
                disabled={isPending || isConfirming}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                  amount === p
                    ? 'bg-indigo-500 text-white border-indigo-400 shadow-sm'
                    : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Error notice */}
          {(inputError || error) && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{inputError || error}</span>
            </div>
          )}

          {/* Status feedback */}
          {(txHash || isConfirmed) && (
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-between text-xs text-indigo-300">
              <div className="flex items-center gap-2">
                {isConfirming ? (
                  <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
                <span>{isConfirming ? 'Confirming on Sepolia...' : 'Pledge Confirmed onchain!'}</span>
              </div>
              <a
                href={etherscanTxLink(txHash, chainId)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 font-semibold text-sky-400 hover:underline"
              >
                <span>View</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending || isConfirming}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Confirm in Wallet...</span>
              </>
            ) : isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Broadcasting to Sepolia...</span>
              </>
            ) : (
              <>
                <span>Pledge {amount ? `${amount} ETH` : ''}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
