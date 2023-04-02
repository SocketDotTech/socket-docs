---
sidebar_position: 4
---

# Outbound

You can send payloads across chains to different functions via the outbound function available on the Socket deployed on the source chain.

It looks something like this

```javascript
    /**
     * @notice registers a message
     * @dev Packs the message and includes it in a packet with capacitor
     * @param remoteChainSlug_ the remote chain slug
     * @param msgGasLimit_ the gas limit needed to execute the payload on remote
     * @param payload_ the data which is needed by plug at inbound call on remote
     */
    function outbound(
        uint256 remoteChainSlug_,
        uint256 msgGasLimit_,
        bytes calldata payload_
    ) external payable returns (uint256 msgId);
```

You can call it like this from your Plug

```javascript
        ISocket(socket).outbound{value: msg.value}(
            targetChain,
            msgGasLimit,
            payload
        );
```

| param             | purpose                                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| remoteChainSlug   | the destination chain slug                                                                                                           |
| msgGasLimit       | the gas limit needed to execute the payload on destination                                                                           |
| payload           | the data which is needed by plug at inbound call on destination                                                                      |
| msg.value (fees)  | the fees which will be deducted by Socket to distribute it to attesters and executors for signing, verifying and executing messages. |

You can find out what value to provide in the msg.value via the EstimateFees API
