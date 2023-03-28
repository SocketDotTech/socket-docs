---
id: api-reference
title: API Reference
---

SocketDL has 2 helper APIs for estimating fees and tracking status of messages

### Estimating Fees

Estimates the fees to be sent when calling `outbound` method on the contract. The fees to be paid are in the native token of the source chain

**`GET`** [https://dl-api.dev.socket.tech/estimate-fees](https://dl-api.dev.socket.tech/estimate-fees)

| Query Param | Description |
| --- | --- |
| srcChainId | ID of source chain |
| dstChainId | ID of destination chain |
| integrationType | Type of switchboard used in Plug (`FAST`, `SLOW`, `NATIVE`) |
| msgGasLimit | Gas limit required for executing the destination payload |

#### Example Request

Estimating fees for sending a message from Polygon to Optimism via “Fast” switchboard 

[https://dl-api.dev.socket.tech/estimate-fees?srcChainId=137&dstChainId=10&integrationType=FAST&msgGasLimit=100000](https://dl-api.dev.socket.tech/estimate-fees?srcChainId=137&dstChainId=10&integrationType=FAST&msgGasLimit=100000)

#### Response Parameters

| Parameter | Description |
| --- | --- |
| transmissionFees | Fees for transmitting the message from one network to another  |
| verificationFees  | Fees for checking validity of message on destination chain |
| executionFees | Fees for executing the transaction on the sibling Plug |
| totalFees | Total fees to be paid in the native token of the source chain |

### Transaction Status

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