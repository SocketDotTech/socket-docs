---
id: configuring-plugs
title: Configuring Plugs
sidebar_position: 2
---
<<<<<<< HEAD
## Introduction

Smart contracts that connect to Socket to send messages to each other across chains are called Plugs. Before your Plugs can communicate to each other directly, you need to connect to Socket and inform Socket about your sibling Plugs. Plugs must “connect” or get “plugged into” Socket for each unique sibling network for sending/receiving messages.  

It's recommended to keep this action permissioned, malicious configration while connecting to Socket will cause unintended actions. In case a connection between two plugs already exists on a chain, re-connecting will override the previous configuration, Socket by default doesnt block this behaviour. However you are free to block this behaviour from your Plug.

// TODO add a note about what switchbord is and then point it to Switchboards long form

## Understand the parameters
| Parameters | Description |
| --- | --- |
| siblingChainSlug_ | Chain Slug of the network the sibling plug is deployed on |
| siblingPlug_ | Address of sibling plug |
| inboundSwitchboard_ | Switchboard used for processing messages from Sibling Plug |
| outboundSwitchboard_ | Switchboard used to process messages to Sibling Plug |

Find all chain slugs, Socket and switchboard deployed addresses [here](../Deployments.md)

## GetPlugged

Finally, once you have all the data you need, you can simply write a function in your plug like the one below and supply all data to Socket
=======


Plugs need to be configured on Socket before they can start sending and receiving messages. Plugs must “connect” or get “plugged into” Socket for each unique sibling network for sending/receiving messages.  

A connection between a plug and it's sibling plug is bi-directional. Once connected, either plug can send/receive messages from the other. A plug can have multiple siblings across chains, but must connect to Socket for each unique sibling. 

In case a connection between two plugs already exists on a chain, re-connecting will override the previous configuration.
>>>>>>> WIP/srk-final

```javascript
function connectToSocket(
        uint256 siblingChainSlug_,
        address siblingPlug_,
        address inboundSwitchboard_,
        address outboundSwitchboard_
<<<<<<< HEAD
    ) external {
        // ensure its permissioned
        require(msg.sender == AUTHORISED_CONNECTOR, "Caller is not authorised to make make connections");

        // finally just call the socket to connect 
=======
    ) external onlyOwner {
>>>>>>> WIP/srk-final
        socket.connect(
            siblingChainSlug_,
            siblingPlug_,
            inboundSwitchboard_,
            outboundSwitchboard_
        );
  }
```

<<<<<<< HEAD
=======
| Parameters | Description |
| --- | --- |
| siblingChainSlug_ | Chain Slug/ID of the network the sibling plug is deployed on |
| siblingPlug_ | Address of sibling plug on respective network |
| inboundSwitchboard_ | Switchboard used for receiving messages from siblingPlug |
| outboundSwitchboard_ | Switchboard used for sending messages to siblingPlug |

Find all chain slugs, Socket and switchboard deployed addresses [here](../Deployments.md)
>>>>>>> WIP/srk-final

:::note You're Plugged!

You've been plugged into Socket! The next sections walkthrough how to send and receiving messages.

:::
