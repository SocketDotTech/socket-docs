---
sidebar_position: 1
id: basics
title: SocketDL Basics
slug: /
---

SocketDL is a modular, extensible cross-chain communication protocol that enables developers to build seamless and secure interactions between smart contracts and decentralized applications (dApps) across multiple blockchain networks. SocketDL can be considered an Arbitrary Messaging Bridge. 

SocketDL is canonically implemented as a set of smart contracts on 5 blockchains and is interacted with via ”Plug” smart contracts built to interact with the protocol. On the client side, we have the first core Socket Typescript client from Socket Labs for the operation of the protocol’s 3 core offchain actors: Transmitters, Executors, and Watchers. Please note that at this time during the alpha phase of SocketDL’s release, Socket Labs will be running all 3 off-chain actors. We will open up participation to the community in the future.

The protocol consists of four key layers:

1. Application Layer: This layer consists of “Plugs,” which are smart contract applications built to interact with Socket. Plugs follow a specified API and communicate through deployed Socket instances between any two supported chains. The core Socket contract functions as an on-chain endpoint that sends and receives payloads between chains. As applications send payloads through Plugs, Socket compresses them into cryptographic hashes called Packets, which represent thousands of payloads across apps.
2. Delivery Layer: The delivery layer is responsible for message batching and packet delivery across chains. Socket Contracts called Capacitors store messages by recording message hashes(?) until they are ready to create packets for transmission. Then, offchain actors running a Socket node called Transmitters seal and deliver packets between source and destination chains. These Transmitters compete with one another, with the most efficient one winning the right to deliver the packet. The winning Transmitter signs the packet on the source chain and delivers the signed packet to Socket on the destination chain. Both chains then have access to the packet and the Transmitter's signature, which guarantees that fraudulent Transmitter behavior can be slashed. Permissionless message delivery with guaranteed slashing , decoupled from message verification, allows for an efficient marketplace for message delivery to develop. 
3. Verification Layer: The layer for packet and message verification through Switchboards. These customizable verification modules allow developers to define custom conditions for packet acceptance or rejection, offering flexibility in terms of security and performance. On the destination chain, contracts called Switchboards enable apps to choose the context in which a delivered payload is processed. Socket processes the payload only if it meets the conditions specified by the app-selected Switchboard, such as accepting payloads after a 2-hour timeout or confirming payloads through a native rollup bridge. Permissionlessness and modularity at the verification layer is a core advantage and design principle for Socket. 
4. Execution Layer: This layer handles message execution on the destination chain after verification, allowing third-party relayers like Gelato to handle execution, or for applications or users to execute their own messages. 

<img src="/img/dl-layers.png"/>

Developers can leverage SocketDL to build various cross-chain applications in a modular, flexible, and secure way.