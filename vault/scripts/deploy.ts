import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts from:", deployer.address);

  // Deploy the TestCoin (ERC20) first
  const TestCoin = await ethers.getContractFactory("TestCoin");
  const testCoin = await TestCoin.deploy();
  await testCoin.deployed();
  console.log("TestCoin deployed to:", testCoin.address);

  // Deploy the SimpleVault using TestCoin as the underlying asset
  const vaultName = "SimpleVault Token";
  const vaultSymbol = "SVT";

  const SimpleVault = await ethers.getContractFactory("SimpleVault");
  const simpleVault = await SimpleVault.deploy(
    testCoin.address,
    vaultName,
    vaultSymbol
  );

  await simpleVault.deployed();
  console.log("SimpleVault deployed to:", simpleVault.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
