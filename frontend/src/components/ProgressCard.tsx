import React from 'react';
import { Users, ArrowUpRight, Copy, Check } from 'lucide-react';
import { formatEth, formatAddress, etherscanAddressLink } from '../utils/formatters';

interface ProgressCardProps {
  target: bigint | undefined;
  totalPledged: bigint | undefined;
  remainingNeeded: bigint | undefined;
  pledgerCount: number;
  beneficiary: string | undefined;
  contractAddress: string | undefined;
  chainId?: number;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  target,
  totalPledged,
  remainingNeeded,
  pledgerCount,
  beneficiary,
  contractAddress,
  chainId = 11155111
}) => {
  const [copied, setCopied] = React.useState(false);

  const targetNum = target ? Number(target) : 0;
  const pledgedNum = totalPledged ? Number(totalPledged) : 0;
  const rawPct = targetNum > 0 ? (pledgedNum / targetNum) * 100 : 0;
  const pct = Math.min(Math.max(rawPct, 0), 100);

  const copyBeneficiary = () => {
    if (beneficiary) {
      navigator.clipboard.writeText(beneficiary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
      {/* Top metrics */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Total ETH Pledged
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
              {formatEth(totalPledged)} ETH
            </span>
            <span className="text-sm font-semibold text-slate-400">
              / {formatEth(target)} ETH
            </span>
          </div>
        </div>

        <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
            {rawPct.toFixed(1)}%
          </span>
          <span className="text-xs text-slate-400">
            {remainingNeeded && remainingNeeded > 0n
              ? `${formatEth(remainingNeeded)} ETH needed`
              : 'Target reached!'}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden mb-6 p-0.5 border border-slate-700/50">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 transition-all duration-700 ease-out shadow-sm"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Campaign Details Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
        {/* Pledgers Count */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Total Backers</span>
            <span className="font-bold text-white text-sm">{pledgerCount} {pledgerCount === 1 ? 'Pledger' : 'Pledgers'}</span>
          </div>
        </div>

        {/* Beneficiary Address */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Beneficiary (Meera)</span>
            <span className="font-mono text-slate-200 text-xs">{formatAddress(beneficiary)}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={copyBeneficiary}
              title="Copy Address"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <a
              href={etherscanAddressLink(beneficiary, chainId)}
              target="_blank"
              rel="noreferrer"
              title="View on Etherscan"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
        {contractAddress && (
          <div className="col-span-1 sm:col-span-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Contract Address: <span className="font-mono text-sky-400">{formatAddress(contractAddress)}</span></span>
            <a
              href={etherscanAddressLink(contractAddress, chainId)}
              target="_blank"
              rel="noreferrer"
              className="text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
            >
              <span>View Contract on Etherscan</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
