---
id: read
title: Reading onchain state
---

## Read Example

SOCKET supports reading public variables and functions from the underlying chains. To understand how this is done, lets extend the SimpleToken example that was introduced in our [guide](/writing-apps) and expanded to have a `transfer` function [here](/call-contracts).

On `SimpleTokenAppGateway`, we will create a `checkBalance` function. This function will read the user's `balance` of a given instance and confirm the user has the funds before performing the transfer.

```solidity
interface ISimpleToken {
    function balanceOf(address owner) external;
}
```
:::info
The `balanceOf` function signature is similar to a standard token contract but,
- its visibility is not restricted to `view`;
- it does not have any return values.

This needs to be followed for all calls that return values to be read. This means if you have any interfaces that need to be leveraged by the offchainVM they will need to be changed to be compatible with the `async`/`forwarder` system on the offchainVM.
:::

The `transfer` function created [here](/call-contracts) had an issue that would be prone to happen. It was not checking the user's balance on the source chain before executing the transfer. Below is a read example where we read and validate the user's balance on the source chain before attempting to transfer the funds.
```solidity
contract MyTokenAppGateway is AppGatewayBase {
    (...)
    /**
     * @notice Validates user's token balance for a cross-chain transaction
     * @param data Encoded user order and async transaction ID
     * @param returnData Balance data returned from the source chain
     * @dev Checks if user has sufficient balance to complete the bridge transaction
     * @custom:modifier onlyPromises Ensures the function can only be called by the promises system
     */
    function checkBalance(bytes memory data, bytes memory returnData) external onlyPromises {
        (uint256 amount, bytes32 asyncId) = abi.decode(data, (uint256, bytes32));

        uint256 balance = abi.decode(returnData, (uint256));
        if (balance < amount) {
            _revertTx(asyncId);
            return;
        }
    }

    /**
     * @notice Initiates a cross-chain token bridge transaction
     * @param amount Amount to transfer
     * @return asyncId Unique identifier for the asynchronous cross-chain transaction
     * @dev Handles token bridging logic across different chains
     */
    function transfer(uint256 amount, address srcForwarder, address dstForwarder)
        external
        async
        returns (bytes32 asyncId)
    {
        // Check user balance on src chain
        _readCallOn();
        // Request to forwarder and deploys immutable promise contract and stores it
        ISimpleToken(srcForwarder).balanceOf(msg.sender);
        IPromise(srcForwarder).then(this.checkBalance.selector, abi.encode(amount, asyncId));

        _readCallOff();

        ISimpleToken(srcForwarder).burn(msg.sender, amount);
        ISimpleToken(dstForwarder).mint(msg.sender, amount);
    }
}
```

Let's break down the key points:

- The `transfer` function uses the `async` modifier, which is required for onchain interactions, whether they are read or write operations.
- The `_readCallOn()` and `_readCallOff()` functions are used to tell SOCKET that a particular section only needs to read data from another chain, rather than executing an onchain transaction.
- In multi-chain operations, data cannot be read synchronously. Instead, it follows this pattern:
   1. Make the onchain call (`balanceOf`)
   2. Set up a promise with a callback function using `IPromise(srcForwarder).then()`
   3. The callback function (`checkBalance`) receives the data asynchronously
- The `then` function on the forwarder (cast as `IPromise`) takes:
   - First parameter: The callback function's selector (`this.checkBalance.selector`)
   - Second parameter: Encoded data needed by the callback (`abi.encode(amount, asyncId)`).
- The callback function `checkBalance`:
   - Uses the `onlyPromises` modifier to ensure it's only called by the promises system
   - Takes two parameters:
     - `data`: The encoded data from the original function (amount and asyncId)
     - `returnData`: The actual data returned from the source chain (balance)
- When interacting with contracts on other chains, interface definitions need to be modified:
   - Remove visibility modifiers (like `view`)
   - Remove return value declarations from the function signature

[Go here to see how promises work.](/promises)

## How to revert async transactions?

When working with async transactions in SOCKET, there might be cases where you need to revert an ongoing transaction in a callback based on certain conditions. SOCKET provides utilities to handle such scenarios through the `_revertTx` function.

- The `_revertTx(asyncId)` function is called when the balance check fails to stop triggering burn and mint.
   - If `_revertTx(asyncId)` is not called, burn and mint are executed as expected.
   - The `asyncId` is obtained using `_getCurrentAsyncId()` and passed to callback using data.

:::tip
The `_revertTx` function is only available in contracts that inherit from `AppGatewayBase`.
:::

