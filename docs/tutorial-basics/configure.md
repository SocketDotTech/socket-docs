# Configure Plug

Your plug should have a function that can call `setPlugConfig` on Socket to register itself. Worry not you can call this function as many times as you want.

```javascript
/**
     * @notice sets the config specific to the plug
     * @param remoteChainSlug_ the remote chain id
     * @param remotePlug_ address of plug present at remote chain to call inbound
     * @param integrationType_ the name of accum to be used
     */
    function setPlugConfig(
        uint256 remoteChainSlug_,
        address remotePlug_,
        string memory integrationType_
    ) external;
```
