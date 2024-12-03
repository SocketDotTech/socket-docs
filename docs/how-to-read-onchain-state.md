---
id: reading-onchain-state
title: Reading onchain state
sidebar_position: 5
---

# How to read onchain state

- [ ]  proxies

```solidity
        isReadCall = true;
        ISuperToken(srcToken).balanceOf(user);
        address asyncPromise = IPromise(srcToken).then(
            this.checkBalance.selector,
            abi.encode(srcAmount, _order)
        );
        isValidPromise[asyncPromise] = true;

        isReadCall = false;
```

## isReadCall:

Before starting a read call, apps need to update isReadCall state to true.

This will make sure:

- read calls are identified and queued by watcher separately
- excluded from fees calculations as well by transmitters

Make sure to mark it false at the end.

## Contract Calls:

When calling an external contract to read a value, the interfaces should be updated to not have any visibility modifiers and return values.

For eg:

If we consider this example where we are reading balance of a user from super token:

```solidity
ISuperToken(srcToken).balanceOf(user);
```

The interface should be changed from this:

```solidity
    function balanceOf(address account) external view returns (uint256);
```

to this:

```solidity
    function balanceOf(address account) external;
```

## Callback:

```solidity
address asyncPromise = IPromise(srcToken).then(
            this.checkBalance.selector,
            abi.encode(srcAmount, _order)
        );
```

Every external contract call deploys a promise. To use a callback, you can just call .then on the same contract address wrapped in a `IPromise` modifier. This will store the callback function selector params to the `AsyncPromise` contract which are used when the watcher updates the values after chain lookup. A promise can only be used only once.

A callback function takes 2 inputs:

- encoded data from original tx. The functions can pass around needed data in callbacks in this param.
- return data which is the result of onchain call. It is abi.encode of return values of function call. Like in balanceOf call, it will be abi.encode(balance).

The callback function should use `onlyPromises` modifier, it validates sender as a verified gateway promise.

The callback also give ability to revert a call. To do this, apps can call `cancelTransaction()` function with `payloadBatchHash` from auction house.

The `payloadBatchHash` is stored in `payloadBatchHash` map in app gateway base which can be fetched from the order id.

## Marking promises valid:

(might remove this)

```solidity
        isValidPromise[asyncPromise] = true;
```

As we are allowing callbacks to appGateway, we need to validate the msg.sender for these checks. The callback functions are called by AsyncPromise contracts hence it is important to mark this AsyncPromise as valid. These are marked false automatically after executions.

