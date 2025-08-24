import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy MockUSDC
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy();
  const mockUSDCAddress = mockUSDC.address;
  console.log("MockUSDC deployed to:", mockUSDCAddress);

  // Deploy PurchaseContract
  // For example, 1 ETH = 1000 USDC (assuming USDC has 18 decimals)
  const ethToUsdcRate = ethers.utils.parseUnits("1000", 0); // 1000 USDC per 1 ETH
  const PurchaseContract = await ethers.getContractFactory("PurchaseContract");
  const purchaseContract = await PurchaseContract.deploy(mockUSDCAddress, ethToUsdcRate);
  const purchaseContractAddress = purchaseContract.address;
  console.log("PurchaseContract deployed to:", purchaseContractAddress);

  // Transfer some MockUSDC to the PurchaseContract
  const amountToTransfer = ethers.utils.parseUnits("100000", await mockUSDC.decimals()); // Transfer 100,000 mUSDC
  await mockUSDC.transfer(purchaseContractAddress, amountToTransfer);
  console.log(`Transferred ${ethers.utils.formatUnits(amountToTransfer, await mockUSDC.decimals())} mUSDC to PurchaseContract`);

  console.log("Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
