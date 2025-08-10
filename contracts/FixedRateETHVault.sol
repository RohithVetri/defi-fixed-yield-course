// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IRewardToken {
    function mint(address to, uint256 amount) external;
}

/// @title FixedRateETHVault (教学版)
/// @notice Deposit ETH, accrue linear rewards via a RewardToken at a fixed APR
contract FixedRateETHVault is Ownable, ReentrancyGuard {
    IRewardToken public immutable rewardToken;
    uint256 public annualRateBps; // e.g., 500 = 5%

    mapping(address => uint256) public principalByUser; // deposited ETH in wei
    mapping(address => uint256) public rewardAccruedByUser; // unclaimed reward tokens
    mapping(address => uint256) public lastAccrueTimestampByUser; // last accrue

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event Claimed(address indexed user, uint256 amount);
    event AnnualRateUpdated(uint256 newBps);

    uint256 private constant ONE_YEAR = 365 days;

    constructor(address rewardToken_, uint256 annualRateBps_)
        Ownable(msg.sender)
    {
        require(rewardToken_ != address(0), "reward token");
        require(annualRateBps_ <= 10_000, "bps");
        rewardToken = IRewardToken(rewardToken_);
        annualRateBps = annualRateBps_;
    }

    receive() external payable {
        deposit();
    }

    function setAnnualRateBps(uint256 newBps) external onlyOwner {
        require(newBps <= 10_000, "bps");
        annualRateBps = newBps;
        emit AnnualRateUpdated(newBps);
    }

    function deposit() public payable nonReentrant {
        require(msg.value > 0, "zero");
        _accrue(msg.sender);
        principalByUser[msg.sender] += msg.value;
        if (lastAccrueTimestampByUser[msg.sender] == 0) {
            lastAccrueTimestampByUser[msg.sender] = block.timestamp;
        }
        emit Deposited(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "zero");
        require(principalByUser[msg.sender] >= amount, "insufficient");
        _accrue(msg.sender);
        principalByUser[msg.sender] -= amount;
        (bool ok, ) = msg.sender.call{value: amount}("");
        require(ok, "eth send");
        emit Withdrawn(msg.sender, amount);
    }

    function claim() external nonReentrant {
        _accrue(msg.sender);
        uint256 amount = rewardAccruedByUser[msg.sender];
        require(amount > 0, "nothing");
        rewardAccruedByUser[msg.sender] = 0;
        rewardToken.mint(msg.sender, amount);
        emit Claimed(msg.sender, amount);
    }

    function getPendingReward(address user) external view returns (uint256) {
        uint256 last = lastAccrueTimestampByUser[user];
        uint256 principal = principalByUser[user];
        uint256 accrued = rewardAccruedByUser[user];
        if (last == 0 || principal == 0) return accrued;
        uint256 elapsed = block.timestamp - last;
        if (elapsed == 0) return accrued;
        // Use intermediate steps to prevent overflow and improve precision
        uint256 rewardRate = (principal * annualRateBps) / 10_000;
        uint256 linear = (rewardRate * elapsed) / ONE_YEAR;
        return accrued + linear;
    }

    function _accrue(address user) internal {
        uint256 last = lastAccrueTimestampByUser[user];
        uint256 principal = principalByUser[user];
        if (last == 0) {
            lastAccrueTimestampByUser[user] = block.timestamp;
            return;
        }
        if (principal == 0) {
            lastAccrueTimestampByUser[user] = block.timestamp;
            return;
        }
        uint256 elapsed = block.timestamp - last;
        if (elapsed == 0) return;
        // Use intermediate steps to prevent overflow and improve precision
        uint256 rewardRate = (principal * annualRateBps) / 10_000;
        uint256 linear = (rewardRate * elapsed) / ONE_YEAR;
        rewardAccruedByUser[user] += linear;
        lastAccrueTimestampByUser[user] = block.timestamp;
    }
}
