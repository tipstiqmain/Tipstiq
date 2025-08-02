// src/config/chains.ts

import { polygonAmoy } from 'viem/chains';
import { Chain } from 'viem';

// Define Polygon Amoy chain for wagmi/viem.
// This includes the necessary RPC URL and block explorer for the testnet.
export const polygonAmoyChain: Chain = {
  ...polygonAmoy, // Inherit standard properties from viem's polygonAmoy
  id: 80002, // Chain ID for Polygon Amoy
  name: 'Polygon Amoy Testnet',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc-amoy.polygon.technology'], // Official RPC URL for Amoy
    },
  },
  blockExplorers: {
    default: {
      name: 'PolygonScan Amoy',
      url: 'https://amoy.polygonscan.com',
    },
  },
  testnet: true, // Mark as a testnet
};

// Export an array of all chains your app will support
export const chains = [polygonAmoyChain];
