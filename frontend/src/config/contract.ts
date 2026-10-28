export const MEETUP_ASSURANCE_ABI = [
  {
    type: 'constructor',
    inputs: [
      { name: '_target', type: 'uint256', internalType: 'uint256' },
      { name: '_deadline', type: 'uint256', internalType: 'uint256' },
      { name: '_beneficiary', type: 'address', internalType: 'address payable' }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'pledge',
    inputs: [],
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    name: 'collect',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'claimRefund',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    name: 'fundBonus',
    inputs: [],
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    name: 'target',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'deadline',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'beneficiary',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address payable' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'totalPledged',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'collected',
    inputs: [],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'pledges',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'originalPledges',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'refundClaimed',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'totalBonus',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'totalBonusClaimed',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'totalRefundedPledges',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'bonusFunder',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getCampaignStatus',
    inputs: [],
    outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'isSuccessful',
    inputs: [],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getRemainingAmountNeeded',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getTimeRemaining',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getParticipantContribution',
    inputs: [{ name: 'participant', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getPledgerCount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'getPledgers',
    inputs: [],
    outputs: [{ name: '', type: 'address[]', internalType: 'address[]' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'calculateBonusShare',
    inputs: [{ name: 'participant', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'event',
    name: 'Pledged',
    inputs: [
      { name: 'pledger', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'Collected',
    inputs: [
      { name: 'beneficiary', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'RefundClaimed',
    inputs: [
      { name: 'pledger', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'BonusFunded',
    inputs: [
      { name: 'funder', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false }
    ],
    anonymous: false
  },
  {
    type: 'event',
    name: 'BonusClaimed',
    inputs: [
      { name: 'pledger', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false }
    ],
    anonymous: false
  },
  {
    type: 'error',
    name: 'TargetMustBeGreaterThanZero',
    inputs: []
  },
  {
    type: 'error',
    name: 'DeadlineMustBeInFuture',
    inputs: []
  },
  {
    type: 'error',
    name: 'BeneficiaryCannotBeZeroAddress',
    inputs: []
  },
  {
    type: 'error',
    name: 'ZeroValuePledge',
    inputs: []
  },
  {
    type: 'error',
    name: 'CampaignEnded',
    inputs: []
  },
  {
    type: 'error',
    name: 'CampaignStillActive',
    inputs: []
  },
  {
    type: 'error',
    name: 'TargetNotReached',
    inputs: []
  },
  {
    type: 'error',
    name: 'CampaignSucceeded',
    inputs: []
  },
  {
    type: 'error',
    name: 'AlreadyCollected',
    inputs: []
  },
  {
    type: 'error',
    name: 'OnlyBeneficiary',
    inputs: []
  },
  {
    type: 'error',
    name: 'NoRefundableContribution',
    inputs: []
  },
  {
    type: 'error',
    name: 'TransferFailed',
    inputs: []
  },
  {
    type: 'error',
    name: 'DirectTransfersNotAllowed',
    inputs: []
  },
  {
    type: 'error',
    name: 'ZeroValueBonus',
    inputs: []
  }
] as const;

export const CampaignStatus = {
  FUNDING: 0,
  SUCCESS: 1,
  FAILED: 2,
  COMPLETED: 3
} as const;

export type CampaignStatus = (typeof CampaignStatus)[keyof typeof CampaignStatus];

export const CAMPAIGN_STATUS_LABELS: Record<CampaignStatus, { label: string; color: string; desc: string }> = {
  [CampaignStatus.FUNDING]: {
    label: 'FUNDING ACTIVE',
    color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    desc: 'Pledging is open! Target not yet finalized until deadline passes.'
  },
  [CampaignStatus.SUCCESS]: {
    label: 'CAMPAIGN SUCCESS',
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    desc: 'Target reached! Funds ready for beneficiary collection.'
  },
  [CampaignStatus.FAILED]: {
    label: 'CAMPAIGN FAILED',
    color: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    desc: 'Target not reached. Every pledger can independently claim full refund + bonus.'
  },
  [CampaignStatus.COMPLETED]: {
    label: 'FUNDS COLLECTED',
    color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    desc: 'Beneficiary has collected campaign funds. Venue confirmed!'
  }
};

export interface DeploymentConfig {
  address: `0x${string}` | '';
  chainId: number;
  networkName: string;
}

export const DEFAULT_SEPOLIA_ADDRESS: `0x${string}` | '' = '';
export const DEFAULT_ANVIL_ADDRESS: `0x${string}` | '' = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
