---
id: architecture
title: Architecture
---

SOCKET is a protocol, not a blockchain. It enables developers to build chain-abstracted applications using a combination of offchain agents and onchain contracts. This setup allows for flexible, efficient, and customizable cross-chain interactions.

Developers can leverage **Application Gateway (AppGateway)**, which operate on an EVMx to handle logic related to onchain contract interactions. These contracts function as hubs for user interactions, managing pre-execution checks, auctions, or other logic before onchain execution.

<div style={{ display: 'flex', justifyContent: 'center' }}>
    <img src="/img/simple-architecture.svg" alt="simple architecture diagram" style={{ width: '65%' }} />
</div>

## SOCKET Protocol Components

SOCKET consists of several key components:

- **Watchers**: Offchain operators running specialized VMs that monitor blockchain activity and act as hosts for App-Gateways. They generate proofs, which can be verified onchain via application-defined Switchboards. Anyone can become a Watcher by running a node.

    [↘ Read more about Watchers](/watchers).

- **Transmitters**: Offchain smart operators that collect Watcher-generated proofs and execute onchain actions on behalf of users. They coordinate with App-Gateways to ensure seamless execution.

    [↘ Read more about transmitters here](/transmitters).

- **Switchboards**: Onchain smart contracts used to validate offchain execution. Developers can build verifiers that enforce conditions under which Watcher proofs are considered valid. This modular approach allows for flexibility in security, cost, and speed optimization.

    [↘ Read more about switchboards here](/switchboards).

- **Onchain App Contracts**: Traditional smart contracts deployed on the blockchain, interacting with the SOCKET ecosystem.
- **App-Gateway Contracts**: Deployed on offchainVMs, these contracts handle interactions between users and onchain contracts. They can enforce logic such as safety checks, pre-execution steps, and composability of onchain contracts.

    [↘ Learn more about how to build applications on SOCKET](/writing-apps#architecture-overview)

<div style={{ display: 'flex', justifyContent: 'center' }}>
    <img src="/img/architecture.svg" alt="architecture diagram" style={{ width: '90%' }} />
</div>

## How It Works

Using the diagram above as a visual aid, here’s how the protocol functions:

1. The user signs an offchain message and sends it to a watcher, where their App-Gateway is deployed.
2. The App-Gateway processes the request, and the Watcher generates a proof.
3. The Transmitter collects the signed user message and watcher proof, then submits them onchain.
4. The onchain SOCKET contract forwards the proofs to the application's selected switchboard.
5. The Switchboard verifies the proof and returns a boolean response.
6. Based on this response, the user's onchain contract execution is triggered via the onchain SOCKET contract.

## Expanding Across Networks

SOCKET is designed for easy multi-chain expansion. Extending to additional networks simply involves deploying smart contracts permissionlessly and configuring a watcher to monitor the new chain. This allows App-Gateways to facilitate seamless cross-chain contract interactions.

<div style={{ display: 'flex', justifyContent: 'center' }}>
    <img src="/img/multichain-architecture.svg" alt="multichain architecture diagram" style={{ width: '90%' }} />
</div>

SOCKET provides developers with full control over both offchain and onchain logic, enabling chain-abstraction while adapting to various application needs. The protocol supports numerous use cases, some of which are highlighted on this page.
