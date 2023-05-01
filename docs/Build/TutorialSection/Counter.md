---
id: example-counter
title: Counter Tutorial
sidebar_position: 2
---

In this tutorial, we'll explore how to build and deploy a cross-chain counter. The cross-chain counter lets users update the value of the counter on one chain from another.

### Code Walkthrough

You can find the code for this tutorial in the [`SocketDL-examples`](https://github.com/SocketDotTech/socketDL-examples) GitHub repo. This example inherits the `PlugBase` contract, which is a boilerplate contract with key functions {WIP: Link it} needed to interact with Socket. Plugs may use PlugBase to abstract these functions, or directly define them in their contract.

The Cross-chain Counter has 2 key functions : 

1. `setRemoteNumber`

   - setRemoteNumber takes `newNumber` and `toChainSlug` parameters. This function calls `outbound` method on Socket which initiates the cross-chain message to update the counter value on the destination chain

   ```javascript
      /* 
        newNumber_ is the value the counter will be set to
        toChainSlug_ is the chain ID of the destination chain
      */
       function setRemoteNumber(
           uint256 newNumber_,
           uint256 toChainSlug_
       ) external payable {
           _outbound(toChainSlug_, destGasLimit, msg.value, abi.encode(newNumber_));
       }

   ```

2.  `_receiveInbound`

   - Socket calls the `inbound` function on PlugBase when relaying messages on destination chain. `inbound` calls the `_receiveInbound` method which decodes the number from the payload and sets the local chain counter value to the number received in the message. More on this in message receiving lifecycle.

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
- To compile and deploy the `Counter` example, run the following command
  ```javascript
  forge create --rpc-url <RPC> \
  --constructor-args <SOCKET_CONTRACT_ADDRESS> \
  --private-key <PRIVATE_KEY> \
  src/impl/Counter.sol:Counter
  ```

#### Remix

- The counter example can be loaded onto Remix from [here](https://remix.ethereum.org/#url=https://github.com/SocketDotTech/socketDL-examples/blob/templates/src/impl/Counter.sol&lang=en&optimize=false&runs=200&evmVersion=null&version=soljson-v0.5.0+commit.1d4f565a.js&language=Solidity)

#### Constructor Arguments

- The counter example takes [`Socket`](../../Learn/protocol-architecture.md#socket) address as an argument, which can be found in [`deployments`](../DeploymentsSection/Deployments.md)

  This example can be deployed on any [supported testnets or mainnets](../../Build/DeploymentsSection/Deployments.md). In this tutorial, we'll be deploying the Counters on the following two chains, Polygon and Optimism :

  | Chain | Socket address |
  | --- | --- |
  | 137 | `0x4c8D9ab0F4f6A959092248982bd58D2C964957d6` |
  | 10 | `0x2959eBC446A4dFB30b04AfD62B0cBD3F914306B4` |


### Configuring Plugs

As described in the Getting Started section, Plugs must connect to Socket before they can send/receive messages between one another. After deploying the `Counter` contract on Polygon and Optimism, we need to initiate a `connect()` transaction on respective chains.

The script for making this transaction can be found here. This step calls the `connect` method on Socket with the following parameters. {WIP: Link it}

For Polygon, the values are :

  | Parameter | Value |
  | --- | --- |
  | siblingChainSlug | 10 |
  | siblingPlug | Address of Counter on Optimism |
  | inboundSwitchboard | 0x2521b29FD8d3787Ab42141f55F6b462E6115C737 |
  | outboundSwitchboard | 0x2521b29FD8d3787Ab42141f55F6b462E6115C737 |


For Optimism, the values are :

  | Parameter | Value |
  | --- | --- |
  | siblingChainSlug | 137 |
  | siblingPlug | Address of Counter on Polygon |
  | inboundSwitchboard | 0x8654cB74011C9972dd63Ed691d310e1BAA85Fe9E |
  | outboundSwitchboard | 0x8654cB74011C9972dd63Ed691d310e1BAA85Fe9E |


  This [connection](../../Learn/lifecycle.md#connecting-to-socket) is required on each respective chain a Plug receives/sends messages between. Once the connection step is complete, you can verify the connection was successful by calling the `getPlugConfig` method on [Socket](../DeploymentsSection/Deployments.md). This is a view function that returns the config of the plug.

### Setting Counter value on remote chain

For this tutorial, we'll be setting `Counter` value on Polygon to 55 from Optimism. To do this, we call the `setRemoteNumber()` function on our Counter deployed on Polygon. The script for making this transaction can be found here.

// Script will be here as well

The parameter values when calling this function on Optimism are : 

  | Parameter | Value |
  | --- | --- |
  | newNumber_ | 55 |
  | toChainSlug_ | 137 |

This sends a message payload from Optimism to Polygon with the number 55 encoded in payload. This number is decoded from the payload on the destination `Counter` and set as the new Counter value.

### Tracking status of message

To track the status of any outbound message can be tracked with the status API. Learn more in the Status API {WIP : link it}

### Message delivery to set Counter value

Once the [packet is verified](../../Learn/lifecycle.md#switchboards-101), Socket sends the message payload to the remote `Counter` on Polygon. It calls the `inbound` function on the remote `Counter`, which decodes the newNumber from the payload and sets it on the local chain. Find a detailed explanation of this in the [Receiving message lifecycle](../../Learn/lifecycle.md#receiving-a-message).

The value of `Counter` on Polygon can be checked using this script
// Add script to check the new counter value

Once the payload is sent to the remote `Counter`, message execution is marked complete.


:::note You're Plugged!

You've successfully built and deployed a Plug! Explore more examples & participate in Surge!

:::