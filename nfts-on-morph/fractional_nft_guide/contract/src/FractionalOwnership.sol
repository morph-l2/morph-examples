// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FractionalOwnership is  ERC20 {
    uint256 public totalShares;
    address public owner;

    modifier onlyOwner () {
        require(msg.sender == owner, "Not owner");

        _;
    }

    constructor(string memory name, string memory symbol, uint256 totalShares_) ERC20(name, symbol) {
        totalShares = totalShares_;
        _mint(msg.sender, totalShares_);
        owner = msg.sender;
    }

    function transferShares(address to, uint256 shares) external onlyOwner {
        _transfer(owner, to, shares);
    }
}
