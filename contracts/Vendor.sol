// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PlayToken.sol";

// on OpenZeppelin docs: https://docs.openzeppelin.com/contracts/4.x/api/access#Ownable
import "@openzeppelin/contracts/access/Ownable.sol";

contract Vendor is Ownable {
    // Our Token Contract
    PLYToken playToken;

    // token price for ETH (this can change ofc to be variable based on jackpot amount)
    uint256 public tokensPerEth = 100;

    // Event that log buy operation
    event BuyTokens(address buyer, uint256 amountOfETH, uint256 amountOfTokens);

    constructor(address _plyTokenAddress) {
        playToken = PLYToken(_plyTokenAddress);
    }

    /**
     * @notice Allow users to buy token for ETH
     */
    function buyTokens() public payable returns (uint256 tokenAmount) {
        require(msg.value > 0, "Send ETH to buy some tokens");
        uint256 amountToBuy = (msg.value / 10**18) * tokensPerEth;

        uint256 bal = playToken.balanceOf(address(this));
        require(bal >= amountToBuy, "Ran out of tokens");

        bool sent = playToken.transfer(msg.sender, amountToBuy);
        require(sent, "Could not send tokens");

        emit BuyTokens(msg.sender, msg.value, amountToBuy);
        return amountToBuy;
    }

    /**
     * @notice Allow the owner of the contract to withdraw ETH
     */
    function withdraw() public onlyOwner {
        uint256 ownerBalance = address(this).balance;
        require(ownerBalance > 0, "Owner has not balance to withdraw");

        (bool sent, ) = msg.sender.call{value: address(this).balance}("");
        require(sent, "Failed to send user balance back to the owner");
    }
}
