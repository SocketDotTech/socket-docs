---
id: sending
title: Sending messages
sidebar_position: 2
---
<!-- // TODO: read more -->

Outbound method on the Socket contract deployed on all networks allows Plugs to send messages to other Plugs across chains. Checkout the below section to understand how to use it. If you want to read more on how sending messages in Socket works, read more here.

## Parameters

| Parameters | Description |
| --- | --- |
| remoteChainSlug | ChainSlug of the network where you want to send your messsage to |
| payload | The message you want to send to the plug on remoteChainSlug |
| msgGasLimit | gasLimit required to execute the `payload` on remoteChainSlug |

<!-- // TODO: link here -->
In order to pay for cross-chain execution, you call the outbound function with the msg.value representing the amount of fees you want to pay. You can estimate the minimum amount of fees via the methods outlined here.


## Sending your message

Make sure you have connected your Plugs on both chains to each other before you call the outbound method
Equipped with the payload we want to send, we can now call the outbound on Socket, below is a quick example

```javascript
    // Get Socket address from the deployments page for your network
    ISocket socket = ISocket(_address);

    // THIS IS NOT AN ACTUAL SLUG, please get the right slug from the deployments page
    uint256 remoteChainSlug = 1333;
    uint256 defaultGasLimit = 1000000;

    // send hello world to the sibling Plug we configured on chainSlug:1333
    function SendHelloWorld(
    ) external payable {
        bytes memory payload = abi.encode("Hello World");
        // msg.value should be equal to the minFees
        socket.outbound{value: msg.value}(remoteChainSlug, defaultGasLimit, payload);
    }
```
<!-- // TODO: add API link -->

Once the tx is finalised:
- An event `MessageTransmitted` is emitted by Socket containing all relavent details.
- Your message will be allocated a unique ID called (`msgId`) you can look it up in the `MessageTransmitted` log
 
You can use the tx-hash to track the delivery and execution on the destination chain via this API.  

<!-- // TODO: LINK -->
You can check out some examples we built out here:
