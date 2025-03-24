---
id: read-onchain-from-evmx
title: Read onchain from EVMx
---

EVMx allows you to read state from contracts deployed on blockchains. This chain-abstracted applications that need to access or verify onchain data before executing transactions to asynchronisely read the data before performing any other required operation.

## The challenge of chain-abstracted reads

When working with multiple blockchains, reading data presents a unique challenge: data cannot be read synchronously across chains. Instead, EVMx uses a promise-based pattern to handle asynchronous data retrieval.

## Promise-based reading pattern

Reading data from onchain contracts follows this pattern:

1. Make a read request to the onchain contract
2. Set up a promise with a callback function
3. Process the returned data in the callback function

[↘ See a reference implementation of this functionality here](https://github.com/SocketDotTech/socket-test-app/tree/master/src/read).

Here's an example of checking a user's token balance before initiating a transfer:

```solidity
function transfer(uint256 amount, address srcForwarder, address dstForwarder)
    external
    async
    returns (bytes32 asyncId)
{
    // Enable read mode
    _setOverrides(Read.ON);
    // Request balance from source chain
    ISomeContract(srcForwarder).balanceOf(msg.sender);
    // Set up callback with necessary data
    IPromise(srcForwarder).then(this.checkBalance.selector, abi.encode(amount));
    // Disable read mode
    _setOverrides(Read.OFF);
    // These operations will only execute if the balance check passes
    // Notice here that no promises were set as burn and mint are not expected to return anything
    ISomeContract(srcForwarder).burn(msg.sender, amount);
    ISomeContract(dstForwarder).mint(msg.sender, amount);
}

function checkBalance(bytes memory data, bytes memory returnData) external onlyPromises {
    uint256 amount = abi.decode(data, uint256);

    bytes32 asyncId = _getCurrentAsyncId();

    uint256 balance = abi.decode(returnData, (uint256));
    if (balance < amount) {
        _revertTx(asyncId);
        return;
    }
}
```

## Key components

### Async Modifier

The `async` modifier signals that this function will perform operations that interact with blockchains.

### Forwarder Address

Instead of calling the contract directly, you call a forwarder address that routes your call to the correct contract on the target blockchain.

### Read mode

- `_setOverrides(Read.ON)` signals the start of a read operation
- `_setOverrides(Read.OFF)` signals the end of a read operation

### Promise setup

The `then` function takes two parameters:
- The callback function selector (e.g., `this.checkBalance.selector`)
- Encoded data needed by the callback (e.g., `abi.encode(amount)`)

### Callback function

- Must use the `onlyPromises` modifier
- Takes two parameters:
  - `data`: The encoded data from the original function
  - `returnData`: The actual data returned from the source chain

[↘ Learn more about promises here](/promises).

### Interface modifications

When defining interfaces for chain-abstracted reads, you need to:
- Remove visibility modifiers (like `view`)
- Remove return value declarations from the function signature

```solidity
interface IISomeContract {
    // For EVMx - no view modifier, no return value
    function balanceOf(address owner) external;

    // Standard ERC20 interface would be:
    // function balanceOf(address owner) external view returns (uint256);
}
```

## Handling Conditional Execution

You can control the execution flow based on read results using the `_revertTx` function:

```solidity
if (balance < amount) {
    _revertTx(asyncId);
    return;
}
```

This function cancels the remaining operations in the transaction queue associated with the given `asyncId`, preventing subsequent operations from executing.

## Best Practices

- Always validate data before performing critical operations
- Implement proper error handling for read failures

By following these patterns, you can safely and efficiently read data from onchain contracts before executing chain-abstracted transactions.

:::info
[See a reference implementation of this functionality here](https://github.com/SocketDotTech/socket-test-app/tree/master/src/read).
:::

## Common errors

<details>
   <summary>I cannot see transactions for my new AppGateway on the EVMx explorer</summary>

    Please confirm you have updated the `APP_GATEWAY` variable on the `.env` file.

    If you have exported your `.env` file, please confirm that the variable is up to date on your environment.
</details>

<details>
   <summary>Deploying onchain contracts is reverting with `0x8d53e553` - `InsufficientFees()`</summary>

    Please confirm you have deposited enough to pay for fees.
    - See how to [Deposit fees](/getting-started#deposit-fees).
    - [Check your AppGateway fee balance](/getting-started#check-your-appgateway-fee-balance).
</details>

<details>
   <summary>Calling onchain contracts via EVMx is reverting with `0xb9521e1a` - `AsyncModifierNotUsed()`</summary>

    Please confirm the function you're calling has the `async` modifier as it is expected to wait for a promise since it is either reading or writing information onchain. See [key components for onchain calls](/read-onchain-from-evmx#key-components).
</details>

<details>
   <summary>Calling onchain contracts via EVMx is reverting with generic EVM error</summary>

    Please confirm you are passing the forwarder contract address and not the onchain contract address. See [key components for onchain calls](/read-onchain-from-evmx#key-components).
</details>
