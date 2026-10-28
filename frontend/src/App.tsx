import { useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { foundry } from 'wagmi/chains';
import { Header } from './components/Header';
import { NetworkBanner } from './components/NetworkBanner';
import { NoContractNotice } from './components/NoContractNotice';
import { HeroBanner } from './components/HeroBanner';
import { StatusBadge } from './components/StatusBadge';
import { ProgressCard } from './components/ProgressCard';
import { CountdownTimer } from './components/CountdownTimer';
import { PledgeCard } from './components/PledgeCard';
import { RefundCard } from './components/RefundCard';
import { DominantAssuranceCard } from './components/DominantAssuranceCard';
import { BeneficiaryCard } from './components/BeneficiaryCard';
import { TransparencyExplainer } from './components/TransparencyExplainer';
import { ContractConfigModal } from './components/ContractConfigModal';
import { TransactionModal } from './components/TransactionModal';
import { useCampaignData } from './hooks/useCampaignData';
import { useContractActions } from './hooks/useContractActions';
import { DEFAULT_SEPOLIA_ADDRESS, DEFAULT_ANVIL_ADDRESS } from './config/contract';
import { ShieldCheck, Heart } from 'lucide-react';

const STORAGE_KEY = 'stepwell_contract_address';

export default function App() {
  const { address } = useAccount();
  const chainId = useChainId();

  // Initialize contract address with local storage or network defaults
  const [contractAddress, setContractAddress] = useState<`0x${string}` | ''>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved.startsWith('0x') && saved.length === 42) {
      return saved as `0x${string}`;
    }
    return DEFAULT_SEPOLIA_ADDRESS;
  });

  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);

  // Auto-resolve active contract address if connected to Foundry/Anvil
  const activeContractAddress =
    contractAddress || (chainId === foundry.id ? DEFAULT_ANVIL_ADDRESS : '');

  // Load contract data from onchain reads
  const campaign = useCampaignData(
    activeContractAddress ? activeContractAddress : undefined,
    address
  );

  // Contract actions (pledge, refund, collect, fundBonus)
  const actions = useContractActions(
    activeContractAddress ? activeContractAddress : undefined,
    () => {
      // Refresh campaign onchain data after transaction succeeds
      campaign.refetchAll();
    }
  );

  // Update localStorage when contract address changes
  const handleUpdateAddress = (newAddr: `0x${string}` | '') => {
    setContractAddress(newAddr);
    if (newAddr) {
      localStorage.setItem(STORAGE_KEY, newAddr);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleUseAnvilPreset = () => {
    handleUpdateAddress(DEFAULT_ANVIL_ADDRESS);
  };

  // Derive modal title purely from active action state
  const modalTitle =
    actions.activeAction === 'pledge'
      ? 'Pledging to Meetup Campaign'
      : actions.activeAction === 'refund'
      ? 'Claiming Refund & Dominant Assurance Bonus'
      : actions.activeAction === 'collect'
      ? 'Collecting Campaign Payout as Beneficiary'
      : actions.activeAction === 'bonus'
      ? 'Funding Dominant Assurance Bonus Pool'
      : 'Transaction in Progress';

  const hasContractConfigured = !!activeContractAddress && activeContractAddress.length === 42;
  const isTransactionModalOpen = !!actions.activeAction;

  return (
    <div className="min-h-screen bg-[#070B19] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <Header
        contractAddress={activeContractAddress}
        onOpenConfig={() => setIsConfigOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Network status notice */}
        <NetworkBanner />

        {/* Prompt when contract address is pending */}
        {!hasContractConfigured && (
          <NoContractNotice
            onOpenConfig={() => setIsConfigOpen(true)}
            onUseLocalAnvilPreset={handleUseAnvilPreset}
          />
        )}

        {/* Hero Story Banner */}
        <HeroBanner />

        {/* Campaign Live Dashboard */}
        {hasContractConfigured && (
          <div className="space-y-8 mb-12">
            {/* Status Indicator */}
            <StatusBadge status={campaign.status} />

            {/* Top row: Progress & Countdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-2">
                <ProgressCard
                  target={campaign.target}
                  totalPledged={campaign.totalPledged}
                  remainingNeeded={campaign.remainingNeeded}
                  pledgerCount={campaign.pledgerCount}
                  beneficiary={campaign.beneficiary}
                  contractAddress={activeContractAddress}
                  chainId={chainId}
                />
              </div>

              <div>
                <CountdownTimer deadline={campaign.deadline} />
              </div>
            </div>

            {/* Core Interaction Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Left Column: Pledging & Dominant Assurance */}
              <div className="space-y-6">
                <PledgeCard
                  status={campaign.status}
                  userPledge={campaign.userPledge}
                  userOriginalPledge={campaign.userOriginalPledge}
                  onPledge={actions.executePledge}
                  isPending={actions.isWritePending && actions.activeAction === 'pledge'}
                  isConfirming={actions.isConfirming && actions.activeAction === 'pledge'}
                  isConfirmed={actions.isConfirmed && actions.activeAction === 'pledge'}
                  txHash={actions.activeAction === 'pledge' ? actions.txHash : undefined}
                  error={actions.activeAction === 'pledge' ? actions.error : null}
                  chainId={chainId}
                />

                <DominantAssuranceCard
                  status={campaign.status}
                  totalBonus={campaign.totalBonus}
                  onFundBonus={actions.executeFundBonus}
                  isPending={actions.isWritePending && actions.activeAction === 'bonus'}
                  isConfirming={actions.isConfirming && actions.activeAction === 'bonus'}
                  error={actions.activeAction === 'bonus' ? actions.error : null}
                />
              </div>

              {/* Right Column: Refunds & Beneficiary Collection */}
              <div className="space-y-6">
                <RefundCard
                  status={campaign.status}
                  userPledge={campaign.userPledge}
                  userBonusShare={campaign.userBonusShare}
                  userRefundClaimed={campaign.userRefundClaimed}
                  onClaimRefund={actions.executeRefund}
                  isPending={actions.isWritePending && actions.activeAction === 'refund'}
                  isConfirming={actions.isConfirming && actions.activeAction === 'refund'}
                  isConfirmed={actions.isConfirmed && actions.activeAction === 'refund'}
                  txHash={actions.activeAction === 'refund' ? actions.txHash : undefined}
                  error={actions.activeAction === 'refund' ? actions.error : null}
                  chainId={chainId}
                />

                <BeneficiaryCard
                  status={campaign.status}
                  totalPledged={campaign.totalPledged}
                  totalBonus={campaign.totalBonus}
                  beneficiary={campaign.beneficiary}
                  collected={campaign.collected}
                  onCollect={actions.executeCollect}
                  isPending={actions.isWritePending && actions.activeAction === 'collect'}
                  isConfirming={actions.isConfirming && actions.activeAction === 'collect'}
                  isConfirmed={actions.isConfirmed && actions.activeAction === 'collect'}
                  txHash={actions.activeAction === 'collect' ? actions.txHash : undefined}
                  error={actions.activeAction === 'collect' ? actions.error : null}
                  chainId={chainId}
                />
              </div>
            </div>
          </div>
        )}

        {/* Smart Contract Rules & Transparency Section */}
        <TransparencyExplainer />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#060914] py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-slate-300 text-sm">Stepwell</span>
            <span>—</span>
            <span>Road to Devcon XI (Indore Chapter)</span>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <span>Powered by Ethereum smart contracts</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400 ml-1 inline" />
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <span>Trustless Community Crowdfunding</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline ml-1" />
          </div>
        </div>
      </footer>

      {/* Contract Configuration Modal */}
      <ContractConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        contractAddress={activeContractAddress}
        onUpdateAddress={handleUpdateAddress}
        chainId={chainId}
      />

      {/* Transaction Status Modal */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={actions.clearState}
        title={modalTitle}
        isPending={actions.isWritePending}
        isConfirming={actions.isConfirming}
        isConfirmed={actions.isConfirmed}
        txHash={actions.txHash}
        error={actions.error}
        chainId={chainId}
      />
    </div>
  );
}
