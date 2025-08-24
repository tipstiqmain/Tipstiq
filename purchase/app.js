// Contract Addresses (replace with your deployed addresses)
const MOCK_USDC_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // REPLACE WITH YOUR DEPLOYED MOCK_USDC ADDRESS
const PURCHASE_CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // REPLACE WITH YOUR DEPLOYED PURCHASE_CONTRACT ADDRESS

let fees = []; // To store the loaded fees

// Function to load fees from fees.json and populate the modal
const loadFees = async () => {
    try {
        const response = await fetch('fees.json'); // Assuming fees.json is in the same directory
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        fees = await response.json();
        // Sort fees by threshold in ascending order
        fees.sort((a, b) => a.threshold - b.threshold);
        console.log("Fees loaded:", fees);

        const feeTableBody = document.getElementById('feeTableBody');
        feeTableBody.innerHTML = ''; // Clear existing table rows

        fees.forEach(feeItem => {
            const row = document.createElement('tr');
            const conditionCell = document.createElement('td');
            const feeCell = document.createElement('td');

            if (feeItem.threshold === 0) {
                conditionCell.textContent = `For any amount`;
            } else {
                conditionCell.textContent = `For purchases of ${feeItem.threshold} USDC or more`;
            }
            
            feeCell.textContent = `${feeItem.fee.toFixed(2)}`;
            
            row.appendChild(conditionCell);
            row.appendChild(feeCell);
            feeTableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error loading fees:", error);
        statusMessage.textContent = "Failed to load fee structure.";
        const feeTableBody = document.getElementById('feeTableBody');
        feeTableBody.innerHTML = '<tr><td colspan="2">Failed to load fee details.</td></tr>'; // Display error in table
    }
};

// Function to get fee based on USDC amount
const getFee = (usdcAmount) => {
    let applicableFee = 0;
    for (let i = fees.length - 1; i >= 0; i--) {
        if (usdcAmount >= fees[i].threshold) {
            applicableFee = fees[i].fee;
            break;
        }
    }
    return applicableFee;
};

// ABIs (replace with your compiled ABIs from vault/artifacts/contracts)
const MOCK_USDC_ABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "allowance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "needed",
          "type": "uint256"
        }
      ],
      "name": "ERC20InsufficientAllowance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "balance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "needed",
          "type": "uint256"
        }
      ],
      "name": "ERC20InsufficientBalance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "approver",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidApprover",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidSender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidSpender",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
];

const PURCHASE_CONTRACT_ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_usdcTokenAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_ethToUsdcRate",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "ethAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "usdcAmount",
          "type": "uint256"
        }
      ],
      "name": "UsdcPurchased",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "depositUSDC",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "ethToUsdcRate",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "purchaseUSDC",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "usdcToken",
      "outputs": [
        {
          "internalType": "contract IERC20",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
];

// UI Elements
const connectWalletBtn = document.getElementById("connectWalletBtn");
const walletInfo = document.getElementById("walletInfo");
const purchaseSection = document.getElementById("purchaseSection");
const usdcAmountInput = document.getElementById("usdcAmount"); // Changed from ethAmount
const purchaseUsdcBtn = document.getElementById("purchaseUsdcBtn");
const statusMessage = document.getElementById("statusMessage");
const usdcAmountDisplay = document.getElementById("usdcAmountDisplay");
const feeDisplay = document.getElementById("feeDisplay");


let provider;
let signer;
let mockUsdcContract;
let purchaseContract;

// Function to update the displayed USDC amount and fee
const updateDisplay = async () => {
    const usdcAmount = parseFloat(usdcAmountInput.value); // Changed from ethAmount
    if (isNaN(usdcAmount) || usdcAmount <= 0 || !purchaseContract) {
        usdcAmountDisplay.textContent = "";
        feeDisplay.textContent = "";
        return;
    }

    try {
        const feeInUsd = getFee(usdcAmount);
        const totalUsdcToSend = usdcAmount + feeInUsd;

        usdcAmountDisplay.textContent = `You will purchase ${usdcAmount.toFixed(2)} USDC`;
        feeDisplay.textContent = `Fee: ${feeInUsd.toFixed(2)} USD (Total: ${totalUsdcToSend.toFixed(2)} USDC)`;
    } catch (error) {
        console.error("Error updating display:", error);
        usdcAmountDisplay.textContent = "Error calculating USDC amount.";
        feeDisplay.textContent = "Error calculating fee.";
    }
};

// Function to connect wallet
const connectWallet = async () => {
    if (window.ethereum) {
        try {
            provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = await provider.getSigner(); // Await signer assignment
            const address = await signer.getAddress();
            walletInfo.textContent = `Connected: ${address}`;
            purchaseSection.classList.remove("hidden");

            // Initialize contract instances
            mockUsdcContract = new ethers.Contract(MOCK_USDC_ADDRESS, MOCK_USDC_ABI, signer);
            purchaseContract = new ethers.Contract(PURCHASE_CONTRACT_ADDRESS, PURCHASE_CONTRACT_ABI, signer);

            updateDisplay(); // Update display after connecting wallet and loading fees

            // Listen for account changes
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);

        } catch (error) {
            console.error("Error connecting wallet:", error);
            statusMessage.textContent = "Failed to connect wallet.";
        }
    } else {
        statusMessage.textContent = "Please install MetaMask!";
    }
};

// Handle accounts changed
const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
        // Wallet disconnected
        walletInfo.textContent = "Wallet not connected.";
        purchaseSection.classList.add("hidden");
        signer = null;
        mockUsdcContract = null;
        purchaseContract = null;
        updateDisplay(); // Clear display on disconnect
    } else {
        // Account changed, re-initialize signer and contracts
        connectWallet();
    }
};

// Handle chain changed
const handleChainChanged = (chainId) => {
    // Reload the page to re-initialize everything for the new chain
    window.location.reload();
};

// Function to purchase USDC
const purchaseUSDC = async () => {
    const usdcAmount = parseFloat(usdcAmountInput.value); // Changed from ethAmount
    if (isNaN(usdcAmount) || usdcAmount <= 0) {
        statusMessage.textContent = "Please enter a valid USDC amount.";
        return;
    }

    try {
        statusMessage.textContent = "Initiating purchase...";

        const feeInUsd = getFee(usdcAmount);
        const totalUsdcToSend = usdcAmount + feeInUsd;

        console.log(`Attempting to purchase ${usdcAmount} USDC with a fee of ${feeInUsd} USD. Total USDC to send: ${totalUsdcToSend}.`);

        // Approve the PurchaseContract to spend USDC
        statusMessage.textContent = `Approving ${totalUsdcToSend.toFixed(2)} USDC for the contract...`;
        const usdcDecimals = await mockUsdcContract.decimals();
        const amountToApprove = ethers.parseUnits(totalUsdcToSend.toString(), usdcDecimals);
        const approveTx = await mockUsdcContract.approve(PURCHASE_CONTRACT_ADDRESS, amountToApprove);
        await approveTx.wait();
        statusMessage.textContent = "Approval successful. Proceeding with purchase...";

        // Call the purchaseUSDC function on the PurchaseContract
        const usdcAmountWei = ethers.parseUnits(usdcAmount.toString(), usdcDecimals);
        const feeInUsdWei = ethers.parseUnits(feeInUsd.toString(), usdcDecimals);

        const tx = await purchaseContract.purchaseUSDC(usdcAmountWei, feeInUsdWei);
        statusMessage.textContent = `Transaction sent: ${tx.hash}. Waiting for confirmation...`;

        await tx.wait();
        statusMessage.textContent = "USDC purchased successfully!";

    } catch (error) {
        console.error("Error purchasing USDC:", error);
        statusMessage.textContent = `Purchase failed: ${error.message || error.code}`; // Display more specific error
    }
};

// Event Listeners
connectWalletBtn.addEventListener("click", connectWallet);
purchaseUsdcBtn.addEventListener("click", purchaseUSDC);
usdcAmountInput.addEventListener("input", updateDisplay); // Changed from ethAmountInput

// Initial check on load
document.addEventListener('DOMContentLoaded', () => {
    loadFees();
    if (window.ethereum && window.ethereum.isConnected()) {
        connectWallet();
    }
});