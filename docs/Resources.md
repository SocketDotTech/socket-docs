---
sidebar_position: 2
---

# Resources

## Track status of your message

```
GET https://dl-api.dev.socket.tech/messages-from-tx?srcChainId=<insert_src_chain_id>&srcTxHash=<insert_src_tx>
```

Here is an Example API call to check the response -- [Click here](https://dl-api.dev.socket.tech/messages-from-tx?srcChainId=137&srcTxHash=0x4b9eec6b44e5154f22554f4cfd00d3c6f83b61b92cfe7fd60056c0d5e9fa824f)

## Estimate Fees API

```
GET https://dl-api.dev.socket.tech/estimate-fees?srcChainId=<insert_src_chain>&dstChainId=<insert_dest_chain>&integrationType=FAST&msgGasLimit=100000
```

Here is an example API call to estimate fees for a message with gasLimit=100000 going from sourceChain=137 to destChain=56 -- [Click here](https://dl-api.dev.socket.tech/estimate-fees?srcChainId=137&dstChainId=10&integrationType=FAST&msgGasLimit=100000)

## Contracts:

### Important Interfaces

1. [IPlug.sol](https://github.com/SocketDotTech/socketDL-examples/tree/main/src/interfaces/IPlug.sol)
2. [ISocket.sol](https://github.com/SocketDotTech/socketDL-examples/tree/main/src/interfaces/ISocket.sol)

### Example Plugs

1. [Cross-Chain Counter](https://github.com/SocketDotTech/socketDL-examples/blob/main/src/Counter.sol)
2. [Cross-Chain Ping-Pong](https://github.com/SocketDotTech/socketDL-examples/blob/main/src/PingPong.sol)
