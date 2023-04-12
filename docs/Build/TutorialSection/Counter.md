---
id: example-counter
title: Counter Example
sidebar_position: 1
---

In this tutorial, we'll explore how to build and deploy a cross-chain counter. Users can change the value of the counter on the destination chain from the source chain.

The Counter example is pre-deployed on a few chains. You can try it out on the following chains :

// WIP : LINK COUNTER EXAMPLE ADDRESSES

### Code Walkthrough

You can find the counter code for this tutorial in this GitHub repo : [`SocketDL-examples`](https://github.com/SocketDotTech/socketDL-examples)

This example inherits the `PlugBase` contract, which is a boilerplate contract with key methods to interact with Socket. More on this in Getting Started.

The cross-chain counter has 2 key methods

1. `setRemoteNumber`

   - setRemoteNumber takes `toChainSlug` and `newNumber` parameters. toChainSlug is the chain ID of the destination chain and newNumber is the value the counter will be set to. It calls `outbound` method on Socket which initiates the cross-chain message to update counter value.

   ```javascript
       function setRemoteNumber(
           uint256 newNumber_,
           uint256 toChainSlug_
       ) external payable {
           _outbound(toChainSlug_, destGasLimit, msg.value, abi.encode(newNumber_));
       }

   ```

2. `_receiveInbound`

   - Socket calls the `inbound` function on PlugBase, which then calls `_receiveInbound` method. It decodes the payload and sets the local chain counter value to the number received in the message.

     ```javascript
     function inbound(
       uint256 siblingChainSlug_,
       bytes calldata payload_
     ) external payable {
       require(msg.sender == address(socket), "no auth");
       _receiveInbound(siblingChainSlug_, payload_);
     }
     ```

     ```javascript
         function _receiveInbound(
         uint256,
         bytes memory payload_
     ) internal virtual override {
         uint256 newNumber = abi.decode(payload_, (uint256));
         setNumber(newNumber);
     }
     ```

### Setup

#### Local Environment (Foundry)

- Clone the GitHub repo and run `forge install`
- To compile and deploy the counter example, fun the following command
  ```javascript
  forge create --rpc-url <RPC> \
  --constructor-args <SOCKET_CONTRACT_ADDRESS> \
  --private-key <PRIVATE_KEY> \
  src/impl/Counter.sol:Counter
  ```

#### Remix

- The counter example can be loaded onto Remix from [here](https://remix.ethereum.org/#url=https://github.com/SocketDotTech/socketDL-examples/blob/templates/src/impl/Counter.sol&lang=en&optimize=false&runs=200&evmVersion=null&version=soljson-v0.5.0+commit.1d4f565a.js&language=Solidity)

#### Constructor Arguments

- The Counter contract takes Socket contract address as argument. The Socket address for a given chain can be found in [`deployments`](../Deployments.md)

In this example, we'll be deploying a Plug on Polygon and Optimism. So, the Socket addresses will be the following : 

| Chain | Socket address |
| --- | --- |
| 137 | 0x4c8D9ab0F4f6A959092248982bd58D2C964957d6 |
| 10 | 0x2959eBC446A4dFB30b04AfD62B0cBD3F914306B4 |

This example can also be deployed on testnets or other chains. Find a list of all s

### Configuring Plugs

As described in the Getting Started section, Plugs need to connect to Socket to send/receive messages between sibling Plugs. 

Once we have deployed the counter contract on Polygon and Optimism, we need to connect 


- This has to be repeated for other counter 

- Likewise this has to be repeated for all counters if > 2



- Connect Plug to Socket with sibling plug config
- Do the same with sibling plug
- Highlight switchboards. Link to switchboard life cycle

### Sending message

- What function is involved, what its doing
- point to life cycle
-

### Tracking status of message

-

### Destination chain

- what function is involved, what its doing
- point to lifecycle
- link example tx
