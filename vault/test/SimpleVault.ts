import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { TestCoin } from "../types/ethers-contracts/TestCoin";
import { SimpleVault } from "../types/ethers-contracts/SimpleVault";

describe("SimpleVault", function () {
  let owner: SignerWithAddress;
  let user: SignerWithAddress;
  let testCoin: TestCoin;
  let vault: SimpleVault;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    const TestCoinFactory = await ethers.getContractFactory("TestCoin");
    testCoin = (await TestCoinFactory.deploy()) as TestCoin;
    await testCoin.deployed();

    const SimpleVaultFactory = await ethers.getContractFactory("SimpleVault");
    vault = (await SimpleVaultFactory.deploy(
      testCoin.address,
      "Vault Token",
      "VT"
    )) as SimpleVault;
    await vault.deployed();
  });

  it("should deposit and withdraw", async function () {
    const depositAmount = ethers.utils.parseEther("100");

    // Mint some test coins for the user
    await testCoin.mint(user.address, depositAmount);
    expect(await testCoin.balanceOf(user.address)).to.equal(depositAmount);

    // Approve the vault to spend the user's test coins
    await testCoin.connect(user).approve(vault.address, depositAmount);

    // Deposit test coins into the vault
    await vault.connect(user).deposit(depositAmount, user.address);

    // Check the user's share balance
    const shares = await vault.balanceOf(user.address);
    expect(shares).to.be.gt(0);
    expect(shares).to.equal(depositAmount); // For a simple vault with no fees and 1:1 share ratio

    // Withdraw test coins from the vault
    await vault.connect(user).withdraw(shares, user.address, user.address);

    // Check the user's test coin balance
    expect(await testCoin.balanceOf(user.address)).to.equal(depositAmount);
  });
});
