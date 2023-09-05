---
id: introduction
title: What is SocketDL?
sidebar_position: 1
---

Socket Data Layer (SocketDL) is an arbitrary message passing protocol part of Socket's Interoperability stack.

Socket Interoperatbility stack includes [SocketLL](https://docs.socket.tech/socket-overview/what-is-socket) & SocketDL. SocketLL enables seamless bridging of assets across chains, while SocketDL enables secure and trust-less message passing.

Together, these enable building robust cross-chain applications

### Features of Socket DL

1. **Arbitrary Message Passing** : Arbitrary Message Passing allows a contract on Chain A to send a message (`bytes` encoded) to a contract on Chain B. This allows contracts on different chains to read and write to the state of one another. Some usecases of this can be DeFi composability across chains, NFT / gaming
2. **Modular Architecture** : SocketDL has a modular architecture which allows dApps to choose parts of the stack they'd like to use. 
3. **Security w/ Configurability** : Fast path on one, slow on anoether
4. **Easy spec to build** : Smart contracts need to add a few methods to . Very easy 

Learn more about SocketDL [architecture](./Learn/protocol-architecture.md), [message lifecycle](./Learn/lifecycle.md) & [components](./Learn/Components/_category_.json).

### Use Cases

1. **Super Token (App Chain)**

   SuperTokens are ERC-20 that can be bridged b/w chains through a Lock-n-Mint or Burn-n-Mint mechanism, secured by SocketDL. They don't require protocols to bootstrap liquidity for a token across chains. 
   
   These are live on production on Aevo. You can check out example contract here. 

2. **Super Tokens**

   SuperTokens are ERC-20 / ERC-721 that can be bridged b/w chains through a Lock-n-Mint or Burn-n-Mint mechanism, secured by SocketDL. You can find examples of 

3. **DeFi**
   - Cross-chain lending and borrowing 
   - CLOB
   - 

4. **Super Tokens**

   link actual use cases like soverign token // aevo

_& much more!_

### What's Next

1. Build on DL
2. Learn about DL
