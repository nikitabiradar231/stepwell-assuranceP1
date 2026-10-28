import React from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { sepolia, foundry } from 'wagmi/chains';
import { AlertTriangle, Info, ArrowRight } from 'lucide-react';

export const NetworkBanner: React.FC = () => {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected) return null;

  const isSepolia = chainId === sepolia.id;
  const isFoundry = chainId === foundry.id;

  if (!isSepolia && !isFoundry) {
    return (
      <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-rose-300">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <div>
            <span className="font-bold block text-white">Unsupported Network Detected</span>
            <span>Please switch your wallet to Ethereum Sepolia Testnet to interact with Stepwell.</span>
          </div>
        </div>
        <button
          onClick={() => switchChain({ chainId: sepolia.id })}
          disabled={isPending}
          className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <span>Switch to Sepolia</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6 p-3 px-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
      <div className="flex items-center gap-2">
        <Info className="w-4 h-4 text-sky-400 flex-shrink-0" />
        <span>
          Connected to <strong className="text-slate-200">{isSepolia ? 'Ethereum Sepolia Testnet' : 'Local Anvil Testnet'}</strong>.
          {isSepolia && ' Sepolia ETH is test ETH with no economic value.'}
        </span>
      </div>
      <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
        Chain ID: {chainId}
      </span>
    </div>
  );
};
