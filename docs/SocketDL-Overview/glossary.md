---
id: glossary
title: Glossary
---

### Plug
Plugs are smart contract applications that connect with Socket to send and receive cross-chain messages.

### Sibling plug
Plugs deployed on two different chains and configured to send/receive messages between one another are called sibling plugs.

### Message 
Message encapsulates the payload sent from one plug to another plug along with metadata such as plug address, source/destination chain IDs, message ID, gas limit etc.

### Packet
Packets are a collection of messages sent from one chain to another. The validity of messages in a packet is verified on the destination chain based on the logic prescribed in the switchboard.

### Socket
Socket is the core contract that Plugs interact with to send and receive messages. Packets are "sealed" or ready to be trasnmitted on Socket contract on the source chain. Transmitters then relay this packet to the Socket contract on destination chain, which verifies its authenticity and executes it.

### Switchboard
Switchboards contain the logic for checking the validity of packets and verifying . Socket has 3 types of switchboards by default, FAST, OPTIMISTIC and NATIVE. You can learn more about those here (!! WIP LINK !!)

