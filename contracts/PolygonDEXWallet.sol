// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PolygonDEXWallet
 * @dev Smart wallet that holds real funds and performs actual DEX swaps on Polygon
 */
contract PolygonDEXWallet is ReentrancyGuard, Ownable {
    
    // QuickSwap Router on Polygon
    address private constant QUICKSWAP_ROUTER = 0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff;
    
    // Common Polygon tokens
    address private constant WMATIC = 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270;
    address private constant USDC = 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174;
    address private constant USDT = 0xc2132D05D31c914a87C6611C10748AEb04B58e8F;
    address private constant DAI = 0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063;
    address private constant WETH = 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619;
    
    // Events
    event FundsDeposited(address indexed sender, uint256 amount);
    event TokensSwapped(address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut);
    event FundsWithdrawn(address indexed to, uint256 amount);
    
    // Router interface for DEX interactions
    interface IUniswapV2Router {
        function swapExactETHForTokens(
            uint amountOutMin,
            address[] calldata path,
            address to,
            uint deadline
        ) external payable returns (uint[] memory amounts);
        
        function swapExactTokensForETH(
            uint amountIn,
            uint amountOutMin,
            address[] calldata path,
            address to,
            uint deadline
        ) external returns (uint[] memory amounts);
        
        function swapExactTokensForTokens(
            uint amountIn,
            uint amountOutMin,
            address[] calldata path,
            address to,
            uint deadline
        ) external returns (uint[] memory amounts);
        
        function getAmountsOut(uint amountIn, address[] calldata path)
            external view returns (uint[] memory amounts);
    }
    
    IUniswapV2Router private router;
    
    // Wallet state
    mapping(address => uint256) public tokenBalances;
    uint256 public totalMaticDeposited;
    uint256 public totalSwapsExecuted;
    
    constructor() {
        router = IUniswapV2Router(QUICKSWAP_ROUTER);
        totalMaticDeposited = 0;
        totalSwapsExecuted = 0;
    }
    
    /**
     * @dev Deposit MATIC to the wallet
     */
    function depositFunds() external payable {
        require(msg.value > 0, "Must deposit some MATIC");
        totalMaticDeposited += msg.value;
        emit FundsDeposited(msg.sender, msg.value);
    }
    
    /**
     * @dev Swap MATIC for tokens on QuickSwap
     */
    function swapMaticForToken(
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut
    ) external onlyOwner nonReentrant {
        require(amountIn > 0, "Amount must be greater than 0");
        require(address(this).balance >= amountIn, "Insufficient MATIC balance");
        require(tokenOut != address(0), "Invalid token address");
        
        address[] memory path = new address[](2);
        path[0] = WMATIC;
        path[1] = tokenOut;
        
        uint256 deadline = block.timestamp + 300; // 5 minutes
        
        try router.swapExactETHForTokens{value: amountIn}(
            minAmountOut,
            path,
            address(this),
            deadline
        ) returns (uint[] memory amounts) {
            uint256 tokensReceived = amounts[1];
            tokenBalances[tokenOut] += tokensReceived;
            totalSwapsExecuted++;
            
            emit TokensSwapped(WMATIC, tokenOut, amountIn, tokensReceived);
        } catch {
            revert("Swap failed");
        }
    }
    
    /**
     * @dev Swap tokens for MATIC
     */
    function swapTokenForMatic(
        address tokenIn,
        uint256 amountIn,
        uint256 minAmountOut
    ) external onlyOwner nonReentrant {
        require(amountIn > 0, "Amount must be greater than 0");
        require(tokenIn != address(0), "Invalid token address");
        
        IERC20 token = IERC20(tokenIn);
        require(token.balanceOf(address(this)) >= amountIn, "Insufficient token balance");
        
        // Approve router to spend tokens
        require(token.approve(QUICKSWAP_ROUTER, amountIn), "Token approval failed");
        
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = WMATIC;
        
        uint256 deadline = block.timestamp + 300;
        
        try router.swapExactTokensForETH(
            amountIn,
            minAmountOut,
            path,
            address(this),
            deadline
        ) returns (uint[] memory amounts) {
            uint256 maticReceived = amounts[1];
            tokenBalances[tokenIn] -= amountIn;
            totalSwapsExecuted++;
            
            emit TokensSwapped(tokenIn, WMATIC, amountIn, maticReceived);
        } catch {
            revert("Swap failed");
        }
    }
    
    /**
     * @dev Swap between two tokens
     */
    function swapTokenForToken(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut
    ) external onlyOwner nonReentrant {
        require(amountIn > 0, "Amount must be greater than 0");
        require(tokenIn != address(0) && tokenOut != address(0), "Invalid token addresses");
        require(tokenIn != tokenOut, "Cannot swap same token");
        
        IERC20 tokenInContract = IERC20(tokenIn);
        require(tokenInContract.balanceOf(address(this)) >= amountIn, "Insufficient token balance");
        
        // Approve router to spend tokens
        require(tokenInContract.approve(QUICKSWAP_ROUTER, amountIn), "Token approval failed");
        
        address[] memory path = new address[](3);
        path[0] = tokenIn;
        path[1] = WMATIC; // Use WMATIC as intermediate
        path[2] = tokenOut;
        
        uint256 deadline = block.timestamp + 300;
        
        try router.swapExactTokensForTokens(
            amountIn,
            minAmountOut,
            path,
            address(this),
            deadline
        ) returns (uint[] memory amounts) {
            uint256 tokensReceived = amounts[2];
            tokenBalances[tokenIn] -= amountIn;
            tokenBalances[tokenOut] += tokensReceived;
            totalSwapsExecuted++;
            
            emit TokensSwapped(tokenIn, tokenOut, amountIn, tokensReceived);
        } catch {
            revert("Swap failed");
        }
    }
    
    /**
     * @dev Get expected output for a swap
     */
    function getSwapQuote(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external view returns (uint256 amountOut) {
        require(amountIn > 0, "Amount must be greater than 0");
        
        address[] memory path;
        
        if (tokenIn == WMATIC) {
            path = new address[](2);
            path[0] = WMATIC;
            path[1] = tokenOut;
        } else if (tokenOut == WMATIC) {
            path = new address[](2);
            path[0] = tokenIn;
            path[1] = WMATIC;
        } else {
            path = new address[](3);
            path[0] = tokenIn;
            path[1] = WMATIC;
            path[2] = tokenOut;
        }
        
        uint[] memory amounts = router.getAmountsOut(amountIn, path);
        return amounts[amounts.length - 1];
    }
    
    /**
     * @dev Emergency withdraw all MATIC
     */
    function emergencyWithdrawMatic() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No MATIC to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
        
        emit FundsWithdrawn(owner(), balance);
    }
    
    /**
     * @dev Emergency withdraw specific token
     */
    function emergencyWithdrawToken(address token) external onlyOwner {
        IERC20 tokenContract = IERC20(token);
        uint256 balance = tokenContract.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");
        
        require(tokenContract.transfer(owner(), balance), "Token transfer failed");
        tokenBalances[token] = 0;
    }
    
    /**
     * @dev View functions
     */
    function getMaticBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    function getTokenBalance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }
    
    function getWalletStats() external view returns (
        uint256 maticBalance,
        uint256 totalDeposited,
        uint256 totalSwaps
    ) {
        return (
            address(this).balance,
            totalMaticDeposited,
            totalSwapsExecuted
        );
    }
    
    /**
     * @dev Common token addresses for easy access
     */
    function getTokenAddresses() external pure returns (
        address wmatic,
        address usdc,
        address usdt,
        address dai,
        address weth
    ) {
        return (WMATIC, USDC, USDT, DAI, WETH);
    }
    
    // Receive function to accept MATIC deposits
    receive() external payable {
        totalMaticDeposited += msg.value;
        emit FundsDeposited(msg.sender, msg.value);
    }
}