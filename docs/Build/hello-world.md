---
id: hello-world
title: Speed Run DL 
sidebar_position: 1
---

This speed run tutorial will help you get started with SocketDL as quickly as possible. We will be writing a contract to send/receive messages between chains by leveraging Socket's infrastructure for secure cross-chain communication. <br/>
This tutorial can be replicated in any dev environment of your choice, even though we will use [Remix](https://remix.ethereum.org/) for the sake of simplicity.

In this tutorial, we will send and receive a *"Hello World"* string between Goerli and Mumbai testnets, even though Socket has a variety of [supported networks](../dev-resources/Deployments.mdx). <br/>
You can also check out the [entire code on GitHub](https://github.com/SocketDotTech/socketDL-examples/blob/main/src/SpeedRunDL/SocketSpeedRunGoerli.sol).

Let's get started!

### Step 1 : Boilerplate Interface code

Create a file named `HelloWorld_Goerli.sol`. This file will contain the code that we will deploy on Goerli. <br/>
Inside, paste the code for the `ISocket` interface:

:::note
A smart contract's interface is a collection of all of it's functions' declarations, without the definitions. An interface can be used to make calls to already deployed contracts.
:::

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

interface ISocket {
    function outbound(
        uint32 remoteChainSlug_,
        uint256 minMsgGasLimit_,
        bytes32 executionParams_,
        bytes32 transmissionParams_,
        bytes calldata payload_
    ) external payable returns (bytes32 msgId);

    function connect(
        uint32 siblingChainSlug_,
        address siblingPlug_,
        address inboundSwitchboard_,
        address outboundSwitchboard_
    ) external;

    function getMinFees(
        uint256 minMsgGasLimit_,
        uint256 payloadSize_,
        bytes32 executionParams_,
        bytes32 transmissionParams_,
        uint32 remoteChainSlug_,
        address plug_
    ) external view returns (uint256 totalFees);
}
```

### Step 2 : Initialize the main contract

Below the interface, create a contract named `HelloWorld`. We will be initializing a few state variables, events, and modifiers inside it.

```solidity
contract HelloWorld {

    string public message = "Hello World";
    address owner;

    /**
     * @dev Hardcoded values for Goerli
     */
    uint256 destGasLimit = 100000; // Gas cost of sending "Hello World" on Mumbai
    uint32 public remoteChainSlug = 80001; // Mumbai testnet chain ID
    address public socket = 0xe37D028a77B4e6fCb05FC75EBa845752cD62A0AA; // Socket Address on Goerli
    address public inboundSwitchboard = 0xd59d596B7C7cB4593F61bbE4A82C1E943C64558D; // FAST Switchboard on Goerli
    address public outboundSwitchboard = 0xd59d596B7C7cB4593F61bbE4A82C1E943C64558D; // FAST Switchboard on Goerli

    event MessageSent(uint32 destChainSlug, string message);

    event MessageReceived(uint32 srcChainSlug, string message);

    modifier isOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier isSocket() {
        require(msg.sender == socket, "Not Socket");
        _;
    }

    error InsufficientFees();

    constructor() {
        owner = msg.sender;
    }
}
```

Let us breakdown what is happening here:

First we need to set up some state variables to make sure our contracts can interact with Socket's on-chain infrastructure:

1. `destGasLimit` is the gas limit of setting the message on the destination chain. We need this because the Socket contract will need to call a function on our contracts to deliver any message.
2. `remoteChainSlug` sets the ChainId for the destination chain.
3. The `socket` contract is used to interact with core-socket utilities.
4. The `inboundSwitchboard` and `outboundSwitchboard` contracts are used to receive and send cross-chain messages respectively.
5. The string `message` is the payload that we will send cross-chain.

You can learn more at [Configuring Plugs](./contract-setup/configuring-plugs.md)

The `MessageSent` event is emitted when a message is sent from the source plug and `MessageReceived` is emitted when the message is received on the destination plug.

Lastly, we create 2 modifiers, an error to maintain access control and handle errors. The owner variable is initialized to the address that deploys the contract.

:::note
'Plug' and 'Slug' are commonly used terms in Socket's documentation. Plug is used to refer to the individual smart contracts, while slug refers to ChainIds. you can read more in our [glossary](../Learn/glossary.md)
:::

### Step 3 : Connecting Plugs

Create a function named `connectPlug` below the constructor. We will use this function connect one plug to its sibling Plug on another chain. This connection is required for the Plugs to send/receive messages from one another, and can only be called by the owner of the contract:

```solidity

    function connectPlug(address siblingPlug_) external isOwner {
        ISocket(socket).connect(
            remoteChainSlug,
            siblingPlug_,
            inboundSwitchboard,
            outboundSwitchboard
        );
    }
```

### Step 4 : Sending messages

Next, we need to create two main functions named `sendMessage` and `_getMinimumFees`.

`sendMessage` sends the "Hello World" message to the remote chain. This function calls Socket and initiates the `outbound` cross-chain message

`_getMinimumFees` fetches the fees for including messages in [Packets](../Learn/Components/Packet.md) & executing them. This can be used to verify sufficient fees is passed when sending the message. You can learn more about this in [Fees](../Learn/Concepts/Fees.md).

Additionally, we also create a function named `returnPayloadAbiSize` to get the size of our message string. This is a helper function and it's purpose will become clear later.

```solidity
    function sendMessage() external payable {
        bytes memory payload = abi.encode(message);

        uint256 totalFees = _getMinimumFees(destGasLimit, payload.length);

        if (msg.value < totalFees) revert InsufficientFees();

        ISocket(socket).outbound{value: msg.value}(
            remoteChainSlug,
            destGasLimit,
            bytes32(0),
            bytes32(0),
            payload
        );

        emit MessageSent(remoteChainSlug, message);
    }

    function _getMinimumFees(
        uint256 minMsgGasLimit_,
        uint256 payloadSize_
    ) public view returns (uint256) {
        return
            ISocket(socket).getMinFees(
                minMsgGasLimit_,
                payloadSize_,
                bytes32(0),
                bytes32(0),
                remoteChainSlug,
                address(this)
            );
    }

    function returnPayloadAbiSize() public view returns (uint256) {
        
        return abi.encode(message).length;
    }
```

### Step 5 : Receiving Messages

Finally, create two functions named `inbound` and `_receiveMessage`.

`inbound` is called by Socket on the destination Plug for executing the message once it's verified. More in this in [Lifecycle](../Learn/lifecycle.md)

`_receiveMessage` sets the value of the new message and emits the `MessageReceived` event

```solidity
    function _receiveMessage(
        uint32 _srcChainSlug,
        string memory _message
    ) internal {
        message = _message;
        emit MessageReceived(_srcChainSlug, _message);
    }

    function inbound(
        uint32 srcChainSlug_,
        bytes calldata payload_
    ) external isSocket {
        string memory _message = abi.decode(payload_, (string));
        _receiveMessage(srcChainSlug_, _message);
    }
```

:::note
The `inbound` function serves as a callback function since it can only be called by Socket in response to a message sent by the source Plug. You need to define a function by this name in your contract, and any logic inside it will be executed every time a message is received. <br/>
You could define the `_receiveMessage` function inside the `inbound` function. However, we've defined it separately to make the code more readable.
:::

### Step 6 : Deploying contracts

We are done with `HelloWorld_Goerli.sol`. Save the file, and create a new file named `HelloWorld_Mumbai.sol`.
Paste the exact same code inside, but swap out the old state variables with these:

```solidity
    /**
     * @dev Hardcoded values for Mumbai
     */
    uint256 destGasLimit = 100000; // Gas cost of sending "Hello World" on Goerli
    uint32 public remoteChainSlug = 5; // Goerli testnet chain ID
    address public socket = 0x718826B533DF29C30f2d3f30E585e405eeF22784; // Socket Address on Mumbai
    address public inboundSwitchboard = 0x27513Ed43490B6e0801e724ff1b1637be657447E; // FAST Switchboard on Mumbai
    address public outboundSwitchboard = 0x27513Ed43490B6e0801e724ff1b1637be657447E; // FAST Switchboard on Mumbai
```

Deploy both of the contracts to their respective chains.

### Step 7 : Configuration

Once you've deployed the contracts on Goerli and Mumbai, call the `connectPlug` function with the address of the contract deployed on the other chain. You need to do this on both of the contracts.

<img src="/img/connectPlug-hello-world.png" width="500px"/>

<br/><br/>
This establishes a connection between the two Plugs deployed and you can now send messages between them!

### Step 8 : Hello World

To send a cross-chain message successfully, you need to estimate the gas fee required to deliver the message on the destination chain.
You have two options:

1. Call the `_getMinimumFees` on your contract to get the minimum fees required to send the message. You can get the payload size by calling the `returnPayloadAbiSize` function. <br/>
2. Alternatively, you can also use our off-chain API, referenced in our [docs](../dev-resources/APIReference/EstimateFee.md).

Finally, call the `sendMessage` function on your contract to send the message. This is how it looks like on Remix:
<img src="/img/sendMessage-hello-world.png" width="400px"/>

<br/><br/>

That's it! You can now track the status of your message using the [Status Tracking API](../dev-resources/APIReference/Track.md). Once your message is executed on destination chain, you'll be able to see the `message` value set to "Hello World" on Mumbai.

<img src="/img/success-hello-world.png" width="400px"/>

<br/><br/>

:::note You're Plugged!

You've successfully sent your first message via SocketDL. Explore more in [Tutorials](../dev-resources/TutorialSection/Counter.md) and [Examples](./ExampleSection/examples.md).

:::
