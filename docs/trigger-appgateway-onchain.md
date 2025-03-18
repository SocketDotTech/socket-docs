---
id: trigger-appgateway-onchain
title: Trigger AppGateway from onchain
---

## Trigger AppGateway from Onchain Contracts

This approach enables onchain contracts to communicate directly with your AppGateway on EVMx. It allows contracts deployed on blockchains to send data to EVMx, update information, and initiate chain-abstracted actions.

This pattern is particularly valuable for applications that need to:
- Maintain consistent state across multiple blockchains
- React to onchain events by triggering actions on other chains
- Create workflows that start on one chain and continue on others

To implement this functionality, you'll need to:

1. Extend your onchain contract with SOCKET Protocol's `PlugBase`
2. Configure your AppGateway to accept messages from your onchain contract
3. Implement a function in your onchain contract that calls the AppGateway

[↘ See a reference implementation of this functionality here](https://github.com/SocketDotTech/socket-test-app/tree/master/src/trigger-appgateway-onchain).

### Extending with `PlugBase`

The `PlugBase` contract serves as the foundation for onchain-to-EVMx communication. By inheriting from this contract, your onchain contracts gain the ability to connect to the SOCKET infrastructure and communicate with your AppGateway.

Key functions provided by `PlugBase`:
- `_connectSocket`: Establishes a connection to the SOCKET infrastructure
- `_disconnectSocket`: Terminates the connection when no longer needed
- `_callAppGateway`: Sends data to your AppGateway on EVMx

Inheriting from `PlugBase` is the first step in creating a secure communication channel between your onchain contract and the EVMx environment.

### Approving an onchain contract to communicate with your AppGateway

For security reasons, your AppGateway must explicitly authorize which onchain contracts can send it messages. This is done through the `setValidPlug` function, which marks a specific onchain contract as a valid communication source.

You can automate this approval in your AppGateway's `initialize` function:

```solidity
bytes32 public yourContractId = _createContractId("your-onchain-contract");

function initialize(uint32 chainSlug_) public override {
    // Allow the onchain contract to communicate with this AppGateway
    setValidPlug(chainSlug_, yourContractId, true);
}
```

The `setValidPlug` function takes three parameters:
- `chainSlug_`: The chain identifier where your onchain contract is deployed
- `yourContractId`: A unique identifier for your onchain contract
- `true`: Sets the contract as an authorized communication source

### Triggering AppGateway from an onchain contract

Once your onchain contract inherits from `PlugBase` and is approved by the AppGateway, you can implement a function to send data to the AppGateway:

```solidity
function triggerAppGateway(YourDataType payload_) external returns (bytes32) {
    // Encode your data and send it to the AppGateway
    return _callAppGateway(abi.encode(payload_), bytes32(0));
}
```

Parameters for `_callAppGateway`:
- First parameter: Your encoded data that will be sent to the AppGateway
- Second parameter: Reserved for additional execution information (currently use `bytes32(0)`)

The function returns a transaction identifier that can be used to track the chain-abstracted call.

:::info
[See a reference implementation of this functionality here](https://github.com/SocketDotTech/socket-test-app/tree/master/src/trigger-appgateway-onchain).
:::
