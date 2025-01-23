---
id: introduction
title: What is SOCKET Protocol?
---

import Link from '@docusaurus/Link';
import CardGrid from '@site/src/components/CardGrid/CardGrid';
import styles from '@site/src/components/CardGrid/CardGrid.module.css';

## What is SOCKET Protocol?

SOCKET Protocol is the first chain-abstraction protocol, enabling developers to build chain-abstracted applications to compose users, accounts and applications across 300+ rollups and chains. Chain-Abstraction is a new computing paradigm for developers, enabling developers to leverage chains as servers/databases, enabling them to reach all users and applications spread across networks while providing a consistent monolithic experience to end users and applications.

SOCKET is a chain-abstraction protocol, not a network(chain/rollup). Using a combination of offchain agents(watchers, transmitters) and onchain contracts(switchboards) it enables application-builders to build truly chain-abstracted protocols.

<div style={{ display: 'flex', justifyContent: 'center' }}>
    <img src="/img/architecture.svg" alt="architecture diagram" style={{ width: '90%' }} />
</div>

Leveraging SOCKET protocol, application developers have the ability to not just control the onchain elements of their application but also define additional offchain logic that can assist users, help with composing smart contracts or execute some pre-execution logic like auctions or resource-locks, security checks etc while being in full control of their application and its properties at all times. SOCKET is fully modular and extremely flexible to enable application developers to mold the infrastructure according to their requirements.

Start reading more about the protocol in [this section](/architecture).

## Top Features

SOCKET is extremely flexible and generic, to allow developers to create and innovate permissionlessly while being in full control of the underlying infrastructure and its properties. The protocol can be leveraged to enable unique usecases here we highlight the top 2 properties or features:
- **ChainAbstracted Composability**: Ability to call any function on any contract on any chain via plain solidity, no cross-chain messaging, async solidity helps massively in terms of improving the developer experience.
- **Pre-Execution**: Ability for developers to execute additional logic in the user-flow before the onchain contracts are executed is super powerful enabling various features like auctions, intents or really anything else.

Read more about the usecases SOCKET enables in [this section](/usecases).

## Top Links!
<CardGrid cards={[
 {
   title: "Getting Started",
   description: "Follow a step by step tutorial",
   link: "/getting-started"
 },
 {
   title: "App Tutorial",
   description: "Build a chain-abstracted ERC20 app",
   link: "/writing-apps"
 },
 {
   title: "Architecture",
   description: "Deep dive into SOCKET Protocol's architecture",
   link: "/architecture"
 },
 {
   title: "Key Use Cases",
   description: "Read more about the usecases SOCKET enables",
   link: "/usecases"
 }
]} />
