import { useReadContract, useBalance } from 'wagmi';
import { MEETUP_ASSURANCE_ABI, CampaignStatus } from '../config/contract';

export function useCampaignData(contractAddress: `0x${string}` | undefined, userAddress: `0x${string}` | undefined) {
  const isEnabled = !!contractAddress && contractAddress.length === 42 && contractAddress.startsWith('0x');

  // Campaign Immutable Terms & Global State
  const targetQuery = useReadContract({
    address: isEnabled ? contractAddress : undefined,
    abi: MEETUP_ASSURANCE_ABI,
    functionName: 'target',
    query: { enabled: isEnabled }
  });

  const deadlineQuery = useReadContract({
    address: isEnabled ? contractAddress : undefined,
    abi: MEETUP_ASSURANCE_ABI,
    functionName: 'deadline',
    query: { enabled: isEnabled }
  });

  const beneficiaryQuery = useReadContract({
    address: isEnabled ? contractAddress : undefined,
    abi: MEETUP_ASSURANCE_ABI,
    functionName: 'beneficiary',
    query: { enabled: isEnabled }
  });

  const totalPledgedQuery = useReadContract({
    address: isEnabled ? contractAddress : undefined,
    abi: MEETUP_ASSURANCE_ABI,
    functionName: 'totalPledged',
    query: { enabled: isEnabled }
  });

  const collectedQuery = useReadContract({
    address: isEnabled ? contractAddress : undefined,
    abi: MEETUP_ASSURANCE_ABI,
    functionName: 'collected',
    query: { enabled: isEnabled }
  });

  const statusQuery = useReadContract({
    address: isEnabled ? contractAddress : undefined,
    abi: MEETUP_ASSURANCE_ABI,
    functionName: 'getCampaignStatus',
    query: { enabled: isEnabled }
  });

  const isSuccessfulQuery = useReadContract({
    address: isEnabled ? contractAddress : undefined,
    abi: MEETUP_ASSURANCE_ABI,
    functionName: 'isSuccessful',
    query: { enabled: isEnabled }
  });

  const remainingNeededQuery = useReadContract({
    address: isEnabled ? contractAddress : undefined,
    abi: MEETUP_ASSURANCE_ABI,
    functionName: 'getRemainingAmountNeeded',
    query: { enabled: isEnabled }
  });

  const timeRemainingQuery = useReadContract({
    address: isEnabled ? contractAddress : undefined,
    abi: MEETUP_ASSURANCE_ABI,
    functionName: 'getTimeRemaining',
    query: { enabled: isEnabled }
  });

  const pledgerCountQuery = useReadContract({
    address: isEnabled ? contractAddress : undefined,
    abi: MEETUP_ASSURANCE_ABI,
    functionName: 'getPledgerCount',
    query: { enabled: isEnabled }
  });

  const totalBonusQuery = useReadContract({
    address: isEnabled ? contractAddress : undefined,
    abi: MEETUP_ASSURANCE_ABI,
    functionName: 'totalBonus',
    query: { enabled: isEnabled }
  });

  // User-specific Queries
  const isUserValid = isEnabled && !!userAddress && userAddress.length === 42;

  const userPledgeQuery = useReadContract({
    address: isUserValid ? contractAddress : undefined,
    abi: MEETUP_ASSURANCE_ABI,
    functionName: 'pledges',
    args: isUserValid ? [userAddress] : undefined,
    query: { enabled: isUserValid }
  });

  const userOriginalPledgeQuery = useReadContract({
    address: isUserValid ? contractAddress : undefined,
    abi: MEETUP_ASSURANCE_ABI,
    functionName: 'originalPledges',
    args: isUserValid ? [userAddress] : undefined,
    query: { enabled: isUserValid }
  });

  const userRefundClaimedQuery = useReadContract({
    address: isUserValid ? contractAddress : undefined,
    abi: MEETUP_ASSURANCE_ABI,
    functionName: 'refundClaimed',
    args: isUserValid ? [userAddress] : undefined,
    query: { enabled: isUserValid }
  });

  const userBonusShareQuery = useReadContract({
    address: isUserValid ? contractAddress : undefined,
    abi: MEETUP_ASSURANCE_ABI,
    functionName: 'calculateBonusShare',
    args: isUserValid ? [userAddress] : undefined,
    query: { enabled: isUserValid }
  });

  const contractBalanceQuery = useBalance({
    address: isEnabled ? contractAddress : undefined,
    query: { enabled: isEnabled }
  });

  const refetchAll = async () => {
    await Promise.all([
      targetQuery.refetch(),
      deadlineQuery.refetch(),
      beneficiaryQuery.refetch(),
      totalPledgedQuery.refetch(),
      collectedQuery.refetch(),
      statusQuery.refetch(),
      isSuccessfulQuery.refetch(),
      remainingNeededQuery.refetch(),
      timeRemainingQuery.refetch(),
      pledgerCountQuery.refetch(),
      totalBonusQuery.refetch(),
      userPledgeQuery.refetch(),
      userOriginalPledgeQuery.refetch(),
      userRefundClaimedQuery.refetch(),
      userBonusShareQuery.refetch(),
      contractBalanceQuery.refetch()
    ]);
  };

  const statusNum = statusQuery.data !== undefined ? (Number(statusQuery.data) as CampaignStatus) : CampaignStatus.FUNDING;

  return {
    target: targetQuery.data,
    deadline: deadlineQuery.data,
    beneficiary: beneficiaryQuery.data,
    totalPledged: totalPledgedQuery.data,
    collected: collectedQuery.data,
    status: statusNum,
    isSuccessful: isSuccessfulQuery.data ?? false,
    remainingNeeded: remainingNeededQuery.data,
    timeRemaining: timeRemainingQuery.data,
    pledgerCount: pledgerCountQuery.data ? Number(pledgerCountQuery.data) : 0,
    totalBonus: totalBonusQuery.data,
    contractBalance: contractBalanceQuery.data?.value,
    userPledge: userPledgeQuery.data ?? 0n,
    userOriginalPledge: userOriginalPledgeQuery.data ?? 0n,
    userRefundClaimed: userRefundClaimedQuery.data ?? false,
    userBonusShare: userBonusShareQuery.data ?? 0n,
    isLoading: targetQuery.isLoading || totalPledgedQuery.isLoading,
    isError: targetQuery.isError,
    refetchAll
  };
}
