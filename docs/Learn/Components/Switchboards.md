Plugs connect to Socket via SwitchBoards, just like in real life. SwitchBoards are like open-source permissionless configration bundles that plugs can opt into OR build their own configration bundles.

Switchboards contain the following things:
- Packet authenticaion via allowPacket method
- Capacitor to be used for that switchboard
- minFees for packet validation

Switchboards allow developers to permissionlessly authenticate Packets before they get executed on their Plugs, we think there are various authenticaion models that people can leverage to manage tradeoffs for their applications:
- OptimisticVeto: Allow 1/N trust-minimised and cheap validation by introducing a challenge mechanism pre-execution where N parties can stop the execution from happening  
- FastVeto: Allow 1/N trust minimised validation by having all N parties attest on-chain
- Native: Allow rollup-bridges to validate Packets providing trustless communication

Anyone can build a switchboard that satisfies the ISwitchboard interface mentioned here. It needs to be registered to Socket before Plugs can use it via the `registerSwitchboard()` method on Socket. Registering a Switchboard is completely permissionless. 