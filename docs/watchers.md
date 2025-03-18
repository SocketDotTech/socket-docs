---
id: watchers
title: Watchers
---

:::tip
Start by reading the [Architecture section](/architecture) if you haven't already.
:::

**Watchers** are offchain operators that monitor blockchain activity and host the **AppGateway**, a contract that enables custom offchain logic. They execute logic defined by application developers and generate a **proof**, which is then passed to a **Transmitter** for onchain verification by a **Switchboard**.

Watchers act as a bridge between the user and the blockchain, enabling developers to insert useful offchain logic before onchain smart contracts are executed.

<div style={{ display: 'flex', justifyContent: 'center' }}>
    <img src="/img/watchers.svg" alt="watcher diagram" style={{ width: '80%' }} />
</div>

Today, when users interact with your application, they typically do so directly onchain, facing issues like high gas fees, complex bridging, and cross-chain interactions. **Watchers** help streamline this process by handling some of the logic offchain, improving performance and user experience.

### Key Role of Watchers

- **Hosts AppGateways:**
  Watchers run specialized virtual machines (VMs) that host AppGateway contracts, which execute custom offchain logic defined by application developers.

- **Generate Proofs:**
  Watchers observe blockchain events, execute logic, and generate **proofs** that are later verified onchain by **Switchboards**.

- **Passive Role:**
  Anyone can become a Watcher by running a node. There are no special permissions required to participate.

Read more about the relationship between Watchers and Switchboards [here](/switchboards).

## How Watchers Fit into the Protocol

1. **User signs an offchain message** and sends it to a Watcher where the AppGateway logic is executed.
2. **The Watcher generates a proof**, which is passed to a Transmitter.
3. **The Transmitter submits the proof onchain**, where it is verified by a Switchboard before triggering the onchain smart contract.

Watchers are a critical component of the SOCKET protocol, providing flexibility to developers to introduce custom logic that can improve security, reduce costs, and enhance user experience.
