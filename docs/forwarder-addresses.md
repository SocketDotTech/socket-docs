---
id: forwarder-addresses
title: Forwarder Addresses
---

## What does the Forwarder Address do?

The forwarder address is essentially a **proxy contract** that:
1. **Receives chain-abstracted calls** through the SOCKET protocol.
2. **Forwards the calls to the correct chain and address.**

Since each forwarder is tied to a specific `(chainSlug, address)` pair, it knows exactly where to forward the call when triggered.

SOCKET uses these `forwarder` contracts that are automatically deployed alongside your onchain contracts when you [deploy](/deploy). Each forwarder contract is immutable and is specifically tied to a unique `(chain, address)` pair. This ensures that when a forwarder contract is called, it knows exactly which chain and which address to forward the call to.

<div style={{ display: 'flex', justifyContent: 'center' }}>
    <img src="/img/forwarder-addresses.svg" alt="forwarder addresses" style={{ width: '100%' }} />
</div>

## Creating and Accessing Forwarder Addresses

### Uploading an onchain contract to use on an AppGateway on EVMx

[↘ See a reference implementation of this functionality here](https://github.com/SocketDotTech/socket-test-app/blob/master/src/forwarder-on-evmx/UploadAppGateway.sol).

When your `AppGateway` contract is deployed, the constructor can automatically create a forwarder for your onchain contract. If you need to upload an onchain contract to the EVMx you can call the following from the `AppGateway`:

```solidity
asyncDeployer__().getOrDeployForwarderContract(
    onchainAddress,       // The address of the onchain contract (e.g. token)
    chainSlug             // The chain identifier for the target chain
);
```

- `onchainAddress` — The address of the onchain contract (such as a token or other smart contract) that needs a forwarder.
- `chainSlug` — A unique identifier for the target blockchain (e.g., 1 - Ethereum, 8453 - Base, etc).

This call ensures that a forwarder contract is deployed and linked to the specified `(chainSlug, onchainAddress)` pair.

### Accessing Forwarder Addresses

If the onchain contract was deployed via the `AppGateway`, you can access the forwarder addresses through the `forwarderAddresses` mapping in the AppGateway contract:

```solidity
address forwarderAddress = forwarderAddresses[contractId][chainSlug];
```

This mapping allows you to retrieve the forwarder address for any contract and chain combination. For example:

```solidity
address someContractForwarder = forwarderAddresses[someContractId][chainSlug];
```

:::info
[See a reference implementation of this functionality here](https://github.com/SocketDotTech/socket-test-app/blob/master/src/forwarder-on-evmx/UploadAppGateway.sol).
:::
