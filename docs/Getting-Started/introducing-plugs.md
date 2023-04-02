---
id: introducing-plugs
title: Introducing Plugs
sidebar_position: 1
---


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
