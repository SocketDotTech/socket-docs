---
id: fees
title: Fees
position: 5
---

<!-- 
    What are fees in this system? 
    Who takes the fees? What kind of fees are involved? 
    How to estimate the fees? Link API
    On-chain way to estimate the fees. Link example 
    When to send the fees? Link example 
    More fees === guaranteed execution 
    Less fees === message may be stuck in case dest gasPrice spikes up only
 -->

Plugs need to pay a fee for getting messages included in packets, verified on the destination chain and then executed.

**Breakdown of fees**

| Fee | Description |
| --- | --- |
| Transmission Fees | Fees paid to Transmitters for sealing packets on the source chain and proposing packets on the destination chain |
| Switchboard Fees | Fees paid to Watchers for verifying the validity of a packet on the destination chain. |
| Execution Fee | Fees paid to Executors for executing the message payload on the destination chain |

### Estimating Fees 
Fees can be estimated off-chain using the [Fee Estimation API](../../dev-resources/APIReference/EstimateFee.md). The API calculates the total fee to be sent while sending a message and also returns a breakdown of each fee component.

### Estimating Fees on-chain 

Sending a cross-chain message requires the message to be verified and executed on the destination chain and the fees for this need to be calculated with the destination chain `gasPrice`. But the gasPrice of the destination chain is not known on the source chain. To enable this calculation, Socket maintains a siblingChain gas fee mapping on the ExecutionManager, TransmitManager and Switchboards. These fees are updated periodically by off-chain agents with the `FEES_UPDATER_ROLE`

#### How to fetch fee estimate
Plugs can use [ISocket](../../dev-resources/Interfaces/ISocket.md) to call `getMinFees` method on Socket. This method takes the payload execution gasLimit, destination chain ID, payload size and plug address as input and calculates the total fee. This enables Plugs to be completely on-chain and not rely on any off-chain services for fee calculation or to interact with Socket. 

`getMinFees` returns the totalFee, which is to be sent in the native token of the chain when calling `outbound` on Socket. 

### Minimum Fees 

Socket calculates the minimum fee to ensure the delivery and execution of the message. Plugs can pay a premium on this fee to ensure their message always gets included. This is relevant particularly in case of gasPrice hikes on the destination chain.


### Fee Collection

Fees are collected in their respective contracts for each type of fee. These fees are later withdrawn by off-chain actors (Transmitters, Watchers, Executors).
