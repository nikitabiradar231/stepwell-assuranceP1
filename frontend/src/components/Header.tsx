import React from 'react';
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain, useBalance } from 'wagmi';
import { sepolia, foundry } from 'wagmi/chains';
import { Wallet, LogOut, AlertTriangle, Settings } from 'lucide-react';
import { formatAddress, formatEth } from '../utils/formatters';

interface HeaderProps {
  contractAddress: `0x${string}` | '';
  onOpenConfig: () => void;
}

export const Header: React.FC<HeaderProps> = ({ contractAddress, onOpenConfig }) => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { data: balance } = useBalance({ address });

  const isSepolia = chainId === sepolia.id;
  const isFoundry = chainId === foundry.id;
  const isSupported = isSepolia || isFoundry;

  const handleConnect = () => {
    const injectedConnector = connectors.find(c => c.name.toLowerCase().includes('metamask')) || connectors[0];
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    }
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-[#0B132B]/85 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-sky-400 to-amber-300 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0B132B] rounded-[10px] flex items-center justify-center">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-indigo-400 to-sky-300 text-lg">
                S
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white font-serif">
                Stepwell
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Devcon XI
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Indore Chapter • Assurance Crowdfunding
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Network Selector / Warning */}
          {isConnected && (
            <div>
              {isSupported ? (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300">
                  <span className={`w-2 h-2 rounded-full ${isSepolia ? 'bg-sky-400' : 'bg-emerald-400'} animate-pulse`} />
                  <span>{isSepolia ? 'Ethereum Sepolia' : 'Local Anvil'}</span>
                </div>
              ) : (
                <button
                  onClick={() => switchChain?.({ chainId: sepolia.id })}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-medium transition-colors"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Switch to Sepolia</span>
                </button>
              )}
            </div>
          )}

          {/* Contract Config Button */}
          <button
            onClick={onOpenConfig}
            title="Configure Contract Address"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition-all"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">
              {contractAddress ? formatAddress(contractAddress) : 'Set Contract'}
            </span>
          </button>

          {/* Connect / User Info */}
          {!isConnected ? (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all active:scale-95 disabled:opacity-50"
            >
              <Wallet className="w-4 h-4" />
              <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl p-1 pl-3">
              <div className="flex flex-col text-right pr-2 hidden sm:block">
                <span className="text-xs font-semibold text-white">
                  {formatAddress(address)}
                </span>
                <span className="text-[10px] text-slate-400">
                  {formatEth(balance?.value)} ETH
                </span>
              </div>
              <button
                onClick={() => disconnect()}
                title="Disconnect Wallet"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
