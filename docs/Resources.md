---
sidebar_position: 2
---

# Resources
## Track status of your message

```
GET https://dl-api.dev.socket.tech/messages-from-tx?srcChainId=<insert_src_chain_id>&srcTxHash=<insert_src_tx>
```

Here is an Example API call to check the response -- [Click here](https://dl-api.dev.socket.tech/messages-from-tx?srcChainId=80001&srcTxHash=0xb68421f063157c3ee5ba082c8f0b49bcb5763f4a21f0921e57a44fd5d95181ba)


## Estimate Fees API

```
GET https://dl-api.dev.socket.tech/estimate-fees?srcChainId=<insert_src_chain>&dstChainId=<insert_dest_chain>&integrationType=FAST&msgGasLimit=100000
```
Here is an example API call to estimate fees for a message with gasLimit=100000 going from sourceChain=137 to destChain=56 -- [Click here](https://dl-api.dev.socket.tech/estimate-fees?srcChainId=137&dstChainId=56&integrationType=FAST&msgGasLimit=100000)

## Important Interfaces

https://github.com/SocketDotTech/socketDL-examples/tree/main/src/interfaces

## MockContract

## Example Plug

Cross-Chain Counter: https://github.com/SocketDotTech/socketDL-examples/blob/main/src/Counter.sol

Cross-Chain Ping-Pong: https://github.com/SocketDotTech/socketDL-examples/blob/main/src/PingPong.sol
