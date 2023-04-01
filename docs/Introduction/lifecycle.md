---
id: lifecycle
title: Lifecycle
sidebar_position: 4
---

In this section, we dive deeper into the 3 main interactions between Plugs and Socket.

### Connecting to Socket 

<img src="/img/ConnectToDL.png" />

Before Plugs can start sending and receiving messages, they need to connect or get "plugged" into Socket. Plugs make a connection with sibling plugs deployed on other chains. Plugs send configuration details such as sibling chainId, sibling plug address and switchboard configuration during connection.

Upon connection, Socket generates a unique identifier and stores this configuration. It then emits an event `PlugConnected` with the config data. Here's an example transaction.
<!-- WIP : Attach an example transaction -->

#### General Notes :

- Plugs may use different switchboards depending on their usecases and security requirements. They can even build a custom switchboard.
- Plugs can only make a connection with one plug on each sibling chain. Connecting with a different sibling plug configuration for the same chain will override the previous configuration.


### Sending a message 

Plugs build on top of Socket to initiate state changes on Plugs deployed on other chains. They do this by passing a message payload that has the state changes encoded, which destination plugs decode and execute.

 <img src="/img/SendMessageOutbound.png" />

To pass a message, Plugs call the `outbound` method on Socket with `fees`, `remoteChainSlug`, `msgGasLimit`, `payload`. Socket checks the stored configuration of the plug and verifies a connection with the remote chain was previously instantiated. Socket deducts the fee sent from the plug and pays to various off-chain actors.

Plugs need to pay a fee to off-chain actors to get messages included in a packet to be executed on the destination chain. You can learn more about these [fees here](../Build-on-SocketDL/Fees.md).

<!-- WIP : Link key parameters && link capacitor -->
<!-- WIP : Highlight capacitors are modular and different types of capacitors can exist which can be configured on switchboard -->
Socket encodes key parameters into a message and hashes the encoded data. It then calls the capacitor and stores the hashed message in the capacitor. This emits a `MessageAdded` event. The message is stored in the capacitor until it can be emitted. Capacitors are chain specific and all messages to be sent to respective destination chains get aggregated in the capacitor.

Periodically, Off-chain transmitters will call `seal()` method on the capacitor which seals all stored messages into a packet and emits a `PacketComplete` event for the packet.

This event is then picked up by relayer transmitters that propose this packet on the destination chain. More on this in the next section.

### Receiving a message

<!-- WIP : Link Protocol Architecture. Explain the events there -->
The transmitter relays the sealed packet to the destination chain. This includes the `packetId`, `root` & `signature`. More on the relayed data here. The packet is stored on Socket and a `PacketProposed` event is emitted.

<!-- WIP : Watcher checking packets flow, link Switchboards 101 -->
Once a packet is proposed, depending on the Switchboard used, the packet's validity is verified by watchers. More on this here.

Once the packet is verified, executors then call `execute` on a message. During the execution of the message, the following is checked : 
1. The message is included in a packet (Decapacitor)
2. The packet has been verified by the switchboard and exists on the source chain (Switchboard)

If these are verified, then the message can be executed. Socket calls the destination plug and passes `payload`, which can be arbitrarily executed. 

<!-- WIP : Mention X -->
In case the message cannot be executed due to insufficient gas limit or other errors, Socket will re-try execution periodically upto X.

### Switchboards 101


### Global View





