---
id: glossary
title: Glossary
sidebar_position: 6
---

We have introduced alot of new terms and that is by design. We think for something as critical as AMB's nothing should be assumed or taken for-granted, we think these new terms are accurate and will encourage people to look into the docs/code and discourage assumptions.

<!-- TODO link the below:
- IPLug 
- Transmitter Component
- Capacitor Component
  -->

Here is a quick run-down of some of the terms/words that you will come across the entire documentation:
- **Socket**: Socket is the core contract deployed on all networks that are supported. All core modules and functions exist within Socket
- **Plug/Plugs**: Plugs are smart contract applications that connect with Socket to send and receive cross-chain messages via the IPlug interface. Plug's are generally adapter contracts that connect your main Smart contract to the messaging infrastructure.
- **Message**: Message is the payload you want to transmit along with relavent meta-data like destination chainSlug etc. 
- **Packet**: Packets are a collection of messages sent from one chain to another. The validity of messages in a packet is verified on the destination chain based on the logic prescribed in the configured switchboard. Read more about Packet's and what it contains here.
- **SealedPacket**: As soon as the transmitter seals the packet on the source-chain with his signature its called "SealedPacket". Read more about how transmitters work here. 
- **Capacitor**: Capacitor is responsibile for storing paylods in the form of a Packet, the packet is releases when the transmitter pokes the capacitor to seal the packet. Capacitors allow for native batching of payloads for better gas-performance. Read more about the capacitor here.
- **Switchboard**: Switchboards are the authenticaion/verification modules that allow developers to have custom verification for their payloads/mesages. They can be permissionlessly built and deployed by the community. Read more about them here.
- **Transmitter**: Transmitter's are the entities responsible for transmission of Packet across layers, their activity is completely on-chain and managed by TransmitManager. Read more about them here. 
- **ChainSlug**: ChainSlug is a unique identifier for that particular network or Socket deployment. It's different than chain-id or network-id used on EVM networks. You can find the assigned ChainSlug's in the deployments section.

