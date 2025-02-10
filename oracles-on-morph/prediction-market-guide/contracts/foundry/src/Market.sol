// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@pythnetwork/IPyth.sol";
import "@pythnetwork/PythStructs.sol";

contract CryptoPredictionsMarket is ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Market {
        uint256 id;
        string cryptoPair;
        uint256 strikePrice;
        uint256 endTime;
        uint256 resolutionTime;
        bytes32 pythPriceId;
        uint256 totalYesShares;
        uint256 totalNoShares;
        bool resolved;
        bool outcome;
    }

    struct UserPosition {
        uint256 yesShares;
        uint256 noShares;
    }

    IERC20 public paymentToken;
    IPyth public pythOracle;
    uint256 public marketCount;
    uint256 public constant FEE_PERCENTAGE = 1;  // 1% fee

    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(address => UserPosition)) public userPositions;

    event MarketCreated(uint256 indexed marketId, string cryptoPair, uint256 strikePrice, uint256 endTime, uint256 resolutionTime);
    event SharesBought(uint256 indexed marketId, address indexed buyer, bool isYes, uint256 amount);
    event SharesSold(uint256 indexed marketId, address indexed seller, bool isYes, uint256 amount);
    event MarketResolved(uint256 indexed marketId, bool outcome, uint256 resolutionPrice);
    event RewardsClaimed(uint256 indexed marketId, address indexed user, uint256 amount);

    constructor(address _paymentToken, address _pythOracle) {
        paymentToken = IERC20(_paymentToken);
        pythOracle = IPyth(_pythOracle);
    }

    function createMarket(
        string memory _cryptoPair,
        uint256 _strikePrice,
        uint256 _endTime,
        uint256 _resolutionTime,
        bytes32 _pythPriceId
    ) external {
        require(_endTime > block.timestamp, "End time must be in the future");
        require(_resolutionTime > _endTime, "Resolution time must be after end time");
        require(_strikePrice > 0, "Strike price must be greater than 0");

        marketCount++;
        markets[marketCount] = Market({
            id: marketCount,
            cryptoPair: _cryptoPair,
            strikePrice: _strikePrice,
            endTime: _endTime,
            resolutionTime: _resolutionTime,
            pythPriceId: _pythPriceId,
            totalYesShares: 0,
            totalNoShares: 0,
            resolved: false,
            outcome: false
        });

        emit MarketCreated(marketCount, _cryptoPair, _strikePrice, _endTime, _resolutionTime);
    }

    function buyShares(uint256 _marketId, bool _isYes, uint256 _amount) external nonReentrant {
        Market storage market = markets[_marketId];
        require(block.timestamp < market.endTime, "Market has ended");
        require(!market.resolved, "Market already resolved");
        require(_amount > 0, "Amount must be greater than 0");

        uint256 fee = (_amount * FEE_PERCENTAGE) / 100;
        uint256 shareAmount = _amount - fee;

        paymentToken.safeTransferFrom(msg.sender, address(this), _amount);

        UserPosition storage position = userPositions[_marketId][msg.sender];
        if (_isYes) {
            market.totalYesShares += shareAmount;
            position.yesShares += shareAmount;
        } else {
            market.totalNoShares += shareAmount;
            position.noShares += shareAmount;
        }

        emit SharesBought(_marketId, msg.sender, _isYes, shareAmount);
    }

    function sellShares(uint256 _marketId, bool _isYes, uint256 _amount) external nonReentrant {
        Market storage market = markets[_marketId];
        require(block.timestamp < market.endTime, "Market has ended");
        require(!market.resolved, "Market already resolved");
        require(_amount > 0, "Amount must be greater than 0");

        UserPosition storage position = userPositions[_marketId][msg.sender];
        if (_isYes) {
            require(position.yesShares >= _amount, "Insufficient Yes shares");
            market.totalYesShares -= _amount;
            position.yesShares -= _amount;
        } else {
            require(position.noShares >= _amount, "Insufficient No shares");
            market.totalNoShares -= _amount;
            position.noShares -= _amount;
        }

        uint256 fee = (_amount * FEE_PERCENTAGE) / 100;
        uint256 payout = _amount - fee;

        paymentToken.safeTransfer(msg.sender, payout);

        emit SharesSold(_marketId, msg.sender, _isYes, _amount);
    }

   function resolveMarket(uint256 _marketId, bytes[] calldata _pythUpdateData) external payable {
    Market storage market = markets[_marketId];
    require(block.timestamp >= market.resolutionTime, "Too early to resolve");
    require(!market.resolved, "Market already resolved");

    uint updateFee = pythOracle.getUpdateFee(_pythUpdateData);
    pythOracle.updatePriceFeeds{value: updateFee}(_pythUpdateData);

    PythStructs.Price memory price = pythOracle.getPrice(market.pythPriceId);
    
    // Convert price to 18 decimals for consistent comparison
    uint256 resolutionPrice = (uint256(uint64(price.price)) * (10 ** 18)) / (10 ** uint8(uint32(-1 * price.expo)));

    market.outcome = resolutionPrice >= market.strikePrice;
    market.resolved = true;

    emit MarketResolved(_marketId, market.outcome, resolutionPrice);
}

    function claimRewards(uint256 _marketId) external nonReentrant {
        Market storage market = markets[_marketId];
        require(market.resolved, "Market not resolved yet");

        UserPosition storage position = userPositions[_marketId][msg.sender];
        uint256 reward = 0;

        if (market.outcome) {
            reward = (position.yesShares * (market.totalYesShares + market.totalNoShares)) / market.totalYesShares;
        } else {
            reward = (position.noShares * (market.totalYesShares + market.totalNoShares)) / market.totalNoShares;
        }

        require(reward > 0, "No rewards to claim");

        position.yesShares = 0;
        position.noShares = 0;

        paymentToken.safeTransfer(msg.sender, reward);

        emit RewardsClaimed(_marketId, msg.sender, reward);
    }

    function getUserPosition(uint256 _marketId, address _user) external view returns (uint256 yesShares, uint256 noShares) {
        UserPosition storage position = userPositions[_marketId][_user];
        return (position.yesShares, position.noShares);
    }

    function getMarketDetails(uint256 _marketId) external view returns (
        string memory cryptoPair,
        uint256 strikePrice,
        uint256 endTime,
        uint256 resolutionTime,
        uint256 totalYesShares,
        uint256 totalNoShares,
        bool resolved,
        bool outcome
    ) {
        Market storage market = markets[_marketId];
        return (
            market.cryptoPair,
            market.strikePrice,
            market.endTime,
            market.resolutionTime,
            market.totalYesShares,
            market.totalNoShares,
            market.resolved,
            market.outcome
        );
    }

    function getAllMarkets() external view returns (Market[] memory) {
        Market[] memory allMarkets = new Market[](marketCount);
        for (uint256 i = 1; i <= marketCount; i++) {
            allMarkets[i - 1] = markets[i];
        }
        return allMarkets;
    }
}