---
id: onchain-to-evmx
title: Trigger AppGateway from onchain
---

## Trigger AppGateway from Onchain Contracts

This approach provides a flexible method for onchain contracts to send data from one blockchain to the AppGateway on EVMx. It enables onchain contracts to activate AppGateway actions to update information, propagate data to other chains, and initiate actions across blockchains.

This is particularly useful for applications that need to maintain consistent state across multiple blockchains, especially when actions can be performed directly onchain without interacting with the AppGateway.

To enable this functionality:
- The onchain contract must extend SOCKET Protocol's `PlugBase`
- The AppGateway must approve receiving messages from that specific onchain contract by calling the `setValidPlug` function
- The onchain contract needs a function to call the `_callAppGateway` internal function

Let's break down each point.

### Extending with `PlugBase`

The `PlugBase` contract enables onchain to EVMx communication for applications. It provides core functionality that allows contracts to connect to the SOCKET infrastructure and communicate with other chains via the AppGateway.

Key capabilities:
- Connection to SOCKET's infrastructure through the `_connectSocket` and `_disconnectSocket` functions
- Communication with AppGateways via the `_callAppGateway` function

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
