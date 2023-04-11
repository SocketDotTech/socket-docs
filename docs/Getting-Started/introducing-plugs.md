---
id: introducing-plugs
title: Introducing Plugs
sidebar_position: 1
---

Socket is a smart contract on each chain that exposes 3 simple APIs that applications i.e Plugs can utilise to build anything and everything. These APIs are simply:
- **connect**: This method is present in the source Socket. It is used to connect your Plug on chainA to your Plug on ChainB with all the configration parameters. This just needs to be done once to establish connection with your sibling Plug on another chain.
- **outbound**: This method is present in the source Socket. Used to send a payload to your sibling Plug from the source Plug. You send this function the payload along with the destination and it makes it happen.
- **inbound**: Your plug on the destination needs to have this method, destination Socket will forward the payload from source Socket to this function to be executed. 

That's it. 3 things, connect, send, receive. 

Goal of Socket protocol is to allow Plugs to communicate with each other. By default connections are pairwise i.e PlugA on ChainA it connected to PlugB on ChainB. You can however quickly use this simple primitive to connect your PlugA on ChainA to Plugs on 100s of other chains.

Let's look into each API into detail now and outline how to use them. You can add these functions to your Plugs and start using them, or use the template [here](https://github.com/SocketDotTech/socketDL-examples/blob/main/src/templates/PlugBase.sol) we have built for faster bootstrapping. 

<!-- // TODO: link to the right places -->
Read more about:
- Configuring Plugs via the connect method
- Sending Messages via outbound method
- Received messages via inbound method


<!--         

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
         -->
