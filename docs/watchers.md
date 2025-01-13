---
id: watchers
title: Watchers
---

:::tip
Start by reading the [Architecture section](/architecture) if you haven't already.
:::

**Watchers** are off-chain operators that monitor blockchain activity and host the **App-Gateway**, a contract that enables custom off-chain logic. They execute logic defined by application developers and generate a **proof**, which is then passed to a **Transmitter** for on-chain verification by a **Switchboard**.

Watchers act as a bridge between the user and the blockchain, enabling developers to insert useful off-chain logic before on-chain smart contracts are executed.

![Watchers diagram](../static/img/watchers.png)

Today, when users interact with your application, they typically do so directly on-chain, facing issues like high gas fees, complex bridging, and multi-chain interactions. **Watchers** help streamline this process by handling some of the logic off-chain, improving performance and user experience.

### Key Role of Watchers

- **Hosts App-Gateways:**
  Watchers run specialized virtual machines (VMs) that host App-Gateway contracts, which execute custom off-chain logic defined by application developers.

- **Generate Proofs:**
  Watchers observe blockchain events, execute logic, and generate **proofs** that are later verified on-chain by **Switchboards**.

- **Passive Role:**
  Anyone can become a Watcher by running a node. There are no special permissions required to participate.

Read more about the relationship between Watchers and Switchboards [here](/switchboards).

## How Watchers Fit into the Protocol

1. **User signs an off-chain message** and sends it to a Watcher where the App-Gateway logic is executed.
2. **The Watcher generates a proof**, which is passed to a Transmitter.
3. **The Transmitter submits the proof on-chain**, where it is verified by a Switchboard before triggering the on-chain smart contract.

Watchers are a critical component of the SOCKET protocol, providing flexibility to developers to introduce custom logic that can improve security, reduce costs, and enhance user experience.
