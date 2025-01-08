---
id: forwarder-addresses
title: Forwarder Addresses
---

## What Does the Forwarder Address Do?
The forwarder address is essentially a **proxy contract** that:
1. **Receives cross-chain messages** through the SOCKET protocol.
2. **Forwards the calls to the correct chain and address.**

Since each forwarder is tied to a specific `(chainSlug, address)` pair, it knows exactly where to forward the call when triggered.

SOCKET uses these `forwarder` contracts that are automatically deployed alongside your onchain contracts when you [deploy](/deploy). Each forwarder contract is immutable and is specifically tied to a unique `(chain, address)` pair. This ensures that when a forwarder contract is called, it knows exactly which chain and which address to forward the call to.

![image.png](../static/img/forwarder-addresses.svg)

## Creating a Forwarder Address for an Existing Onchain Contract

To create a forwarder address, you need to deploy a **forwarder contract** that will handle cross-chain calls for your onchain contract. This forwarder contract is created by calling the `deployForwarderContract` function provided by the `IAddressResolver` interface.

### Using `Deployer` Constructor to Deploy the Forwarder

When your `Deployer` contract is deployed, the constructor can automatically create a forwarder for your onchain contract. Here’s the relevant code from the constructor:

```solidity
IAddressResolver(addressResolver).deployForwarderContract(
    address(this),        // The address of the current deploying contract
    onchainAddress,       // The address of the onchain contract (e.g. token)
    chainSlug             // The chain identifier for the target chain
);
```

- `address(this)` — Refers to the current `AppDeployer` contract.
- `onchainTokenAddress` — The address of the onchain contract (such as a token or other smart contract) that needs a forwarder.
- `chainSlug` — A unique identifier for the target blockchain (e.g., 1- Ethereum, 8453 - Base, etc).

This call ensures that a forwarder contract is deployed and linked to the specified `(chainSlug, onchainTokenAddress)` pair.

### 2. Manually Deploying a Forwarder Elsewhere in the `Deployer` Contract

If you need to deploy a forwarder address at any other point in your contract (outside the constructor), you can call the same function manually:

```solidity
addressResolver.deployForwarderContract(
    address(this),
    onchainAddress,
    chainSlug
);
```

This can be used if:
- You need to create multiple forwarders for different existing contracts;
- You want to deploy forwarders dynamically based on certain conditions.
