---
id: protocol-design
title: Protocol Design
sidebar_position: 1
---
## Introduction

Socket is an on-chain contract that transmits payloads between chains. When a payload is sent by a contract to Socket deployed locally on that chain, Socket compresses it into a Packet - a cryptographic hash representing 1000s of payloads that want to be sent to another chain.

Packet delivery is carried out by off-chain participants called "Transmitters". Much like a sequencer in an L2, the transmitter is responsible for delivering a bunch of payloads from one-chain to another. However, an important difference is, Transmitter first signs and seals a packet on the source side and then submits the packet on the destination side. The packet, along with the transmitter’s signature, is now available on Socket on both chains 

On the destination chain, contracts called [`Switchboards`](./Learn/Components/Switchboards) allow protocols to select context around how & when a delivered payload should be processed. Socket appoints executors to process the message payload only if it meets conditions on the protocol selected Switchboard. For example, accept payload after timeout of 2 hours, accept payload if native bridge confirms etc.

There are several components in the Socket protocol that work together to make the above happen.

<img src="/img/BroadArchitecture.png" width="700px"/>


## Architecture

Socket is built in a modular fashion with various layers with defined APIs/Interfaces between them which allows developers the ability to leverage the software-stack in different and more efficent ways depending on their application context. 

The protocol consists of four key layers:
1. **Application Layer**: This layer consists of `Plugs`, which are smart contract applications built to interact with Socket. Plugs follow a specified API and communicate through deployed Socket instances between any two supported chains. The core Socket contract functions as an on-chain endpoint that sends and receives payloads between chains. As applications send payloads through Plugs, Socket compresses them into cryptographic hashes called `Packets`, which represent thousands of payloads across apps.
2. **Delivery Layer**: The delivery layer handles message batching and packet delivery between chains. [`Capacitor`](./Components/Capacitors.md) contracts in Socket store packets until they are ready to be sealed. Transmitters, off-chain actors deliver packets between chains by committing with their signatures on both source and destination chains. This ensures transparency and accountability. The verification layer can use this to build trustless verification schemes. Permissionless and transparent message delivery  allows for an efficient marketplace for message delivery.
3. **Verification Layer**: The layer for packet and message verification through [`Switchboards`](./Components/Switchboards.md). These customizable verification modules allow developers to define custom conditions for packet acceptance or rejection, offering flexibility in terms of security and performance. On the destination chain, contracts called Switchboards enable apps to choose the context in which a delivered payload is processed. Socket processes the payload only if it meets the conditions specified by the app-selected Switchboard, such as accepting payloads after a 2-hour timeout or confirming payloads through a native rollup bridge. Permissionlessness and modularity at the verification layer is a core advantage and design principle for Socket. 
4. **Execution Layer**: This layer handles message execution on the destination chain after verification, allowing third-party relayers like Gelato to handle execution, or for applications or users to execute their own messages with various re-try mechanisms etc.


<img src="/img/dl-layers.png"/>

Learn more about individual compoenents in [Components](./Components/Capacitors.md) and [Offchain Agents](./OffChain-Agents.md).