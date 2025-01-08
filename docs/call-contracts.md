---
id: call-contracts
title: Calling smart contracts
---

# How to call onchain contracts?

Calling onchain contracts from SOCKET’s offchain vm is very similar to how you call another contract on single chain.

Continuing the SimpleToken ERC20 example let's add a function to mint tokens to a user from the `SimpleTokenAppGateway` offchainVM contract.
```solidity
function mint(uint256 amount, address user, address forwarder) external async {
    SimpleToken(forwarder).mint(user, amount);
}
```

This looks very similar to the `SimpleToken` onchain contract example:
```solidity
function mint(address to_, uint256 amount_) external onlyOwner {
    _mint(to_, amount_);
}
```

Let us compare both of these to understand the key differences:

- The `mint` function in the `SimpleToken` onchain contract uses `onlyOwner` modifier to ensure only the `SimpleTokenAppGateway` contract can call those functions from the offchainVM;
- The `mint` function in the `SimpleTokenAppGateway` has an `async` modifier;
- The `async` modifier in the `mint` function enables asynchronous onchain operations;
- The `SimpleTokenAppGateway` contract instance calls the the onchain contract using a `forwarder` address;

SOCKET's offchainVM works with special `forwarder` contract addresses that are deployed automatically when you [deploy](/deploy) your onchain contracts and handle the forwarding of calls to the appropriate chain and address.

Read [here](/forwarder-addresses) to learn more about how forwarder addresses are assigned on the offchainVM to represent onchain contracts.

## Batch calling

The `async` modifier works on a queue of transactions, and therefore you can make a batch of onchain calls in single function and they are delivered to chains in order.

To understand this let us go back to `SimpleTokenAppGateway` example from our [guide](/writing-apps) and extend the it to add a basic `transfer` function that burns tokens on source chain followed by minting them on destination chain.

This simple function enables burning of tokens on source chain and minting them on destination after burn is done.

```solidity
contract MyTokenAppGateway is AppGatewayBase {
    ...

    function transfer(
        uint256 amount,
        address srcForwarder,
        address dstForwarder
    ) external async {
        MyToken(srcForwarder).burn(msg.sender, amount);
        MyToken(dstForwarder).mint(msg.sender, amount);
    }
}
```
The diagram below shows how tokens are transferred between two different blockchain networks (Source Chain and Destination Chain).

The process involves:
1. A burn operation on the Source Token Forwarder
1. Forwarding through a Socket Offchain VM
1. A mint operation on the Destination Token Forwarder
1. Communication between forwarders and the Socket Protocol

![image.png](../static/img/mint_burn.svg)

<!--
## Reading the return data

Reading the return data of a contract call is similar to how you [read on chain state](/read). With the difference being that, you need to turn the read mode on by calling `_readCallOn()` and off by calling `_readCallOff()`.

We use the promise and callback pattern, similar to how reads are done.

`transferAllCallback` is set as callback for the `burnAll` function call. We pass the `user` address and `dstForwarder` address as part of `data` to the callback and get the `amount` in `returnData`.

Interestingly, the `transferAllCallback` function also has `async` modifier and the `mint` function is called from this callback. Such nesting of `callbacks` and `async` calls can be done to implement more complex logic that involves interacting with multiple chains at different steps.
-->
