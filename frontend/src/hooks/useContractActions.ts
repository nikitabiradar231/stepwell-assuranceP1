import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { MEETUP_ASSURANCE_ABI } from '../config/contract';

export function useContractActions(
  contractAddress: `0x${string}` | undefined,
  onSuccessCallback?: () => void
) {
  const [activeAction, setActiveAction] = useState<'pledge' | 'refund' | 'collect' | 'bonus' | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const {
    data: hash,
    error: writeError,
    isPending: isWritePending,
    writeContractAsync,
    reset: resetWrite
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError
  } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash
    }
  });

  const clearState = () => {
    setActiveAction(null);
    setActionError(null);
    resetWrite();
  };

  const executePledge = async (ethAmount: string) => {
    if (!contractAddress) {
      setActionError('Contract address is not configured.');
      return;
    }
    try {
      setActionError(null);
      setActiveAction('pledge');
      const val = parseEther(ethAmount);
      if (val <= 0n) {
        setActionError('Please enter an amount greater than 0 ETH.');
        return;
      }
      await writeContractAsync({
        address: contractAddress,
        abi: MEETUP_ASSURANCE_ABI,
        functionName: 'pledge',
        value: val
      });
      onSuccessCallback?.();
    } catch (err: any) {
      console.error('Pledge error:', err);
      setActionError(formatError(err));
    }
  };

  const executeRefund = async () => {
    if (!contractAddress) {
      setActionError('Contract address is not configured.');
      return;
    }
    try {
      setActionError(null);
      setActiveAction('refund');
      await writeContractAsync({
        address: contractAddress,
        abi: MEETUP_ASSURANCE_ABI,
        functionName: 'claimRefund'
      });
      onSuccessCallback?.();
    } catch (err: any) {
      console.error('Refund error:', err);
      setActionError(formatError(err));
    }
  };

  const executeCollect = async () => {
    if (!contractAddress) {
      setActionError('Contract address is not configured.');
      return;
    }
    try {
      setActionError(null);
      setActiveAction('collect');
      await writeContractAsync({
        address: contractAddress,
        abi: MEETUP_ASSURANCE_ABI,
        functionName: 'collect'
      });
      onSuccessCallback?.();
    } catch (err: any) {
      console.error('Collect error:', err);
      setActionError(formatError(err));
    }
  };

  const executeFundBonus = async (ethAmount: string) => {
    if (!contractAddress) {
      setActionError('Contract address is not configured.');
      return;
    }
    try {
      setActionError(null);
      setActiveAction('bonus');
      const val = parseEther(ethAmount);
      await writeContractAsync({
        address: contractAddress,
        abi: MEETUP_ASSURANCE_ABI,
        functionName: 'fundBonus',
        value: val
      });
      onSuccessCallback?.();
    } catch (err: any) {
      console.error('FundBonus error:', err);
      setActionError(formatError(err));
    }
  };

  return {
    activeAction,
    txHash: hash,
    isWritePending,
    isConfirming,
    isConfirmed,
    error: actionError || (writeError ? formatError(writeError) : null) || (receiptError ? 'Transaction failed onchain.' : null),
    executePledge,
    executeRefund,
    executeCollect,
    executeFundBonus,
    clearState
  };
}

function formatError(err: any): string {
  const msg = err?.message || err?.shortMessage || String(err);
  if (msg.includes('User rejected') || msg.includes('user rejected') || msg.includes('ACTION_REJECTED')) {
    return 'Transaction rejected in wallet.';
  }
  if (msg.includes('CampaignEnded')) {
    return 'Campaign deadline has passed. Pledging is closed.';
  }
  if (msg.includes('CampaignStillActive')) {
    return 'Campaign is still active. Action unavailable before deadline.';
  }
  if (msg.includes('TargetNotReached')) {
    return 'Campaign target was not reached.';
  }
  if (msg.includes('CampaignSucceeded')) {
    return 'Campaign succeeded. Refunds are not permitted.';
  }
  if (msg.includes('NoRefundableContribution')) {
    return 'No refundable contribution found for this address.';
  }
  if (msg.includes('AlreadyCollected')) {
    return 'Campaign funds have already been collected.';
  }
  if (msg.includes('OnlyBeneficiary')) {
    return 'Only the designated beneficiary can collect funds.';
  }
  if (msg.includes('insufficient funds')) {
    return 'Insufficient ETH balance in your wallet to cover pledge and gas.';
  }
  return msg.length > 120 ? `${msg.slice(0, 120)}...` : msg;
}
