---
id: configuring-plugs
title: Configuring Plugs
sidebar_position: 1
---

In order to connect your smart-contracts(i.e Plugs) across chains first step is pairing both your Plugs by connecting them to Socket while referencing each other.

A few pointers to keep in mind:
- Socket allows only Plugs to update this configration/connection request at any point.
- Connection should be permissioned at the Plug level by either owner_keys, governance or if you dont want to update this connection ever you can simply block re-connection forever.
- Malicious configuration while connecting to Socket could cause unintended actions.
- Connections are made pair-wise i.e you connect PlugA on ChainA to PlugB on ChainB, you can simply extend this primitive to connect to multiple chains.

<!-- // TODO: link it -->
Read more about Plugs here. 

<!-- // TODO: link to sending and recieving pages here -->
Once connected, you can use the Outbound and Inbound methods to send and receive messages.

## Finding the right parameters 

Once you are ready with both Plugs deployed on both the networks you want to work with, its time to get Plugged!
The plugs should be deployed first so you can then point them to each other and "connect".

<!-- // TODO add deployment link here -->

| Parameters | Description |
| --- | --- |
| siblingChainSlug_ | ChainSlug of the network the sibling plug is deployed on, you can find all chainSlugs here |
| siblingPlug_ | Address of your plug on the destination network |
| inboundSwitchboard_ | Switchboard address to be used for receiving messages from siblingPlug |
| outboundSwitchboard_ | Switchboard address used for sending messages to siblingPlug |

You can addresses for all verified Switchboards here and all Socket deployments here for all networks.

## Connect!! 

Once you have the Socket address, you just need call the connect method on it to configure your Plug on that chain. Remember, you need to call connect on both the chains you want to work with.

Below is a quick example for how your Plug can call the 'connect' method on Socket

```javascript
    ISocket socket = ISocket(socket_address);
    function connectToSocket(
        uint256 siblingChainSlug,
        address siblingPlug,
        address inboundSwitchboard,
        address outboundSwitchboard
    ) external {
        // ensure its permissioned
        require(msg.sender == AUTHORISED_CONNECTOR, "Caller is not authorised to make make connections");

        // finally just call the socket to connect 
        socket.connect(
            siblingChainSlug,
            siblingPlug,
            inboundSwitchboard,
            outboundSwitchboard
        );
  }
```
<!-- // TODO: Need to link alotta things below -->

## Testing your connection
Once you are done connecting, the tx will emit a log called 'PlugConnected'.

For reference, checkout this connection tx a Plug did earlier. 

Furthermore, you can do the following to check everything is solid:
- Call this function on the Socket contract that returns the config for your Plug for a given destination ChainSlug.
- Use this helper API that reads the configs and aids you to make sure your connection is correct.

<!-- // TODO: ADD GIF; ITs time to send it -->