---
id: protocol-architecture
title: Protocol Architecture
---

## On-chain actors 


### Plug 
Plugs are smart contract applications that connect with Socket to send and receive cross-chain messages.

Plugs require to follow a specification to send/receiving messages. Learn more abobut it [here](../Build-on-SocketDL/getting-started.md).


### Socket 

Socket is the core contract that Plugs interact with to send and receive messages. It stores the configuration of a Plug upon `connection`. Plugs call Socket contract on source chain to send messages and receive the message on the destination chain from Socket. 


### Switchboard 

<!-- WIP NOTE : This needs to be broken down into core contracts and peripheral or helper contracts -->
<!-- WIP NOTE : Descriptions require revision. -->


Switchboards contain the logic that defines how to validate messages and when to execute them. Plugs point to Switchboard addresses for `outbound` messages and `inbound` messages, each may have different logic.

The Switchboard used when sending the `outbound` message will also be used on the destination chain for validating the message.

Building your own Switchboards and registering them on Socket is permissionless. Switchboards require two methods to interface with Socket : 
1. **allowPacket()** : Used by Socket to determine if the packet is valid and can be executed on the destination chain. The verification logic can be complimentary to this function, driven by on-chain/off-chain actors. This function is the final check for Socket. 

2. **_getSwitchboardFees()** : This method is used on the source chain to determine how much fees need to be paid by the user for validating the message on dest chain.

There are 3 Switchboards live in the Socket stack : 
1. **Native Switchboard** : Uses Native bridges as the routing medium for sending messages between chains where native bridges are available. (E.g roll-ups, sidechains etc.)
2. **Optimistic Switchboard** : Uses an optimistic approach for proving the validity of the message, where once a message is proposed if it's uncontested in X time, it is assumed to be valid and marked verified. This is an honest minority assumption (1/n honest actors in system).
3. **Fast Switchboard** : Uses majority consensus to verify the validity of the message. Majority of attesters in system must attest to the validity of the message.

Some potential switchboards include zk-proof based, economic staking-slashing etc.

### Transmit Manager 

Transmit Manager manages the off-chain actors called "transmitters" responsible for sealing packets on the source chain and trasmitting them on the destination chain. Once messages are sealed in a packet, they can be proposed to the destination chain and verified by the switchboard. 

### Capacitor 
Capacitors store `outbound` messages before they can be sealed in `packets`. Once a packet is sealed, a `PacketComplete` event is emitted.

### Decapacitor 
Decapitors verify that a message was included in a proposed packet on the destination chain.

### Gas Price Oracle 
Gas Price Oracle on respective chains store recent gas prices of all other chains. At the moment, Socket periodically updates these gas prices on each chain. The gas prices from these oracles is used to calculate fees for verifying and executing the transaction. This enables the fee calculation to be completely on-chain, making SocketDL smart contract first.

### Execution Manager 
Execution manager manages the off-chain actors that execute the verified message on the destination chain. It also calculates the fees for executing the message.

## Off-chain actors 

### Transmitters 


### Watchers 


### Attesters 
Attesters attest to the validity of a packet proposed on the destination chain. 

### Executors 
Relayers that send the transaction on the destination chain and execute the payload from the source plug are called executors. Executors have a permissioned role managed by the Execution Manager.

