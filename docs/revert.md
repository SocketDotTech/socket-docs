---
id: revert
title: Reverting async transactions
---

# How to revert async transactions?

## 1. Introduction

When working with async transactions in SOCKET, there might be cases where you need to revert an ongoing transaction in a callback based on certain conditions. SOCKET provides utilities to handle such scenarios through the `_revertTx` function.

## 2. Example Usage

Let's extend our `MyToken` example to add a transfer function that checks the user's balance before proceeding:

```solidity
contract MyToken is ERC20 {
    ...

    function transfer(
        uint256 amount,
        address srcForwarder,
        address dstForwarder
    ) external async {
        asyncId = _getCurrentAsyncId();  // Get current transaction ID

        _readCallOn();
        IMyTokenReader(srcForwarder).balanceOf(msg.sender);
        IPromise(srcForwarder).then(
            this.checkBalanceAndTransfer.selector,
            abi.encode(msg.sender, srcFowarder, dstForwarder, amount, asyncId)
        );
        _readCallOff();
    }

    function checkBalanceAndTransfer(
        bytes memory data,
        bytes memory returnData
    ) external onlyPromises {
        (
            address user,
            address srcForwarder,
            address dstForwarder,
            uint256 amount,
            bytes32 asyncId
        ) = abi.decode(data, (address, address, uint256, bytes32));

        uint256 balance = abi.decode(returnData, (uint256));
        if (balance < amount) {
            _revertTx(asyncId);  // Revert the entire transaction
            return;
        }

        MyToken(srcForwarder).burn(msg.sender, amount);
        MyToken(dstForwarder).mint(msg.sender, amount);
    }
}
```

Key things to note:

1. The `asyncId` is obtained using `_getCurrentAsyncId()` and passed to callback using data.
2. The `_revertTx(asyncId)` function is called when the balance check fails to stop triggering burn and mint.
3. If `_revertTx(asyncId)` is not called, burn and mint are executed as expected.

:::tip
The `_revertTx` function is only available in contracts that inherit from `AppGatewayBase`.
:::
