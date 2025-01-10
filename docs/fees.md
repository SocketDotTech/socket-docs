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

## Contract Deployment

### 1. Deploy to offchainVM

<!-- TODO: Update filepaths once contracts are merged to master branch -->
Deploy your contracts using the [`SetupSimpleToken.s.sol` script](https://github.com/SocketDotTech/socket-protocol/blob/simple-token/script/simple-token/SetupSimpleToken.s.sol) by running:
```bash
forge script script/SetupSimpleToken.s.sol --broadcast
```

### 2. Fund Your App

After deployment, deposit fees against your `SimpleTokenAppGateway`'s address on any supported chain to enable offchainVM to execute transactions on your behalf.

### 3. Deploy to Target Chains

<!-- TODO: Update filepaths once contracts are merged to master branch -->
Below is an example of how to complete the [script `DeploySimpleToken.s.sol`](https://github.com/SocketDotTech/socket-protocol/blob/simple-token/script/simple-token/DeploySimpleToken.s.sol):
```solidity
contract DeploySimpleToken is Script {
    function run() public {
        (...)
        SimpleTokenDeployer simpleTokenDeployer = SimpleTokenDeployer(<deployerAddress>);
        simpleTokenDeployer.deployContracts(84532);     // Base Sepolia
        simpleTokenDeployer.deployContracts(11155420);  // OP Sepolia
        simpleTokenDeployer.deployContracts(421614);    // Arbitrum Sepolia
    }
}
```
Use `DeploySimpleToken.s.sol` to deploy your token to desired chains:

```bash
forge script ./script/DeploySimpleToken.s.sol --broadcast
```

Deployment typically takes a few minutes. Track deployment status and verify contract addresses using our [APIs](/api).
