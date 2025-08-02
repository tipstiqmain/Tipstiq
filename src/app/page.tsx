// src/app/page.tsx

'use client'; // This directive is required for client-side components in Next.js App Router

import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'; // Wagmi hooks for account, connect, disconnect, balance
import { injected } from 'wagmi/connectors'; // Import the 'injected' function from wagmi/connectors
import { formatUnits } from 'viem'; // For formatting token balances
import { FanTippingUI } from '../components/FanTippingUI'; // Import FanTippingUI component
import { useState } from 'react'; // Import useState for managing view

export default function Home() {
  // Get account information (address, isConnected status, chainId)
  const { address, isConnected, chainId } = useAccount();
  // Get connect function and available connectors
  const { connect, connectors } = useConnect();
  // Get disconnect function
  const { disconnect } = useDisconnect();
  // Get balance for the connected account (defaults to native currency, e.g., MATIC on Polygon Amoy)
  const { data: balance } = useBalance({ address });

  // Create an instance of the injected connector (MetaMask)
  const injectedConnector = injected();

  // Simulated Creator Wallet Address (replace with actual if integrating)
  // This is the address where tips will be sent.
  const creatorWalletAddress = '0xbFfb0f08C418f74bB0076925B175c0B4D9843EEB'; // Example address

  // State to manage the current view: 'fan' or 'creator'
  const [view, setView] = useState('fan'); // Default to fan view

  // State for creator dashboard (simulated for now)
  const [creatorBalance, setCreatorBalance] = useState(125.50); // Simulated USDC balance
  const [isCashingOut, setIsCashingOut] = useState(false);
  const [cashOutStatus, setCashOutStatus] = useState('');

  // --- Creator Cash-Out Logic (Simulated) ---
  const handleCashOut = async () => {
    if (creatorBalance <= 0) {
      setCashOutStatus('No balance to cash out.');
      return;
    }

    setIsCashingOut(true);
    setCashOutStatus(`Initiating cash out of ${creatorBalance} USDC...`);

    // This is a placeholder for actual fiat off-ramp integration.
    // In a real application, this would involve:
    // 1. A backend service that interacts with a fiat off-ramp (e.g., Circle, Stripe Treasury).
    // 2. The creator's USDC would be sent from their Polygon Amoy wallet to an address
    //    controlled by the off-ramp service, which then converts to fiat.
    // As per our simplified plan, no cross-chain transfer is needed here.

    try {
      // Simulate a successful cash-out
      await new Promise(resolve => setTimeout(() => resolve(), 4000)); // Simulate processing time

      setCashOutStatus(`Successfully cashed out ${creatorBalance} USDC to your linked bank account!`);
      setCreatorBalance(0); // Reset balance after cash out
    } catch (error: any) {
      setCashOutStatus(`Cash out failed: ${error.message}`);
      console.error('Cash out error:', error);
    } finally {
      setIsCashingOut(false);
    }
  };

  // Tailwind CSS classes for consistent styling
  const buttonClasses = "px-6 py-3 rounded-xl font-semibold transition-all duration-300 ease-in-out shadow-lg";
  const primaryButtonClasses = `${buttonClasses} bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75`;
  const secondaryButtonClasses = `${buttonClasses} bg-gray-200 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75`;
  const cardClasses = "bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-900 text-white font-inter">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6 text-purple-400">Tipstiq</h1>

        {/* Header/Navigation for views */}
        <header className="w-full mb-8 flex justify-center space-x-4">
          <button
            onClick={() => setView('fan')}
            className={`${secondaryButtonClasses} ${view === 'fan' ? 'bg-purple-500 text-white' : ''}`}
          >
            Fan View
          </button>
          <button
            onClick={() => setView('creator')}
            className={`${secondaryButtonClasses} ${view === 'creator' ? 'bg-purple-500 text-white' : ''}`}
          >
            Creator View
          </button>
        </header>

        {/* Fan View Section */}
        {view === 'fan' && (
          <div className={cardClasses}>
            <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Tip Your Favorite Creator</h2>

            {/* Wallet Connection Section */}
            <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              {!isConnected ? (
                // Display connect button if not connected
                <button
                  onClick={() => connect({ connector: injectedConnector })} // Connect using the injected connector (MetaMask)
                  className={`${primaryButtonClasses} w-full`}
                >
                  Connect Wallet (MetaMask)
                </button>
              ) : (
                // Display connected wallet info
                <div className="text-center space-y-2">
                  <p className="text-purple-700 font-semibold text-lg">
                    Connected: <span className="font-mono text-green-600 break-all">{address?.substring(0, 6)}...{address?.substring(address.length - 4)}</span>
                  </p>
                  <p className="text-gray-600 text-sm">Chain ID: <span className="font-mono text-blue-500">{chainId}</span></p>
                  {balance && (
                    <p className="text-gray-600 text-sm">
                      MATIC Balance: <span className="font-mono text-yellow-500">
                        {parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(4)} {balance.symbol}
                      </span>
                    </p>
                  )}
                  <button
                    onClick={() => disconnect()}
                    className="mt-2 text-sm text-red-500 hover:text-red-700 underline"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>

            {/* Render FanTippingUI if wallet is connected */}
            {isConnected ? (
              // FanTippingUI will now internally use wagmi's useWalletClient to get the signer
              <FanTippingUI creatorWalletAddress={creatorWalletAddress} />
            ) : (
              <p className="text-center text-gray-500 mt-4">Connect your wallet to send a tip.</p>
            )}
          </div>
        )}

        {/* Creator View Section */}
        {view === 'creator' && (
          <div className={cardClasses}>
            <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Your Creator Dashboard</h2>
            <div className="mb-4 text-center">
              <p className="text-gray-600 text-lg">Current USDC Balance:</p>
              <p className="text-5xl font-extrabold text-purple-800 mt-2">${creatorBalance.toFixed(2)}</p>
            </div>
            <div className="mb-6 text-center">
              <p className="text-gray-600 text-sm">Your Tipstiq Wallet Address:</p>
              <p className="text-sm font-mono bg-gray-100 p-2 rounded-lg inline-block break-all mt-1">
                {creatorWalletAddress}
              </p>
              <button
                onClick={() => {
                  // Using document.execCommand('copy') for clipboard as navigator.clipboard.writeText() might not work in some iFrame environments
                  const el = document.createElement('textarea');
                  el.value = creatorWalletAddress;
                  document.body.appendChild(el);
                  el.select();
                  document.execCommand('copy');
                  document.body.removeChild(el);
                  // Replace alert with a custom modal/toast notification in a production app
                  alert('Address copied to clipboard!');
                }}
                className="ml-2 text-purple-600 hover:text-purple-800 text-sm"
              >
                (Copy)
              </button>
            </div>
            <button
              onClick={handleCashOut}
              className={`${primaryButtonClasses} w-full ${creatorBalance <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isCashingOut || creatorBalance <= 0}
            >
              {isCashingOut ? 'Processing Cash Out...' : 'Cash Out Now'}
            </button>
            {cashOutStatus && (
              <p className={`mt-4 text-center text-sm ${cashOutStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                {cashOutStatus}
              </p>
            )}
            <p className="text-center text-gray-500 text-xs mt-6">
              Note: Actual blockchain and fiat integrations require backend services and API keys. This is a UI demonstration.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
