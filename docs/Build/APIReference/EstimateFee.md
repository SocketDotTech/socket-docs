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
            uint256 msgGasLimit_,
            uint32 remoteChainSlug_,
            address plug_
        ) external view returns (uint256 totalFees);
    }
```

#### Example
[The SpeedRunDL example contract](https://github.com/SocketDotTech/socketDL-examples/blob/8f424f44e96088ceb3d22de89aca2b2896168cd0/src/SpeedRunDL/SocketSpeedRunGoerli.sol#L115) fetches the fee on-chain and checks if the fee sent from the user is correct.

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

**`GET`** [https://surge.dlapi.socket.tech/estimate-fees](https://surge.dlapi.socket.tech/estimate-fees)

| Query Param | Description |
| --- | --- |
| srcChainSlug | Slug of source chain |
| dstChainSlug | Slug of destination chain |
| integrationType | Type of switchboard used in Plug (`FAST`, `SLOW`, `NATIVE`) |
| msgGasLimit | Gas limit required for executing the destination payload |

#### Example Request

Estimating fees for sending a message from Polygon to Optimism via “Fast” switchboard 

[https://surge.dlapi.socket.tech/estimate-fees?srcChainSlug=137&dstChainSlug=10&integrationType=FAST&msgGasLimit=100000](https://surge.dlapi.socket.tech/estimate-fees?srcChainSlug=137&dstChainSlug=10&integrationType=FAST&msgGasLimit=100000)

#### Response Parameters

| Parameter | Description |
| --- | --- |
| transmissionFees | Fees for transmitting the message from one network to another  |
| verificationFees  | Fees for checking validity of message on destination chain |
| executionFees | Fees for executing the transaction on the sibling Plug |
| totalFees | Total fees to be paid in the native token of the source chain |
