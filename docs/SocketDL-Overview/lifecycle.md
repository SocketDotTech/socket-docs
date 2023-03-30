---
id: lifecycle
title: Lifecycle
---

### System Actors 



This message breaks down the interactions between off-chain and on-chain actors when sending and receiving messages.

### Sending a message 

- Plug calls `outbound` method on Socket with siblingChainSlug, siblingPlug, inboundSwitchboard, outboundSwitchboard and with fees to be paid
- Socket checks if the fee is correct and sends it to all actors accordingly 


### Receiving a message 