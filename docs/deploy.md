---
id: deploy
title: Deploy contracts onchain
---

## Deploy

The deployment of onchain contracts from EVMx is managed through an AppGateway contract. The key components of deployment include storing contract bytecode and handling the actual deployment process. Here's how it works using an example:

[↘ See a reference implementation here](https://github.com/SocketDotTech/socket-starter-kit/blob/master/src/counter/CounterAppGateway.sol).

1. A unique identifier is created for each contract:
    ```solidity
    bytes32 public someRelevantName = _createContractId("someRelevantName");
    ```

1. The AppGateway Contract stores the contract bytecode:
    ```solidity
    creationCodeWithArgs[someRelevantName] = abi.encodePacked(
        type(OnChainContractType).creationCode,
        abi.encode(
            params_.static_,
            params_.constructor_,
            params_.input_arguments_to_,
            params_.supply_onchain_contract
        )
    );
    ```

1. The deployment is triggered using:
    ```solidity
    function deployContracts(uint32 chainSlug_) external async {
        _deploy(someRelevantName, chainSlug_, IsPlug.YES);
    }
    ```

1. Dynamic or chain specific parameters may be set automatically right after `_deploy` by overriding the `initialize` function:
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

### Onchain contract bytecode stored in the AppGateway Contract
The AppGateway Contract has two key pieces of code to ensure that onchain deployments are replicable `OnChainContract`'s `creationCode` with constructor parameters is stored in a mapping. This stored code is used for deploying the token to the underlying chains and written in the `constructor`.
```solidity
creationCodeWithArgs[someRelevantName] = abi.encodePacked(
    type(OnChainContractType).creationCode,
    abi.encode(
        params_.static_,
        params_.constructor_,
        params_.input_arguments_to_,
        params_.supply_onchain_contract
    )
);
```

The  `bytes32` variable is a unique identifier for the `OnChainContract` contract generated using the `_createContractId` function. This identifier allows us to fetch `creationCode`, `onchain addresses` and `forwarder addresses` from maps in `AppGatewayBase`. See [here](/forwarder-addresses) to know more about [forwarder addresses](/forwarder-addresses).
```solidity
bytes32 public someRelevantName = _createContractId("someRelevantName");
```

While this handles a single contract, you can extend it to manage multiple contracts by storing their creation codes.

### Onchain contract deployment with the AppGateway Contract
<div style={{ display: 'flex', justifyContent: 'center' }}>
    <img src="/img/deployment_flow.svg" alt="deployment flow" style={{ width: '100%' }} />
</div>

The `deployContracts` function takes a `chainSlug` as an argument that specifies the chain where the contract should be deployed.
```solidity
function deployContracts(uint32 chainSlug_) external async {
    _deploy(someRelevantName, chainSlug_, IsPlug.YES);
}
```
It calls the inherited `_deploy` function and uses the `async` modifier for interacting with underlying chains.

The `IsPlug` enum determines whether a contract will be connected to SOCKET's multi-chain infrastructure:

- `IsPlug.YES`: Contract will be registered as a SOCKET plug, enabling direct communication with SOCKET's infrastructure. Use this for contracts that need to interact directly with SOCKET (e.g., SuperToken contracts).

- `IsPlug.NO`: Contract will be deployed without SOCKET integration and cannot be called directly via SOCKET's infrastructure. Use this for contracts that only need to be called internally by other contracts (e.g., LimitHook contracts that don't require direct SOCKET communication).

The `initialize` function is empty in this example. You can use it for setting chain-specific or dynamic variables after deployment if needed.

## Initialize

Initialization is a separate process that handles dynamic or chain-specific values after deployment. This is particularly useful when contracts need different configurations based on their deployment chain.

Here's an example using `SomeContract` with chain-specific mint limits:

<div style={{ display: 'flex', justifyContent: 'center' }}>
    <img src="/img/deploy_initialize.svg" alt="deploy initialize" style={{ width: '80%' }} />
</div>

```solidity
contract SomeContract is ERC20, PlugBase {
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
interface ISomeContract {
    function setMintLimit(uint256 newLimit) external;
}

contract SomeContractAppGateway is AppGatewayBase {
    (...)

    function initialize(uint32 chainSlug) public override async {
        uint256 mintLimit;
        if (chainSlug == 1) {
            mintLimit = 1 ether;
        } else {
            mintLimit = 10 ether;
        }

        ISomeContract(forwarderAddresses[someRelevantName][chainSlug]).setMintLimit(mintLimit);
    }
}
```

The initialize function follows similar flow to how demonstrated on [Calling onchain smart contracts](/call-onchain-from-evmx) using the `async` modifier and `forwarderAddress`.

:::info
You can also note that the forwarder addresses of deployed contracts are stored in `forwarderAddresses` mapping in the `AppGatewayBase` and can be easily accessed here.
:::

## Deploy multiple contracts

So far we have been working with a single contract onchain. But the AppGateway also supports working with multiple contracts. Lets create `SomeOtherContract` to lock tokens and extend the AppGateway to deploy both contracts.

[↘ See a reference implementation of this functionality here](https://github.com/SocketDotTech/socket-test-app/tree/master/src/deploy).

```solidity
contract SomeOtherContract is Ownable, PlugBase {
    address public someContract;
    mapping(address => uint256) public lockedAmount;

    function setToken(address someContract_) external onlySocket {
        someContract = someContract_;
    }

    function lock(uint256 amount) external {
        SomeContract(someContract).transferFrom(msg.sender, address(this), amount);
        lockedAmount[msg.sender] += amount;
    }

    function unlock(uint256 amount) external {
        lockedAmount[msg.sender] -= amount;
        SomeContract(someContract).transfer(msg.sender, amount);
    }
}
```

This contract needs to be onchain, therefore lets change `SomeContractAppGateway` to include it as well.

```solidity
contract SomeContractAppGateway is AppGatewayBase {
    (...)
    bytes32 public someOtherRelevantName = _createContractId("someOtherRelevantName");

    constructor(
        address addressResolver_,
        FeesData memory feesData_,
        string calldata name_,
        string calldata symbol_,
        uint8 decimals_
    ) AppGatewayBase(addressResolver_, feesData_) {
        (...)
        creationCodeWithArgs[someOtherRelevantName] = type(SomeOtherContract).creationCode;
    }

    function deployContracts(uint32 chainSlug) external async {
        _deploy(someRelevantName, chainSlug, IsPlug.YES);
        _deploy(someOtherRelevantName, chainSlug, IsPlug.YES);
    }

    function initialize(uint32 chainSlug) public override async {
        address someOtherContractForwarder = forwarderAddresses[someOtherRelevantName][chainSlug];
        address someContractOnchainAddress = getOnChainAddress(someRelevantName, chainSlug);

        SomeOtherContract(someOtherContractForwarder).setToken(someContractOnchainAddress);
    }
}
```

This `SomeContractAppGateway` deploys both contracts, sets limit on `SomeContract` and sets `SomeContract`'s onchain address on `SomeOtherContract`.

In summary:

- `SomeOtherContract` doesn't have any constructor arguments. Therefore we can directly store its `creationCode` without encoding anything along with it.
- We can get the forwarder addresses of both these from `forwarderAddresses` mapping.
- Since `SomeOtherContract` locks `SomeContract`, its needs the token’s onchain address. This address can be fetched using `getOnChainAddress` function.

:::info
[See a reference implementation of this functionality here](https://github.com/SocketDotTech/socket-test-app/tree/master/src/deploy).
:::
