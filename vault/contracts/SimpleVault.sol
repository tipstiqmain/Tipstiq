// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleVault is ERC4626, Ownable {
    constructor(
        IERC20 underlyingAssetAddress,
        string memory name,
        string memory symbol
    )
        ERC20(name, symbol)                 // ERC20 constructor
        ERC4626(underlyingAssetAddress)      // ERC4626 constructor
        Ownable(msg.sender)                  // Ownable constructor (optional in 0.8.0+)
    {}
}
