---
id: track-status
title: Track Message Status
sidebar_position: 3
---

Tracks the status of a message 

**`GET`** [https://surge.dlapi.socket.tech/messages-from-tx](https://surge.dlapi.socket.tech/messages-from-tx)

#### Query Parameters
| Query param | Description |
| --- | --- |
| srcChainSlug | Slug of source chain |
| srcTxHash | Transaction hash where outbound method was called |

#### Example Request

[https://surge.dlapi.socket.tech/messages-from-tx?srcChainSlug=5&srcTxHash=0x6cd4a68b9136490dd1ecc8a1e6e45c92b9057aa2c335af5177f53478f5472cc4](https://surge.dlapi.socket.tech/messages-from-tx?srcChainSlug=5&srcTxHash=0x6cd4a68b9136490dd1ecc8a1e6e45c92b9057aa2c335af5177f53478f5472cc4)

#### Response Parameters

| Parameter | Description |
| --- | --- |
| message.messageId | Unique ID of message |
| message.from | Details of the source Plug which sent the message |
| srcChainSlug | Slug of source chain where message is initiated |
| srcPlug | Address of message sender plug |
| message.to | Details of the destination Plug the message is sent to |
| dstChainSlug | Slug of destination chain where message is executed |
| destPlug | Address of message receiver plug |
| message.packedMessage | keccak256 hash of encoded message details  |
| message.payload | `calldata` to be executed on the destination plug |
| executionDetails.status.executor | Address of transmitter executing the `calldata` on the destination chain |
| executionDetails.status.isExecuted | Boolean value indicating if message is executed on destination chain |
| executionDetails.status.executionTxHash | Destination chain transaction hash where `payload` was executed |
| executionDetails.retryingSince | Timestamp of when the `inbound` method call was last tried. Executors simulate the execution before sending it on-chain and it it fails, the executor keeps retrying |
| executionDetails.isExecutionReverting | Boolean value indicating if the `inbound` tx on the destination plug is failing  |
| executionDetails.proof | Proof of message validity on destination chain |
| executionDetails.fees | Fee for executing the payload calldata on the destination plug |
| outboundTx | Source chain transaction hash where `outbound` method was called |
| inboundTx | Transaction on destination chain where the `inbound` method on Socket is called |
| status.isReceived | Indicates whether a message has been added to capacitor queue for destination chain delivery |
| status.isSealed | Is `true` when packet which includes the message has been sealed on source chain |
| status.isProposed | Is `true` when packet which includes the message has been proposed on destination chain |
| status.isConfirmed | Is `true` when packet has been verified and message included in packet can be executed |
| status.isVerified | Boolean value indicating if message is verified on destination chain |
| status.isExecuted | Is true when `inbound` method on Plug has been called and payload has been executed |
| status.statusMessage | [Message Status](#types-of-messagestatus) |


#### Types of messageStatus

| Type | Description |
| --- | --- |
| `RECEIVED` | Message added to capacitor queue for destination chain delivery  |
| `SEALED` | Packet which includes the message has been sealed on source chain |
| `PROPOSED` | Packet which includes the message has been proposed on destination chain |
| `CONFIRMED` | Packet has been verified and message included in packet can be executed |
| `EXECUTION_FAILURE` | Message execution failed |
| `EXECUTION_SUCCESS` | Message is successfully develiered to destination Plug |