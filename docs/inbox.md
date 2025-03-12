---
id: inbox
title: Trigger AppGateway from onchain
---

## Inbox: Communication Pattern

The Inbox pattern provides a flexible approach for onchain contracts to send data from one blockchain to the AppGateway on EVMx. This means that onchain contracts can trigger AppGateway actions to update information on the AppGateway, propagate information to other chains, trigger actions on other chains, etc.

This pattern is particularly useful for applications that need to maintain consistent state across multiple blockchains. Specially if there are actions that can be performed directly onchain without interacting with the AppGateway.

To enable this functionality,

- The onchain contract needs to extend the SOCKET Protocol's `PlugBase`
- The AppGateway approve receiving messages from that specific onchain contract by calling the `internal` function `setValidPlug`.
- The onchain contract needs a function to call the `internal` function `_callAppGateway`

Let's break down each point.

### Extending with `PlugBase`

The `PlugBase` contract is a core contract in the SOCKET Protocol that enables onchain to EVMx communication for applications. It provides the core functionality that allows contracts to connect to the SOCKET infrastructure and communicate with other chains via the AppGateway.

Key capabilities it enables:

1. Connection to SOCKET's infrastructure through the `_connectSocket` and `_disconnect` functions, which links/unlinks a contract to both an AppGateway and a Switchboard
2. Communication with AppGateways via the `_callAppGateway` function, allowing contracts to send payloads across chains
3. Security through the `onlySocket` modifier, ensuring only the authorized AppGatewat contract can call certain functions

This contract serves as the base for building "plugs" - the onchain components that interact with SOCKET's infrastructure. By inheriting from `PlugBase`, your contracts gain the ability to communicate with the AppGateway on EVMx which means you can spread and process information across different blockchains in a secure and standardized way, making it essential for implementing chain-abstracted patterns like the Inbox functionality.

### Approving an onchain contract to communicate with your AppGateway

`setValidPlug` function retrieves the onchain address using the `contractId` and `chainSlug`, then calls the Watcher to update the plug's validity status. Settting to `true` the validity of an onchain contract (plug) will authorize it to send information to a specific AppGateway.

You may automate this approval by calling this in the `initialize` function of your AppGateway as the example below.

```solidity
bytes32 public yourContractId = _createContractId("your-onchain-contract");

function initialize(uint32 chainSlug_) public override {
    setValidPlug(chainSlug_, yourContractId, true);
}
```

### Triggering AppGateway from an onchain contract

Example function on how to call `_callAppGateway`. The encoded data is first parameter you intend to send to the AppGateway. Additionally you can also send parameters for execution. This can include fee information or other control parameters.

```solidity
function triggerAppGateway(YourDataType payload_) external returns (bytes32) {
    return _callAppGateway(abi.encode(payload_), bytes32(0));
}
```
