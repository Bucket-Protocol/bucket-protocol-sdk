# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Bucket Protocol TypeScript SDK, a comprehensive development toolkit for interacting with the Bucket Protocol on the Sui blockchain. The project supports CDP (Collateralized Debt Position) operations, PSM (Peg Stability Module), flash loans, saving pools, and lending functionality.

## Architecture

### Monorepo Structure
- **Root**: Yarn workspaces monorepo with Turbo for build orchestration
- **sdk/**: Main SDK package containing the TypeScript client and utilities
- **previews/**: Git submodules for frontend examples and demos

### Core Client Architecture
The main entry point is `BucketV2Client` (`sdk/src/client.ts`) which provides:
- **Sui Integration**: Built on `@mysten/sui` client library
- **Price Oracle Integration**: Uses Pyth Network for real-time price feeds via `@pythnetwork/pyth-sui-js`
- **Transaction Building**: Comprehensive transaction construction for CDP operations
- **Configuration Management**: Network-specific configurations for mainnet/testnet

### Key Modules
- **`structs/`**: BCS (Binary Canonical Serialization) definitions for on-chain data structures
  - `vault.ts`: Core vault and position structures
  - `dependencies.ts`: Sui framework type wrappers
  - `framework.ts`: Protocol-specific data types
- **`types/`**: TypeScript type definitions
  - `config.ts`: Network configuration and object reference types
  - `struct.ts`: API response and data structure types
- **`consts/`**: Constants and configuration
  - `config.ts`: Network configurations, package IDs, and shared object references
  - `coin.ts`: Supported coin type mappings
- **`utils/`**: Transaction utilities for coin handling and operations

## Development Commands

### Core Commands
```bash
# Install dependencies (includes submodule setup)
yarn install

# Build the SDK
yarn build
# OR using Turbo
turbo run build

# Run tests
yarn test

# Lint code
yarn lint
# OR scoped linting
turbo lint --filter=bucket-protocol-sdk

# Development mode (watch TypeScript compilation)
cd sdk && yarn dev
```

### SDK-specific Commands (from sdk/ directory)
```bash
# Build SDK package
yarn build

# Clean build artifacts
yarn clean

# Run tests with Vitest
yarn test

# TypeScript watch mode
yarn dev
```

## Testing

The project uses Vitest for testing. Key test files:
- **`sdk/test/e2e/client.test.ts`**: End-to-end integration tests with mainnet
- Tests are primarily commented out in the current version
- Tests verify price aggregation, transaction building, and client initialization

Run tests from root or sdk directory:
```bash
yarn test
# or
vitest
```

## Configuration Management

### Network Support
- **Mainnet**: Primary production network
- **Testnet**: Development and testing network
- Configurations defined in `sdk/src/consts/config.ts`

### Supported Operations
- **CDP Operations**: Deposit collateral, borrow USDB, repay debt, withdraw collateral
- **Position Management**: Open, manage, and close positions
- **Price Aggregation**: Batch price feeds from Pyth Network
- **Flash Operations**: Flash mint/burn functionality
- **PSM Operations**: Peg Stability Module interactions
- **Saving Pools**: Deposit and withdraw from saving pools with incentives

### Supported Collateral Types
- SUI (native token)
- BTC (wrapped Bitcoin)
- WAL (protocol token)

## Dependencies

### Core Dependencies
- **@mysten/sui**: Sui blockchain interaction library (locked at 1.28.2)
- **@pythnetwork/pyth-sui-js**: Pyth Network price oracle integration
- **decimal.js**: Precise decimal arithmetic for financial calculations
- **superstruct**: Runtime type validation

### Development Tools
- **TypeScript**: Primary language with strict type checking
- **ESLint**: Code linting with TypeScript and Prettier integration
- **Prettier**: Code formatting with import sorting
- **Turbo**: Build system orchestration
- **tsup**: Fast TypeScript bundler for library builds
- **Vitest**: Testing framework

## Build Output

The SDK builds to multiple formats:
- **ESM**: `dist/index.js` (primary)
- **CJS**: `dist/index.cjs` (compatibility)
- **Types**: `dist/index.d.ts` (TypeScript definitions)

## Setup Requirements

- **Node.js**: >= 20.18.0
- **Package Manager**: Yarn 1.22.22+ (configured with specific SHA)
- **Git**: Required for submodule management in previews

## Development Workflow

1. The preinstall script (`scripts/setup.sh`) handles submodule synchronization for preview repositories
2. Development typically focuses on the SDK package in `sdk/`
3. Build process uses Turbo for efficient dependency management
4. Tests can be run against mainnet for integration testing
5. Price feeds are automatically updated through Pyth Network integration