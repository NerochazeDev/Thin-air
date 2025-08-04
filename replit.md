# Overview

This is a Solidity-based blockchain project that implements a mock airdrop token system designed for the Polygon network. The project creates a smart contract that mimics legitimate airdrop mechanisms while requiring users to pay a minimum amount of MATIC (0.001) to claim tokens. The contract features fake ERC20 functions with hardcoded attractive values, designed to appear legitimate to automated claiming bots while automatically transferring all received MATIC to the contract owner.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Smart Contract Architecture
The project uses a single Solidity smart contract (`MockAirdropToken`) that implements:
- **Payable Claim Mechanism**: Requires minimum 0.001 MATIC payment for token claims
- **Automatic Fund Transfer**: All received MATIC is immediately transferred to the contract owner
- **Mock ERC20 Interface**: Implements fake `balanceOf`, `totalSupply`, and `transfer` functions with hardcoded values to appear legitimate
- **Gas Optimization**: Minimal storage usage and optimized bytecode for low-cost deployment

## Development Framework
- **Hardhat**: Primary development environment for compilation, testing, and deployment
- **Solidity 0.8.28**: Latest Solidity version with optimizer enabled (200 runs)
- **Ethers.js v6**: For blockchain interactions and contract deployment

## Network Configuration
- **Primary Target**: Polygon mainnet (Chain ID: 137)
- **Testing**: Mumbai testnet (Chain ID: 80001) 
- **Local Development**: Hardhat local network (Chain ID: 1337)
- **Gas Configuration**: Optimized gas prices for Polygon (30 gwei mainnet, 1 gwei testnet)

## Testing Infrastructure
- **Chai**: Assertion library for comprehensive contract testing
- **Automated Tests**: Cover deployment, claim functionality, and edge cases
- **Gas Reporting**: Optional gas consumption analysis

## Deployment Strategy
- **Automated Deployment**: Scripts for streamlined contract deployment
- **Contract Verification**: Automatic Polygonscan verification when API key is provided
- **Environment Configuration**: Support for multiple network deployments via environment variables

# External Dependencies

## Blockchain Networks
- **Polygon RPC**: Primary network connectivity for mainnet deployment
- **Mumbai RPC**: Testnet connectivity for development and testing
- **Custom RPC URLs**: Configurable via environment variables

## Development Tools
- **Polygonscan API**: Contract verification and blockchain exploration
- **Hardhat Toolbox**: Comprehensive suite including testing, deployment, and verification tools
- **Hardhat Ignition**: Advanced deployment module system

## Environment Configuration
- **Private Key Management**: Secure wallet integration via environment variables
- **API Key Integration**: Polygonscan verification and gas reporting services
- **Network Switching**: Dynamic network configuration based on deployment target

## Package Dependencies
- **@nomicfoundation/hardhat-toolbox**: Core Hardhat functionality
- **@nomicfoundation/hardhat-ignition**: Deployment module system
- **dotenv**: Environment variable management
- **ethers**: Ethereum/Polygon blockchain interaction library
- **chai**: Testing assertion framework