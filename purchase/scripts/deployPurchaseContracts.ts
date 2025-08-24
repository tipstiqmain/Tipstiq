import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy MockUSDC
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy();
  await mockUSDC.waitForDeployment(); // Use waitForDeployment for Hardhat v3+
  const mockUSDCAddress = await mockUSDC.getAddress(); // Use getAddress for Hardhat v3+
  console.log("MockUSDC deployed to:", mockUSDCAddress);

  // Deploy PurchaseContract
  // Removed: const ethToUsdcRate = ethers.parseUnits("1000", 0); // 1000 USDC per 1 ETH
  const PurchaseContract = await ethers.getContractFactory("PurchaseContract");
  const purchaseContract = await PurchaseContract.deploy(mockUSDCAddress); // Only mockUSDCAddress
  await purchaseContract.waitForDeployment(); // Use waitForDeployment for Hardhat v3+
  const purchaseContractAddress = await purchaseContract.getAddress(); // Use getAddress for Hardhat v3+
  console.log("PurchaseContract deployed to:", purchaseContractAddress);

  // Transfer some MockUSDC to the PurchaseContract
  // Note: decimals() is an async call, so await it
  const amountToTransfer = ethers.parseUnits("100000", await mockUSDC.decimals()); // Transfer 100,000 mUSDC
  await mockUSDC.transfer(purchaseContractAddress, amountToTransfer);
  console.log(`Transferred ${ethers.formatUnits(amountToTransfer, await mockUSDC.decimals())} mUSDC to PurchaseContract`);

  console.log("Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
