---
id: writing-apps
title: Writing Apps on SOCKET
---

import Link from '@docusaurus/Link';
import CardGrid from '@site/src/components/CardGrid/CardGrid';
import styles from '@site/src/components/CardGrid/CardGrid.module.css';

# Writing Apps on SOCKET

## Introduction

In this guide, we’ll build a **SimpleToken application** using the SOCKET Protocol.

You’ll learn how to:

- Create a multi-chain application that deploys replicatble tokens across chains;
- Use offchainVM to trigger onchain minting;
- Test and Deploy your app across multiple chains.

### Architecture Overview

The System consists of 3 main components.

<!-- TODO: Update filepaths once contracts are merged to master branch -->
- A [Deployer Contract](https://github.com/SocketDotTech/socket-protocol/blob/simple-token/contracts/apps/simple-token/SimpleTokenDeployer.sol) on offchainVM to deploy the **SimpleToken** instances.
    - This contract which will be deployed to offchainVM;
- An [Application Gateway Contract](https://github.com/SocketDotTech/socket-protocol/blob/simple-token/contracts/apps/simple-token/SimpleTokenAppGateway.sol) on offchainVM that handles logic related to interacting with onchain contracts;
    - This contract which will be deployed to offchainVM;
    - `AppGateway` contract is the user hub of interactions;
- An onchain [ERC20 Token Contract](https://github.com/SocketDotTech/socket-protocol/blob/simple-token/contracts/apps/simple-token/SimpleToken.sol) that can be deployed on any chain.
    - This contract is expected to be deployed via the Deployer Contract;
    - `AppGateway` will be the owner and will trigger the `mint` and `burn` functions;

## Key offchain Contract Concepts

### Onchain contract bytecode stored in the Deployer Contract
The Deployer Contract has two key pieces of code to ensure that onchain deployments are replicable `SimpleToken`'s `creationCode` with constructor parameters is stored in a mapping. This stored code is used for deploying the token to the underlying chains and written in the `constructor`.
```solidity
creationCodeWithArgs[simpleToken] = abi.encodePacked(
    type(simpleToken).creationCode,
    abi.encode(name_, symbol_, decimals_)
);
```

Using  `bytes32` variable is use a unique identifier for the SimpleToken contract generated using the `_createContractId` function. This identifier allows us to fetch `creationCode`, `onchain addresses` and `forwarder addresses` from maps in `AppGatewayBase`. See [here](/forwarder-addresses) to know more about [forwarder addresses](/forwarder-addresses).
```solidity
bytes32 public simpleToken = _createContractId("simpleToken");
```

While this example handles a single contract, you can extend it to manage multiple contracts by storing their creation codes.

### Onchain contract deployment with the Deployer Contract
<div style={{ display: 'flex', justifyContent: 'center' }}>
    <img src="/img/deployment_flow.svg" alt="deployment flow" style={{ width: '100%' }} />
</div>

The `deployContracts` function takes a `chainSlug` as an argument that specifies the chain where the contract should be deployed.
```solidity
function deployContracts(uint32 chainSlug) external async {
    _deploy(simpleToken, chainSlug);
}
```
It calls the inherited `_deploy` function and uses the `async` modifier for interacting with underlying chains.

The `initialize` function is empty in this example. You can use it for setting chain-specific or dynamic variables after deployment if needed. For more details check [this page](/deploy#initialize).

## What's next!
<CardGrid cards={[
 {
   title: "Mint tokens",
   description: "Let's mint some tokens",
   link: "/call-contracts"
 },
 {
   title: "Burn tokens",
   description: "Read onchain state before burning tokens",
   link: "/read"
 },
 {
   title: "Deploy onchain",
   description: "Deploy the ERC20 contracts onchain",
   link: "/deploy"
 },
 {
   title: "Pay for transactions",
   description: "Pay for your offchainVM transactions",
   link: "/writing-apps"
 }
]} />
<!-- TODO: Add page explaining how to test the app and how to write Foundry tests for the app -->

<!-- TODO: Move the information below to different pages -->
<!--
## Testing

### Add Airdrop Receivers: AddReceivers.s.sol

Once the setup is done, you can call `addAirdropReceivers`.

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {MyTokenAppGateway} from "../src/MyTokenAppGateway.sol";

contract AddReceivers is Script {
    address[] receivers = [
        <receiver1>,
        <receiver2>,
        <receiver3>
    ];
    uint256[] amounts = [
        <amount1>,
        <amount2>,
        <amount3>
    ];

    function run() public {
        string memory rpc = vm.envString("SOCKET_RPC");
        vm.createSelectFork(rpc);

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        MyTokenAppGateway myTokenAppGateway = MyTokenAppGateway(<myTokenAppGatewayAddress>);
        myTokenAppGateway.addAirdropReceivers(receivers, amounts);
    }
}
```

### Claim Airdrop: ClaimAirdrop.s.sol

For each receiver that was added in previous step, they can call claimAirdrop with their desired instance address to mint tokens on the desired chain. Use our [apis](/api) to get instance addresses.

Note that the instance addresses are not the same as where token contracts are deployed on chain. The instance here is a forwarder address, read more about it [here](/call-contracts).

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {MyTokenAppGateway} from "../src/MyTokenAppGateway.sol";

contract ClaimAirdrop is Script {
    function run() public {
        string memory rpc = vm.envString("SOCKET_RPC");
        vm.createSelectFork(rpc);

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        MyTokenAppGateway myTokenAppGateway = MyTokenAppGateway(<myTokenAppGatewayAddress>);
        myTokenAppGateway.claimAirdrop(<instance>);
    }
}
```
-->
