---
id: estimate-fees
title: Estimate Fees
sidebar_position: 1
---


Estimates the fees to be sent when calling `outbound` method on the contract. The fees to be paid are in the native token of the source chain

**`GET`** [https://surge.dlapi.socket.tech/](https://surge.dlapi.socket.tech)

| Query Param | Description |
| --- | --- |
| srcChainId | ID of source chain |
| dstChainId | ID of destination chain |
| integrationType | Type of switchboard used in Plug (`FAST`, `SLOW`, `NATIVE`) |
| msgGasLimit | Gas limit required for executing the destination payload |

#### Example Request

Estimating fees for sending a message from Polygon to Optimism via “Fast” switchboard 

[https://surge.dlapi.socket.tech/estimate-fees?srcChainId=137&dstChainId=10&integrationType=FAST&msgGasLimit=100000](https://dl-api.dev.socket.tech/estimate-fees?srcChainId=137&dstChainId=10&integrationType=FAST&msgGasLimit=100000)

#### Response Parameters

| Parameter | Description |
| --- | --- |
| transmissionFees | Fees for transmitting the message from one network to another  |
| verificationFees  | Fees for checking validity of message on destination chain |
| executionFees | Fees for executing the transaction on the sibling Plug |
| totalFees | Total fees to be paid in the native token of the source chain |
