---
sidebar_position: 3
---
# Inbound

You can accept payloads from other chains by adding this inbound function that overrides the one defined in IPlug.sol. If you have connected your Plug correctly to Socket, Socket will automatically call this function as soon as its received from the source chain. 

You can execute anything in this inbound function

This is the function that needs to exist

```javascript
	/**
     * @notice executes the message received from source chain
     * @dev this should be only executable by socket
     * @param srcChainSlug_ chain slug of source
     * @param payload_ the data which is needed by plug at inbound call on remote
     */
    function inbound(
        uint256 srcChainSlug_,
        bytes calldata payload_
    ) external;
```

The payload you receive on your plug would be the exact same payload that the outbound function on the other side sent. 