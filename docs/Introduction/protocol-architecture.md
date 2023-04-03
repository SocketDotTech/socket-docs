---
id: protocol-architecture
title: Protocol Architecture
sidebar_position: 3
---

<!-- PAGE STATUS : MOSTLY DONE. NEEDS FEW CHANGES BEFORE REVIEW -->

## On-chain actors 


### Plug 
Plugs are smart contract applications that connect with Socket to send and receive cross-chain messages.

Plugs are required to follow a contract specification to interface with Socket. Learn more about the [specs here](../Getting-Started/introducing-plugs).


### Socket 

Socket is the core contract that Plugs and off-chain actors interact with
- Socket stores the configuration of a Plug upon `connection`. Plugs call Socket to send `outbound` messages on source chain. Likewise, they receive `inbound` messages from Socket on destination chain.
- Off-chain actors (Transmitters, Executors) interact with Socket to seal packets, propose new packets and execute messages.

Socket is designed to be modular and manages these core modules
- `Switchboard`
- `TransmitManager`
- `Capacitors`
- `Hasher`


### Switchboard 

Switchboards are the packet verification module of Socket. Switchboards contain the logic that checks for validity of packets and when to execute them.

Plugs decide which switchboard to use based on their security requirements. Plugs can use different switchboards for each network they want to send messages to. However, Switchboard used for `outbound` transfer on source chain must also be used for `inbound` transfer on destination chain.

Building your own Switchboards and registering them on Socket is permissionless. Switchboards require two methods to interface with Socket : 
1. **allowPacket()** : Called by Socket to check for the validity of the packet and if it can be executed on the destination chain. The packet verification logic is complementary to this function, driven by on-chain/off-chain actors. This function returns the final `boolean` value which Socket checks.

2. **getMinFees()** : Called by Socket on source chain to determine how much fees must to be paid to the Switchboard for verifying the validity of packet on destination chain.

<!-- WIP : This must follow ISwitchboard. Also need to add rest of functions here -->
More on Switchboard specs here.

#### There are 3 default Switchboards live on Socket :
1. **Native Switchboard** : Uses Native bridges for routing messages between chains where native bridges are available (E.g roll-ups, sidechains etc.)
2. **Optimistic Switchboard** : Uses an optimistic approach for proving the validity of a packet. Once a packet is proposed if it's uncontested in a fixed time interval, then it's assumed to be valid and marked verified. This method requires one honest actor to flag a fraudulent packet and stop it from being verified. Hence this follows a 1 / n honest minority assumption.
3. **Fast Switchboard** : Uses majority consensus to verify the validity of a packet. Majority of watchers in the system must attest to the validity of the message, only then is the packet marked verified.

Since deploying Switchboards is permissionless, Plugs can build their own switchboards tailored to their needs. Some potential switchboards include zk-proof based, economic staking-slashing etc. 

### Transmit Manager 
<!-- WIP : See if there's a better way to explain what sealing and proposing packets is -->
Transmit Manager manages the off-chain actors called `Transmitters`, which are responsible for [sealing packets](./lifecycle#sending-a-message) on the source chain and [proposing packets](./lifecycle#receiving-a-message) on the destination chain.

Transmit Manager also collects fees for sealing and proposing packets, which are paid to Transmitters.


### Capacitor 
Capacitors are the message storage module of Socket. They store `outbound` messages and include them into `packets`. Once transmitters seal a packet, all stored messages are released and a `PacketComplete` event is emitted. The Capacitor is then empty and can store new messages, which will be included in the next sealed packet.

### Decapacitor 
Decapacitors exist on the destination chain and verify the inclusion of a message in a proposed packet on the destination chain.

### Gas Price Oracle 
Gas Price Oracle on respective chains store recent gas prices of all other chains. At the moment, Socket periodically updates these gas prices on each chain. The gas price from these oracles is used to calculate fees for sealing, proposing, verifying and executing messages. This enables the fee calculation to be completely on-chain, making SocketDL a smart contract first framework.

### Execution Manager 
Execution manager manages the off-chain actors called `Executors`, which are responsible for executing a verified message on the destination chain. Execution Manager also collects the fees for executing this transaction, which is claimed by `Executors`.

<!-- WIP : Do we need to explained Hasher? -->

## Off-chain actors 

### Transmitters 
Transmitters seal packets on the source chain and propose packets on the destination chain.


### Watchers 
Watchers are responsible for verifying the validity of the packet on Switchboards. Depending on the switchboard used, watchers play different roles.


### Executors 
Once a packet has been verified on the destination chain, executors send a transaction to execute the message included in the packet.

