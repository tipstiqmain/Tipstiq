// src/lib/usdc.ts

// The official USDC contract address on the Polygon Amoy testnet.
// This is a fixed address for the testnet USDC (amUSDC).
export const USDC_CONTRACT_ADDRESS_AMOY = "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582";

/**
 * A minimal Application Binary Interface (ABI) for an ERC-20 token.
 * This includes only the `transfer` function, which is all we need to send USDC.
 * It also includes `decimals()` to correctly parse the amount.
 */
export const USDC_MINIMAL_ABI = [
  {
    "name": "transfer",
    "type": "function",
    "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }],
    "outputs": [{ "name": "", "type": "bool" }]
  },
  {
    "name": "decimals",
    "type": "function",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint8" }],
    "stateMutability": "view"
  }
];
