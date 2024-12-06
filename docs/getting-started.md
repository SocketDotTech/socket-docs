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
- Walk through a `CounterAppGateway` contract to orchestrate updates on multiple counter instances.

# 2. Setting Up Your Environment

1. **Clone the Starter Kit**

   The repository includes pre-built examples of `Counter` and `CounterAppGateway` contracts.

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

   To pay for the transactions on offchainVM you need native tokens. You can get offchainVM ETH using [the bridge](https://socket-composer-testnet-8b802af208e24e82.testnets.rollbridge.app/) or you can get ETH directly on offchainVM using [the faucet](https://faucet.conduit.xyz/socket-composer-testnet).

5. **Deploy the all contracts on the offchainVM and on chain instances**

   This command deploys all contracts on offchainVM. It includes the `Counter`, `CounterDeployer`, `CounterAppGateway`. These contracts collectively dictate how your app instance on each chain has to be deployed and composed.

   ```bash
   forge script script/Deploy.s.sol --broadcast  --skip-simulation
   ```

   You will see the deployed addresses in script logs under names `Counter Deployer`, `Counter AppGateway`.

   :::tip
   Please ensure you have `--skip-simulation` on the above command otherise Foundry may overestimate how much it takes to deploy.
   :::

   Add the deployed addresses in env for using in rest of the tutorial

   ```bash
   export COUNTER_APP_GATEWAY=<Counter App Address>;
   export COUNTER_DEPLOYER=<Counter Deployer Address>;
   ```

6. **Set up fees.**

   In this example we will be paying fees on Arbitrum Sepolia as configured in `script/Deploy.s.sol`.

   To pay for this increment counter transaction, deposit `arbsepETH` to the contract address of the `PayloadDeliveryPlug` by running:

   ```bash
   cast send 0x804Af74b5b3865872bEf354e286124253782FA95 "deposit(address,uint256,address)" \
       0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE \
       <AMOUNT> \
       $COUNTER_APP_GATEWAY \
       --value <AMOUNT> \
       --rpc-url $ARBITRUM_SEPOLIA_RPC \
       --private-key $PRIVATE_KEY
   ```

   Replace `<AMOUNT>` in wei with more than 0.01 ETH. Please ensure the wallet you are using has at least 0.01 Arbitrum Sepolia ETH. Feel free to use any of the supported chains and run the command accordingly.
   You can pay using any token on a chain of your choice that has a `PayloadDelivery` contract. You can deposit them to a `PayloadDelivery` on any chain by calling the `deposit` function. Find all about the available `PayloadDelivery` addresses [here](/chain-information) and about fees [here](/fees)

7. **Deploy onchain contracts**

   ```bash
   forge script script/deployOnchain.s.sol --broadcast
   ```

   Let's ensure that the funds have been spent to pay for the transaction by running,

   ```bash
   https://apiv2.dev.socket.tech/getDetailsByTxHash?txHash=<TX_HASH>
   ```

   Replace `<TX_HASH>` with the last transaction executed and ensure status is `COMPLETED`.

8. **Increment multiple counters**

   To increment the various counters deployed on all different chains by different values we will run,
   ```bash
   forge script script/incrementCounters.s.sol --broadcast
   ```

   Read [here](/call-contracts#2-call-forwarders) to learn more about how forwarder addresses are assigned on the offchainVM to represent onchain contracts.

9. **Check that the counters on chain have incremented**

   ```bash
   forge script script/checkCounters.s.sol
   ```

# 3. Understanding the Components

## **Counter**

   This is the instance of the app that is deployed on chain. Unlike a normal counter, the `increase` function of this counter is called via SOCKET.

   ```solidity
    contract Counter is Ownable(msg.sender) {
        address public socket;
        uint256 public counter;

        modifier onlySocket() {
            require(msg.sender == socket, "not socket");
            _;
        }

        function setSocket(address _socket) external onlyOwner {
            socket = _socket;
        }

        function getSocket() external view returns (address) {
            return socket;
        }

        function increase() external onlySocket {
            counter++;
        }
    }
   ```

## **CounterAppGateway**

   `CounterAppGateway` is an `AppGateway`. It is a contract deployed on offchainVM and not on chain. It dictates how the onchain contracts are called and composed. In this example when someone calls the `incrementCounters` function, it internally triggers calls to `increase` function on each provided instance. This is an [onchain write](/call-contracts) triggered from AppGateway. You can also [make read calls](/read) to the chains to use their state.

   ```solidity
    contract CounterAppGateway is AppGatewayBase {
        constructor(
            address _addressResolver,
            address deployerContract_,
            FeesData memory feesData_
        ) AppGatewayBase(_addressResolver) {
            addressResolver.setContractsToGateways(deployerContract_);
            _setFeesData(feesData_);
        }

        function incrementCounters(address[] memory instances) public async {
            for (uint256 i = 0; i < instances.length; i++) {
                Counter(instances[i]).increase();
            }
        }

        function setFees(FeesData memory feesData_) public {
            feesData = feesData_;
        }
    }
   ```

## **CounterDeployer**

   The Deployer contract is deployed to offchainVM and indicates how app contracts are to be deployed and initialized on a chain. You can read more about chain abstracted deployments [here](/deploy).

   ```solidity
    contract CounterDeployer is AppDeployerBase {
        bytes32 public counter = _createContractId("counter");

        constructor(
            address addressResolver_,
            FeesData memory feesData_
        ) AppDeployerBase(addressResolver_) {
            creationCodeWithArgs[counter] = type(Counter).creationCode;
            _setFeesData(feesData_);
        }

        function deployContracts(uint32 chainSlug) external async {
            _deploy(counter, chainSlug);
        }

        function initialize(uint32 chainSlug) public override async {
            address socket = getSocketAddress(chainSlug);
            address counterForwarder = forwarderAddresses[counter][chainSlug];
            Counter(counterForwarder).setSocket(socket);
        }

        function setFees(FeesData memory feesData_) public {
            feesData = feesData_;
        }
    }
   ```
