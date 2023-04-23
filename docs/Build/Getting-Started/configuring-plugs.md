---
id: configuring-plugs
title: Configuring Plugs
sidebar_position: 1
---
Connecting your crosschain smart contracts (i.e. Plugs) is as easy as creating a Plug on chain A and chain B, connecting both to their chain's canonical Socket deployment, and configuring both Plugs to reference one another. 

Before getting started configuring your Plugs, here are a few things to keep in mind: 
- Socket allows only Plugs to update this configuration/connection, and allows Plugs to do so at any point. 
- Connection should be permissioned at the Plug level by either owner_keys, your protocol's governance or, to make the connection immutable, you can block re-connection forever. 
- Malicious configuration while connecting to Socket could cause unintended actions.
- Connections are made pair-wise i.e you connect PlugA on ChainA to PlugB on ChainB. To extend your deployment to chain C, you would pair a Plug on chain C with one on both Chains A and B etc. 

<!-- // TODO: link it -->
Read more about Plugs here. 

<!-- // TODO: link to sending and recieving pages here -->
Once connected, you can use the Outbound and Inbound methods to send and receive messages.

## Configuring your Plug's Parameters

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

## Connecting your Plugs

Once you have the Socket address you are connecting to, you just need call the `connect` method on it to configure your Plug on that chain. Remember, you need to call `connect` on both the chains you want to work with.

Below is a quick example for how your Plug can call the `connect` method on Socket

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