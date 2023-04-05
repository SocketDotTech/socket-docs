---
id: security
title: Security
sidebar_position: 6
---

<!-- WIP section -->

Security in message passing means when you send a message from source to destination, you want to ensure the integrity of the message is intact on the destination chain.


SocketDL contracts are immutable, without proxies. 

Once a switchboard is added, it cannot be removed by Admin. 



Contract Security 

// WIP

explanation of modular security model
how Switchboards work, what trust assumptions you do and don’t have, what the risks 
(If switchboards are not built securely it could lead to loss of funds or a fradulent message being accepted, overall smart contract risk, etc) 

### Contract Security 

SocketDL contracts are immutable, trust-less and without proxies.

### Architecture Security

Socket's architecture is modular 

### Switchboard Security 

Switchboards are the epicenter of security on Socket.

The 3 switchboards live on Socket currently have robust security guarantees : 
1. Native Switchboard : Use Native bridges for routing message from source to destination chain. This is the most secure 

2. Fast Switchboard : 

3. Optimistic Switchboard : 