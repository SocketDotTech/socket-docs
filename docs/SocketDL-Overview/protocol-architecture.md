---
id: protocol-architecture
title: Protocol Architecture
---

## On-chain actors 

- Socket 
    - Plugs connect here 
    - Stores Plug Config 
    - Is the contract used to initiate all transactions 
    - Switchboards register here 

- Transmit Manager 
    - Manages transmitter role
    - Calculates fees for sealing the message on the source chain
    - Calculates fees for transmitting the payload on the destination chain
    - 

- Switchboard 
    - Switchboards describe the rules 
    - Native Switchboard 
    - Optimistic Switchboard 
    - Fast Switchboard 

- Capacitor 
    - Seals message

- Decapacitor 
    - Verifies if sealed msg == 

- Gas Price Oracle 
    - 

- Mock Socket 
    - 

- Execution Manager 
    - 

## Off-chain actors 

### Watchers 

### Attesters 

### Executors 

