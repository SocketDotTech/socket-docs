---
id: call-smart-contracts
title: Calling smart contracts
sidebar_position: 4
---

# How to call smart-contracts?

Its super easy to call smart contracts via SOCKET protocol, just for reference this is how smart contracts call each other on a single chain

```solidity
contract Calculator {
    function add(uint256 a, uint256 b) public pure returns (uint256) {
        return a + b;
    }
}

contract CallerContract {
    Calculator calculator = 0xabc;

    function executeAdd(uint256 x, uint256 y) public returns (uint256) {
        // Call the add function of Calculator contract
        return calculator.add(x, y);
    }
}
```

In the above example `executeAdd` function when called calls another contract called `Calculator` specifically the `add` function.

Now, when these contracts are present on different chains, it could get tricky as things become async but leveraging SOCKET it would look something like this

```solidity
// this is on chainA
contract Calculator {
		address SOCKET = 0x123;
		modifier onlySOCKET() {
        require(msg.sender == socket, "not socket");
        _;
    }

    function add(uint256 a, uint256 b) public pure onlySOCKET() returns (uint256) {
        return a + b;
    }
}
```

```solidity
// this is on chainB
contract CallerContract {
		// NOTE: usage of the forwarder address
    Calculator calculator = 0xFORWARDER_ADDRESS;

	  // NOTE: usage of async key word
    function executeAdd(uint256 x, uint256 y) public onlySOCKET() returns async()(uint256) {
        // Call the add function of Calculator contract
        return calculator.add(x, y);
    }
}
```

Calling onchain contracts from Socket’s offchain vm is very similar to how you call another contract on single chain.

### Contract call example

Following is an example of how `CallerContract` calls the `add` function of `Calculator` when both of them are on single chain. You simply create an instance of `Calculator` and call `add` function on it.

```solidity
contract Note {
    string pulic note;
    function receiveNote(string calldata newNote) public {
        return note = newNote;
    }
}

contract HelloNoter {
    Note note = Note(noteAddress);

    function writeHelloNote() public {
        // Call the receiveNote function of Note contract
        return note.add(x, y);
    }
}
```

Similarly this is how you call a contract that is on chain from Socket’s offchain vm.

```solidity
// this is on chainA
contract Note {
		string pulic note;
		modifier onlySOCKET() {
        require(msg.sender == socket, "not socket");
        _;
    }

    function receiveNote(string calldata newNote) public onlySOCKET {
        return a + b;
    }
}
```
