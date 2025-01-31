---
id: fees
title: Paying fees for transactions
---

# Fee Setup and Management

Setting up fees is essential for your app to interact with both the offchainVM and supported blockchains. There are two types of fees you need to manage:

1. OffchainVM transaction fees
2. Onchain transaction sponsorship

## OffchainVM Transaction Fees

OffchainVM transactions require its native gas token. You can:

- Obtain tokens from [the faucet](https://faucet.conduit.xyz/socket-composer-testnet)
- Bridge ETH from Sepolia using [the bridge](https://socket-composer-testnet-8b802af208e24e82.testnets.rollbridge.app/)

Transaction fees work similarly to standard blockchain transactions - specify `gasPrice` and `gasLimit` or use automatic estimation.

## Onchain Transaction Sponsorship

### 1. Deposit Sponsorship Tokens to pay for transactions

First, deposit ETH to the PayloadDeliveryPlug contract on your chosen chain:

```bash
cast send <PLUG_ADDRESS> "deposit(address,uint256,address)" \
    0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE \
    <AMOUNT> \
    $COUNTER_APPGATEWAY \
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
    feePoolChain: <chain_slug>,
    feePoolToken: 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE,
    maxFees: <max_fee_per_tx>
});
```

### 3. Apply Fee Configuration

Set the fee configuration in your contracts:

```solidity
AppGateway(appGateway).setFees(feesData);
Deployer(deployer).setFees(feesData);
```

or set them in the `constructor` of the `AppGateway` and `Deployer`.
```solidity
_setFeesData(feesData_);
```

The FeesData structure is designed to manage fee-related parameters for transactions in a dual-execution environment (offchainVM and onchain). Here's how it's implemented:

```solidity
FeesData memory feesData = FeesData({
    feePoolChain: 421614,      // Chain ID where fees are collected
    feePoolToken: ETH_ADDRESS, // Token used for fee payments (ETH in this case)
    maxFees: 0.001 ether      // Maximum fee amount allowed
});
```

#### FeesData Key Components

1. feePoolChain
    Specifies the blockchain network ID where fees are collected and managed. In this case, it's set to 421614, which appears to be a specific chain ID (possibly a testnet or L2 network).

2. feePoolToken
    Defines which token is used for fee payments. Here it's set to `ETH_ADDRESS`, meaning Ethereum is used as the payment token.

3. maxFees
    Sets an upper limit for transaction fees, preventing excessive charges. In this example, it's set to 0.001 ETH.

#### Dual Purpose Usage

**OffchainVM Transactions**
- Acts as a fee configuration for processing off-chain computations
- Ensures users have enough balance to cover computational costs
- Provides a predictable fee structure for off-chain operations

**Onchain Transactions**
- Sets parameters for standard blockchain transaction fees
- Manages gas costs for contract interactions
- Provides fee limits for user protection

#### Implementation Context
The FeesData structure is passed to both the SuperTokenDeployer and SuperTokenAppGateway contracts, ensuring consistent fee handling across the entire system, whether transactions are processed off-chain or on-chain:

```solidity
SuperTokenDeployer deployer = new SuperTokenDeployer(
    addressResolver,
    owner,
    address(auctionManager),
    FAST,
    SuperTokenDeployer.ConstructorParams({...}),
    feesData
);

SuperTokenAppGateway gateway = new SuperTokenAppGateway(
    addressResolver,
    address(deployer),
    feesData,
    address(auctionManager)
);
```

## Contract Deployment

### 1. Deploy to offchainVM

Deploy your contracts using the [`DeployGateway.s.sol` script](https://github.com/SocketDotTech/socket-protocol/blob/master/script/super-token/DeployGateway.s.sol) by running:
```bash
forge script script/super-token/SetupSuperToken.s.sol --broadcast
```

### 2. Fund Your App

After deployment, deposit fees against your `SuperTokenAppGateway`'s address on any supported chain to enable offchainVM to execute transactions on your behalf.

### 3. Deploy to Target Chains

Below is an example of how to complete the [script `DeployContracts.s.sol`](https://github.com/SocketDotTech/socket-protocol/blob/master/script/super-token/DeployContracts.s.sol):
```solidity
contract DeployContracts is Script {
    function run() public {
        (...)
        SuperTokenDeployer superTokenDeployer = SuperTokenDeployer(<deployerAddress>);
        superTokenDeployer.deployContracts(84532);     // Base Sepolia
        superTokenDeployer.deployContracts(11155420);  // OP Sepolia
        superTokenDeployer.deployContracts(421614);    // Arbitrum Sepolia
    }
}
```
Use `DeployContracts.s.sol` to deploy your token to desired chains:

```bash
forge script ./script/super-token/DeployContracts.s.sol --broadcast
```

Deployment typically takes a few minutes. Track deployment status and verify contract addresses using our [APIs](/api).
