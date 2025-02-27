---
id: getting-started
title: Getting Started
---

In this tutorial, we’ll demonstrate how to implement an extended version of the `Counter.sol` contract, inspired by the default Foundry example. Unlike a traditional counter deployed on a single chain, our counter will be deployed across multiple chains, and we will interact with it in a **chain-abstracted fashion**.

This example highlights how to abstract away blockchain-specific details, enabling seamless contract interactions across multiple chains through the SOCKET Protocol. By leveraging chain abstraction, developers can focus on application logic without worrying about the complexities of inter-chain communication.

**You’ll learn how to**

- Set up the environment with pre-configured contracts.
- Extend a simple `Counter` contract into a **chain-abstracted** version.
- Walk through a `CounterAppGateway` contract to orchestrate updates on multiple counter instances.

## Setting Up Your Environment

1. **Clone the Starter Kit**

   The repository includes pre-built examples of `Counter` and `CounterAppGateway` contracts.

   ```bash
   git clone https://github.com/SocketDotTech/socket-starter-kit
   cd socket-starter-kit
   ```

1. **Install Dependencies**

   Use forge to install the required libraries.

   ```bash
   forge install
   ```

   :::tip
   Make sure foundry is atleast on following version. Pay attention to the **date** part.

   `forge 0.2.0 (9a0f66e 2024-09-26T00:20:35.649925000Z)`
   :::

1. **Set Up Environment Variables**

   Copy the provided `.env.sample` file and set proper values for private key and rpc.

   You can get the rpc and other details [here](/chain-information).

   ```bash
   cp .env.sample .env
   vi .env
   ```

1. **Deploy the all contracts on EVMx**

   This command deploys all contracts on EVMx. It includes the `Counter` and `CounterAppGateway`. These contracts collectively dictate how your app instance on each chain has to be deployed and composed.

   ```bash
   forge script script/counter/DeployEVMxCounterApp.s.sol --broadcast --skip-simulation --legacy --with-gas-price 0
   ```

   You will see the deployed addresse in script logs under the name `CounterAppGateway`.

   :::tip
   Please ensure you have `--skip-simulation` on the above command otherise Foundry may overestimate how much it takes to deploy.
   :::

   Add the deployed address in env for using in rest of the tutorial.

   ```bash
   export APP_GATEWAY=<Counter App Address>;
   ```

1. **Set up fees to pay for your App transactions**

   In this example we will be paying fees on Arbitrum Sepolia as configured in `script/deployEVMxCounterApp.s.sol`.

   To pay for this increment counter transaction, deposit `arbsepETH` to the `FeesPlug` contract address by running:

   ```bash
   forge script script/helpers/PayFeesInArbitrumETH.s.sol --broadcast  --skip-simulation
   ```

   :::tip
   Please ensure the wallet you are using has at least 0.01 Arbitrum Sepolia ETH.
   Don't forget to export `ARBITRUM_SEPOLIA_RPC` if you do not have it in your environment yet.
   :::

   :::note
   You can pay using any token on any of the supported chains that has a `FeesPlug` contract.
   You can deposit them to a `FeesPlug` on any chain by calling the `deposit` function.
   Find all about the available `FeesPlug` addresses [here](/chain-information) and about fees [here](/fees)
   :::

   Confirm your available fees to pay for transactions at any time by running:

   ```bash
   forge script script/helpers/AppGatewayFeeBalance.s.sol
   ```

1. **Deploy onchain contracts**

   ```bash
   forge script script/counter/DeployOnchainCounters.s.sol --broadcast --skip-simulation --legacy --with-gas-price 0
   ```

   Let's ensure that the funds have been spent to pay for the transaction by running,

   ```bash
   https://api-evmx-devnet.socket.tech/getDetailsByTxHash?txHash=<TX_HASH>
   ```

   Replace `<TX_HASH>` with the last transaction executed and ensure status is `COMPLETED`. If you want to monitor all transactions at the same time you can run:

   ```bash
   node script/transactionStatus.js DeployOnchainCounters
   ```

1. **Increment multiple counters**

   To increment the various counters deployed on all different chains by different values we will run,

   ```bash
   forge script script/counter/IncrementCountersFromApp.s.sol --broadcast --skip-simulation --legacy --with-gas-price 0
   ```

   Read [here](/forwarder-addresses) to learn more about how forwarder addresses are assigned on the EVMx to represent onchain contracts.

   If you want to know when the transaction is complete you can run the command below or directly use the API as described in the previous step.

   ```bash
   node script/transactionStatus.js IncrementCountersFromApp
   ```

1. **Check that the counters onchain have incremented**

   ```bash
   forge script script/counter/ReadOnchainCounters.s.sol --skip-simulation
   ```

1. **Withdraw your AppGateway Fee balance**

    ```bash
    forge script script/counter/WithdrawFeesArbitrumFeesPlug.s.sol --skip-simulation
    ```

## Understanding the Components

- **Counter:** This is the instance of the app that is deployed . Unlike a normal counter, the `increase` function of this counter is called via EVMx.

- **CounterAppGateway:** `CounterAppGateway` is an `AppGateway`. It is a contract deployed on EVMx and not onchain. It dictates how the onchain contracts are called, composed, deployed and initalized. You can read more about chain abstracted deployments [here](/deploy). In this example when someone calls the `incrementCounters` function, it internally triggers calls to `increase` function on each provided instance. This is an [onchain write](/call-contracts) triggered from AppGateway. You can also [make read calls](/read) to the chains to use their state (see `readCounters`).

[↘ Learn more about how to build applications on SOCKET](/writing-apps#architecture-overview)
