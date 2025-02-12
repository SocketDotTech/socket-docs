---
id: introduction
title: What is SOCKET Protocol?
---

import Link from '@docusaurus/Link';
import CardGrid from '@site/src/components/CardGrid/CardGrid';
import styles from '@site/src/components/CardGrid/CardGrid.module.css';

**SOCKET Protocol** is the first chain-abstraction protocol, enabling developers to build applications that seamlessly interact across **300+ blockchain networks** through chain abstraction. Rather than treating each chain as a separate system, SOCKET allows developers to use chains as **unified infrastructure** - similar to how traditional applications use databases and servers.

A **chain-abstraction protocol** provides a unified way for different blockchain networks to communicate and exchange assets without requiring direct integration with each network’s technical details.

By abstracting these complexities, developers can build applications that work seamlessly across multiple blockchains without needing to handle each network’s unique implementation.

[↘ Learn about SOCKET's key features](/introduction#key-features)

## Use Cases

- **Horizontal Scaling:** Deploy application instances across multiple chains for improved throughput
- **Intent Infrastructure:** Build custom intent protocols with pre-execution auctions
- **Application-Specific Sequencing:** Capture and redirect MEV value
- **Pre-Execution Security:** Run security checks before onchain execution
- **Chain-Abstracted DeFi:** Unified liquidity and trading protocols
- **Chain-Agnostic Governance:** Universal voting and proposal systems
- **Account Abstraction:** Consistent account experience across networks
- **Chain-Abstracted Data:** Unified indexing and querying infrastructure

[↘ Explore more about the usecases SOCKET enables](/usecases)

## Key Features

- **Chain-Abstracted Contracts**
   - Execute contracts across any supported chain using standard Solidity
   - No complex messaging protocols or async handling required
   - Direct function calls with consistent developer experience

- **Pre-Execution Framework**
   - Run custom logic before onchain execution
   - Enable advanced features like auctions, intent matching, and security checks
   - Full control over execution flow and user experience

## Core Components

- **Offchain Agents**: [Watchers](/watchers) and [Transmitters](/transmitters) that monitor and relay information
- **Onchain Contracts**: [Switchboards](/switchboards) that handle execution and state management
- **Modular Architecture**: Flexible infrastructure that developers can customize for their specific needs

[↘ Learn more about the protocol architecture](/architecture)

## Top Links!
<CardGrid cards={[
 {
   title: "Use Cases",
   description: "Explore more about the usecases SOCKET enables",
   link: "/usecases"
 },
 {
   title: "Architecture",
   description: "Deep dive into SOCKET Protocol's architecture",
   link: "/architecture"
 },
 {
   title: "Getting Started",
   description: "Follow a step by step tutorial",
   link: "/getting-started"
 },
 {
   title: "App Tutorial",
   description: "Build a chain-abstracted ERC20 app",
   link: "/writing-apps"
 }
]} />
