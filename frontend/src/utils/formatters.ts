import { formatEther } from 'viem';

export function formatEth(wei: bigint | undefined | null, maxDecimals = 4): string {
  if (wei === undefined || wei === null) return '0.0000';
  try {
    const val = parseFloat(formatEther(wei));
    if (val === 0) return '0.0000';
    if (val < 0.0001) return '<0.0001';
    return val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: maxDecimals
    });
  } catch {
    return '0.0000';
  }
}

export function formatAddress(address: string | undefined | null): string {
  if (!address) return '';
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatTimestamp(timestamp: number | bigint | undefined | null): string {
  if (!timestamp) return '—';
  const num = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
  if (num === 0) return '—';
  const date = new Date(num * 1000);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
}

export function formatTimeRemaining(seconds: number | bigint | undefined | null) {
  const total = typeof seconds === 'bigint' ? Number(seconds) : (seconds ?? 0);
  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  return { days, hours, minutes, seconds: secs, isExpired: false };
}

export function etherscanTxLink(hash: string | undefined, chainId = 11155111): string {
  if (!hash) return '#';
  if (chainId === 11155111) {
    return `https://sepolia.etherscan.io/tx/${hash}`;
  }
  return `#local-tx-${hash}`;
}

export function etherscanAddressLink(address: string | undefined, chainId = 11155111): string {
  if (!address) return '#';
  if (chainId === 11155111) {
    return `https://sepolia.etherscan.io/address/${address}`;
  }
  return `#local-address-${address}`;
}
