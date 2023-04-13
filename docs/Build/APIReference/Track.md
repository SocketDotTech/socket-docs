---
id: track-status
title: Track Message Status
sidebar_position: 2
---

Tracks the status of a message 

**`GET`** [https://dl-api.dev.socket.tech/messages-from-tx](https://dl-api.dev.socket.tech/messages-from-tx)

#### Query Parameters
| Query param | Description |
| --- | --- |
| srcChainId | ID of source chain |
| srcTxHash | Transaction hash where outbound method was called |

#### Example Request

[https://dl-api.dev.socket.tech/messages-from-tx?srcChainId=137&srcTxHash=0x4b9eec6b44e5154f22554f4cfd00d3c6f83b61b92cfe7fd60056c0d5e9fa824f](https://dl-api.dev.socket.tech/messages-from-tx?srcChainId=137&srcTxHash=0x4b9eec6b44e5154f22554f4cfd00d3c6f83b61b92cfe7fd60056c0d5e9fa824f)

#### Response Parameters

| Parameter | Description |
| --- | --- |
| srcChainId | ID of source chain where message is initiated |
| destChainId | ID of destination chain where message is executed |
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
| messageStatus | Status of message (`EXECUTION_SUCCESS`) |