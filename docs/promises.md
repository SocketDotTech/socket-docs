---
id: promises
title: Promises
---

## Promises

Let us look at how the `balanceOf` read from `SimpleToken` introduced [here](/read) is executed to better understand what is going on.

<div style={{ display: 'flex', justifyContent: 'center' }}>
    <img src="/img/promises.svg" alt="promises" style={{ width: '100%' }} />
</div>

To support asynchronous composability, SOCKET works with special `promise` contracts that are deployed when you call `then` function. Each promise contract is immutable and specific to a read request. It can be used only once and holds context about what needs to be called on callback. The `AppGatewayBase` contract has utilities like `_readCallOn()`, `_readCallOff()`, `onlyPromises` to make it easier to work with SOCKET primitives.
