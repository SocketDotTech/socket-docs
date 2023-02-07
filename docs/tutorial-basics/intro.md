---
sidebar_position: 1
---
# Introduction

Socket allows developers to write various kinds of Plugs that when plugged into Socket become the cross-chain adapters for your application. 

There are 3 functionalities that you will be exposed to as a developer:
- outbound() - The function you need to call to send a payload(data) to other chains
- inbound() - The function that Socket will call to give your Plug payload(data) from other chains
- connect() - The function you need to call on each chain to connect your plug to the Socket

A plug is nothing but a solidity contract that registers itself to Socket, it needs to have a function that internally calls outbound and/or should override the inbound function in IPlug.sol