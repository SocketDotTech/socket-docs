---
sidebar_position: 2
---
# Configure Plug

Your plug should have a function that can call `connect` on Socket to register itself. Worry not you can call this function as many times as you want.

```javascript
    /**
     * @notice sets the config specific to the plug
     * @param siblingChainSlug_ the sibling chain slug
     * @param siblingPlug_ address of plug present at sibling chain to call inbound
     * @param inboundSwitchboard_ the address of switchboard to use for receiving messages
     * @param outboundSwitchboard_ the address of switchboard to use for sending messages
     */
    function connect(
        uint256 siblingChainSlug_,
        address siblingPlug_,
        address inboundSwitchboard_,
        address outboundSwitchboard_
    ) external;
```

Remember to do this for all chains your plugs are deployed on to make sure you have plugged everything in correctly. You need to do once per connection.


