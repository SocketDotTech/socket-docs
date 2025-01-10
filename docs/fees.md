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

Deploy your contracts using the `SetupSimpleToken.s.sol` script:
<!-- TODO: Remove script and add it to the socket-protocol repo -->

<details>
   <summary>Click to expand `SetupSimpleToken` script</summary>
   ```solidity
   // SPDX-License-Identifier: UNLICENSED
   pragma solidity ^0.8.13;
   import {Script} from "forge-std/Script.sol";
   import {console} from "forge-std/Console.sol";
   import {SimpleTokenAppGateway} from "../src/SimpleTokenAppGateway.sol";
   import {SimpleTokenDeployer} from "../src/SimpleTokenDeployer.sol";
   import {FeesData} from "lib/socket-protocol/contracts/common/Structs.sol";
   import {ETH_ADDRESS} from "lib/socket-protocol/contracts/common/Constants.sol";

   contract SetupSimpleToken is Script {
       function run() public {
           address addressResolver = vm.envAddress("ADDRESS_RESOLVER");
           string memory rpc = vm.envString("SOCKET_RPC");
           vm.createSelectFork(rpc);
           uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
           vm.startBroadcast(deployerPrivateKey);

           // Setting fee payment on Ethereum Sepolia
           FeesData memory feesData = FeesData({
               feePoolChain: 11155111,
               feePoolToken: ETH_ADDRESS,
               maxFees: 0.01 ether
           });

           SimpleTokenDeployer simpleTokenDeployer = new SimpleTokenDeployer(
               addressResolver,
               feesData,
               "SimpleToken",
               "STK",
               18
           );

           SimpleTokenAppGateway simpleTokenAppGateway = new SimpleTokenAppGateway(
               addressResolver,
               address(simpleTokenDeployer),
               feesData
           );

           console.log("SimpleTokenDeployer: ", address(simpleTokenDeployer));
           console.log("SimpleTokenAppGateway: ", address(simpleTokenAppGateway));
       }
   }
   ```
</details>

Run the deployment:
```bash
forge script script/SetupSimpleToken.s.sol --broadcast
```

### 2. Fund Your App

After deployment, deposit fees against your `SimpleTokenAppGateway`'s address on any supported chain to enable offchainVM to execute transactions on your behalf.

### 3. Deploy to Target Chains

Use `DeploySimpleToken.s.sol` to deploy your token to desired chains:
<!-- TODO: Remove script and add it to the socket-protocol repo -->

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {Script, console} from "forge-std/Script.sol";
import {SimpleTokenDeployer} from "../src/SimpleTokenDeployer.sol";

contract DeploySimpleToken is Script {
    function run() public {
        string memory rpc = vm.envString("SOCKET_RPC");
        vm.createSelectFork(rpc);
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        SimpleTokenDeployer simpleTokenDeployer = SimpleTokenDeployer(<deployerAddress>);
        simpleTokenDeployer.deployContracts(<chainSlug1>);
        simpleTokenDeployer.deployContracts(<chainSlug2>);
        simpleTokenDeployer.deployContracts(<chainSlug3>);
    }
}
```

Run the deployment:
```bash
forge script ./script/DeploySimpleToken.s.sol --broadcast
```

Deployment typically takes a few minutes. Track deployment status and verify contract addresses using our [APIs](/api).
