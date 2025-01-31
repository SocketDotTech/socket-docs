---
id: call-contracts
title: Calling smart contracts
---

# How to call onchain contracts?

Calling onchain contracts from SOCKET’s offchain vm is very similar to how you call another contract on single chain.

Continuing the SuperToken ERC20 example let's add a function to mint tokens to a user from the `SuperTokenAppGateway` offchainVM contract.
```solidity
function mint(uint256 amount, address user, address forwarder) external async {
    SuperToken(forwarder).mint(user, amount);
}
```

This looks very similar to the `SuperToken` onchain contract example:
```solidity
function mint(address to_, uint256 amount_) external onlyOwner {
    _mint(to_, amount_);
}
```

Let us compare both of these to understand the key differences:

- The `mint` function in the `SuperToken` onchain contract uses `onlyOwner` modifier to ensure only the `SuperTokenAppGateway` contract can call those functions from the offchainVM;
- The `mint` function in the `SuperTokenAppGateway` has an `async` modifier;
- The `async` modifier in the `mint` function enables asynchronous onchain operations;
- The `SuperTokenAppGateway` contract instance calls the the onchain contract using a `forwarder` address;

SOCKET's offchainVM works with special `forwarder` contract addresses that are deployed automatically when you [deploy](/deploy) your onchain contracts and handle the forwarding of calls to the appropriate chain and address.

Read [here](/forwarder-addresses) to learn more about how forwarder addresses are assigned on the offchainVM to represent onchain contracts.

## Batch calling

The `async` modifier works on a queue of transactions, and therefore you can make a batch of onchain calls in single function and they are delivered to chains in order.

To understand this let us go back to `SuperTokenAppGateway` example from our [tutorial](/writing-apps) and extend the it to add a basic `transfer` function that burns tokens on source chain followed by minting them on destination chain.

This simple function enables burning of tokens on source chain and minting them on destination after burn is done.

```solidity
contract SuperTokenAppGateway is AppGatewayBase {
    (...)

    function transfer(uint256 amount, address srcForwarder, address dstForwarder) external async {
        SuperToken(srcForwarder).burn(msg.sender, amount);
        SuperToken(dstForwarder).mint(msg.sender, amount);
    }
}
```
The diagram below shows how tokens are transferred between two different blockchain networks (Source Chain and Destination Chain).

The process involves:
1. A burn operation on the Source Token Forwarder
1. Forwarding through a Socket Offchain VM
1. A mint operation on the Destination Token Forwarder
1. Communication between forwarders and the Socket Protocol

<div style={{ display: 'flex', justifyContent: 'center' }}>
    <img src="/img/mint_burn.svg" alt="forwarder addresses" style={{ width: '70%' }} />
</div>
