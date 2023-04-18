Packet is a cryptographic representation of PackedMessages. Capacitor produces Packet's as soon as PackedMessages are added to it. 

PackedMessages created whenever a new message is sent via the Outbound methond and are compressed representation of the following:
- LocalChainSlug: ChainSlug of the local network
- msg.sender: Src Plug for the LocalChainSlug
- RemoteChainSlug: ChainSlug for the remote network
- SiblingPlug: Address for the sibling Plug on RemoteChainSlug
- msgId: Unique identifier for the message
- msgGasLimit: GasLimit provided by the Plug for execution on destination
- ExecutionFee: Execution fee provided by the Plug
- Payload: Message provided by the Plug to be relayed to destination

```javascript
bytes32 packedMessage = hasher__.packMessage(
            localChainSlug,
            msg.sender,
            remoteChainSlug_,
            plugConfig.siblingPlug,
            msgId,
            msgGasLimit_,
            executionFee,
            payload_
        );
```

SealedPacket = Seal(Packet(PackMessage(MSG_DETAILS)))
