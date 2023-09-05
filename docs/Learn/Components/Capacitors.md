Capacitors are Socket Protocol defined Accumulators that accumulate or batch messages together for better gas efficiency. They are inspired by Capacitors in electrical circuits that store electrical-charges. Capacitors allow for in-protocol batching per switchboard, more messages queued equals more savings per message

Capacitors are embedded into switchboards, `Switchboards` have the freedom to choose any capacitor available at the CapacitorFactory. Capacitors can store messages in any format, a few examples can be:
- EVM BlockHeaders 
- MerkleTrees
- VerkleTrees
- HashChains 
- ZKPs

Anything can become a capacitor, it should be able to compress messages losslessly into bytes32 like the example below 
```javascript
// capacitor compresses multiple messages into a bytes32 variable
bytes32 capacitor_hat root = Capacitor(msg1, msg2, msg3...)
```
Usually, since a capacitor batches messages together but messages on destination are executed individually, capacitors are paired with decapcitors automatically. 

```javascript
// a decapacitor should be able to retrive the messsage from the root via a proof
bytes msg1 = Decapacitor(capacitor_root, proof) 
```

Once your capacitor is set into the switchboard it can only be upgraded if the switchboard allows it to be. Capacitors are just on-chain components that can be plugged into your switchboards.

## CapacitorFactory

CapacitorFactory is an upgradable contract that lists different kinds of Capacitors available. Note that this component being upgradable has no impact on message security, your capacitor once selected is embedded into the switchboard. CapacitorFactory being upgradable will have no effect on already deployed capacitors and configuration. The factory is like a capacitor menu item.

CapacitorFactory assigns each type of Capacitor a "type" which is a unique identifier(uint32) used to refer to a specific capacitor. While registering a switchboard to Socket like defined here, you specify a capacitor_type, the registration function deploys the switchboard specific capacitor and decapacitor. Developers have the ability to define the level of batching they want while they register the switchboard. 

More details around access control and ownership of CapacitorFactory [contract here](../Ownership.md).