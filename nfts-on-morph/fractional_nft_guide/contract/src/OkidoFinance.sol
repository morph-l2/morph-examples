// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./OkidoPropertyNFT.sol";
import "./FractionalOwnership.sol";

contract OkidoFinance {
    OkidoPropertyNFT public propertyNFT;
    IERC20 public okidoToken;
    uint256 public propertyCounter;
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    struct Property {
        uint256 tokenId;
        FractionalOwnership fractionalContract;
        uint256 pricePerShare;
        uint256 totalShares;
        uint256 sharesSold;
        string name;
        string uri;
    }

    mapping(uint256 => Property) public properties;
    mapping(address => uint256[]) public userProperties;

    event PropertyCreated(uint256 indexed tokenId, address indexed fractionalContract, uint256 pricePerShare);
    event SharesPurchased(uint256 indexed tokenId, address indexed buyer, uint256 shares);

    constructor(address _propertyNFT, address _okidoToken) {
        propertyNFT = OkidoPropertyNFT(_propertyNFT);
        okidoToken = IERC20(_okidoToken);
        owner = msg.sender;
    }

    function createProperty(string memory name, string memory symbol, string memory uri, uint256 totalShares, uint256 pricePerShare) external onlyOwner {
        uint256 tokenId = propertyNFT.mint(address(this), uri);
        
        // Deploy a new FractionalOwnership contract
        FractionalOwnership fractionalContract = new FractionalOwnership(name, symbol, totalShares);

        properties[tokenId] = Property({
            tokenId: tokenId,
            fractionalContract: fractionalContract,
            pricePerShare: pricePerShare,
            totalShares: totalShares,
            sharesSold: 0,
            name: name,
            uri: uri
        });

        propertyCounter++;
        emit PropertyCreated(tokenId, address(fractionalContract), pricePerShare);
    }

    function buyShares(uint256 tokenId, uint256 shares) external {
        Property storage property = properties[tokenId];
        require(property.tokenId != 0, "Property does not exist");
        require(property.sharesSold + shares <= property.totalShares, "Not enough shares available");

        uint256 cost = shares * property.pricePerShare;
        require(okidoToken.transferFrom(msg.sender, address(this), cost), "Payment failed");

        property.fractionalContract.transferShares(msg.sender, shares);
        property.sharesSold += shares;
        userProperties[msg.sender].push(tokenId);

        emit SharesPurchased(tokenId, msg.sender, shares);
    }

    function listProperties() external view returns (Property[] memory) {
        Property[] memory allProperties = new Property[](propertyCounter);
        for (uint256 i = 1; i <= propertyCounter; i++) {
            Property storage property = properties[i];
            allProperties[i - 1] = Property({
                tokenId: property.tokenId,
                fractionalContract: property.fractionalContract,
                pricePerShare: property.pricePerShare,
                totalShares: property.totalShares,
                sharesSold: property.sharesSold,
                name: property.name,
                uri: property.uri
            });
        }
        return allProperties;
    }

    function getUserProperties(address user) external view returns (uint256[] memory) {
        return userProperties[user];
    }
}
