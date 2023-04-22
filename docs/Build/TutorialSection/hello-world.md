---
id: hello-world
title: Speed Run DL 
sidebar_position: 1
---

In this speed run tutorial, we'll be sending a "Hello World" message from one chain to another. This is a code along tutorial, you can copy the code snippets into Remix or the dev environment of your choice. In case you are stuck and want to peak at the entire code, click [here](https://remix.ethereum.org). We'll be highlighting key functions and state variables in this tutorial.


We'll be deploying the same copy of the contract on both the source and destination chain with a function to send messages and another to receive messages. In this tutorial, we'll be deploying on Goerli and Mumbai testnets, however you can deploy on any [supported networks](../DeploymentsSection/Deployments.md). Let's get started!


### Step 1 : Boilerplate code 

Below is the boilerplate code needed to get started. `ISocket` is the interface used by our contract to interact with Socket. 

`Hello World` is the contract which we'll be writing to send/receive messages.

```javascript
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

interface ISocket {
    function outbound(
        uint256 remoteChainSlug_,
        uint256 msgGasLimit_,
        bytes calldata payload_
    ) external payable returns (bytes32 msgId);

    function connect(
        uint256 siblingChainSlug_,
        address siblingPlug_,
        address inboundSwitchboard_,
        address outboundSwitchboard_
    ) external;

    function getMinFees(
        uint256 msgGasLimit_,
        uint32 remoteChainSlug_,
        address plug_
    ) external view returns (uint256 totalFees);
}

contract HelloWorld {

}
```

### Step 2 : Initialise state variables, events, modifiers

#### State variables
`message` is the message which will be set on the destination chain. `destGasLimit` is the gas limit of setting the message on the destination chain, this value mary vary depending on the chain.

#### Events
`MessageSent` is emitted when a message is sent on the source chain and `MessageReceived` is emitted when the message is received on the destination plug.

```javascript
    string public message;
    uint256 destGasLimit = 100000;
    address owner;
    address public socket;

    event MessageSent(uint256 destChainSlug, string message);
    
    event MessageReceived(uint256 srcChainSlug, string message);

    modifier isOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier isSocket() {
        require(msg.sender == socket, "Not Socket");
        _;
    }

    error InsufficientFees();

    constructor(address _socket) {
        owner = msg.sender;
        socket = _socket;
    }
```

### Step 3 : Config Functions

`configurePlug` function connects our Hello World plug to its sibling Plug on other chains. 

`setDestGasLimit` lets us set the gas limit of executing the payload on the destination chain.

```javascript 

    function configurePlug( 
        uint256 siblingChainSlug_,
        address siblingPlug_,
        address inboundSwitchboard_,
        address outboundSwitchboard_
    ) external isOwner {
        ISocket(socket).connect(
         siblingChainSlug_,
         siblingPlug_,
         inboundSwitchboard_,
         outboundSwitchboard_
        );
    }

    function setDestGasLimit(uint256 _destGasLimit) external isOwner {
        destGasLimit = _destGasLimit;
    }

```

### Step 4 : Sending messages 

`sendMessage` sends the "Hello World" message to the remote chain. This function calls Socket and initiates the cross-chain message

```javascript
        function sendMessage(
        uint256 remoteChainSlug_
    ) external payable {
        uint256 totalFees = _getMinimumFees(destGasLimit, remoteChainSlug_);

        if(msg.value < totalFees) revert InsufficientFees();
        
        bytes memory payload = abi.encode("Hello World");

        ISocket(socket).outbound(
            remoteChainSlug_, 
            destGasLimit,
            payload
        );

        emit MessageSent(remoteChainSlug_, message);
    }

    function _getMinimumFees(uint256 msgGasLimit_, uint256 remoteChainSlug_) internal view returns (uint256) {
        return ISocket(socket).getMinFees(msgGasLimit_, uint32(remoteChainSlug_), address(this));
    }
```

### Step 5 : Receiving Messages 

```javascript
    function _receiveMessage(uint256 _srcChainSlug, string memory _message) internal {
        message = _message;
        emit MessageReceived(_srcChainSlug, _message);
    }

    function inbound(uint256 srcChainSlug_, bytes calldata payload_) external isSocket {
        (string memory _message) = abi.decode(payload_, (string));
        _receiveMessage(srcChainSlug_, _message);
    }
```

### Step 6 : Deploying contracts 

The Hello World contract can be deployed on any supported network {WIP: link em}. When deploying, you need to pass the `socket` address in the constructor which you can find in the Deployment Addresses section.

You can deploy them directly from Remix to test out or in your local dev environment. 

For our test, we'll be deploying it between Goerli and Mumbai Testnet using the "FAST" path.

### Step 7 : Configuration 


### Step 8 : Hello World

