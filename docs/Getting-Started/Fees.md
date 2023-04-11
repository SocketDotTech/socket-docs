---
id: fees
title: Fees
position: 5
---

- Socket charges a fee for sending messages, to be paid in the native token of the source chain.
- This fee can be broken down into 3 different fees. 

| Parameters | Description |
| --- | --- |
| transmitFees | Fees for transmitting the message from source chain to destination chain |
| switchboardFees | Fees for sealing a message into a packet |
| executionFee | Fees for executing the message on the destination chain |

- If the fee sent when calling `outbound` on Socket is incorrect, the transaction will fail on the source chain. Socket has a GasPriceOracle which is updated with the latest relative gas fee from other chains. The price from this oracle is used to verify if the fee sent is sufficient for sending and executing the message.

- In case gas price on dest plug shoots up when executing, your message execution will get delayed. In such cases, users can pay an extra fee to ensure their message gets relayed and executed.

- The fees can be calculated using the [Fee Estimate API](../Resources/apiReference.md)
