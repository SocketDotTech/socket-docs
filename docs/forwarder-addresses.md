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

### Using the AppGateway contract constructor to deploy the Forwarder Address

When your `AppGateway` contract is deployed, the constructor can automatically create a forwarder for your onchain contract. Here's the relevant code from the constructor:

```solidity
IAddressResolver(addressResolver).getOrDeployForwarderContract(
    address(this),        // The address of the current AppGateway contract
    onchainAddress,       // The address of the onchain contract (e.g. token)
    chainSlug             // The chain identifier for the target chain
);
```

- `address(this)` — Refers to the current `AppGateway` contract.
- `onchainTokenAddress` — The address of the onchain contract (such as a token or other smart contract) that needs a forwarder.
- `chainSlug` — A unique identifier for the target blockchain (e.g., 1- Ethereum, 8453 - Base, etc).

This call ensures that a forwarder contract is deployed and linked to the specified `(chainSlug, onchainTokenAddress)` pair.

### Accessing Forwarder Addresses

Once deployed, you can access the forwarder addresses through the `forwarderAddresses` mapping in the AppGateway contract:

```solidity
address forwarderAddress = forwarderAddresses[contractAddress][chainSlug];
```

This mapping allows you to retrieve the forwarder address for any contract and chain combination. For example:

```solidity
address superTokenVaultForwarder = forwarderAddresses[superTokenVault][chainSlug];
```

See how this example usage [here](/deploy#deploy-multiple-contracts).
