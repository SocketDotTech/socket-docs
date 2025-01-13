---
id: deploy
title: Deploying onchain smart contracts
---

# How to deploy contracts to chains?

## Deploy

Deployments of onchain contracts from Offchain VM is done using a Deployer contract. Lets look at the `Deployer` contract of `SimpleToken` example to better understand the workflow and [code](https://github.com/SocketDotTech/socket-protocol/blob/simple-token/contracts/apps/simple-token/SimpleTokenDeployer.sol).
<!-- TODO: Update filepath once contracts are merged to master branch -->

<div style={{ display: 'flex', justifyContent: 'center' }}>
    <img src="/img/deploy_sequence.svg" alt="deploy" style={{ width: '80%' }} />
</div>

### Onchain contract bytecode stored in the Deployer Contract
The Deployer Contract has two key pieces of code to ensure that onchain deployments are replicable `SimpleToken`'s `creationCode` with constructor parameters is stored in a mapping. This stored code is used for deploying the token to the underlying chains and written in the `constructor`.
```solidity
creationCodeWithArgs[simpleToken] = abi.encodePacked(
    type(simpleToken).creationCode,
    abi.encode(name_, symbol_, decimals_)
);
```

Using  `bytes32` variable is use a unique identifier for the SimpleToken contract generated using the `_createContractId` function. This identifier allows us to fetch `creationCode`, `onchain addresses` and `forwarder addresses` from maps in `AppGatewayBase`. See [here](/forwarder-addresses) to know more about [forwarder addresses](/forwarder-addresses).
```solidity
bytes32 public simpleToken = _createContractId("simpleToken");
```

While this example handles a single contract, you can extend it to manage multiple contracts by storing their creation codes.

### Onchain contract deployment with the Deployer Contract
<div style={{ display: 'flex', justifyContent: 'center' }}>
    <img src="/img/deployment_flow.svg" alt="deployment flow" style={{ width: '100%' }} />
</div>

The `deployContracts` function takes a `chainSlug` as an argument that specifies the chain where the contract should be deployed.
```solidity
function deployContracts(uint32 chainSlug) external async {
    _deploy(simpleToken, chainSlug);
}
```
It calls the inherited `_deploy` function and uses the `async` modifier for interacting with underlying chains.

The `initialize` function is empty in this example. You can use it for setting chain-specific or dynamic variables after deployment if needed.

## Initialize

Since we store the `creationCode` along with `constructor parameters`, they essentially become constants. But there can be use cases where the contract need dynamic or chain specific values while setting up. For such cases, the initialize flow has to be used. Lets extend the `SimpleToken` example to set mint limits following the workflow below.

<div style={{ display: 'flex', justifyContent: 'center' }}>
    <img src="/img/deploy_initialize.svg" alt="deploy initialize" style={{ width: '80%' }} />
</div>

```solidity
contract SimpleToken is ERC20, Ownable {
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
interface ISimpleToken {
    function setMintLimit(uint256 newLimit) external;
}

contract SimpleTokenDeployer is AppDeployerBase {
    (...)

    function initialize(uint32 chainSlug) public override async {
        uint256 mintLimit;
        if (chainSlug == 1) {
            mintLimit = 10 ether;
        } else {
            mintLimit = 1 ether;
        }

        ISimpleToken(forwarderAddresses[simpleToken][chainSlug]).setMintLimit(mintLimit);
    }
}
```

The initialize function follows similar flow to how demonstrated on [Calling onchain smart contracts](/call-contracts) using the `async` modifier and `forwarderAddress`.

:::info
You can also note that the forwarder addresses of deployed contracts are stored in `forwarderAddresses` mapping in the `AppDeployerBase` and can be accessed easily here.
:::

## Deploy multiple contracts

So far we have been working with a single `SimpleToken` contract onchain. But the deployer also supports working with multiple contracts. Lets create `SimpleTokenVault` to lock tokens on chain and extend the deployer to deploy both contracts.

```solidity
contract SimpleTokenVault is Ownable {
    address public simpleToken;
    mapping(address => uint256) public lockedAmount;

    function setSimpleToken(address simpleToken_) external onlyOwner {
        simpleToken = simpleToken_;
    }

    function lock(uint256 amount) external {
        SimpleToken(simpleToken).transferFrom(msg.sender, address(this), amount);
        lockedAmount[msg.sender] += amount;
    }

    function unlock(uint256 amount) external {
        lockedAmount[msg.sender] -= amount;
        SimpleToken(simpleToken).transfer(msg.sender, amount);
    }
}
```

This contract needs to be onchain, therefore lets change `SimpleTokenDeployer` to include it as well.

```solidity
contract SimpleTokenDeployer is AppDeployerBase {
    (...)
    bytes32 public simpleTokenVault = _createContractId("simpleTokenVault");

    constructor(
        address addressResolver_,
        FeesData memory feesData_,
        string calldata name_,
        string calldata symbol_,
        uint8 decimals_
    ) AppDeployerBase(addressResolver_, feesData_) {
        (...)
        creationCodeWithArgs[simpleTokenVault] = type(SimpleTokenVault).creationCode;
    }

    function deployContracts(uint32 chainSlug) external async {
        _deploy(simpleToken, chainSlug);
        _deploy(simpleTokenVault, chainSlug);
    }

    function initialize(uint32 chainSlug) public override async {
        address simpleTokenVaultForwarder = forwarderAddresses[simpleTokenVault][chainSlug];
        address simpleTokenOnChainAddress = getOnChainAddress(simpleToken, chainSlug);

        SimpleTokenVault(simpleTokenVaultForwarder).setSimpleToken(simpleTokenOnChainAddress);
    }
}
```

This `SimpleTokenDeployer` deploys both contracts, sets limit on `SimpleToken` and sets `SimpleToken’`s onchain address on `SimpleTokenVault`.

:::info
- `SimpleTokenVault` doesn't have any constructor arguments. Therefore we can directly store its `creationCode` without encoding anything along with it.
- We can get the forwarder addresses of both these from `forwarderAddresses` mapping.
- Since `SimpleTokenVault` locks `SimpleToken`, its needs the token’s onchain address. This address can be fetched using `getOnChainAddress` function.
:::
