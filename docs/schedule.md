---
id: schedule
title: Schedule EVMx execution
---

Scheduling EVMx execution provides a powerful way to execute delayed operations on the blockchain. This functionality allows developers to schedule function calls that will automatically execute after a specified time period has elapsed, enabling time-based workflows and operations without requiring manual intervention.

[↘ See a reference implementation of this functionality here](https://github.com/SocketDotTech/socket-test-app/blob/master/src/schedule/ScheduleAppGateway.sol).

## How It Works

### Core Functionality

At its core, the scheduling EVMx execution allows you to:

1. **Register a timeout**: Schedule a function call to be executed after a specific delay in seconds
2. **Automatic execution**: Once the specified time has passed, the EVMx automatically executes the function
3. **Status tracking**: Monitor the state of your scheduled operations through APIs or events

### Under the Hood

The scheduling mechanism leverages the `setTimeout` function provided by the EVMx watcher precompile. When you schedule an operation:

1. You specify a target contract address, payload data, and a delay in seconds
2. The system generates a unique timeout ID for tracking purposes
3. The EVMx monitors the timeout and executes the payload when the time elapses
4. Upon execution the timeout status is updated

## Implementation Guide

### Creating a Scheduled Operation

To schedule an operation:

```solidity
// Define the payload (function selector and parameters)
bytes memory payload = abi.encodeWithSelector(targetFunction.selector, param1, param2);

// Register the timeout
watcherPrecompile__().setTimeout(targetAddress, payload, delayInSeconds);
```

The `setTimeout` function requires three parameters:
- `targetAddress`: The contract that will receive the function call
- `payload`: The encoded function call data
- `delayInSeconds`: Time delay before execution

### Handling Resolution

When a timeout is resolved, your target function will be called with the payload you provided. You can implement event emissions to notify listeners:

```solidity
function targetFunction(uint256 param1, uint256 param2) public {
    // Function logic here
    emit TimeoutCompleted(param1, param2, block.timestamp);
}
```

## Monitoring Scheduled Operations

### API Monitoring

You can track the status of timeout operations using the timeout API endpoint:

```
GET /timeout?txHash=<TRANSACTION_HASH>
```

Query parameters (at least one required):
- `timeoutId`: The specific timeout identifier
- `txHash`: Transaction hash that created the timeout
- `target`: Contract address that will be called

The API returns detailed information about the timeout, including:
- Creation and execution timestamps
- Current status
- Transaction hashes
- Payload data

See more information about the API endpoint [here](/api#timeout---timeout-details).

### Event Monitoring

Alternatively, you can listen for events emitted when timeouts are resolved if you're emitting events on the `targetFunction`. This approach is ideal for applications that need real-time notifications of completed timeouts.

## Use Cases

The EVMx Scheduling System enables various use cases:

- **Delayed settlements**: Schedule payments or transfers to occur at specific times
- **Time-locked operations**: Execute contract functions only after a cooling-off period
- **Recurring operations**: Implement periodic actions by chaining timeouts
- **Conditional execution**: Schedule operations that depend on time-based conditions
- **Governance timeouts**: Enforce waiting periods for governance proposals

## Best Practices

- **Error handling**: Implement robust error handling in timeout resolution functions
- **Event monitoring**: Use both API polling and event listeners for critical applications
- **Timeout duration**: When setting very long timeouts for transaction execution resolved on EVMx. If the execution triggers an onchain transaction via the `targetFunction` after the timeout, ensure gas market dynamics are accounted for to optimize execution cost and reliability.

:::info
[See a reference implementation of this functionality here](https://github.com/SocketDotTech/socket-test-app/blob/master/src/schedule/ScheduleAppGateway.sol).
:::
