---
id: track-status
title: Track Message Status
sidebar_position: 3
---

Tracks the status of a message 

**`GET`** [https://prod.dlapi.socket.tech/messages-from-tx](https://prod.dlapi.socket.tech/messages-from-tx)

#### Query Parameters
| Query param | Description |
| --- | --- |
| `srcChainSlug` | Slug of source chain |
| `srcTxHash` | Transaction hash where outbound method was called |

#### Example Request

[https://prod.dlapi.socket.tech/messages-from-tx?srcChainSlug=10&srcTxHash=0xc3243233916c25f0455a9440fcd2183d49858149ad103c6ff8d6167d812bc0dc](https://prod.dlapi.socket.tech/messages-from-tx?srcChainSlug=10&srcTxHash=0xc3243233916c25f0455a9440fcd2183d49858149ad103c6ff8d6167d812bc0dc)

#### Response Parameters

| Parameter | Description |
| --- | --- |
| `status` | [Message Status](#types-of-messagestatus) |
| `messageId` | Unique ID of message |
| `packetId` | Unique ID assigned to each [Packet](../../Learn/Components/Packet.md) |
| `from.srcChainSlug` | Slug of source chain where message is initiated |
| `from.srcPlug` | Address of message sender plug |
| `to.dstChainSlug` | Slug of destination chain where message is executed |
| `to.destPlug` | Address of message receiver plug |
| `outboundTx` | Source chain transaction hash where `outbound` method was called |
| `packedMessage` | keccak256 hash of encoded message details  |
| `inboundTx` | Transaction on destination chain where the `inbound` method on Socket is called |
| `executionDetails.inboundStatus` | Status of executing `inbound` method on destination Plug [InboundStatus](#inbound-status)|
| `executionDetails.isExecuted` | Boolean value indicating if message is executed on destination chain |
| `executionDetails.executor` | Address of [Executor](../../Learn/OffChain-Agents.md) |
| `executionDetails.executionTxHash` | Destination chain transaction hash where `payload` was executed |



<!-- | executionDetails.retryingSince | Timestamp of when the `inbound` method call was last tried. Executors simulate the execution before sending it on-chain and it it fails, the executor keeps retrying |
| executionDetails.isExecutionReverting | Boolean value indicating if the `inbound` tx on the destination plug is failing  |
| executionDetails.proof | Proof of message validity on destination chain |
| executionDetails.fees | Fee for executing the payload calldata on the destination plug | -->
<!-- | message.payload | `calldata` to be executed on the destination plug |
| executionDetails.status.executor | Address of transmitter executing the `calldata` on the destination chain | -->
<!-- | status.isReceived | Indicates whether a message has been added to capacitor queue for destination chain delivery |
| status.isSealed | Is `true` when packet which includes the message has been sealed on source chain |
| status.isProposed | Is `true` when packet which includes the message has been proposed on destination chain |
| status.isConfirmed | Is `true` when packet has been verified and message included in packet can be executed |
| status.isVerified | Boolean value indicating if message is verified on destination chain |
| status.isExecuted | Is true when `inbound` method on Plug has been called and payload has been executed |
| status.statusMessage | [Message Status](#types-of-messagestatus) | -->


#### Types of messageStatus

| Type | Description |
| --- | --- |
| `RECEIVED` | Message added to capacitor queue for destination chain delivery  |
| `SEALED` | Packet which includes the message has been sealed on source chain |
| `PROPOSED` | Packet which includes the message has been proposed on destination chain |
| `ATTESTED` | The validity of the packet has been attested or verified on the destination chain |
| `VERIFIED` | The message has been verified  |
| `EXECUTING` | The message is being executed |
| `EXECUTION_FAILURE` | Message execution failed |
| `EXECUTION_SUCCESS` | Message is successfully delivered to destination Plug |
| `INBOUND_REVERTING` | The `inbound` method on the destination chain plug is reverting |

#### Inbound status 

| Type | Description |
| --- | --- |
| `NOT_TRIED` | Payload execution not been tried yet |
| `REVERTING` | Payload execution is reverting on Plug's `inbound` method call |
| `EXECUTING` | Payload execution tx sent and is in progress |
| `SUCCESS` | `inbound` method called and payload successfully executed  |


