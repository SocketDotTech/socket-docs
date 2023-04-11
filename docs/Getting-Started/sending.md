---
id: sending
title: Sending messages
sidebar_position: 3
---

### Sending Messages

Your plug can send a message to the configured sibling Plug on the destination chain via the `outbound` function on Socket.

The function is really simple, it just needs the following details

| Parameters | Description |
| --- | --- |
| remoteChainSlug | Chain Slug of the network where you want to send your messsage |
| payload | The message you want to send to the sibling plug on remoteChainSlug |
| msgGasLimit | gasLimit required to execute the `payload` on remoteChainSlug |

In order to pay for cross-chain execution, you call the outbound function with the msg.value representing the amount of fees you want to pay. You can estimate the minimum amount of fees via the methods outlined here.

```javascript

    ISocket socket = ISocket(_address);

    function outbound(
        uint256 remoteChainSlug,
        uint256 msgGasLimit,
        bytes memory payload
    ) external payable {
        socket.outbound{value: msg.value}(remoteChainSlug, msgGasLimit, payload);
    }
```



#### Flow for sending a message
- The plug on `remoteChainSlug` first must be connected to Socket as specified in the last section. Socket directly maps the `remoteChainSlug to the address of the plug

- Once the `payload` to be sent is generated, the gas needed for executing it on the destination Plug must be estimated. This gasLimit estimated is to be passed in `msgGasLimit` and also used for estimating fees.
!! WIP : Add an example here !!

- The fee for sending the message can be estimated using the [Fee Estimate API](../Resources/apiReference.md). Learn more about fees here (!! WIP : This will link to fees page !!)

- The `outbound` call to Socket upon completion returns a unique ID for the message (`msgId`)
- The status of the message can be tracked using the [Transaction Status API](../Resources/apiReference.md).
- Depending on the type of switchboard used, there will be different verification flows and estimated time until the payload is executed. You can learn more about these in the lifecycle section.(!! WIP : Add link !!)
