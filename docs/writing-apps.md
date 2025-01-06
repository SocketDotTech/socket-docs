---
id: writing-apps
title: Going chain abstracted
---

### _A practical example of a horizontally scaled token_

## Introduction

In this guide, we will expand a single chain ERC20 token into any chain we want using the SOCKET Protocol.

You’ll learn how to:

- Create an app that allows to bridge those tokens to any chain we want out token in;
- Create a multi-chain mintable and burnable ERC20 token contract;
- Use offchainVM to check eligibility and trigger onchain minting;
- Test and deploy our app across multiple chains.

## Architecture Overview

The System consists of 4 main components.

<!--  TODO: UPDATE URLs once it get's merged to the master branch -->
- A [Deployer Contract](https://github.com/SocketDotTech/socket-protocol/blob/going-multichain-erc20/contracts/apps/going-multichain-erc20/MultichainTokenDeployer.sol) on offchainVM that handles the deployment of onchain contracts for this application;
  - To identify the contracts that are possible to be deployed with this app, see the `bytes32` variables;
  - These are unique identifiers for the contracts and are used to fetch the `creationCode`, `onchain addresses` and `forwarder addresses` from mappings in `AppGatewayBase`. This identifier can be created using `_createContractId` function;
  - This stored code is used for deploying the token to the underlying chains.
- An [Application Gateway Contract](https://github.com/SocketDotTech/socket-protocol/blob/going-multichain-erc20/contracts/apps/going-multichain-erc20/MultichainTokenAppGateway.sol) on offchainVM that manages the application logic and logic related to interacting with onchain instances;
  - An Application Gateway has a Deployer contract associated with it;
  - This is how you indicate which contracts are allowed to call your onchain contracts and SOCKET protocol knows where to charge fees from when a contract on offchainVM calls a contract on chain;
  - This is contract users will interact with when using the token in a multichain environment;
- An onchain [ERC20 Token Contract](https://github.com/SocketDotTech/socket-protocol/blob/going-multichain-erc20/contracts/apps/going-multichain-erc20/MultichainToken.sol) that can be deployed to any chain;
  - Standard ERC20 token using Solady;
  - Owner of the contract is the Application Gateway;
  - This contract is expected to be deployed via SOCKET protocol such that the owner is the Application Gateway;
  - The `mint` and `burn` functions have `onlySOCKET` modifier because these are called by `AppGateway` via SOCKET.
  <!-- TODO: Change MultichainToken contract to have Ownable -->
  <!-- TODO: Have contracts load NotSocket from common/Errors.sol -->
- An onchain [Vault Contract](https://github.com/SocketDotTech/socket-protocol/blob/going-multichain-erc20/contracts/apps/going-multichain-erc20/Vault.sol) that will be deployed on the existing ERC20 token chain;
  <!-- TODO: Have contracts load NotSocket from common/Errors.sol -->

## Reading onchain functions

## Calling onchain functions

## Testing in a chain

## Fee setup
With the contracts ready, we can go on to deploy things. In true Chain Abstracted spirit, you as a developer only need to interact with the offchainVM and never with the chains directly unless you want to verify if things were done correctly.

### Deploy Contracts to offchainVM: SetupMyToken.s.sol

You need to deploy the `MyTokenDeployer` and `MyTokenDistrbutor` to the offchainVM.

You can get the `addressResolver` from [here](/chain-information).

### Fund your App

Next, go on to setup fees so that offchainVM can send transactions and deploy contracts on your app’s behalf. On any supported chain, deposit fees against `MyTokenAppGateway`’s address. Read more about setting up fees and generating `feesData` [here](/fees).

## Deployment
### Deploy Token to chains: DeployMyToken.s.sol

Once your app is funded, you can trigger the deployment of `MyToken` on desired chains. In this case as well, just interact with offchainVM. Call `deployContracts` function of `MyTokenDeployer` contract for each chain where deployment needs to be done.

Deployment of on chain contracts should take couple minutes. You can track the status of this request and also check the deployed addresses using our [apis](/api).

### **Deployment Flow**

![deployment_flow.png](../static/img/deployment_flow.svg)
