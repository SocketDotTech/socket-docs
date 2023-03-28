---
id: build-on-dl-getting-started
title: Getting Started
position : 1
---

### Introducing Plugs

Plugs are smart contract applications that connect with Socket to send and receive cross-chain messages. By following the below spec, you can make your smart contract application a Plug and start sending and receiving crosschain messages with Socket.

Every cross-chain message has a source chain and destination chain. Likewise, every source chain Plug sends a message that is received by their "sibling plug" on the destination chain. The message or payload is executed by this sibling plug.

Every plug requires 3 methods that interact with Socket to send/receive messages : 

1. `connect`
    -  Calls the connect method on Socket to register the sibling plug and switchboard configuration

        ```javascript
        function connectToSocket(
                uint256 siblingChainSlug_,
                address siblingPlug_,
                address inboundSwitchboard_,
                address outboundSwitchboard_
            ) external onlyOwner {
                socket.connect(
                    siblingChainSlug_,
                    siblingPlug_,
                    inboundSwitchboard_,
                    outboundSwitchboard_
                );
          }
        ```
        

2. `outbound`
    - Calls `outbound` method on Socket which sends the designated message(`payload`) to be executed on sibling Plug
        
        ```javascript
        function outbound(
                uint256 chainSlug,
                uint256 gasLimit,
                uint256 fees,
                bytes memory payload
            ) internal {
                socket.outbound{value: fees}(chainSlug, gasLimit, payload);
        }
        ```
        

3. `inbound`
    - `inbound` method is called on the destination plug by Socket executors to send the payload
    - The payload received can be used by the destination plug in any arbitrary way
        
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
        

:::note Congrats!

You have supercharged your smart contract application into a Plug!

:::


### Configuring Plugs

Plugs need to be configured on Socket before they can start sending and receiving messages. Plugs must “connect” or get “plugged into” Socket for each unique sibling network for sending/receiving messages.  

A connection between a plug and it's sibling plug is bi-directional. Once connected, either plug can send/receive messages from the other. A plug can have multiple siblings across chains, but must connect to Socket for each unique sibling. 

In case a connection between two plugs already exists on a chain, re-connecting will override the previous configuration.

```javascript
function connectToSocket(
        uint256 siblingChainSlug_,
        address siblingPlug_,
        address inboundSwitchboard_,
        address outboundSwitchboard_
    ) external onlyOwner {
        socket.connect(
            siblingChainSlug_,
            siblingPlug_,
            inboundSwitchboard_,
            outboundSwitchboard_
        );
  }
```

| Parameters | Description |
| --- | --- |
| siblingChainSlug_ | Chain Slug/ID of the network the sibling plug is deployed on |
| siblingPlug_ | Address of sibling plug on respective network |
| inboundSwitchboard_ | Switchboard used for receiving messages from siblingPlug |
| outboundSwitchboard_ | Switchboard used for sending messages to siblingPlug |

Find all chain slugs, Socket and switchboard deployed addresses [here](../Deployments.md)

:::note You're Plugged!

You've been plugged into Socket! The next sections walkthrough how to send and receiving messages.

:::

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

- The fee for sending the message can be estimated using the [Fee Estimate API](../Resources/apiReference.md). Learn more about fees here (!! WIP : This will link to fees page !!)

- The `outbound` call to Socket upon completion returns a unique ID for the message (`msgId`)
- The status of the message can be tracked using the [Transaction Status API](../Resources/apiReference.md).
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

