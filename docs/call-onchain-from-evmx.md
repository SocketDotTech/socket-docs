---
id: call-onchain-from-evmx
title: Calling Smart Contracts
---

# Calling onchain from EVMx

EVMx allows you to call smart contracts deployed on other blockchains in a way that feels familiar to standard contract interactions. This capability enables your decentralized applications to seamlessly operate across multiple blockchains.

## Basic contract calls

To call a function on an onchain contract from EVMx, you use a special `forwarder` address that represents the onchain contract within the EVMx environment. The call syntax is similar to regular Solidity contract calls, with the addition of the `async` modifier.

Here's a simple example of a value increase function where the onchain call does not return any values:

```solidity
function increaseOnchain(uint256 amount, address forwarder) external async {
    ISomeContract(forwarder).increase(amount);
    // (optional) Promise-based pattern to handle asynchronous data retrieval
    IPromise(forwarder).then(this.someFunction.selector, abi.encode(someDataToShareWithPromise));
}
```

### Key components

- **Async Modifier**: The `async` modifier signals that this function will perform operations that interact with other blockchains.
- **Forwarder Address**: Instead of calling the contract directly, you call a forwarder address that routes your call to the correct contract on the target blockchain.

[↘ See a reference implementation of this functionality here](https://github.com/SocketDotTech/socket-test-app/tree/master/src/write).

## Sequential batch calls

One powerful feature of EVMx is the ability to make sequential batch calls to multiple contracts or chains within a single function. Since `async` functions work with a transaction queue, all calls are processed in order.

Consider this chain-abstracted value update example:

```solidity
function transfer(uint256 amount, address forwarderChainA, address forwarderChainB) external async {
    // First burn tokens on the source chain
    ISomeContract(forwarderChainA).increase(amount);
    // (optional) Promise-based pattern to handle asynchronous data retrieval
    IPromise(forwarderChainA).then(this.someFunction.selector, abi.encode(someDataToShareWithPromise));
    // Then mint tokens on the destination chain
    ISomeContract(forwarderChainB).decrease(amount);
    // (optional) Promise-based pattern to handle asynchronous data retrieval
    IPromise(forwarderChainB).then(this.someFunction.selector, abi.encode(someDataToShareWithPromise));
}
```

The operations are executed in sequence, ensuring that the decrease on chain B happens after the increase on chain A is confirmed.

## Chain-abstracted workflow

The diagram below illustrates how the chain-abstracted batch call works:

<div style={{ display: 'flex', justifyContent: 'center' }}>
    <img src="/img/write-example.svg" alt="Chain-abstracted workflow" style={{ width: '70%' }} />
</div>

The process involves:
1. An increase operation on the Chain A Forwarder
1. Forwarding through SOCKET's EVMx
1. A decrease operation on the Chain B Forwarder
1. Communication between forwarders and the SOCKET Protocol

## Best practices

- **Chain-Specific Logic**: Consider the specific requirements of each blockchain you're interacting with
- **Error Handling**: Implement proper error handling for cross-chain operations
- **Gas Optimization**: Be mindful of gas costs across different chains
- **Transaction Sequencing**: Carefully plan the order of operations when making multiple calls

By following these patterns, you can create powerful chain-abstracted applications that seamlessly interact with contracts across multiple blockchains.

:::info
[See a reference implementation of this functionality here](https://github.com/SocketDotTech/socket-test-app/tree/master/src/write).
:::
