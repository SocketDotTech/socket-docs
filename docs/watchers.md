---
id: watchers
title: Watchers
---
:::tip
Start by reading [the Architecture section](/architecture) if you have not already.
:::

## Introduction

> Watchers are off-chain operators that monitor blockchain activity while hosting a virtual machine (VM) to help application developers implement global logic that operates before their on-chain contracts are executed.

Currently, users must interact with applications directly via the blockchain, leading to increased complexities such as navigating multiple chains, paying more gas fees, and handling bridging issues. With Watchers, application developers can streamline these interactions by enabling more efficient execution of user actions on-chain.

![image.png](../static/img/watchers.png)

Watchers provide flexibility by acting as intermediaries between users and the blockchain. This allows developers to incorporate useful off-chain logic to improve user experiences. We refer to this application-defined off-chain logic as an “App-Gateway.” Users interact with the App-Gateway before any on-chain contract execution, simplifying and enhancing their interactions. The App-Gateway enables chain abstraction by acting as a cohesive layer for on-chain contracts. [Vitalik Buterin explores similar concepts in his blog about the evolution of modern applications.](https://vitalik.eth.limo/general/2024/09/02/gluecp.html)

Developers can build and deploy App-Gateways on the Watcher services.

![image.png](../static/img/watchers1.png)

## Relationship Between Watchers and Switchboards

Watchers and Switchboards work together to create a seamless off-chain and on-chain interaction system. While Watchers are off-chain operators responsible for generating proofs, Switchboards are the on-chain components that consume these proofs.

Switchboards help application developers manage and select Watchers to suit their specific needs. Anyone can become a Watcher, and anyone can create a Switchboard to connect with their Watchers, providing developers with full control and customization capabilities.

Read more about Switchboards [here](/switchboards).

:::info
**Summary:** Watchers are off-chain proof creators, and Switchboards are on-chain proof consumers.
:::
