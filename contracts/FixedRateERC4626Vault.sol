// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IRewardToken {
    function mint(address to, uint256 amount) external;
}

/// @title FixedRateERC4626Vault
/// @notice ERC4626 vault with fixed APR rewards minted in a separate RewardToken
contract FixedRateERC4626Vault is ERC4626, Ownable, ReentrancyGuard {
    IRewardToken public immutable rewardToken;
    uint256 public annualRateBps; // e.g., 500 = 5%

    mapping(address => uint256) public rewardAccruedByUser;
    mapping(address => uint256) public lastAccrueTimestampByUser;

    event Claimed(address indexed user, uint256 amount);
    event AnnualRateUpdated(uint256 newBps);

    uint256 private constant ONE_YEAR = 365 days;

    constructor(
        ERC20 asset_,
        address rewardToken_,
        uint256 annualRateBps_
    ) ERC20(
        string.concat("fy-", ERC20(address(asset_)).name()),
        string.concat("fy", ERC20(address(asset_)).symbol())
    ) ERC4626(asset_) Ownable(msg.sender) {
        require(rewardToken_ != address(0), "reward token");
        require(annualRateBps_ <= 10_000, "bps");
        rewardToken = IRewardToken(rewardToken_);
        annualRateBps = annualRateBps_;
    }

    function setAnnualRateBps(uint256 newBps) external onlyOwner {
        require(newBps <= 10_000, "bps");
        annualRateBps = newBps;
        emit AnnualRateUpdated(newBps);
    }

    // ----- External ERC4626 entry points with accrual guards -----
    function deposit(uint256 assets, address receiver)
        public
        override
        nonReentrant
        returns (uint256)
    {
        _accrue(receiver);
        return super.deposit(assets, receiver);
    }

    function mint(uint256 shares, address receiver)
        public
        override
        nonReentrant
        returns (uint256)
    {
        _accrue(receiver);
        return super.mint(shares, receiver);
    }

    function withdraw(
        uint256 assets,
        address receiver,
        address owner_
    ) public override nonReentrant returns (uint256) {
        _accrue(owner_);
        return super.withdraw(assets, receiver, owner_);
    }

    function redeem(
        uint256 shares,
        address receiver,
        address owner_
    ) public override nonReentrant returns (uint256) {
        _accrue(owner_);
        return super.redeem(shares, receiver, owner_);
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
        (uint256 baseAccrued, uint256 last) = (
            rewardAccruedByUser[user],
            lastAccrueTimestampByUser[user]
        );
        if (last == 0) return baseAccrued;
        uint256 assets = convertToAssets(balanceOf(user));
        if (assets == 0) return baseAccrued;
        uint256 elapsed = block.timestamp - last;
        if (elapsed == 0) return baseAccrued;
        // Use intermediate steps to prevent overflow and improve precision
        uint256 rewardRate = (assets * annualRateBps) / 10_000;
        uint256 linear = (rewardRate * elapsed) / ONE_YEAR;
        return baseAccrued + linear;
    }

    function _accrue(address user) internal {
        uint256 last = lastAccrueTimestampByUser[user];
        if (last == 0) {
            lastAccrueTimestampByUser[user] = block.timestamp;
            return;
        }
        uint256 assets = convertToAssets(balanceOf(user));
        if (assets == 0) {
            lastAccrueTimestampByUser[user] = block.timestamp;
            return;
        }
        uint256 elapsed = block.timestamp - last;
        if (elapsed == 0) return;
        // Use intermediate steps to prevent overflow and improve precision
        uint256 rewardRate = (assets * annualRateBps) / 10_000;
        uint256 linear = (rewardRate * elapsed) / ONE_YEAR;
        rewardAccruedByUser[user] += linear;
        lastAccrueTimestampByUser[user] = block.timestamp;
    }
}
