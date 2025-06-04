---
id: introduction
title: SOCKET Documentation
---

import Link from '@docusaurus/Link';
import CardGrid from '@site/src/components/CardGrid/CardGrid';
import styles from '@site/src/components/CardGrid/CardGrid.module.css';

![SOCKET Protocol](/img/metalmg.png)

SOCKET Protocol is the first chain-abstraction protocol, empowering developers to build applications that seamlessly leverage multiple blockchains. It enables the creation of chain-abstracted apps that interact across chains as if operating on a single one.

At its core, the protocol consists of a lightweight set of rules enforced by smart contracts deployed on each chain. These contracts allow developers to execute essential logic before their application contracts run onchain. This gives applications fine-grained control over blockchain infrastructure while abstracting onchain complexities from the end user.


## Why SOCKET?

Before SOCKET, developers had to choose a single blockchain for their applications, limiting their reach and functionality. Existing cross-chain solutions frequently rely on centralized intermediaries or fragmented bridges, introducing security risks, a poor user experience, and fragmented liquidity. SOCKET solves these problems by providing a secure, efficient, and user-friendly way to build truly chain-abstracted applications.

With SOCKET, you can:
- **Reach more users**: Deploy your dApp on any supported chain, interacting with users and assets across all other supported chains.
- **Unify liquidity**: Avoid breaking up liquidity across multiple blockchains, allowing your dApp to harness a shared liquidity pool.
- **Simplify development**: Build as if you're deploying on a single chain, using familiar tools and programming languages.
- **Enhance security**: Benefit from a decentralized, independently configurable security model.
- **Improve user experience**: Offer seamless cross-chain interactions without requiring users to understand underlying complexities.

### Use Cases

SOCKET protocol unlocks new possibilities for developers by enabling them to build applications and protocols that span multiple chains as if they were a single chain. Usecases are endless, but to highlight a few:

- **Chain-Abstracted Swaps**: Enable users to swap assets regardless of their location, without requiring bridging first.
- **Chain-Abstracted Accounts**: Access fragmented assets across multiple networks seamlessly, with **unified balances** and no need for multiple bridging transactions.
- **Chain-Abstracted Strategies**: Write strategies that earn yield or perform automated functions across networks, unlocking **capital efficiency** and higher yields for end users.
- **Chain-Abstracted Tokens**: Deploy ERC20 tokens that exist simultaneously across all networks, improving accessibility of fungible assets for end users.
- **Chain-Abstracted Lending/Borrowing**: Access a **global capital pool** for lending and borrowing, maximizing yield and capital efficiency without constant bridging.
- **Chain-Abstracted Governance**: Enable token holders to participate in protocol governance regardless of their preferred network.
- **Chain-Abstracted Gaming**: Build games that access liquidity from Ethereum Mainnet users while running on fast, low-cost networks, optimizing chain selection for the best user experience.
- **Chain-Abstracted Intents**: Build intentful applications that span across different networks in a few lines of code leveraging the fullstack capabilities of the SOCKET protocol
- **Chain-Abstracted Sequencing**: Build applications with custom **sequencing rules** that are independent of the network the application is deployed upon
- **Chain-Abstracted Policies**: Build applications with custom **policies**, to provide additional security, run additional checks before your onchain smart-contracts are executed

Read about more usecases [here](/usecases).


## Quick Start
Ready to start building with SOCKET?

:::tip What's next?

<div class="row">
  <div class="col col--6 margin-bottom--lg">
    <div class="card">
      <div class="card__header">
        <h3>Use Cases</h3>
      </div>
      <div class="card__body">
        <p>Explore more about the usecases</p>
      </div>
      <div class="card__footer">
        <a class="button button--secondary button--block" href="/usecases">Learn More</a>
      </div>
    </div>
  </div>
  <div class="col col--6 margin-bottom--lg">
    <div class="card">
      <div class="card__header">
        <h3>Architecture</h3>
      </div>
      <div class="card__body">
        <p>Deep dive into SOCKET Protocol's architecture</p>
      </div>
      <div class="card__footer">
        <a class="button button--secondary button--block" href="/architecture">Learn More</a>
      </div>
    </div>
  </div>
  <div class="col col--6 margin-bottom--lg">
    <div class="card">
      <div class="card__header">
        <h3>Getting Started</h3>
      </div>
      <div class="card__body">
        <p>Follow a step by step tutorial</p>
      </div>
      <div class="card__footer">
        <a class="button button--secondary button--block" href="/getting-started">Learn More</a>
      </div>
    </div>
  </div>
  <div class="col col--6 margin-bottom--lg">
    <div class="card">
      <div class="card__header">
        <h3>Core Concepts</h3>
      </div>
      <div class="card__body">
        <p>Build a chain-abstracted app</p>
      </div>
      <div class="card__footer">
        <a class="button button--secondary button--block" href="/writing-apps">Learn More</a>
      </div>
    </div>
  </div>
</div>

:::

## Understand Core Concepts and Architecture
- [What is SOCKET?](/architecture): Understand what SOCKET fundamentally solves and why it exists
- [Protocol Overview](/architecture): Understand how app-gateway and your application smart-contracts work together
- [What are Switchboards?](/switchboards): Understand how switchboards enable modular security enabling developers to always have control and access to best security
- [What are Watchers?](/watchers): Understand what role Watchers play in SOCKET
- [What are Transmitters?](/transmitters): Understand how transmitters enable app-gateways to interact with any smart-contract on any network
- [What is EVMx?](/evmx): Understand what special properties an app-gateway on EVMx can get

## Key Concepts
Below are common terms you'll encounter in the docs. A more detailed listing can be found in the [Glossary](/glossary).

- **AppGateway**: Application deployed logic that runs offchain before onchain contracts are executed.
- **Switchboard**: Onchain contract used to validate AppGateway execution. Developers can build verifiers that enforce conditions under which Watcher proofs are considered valid.
- **Watcher**: An offchain agent that hosts application defined AppGateways and creates proofs, which can be verified onchain via Switchboards.
- **Transmitter**: An offchain agent that collects proofs and executes onchain actions via socket contract.

## Developer Tooling
- [Starter kit](https://github.com/SocketDotTech/socket-starter-kit): A simple repository to get you started on you chain-abstraction journey
- [Test app](https://github.com/SocketDotTech/socket-test-app): A repository with practical examples on how to implement each functionality
- [API reference](//api-reference/get-details-by-tx-hash)

## Build UnChained
Sky is the limit, there are no constraints, build your next application with SOCKET.

We appreciate feedback and suggestions, please reach out to us on Discord or open issues on this github repo for documentation.
