---
id: estimate-fees
title: Estimate Fees
sidebar_position: 2
---

Estimates the fees to be sent when calling `outbound` method on the contract. The fees to be paid are in the native token of the source chain. The fees can be calculated off-chain as well as on-chain, making SocketDL a smart contract first messaging protocol.

## On-chain

The fees for relaying messages can be calculated on-chain by calling the `getMinFees()` method on Socket. The method can be inherited in your contract from the [ISocket](../Interfaces/ISocket.md) interface. 

```javascript
    interface ISocket {
        function getMinFees(
            uint256 minMsgGasLimit_,
            uint256 payloadSize_,
            bytes32 executionParams_,
            bytes32 transmissionParams_,
            uint32 remoteChainSlug_,
            address plug_
        ) external view returns (uint256 totalFees);
    }
```

#### Example
[The SpeedRunDL example contract](https://github.com/SocketDotTech/socketDL-examples/blob/main/src/SpeedRunDL/SocketSpeedRunGoerli.sol) fetches the fee on-chain and checks if the fee sent from the user is correct.

```javascript
    function _getMinimumFees(
        uint256 msgGasLimit_,
        uint32 _remoteChainSlug
    ) internal view returns (uint256) {
        return
            ISocket(socket).getMinFees(
                msgGasLimit_,
                _remoteChainSlug,
                address(this)
            );
    }

    function sendMessage() external payable {
        uint256 totalFees = _getMinimumFees(destGasLimit, remoteChainSlug);

        if (msg.value < totalFees) revert InsufficientFees();

        // ... remaining code
    }
```


## Off-chain API

**`GET`** [https://prod.dlapi.socket.tech/v1/estimate-min-fees](https://prod.dlapi.socket.tech/estimate-min-fees)

**Header**:  x-api-key : 2Va1n3HzAS5XfXB8ELhX1aATJwzA1A72sNnJE1a0


| Query Param | Description |
| --- | --- |
| `srcPlug` | Address of source Plug |
| `srcChainSlug` | Slug of source chain |
| `dstChainSlug` | Slug of destination chain |
| `msgGasLimit`| Gas limit required for executing the destination payload |

#### Example Request

Estimating fees for sending a message from Polygon to Optimism 

[https://prod.dlapi.socket.tech/v1/estimate-min-fees?srcPlug=0x7b9ed5C43E87DAFB03211651d4FA41fEa1Eb9b3D&srcChainSlug=2999&dstChainSlug=10&msgGasLimit=100000](https://prod.dlapi.socket.tech/estimate-min-fees?srcPlug=0x7b9ed5C43E87DAFB03211651d4FA41fEa1Eb9b3D&srcChainSlug=2999&dstChainSlug=10&msgGasLimit=100000)

Note : Add the *x-api-key* header mentioned above in the request for authentication. 

#### Response Parameters

| Parameter | Description |
| --- | --- |
| `result` | Total fees to be paid in the native token of the source chain |