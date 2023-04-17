---
id: glossary
title: Glossary
sidebar_position: 6
---

### Plug
Plugs are smart contract applications that connect with Socket to send and receive cross-chain messages via the IPlug interface. Plug's are generally adapter contracts that connect your main Smart contract to the messaging infrastructure.

### Sibling plug
Plugs deployed on two different chains and configured to send/receive messages between one another are called sibling plugs.

### Sibling Chain
Chain on which sibling plug is deployed is called a Sibling Chain

### Message 
Message encapsulates the payload sent from one plug to another plug along with metadata such as plug address, source/destination chain IDs, message ID, gas limit etc.

### Packet
Packets are a collection of messages sent from one chain to another. The validity of messages in a packet is verified on the destination chain based on the logic prescribed in the configured switchboard.

### Socket
Socket is the core contract that Plugs interact with to send and receive messages. Packets are "sealed" or ready to be transmitted on Socket on the source chain. Transmitters then relay this packet to the Socket contract on destination chain, where switchboards verify its authenticity and execute it.

### Switchboard
Switchboards are the security module of Socket and contain the logic for verifying the validity of packets on the destination chain. Socket has 3 types of switchboards by default, FAST, OPTIMISTIC and NATIVE. Learn more about those [here](./protocol-architecture#there-are-3-default-switchboards-live-on-socket-).
