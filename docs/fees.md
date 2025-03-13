---
id: fees
title: Pay for your onchain transactions
---

Setting up fees is essential for your app to interact with both the EVMx and supported blockchains. There is only one type of fees you need to manage: onchain transaction sponsorship

## Onchain Transaction Sponsorship

### Configure fee data

Set up the `FeesData` structure for your app:

```solidity
struct FeesData {
    uint32 feePoolChain;
    address feePoolToken;
    uint256 maxFees;
}

FeesData feesData = FeesData({
    feePoolChain: <CHAINSLUG>,
    feePoolToken: <TOKEN_ADDRESS>,
    maxFees: <MAX_FEE_PER_TRANSACTION>
});
```

The `maxFees` parameter serves a dual purpose:
- It represents the minimum amount of fees that must be available in the contract to process the transaction
- It also represents the maximum amount the user is willing to pay for this transaction to be included in a batch

User must have deposited at least this amount to the contract before initiating the transaction, which ensures the transmitter (entity processing batches) is guaranteed compensation for including this transaction.

### Apply fee configuration

Set the fee configuration in your contracts:

```solidity
AppGateway(appGatewayAddress).setFees(feesData);
```

or set them in the `constructor` of the `AppGateway`.
```solidity
_setFeesData(feesData_);
```

The FeesData structure is designed to manage fee-related parameters for transactions in a dual-execution environment (EVMx and onchain). Here's how it's implemented:

```solidity
FeesData memory feesData = FeesData({
    feePoolChain: 421614,      // Chain ID where fees are collected
    feePoolToken: ETH_ADDRESS, // Token used for fee payments (ETH in this case)
    maxFees: 0.001 ether       // Maximum fee amount allowed and minimum required deposit
});
```

#### `FeesData` key components

1. `feePoolChain`
    Specifies the blockchain network ID where fees are collected and managed. In this case, it's set to `421614`, which is Arbitrum Sepolia's chain ID.

2. `feePoolToken`
    Defines which token is used for fee payments. Here it's set to `ETH_ADDRESS`, meaning Ethereum is used as the payment token.

3. `maxFees`
    Sets an upper limit for transaction fees, preventing excessive charges. In this example, it's set to `0.001 ETH`.
    The user must have deposited at least this amount, ensuring the transmitter gets compensated for including this transaction in a batch.
    If the actual cost is less than this amount, the user only pays what's needed.

#### Dual purpose usage

**EVMx Transactions**
- Acts as a fee configuration for processing offchain computations
- Ensures users have enough balance to cover computational costs
- Provides a predictable fee structure for offchain operations

**Onchain Transactions**
- Sets parameters for standard blockchain transaction fees
- Manages gas costs for contract interactions
- Provides fee limits for user protection

#### Implementation context
The `FeesData` structure is passed to the `SomeAppGateway` contract ensuring consistent fee handling across the entire system, whether transactions are processed offchain or onchain:

```solidity
SomeAppGateway gateway = new SomeAppGateway(
    addressResolver,
    feesData,
    owner
);
```

### Deposit sponsorship tokens to pay for transactions

First, deposit testnet ETH to the `FeesPlug` contract on your chosen chain:

```bash
cast send <CHOSEN_CHAIN_FEES_PLUG> "deposit(address,address,uint256)" \
    0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE \
    $APP_GATEWAY \
    <AMOUNT> \
    --value <AMOUNT> \
    --rpc-url $SEPOLIA_RPC \
    --private-key $PRIVATE_KEY
```

You may also call or adapt the [existing `PayFeesInArbitrumETH` script](https://github.com/SocketDotTech/socket-protocol/blob/master/script/helpers/PayFeesInArbitrumETH.s.sol) in SOCKET Protocol repository. You may also check your AppGateway total fee balance with [`AppGatewayFeeBalance` script](https://github.com/SocketDotTech/socket-protocol/blob/master/script/helpers/AppGatewayFeeBalance.s.sol).

:::info
Currently only testnet ETH is supported. Support for additional tokens is coming soon.
:::
