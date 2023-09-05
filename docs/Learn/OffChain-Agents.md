---
id: OffChain-Agents
title: Off-Chain Agents
---

There are a couple of off-chain agents running at all times to process cross-chain messages, this section will outline some of those. The only 2 cross-chain agents that are part of Socket Protocol are the following:
- Transmitters: Transmitters are the agents that are responsible for sealing packets on the source chain to finalise them and propose them on the destination chain. They are only responsible for liveliness of the system, the protocol design makes sure they can't censor packets as sealing can only be done sequentially and once a packet is sealed anyone can propose the sealed packet on the destination chain.
- Executors: Executors are workers that execute the messages from the Packet on the destination chain by calling the inbound function on the Plugs.

Apart from the above there are no native off-chain agents to Socket protocol. Depending on the switchboard you leverage there may or may not be an off-chain agent involved there. 