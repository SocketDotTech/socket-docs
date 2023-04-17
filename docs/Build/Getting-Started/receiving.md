---
id: receiving
title: Receiving messages
sidebar_position: 3
---
Plugs on destination network need to implement `inbound()` to handle incoming messages.
<!-- // TODO link interface -->
Socket calls the `inbound` function on the destination Plug when sending the payload. The inbound() should follow the interface mentioned in the interface mentioned here. 

```javascript
interface IPlug {
    /**
     * @notice executes the message received from source chain
     * @dev this should be only executable by socket
     * @param siblingChainSlug_ chain slug of source
     * @param payload_ the data which is needed by plug at inbound call on destination
     */
    function inbound(
        uint256 siblingChainSlug_,
        bytes calldata payload_
    ) external;
}
```

Your Plug on the destination network can look something like below, in the below snippet we assume the payload is a integer.

```javascript
    uint256 number;

    function inbound(
        uint256 siblingChainSlug_,
        bytes calldata payload_
        ) external payable {
            // Make sure the caller is Socket contract only
            require(msg.sender == address(socket), "Not Socket");

            // you can do anything in this function
            // payload can be decoded to do anything
            number = abi.decode(payload)
    }
```
