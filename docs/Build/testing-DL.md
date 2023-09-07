---
id: testing-dl
title: Testing integration
sidebar_position: 3
---

### Testing SC integration
MockSocket is a test tool that Plugs can use to test their integration with Socket. MockSocket simulates the functionality of Socket without actually sending a cross-chain message. It does this by calling the `inbound` method on the Plug directly when an `outbound` message transaction is initiated. 

Plugs can use MockSocket to test their SC integration with Socket. Find example tests that utilise MockSocket in [`SocketDL-examples`](https://github.com/SocketDotTech/socketDL-examples/tree/main/test). Plugs can assert the intended state changes on the destination chain and verify successful execution of the message.

MockSocket is not an E2E testing solution for message delivery on Plugs. It does not account for validity of message, gasPrice hikes on blockchains etc. For E2E testing, Plugs can be deployed on any [supported testnets](../Dev%20Resources/Deployments.mdx).

### Testing Plug connection

#### API
The [Check Connection helper API](../Dev%20Resources/APIReference/CheckConnection.md) can be used to verify a connection is successfully established between two Plugs.


#### On-chain

Once the connection step is complete, you can verify the connection was successful by calling the `getPlugConfig()` method on Socket. This is a view function that returns the config of the plug for a given remote chain. If it returns the config, then the Plug connection is successful.


```javascript
/* 
    EXAMPLE TO RETURN GOERLI PLUG CONFIG FOR CONNECTION MUMBAI TESTNET
    CHAIN 5

    PLUG ADDRESS : 0x876B15bc0963C3c1AcA50Adfc0685A458449E41d
    SIBLING CHAIN ID : 80001

    This script returns the configuration of a Plug for a given sibling chain
*/

const { Contract, providers } = require("ethers");

// SOCKET CONFIG
const ABI = [
    "function getPlugConfig(address plugAddress_, uint256 siblingChainSlug_) view returns (address siblingPlug, address inboundSwitchboard__, address outboundSwitchboard__, address capacitor__, address decapacitor__)"
];
const RPC = "https://rpc.ankr.com/eth_goerli";
const CONTRACT_ADDRESS = "0xA78426325b5e32Affd5f4Bc8ab6575B24DCB1762";


// PLUG CONFIG
const PLUG_ADDRESS = "0x876B15bc0963C3c1AcA50Adfc0685A458449E41d";
const SIBLING_CHAIN_SLUG = 80001;

const main = async () => {
    const provider = new providers.JsonRpcProvider(RPC);
    const contract = new Contract(CONTRACT_ADDRESS, ABI, provider);

    const plugConfig = await contract.getPlugConfig(PLUG_ADDRESS, SIBLING_CHAIN_SLUG);

    console.log(plugConfig);
}

main();
```