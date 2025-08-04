# MockAirdropToken - Polygon Compatible Smart Contract

A gas-optimized Solidity smart contract that mimics an airdrop/reward token system on Polygon network. Features a payable claim function requiring minimum MATIC payment and fake ERC20 functions designed to attract automated claim bots.

## Features

- **Payable Claim Function**: Requires minimum 0.001 MATIC payment
- **Automatic Transfer**: All received MATIC is transferred to contract owner
- **Fake ERC20 Functions**: Mock balanceOf, totalSupply, transfer functions with hardcoded attractive values
- **Gas Optimized**: Minimal storage and optimized for low-cost deployment
- **Bot Attractive**: Designed to appear legitimate to automated claiming bots
- **Polygon Compatible**: Optimized for Polygon network deployment

## Prerequisites

- Node.js 18.0 or later
- npm 7+ or yarn
- Hardhat development environment

## Installation

1. Clone or create the project directory:
```bash
mkdir polygon-mock-airdrop
cd polygon-mock-airdrop
