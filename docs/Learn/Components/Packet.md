Packet is a cryptographic representation of PackedMessages. Capacitor produces Packets as soon as PackedMessages are added to it. 

PackedMessages created whenever a new message is sent via the Outbound method and are compressed representation of the following:
- chainSlug: ChainSlug of the local network
- msg.sender: Src Plug for the chainSlug
- SiblingChainSlug: ChainSlug for the sibling network
- SiblingPlug: Address for the sibling Plug on RemoteChainSlug
- MessageDetails: Details about a message such as `msgId`, `minMsgGasLimit`, `executionParams`, `payload` and `executionFee`
- msgId : Unique identifier for a message
- minMsgGasLimit: Minimum gasLimit provided by the Plug for message execution on destination
- ExecutionFee: Execution fee provided by the Plug
- Payload: Message provided by the Plug to be relayed to destination
- executionParams: Additional execution details

```javascript
        bytes32 packedMessage = hasher__.packMessage(
            chainSlug,
            msg.sender,
            siblingChainSlug_,
            plugConfig.siblingPlug,
            messageDetails
        );
```

```javascript
SealedPacket = Seal(Packet(PackMessage(MSG_DETAILS)))
```