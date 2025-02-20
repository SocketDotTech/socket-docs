---
id: deploy
title: Deploying onchain smart contracts
---

# How to deploy contracts to chains?

## Deploy

The deployment of onchain contracts from Offchain VM is managed through a Deployer contract. The key components of deployment include storing contract bytecode and handling the actual deployment process. Here's how it works using the `SuperToken` example ([code here](https://github.com/SocketDotTech/socket-protocol/blob/master/contracts/apps/super-token/SuperTokenDeployer.sol)):

1. The Deployer Contract stores the contract bytecode:
    ```solidity
    creationCodeWithArgs[superToken] = abi.encodePacked(
        type(SuperToken).creationCode,
        abi.encode(
            params_.name_,
            params_.symbol_,
            params_.decimals_,
            params_.initialSupplyHolder_,
            params_.initialSupply_
        )
    );
    ```

1. A unique identifier is created for each contract:
    ```solidity
    bytes32 public superToken = _createContractId("superToken");
    ```

1. The deployment is triggered using:
    ```solidity
    function deployContracts(uint32 chainSlug_) external async {
        _deploy(superToken, chainSlug_, IsPlug.YES);
    }
    ```

1. Chain specific parameters may be set automatically right after `_deploy` by overriding `initialize`
    ```solidity
    function initialize(uint32 chainSlug) public override async {
        if (chainSlug == 1) {
            // Fill in some special variable here
        }
    }
    ```

This system can be extended to manage multiple contracts by storing their respective creation codes.

<div style={{ display: 'flex', justifyContent: 'center' }}>
    <img src="/img/deploy_sequence.svg" alt="deploy" style={{ width: '80%' }} />
</div>

### Onchain contract bytecode stored in the Deployer Contract
The Deployer Contract has two key pieces of code to ensure that onchain deployments are replicable `SuperToken`'s `creationCode` with constructor parameters is stored in a mapping. This stored code is used for deploying the token to the underlying chains and written in the `constructor`.
```solidity
creationCodeWithArgs[superToken] = abi.encodePacked(
    type(SuperToken).creationCode,
    abi.encode(
        params_.name_,
        params_.symbol_,
        params_.decimals_,
        params_.initialSupplyHolder_,
        params_.initialSupply_
    )
);
```

Using  `bytes32` variable is use a unique identifier for the SuperToken contract generated using the `_createContractId` function. This identifier allows us to fetch `creationCode`, `onchain addresses` and `forwarder addresses` from maps in `AppGatewayBase`. See [here](/forwarder-addresses) to know more about [forwarder addresses](/forwarder-addresses).
```solidity
bytes32 public superToken = _createContractId("superToken");
```

While this example handles a single contract, you can extend it to manage multiple contracts by storing their creation codes.

### Onchain contract deployment with the Deployer Contract
<div style={{ display: 'flex', justifyContent: 'center' }}>
    <img src="/img/deployment_flow.svg" alt="deployment flow" style={{ width: '100%' }} />
</div>

The `deployContracts` function takes a `chainSlug` as an argument that specifies the chain where the contract should be deployed.
```solidity
function deployContracts(uint32 chainSlug_) external async {
    _deploy(superToken, chainSlug_, IsPlug.YES);
}
```
It calls the inherited `_deploy` function and uses the `async` modifier for interacting with underlying chains.

The `IsPlug` enum determines whether a contract will be connected to Socket's cross-chain messaging system:

- `IsPlug.YES`: Contract will be registered as a Socket plug, enabling direct communication with Socket's messaging system. Use this for contracts that need to interact directly with Socket (e.g., SuperToken contracts).

- `IsPlug.NO`: Contract will be deployed without Socket integration and cannot be called directly via Socket's messaging system. Use this for contracts that only need to be called internally by other contracts (e.g., LimitHook contracts that don't require direct Socket communication).

The `initialize` function is empty in this example. You can use it for setting chain-specific or dynamic variables after deployment if needed.

## Initialize

Initialization is a separate process that handles dynamic or chain-specific values after deployment. This is particularly useful when contracts need different configurations based on their deployment chain.

Here's an example using `SuperToken` with chain-specific mint limits:

<div style={{ display: 'flex', justifyContent: 'center' }}>
    <img src="/img/deploy_initialize.svg" alt="deploy initialize" style={{ width: '80%' }} />
</div>

```solidity
contract SuperToken is ERC20, Ownable, PlugBase {
    (...)
    error ExceedsMintLimit(uint256 amount, uint256 limit);

    uint256 mintLimit;

    function mint(address to_, uint256 amount_) external onlyOwner {
        if (amount_ > mintLimit) revert ExceedsMintLimit(amount_, mintLimit);
        _mint(to_, amount_);
    }

    function setMintLimit(uint256 newLimit) external onlyOwner {
        mintLimit = newLimit;
    }
}
```

We will set this limit using the `initialize` function, and to make things a bit more dynamic, we will set a higher limit for Ethereum compared to chains.

```solidity
interface ISuperToken {
    function setMintLimit(uint256 newLimit) external;
}

contract SuperTokenDeployer is AppDeployerBase, Ownable {
    (...)

    function initialize(uint32 chainSlug) public override async {
        uint256 mintLimit;
        if (chainSlug == 1) {
            mintLimit = 1 ether;
        } else {
            mintLimit = 10 ether;
        }

        ISuperToken(forwarderAddresses[superToken][chainSlug]).setMintLimit(mintLimit);
    }
}
```

The initialize function follows similar flow to how demonstrated on [Calling onchain smart contracts](/call-contracts) using the `async` modifier and `forwarderAddress`.

:::info
You can also note that the forwarder addresses of deployed contracts are stored in `forwarderAddresses` mapping in the `AppDeployerBase` and can be accessed easily here.
:::

## Deploy multiple contracts

So far we have been working with a single `SuperToken` contract onchain. But the deployer also supports working with multiple contracts. Lets create `SuperTokenVault` to lock tokens on chain and extend the deployer to deploy both contracts.

```solidity
contract SuperTokenVault is Ownable, PlugBase {
    address public superToken;
    mapping(address => uint256) public lockedAmount;

    function setSuperToken(address superToken_) external onlyOwner {
        superToken = superToken_;
    }

    function lock(uint256 amount) external {
        SuperToken(superToken).transferFrom(msg.sender, address(this), amount);
        lockedAmount[msg.sender] += amount;
    }

    function unlock(uint256 amount) external {
        lockedAmount[msg.sender] -= amount;
        SuperToken(superToken).transfer(msg.sender, amount);
    }
}
```

This contract needs to be onchain, therefore lets change `SuperTokenDeployer` to include it as well.

```solidity
contract SuperTokenDeployer is AppDeployerBase, Ownable {
    (...)
    bytes32 public superTokenVault = _createContractId("superTokenVault");

    constructor(
        address addressResolver_,
        FeesData memory feesData_,
        string calldata name_,
        string calldata symbol_,
        uint8 decimals_
    ) AppDeployerBase(addressResolver_, feesData_) {
        (...)
        creationCodeWithArgs[superTokenVault] = type(SuperTokenVault).creationCode;
    }

    function deployContracts(uint32 chainSlug) external async {
        _deploy(superToken, chainSlug, IsPlug.YES);
        _deploy(superTokenVault, chainSlug, IsPlug.YES);
    }

    function initialize(uint32 chainSlug) public override async {
        address superTokenVaultForwarder = forwarderAddresses[superTokenVault][chainSlug];
        address superTokenOnChainAddress = getOnChainAddress(superToken, chainSlug);

        SuperTokenVault(superTokenVaultForwarder).setSuperToken(superTokenOnChainAddress);
    }
}
```

This `SuperTokenDeployer` deploys both contracts, sets limit on `SuperToken` and sets `SuperToken’`s onchain address on `SuperTokenVault`.

:::info
- `SuperTokenVault` doesn't have any constructor arguments. Therefore we can directly store its `creationCode` without encoding anything along with it.
- We can get the forwarder addresses of both these from `forwarderAddresses` mapping.
- Since `SuperTokenVault` locks `SuperToken`, its needs the token’s onchain address. This address can be fetched using `getOnChainAddress` function.
:::
