Plugs connect to Socket via Switchboards(just like in real life). Switchboards are like open-source permissionless configration bundles that plugs can opt into OR build their own configration bundles.

Switchboards contain the following things:
- Packet authenticaion via `allowPacket` method
- Capacitor to be used for that switchboard
- Decapacitor to be used for verifying message inclusion in Packet
- minFees for packet validation

Switchboards allow developers to permissionlessly authenticate Packets before they get executed on their Plugs, we think there are various authenticaion models that people can leverage to manage tradeoffs for their applications. 

Anyone can build a switchboard that satisfies the [ISwitchboard interface](../../Dev%20Resources/Interfaces/ISwitchboard.md). It needs to be registered to Socket before Plugs can use it via the `registerSwitchboard()` method on Socket. Registering a Switchboard is completely permissionless. 

Socket Labs has bootstrapped some switchboards with different tradeoffs for end developers, we encourage developers to feel free to leverage these switchboards if they are suitable for their usecase.
- Optimistic Switchboard: Allow 1/N trust-minimised and cheap validation by introducing a challenge mechanism pre-execution where N parties can stop the packet from getting executed. This Switchboard will be extremely cheap to leverage but will have a latency of the challenge period. 
- Fast Switchboard: Allow 1/N trust minimised validation by having all N parties attest on-chain, this is still as secure as the OptimisticSwitchboard but might cost more on-chain depending on the destination chain.
- Native Switchboard: Allows developers to leverage native verification for eg: rollup-validation whereever it's available, we have built these connectors for Polygon, Arbitrum and Optimism right now. Developers who want to leverage security of the native-security should leverage these.

We encourage developers to build their own Switchboards and register them on the Socket contract, we would love to drive innnovation on the verification layer. 