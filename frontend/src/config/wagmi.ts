import { http, createConfig } from 'wagmi';
import { sepolia, foundry } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [sepolia, foundry],
  connectors: [
    injected({
      target: 'metaMask',
    }),
    injected()
  ],
  transports: {
    [sepolia.id]: http('https://ethereum-sepolia-rpc.publicnode.com'),
    [foundry.id]: http('http://127.0.0.1:8545')
  }
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
