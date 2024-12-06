---
id: writing-apps
title: Writting Apps on SOCKET
---

# Writing Apps on SOCKET

# 1. Introduction

In this guide, we’ll build a **Airdrop application** using the Socket Protocol. Make sure your environment is set up with [socket-starter-kit](/getting-started) before proceeding.

You’ll learn how to:

- Create a multi-chain mintable and burnable token contract.
- Build an airdrop mechanism.
- Use offchainVM to check eligibility and trigger on-chain minting.
- Deploy and test your app across multiple chains.

# 2. Architecture Overview

The System consists of 3 main components.

- An on chain **ERC20 Token Contract** that can be deployed to any chain.
- A **Deployer Contract** on offchainVM to deploy the **ERC20 Token** instances.
- An **AppGateway Contract** on offchainVM that verifies users and triggers minting of tokens on desired instance.

### **Deployment Flow**

![deployment_flow.png](../static/img/deployment_flow.png)

### Mint flow

![mint_flow.png](../static/img/mint_flow.png)

# 3. Step-by-Step Implementation

To begin, we’ll implement a token contract for our application. The token will be an ERC20 token with mint and burn capabilities, specifically designed to interact with the Socket Protocol. We'll use **Solady**, a lightweight library for ERC20 implementation.

### Install Solmate

Install Solady as a dependency using Forge:

```bash
forge install vectorized/solady
```

### Token Contract Implementation: MyToken.sol

Here’s the implementation of the `MyToken` contract that uses Solmate's ERC20 as a base. Apart from the standard ERC20 functionality, it has functions to mint and burn tokens from the `AppGateway`.

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "solady/tokens/ERC20.sol";

contract MyToken is ERC20 {
    string private _name;
    string private _symbol;
    uint8 private _decimals;

    address public _SOCKET;

    constructor(string memory name_, string memory symbol_, uint8 decimals_) {
        _name = name_;
        _symbol = symbol_;
        _decimals = decimals_;
        _SOCKET = msg.sender;
    }

    error NotSOCKET();

    modifier onlySOCKET() {
        if (msg.sender != _SOCKET) revert NotSOCKET();
        _;
    }

    function mint(address to_, uint256 amount_) external onlySOCKET {
        _mint(to_, amount_);
    }

    function burn(uint256 amount_) external onlySOCKET {
        _burn(msg.sender, amount_);
    }

    function name() public view override returns (string memory) {
        return _name;
    }

    function symbol() public view override returns (string memory) {
        return _symbol;
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }
}
```

This contract is expected to be deployed via SOCKET, therefore `_SOCKET` address is set as the `msg.sender` in the constructor.

The `mint` and `burn` functions have `onlySOCKET` modifier because these are called by `AppGateway` via SOCKET.

### Deployer Contract Implementation: MyTokenDeployer.sol

Here’s the implementation of `MyTokenDeployer` contract which will be deployed to offchainVM. It extends the `AppDeployerBase` to manage the deployment process.

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./MyToken.sol";
import "socket-poc/contracts/base/AppDeployerBase.sol";

contract MyTokenDeployer is AppDeployerBase {
    bytes32 public myToken = _createContractId("myToken");

    constructor(
        address addressResolver_,
        FeesData memory feesData_,
        string memory name_,
        string memory symbol_,
        uint8 decimals_
    ) AppDeployerBase(addressResolver_) {
        creationCodeWithArgs[myToken] = abi.encodePacked(
            type(MyToken).creationCode,
            abi.encode(name_, symbol_, decimals_)
        );
        _setFeesData(feesData_);
    }

    function deployContracts(uint32 chainSlug) external async {
        _deploy(myToken, chainSlug);
    }

    function initialize(uint32 chainSlug) public override async {}
}
```

To identify the contract, we use a `bytes32` variable. This is a unique identifier for the contract and is used to fetch the `creationCode`, `on-chain addresses` and `forwarder addresses` from maps in `AppGatewayBase`. This identifier can be created using `_createContractId` function.

In the `constructor`, `MyToken`'s `creationCode` with constructor parameters is stored in a mapping. This stored code is used for deploying the token to the underlying chains. While this example handles a single contract, you can extend it to manage multiple contracts by storing their creation codes. The constructor also takes in `addressResolver` and `feesData`, we will talk more on these at a later stage. Or you can read more about them [here](/call-contracts).

The `deployContracts` function takes a `chainSlug` as an argument, specifying the chain where the contract should be deployed. It calls the inherited `_deploy` function and uses the `async` modifier for interacting with underlying chains.

The `initialize` function is empty in this example. Use it for setting chain-specific or dynamic variables after deployment if needed. More details [here](/deploy).

### AppGateway Contract implementation: MyTokenAppGateway.sol

`MyTokenAppGateway` is an AppGateway, it extends `AppGatewayBase` for logic related to interacting with onchain instances. This is where users interact with your app without worrying about the underlying chains. It has an `addAirdropReceivers` function that the owner can call and a `claimAirdrop` function that users can call.

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "socket-poc/contracts/base/AppGatewayBase.sol";
import "solady/auth/Ownable.sol";
import "./MyToken.sol";

contract MyTokenAppGateway is AppGatewayBase, Ownable {
    mapping(address => uint256) public airdropReceivers;

    constructor(
        address _addressResolver,
        address deployerContract_,
        FeesData memory feesData_
    ) AppGatewayBase(_addressResolver) Ownable() {
        addressResolver.setContractsToGateways(deployerContract_);
        _setFeesData(feesData_);
    }

    function addAirdropReceivers(
        address[] calldata receivers_,
        uint256[] calldata amounts_
    ) external onlyOwner {
        for (uint256 i = 0; i < receivers_.length; i++) {
            airdropReceivers[receivers_[i]] = amounts_[i];
        }
    }

    function claimAirdrop(address _instance) external async {
        uint256 amount = airdropReceivers[msg.sender];
        airdropReceivers[msg.sender] = 0;
        MyToken(_instance).mint(msg.sender, amount);
    }
}
```

In constructor we set the `deployerContract` as a contract that belongs to this Gateway. This is how you indicate which contracts are allowed to call your onchain contracts and SOCKET protocol knows where to charge fees from when a contract on offchainVM calls a contract on chain.

The `claimAirdrop` function again has an async modifier, similar to `deployContracts` and `initialize` function of the deployer. This modifier should be used whenever read or write calls are made to the underlying contracts. You can read more about [writes](/call-contracts) and [reads](/read).

# 4. Deployment and Fee setup

With the contracts ready, we can go on to deploy things. In true Chain Abstracted spirit, you as a developer only need to interact with the offchainVM and never with the chains directly unless you want to verify if things were done correctly.

### Deploy Contracts to offchainVM: SetupMyToken.s.sol

You need to deploy the `MyTokenDeployer` and `MyTokenDistrbutor` to the offchainVM.

You can get the `addressResolver` from [here](/chain-information).

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/Console.sol";
import {MyTokenAppGateway} from "../src/MyTokenAppGateway.sol";
import {MyTokenDeployer} from "../src/MyTokenDeployer.sol";
import {FeesData} from "lib/socket-poc/contracts/common/Structs.sol";
import {ETH_ADDRESS} from "lib/socket-poc/contracts/common/Constants.sol";

contract SetupMyToken is Script {
    function run() public {
        address addressResolver = vm.envAddress("ADDRESS_RESOLVER");

        string memory rpc = vm.envString("SOCKET_RPC");
        vm.createSelectFork(rpc);

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Setting fee payment on Ethereum Sepolia
        FeesData memory feesData = FeesData({
            feePoolChain: 11155111,
            feePoolToken: ETH_ADDRESS,
            maxFees: 0.01 ether
        });

        MyTokenDeployer myTokenDeployer = new MyTokenDeployer(
            addressResolver,
            feesData,
            "MyToken",
            "MTK",
            18
        );

        MyTokenAppGateway myTokenAppGateway = new MyTokenAppGateway(
            addressResolver,
            address(myTokenDeployer),
            feesData
        );

        console.log("MyTokenDeployer: ", address(myTokenDeployer));
        console.log("MyTokenAppGateway: ", address(myTokenAppGateway));
    }
}
```

Run the script using cast, providing rpc and private key.

```bash
forge script script/SetupMyToken.s.sol --broadcast
```

### Fund your App

Next, go on to setup fees so that offchainVM can send transactions and deploy contracts on your app’s behalf. On any supported chain, deposit fees against `MyTokenAppGateway`’s address. Read more about setting up fees and generating `feesData` [here](/fees).

### Deploy Token to chains: DeployMyToken.s.sol

Once your app is funded, you can trigger the deployment of `MyToken` on desired chains. In this case as well, just interact with offchainVM. Call `deployContracts` function of `MyTokenDeployer` contract for each chain where deployment needs to be done.

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {MyTokenDeployer} from "../src/MyTokenDeployer.sol";

contract DeployMyToken is Script {
    function setUp() public {}

    function run() public {
        string memory rpc = vm.envString("SOCKET_RPC");
        vm.createSelectFork(rpc);

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        MyTokenDeployer myTokenDeployer = MyTokenDeployer(<deployerAddress>);
        myTokenDeployer.deployContracts(<chainSlug1>);
        myTokenDeployer.deployContracts(<chainSlug2>);
        myTokenDeployer.deployContracts(<chainSlug3>);

        vm.stopBroadcast();
    }
}
```

Set proper values for `deployerAddress` and `chainSlugs` before running this script.

`deployerAddress` should have been logged in by previous script.

```bash
forge script ./script/DeployMyToken.s.sol
```

Deployment of on chain contracts should take couple minutes. You can track the status of this request and also check the deployed addresses using our [apis](/api).

# 5. Testing

### Add Airdrop Receivers: AddReceivers.s.sol

Once the setup is done, you can call `addAirdropReceivers`.

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {MyTokenAppGateway} from "../src/MyTokenAppGateway.sol";

contract AddReceivers is Script {
    address[] receivers = [
        <receiver1>,
        <receiver2>,
        <receiver3>
    ];
    uint256[] amounts = [
        <amount1>,
        <amount2>,
        <amount3>
    ];

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        MyTokenAppGateway myTokenAppGateway = MyTokenAppGateway(<myTokenAppGatewayAddress>);
        myTokenAppGateway.addAirdropReceivers(receivers, amounts);

        vm.stopBroadcast();
    }
}
```

### Claim Airdrop: ClaimAirdrop.s.sol

For each receiver that was added in previous step, they can call claimAirdrop with their desired instance address to mint tokens on the desired chain. Use our [apis](/api) to get instance addresses.

Note that the instance addresses are not the same as where token contracts are deployed on chain. The instance here is a forwarder address, read more about it [here](/call-contracts).

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {MyTokenAppGateway} from "../src/MyTokenAppGateway.sol";

contract ClaimAirdrop is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        MyTokenAppGateway myTokenAppGateway = MyTokenAppGateway(<myTokenAppGatewayAddress>);
        myTokenAppGateway.claimAirdrop(<instance>);

        vm.stopBroadcast();
    }
}
```
