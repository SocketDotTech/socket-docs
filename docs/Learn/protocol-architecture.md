---
id: protocol-architecture
title: Protocol Architecture
sidebar_position: 4
---

As mentioned before, Socket is a modular on-chain protocol with several modular layers working with each other, clean interfaces/APIs allowing for optimisation and security at each layer. 

There are several components in the Socket protocol that work together to make this happen.

<img src="/img/BroadArchitecture.png" />

<!-- PAGE STATUS : MOSTLY DONE. NEEDS FEW CHANGES BEFORE REVIEW -->

<!-- // TODO: add mechanism paragraph here -->

<!-- // TODO: Link the components section below -->


Socket is an on-chain contract that transmits payloads between chains. When a payload is sent by an app, Socket compresses it into a Packet- a cryptographic hash representing 1000s of payloads across apps.

Packet delivery is carried out by off-chain participants called "Transmitters". The transmitters compete with each other & the one offering the most efficient packet delivery wins the right to deliver the packet.

The winning transmitter signs the packet on source chain & delivers the signed packet to Socket on destination chain. The packet, along with the transmitter’s signature, is now available on Socket on both chains

On the destination chain, contracts called ‘switchboards’ allow apps to select context around how & when a delivered payload should be processed. Socket processes the payload only if it meets conditions on the app selected switchboard eg: accept payload after timeout of 2hrs, accept payload if native bridge confirms etc.

To learn more about individual components, checkout this section here for on-chain components and here for off-chain agents.