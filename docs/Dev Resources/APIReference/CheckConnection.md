---
id: check-connection
title: Check Connection
sidebar_position: 1
---

Checks if there's an active connection between PlugA on ChainA and PlugB on ChainB, and returns the type of switchboard used.

## On-chain

The connection can be verified on-chain by calling the `getPlugConfig()` method on Socket. More on this [here](../../Build/testing-DL.md).

## Off-chain


**`GET`** [https://prod.dlapi.socket.tech/check-connection](https://prod.dlapi.socket.tech/check-connection)

| Query Param | Description |
| --- | --- |
| slugA | Chain A slug |
| slugB | Chain B slug |
| plugA | Address of Plug on Chain A |
| plugB | Address of Plug on Chain B |

#### Example Request

Verifying a connection between Plugs deployed on Goerli and Mumbai testnet

[https://prod.dlapi.socket.tech/check-connection?slugA=2999&slugB=10&plugA=0x7b9ed5C43E87DAFB03211651d4FA41fEa1Eb9b3D&plugB=0x1812ff6bd726934f18159164e2927B34949B16a8](https://prod.dlapi.socket.tech/check-connection?slugA=2999&slugB=10&plugA=0x7b9ed5C43E87DAFB03211651d4FA41fEa1Eb9b3D&plugB=0x1812ff6bd726934f18159164e2927B34949B16a8)

#### Response Parameters

| Parameter | Description |
| --- | --- |
| arePlugsConnected | Boolean value indicating if there's an active connection between Plugs  |
| aToBIntegrationType  | Returns type of switchboard used for connection from PlugA to PlugB (`FAST`, `SLOW`, `NATIVE`)|
| bToAIntegrationType | Returns type of switchboard used for connection from PlugB to PlugA  (`FAST`, `SLOW`, `NATIVE`) |
