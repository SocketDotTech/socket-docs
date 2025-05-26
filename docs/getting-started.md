---
id: getting-started
title: Getting Started
---

# Building a chain-abstracted Counter

This tutorial walks you through building a chain-abstracted version of the classic `Counter.sol` contract from Foundry. While the traditional Foundry counter lives on a single blockchain, we'll create one that spans multiple chains and can be controlled from a single interface.

This example introduces the core components of the SOCKET Protocol while keeping things very simple. The aim is to demonstrate how these different components interact with one another and what a typical flow looks like. Each component (AppGateway, Switchboard, Plugs, etc.) is fully programmable and customizable, as long as it implements the required interfaces. This flexibility means you can adapt SOCKET Protocol to support virtually any chain-abstracted use case you can imagine.

**You'll learn how to**

- Deploy an AppGateway on SOCKET's EVMx which is hosted by a [Watcher](/watchers) node.
- Deploy an onchain application (Counter.sol) on multiple chains through our deployed AppGateway.
- Leverage SOCKET's AppGateway to orchestrate updates on multiple Counter instances across chains.

## Clone the Starter Kit

Clone our starter kit repository which contains:
- `Counter.sol` contract for chain-abstracted deployment
- `CounterAppGateway.sol` for managing chain-abstracted interactions
- Helper scripts for deployment and testing

```bash
git clone https://github.com/SocketDotTech/socket-starter-kit
cd socket-starter-kit
```

## Install Dependencies

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

## Set Up Environment Variables

Copy the `.env.sample` file and add your private key:

```bash
cp .env.sample .env
vi .env
```

Add your private key to the `.env` file.
<!-- TODO: explain the priviliges of that wallet? right now there dont seem to be any cause owner restrictions dont seem to exist -->

## Deploy the AppGateway contract on EVMx

The command below deploys the `CounterAppGateway` contracts on EVMx. The application gateway contract in this example coordinates how the `Counter` instances on each chain are deployed and how they can be interacted with from a single interface.

:::note What is EVMx?
EVMx is SOCKET Protocol's specialized execution environment that runs on [Watcher](/watchers) nodes. It acts as an offchain orchestration layer where you can deploy contracts that coordinate actions across multiple blockchains.

Since it runs the EVM, Solidity developers can work with familiar types and patterns without needing external libraries when implementing their offchain logic through the `AppGateway`.

SOCKET Protocol enhanced this EVM environment to support `async` operations, enabling it to wait for and react to chain-abstracted events. This set up makes it very easy to test your offchain orchestration state with foundry.
:::

```bash
forge script script/counter/DeployEVMxCounterApp.s.sol --broadcast --skip-simulation --legacy --with-gas-price 0
```

After successful deployment, locate the `CounterAppGateway` address in the script output logs. Add the address to your `.env` file under the `APP_GATEWAY` variable.

:::tip
Always include the `--skip-simulation` flag when deploying to EVMx as shown above. Without it, Foundry may incorrectly estimate gas costs, as EVMx's execution model differs from standard EVM chains.
:::

## Set up fees to pay for your App transactions

SOCKET Protocol uses a prepaid fee model where you deposit funds to cover all aspects of chain-abstracted execution, including:

- Gas costs for transaction execution on destination chains
- Transmitter service fees for relaying messages between chains
- Infrastructure costs for the SOCKET Protocol network

### How the fee system works

* Fees are deposited into a `FeesPlug` contract on any supported chain.
* These funds are credited on EVMx and can be used to pay fees or perform transactions.
* When chain-abstracted calls are processed, the necessary amount is drawn from these funds.
* The collected fees are distributed between [Transmitters](/transmitters) (who relay the transactions) and the SOCKET Protocol infrastructure.
* Any unused fees remain in the `FeesPlug` contract and are available for your application gateway's future transactions.

### Deposit fees

In this example, we'll deposit 100 TestUSDC for fees on **Arbitrum Sepolia** `FeesPlug` contract as configured in `script/helpers/PayFeesInArbitrumTestUSDC.s.sol`:

```bash
forge script script/helpers/PayFeesInArbitrumTestUSDC.s.sol --broadcast --skip-simulation
```

:::tip
Ensure your wallet has enough **Arbitrum Sepolia ETH** to mint and transfer TestUSDC. You can get testnet ETH from the [Arbitrum Sepolia faucet](https://www.alchemy.com/faucets/arbitrum-sepolia).
:::

### Check your AppGateway fee balance

Verify your available fees at any time by running:

```bash
forge script script/helpers/AppGatewayFeeBalance.s.sol
```

:::note Fee flexibility
You have options for how to pay fees:

- **Multiple chains**: Deposit to any chain with a `FeesPlug` contract
- **Direct deposits**: Call the `depositToFeeAndNative()` function directly on any `FeesPlug` contract

See the [EVMx](/evmx) page for available `FeesPlug` addresses and [fee documentation](/fees) for more details.
:::

## Deploy onchain contracts

Now that we have our AppGateway deployed on EVMx and fees deposited, we'll deploy the actual `Counter` instances on multiple EVM chains:

- **Base Sepolia**
- **Arbitrum Sepolia**
- **Optimism Sepolia**

This single command deploys and initializes `Counter` contracts across all target chains:

```bash
forge script script/counter/DeployOnchainCounters.s.sol --broadcast --skip-simulation --legacy --with-gas-price 0
```

What happens behind the scenes:

The deployment process follows these steps:

1. **Initialization**: The script calls `deployContracts()` on the CounterAppGateway.

2. **Promise Creation**: An `AsyncPromise` contract is created to track the completion status of the deployment.

3. **Queueing**: The deployment request is queued in a `DeliveryHelper` contract on EVMx.

4. **Payload Processing**: Queued items are processed into `PayloadDetails` and submitted for auction.

5. **Transmitter Bidding**: Offchain [Transmitters](/transmitters) bid to execute the requested deployments.

6. **Watcher Attestation**: Once a winning bid is selected, the watcher attests it on the Fast [Switchboard](/switchboards) on the target chain.

7. **Onchain Execution**: The [Transmitter](/transmitters) executes the deployment on the target chain through the SOCKET contract, which verifies with the [Switchboard](/switchboards) that the Transmitter is authorized to execute the payload.

8. **Event Observation**: The [Watcher](/watchers) observes the execution events and resolves the `AsyncPromise` with the deployment result.

9. **Callback Execution**: This triggers the callback in the `AppGateway`, which:
   - Stores the deployed contract address
   - Deploys a Forwarder contract (an EVMx representation of the onchain deployed contract)
   - Sets up the Forwarder to handle future chain-abstracted calls

:::note Note
The Fast Switchboard used here is just one example of a simplified [Switchboard](/switchboards) implementation that allows a trusted [Watcher](/watchers) to attest that a given [Transmitter](/transmitters) is authorized to execute a specific payload. Switchboards can be customized to handle various verification methods and proof systems depending on your security requirements.
:::

<div style={{ display: 'flex', justifyContent: 'center' }}>
    <img src="/img/deploy_flow.svg" alt="deploy flow diagram" style={{ width: '100%' }} />
</div>


### Verify transaction completion

Chain-abstracted deployments aren't synchronous as shown in the flow above. You queue them within the app gateway and they get picked up by a transmitter to be relayed onchain. Let's verify that our `Counter` instances have been successfully deployed on all chains:

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

## Increment multiple counters

Now that the Counter instances have been deployed we can interact with them through a single interface, our `CounterAppGateway`. We will increment the counter on each chain by calling `incrementCounters`:

```bash
forge script script/counter/IncrementCountersFromApp.s.sol --broadcast --skip-simulation --legacy --with-gas-price 0
```

Behind the scenes this works similarly to the deployment process. The only difference is that we queue our onchain call to the `Counter` instance via their EVMx representation, the [forwarder](/forwarder-addresses) contract that was registered during deployment. Also, this time no callback is registered to run for when the counter has been successfully incremented on chain.

### Check that the counters onchain have incremented

You can also query each Counter contract directly on its respective chain to verify the new counter values. Or run the following script:

   ```bash
   forge script script/counter/ReadOnchainCounters.s.sol --skip-simulation
   ```

### Withdraw your AppGateway Fee balance

    ```bash
    forge script script/counter/WithdrawFeesArbitrumFeesPlug.s.sol --broadcast --skip-simulation --legacy --with-gas-price 0
    ```

## Conclusion

You've just built and deployed the most simplistic chain-abstracted application to understand the interaction of the various components that make up the SOCKET Protocol.

From here, you can explore more complex [use cases](/usecases) or dive deeper into [SOCKET Protocol's Architecture](/architecture).
