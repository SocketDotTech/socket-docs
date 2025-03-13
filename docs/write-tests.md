---
id: write-tests
title: Write tests for an AppGateway
---

Testing multi-chain applications with Foundry requires simulating both onchain behavior and the SOCKET Protocol's EVMx components (Watchers and Transmitters). The [SuperToken test suite](https://github.com/SocketDotTech/socket-protocol/blob/master/test/apps/SuperToken.t.sol) demonstrates how to effectively test multi-chain token transfers using Foundry's testing framework.

## Key testing components

### Setting up the test environment

Your test contract should inherit from `DeliveryHelperTest`, which provides the infrastructure for simulating SOCKET Protocol's multi-chain messaging:

```solidity
function setUp() public {
    setUpDeliveryHelper();
}
```

### Understanding `setUpDeliveryHelper()`

`setUpDeliveryHelper()` initializes the core infrastructure needed to simulate SOCKET Protocol's multi-chain messaging:

1. Deploys the EVMx core components
2. Sets up the fees manager for handling transaction fees
3. Creates the delivery helper for managing multi-chain message delivery
4. Initializes the auction manager for bid processing
5. Deploys and configures SOCKET Protocol contracts on test chains (Arbitrum and Optimism in this case)

### Executing Multi-Chain Operations

```solidity
_executeWriteBatchMultiChain(chainSlugs);
```

`_executeWriteBatchMultiChain()` simulates the entire multi-chain message delivery process:

1. Creates an async ID for the batch of operations
2. Simulates the bidding process for message delivery
3. Ends the auction and selects a winning bid
4. Executes the transactions on each target chain
5. Handles fee payments and finalizes the operations

This function is crucial for testing scenarios where data cannot be read or written synchronously across chains. Operations are batched together to be ran consecutively.

### Managing Contract Addresses

```solidity
getOnChainAndForwarderAddresses(uint32 chainSlug_, bytes32 contractId_)
```

This helper function retrieves two critical addresses:

1. The actual deployed contract address on the target chain
2. The forwarder address used by the SOCKET Protocol to route payloads to

These addresses are essential for:
- Verifying correct contract deployment
- Sending multi-chain payloads

## Best Practices

1. **Setup Organization**: Keep the setup logic modular and reusable across different test cases
2. **Chain Simulation**: Test with multiple chains to ensure multi-chain functionality works correctly
3. **Error Cases**: Include tests for failed transfers, insufficient balances, and expired deadlines
4. **Gas Optimization**: Monitor gas usage in tests to catch potential efficiency issues
5. **State Verification**: Always verify the final state on all involved chains after operations complete

:::info
[See a reference test suite from the SOCKET Protocol repository here](https://github.com/SocketDotTech/socket-protocol/blob/master/test/apps/SuperToken.t.sol).
:::
