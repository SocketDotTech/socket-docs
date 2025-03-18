---
id: writing-apps
title: Writing Apps on SOCKET
---

import Link from '@docusaurus/Link';
import CardGrid from '@site/src/components/CardGrid/CardGrid';
import styles from '@site/src/components/CardGrid/CardGrid.module.css';

In this section, we’ll go over the core components of SOCKET Protocol. You will use the EVMx to:

- Create a chain-abstracted application that deploys replicatble onchain contracts across chains;
- Call onchain functions;
- Read onchain data;
- Schedule execution;
- Test and Deploy your application across multiple chains.

### Architecture Overview

The System consists of 2 main components.

- An [Application Gateway Contract](https://github.com/SocketDotTech/socket-starter-kit/blob/master/src/counter/CounterAppGateway.sol) on EVMx that handles logic related to interacting with onchain contracts;
    - This contract which will be deployed to EVMx;
    - `AppGateway` contract is the user hub of interactions;
- An [onchain Contract](https://github.com/SocketDotTech/socket-starter-kit/blob/master/src/counter/Counter.sol) that can be deployed on any chain.
    - This contract is expected to be deployed via the AppGateway Contract;
    - `AppGateway` will trigger functions on this contract;

[↘ See a reference implementation here](https://github.com/SocketDotTech/socket-starter-kit/blob/master/src/counter/).

## Key EVMx Contract Concepts

### Onchain contract bytecode stored in the AppGateway Contract
The AppGateway Contract has two key pieces of code to ensure that onchain deployments are replicable `SomeContract`'s `creationCode` with constructor parameters is stored in a mapping. This stored code is used for deploying the token to the underlying chains and written in the `constructor`.
```solidity
creationCodeWithArgs[someRelevantName] = abi.encodePacked(
    type(OnChainContractType).creationCode,
    abi.encode(
        params_.static_,
        params_.constructor_,
        params_.input_arguments_to_,
        params_.supply_onchain_contract
    )
);
```

Using  `bytes32` variable is use a unique identifier for the SuperToken contract generated using the `_createContractId` function. This identifier allows us to fetch `creationCode`, `onchain addresses` and `forwarder addresses` from maps in `AppGatewayBase`. See [here](/forwarder-addresses) to know more about [forwarder addresses](/forwarder-addresses).
```solidity
bytes32 public someRelevantName = _createContractId("someRelevantName");
```

While this example handles a single contract, you can extend it to manage multiple contracts by storing their creation codes.

### Onchain contract deployment with the AppGateway Contract
<div style={{ display: 'flex', justifyContent: 'center' }}>
    <img src="/img/deployment_flow.svg" alt="deployment flow" style={{ width: '100%' }} />
</div>

The `deployContracts` function takes a `chainSlug` as an argument that specifies the chain where the contract should be deployed.

```solidity
function deployContracts(uint32 chainSlug_) external async {
    _deploy(someRelevantName, chainSlug_, IsPlug.YES);
}
```

The function calls the inherited `_deploy` function and uses the `async` modifier for interacting with underlying chains.

The `IsPlug` enum determines whether a contract will be connected to SOCKET's insfrastructure:

- `IsPlug.YES`: Contract will be registered as a SOCKET plug, enabling direct communication with SOCKET's insfrastructure. Use this for contracts that need to interact directly with SOCKET (e.g., SuperToken contracts).

- `IsPlug.NO`: Contract will be deployed without SOCKET integration and cannot be called directly via SOCKET's insfrastructure. Use this for contracts that only need to be called internally by other contracts (e.g., LimitHook contracts that don't require direct SOCKET communication).

#### Example Usage

```solidity
// For contracts requiring SOCKET communication
_deploy(multichainContract, chainSlug_, IsPlug.YES);

// For contracts that only need internal calls
_deploy(someHelperContract, chainSlug_, IsPlug.NO);
```

The `initialize` function is empty in this example. You can use it for setting chain-specific or dynamic variables after deployment if needed. For more details on how to use the initialize [this page](/deploy#initialize).

## What's next!
<CardGrid cards={[
 {
   title: "Call onchain",
   description: "Let's call onchain functions",
   link: "/call-onchain-from-evmx"
 },
 {
   title: "Read onchain",
   description: "Read onchain state",
   link: "/read-onchain-from-evmx"
 },
 {
   title: "Deploy onchain",
   description: "Deploy contracts onchain from EVMx",
   link: "/deploy"
 },
 {
   title: "Pay for transactions",
   description: "Pay for onchain execution",
   link: "/fees"
 }
]} />
