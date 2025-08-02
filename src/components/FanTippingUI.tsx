// src/components/FanTippingUI.tsx

import React, { useState } from 'react';
import { useWalletClient } from 'wagmi'; // Import useWalletClient for getting the signer
import { ethers } from 'ethers'; // Import ethers for contract interaction
import { USDC_CONTRACT_ADDRESS_AMOY, USDC_MINIMAL_ABI } from '@/lib/usdc'; // Import USDC details

// --- Component Props ---
interface FanTippingUIProps {
  creatorWalletAddress: string; // The creator's wallet address to receive tips
}

// --- Component State ---
type Status = 'idle' | 'sending' | 'success' | 'error';

/**
 * A React component for the "Fan View" that allows a fan to send a USDC tip
 * to a creator on the Polygon Amoy testnet.
 */
export const FanTippingUI: React.FC<FanTippingUIProps> = ({ creatorWalletAddress }) => {
  const [tipAmount, setTipAmount] = useState('5.00');
  const [status, setStatus] = useState<Status>('idle');
  const [txHash, setTxHash] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Use wagmi's useWalletClient to get the connected wallet's client (signer equivalent)
  const { data: walletClient } = useWalletClient();

  // Tailwind CSS classes for consistent styling
  const primaryButtonClasses = "w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors";
  const inputClasses = "p-2 border border-gray-300 rounded-md w-full";


  /**
   * Handles the logic for sending a USDC tip when the user clicks the button.
   */
  const handleSendTip = async () => {
    if (!walletClient) {
      // Use a custom message box instead of alert()
      alert('Please connect your wallet first.');
      return;
    }
    if (!tipAmount || parseFloat(tipAmount) <= 0) {
      // Use a custom message box instead of alert()
      alert('Please enter a valid tip amount.');
      return;
    }
    console.log(`Attempting to send a ${tipAmount} USDC tip to ${creatorWalletAddress}`);
    setStatus('sending');
    setErrorMessage('');
    setTxHash('');

    try {
      // Get the ethers.js signer from the viem walletClient
      // This is a common pattern when using ethers.js with wagmi/viem
      const [account] = await walletClient.getAddresses();
      const provider = new ethers.BrowserProvider(walletClient.transport);
      const signer = await provider.getSigner(account);

      // 1. Instantiate the USDC contract on Polygon Amoy
      const usdcContract = new ethers.Contract(USDC_CONTRACT_ADDRESS_AMOY, USDC_MINIMAL_ABI, signer);

      // 2. Convert the tip amount to its smallest unit (USDC has 6 decimals)
      const amountInSmallestUnit = ethers.parseUnits(tipAmount, 6);

      // 3. Perform the USDC transfer
      console.log('Sending USDC transaction...');
      const tx = await usdcContract.transfer(creatorWalletAddress, amountInSmallestUnit);
      console.log('Transaction sent, waiting for confirmation...', tx.hash);
      setTxHash(tx.hash);

      // 4. Wait for the transaction to be mined
      await tx.wait();

      // 5. Update status to success
      console.log('Transaction confirmed!');
      setStatus('success');
    } catch (error: any) {
      console.error('Failed to send tip:', error);
      setStatus('error');
      // Provide a more user-friendly error message
      setErrorMessage(error.reason || error.message || 'An unknown error occurred during the transaction.');
    }
  };

  return (
    <div className="p-5 font-sans border border-gray-300 rounded-lg max-w-md bg-white shadow-md text-gray-800">
      <h3 className="text-xl font-semibold mb-2">Send a Tip</h3>
      <p className="mb-4 text-sm text-gray-600">Send a tip to: <code className="bg-gray-100 p-1 rounded text-xs">{creatorWalletAddress}</code></p>
      <div className="mb-4">
        <label htmlFor="tipAmountUI" className="block text-sm font-medium text-gray-700 mb-1">
          Amount (USDC):
        </label>
        <input
          type="number"
          id="tipAmountUI"
          value={tipAmount}
          onChange={(e) => setTipAmount(e.target.value)}
          className={inputClasses}
          disabled={status === 'sending'}
        />
      </div>
      <button
        onClick={handleSendTip}
        className={`${primaryButtonClasses} ${status === 'sending' ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={status === 'sending'}
      >
        {status === 'sending' ? 'Sending...' : 'Send Tip'}
      </button>

      {status === 'success' && (
        <p className="mt-4 text-center text-sm text-green-600">
          Tip sent successfully! Tx: <a href={`https://amoy.polygonscan.com/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-green-700 break-all">{txHash.substring(0, 10)}...{txHash.substring(txHash.length - 4)}</a>
        </p>
      )}
      {status === 'error' && (
        <p className="mt-4 text-center text-sm text-red-600">
          Error: {errorMessage}
        </p>
      )}
    </div>
  );
};
