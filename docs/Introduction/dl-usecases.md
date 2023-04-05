---
sidebar_position: 2
id: dl-usecases
title: SocketDL Use cases
---
As the number of layer 1 and layer 2 blockchains continues to proliferate and the demand for a smooth UX regardless of chain becoming more important, dapp developers are faced with the challenge of building seamless experiences across a fragmented chain landscape. 

Deploying a siloed version of a dapp on one or more chains works for some use cases, and token bridges have allowed liquidity to partially move between chains, but to really unlock the power of composability within and across blockchain ecosystems, developers need the ability to pass messages and value between different chains securely and efficiently. 

**SocketDL** is an **Arbitrary Messaging Bridge** which allows for this type of generalised message passing between chains and unlocks several crosschain use cases for developers: 

**Basic asset bridges with arbitrary verification schemes**

A token is just a special kind of message, so developers can build any kind of token bridge they’d like with SocketDL. And because Switchboards allow for different verification schemes, you can either leverage an existing Switchboard (right now we support native and optimistic Switchboards) or implement your own. 

[Example] 

**Crosschain decentralized exchanges**

A DEX can offer users the ability to swap asset X on chain A to asset B on chain Y in a single transaction on chain A, removing chain as a source of friction for users and eliminating the bridging step. 

[Example] 

**Multichain NFTs and NFT infrastructure**

NFT projects can issue “multichain NFTs” on several chains at the same time, but easily bridgeable  by users to their chain of choice in a seamless, canonical way. This can unlock new NFT utility and gaming dynamics, or be used to give users the choice of what network they feel most comfortable storing their NFT on. 

[Example] 

**Crosschain governance**

Protocols with DAO governance, many of which have implementations on more than one chain, can offer DAO members the ability to vote on proposals from their chain of choice (and saving gas in the process). 

[Example] 

**Multichain borrowing and lending**

DeFi protocols can offer borrowers the convenience of being able to post collateral on chain A and borrow assets on chain B without having to even move their assets. Lenders can earn yield from borrowers on a totally different chain from them. This improves capital efficiency and liquidity in DeFi lending markets. 

[Example] 

**Multichain yield aggregation**

DeFi protocols can also offer investors multichain “vaults” by aggregating different sources of yield from different chains into a single position on any of the chains. This decreases fragmentation of liquidity and lets developers make the most of composability between different DeFi building blocks. 

[Example] 

**Non financial / Social use cases**

Web3 social protocols can make their username space, follower graphs or posts/feed multichain Any non-financial blockchain application can make full use of the diversity of chains at their disposal and invent new crosschain use cases we couldn’t have even dreamt up! 

[Example] 

The “arbitrary” in arbitrary messaging bridge really does mean you can build whatever kind of crosschain application you can think of if you can conceptualize your desired functionality as a “message” to be bridged across chains.