---
id: getting-started
title: Getting Started
---

# Getting Started

# 1. Introduction

In this tutorial, we’ll demonstrate how to implement an extended version of the `Counter.sol` contract, inspired by the default Foundry example. Unlike a traditional counter deployed on a single chain, our counter will be deployed across multiple chains, and we will interact with it in a **chain-abstracted fashion**.

This example highlights how to abstract away blockchain-specific details, enabling seamless contract interactions across multiple chains through the Socket Protocol. By leveraging chain abstraction, developers can focus on application logic without worrying about the complexities of inter-chain communication.

**You’ll learn how to**

- Set up the environment with pre-configured contracts.
- Extend a simple `Counter` contract into a **chain-abstracted** version.
- Walk through a `CounterComposer` contract to orchestrate updates on multiple counter instances.

# 2. Setting Up Your Environment

1. **Clone the Starter Kit**

   The repository includes pre-built examples of `Counter` and `CounterComposer` contracts.

   ```bash
   git clone https://github.com/SocketDotTech/socket-starter-kit
   cd socket-starter-kit
   ```

2. **Install Dependencies**

   Use forge to install the required libraries.

   ```bash
   forge install
   ```

3. **Set Up Environment Variables**

   Copy the provided `.env.sample` file and set proper values for private key and rpc.

   You can get the rpc and other details [here](/chain-information).

   ```bash
   cp .env.sample .env
   vi .env
   ```

4. **Get offchainVM ETH**

   To pay for the transactions on offchainVM you need native tokens. You can get Sepolia ETH using [the bridge](https://socket-composer-testnet-8b802af208e24e82.testnets.rollbridge.app/) or you can get ETH directly on offchainVM using [the faucet](https://faucet.conduit.xyz/socket-composer-testnet).

5. **Deploy the all contracts on the offchainVM and on chain instances**

   This command deploys all contracts on offchainVM. It includes the `Counter`, `CounterDeployer`, `CounterComposer`. These contracts collectively dictate how your app instance on each chain has to be deployed and composed.

   ```bash
   forge run script/Deploy.s.sol
   ```

6. **Set up fees.**

   To pay for the transactions socket makes for you on chain, you can pay using any token on a chain of your choice. You can deposit them to a `PayloadDelivery` on any chain by calling the deposit function. Find more about fees [here](https://www.notion.so/Fees-yeah-14d818fd2858801daec8fc60fa4631b5?pvs=21) and about all `PayloadDelivery` addresses [here](/chain-information).

   In this example we will be paying fees on Arbitrum Sepolia as you can see configured on the `Deploy.s.sol` script.

   ```solidity
   function deposit(
       address token, // the token address
       uint256 amount, // amount of tokens to deposit
       address appGateway_ // address of your app gateway on offchainVM
   ) external payable {}
   ```

7. **Increment multiple counters**

   This script makes a transaction to `CounterComposer` contract. This would internally call each `Counter` instance on specified chains.

   ```solidity
   forge run script/incrementCounters.s.sol
   ```

8. **Check that the counters on chain have incremented**

   ```solidity
   forge run script/checkCounters.s.sol
   ```

# 3. Understanding the Components

1. **Counter**

   This is the instance of the app that is deployed on chain. Unlike a normal counter, the `increase` function of this counter is called via SOCKET.

   ```solidity
   contract Counter {
       address public socket;
       uint256 public counter;

       modifier onlySOCKET() {
           require(msg.sender == socket, "not SOCKET");
           _;
       }

       function setSocket(address _socket) external {
           socket = _socket;
       }

       // Called by SOCKET protocol
       function increase() external onlySOCKET {
           counter++;
       }
   }
   ```

2. **CounterComposer**

   `CounterComposer` is an `AppGateway`. It is a contract deployed on offchainVM and not on chain. It dictates how the onchain contracts are called and composed. In this example when someone calls the `incrementCounters` function, it internally triggers calls to `increase` function on each provided instance. This is an [onchain write](https://www.notion.so/How-to-call-smart-contracts-14d818fd2858808281cce0ca530b2e66?pvs=21) triggered from AppGateway. You can also [make read calls](https://www.notion.so/How-to-read-onchain-state-5029cd58e81f45a092228673bf395bf3?pvs=21) to the chains to use their state.

   ```solidity
   // CounterComposer is an AppGateway, this is the entry point for your app.
   contract CounterComposer is AppGatewayBase {
       constructor(
           address _addressResolver,
           address deployerContract_,
           FeesData memory feesData_
       ) AppGatewayBase(_addressResolver, feesData_) Ownable(msg.sender) {
           addressResolver.setContractsToGateways(deployerContract_);
       }

       function incrementCounters(
           address[] memory instances
       ) public async(abi.encode(_instance)) {
           // the increase function is called on given list of instances
           // this
           for (uint256 i = 0; i < instances.length; i++) {
               Counter(instances[i]).increase();
           }
       }
   }
   ```

3. **CounterDeployer**

   The Deployer contract is deployed to offchainVM and indicates how app contracts are to be deployed and initialized on a chain. You can read more about chain abstracted deployments [here](https://www.notion.so/How-to-deploy-17695b777dcd43dc98a39585d25aeea3?pvs=21).

   ```solidity
   contract CounterDeployer is AppDeployerBase {
       address public counter;

       constructor(
           address addressResolver_,
           FeesData memory feesData_
       ) AppDeployerBase(addressResolver_, feesData_) Ownable(msg.sender) {
           counter = address(new Counter());
           creationCodeWithArgs[counter] = type(Counter).creationCode;
       }

       function deployContracts(
           uint32 chainSlug
       ) external async(abi.encode(chainSlug)) {
           _deploy(counter, chainSlug);
       }

       function initialize(uint32 chainSlug) public override async(abi.encode(chainSlug)) {
           address socket = getSocketAddress(chainSlug);
           address counterForwarder = forwarderAddresses[counter][chainSlug];
           Counter(counterForwarder).setSocket(socket);
       }
   }
   ```
