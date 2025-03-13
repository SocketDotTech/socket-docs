---
id: write-tests
title: Test SOCKET Protocol Applications
---

Testing multi-chain applications with Foundry requires simulating both onchain behavior and the Socket Protocol's offchain components (Watchers, Transmitters). The SuperToken test suite demonstrates how to effectively test multi-chain token transfers using Foundry's testing framework.

## Key Testing Components

### Setting Up the Test Environment

The `SuperTokenTest` contract inherits from `DeliveryHelperTest`, which provides the infrastructure for simulating Socket Protocol's multi-chain messaging:

```solidity
function setUp() public {
    setUpDeliveryHelper();
    deploySuperTokenApp();
    contractIds[0] = appContracts.superToken;
}
```

### Understanding setUpDeliveryHelper()

`setUpDeliveryHelper()` initializes the core infrastructure needed to simulate Socket Protocol's multi-chain messaging:

1. Deploys the EVMx core components
2. Sets up the fees manager for handling transaction fees
3. Creates the delivery helper for managing multi-chain message delivery
4. Initializes the auction manager for bid processing
5. Deploys and configures Socket Protocol contracts on test chains (Arbitrum and Optimism in this case)

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

This function is crucial for testing scenarios like token transfers between chains, as seen in the `testTransfer()` function.

### Managing Contract Addresses

```solidity
getOnChainAndForwarderAddresses(
    uint32 chainSlug_,
    bytes32 contractId_,
)
```

This helper function retrieves two critical addresses:

1. The actual deployed contract address on the target chain
2. The forwarder address used by the Socket Protocol to route messages

These addresses are essential for:
- Verifying correct contract deployment
- Sending multi-chain messages
- Checking token balances across chains

### Example
<details>
   <summary>Here's a breakdown of how these components work together in the `testTransfer()` function</summary>
    ```solidity
    function testTransfer() public {
            beforeTransfer();

            (address onChainArb, address forwarderArb) = getOnChainAndForwarderAddresses(
                arbChainSlug,
                appContracts.superToken,
            );

            (address onChainOpt, address forwarderOpt) = getOnChainAndForwarderAddresses(
                optChainSlug,
                appContracts.superToken,
            );

            uint256 arbBalanceBefore = SuperToken(onChainArb).balanceOf(owner);
            uint256 optBalanceBefore = SuperToken(onChainOpt).balanceOf(owner);

            transferOrder = SuperTokenAppGateway.TransferOrder({
                srcToken: forwarderArb,
                dstToken: forwarderOpt,
                user: owner,
                srcAmount: srcAmount,
                deadline: block.timestamp + 1000000
            });
            bytes memory encodedOrder = abi.encode(transferOrder);
            appContracts.superTokenApp.transfer(encodedOrder);

            uint32[] memory chainSlugs = new uint32[](2);
            chainSlugs[0] = IForwarder(forwarderArb).getChainSlug();
            chainSlugs[1] = IForwarder(forwarderOpt).getChainSlug();
            // You can run the function below whenever you want to simulate the onchain execution for
            // the txs in batch of the current asyncId. It bids, finalises, relays and resolves promises
            _executeWriteBatchMultiChain(chainSlugs);

            assertEq(
                SuperToken(onChainArb).balanceOf(owner),
                arbBalanceBefore - srcAmount,
                "Arb balance should be decreased by srcAmount"
            );
            assertEq(
                SuperToken(onChainOpt).balanceOf(owner),
                optBalanceBefore + srcAmount,
                "Opt balance should be increased by srcAmount"
            );
        }
    ```
</details>

## Best Practices

1. **Setup Organization**: Keep the setup logic modular and reusable across different test cases
2. **Chain Simulation**: Test with multiple chains to ensure multi-chain functionality works correctly
3. **Error Cases**: Include tests for failed transfers, insufficient balances, and expired deadlines
4. **Gas Optimization**: Monitor gas usage in tests to catch potential efficiency issues
5. **State Verification**: Always verify the final state on all involved chains after operations complete
