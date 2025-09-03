// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract ComicPlatformPayment is Ownable, ReentrancyGuard, Pausable {
    event CreditsPurchased(
        address indexed buyer, 
        uint256 amountWei, 
        uint256 credits, 
        uint256 timestamp
    );
    event CreditPriceUpdated(uint256 priceWei);
    event PackageUpdated(
        uint256 id, 
        uint256 credits, 
        uint256 priceWei, 
        uint256 bonus, 
        bool active
    );

    uint256 public creditPriceWei = 0.001 ether;

    struct Package { 
        uint256 credits; 
        uint256 priceWei; 
        uint256 bonus; 
        bool active; 
    }
    
    mapping(uint256 => Package) public packages;
    uint256 public packageCount;

    constructor(address initialOwner) Ownable(initialOwner) {
        _createOrUpdatePackage(0, 100, 0.09 ether, 10, true);
        _createOrUpdatePackage(1, 500, 0.4 ether, 25, true);
        _createOrUpdatePackage(2, 1000, 0.7 ether, 40, true);
    }

    function setCreditPriceWei(uint256 newPrice) external onlyOwner { 
        creditPriceWei = newPrice; 
        emit CreditPriceUpdated(newPrice); 
    }

    function purchaseCredits(uint256 creditAmount) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
    {
        require(creditAmount > 0 && creditAmount <= 10000, "Invalid amount");
        uint256 cost = creditAmount * creditPriceWei;
        require(msg.value >= cost, "Insufficient payment");
        
        if (msg.value > cost) {
            (bool refund, ) = payable(msg.sender).call{value: msg.value - cost}("");
            require(refund, "Refund failed");
        }
        
        emit CreditsPurchased(msg.sender, cost, creditAmount, block.timestamp);
    }

    function purchasePackage(uint256 packageId) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
    {
        Package memory p = packages[packageId];
        require(p.active, "Invalid package");
        require(msg.value >= p.priceWei, "Insufficient payment");
        
        uint256 totalCredits = p.credits + (p.credits * p.bonus / 100);
        
        if (msg.value > p.priceWei) {
            (bool refund, ) = payable(msg.sender).call{value: msg.value - p.priceWei}("");
            require(refund, "Refund failed");
        }
        
        emit CreditsPurchased(msg.sender, p.priceWei, totalCredits, block.timestamp);
    }

    function createOrUpdatePackage(
        uint256 id, 
        uint256 credits, 
        uint256 priceWei, 
        uint256 bonus, 
        bool active
    ) external onlyOwner {
        _createOrUpdatePackage(id, credits, priceWei, bonus, active);
    }

    function _createOrUpdatePackage(
        uint256 id, 
        uint256 credits, 
        uint256 priceWei, 
        uint256 bonus, 
        bool active
    ) internal {
        packages[id] = Package(credits, priceWei, bonus, active);
        if (id >= packageCount) packageCount = id + 1;
        emit PackageUpdated(id, credits, priceWei, bonus, active);
    }

    function withdraw(address to) external onlyOwner {
        (bool ok,) = payable(to).call{value: address(this).balance}("");
        require(ok, "Withdraw failed");
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    receive() external payable {}
}