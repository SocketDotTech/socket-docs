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

[https://prod.dlapi.socket.tech/check-connection?slugA=10&slugB=42161&plugA=0x876B15bc0963C3c1AcA50Adfc0685A458449E41d&plugB=0x93Aea8359197E3E90d99811FA80AeA1A849373de](https://prod.dlapi.socket.tech/check-connection?slugA=10&slugB=42161&plugA=0x876B15bc0963C3c1AcA50Adfc0685A458449E41d&plugB=0x93Aea8359197E3E90d99811FA80AeA1A849373de)

#### Response Parameters

| Parameter | Description |
| --- | --- |
| arePlugsConnected | Boolean value indicating if there's an active connection between Plugs  |
| aToBIntegrationType  | Returns type of switchboard used for connection from PlugA to PlugB (`FAST`, `SLOW`, `NATIVE`)|
| bToAIntegrationType | Returns type of switchboard used for connection from PlugB to PlugA  (`FAST`, `SLOW`, `NATIVE`) |
