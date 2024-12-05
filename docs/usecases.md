---
id: usecases
title: Usecases
---

# Introduction

This is not an exhaustive list of usecases that can be built on top but rather some initial ones that are either in progres or we think would make for strong usecase for SOCKET, we would love to hear from you and your usecase!

Leveraging chain-abstracted composability and pre-execution and a combination of both of these features some really powerful applications can be built on SOCKET. 

# Usecases

## Horizontal Scaling

Today to scale, more applications either launch an app-chain or go launch on a high-throughput chain, both are examples of scaling vertically. Scaling vertically in both cases has a massive composability disadvantage because applications and users on other platforms(chains/rollups) find it very hard to compose with your application.

There is another way to scale your application leveraging horizontal scaling, this kind of scaling is used today by modern applications to scale to handle real user traffic, where multiple instances of your application can be deployed simultaneously to multiple servers(rollups/chains) and traffic can be redirected/loadbalanced between them. 

Leveaging SOCKET you can write an app-gateway that does this seamlessly for your onchain contracts, [this is in effect today for some top applications and would be very cool to see more such applications](https://x.com/vaibhavchellani/status/1859544081539690909) 

## Intents

Intents are a great way to abstract alot of complexity from the user perspective and offer better user experience and efficiency of execution, developers can leverage SOCKET protocol and build app-gateways that consume intents, run auctions and much more. SOCKET enables developers to build any intent protocol they might want with full control and ability over its security, cost and performance by just writing simple solidity functions. Transmitters are part of core-protocol and will be immediately available to solve for your intent application! 

## Application Specific Sequencing

Alot of times applciations generate MEV and its beneficial for developers of these applications to capture this value and redirect it to another stake holder other than the validator of the chain the application is running on. A good example of this is OEV aka Oracle Extractable Value and the work Sorella Labs is doing to capture MEV from swaps. Developers can simply write app-gateways that sequence all the transactions for their onchain contracts, capture value and redirect it to another stake holder. 

## Security Checks

Hacks in blockchain protocols are a serious issue, while there are security services that promise to protect your application these services often take effect post the transaction where the protocol gets impacted, however using an app-gateway to process all transactions before they get executed onchain allows you to run several security checks BEFORE a transaction gets executed onchain meaning you can have a high degree of security in your application. These can be critical invariants that the application wants to ensure are never broken

There are so many other usecases like resouce-locks, aucitons and this document will be updated with time as we discover more! go build!