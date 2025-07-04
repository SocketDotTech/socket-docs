---
id: call-onchain-from-evmx
title: Calling Smart Contracts
---

# Calling onchain from EVMx

EVMx allows you to call smart contracts deployed on other blockchains in a way that feels familiar to standard contract interactions. This capability enables your decentralized applications to seamlessly operate across multiple blockchains.

## Basic contract calls

To call a function on an onchain contract from EVMx, you use a special `forwarder` address that represents the onchain contract within the EVMx environment. The call syntax is similar to regular Solidity contract calls, with the addition of the `async` modifier.

Here's a simple example where the onchain call returns value to be handled by a promise:

```solidity
function callSomethingOnchainAndReadTheValue(uint256 amount, address forwarder) external async {
    ISomeContract(forwarder).increase(amount);
    // (optional) Promise-based pattern to handle asynchronous data retrieval
    then(this.someFunction.selector, abi.encode(someDataToShareWithPromise));
}
```

### Key components

- **Async Modifier**: The `async` modifier signals that this function will perform operations that interact with blockchains.
- **Forwarder Address**: Instead of calling the contract directly, you call a forwarder address that routes your call to the correct contract on the target blockchain.

[↘ See a reference implementation of this functionality here](https://github.com/SocketDotTech/socket-test-app/tree/master/src/write).

## Sequential batch calls

One powerful feature of EVMx is the ability to make sequential batch calls to multiple contracts or chains within a single function. Since `async` functions work with a transaction queue, all calls are processed in order.

Consider this chain-abstracted value update example:

```solidity
function batchOnchainCalls(uint256 amount, address forwarderChainA, address forwarderChainB) external async {
    // First call some contract on chain A
    ISomeContract(forwarderChainA).increase(amount);
    // (optional) Promise-based pattern to handle asynchronous data retrieval
    then(this.someFunction1.selector, abi.encode(someDataToShareWithPromise));
    // Then call some contract on chain B
    ISomeContract(forwarderChainB).decrease(amount);
    // (optional) Promise-based pattern to handle asynchronous data retrieval
    then(this.someFunction2.selector, abi.encode(someDataToShareWithPromise));
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
- **Error Handling**: Implement proper error handling for chain-abstracted operations
- **Gas Optimization**: Be mindful of gas costs across different chains
- **Transaction Sequencing**: Carefully plan the order of operations when making multiple calls

By following these patterns, you can create powerful chain-abstracted applications that seamlessly interact with contracts across multiple blockchains.

:::info
[See a reference implementation of this functionality here](https://github.com/SocketDotTech/socket-test-app/tree/master/src/write).
:::

## Common errors

<details>
   <summary>Seeing `Failed to estimate EIP1559 fees` when running EVMx scripts or cast commands</summary>

    Please ensure you have `--legacy` flag when running the commands.
</details>

<details>
   <summary>Seeing `Failed to estimate gas for tx` when running EVMx scripts or cast commands</summary>

    Please ensure you have ` --with-gas-price 0` flag when running scripts and ` --gas-price 0` flag when running commands.
</details>

<details>
   <summary>I cannot see transactions for my new AppGateway on the EVMx explorer</summary>

    If you are running the forge scripts in the starter-kit. Please confirm you have updated the `APP_GATEWAY` variable on the `.env` file.

    If you have exported your `.env` file, please confirm that the variable is up to date on your environment.
</details>

<details>
   <summary>Deploying onchain contracts is reverting with `0x8d53e553` - `InsufficientFees()`</summary>

    Please confirm you have deposited enough to pay for fees.
    - See how to [Deposit funds](/getting-started#deposit-funds).
    - [Check your AppGateway fee balance](/getting-started#check-your-account-credit-balance).
</details>

<details>
   <summary>Calling onchain contracts via EVMx is reverting with `0xb9521e1a` - `AsyncModifierNotUsed()`</summary>

    Please confirm the function you're calling has the `async` modifier as it is expected to wait for a promise since it is either reading or writing information onchain. See [key components for onchain calls](/call-onchain-from-evmx#key-components).
</details>

<details>
   <summary>`EvmError: StateChangeDuringStaticCall` when attempting to read</summary>

   Please ensure your interfaces have modifiers stripped. See [Interface modifications](/read-onchain-from-evmx#interface-modifications) for more information.
</details>

<details>
   <summary>Calling onchain contracts via EVMx is reverting with generic EVM error</summary>

    Please confirm you are passing the forwarder contract address and not the onchain contract address. See [key components for onchain calls](/call-onchain-from-evmx#key-components).
</details>
