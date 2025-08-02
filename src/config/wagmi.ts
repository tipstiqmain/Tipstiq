// src/config/wagmi.ts

import { createConfig, http } from 'wagmi';
import { injected, metaMask, walletConnect } from 'wagmi/connectors'; // Import common connectors
import { polygonAmoyChain } from './chains'; // Import our custom Polygon Amoy chain definition

// Define the chains your application will support.
// For Tipstiq, we are focusing on Polygon Amoy Testnet.
export const config = createConfig({
  chains: [polygonAmoyChain], // Only Polygon Amoy for now, as per our simplified plan
  connectors: [
    injected(), // Auto-detects and connects to browser injected wallets (e.g., MetaMask)
    metaMask(), // Explicitly connect to MetaMask
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '' }), // WalletConnect for mobile/other wallets
  ],
  transports: {
    // Define how to connect to each chain's RPC endpoint
    [polygonAmoyChain.id]: http(polygonAmoyChain.rpcUrls.default.http[0]),
  },
});
