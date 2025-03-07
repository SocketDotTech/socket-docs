---
id: getting-started
title: Getting Started
---

# Building a Cross-Chain Counter

This tutorial walks you through building a cross-chain version of the classic `Counter.sol` contract from Foundry. While the traditional Foundry counter lives on a single blockchain, we'll create one that spans multiple chains and can be controlled from a single interface.

This example introduces the core components of the Socket Protocol while keeping things very simple. The aim is to demonstrate how these different components interact with one another and what a typical flow looks like. Each component (AppGateway, Switchboard, Plugs, etc.) is fully programmable and customizable, as long as it implements the required interfaces. This flexibility means you can adapt Socket Protocol to support virtually any cross-chain use case you can imagine.

**You'll learn how to**

- Deploy an AppGateway on Socket's EVMx which is hosted by a watcher node.
- Deploy an onchain application (Counter.sol) on multiple chains through our deployed AppGateway.
- Leverage Socket's AppGateway to orchestrate updates on multiple Counter instances across chains.

1. ### Clone the Starter Kit

Clone our starter kit repository which contains:
- `Counter.sol` contract for cross-chain deployment
- `CounterAppGateway.sol` for managing cross-chain interactions
- Helper scripts for deployment and testing

```bash
git clone https://github.com/SocketDotTech/socket-starter-kit
cd socket-starter-kit
```
1. ### Install Dependencies

Install the required Foundry dependencies:

```bash
forge install
```

:::tip Foundry Version Requirements
This project requires Foundry version 0.2.0 or later (minimum build date: 2024-09-26).

To check your version:
```bash
forge --version
```

To update Foundry:
```bash
foundryup
```
:::
1. ### Set Up Environment Variables

Copy the `.env.sample` file and add your private key:

```bash
cp .env.sample .env
vi .env
```

Add your private key to the `.env` file. TODO: explain the priviliges of that wallet? right now there dont seem to be any cause owner restrictions dont seem to exist.

1. ### Deploy the AppGateway contract on EVMx

This command below deploys the `CounterAppGateway` contracts on EVMx. The off chain gateway contract in this example coordinates how the Counter instances on each chain are deployed and how they can be interacted with from a single interface.

:::note What is EVMx?
EVMx is Socket Protocol's specialized execution environment that runs on watcher nodes. It acts as an off-chain orchestration layer where you can deploy contracts that coordinate actions across multiple blockchains. Since it runs the EVM, Solidity developers can work with familiar types and patterns without needing external libraries when implementing their off chain logic through the AppGateway. Socket Protocol enhanced this EVM environment to support async operations, enabling it to wait for and react to cross-chain events. This set up makes it very easy to test your off-chain orchestration state with foundry.
:::

```bash
forge script script/counter/DeployEVMxCounterApp.s.sol --broadcast --skip-simulation --legacy --with-gas-price 0
```

:::tip
Always include the `--skip-simulation` flag when deploying to EVMx as shown above. Without it, Foundry may incorrectly estimate gas costs, as EVMx's execution model differs from standard EVM chains.
:::

After successful deployment, locate the `CounterAppGateway` address in the script output logs. Add the address to your `.env` file under the `APP_GATEWAY` variable.

```bash
   APP_GATEWAY=<Counter App Address>;
   ```

1. ### Set up fees to pay for your App transactions

Socket Protocol uses a prepaid fee model where you deposit funds to cover all aspects of cross-chain execution, including:


- Gas costs for transaction execution on destination chains
- Transmitter service fees for relaying messages between chains
- Infrastructure costs for the Socket Protocol network

### How the fee system works

- Fees are deposited into `FeesPlug` contract on a a specific chain configured in the AppGateway
- These funds are drawn from when cross-chain messages are processed
- The fees are distributed between transmitters (who relay transactions) and the Socket Protocol infrastructure
- Unused fees remain in your FeesPlug balance for future transactions

### Deposit fees

In this example, we'll deposit fees on **Arbitrum Sepolia** as configured in `script/deployEVMxCounterApp.s.sol`:

:::tip
Ensure your wallet has at least **0.001 Arbitrum Sepolia ETH**. You can get test ETH from the [Arbitrum Sepolia faucet](https://www.alchemy.com/faucets/arbitrum-sepolia).
:::

```bash
# Deposits 0.001 arbsepETH to the FeesPlug contract
forge script script/helpers/PayFeesInArbitrumETH.s.sol --broadcast --skip-simulation

### Check your fee balance

Verify your available fees at any time by running:

```bash
forge script script/helpers/AppGatewayFeeBalance.s.sol
```

:::note Fee flexibility
You have options for how to pay fees:

- **Multiple tokens**: Pay using various tokens on supported chains
- **Multiple chains**: Deposit to any chain with a `FeesPlug` contract
- **Direct deposits**: Call the `deposit()` function directly on any `FeesPlug` contract

See the [chain information](/chain-information) page for available `FeesPlug` addresses and the [fees documentation](/fees) for more details.
:::


1. ### Deploy onchain contracts

Now that we have our AppGateway deployed on EVMx and fees configured, we'll deploy actual Counter instances on multiple EVM chains:

- **Base Sepolia**
- **Arbitrum Sepolia**
- **Optimism Sepolia**

This single command deploys and initializes Counter contracts across all target chains:

```bash
forge script script/counter/DeployOnchainCounters.s.sol --broadcast --skip-simulation --legacy --with-gas-price 0
```

The deployment process follows these steps:

1. **Initiation**: The script calls `deployContracts()` on the CounterAppGateway.

2. **Promise Creation**: An AsyncPromise contract is created to track the completion status of the deployment.

3. **Queueing**: The deployment request is queued in a DeliveryHelper contract on EVMx.

4. **Payload Processing**: Queued items are processed into PayloadDetails and submitted for auction.

5. **Transmitter Bidding**: Off-chain transmitters bid to execute the requested deployments.

6. **Watcher Attestation**: Once a winning bid is selected, the watcher attests it on the FastSwitchboard on the target chain.

7. **On-chain Execution**: The transmitter executes the deployment on the target chain through the Socket contract, which verifies with the switchboard that the transmitter is authorized to execute the payload.

8. **Event Observation**: The Watcher observes the execution events and resolves the AsyncPromise with the deployment result.

9. **Callback Execution**: This triggers the callback in the AppGateway, which:
   - Stores the deployed contract address
   - Deploys a Forwarder contract (an EVMx representation of the on-chain deployed contract)
   - Sets up the Forwarder to handle future cross-chain calls

> **Note**: The FastSwitchboard used here is just one example of a simplified switchboard implementation that allows a trusted watcher to attest that a given transmitter is authorized to execute a specific payload. Switchboards can be customized to handle various verification methods and proof systems depending on your security requirements.

<div style={{ display: 'flex', justifyContent: 'center' }}>
    <img src="/img/deploy_flow.svg" alt="deploy flow diagram" style={{ width: '100%' }} />
</div>


### Verify transaction completion

Cross-chain deployments aren't synchronous as shown in the flow above. You queue them within the app gateway and they get picked up by a transmitter to be relayed onchain. Let's verify that our Counter instances have been successfully deployed on all chains:

```bash
# Replace <TX_HASH> with the transaction hash from your deployment output for each chain:
curl https://api-evmx-devnet.socket.tech/getDetailsByTxHash?txHash=<TX_HASH>
```

Ensure the status is `COMPLETED`. For convenience, you can monitor all deployment transactions at once using:

```bash
node script/transactionStatus.js DeployOnchainCounters
```

:::tip
The deployment process may take a few minutes as transactions need to confirm on each target chain.
:::

1. ### Increment multiple counters

Now that the Counter instances have been deployed we can interact with them through a single interface, our CounterAppGateway. We will increment the counter on each chain by calling `incrementCounters`:

```bash
forge script script/counter/IncrementCountersFromApp.s.sol --broadcast --skip-simulation --legacy --with-gas-price 0
```

Behind the scenes this works similarly to the deployment process. The only difference is that we queue our onchain call to the Counter instance via their EVMx representation, the forwarder contract that was registered during deployment. Also this time no callback is registered to run for when the Counter has been successfully incremented on chain.

### Monitoring Transaction Status

To check the status of your cross-chain counter increments:

```bash
node script/transactionStatus.js IncrementCountersFromApp
```

You can also query each Counter contract directly on its respective chain to verify the new counter values.

## Conclusion

You've just built and deployed the most simplistic cross-chain application in order to understand the interaction of the various components that make up the Socket Protocol

From here, you can explore more complex [use Cases](/use-cases) or dive deeper into [Socket Protocol's Architecture](/architecture). 
