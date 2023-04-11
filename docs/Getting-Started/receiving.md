---
id: receiving
title: Receiving messages
sidebar_position: 4
---


### Receiving Messages

Socket calls the `inbound` function on the destination Plug when sending the payload. The destination plug can perform any arbitrary action with this payload. 

```javascript
    function inbound(
        uint256 siblingChainSlug_,
        bytes calldata payload_
        ) external payable {
            require(msg.sender == address(socket), "Not Socket");

        	// Performs arbitrary action with payload
        	performArbitraryAction(payload_)
    }
```

| Parameters | Description |
| --- | --- |
| siblingChainSlug_ | Chain ID/Slug of the source Plug |
| payload_ | `payload` sent from source Plug |

#### Flow for receiving a message

- Once the validity of the message is verified, Socket calls the `inbound` method with the `siblingChainSlug` and `payload`.
- In case the message cannot be executed due to low gasLimit sent or the execution is reverting, the Plug must handle the faliure case. 
- Learn more about failure cases and re-trying in this section (!!WIP must link !!)

