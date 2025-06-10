---
id: fees
title: Pay for your onchain transactions
---

Setting up credits is essential for your app to interact with both EVMx and supported blockchains. You need to manage one parameter that handles two payment scenarios: EVMx execution costs and onchain transaction sponsorship.

:::info
USDC is currently the only supported token to deposit and be converted into EVMx credits.
:::

## How the credits system works

The credits system uses a single `fees` parameter that serves dual purposes:
- **Minimum deposit requirement**: Users must deposit at least this amount before initiating transactions with that AppGateway
- **Maximum fee limit**: Sets an upper bound on transaction costs to protect users from excessive charges

When users deposit tokens, they are converted to credits on EVMx and allocated for both native transactions and onchain fees.

## Configure fee amount

Set up the fee amount for your app:

```solidity
uint256 fees = 10 ether; // Both minimum required deposit and maximum fee limit
```

### Fee parameter details

The `fees` value controls:

1. **Minimum Required Balance**: Users must deposit at least this amount to ensure transmitters are compensated for including transactions in batches.

2. **Maximum Fee Protection**: Acts as an upper limit for transaction costs. Users only pay the actual cost if it's less than this amount.

### Usage across transaction types

**EVMx Transactions**
- Manages fees for offchain computational processing
- Ensures sufficient user balance for computational costs
- Provides predictable fee structure for offchain operations

**Onchain Transactions**
- Controls standard blockchain transaction fees
- Manages gas costs for contract interactions
- Provides fee limits for user protection

## Apply fee configuration

Set the fee configuration in your contracts:

```solidity
AppGateway(appGatewayAddress).setMaxFees(fees);
```

Alternatively, set fees in the `AppGateway` constructor:

```solidity
SomeAppGateway gateway = new SomeAppGateway(addressResolver, fees);

(...)

constructor(address addressResolver_, uint256 fees_) {
    _initializeAppGateway(addressResolver_);
    _setMaxFees(fees_);
}
```

## Deposit tokens to pay for transactions

### Deposit methods

When you deposit tokens using the `FeesPlug` contract, they're stored in a vault and converted to credits on EVMx.

**Method 1: Deposit for both Fees and Native transactions**
```bash
cast send <CHOSEN_CHAIN_FEES_PLUG> "depositToFeeAndNative(address,address,uint256)" \
    <TOKEN_ADDRESS> \
    $WALLET_ADDRESS \
    <AMOUNT> \
    --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY
```

Example using `depositToFeeAndNative`:
- Deposit: 10 USDC → 10 credits
- Allocation: 1 credits for native EVMx transactions, 9 credits for onchain fees

**Method 2: Deposit for Fees only**
```bash
cast send <CHOSEN_CHAIN_FEES_PLUG> "depositToFee(address,address,uint256)" \
    <TOKEN_ADDRESS> \
    $WALLET_ADDRESS \
    <AMOUNT> \
    --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY
```

Example using `depositToFee`:
- All deposited tokens are allocated exclusively for onchain fees

### Spend approval for an AppGateway
```bash
cast send $FEES_MANAGER "approveAppGateways((address,bool)[])" \
    "[($APP_GATEWAY,true)]" \
    --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY
```

### Cross-chain deposits

You can deposit tokens from multiple chains (Arbitrum, Base, Optimism, etc.) to the same AppGateway:

- **Deposits**: Tokens are stored in individual `FeesPlug` contracts on each chain
- **Credits**: A global fees manager tracks balances across all chains and converts them to EVMx credits
- **Withdrawals**: You can withdraw from any chain with sufficient token balance, regardless of the original deposit location

:::warning
**Cross-Chain Withdrawal Notice**: The current implementation allows withdrawing from any chain with available balance, which could potentially be misused. This will be refined in future versions.
:::

## Additional resources

- Use the existing [`PayFeesInArbitrumUSDC` script](https://github.com/SocketDotTech/socket-protocol/blob/master/script/helpers/PayFeesInArbitrumUSDC.s.sol) from the SOCKET Protocol repository
- Check your AppGateway total fee balance with the [`AppGatewayFeeBalance` script](https://github.com/SocketDotTech/socket-protocol/blob/master/script/helpers/AppGatewayFeeBalance.s.sol)
- Review the [`FeesPlug.sol`](https://github.com/SocketDotTech/socket-protocol/blob/master/contracts/evmx/payload-delivery/FeesPlug.sol#L18) contract implementation for more details
