---
id: testing-dl
title: Testing integration
sidebar_position: 3
---

### Testing SC integration
MockSocket is a test tool that Plugs can use to test their integration with Socket. MockSocket simulates the functionality of Socket without actually sending a cross-chain message. It does this by calling the `inbound` method on the Plug directly when an `outbound` message transaction is initiated. 

Plugs can use MockSocket to test their SC integration with Socket. Find example tests that utilise MockSocket in [`SocketDL-examples`](https://github.com/SocketDotTech/socketDL-examples/tree/main/test). Plugs can assert the intended state changes on the destination chain and verify successful execution of the message.

MockSocket is not an E2E testing solution for message delivery on Plugs. It does not account for validity of message, gasPrice hikes on blockchains etc. For E2E testing, Plugs can be deployed on any [supported testnets](./DeploymentsSection/Deployments.mdx).

### Testing Plug connection

#### API
The [Check Connection helper API](./APIReference/CheckConnection.md) can be used to verify a connection is successfully established between two Plugs.


#### On-chain

Once the connection step is complete, you can verify the connection was successful by calling the `getPlugConfig()` method on Socket. This is a view function that returns the config of the plug. If it returns the config, then the Plug connection is successful.