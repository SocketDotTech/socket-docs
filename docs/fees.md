---
id: fees
title: Paying fees for transactions
---

# Fee Setup and Management

Setting up fees is essential for your app to interact with both the EVMx and supported blockchains. There is only one type of fees you need to manage: onchain transaction sponsorship

## Onchain Transaction Sponsorship

### 1. Deposit Sponsorship Tokens to pay for transactions

First, deposit ETH to the PayloadDeliveryPlug contract on your chosen chain:

```bash
cast send <ARBITRUM_FEES_PLUG> "deposit(address,uint256,address)" \
    0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE \
    <AMOUNT> \
    $APP_GATEWAY \
    --value <AMOUNT> \
    --rpc-url $SEPOLIA_RPC \
    --private-key $PRIVATE_KEY
```

:::info
Currently only ETH is supported. Support for additional tokens is coming soon.
:::

### 2. Configure Fee Data

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

### 3. Apply Fee Configuration

Set the fee configuration in your contracts:

```solidity
AppGateway(appGateway).setFees(feesData);
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

#### FeesData Key Components

1. `feePoolChain`
    Specifies the blockchain network ID where fees are collected and managed. In this case, it's set to `421614`, which is Arbitrum Sepolia's chain ID.

2. `feePoolToken`
    Defines which token is used for fee payments. Here it's set to `ETH_ADDRESS`, meaning Ethereum is used as the payment token.

3. `maxFees`
    Sets an upper limit for transaction fees, preventing excessive charges. In this example, it's set to `0.001 ETH`.
    The user must have deposited at least this amount, ensuring the transmitter gets compensated for including this transaction in a batch.
    If the actual cost is less than this amount, the user only pays what's needed.

#### Dual Purpose Usage

**EVMx Transactions**
- Acts as a fee configuration for processing offchain computations
- Ensures users have enough balance to cover computational costs
- Provides a predictable fee structure for offchain operations

**Onchain Transactions**
- Sets parameters for standard blockchain transaction fees
- Manages gas costs for contract interactions
- Provides fee limits for user protection

#### Implementation Context
The `FeesData` structure is passed to the `SuperTokenAppGateway` contract ensuring consistent fee handling across the entire system, whether transactions are processed offchain or onchain:

```solidity
SuperTokenAppGateway gateway = new SuperTokenAppGateway(
    addressResolver,
    owner,
    address(auctionManager),
    FAST,
    feesData
);
```

## Contract Deployment

### 1. Deploy to EVMx

Deploy your contracts using the [`DeployGateway.s.sol` script](https://github.com/SocketDotTech/socket-protocol/blob/watcher-precompile-changes/script/super-token/DeployGateway.s.sol) by running:
```bash
forge script script/super-token/DeployGateway.s.sol --broadcast
```

### 2. Fund Your App

After deployment, deposit fees against your `SuperTokenAppGateway`'s address on any supported chain to enable EVMx to execute transactions on your behalf.

### 3. Deploy to Target Chains

Below is an example of how to complete the [script `DeployContracts.s.sol`](https://github.com/SocketDotTech/socket-protocol/blob/master/script/super-token/DeployContracts.s.sol):
```solidity
contract DeployContracts is Script {
    function run() public {
        (...)
        SuperTokenAppGateway superTokenAppGateway = SuperTokenAppGateway(<appGatewayAddress>);
        superTokenAppGateway.deployContracts(84532);     // Base Sepolia
        superTokenAppGateway.deployContracts(11155420);  // OP Sepolia
        superTokenAppGateway.deployContracts(421614);    // Arbitrum Sepolia
    }
}
```
Use `DeployContracts.s.sol` to deploy your token to desired chains:

```bash
forge script ./script/super-token/DeployContracts.s.sol --broadcast
```

Deployment typically takes a few minutes. Track deployment status and verify contract addresses using our [APIs](/api).
