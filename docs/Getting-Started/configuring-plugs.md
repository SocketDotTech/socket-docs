---
id: configuring-plugs
title: Configuring Plugs
sidebar_position: 2
---


Plugs need to be configured on Socket before they can start sending and receiving messages. Plugs must “connect” or get “plugged into” Socket for each unique sibling network for sending/receiving messages.  

A connection between a plug and it's sibling plug is bi-directional. Once connected, either plug can send/receive messages from the other. A plug can have multiple siblings across chains, but must connect to Socket for each unique sibling. 

In case a connection between two plugs already exists on a chain, re-connecting will override the previous configuration.

```javascript
function connectToSocket(
        uint256 siblingChainSlug_,
        address siblingPlug_,
        address inboundSwitchboard_,
        address outboundSwitchboard_
    ) external onlyOwner {
        socket.connect(
            siblingChainSlug_,
            siblingPlug_,
            inboundSwitchboard_,
            outboundSwitchboard_
        );
  }
```

| Parameters | Description |
| --- | --- |
| siblingChainSlug_ | Chain Slug/ID of the network the sibling plug is deployed on |
| siblingPlug_ | Address of sibling plug on respective network |
| inboundSwitchboard_ | Switchboard used for receiving messages from siblingPlug |
| outboundSwitchboard_ | Switchboard used for sending messages to siblingPlug |

Find all chain slugs, Socket and switchboard deployed addresses [here](../Deployments.md)

:::note You're Plugged!

You've been plugged into Socket! The next sections walkthrough how to send and receiving messages.

:::
