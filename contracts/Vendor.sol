// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PlayToken.sol";

// on OpenZeppelin docs: https://docs.openzeppelin.com/contracts/4.x/api/access#Ownable
import "@openzeppelin/contracts/access/Ownable.sol";

// Inspired by OraclizeAPI's implementation - MIT licence
// https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol
import "@openzeppelin/contracts/utils/Strings.sol";

contract Vendor is Ownable {
    uint256 randNonce = 0;
    uint256 public constant minEthBal = 1 ether / 100;

    struct Game {
        bool result;
        uint256[3] results;
    }

    mapping(address => Game[]) userGameResults;

    /**
     * @notice Our Custom Token
     */
    PLYToken internal playToken;

    /**
     * @notice token price for ETH 
     (this can change ofc to be variable based on jackpot amount)
     */
    uint256 public tokensPerEth = 100;

    /**
     * @notice Event that log buy operation
     */
    event BuyTokens(address buyer, uint256 amountOfETH, uint256 amountOfTokens);
    event SellTokens(
        address seller,
        uint256 amountOfTokens,
        uint256 amountOfETH
    );
    event Spin(Game);
    event Received(address, uint256);

    constructor(address _plyTokenAddress) payable {
        playToken = PLYToken(_plyTokenAddress);
    }

    /**
     * @notice Returns play token bal for vendor
     */
    function getBalanceToken() public view returns (uint256) {
        return playToken.balanceOf(address(this));
    }

    /**
     * @notice Returns ETH bal for vendor
     */
    function getBalanceETH() public view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Returns the jackpot ammount
     */
    function getJackpotAmount() public view returns (uint256) {
        if (getBalanceETH() > minEthBal) {
            return getBalanceETH() - minEthBal;
        }
        return 0;
    }

    /**
     * @notice Returns the user's previous game results
     */
    function getUserGameResults() public view returns (Game[] memory) {
        return userGameResults[msg.sender];
    }

    /**
     * @notice Not-so-good Random Value Generator between 1-10
     */
    function getRandomNumbers() private returns (uint256[3] memory) {
        uint256 randNum = uint256(
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
        randNonce++;
        uint256 randNum2 = (randNum % 128) % 10;
        uint256 randNum3 = (randNum % 256) % 10;
        return [randNum % 10, randNum2, randNum3];
    }

    /**
     * @notice checks if all numbers the same
     */
    function evaluateSpin(uint256[3] memory result)
        private
        pure
        returns (bool)
    {
        if (result[0] == result[1]) {
            if (result[0] == result[2]) {
                return true;
            }
        }
        return false;
    }

    /**
     * @notice Allows user to bet X num of tokens
     */
    function spin(uint256 amountOfTokens) public {
        require(getBalanceETH() > minEthBal, "There's nothing to win!");
        uint256 userBal = playToken.balanceOf(msg.sender);
        require(userBal >= amountOfTokens, "You Don't Have Enough Tokens");

        uint256 allowance = playToken.allowance(msg.sender, address(this));
        require(allowance >= amountOfTokens, "Check the token allowance");

        // Get users tokens
        bool sent = playToken.transferFrom(
            msg.sender,
            address(this),
            amountOfTokens
        );
        require(sent, "Could not Transfer tokens");

        uint256[3] memory spinResult = getRandomNumbers();
        bool winner = evaluateSpin(spinResult);
        Game memory res = Game(winner, spinResult);
        if (winner) {
            uint256 amountOfEthToTransfer = getJackpotAmount();
            payable(msg.sender).transfer(amountOfEthToTransfer);
        }
        userGameResults[msg.sender].push(res);
        emit Spin(res);
    }

    /**
     * @notice Allow users to buy token for ETH
     */
    function buyTokens() public payable returns (uint256 tokenAmount) {
        require(msg.value > 0, "Send at least .01 ETH to buy some tokens");
        uint256 amountToBuy = (msg.value * tokensPerEth);

        uint256 bal = playToken.balanceOf(address(this));
        require(bal >= amountToBuy, "Ran out of tokens");

        bool sent = playToken.transfer(msg.sender, amountToBuy);
        require(sent, "Could not send tokens");

        emit BuyTokens(msg.sender, msg.value, amountToBuy);
        return amountToBuy;
    }

    fallback() external payable {
        emit Received(msg.sender, msg.value);
    }
}
