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
To create a promise in SOCKET, initiate an `async` action that will generate an immutable promise tracked by the SOCKET protocol. Before diving into promises, it's important to understand how to configure transaction behaviors using overrides.

### Setting Transaction Overrides
SOCKET provides flexible transaction configuration through the `_setOverrides` helper functions. These settings control how your transactions are processed:

- Read vs Write Mode (`isReadCall`)
   - Use `_setOverrides(Read.ON)` before read operations
   - Use `_setOverrides(Read.OFF)` to return to write mode
   - By default, all calls are treated as write operations

- Parallel Execution (`isParallelCall`)
   - Enable with `_setOverrides(Parallel.ON)` to batch multiple calls
   - Disable with `_setOverrides(Parallel.OFF)` for sequential execution
   - Default is OFF (sequential execution)

   <details>
      <summary>Example of reading values across multiple chains</summary>
      ```solidity
      function multiChainOperation() external async returns (bytes32 asyncId) {
          // Enable read mode for balance checks
          _setOverrides(Read.ON);

          // Read balances from multiple chains
          ISuperToken(chain1Forwarder).balanceOf(msg.sender);
          ISuperToken(chain2Forwarder).balanceOf(msg.sender);

          // Set up promise callbacks
          then(this.chainOperation.selector, abi.encode(1));
          then(this.chainOperation.selector, abi.encode(2));

          // Consecutive reads on the same chain need to be handled as first come first serve
          ISuperToken(chain3Forwarder).balanceOf(msg.sender);
          then(this.chainOperation.selector, abi.encode(3));
          ISuperToken(chain3Forwarder).balanceOf(msg.sender);
          then(this.chainOperation.selector, abi.encode(3));

          // Return to write mode for subsequent operations
          _setOverrides(Read.OFF);
      }
      ```
   </details>

- Gas Limits
   - Set per-payload gas limits: `_setOverrides(gasLimitValue)`
   - Not required for read operations

You can combine these settings using the multi-parameter version:
```solidity
_setOverrides(Read isReadCall, Parallel isParallelCall, uint256 gasLimit, Fees memory fees);
```

Here's an example of a token transfer that creates a promise to check the user's balance before proceeding:

```solidity
contract SuperTokenAppGateway is AppGatewayBase, Ownable {
    (...)
    function transfer(uint256 amount, address srcForwarder, address dstForwarder)
        external
        async
        returns (bytes32 asyncId)
    {
        // Check user balance on src chain
        asyncId = _getCurrentAsyncId();
        _setOverrides(Read.ON);
        // Request to forwarder and deploys immutable promise contract and stores it
        ISuperToken(srcForwarder).balanceOf(msg.sender);
        then(this.checkBalance.selector, abi.encode(amount, asyncId));
        _setOverrides(Read.OFF);

        ISuperToken(srcForwarder).burn(msg.sender, amount);
        ISuperToken(dstForwarder).mint(msg.sender, amount);
    }
}
```

### Handling a Promise - the `then` method
When a promise is created, it can be resolved or rejected asynchronously. Use the `then()` method to handle the successful resolution of a promise and a callback function to process the returned data.

```solidity
then(this.checkBalance.selector, abi.encode(amount, asyncId));
```

### Callback Example
The callback function `checkBalance` processes the returned data, ensuring the user has sufficient balance before completing the transaction.

```solidity
function checkBalance(bytes memory data, bytes memory returnData) external onlyPromises {
   uint256 amount = abi.decode(data, (uint256));

    uint256 balance = abi.decode(returnData, (uint256));
    if (balance < amount) {
        revert InsufficientBalance(amount, balance);
    }
}
```
The callback function `checkBalance`:
 - Uses the `onlyPromises` modifier to ensure it's only called by the promises system
 - Takes two parameters:
   - `data`: The encoded data from the original function (amount)
   - `returnData`: The actual data returned from the source chain (balance). This data is automatically returned by the Watcher.

## Example Use Case
Consider a chain-abstracted token bridge transaction where the user's balance must be validated before tokens are transferred. Here's how it works:

1. **Initiate the transfer**: The `transfer` function creates a promise to check the user's balance.
2. **Set up a promise callback**: The `then` method sets a callback to handle the balance check.
3. **Process the returned data**: The `checkBalance` function ensures the balance is sufficient before completing the transfer.

```solidity
contract SuperTokenAppGateway is AppGatewayBase, Ownable {
    error InsufficientBalance(uint256 required, uint256 available);
    (...)
    function checkBalance(bytes memory data, bytes memory returnData) external onlyPromises {
       uint256 amount = abi.decode(data, (uint256));

        uint256 balance = abi.decode(returnData, (uint256));
        if (balance < amount) {
            revert InsufficientBalance(amount, balance);
        }
    }

    function transfer(uint256 amount, address srcForwarder, address dstForwarder)
        external
        async
        returns (bytes32 asyncId)
    {
        // Check user balance on src chain
        _setOverrides(Read.ON);
        // Request to forwarder and deploys immutable promise contract and stores it
        ISuperToken(srcForwarder).balanceOf(msg.sender);
        then(this.checkBalance.selector, abi.encode(amount));

        _setOverrides(Read.OFF);

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
