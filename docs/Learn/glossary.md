---
id: glossary
title: Glossary
sidebar_position: 1
---

We have introduced a lot of new terms and that is by design. We think for something as critical as AMB's nothing should be assumed or taken for-granted. We think these new terms are accurate and will encourage people to look into the docs/code and discourage assumptions.

Here is a quick run-down of some of the terms that you will come across the entire documentation:
- **Socket**: Socket is the [core contract](https://github.com/SocketDotTech/socket-DL/blob/master/contracts/socket/Socket.sol) deployed on all networks that are supported. All core modules and functions exist within Socket
- **Plug/Plugs**: Plugs are smart contract applications that connect with Socket to send and receive cross-chain messages via the [IPlug interface](../Dev%20Resources/Interfaces/IPlug.md). Plugs are generally adapter contracts that connect your main Smart contract to the messaging infrastructure.
- **Message**: Message is the payload you want to transmit along with relavent meta-data like destination chainSlug etc. 
- **Packet**: Packets are a collection of messages sent from one chain to another. The validity of messages in a packet is verified on the destination chain based on the logic prescribed in the configured switchboard. [Read more](./Components/Packet.md).
- **Sealed Packet**: As soon as the transmitter seals the packet on the source-chain with their signature it's called "SealedPacket". Read more about how transmitters work [here](./lifecycle.md#sending-a-message). 
- **Capacitor**: Capacitor is responsibile for storing messages in the form of a Packet. The packet is released when the transmitter calls the `sealPacket` method on the capacitor. Capacitors allow for native batching of payloads for better gas-performance. [Read more](./Components/Capacitors.md).
- **Switchboard**: Switchboards are the authenticaion/verification modules that allow developers to have custom verification for their payloads/messages. They can be permissionlessly built and deployed by the community. [Read more](./Components/Switchboards.md)
- **Transmitter**: Transmitters are the entities responsible for transmission of Packet across layers, their activity is completely on-chain and managed by TransmitManager. [Read more](./Components/TransmitManager.md)
- **ChainSlug**: ChainSlug is a unique identifier for a particular network or Socket deployment. It's different than Chain ID or Network ID used on EVM networks. You can find the assigned ChainSlugs in the [deployments section](../Dev%20Resources/Deployments.mdx)