import React from 'react';
import { AlertCircle, Play, Settings } from 'lucide-react';

interface NoContractNoticeProps {
  onOpenConfig: () => void;
  onUseLocalAnvilPreset: () => void;
}

export const NoContractNotice: React.FC<NoContractNoticeProps> = ({
  onOpenConfig,
  onUseLocalAnvilPreset
}) => {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-amber-950/20 via-slate-900 to-slate-900 border border-amber-500/30 shadow-2xl mb-8">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex-shrink-0">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-white">Smart Contract Setup Required</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Pending Deployment
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
            No Sepolia contract address is configured yet. In accordance with Web3 integrity standards,
            this dApp does <strong>not</strong> display simulated mock balances or fake transactions.
            To connect to the onchain contract, deploy using Foundry or connect to a local Anvil instance:
          </p>

          {/* Quick steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="font-bold text-white block mb-1">Option 1: Deploy to Sepolia</span>
              <p className="text-slate-400 text-[11px] mb-2">
                Configure your <code>.env</code> and run Foundry's broadcast script to deploy to Ethereum Sepolia.
              </p>
              <code className="block p-1.5 rounded-lg bg-slate-900 text-amber-300 font-mono text-[10px] overflow-x-auto whitespace-pre">
                forge script script/Deploy.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast
              </code>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="font-bold text-white block mb-1">Option 2: Local Anvil Testnet</span>
              <p className="text-slate-400 text-[11px] mb-2">
                Run <code>anvil</code> in a terminal and deploy locally to test pledges, refunds, and time jumps.
              </p>
              <code className="block p-1.5 rounded-lg bg-slate-900 text-sky-300 font-mono text-[10px] overflow-x-auto whitespace-pre">
                anvil &amp;&amp; forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast
              </code>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenConfig}
              className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Enter Deployed Contract Address</span>
            </button>

            <button
              onClick={onUseLocalAnvilPreset}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 text-sky-400" />
              <span>Use Local Anvil Default Address</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
