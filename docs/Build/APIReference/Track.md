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
| srcChainSlug | Slug of source chain where message is initiated |
| dstChainSlug | Slug of destination chain where message is executed |
| srcPlug | Address of message sender plug |
| destPlug | Address of message receiver plug |
| messageId | Unique ID of message |
| msgGasLimit | Gas limit set for executing the payload `calldata` on the destination plug |
| executionFee | Fee for executing the payload calldata on the destination plug |
| decapacitorProof | Proof of message validity on destination chain |
| payload | `calldata` to be executed on the destination plug |
| packedMessage | keccak256 hash of encoded message details  |
| isVerified | Boolean value indicating if message is verified on destination chain |
| isExecuted | Boolean value indicating if message is executed on destination chain |
| executionStatus | Boolean value indicating if message is successfully completed |
| isRelaying | Boolean value indicating if the transaction relaying the message is initiated |
| executor | Address of transmitter executing the `calldata` on the destination chain|
| executeTxHash | Destination chain transaction hash where `payload` was executed  |
| outboundTxHash | Source chain transaction hash where `outbound` method was called |
| firstSimulationTimestamp | Timestamp of when the `execute` tx was last simulated  |
| retry | Boolean value indicating if the execution of this transaction was retried |
| messageStatus | Status of message (`EXECUTION_SUCCESS`) |