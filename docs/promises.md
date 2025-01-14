---
id: promises
title: Promises
---

import Link from '@docusaurus/Link';
import CardGrid from '@site/src/components/CardGrid/CardGrid';
import styles from '@site/src/components/CardGrid/CardGrid.module.css';

## What is a Promise?

A Promise is a core concept in the SOCKET framework, allowing users to initiate, manage, and track asynchronous actions reliably. Think of a promise as a digital agreement between the sender and the network — once created, it can be fulfilled, rejected.

In SOCKET, a Promise represents a future outcome of an action initiated by a user or application. It encapsulates a request that might take time to complete, such as sending a message or executing a transaction.

### Promise Lifecycle
1. **Created**: The promise is initialized with specific details.
2. **Pending**: The promise is awaiting completion.
3. **Fulfilled**: The promise was successfully completed.
4. **Rejected**: The promise failed to complete.
5. **Completed**: The promise reaches a final state.

## Creating a Promise
To create a promise in SOCKET, initiate an `async` action that will generate an immutable promise tracked by the SOCKET protocol. Here's an example of a token transfer that creates a promise to check the user's balance before proceeding:

```solidity
contract SuperTokenAppGateway is AppGatewayBase {
    (...)
    function transfer(uint256 amount, address srcForwarder, address dstForwarder)
        external
        async
        returns (bytes32 asyncId)
    {
        // Check user balance on src chain
        _readCallOn();
        ISuperToken(srcForwarder).balanceOf(msg.sender);
        IPromise(srcForwarder).then(this.checkBalance.selector, abi.encode(amount, asyncId));
        _readCallOff();

        ISuperToken(srcForwarder).burn(msg.sender, amount);
        ISuperToken(dstForwarder).mint(msg.sender, amount);
    }
}
```

### Handling a Promise
When a promise is created, it can be resolved or rejected asynchronously. Use the `.then()` method to handle the successful resolution of a promise and a callback function to process the returned data.

```solidity
IPromise(srcForwarder).then(this.checkBalance.selector, abi.encode(amount, asyncId));
```

### Callback Example
The callback function `checkBalance` processes the returned data, ensuring the user has sufficient balance before completing the transaction.

```solidity
function checkBalance(bytes memory data, bytes memory returnData) external onlyPromises {
    (uint256 amount, bytes32 asyncId) = abi.decode(data, (uint256, bytes32));

    uint256 balance = abi.decode(returnData, (uint256));
    if (balance < amount) {
        _revertTx(asyncId);
        return;
    }
}
```

## Example Use Case
Consider a cross-chain token bridge transaction where the user's balance must be validated before tokens are transferred. Here's how it works:

1. **Initiate the transfer**: The `transfer` function creates a promise to check the user's balance.
2. **Set up a promise callback**: The `then` method sets a callback to handle the balance check.
3. **Process the returned data**: The `checkBalance` function ensures the balance is sufficient before completing the transfer.

```solidity
contract SuperTokenAppGateway is AppGatewayBase {
    (...)
    function checkBalance(bytes memory data, bytes memory returnData) external onlyPromises {
        (uint256 amount, bytes32 asyncId) = abi.decode(data, (uint256, bytes32));

        uint256 balance = abi.decode(returnData, (uint256));
        if (balance < amount) {
            _revertTx(asyncId);
            return;
        }
    }

    function transfer(uint256 amount, address srcForwarder, address dstForwarder)
        external
        async
        returns (bytes32 asyncId)
    {
        // Check user balance on src chain
        _readCallOn();
        // Request to forwarder and deploys immutable promise contract and stores it
        ISuperToken(srcForwarder).balanceOf(msg.sender);
        IPromise(srcForwarder).then(this.checkBalance.selector, abi.encode(amount, asyncId));

        _readCallOff();

        ISuperToken(srcForwarder).burn(msg.sender, amount);
        ISuperToken(dstForwarder).mint(msg.sender, amount);
    }
}
```

## Promise flow
<div style={{ display: 'flex', justifyContent: 'center' }}>
    <img src="/img/promises.svg" alt="promises" style={{ width: '100%' }} />
</div>

## Related Topics
<CardGrid cards={[
 {
   title: "Super Token",
   description: "Go back to the simple token introduction",
   link: "/writing-apps"
 },
 {
   title: "Forwarder Addresses",
   description: "Learn more about forwarder addresses",
   link: "/forwarder-addresses"
 }
]} />
