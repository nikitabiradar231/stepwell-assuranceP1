import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink, Terminal, AlertCircle } from 'lucide-react';
import { formatAddress, etherscanAddressLink } from '../utils/formatters';

interface ContractConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractAddress: `0x${string}` | '';
  onUpdateAddress: (address: `0x${string}` | '') => void;
  chainId?: number;
}

export const ContractConfigModal: React.FC<ContractConfigModalProps> = ({
  isOpen,
  onClose,
  contractAddress,
  onUpdateAddress,
  chainId = 11155111
}) => {
  const [inputVal, setInputVal] = useState<string>(contractAddress);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = inputVal.trim();
    if (trimmed === '') {
      onUpdateAddress('');
      onClose();
      return;
    }
    if (!trimmed.startsWith('0x') || trimmed.length !== 42) {
      setError('Address must be a valid 42-character 0x-prefixed hex string.');
      return;
    }
    setError(null);
    onUpdateAddress(trimmed as `0x${string}`);
    onClose();
  };

  const copyAddress = () => {
    if (contractAddress) {
      navigator.clipboard.writeText(contractAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Smart Contract Configuration</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          Connect this dApp to your deployed <code>MeetupAssurance</code> smart contract on Sepolia or local Anvil.
        </p>

        {/* Current status display */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 mb-4 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span>Target Network:</span>
            <span className="font-semibold text-white">
              {chainId === 11155111 ? 'Ethereum Sepolia (Chain ID 11155111)' : 'Local Anvil (Chain ID 31337)'}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span>Configured Address:</span>
            {contractAddress ? (
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sky-400">{formatAddress(contractAddress)}</span>
                <button
                  onClick={copyAddress}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <a
                  href={etherscanAddressLink(contractAddress, chainId)}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ) : (
              <span className="text-amber-400 italic">Not Deployed / Pending</span>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
            Set Contract Address
          </label>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              setError(null);
            }}
            placeholder="0x..."
            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          />
          {error && (
            <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-1.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Foundry deployment guidance */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 mb-6">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold mb-1">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span>Foundry Deploy Command</span>
          </div>
          <code className="block p-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-amber-300 overflow-x-auto whitespace-pre">
            forge script script/Deploy.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast --verify
          </code>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all"
          >
            Save Address
          </button>
        </div>
      </div>
    </div>
  );
};
