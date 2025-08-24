// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PurchaseContract {
    IERC20 public usdcToken;
    // Removed: uint256 public ethToUsdcRate;

    // Modified event to reflect USDC purchase and fee
    event UsdcPurchased(address indexed buyer, uint256 usdcAmountPurchased, uint256 feeAmount);

    // Modified constructor
    constructor(address _usdcTokenAddress) {
        usdcToken = IERC20(_usdcTokenAddress);
    }

    // Modified purchaseUSDC function
    function purchaseUSDC(uint256 _usdcAmountToPurchase, uint256 _feeInUsdc) public {
        require(_usdcAmountToPurchase > 0, "USDC amount to purchase must be greater than zero");

        uint256 totalUsdcToTransfer = _usdcAmountToPurchase + _feeInUsdc;

        // Pull USDC from the sender's wallet
        require(usdcToken.transferFrom(msg.sender, address(this), totalUsdcToTransfer), "USDC transfer failed");

        // Transfer the purchased USDC to the buyer
        require(usdcToken.transfer(msg.sender, _usdcAmountToPurchase), "Failed to transfer purchased USDC");

        // The _feeInUsdc remains in the contract's balance

        emit UsdcPurchased(msg.sender, _usdcAmountToPurchase, _feeInUsdc);
    }

    // Function to receive USDC from the deployer (remains the same)
    function depositUSDC(uint256 amount) public {
        require(usdcToken.transferFrom(msg.sender, address(this), amount), "USDC transfer failed");
    }

    // Function to withdraw ETH (not applicable anymore, can be removed or modified to withdraw USDC)
    // For now, I'll comment it out as it's not implemented and ETH is no longer the primary asset.
    // function withdrawETH() public onlyOwner {
    //     payable(msg.sender).transfer(address(this).balance);
    // }
}
