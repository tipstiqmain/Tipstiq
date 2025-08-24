// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PurchaseContract {
    IERC20 public usdcToken;
    uint256 public ethToUsdcRate; // How many USDC per 1 ETH (e.g., 1 ETH = 1000 USDC)

    event UsdcPurchased(address indexed buyer, uint256 ethAmount, uint256 usdcAmount);

    constructor(address _usdcTokenAddress, uint256 _ethToUsdcRate) {
        usdcToken = IERC20(_usdcTokenAddress);
        ethToUsdcRate = _ethToUsdcRate;
    }

    function purchaseUSDC() public payable {
        require(msg.value > 0, "ETH amount must be greater than zero");

        uint256 usdcAmount = (msg.value * ethToUsdcRate) / (10**18); // Convert ETH to USDC based on rate
        require(usdcToken.balanceOf(address(this)) >= usdcAmount, "Not enough USDC in contract");

        usdcToken.transfer(msg.sender, usdcAmount);

        emit UsdcPurchased(msg.sender, msg.value, usdcAmount);
    }

    // Function to receive USDC from the deployer
    function depositUSDC(uint256 amount) public {
        require(usdcToken.transferFrom(msg.sender, address(this), amount), "USDC transfer failed");
    }

    // Function to withdraw ETH (only callable by owner, for simplicity not implemented here)
    // function withdrawETH() public onlyOwner {
    //     payable(msg.sender).transfer(address(this).balance);
    // }
}
