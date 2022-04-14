// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PlayToken.sol";

// on OpenZeppelin docs: https://docs.openzeppelin.com/contracts/4.x/api/access#Ownable
import "@openzeppelin/contracts/access/Ownable.sol";

// Inspired by OraclizeAPI's implementation - MIT licence
// https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol
import "@openzeppelin/contracts/utils/Strings.sol";

contract Vendor is Ownable {
    uint256 public minValue = 1; // 1 token
    uint256 public sumPlayersMoney = 0;
    uint256 modulus = 6;
    uint256 randNonce = 0;

    struct Game {
        uint256 result;
        uint256 randNumber1;
        uint256 randNumber2;
        uint256 randNumber3;
    }

    mapping(address => uint256) winnerBalance;
    mapping(address => Game[]) gamesResult;

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
     * @notice Allow Owner to change Min Value
     */
    function changeMinValue(uint256 newMinValue) public onlyOwner {
        minValue = newMinValue * (1 ether);
    }

    /**
     * @notice Returns how much is left in the slot machine
     */
    function getBalanceSlots() public view returns (uint256) {
        return playToken.balanceOf(address(this));
    }

    /**
     * @notice Returns how many tokens any given player has
     */
    function getPlayerBalance() public view returns (uint256) {
        return playToken.balanceOf(msg.sender);
    }

    /**
     * @notice Allow Owner to add more tokens 
     (Dont know if this is possible with the way
     we currently have the token minting so empty for now)
     */
    function deposit() public payable onlyOwner {}

    /**
     * @notice Returns the most recent game
     */
    function getLastPlayerGame() public view returns (uint256, uint256, uint256, uint256) {
        uint256 length = gamesResult[msg.sender].length - 1;
        
        return (
            gamesResult[msg.sender][length].result,
            gamesResult[msg.sender][length].randNumber1,
            gamesResult[msg.sender][length].randNumber2,
            gamesResult[msg.sender][length].randNumber3
        );
    }

    /**
     * @notice Not-so-good Random Value Generator
     */
    function randomValue() private view returns (uint256) {
        uint256 seed = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp +
                        block.difficulty +
                        randNonce +
                        ((
                            uint256(keccak256(abi.encodePacked(block.coinbase)))
                        ) / (block.timestamp)) +
                        block.gaslimit +
                        ((uint256(keccak256(abi.encodePacked(msg.sender)))) /
                            (block.timestamp)) +
                        block.number
                )
            )
        );

        return (seed - ((seed / modulus) * modulus));
    }

    /**
     * @notice Calculates The Prize
     */
    function calculatePrize( uint256 rand1, uint256 rand2, uint256 rand3) 
      private view returns (uint256) {
        if (rand1 == 6 && rand2 == 6 && rand3 == 6) {
            return minValue * 5;
        } else if (rand1 == 5 && rand2 == 5 && rand3 == 5) {
            return minValue * 3;
        } else if (rand1 == 4 && rand2 == 4 && rand3 == 4) {
            return minValue * 3;
        } else if (rand1 == 3 && rand2 == 3 && rand3 == 3) {
            return minValue * 3;
        } else if (rand1 == 2 && rand2 == 2 && rand3 == 2) {
            return minValue * 3;
        } else if (rand1 == 1 && rand2 == 1 && rand3 == 1) {
            return minValue * 3;
        } else if ((rand1 == rand2) || (rand1 == rand3) || (rand2 == rand3)) {
            return minValue;
        } else {
            return 0;
        }
    }

    /**
     * @notice Allows user to bet X num of tokens
     */
    function spin(uint bet) public {
        uint256 userBal = playToken.balanceOf(msg.sender);
        require(userBal >= bet, "You Don't Have Enough Tokens");
        require(minValue <= bet, "Bet must Exceed The Minimum Bet");

        uint256 randNumber1 = randomValue();
        randNonce += 1;
        uint256 randNumber2 = randomValue();
        randNonce += 1;
        uint256 randNumber3 = randomValue();
        randNonce += 1;
        uint256 result = calculatePrize(randNumber1, randNumber2, randNumber3);
        if (result == 0) { // not a winner
            bool sent = playToken.transferFrom(msg.sender, address(this), bet);
            require(sent, "Could not Withdaw tokens");
        } else { // a winner
            winnerBalance[msg.sender] += result;
            sumPlayersMoney += result;
        }
        gamesResult[msg.sender].push(
            Game(result, randNumber1, randNumber2, randNumber3)
        );
    }

    /**
     * @notice Allows user to withdraw their winnings
     Converts tokens to ETH
     */
    function withdrawWinnings() public {}

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
