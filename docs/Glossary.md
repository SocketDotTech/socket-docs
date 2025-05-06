---
id: glossary
title: Glossary
---

## Core Protocol Terms

### AppGateway
Application deployed logic that runs offchain before onchain contracts are executed. AppGateways enable developers to implement custom logic and validation before any onchain execution occurs.

### Switchboard
Onchain contract used to validate AppGateway execution. Developers can build verifiers that enforce conditions under which Watcher proofs are considered valid. Switchboards enable modular security, giving developers control and access to best security practices.

### Watcher
An offchain agent that hosts application-defined AppGateways and creates proofs, which can be verified onchain via Switchboards. Watchers play a crucial role in monitoring and validating cross-chain operations.

### Transmitter
An offchain agent that collects proofs and executes onchain actions via socket contract. Transmitters enable app-gateways to interact with any smart-contract on any supported network.

### EVMx
A specialized environment where app-gateways can run with enhanced capabilities and features for cross-chain operations. EVMx provides special properties that enable more sophisticated cross-chain interactions.

## General Terms

### Chain Abstraction
A protocol design approach that allows applications to interact with multiple blockchain networks as if they were a single unified system. This eliminates the need for developers to handle chain-specific implementations.

### Pre-Execution Logic
Custom validation and processing that occurs before any onchain transaction is executed. This enables enhanced security checks and optimizations.

### Chain-Abstracted Applications
Applications built to operate across multiple blockchain networks without requiring chain-specific code or user interaction. These applications can leverage the full potential of multiple chains while maintaining a simple user experience.
