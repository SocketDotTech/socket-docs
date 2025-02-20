---
id: writing-apps
title: Writing Apps on SOCKET
---

import Link from '@docusaurus/Link';
import CardGrid from '@site/src/components/CardGrid/CardGrid';
import styles from '@site/src/components/CardGrid/CardGrid.module.css';

# Writing Apps on SOCKET

## Introduction

In this tutorial, we’ll build a **SuperToken application** using the SOCKET Protocol.

You’ll learn how to:

- Create a multi-chain application that deploys replicatble tokens across chains;
- Use EVMx to trigger onchain minting;
- Test and Deploy your app across multiple chains.

### Architecture Overview

The System consists of 3 main components.

<!-- TODO: Explain addition of PlugBase on onchain contracts -->
<!-- TODO: Explain where to get auctionManager_ address from. apps can select our auction manager contract or can deploy there own. we can keep it in docs for now maybe and think of having a default auction manager for all -->
- A [Deployer Contract](https://github.com/SocketDotTech/socket-protocol/blob/master/contracts/apps/super-token/SuperTokenDeployer.sol) on EVMx to deploy the **SuperToken** instances.
    - This contract which will be deployed to EVMx;
- An [Application Gateway Contract](https://github.com/SocketDotTech/socket-protocol/blob/master/contracts/apps/super-token/SuperTokenAppGateway.sol) on EVMx that handles logic related to interacting with onchain contracts;
    - This contract which will be deployed to EVMx;
    - `AppGateway` contract is the user hub of interactions;
- An onchain [ERC20 Token Contract](https://github.com/SocketDotTech/socket-protocol/blob/master/contracts/apps/super-token/SuperToken.sol) that can be deployed on any chain.
    - This contract is expected to be deployed via the Deployer Contract;
    - `AppGateway` will be the owner and will trigger the `mint` and `burn` functions;

## Key offchain Contract Concepts

### Onchain contract bytecode stored in the Deployer Contract
The Deployer Contract has two key pieces of code to ensure that onchain deployments are replicable `SuperToken`'s `creationCode` with constructor parameters is stored in a mapping. This stored code is used for deploying the token to the underlying chains and written in the `constructor`.
```solidity
creationCodeWithArgs[superToken] = abi.encodePacked(
    type(SuperToken).creationCode,
    abi.encode(
        params_.name_,
        params_.symbol_,
        params_.decimals_,
        params_.initialSupplyHolder_,
        params_.initialSupply_
    )
);
```

Using  `bytes32` variable is use a unique identifier for the SuperToken contract generated using the `_createContractId` function. This identifier allows us to fetch `creationCode`, `onchain addresses` and `forwarder addresses` from maps in `AppGatewayBase`. See [here](/forwarder-addresses) to know more about [forwarder addresses](/forwarder-addresses).
```solidity
bytes32 public superToken = _createContractId("superToken");
```

While this example handles a single contract, you can extend it to manage multiple contracts by storing their creation codes.

### Onchain contract deployment with the Deployer Contract
<div style={{ display: 'flex', justifyContent: 'center' }}>
    <img src="/img/deployment_flow.svg" alt="deployment flow" style={{ width: '100%' }} />
</div>

The `deployContracts` function takes a `chainSlug` as an argument that specifies the chain where the contract should be deployed.

```solidity
function deployContracts(uint32 chainSlug_) external async {
    _deploy(superToken, chainSlug_, IsPlug.YES);
}
```

The function calls the inherited `_deploy` function and uses the `async` modifier for interacting with underlying chains.

The `IsPlug` enum determines whether a contract will be connected to Socket's cross-chain messaging system:

- `IsPlug.YES`: Contract will be registered as a Socket plug, enabling direct communication with Socket's messaging system. Use this for contracts that need to interact directly with Socket (e.g., SuperToken contracts).

- `IsPlug.NO`: Contract will be deployed without Socket integration and cannot be called directly via Socket's messaging system. Use this for contracts that only need to be called internally by other contracts (e.g., LimitHook contracts that don't require direct Socket communication).

#### Example Usage

```solidity
// For contracts requiring Socket communication
_deploy(superToken, chainSlug_, IsPlug.YES);

// For contracts that only need internal calls
_deploy(someHelperContract, chainSlug_, IsPlug.NO);
```

The `initialize` function is empty in this example. You can use it for setting chain-specific or dynamic variables after deployment if needed. For more details on how to use the initialize [this page](/deploy#initialize).

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
   description: "Pay for your EVMx transactions",
   link: "/writing-apps"
 }
]} />
