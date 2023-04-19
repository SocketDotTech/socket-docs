---
id: sending-receiving
title: Sending & Receiving messages
sidebar_position: 3
---



### Sending Messages

For sending a message to a sibling Plug on the destination chain, the `outbound` function on Socket needs to be called.


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

| Parameters | Description |
| --- | --- |
| remoteChainSlug | Chain ID/Slug of the destination Plug |
| msgGasLimit | gasLimit required to execute the `payload` |
| payload | bytes32 calldata |
| value | Fees in native token for sending message |


#### Flow for sending a message
- The plug on `remoteChainSlug` first must be connected to Socket as specified in the last section. Socket directly maps the `remoteChainSlug to the address of the plug

- Once the `payload` to be sent is generated, the gas needed for executing it on the destination Plug must be estimated. This gasLimit estimated is to be passed in `msgGasLimit` and also used for estimating fees.
!! WIP : Add an example here !!

- The fee for sending the message can be estimated using the Fee Estimate API. Learn more about fees here (!! WIP : This will link to fees page !!)

- The `outbound` call to Socket upon completion returns a unique ID for the message (`msgId`)
- The status of the message can be tracked using the Transaction Status API
- Depending on the type of switchboard used, there will be different verification flows and estimated time until the payload is executed. You can learn more about these in the lifecycle section.(!! WIP : Add link !!)

### Receiving Messages

Socket calls the `inbound` function on the destination Plug when sending the payload. The destination plug can perform any arbitrary action with this payload. 

```javascript
    function inbound(
        uint256 siblingChainSlug_,
        bytes calldata payload_
        ) external payable {
            require(msg.sender == address(socket), "Not Socket");

        	// Performs arbitrary action with payload
        	performArbitraryAction(payload_)
    }
```

| Parameters | Description |
| --- | --- |
| siblingChainSlug_ | Chain ID/Slug of the source Plug |
| payload_ | `payload` sent from source Plug |

#### Flow for receiving a message

- Once the validity of the message is verified, Socket calls the `inbound` method with the `siblingChainSlug` and `payload`.
- In case the message cannot be executed due to low gasLimit sent or the execution is reverting, the Plug must handle the faliure case. 
- Learn more about failure cases and re-trying in this section (!!WIP must link !!)

