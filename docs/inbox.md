---
id: inbox
title: Trigger AppGateway from onchain
---

## Inbox: Communication Pattern

The Inbox pattern provides a flexible approach for onchain contracts to send data from one blockchain to the AppGateway on EVMx. This enables onchain contracts to trigger AppGateway actions to update information, propagate data to other chains, and trigger actions across blockchains.

This pattern is particularly useful for applications that need to maintain consistent state across multiple blockchains, especially when actions can be performed directly onchain without interacting with the AppGateway.

To enable this functionality:
- The onchain contract must extend Socket Protocol's `PlugBase`
- The AppGateway must approve receiving messages from that specific onchain contract by calling the `setValidPlug` function
- The onchain contract needs a function to call the `_callAppGateway` internal function

Let's break down each point.

### Extending with `PlugBase`

The `PlugBase` contract enables onchain to EVMx communication for applications. It provides core functionality that allows contracts to connect to the Socket infrastructure and communicate with other chains via the AppGateway.

Key capabilities:
1. Connection to Socket's infrastructure through the `_connectSocket` and `_disconnect` functions
2. Communication with AppGateways via the `_callAppGateway` function
3. Security through the `onlySocket` modifier, ensuring only the authorized Socket contract can call certain functions

By inheriting from `PlugBase`, your contracts gain the ability to communicate with the AppGateway on EVMx, allowing you to spread and process information across different blockchains securely.

### Approving an onchain contract to communicate with your AppGateway

The `setValidPlug` function retrieves the onchain address using the `contractId` and `chainSlug`, then calls the Watcher to update the plug's validity status. Setting to `true` authorizes the onchain contract to send information to your AppGateway.

You can automate this approval in your AppGateway's `initialize` function:

```solidity
bytes32 public yourContractId = _createContractId("your-onchain-contract");

function initialize(uint32 chainSlug_) public override {
    setValidPlug(chainSlug_, yourContractId, true);
}
```

### Triggering AppGateway from an onchain contract

Example function showing how to call `_callAppGateway`:

```solidity
function triggerAppGateway(YourDataType payload_) external returns (bytes32) {
    return _callAppGateway(abi.encode(payload_), bytes32(0));
}
```

The first parameter is your encoded data sent to the AppGateway. The second parameter will be expanded to include additional execution information. Currently keep the second parameter as `bytes32(0)`.
