---
id: example-counter
title: Counter Example
sidebar_position: 1
---

In this tutorial, we'll explore how to build and deploy a cross-chain counter. Users can change the value of the counter on one chain from another chain.

### Code Walkthrough

You can find the code for this tutorial in the [`SocketDL-examples`](https://github.com/SocketDotTech/socketDL-examples) GitHub repo. This example inherits the `PlugBase` contract, which is a boilerplate contract with [key functions](../Getting-Started//introducing-plugs.md) needed to interact with Socket. Plugs may use PlugBase to abstract these functions, or directly define them in their contract.

The Cross-chain counter has 2 key functions : 

1. `setRemoteNumber`

   - setRemoteNumber takes `newNumber` and `toChainSlug` parameters. This function calls `outbound` method on Socket which initiates the cross-chain message to update counter value on the destination chain

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

- The counter example takes [`Socket`](../../Learn/protocol-architecture.md#socket) address as an argument and addresses for [`Socket`](../../Learn/protocol-architecture.md#socket) can be found in [`deployments`](../DeploymentsSection/Deployments.md)

  This example can be deployed on all [supported testnets or mainnets]((../DeploymentsSection/Deployments.md)). In this tutorial, we'll be deploying the Counters on the following two chains, Polygon and Optimism :

  | Chain | Socket address |
  | --- | --- |
  | 137 | `0x4c8D9ab0F4f6A959092248982bd58D2C964957d6` |
  | 10 | `0x2959eBC446A4dFB30b04AfD62B0cBD3F914306B4` |


### Configuring Plugs

As described in the Getting Started section, Plugs must connect to Socket before they can send/receive messages between one another. After deploying the `Counter` contract on Polygon and Optimism, we need to initiate a `connect()` transaction on respective chains.

The script for making this transaction can be found here. This step calls the `connect` method on Socket with the [following parameters](../Getting-Started/introducing-plugs.md).

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
