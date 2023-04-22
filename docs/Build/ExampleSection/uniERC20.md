---
id: example-uniERC20
title: Universal ERC20
sidebar_position: 1
---

Universal ERC-20 is an extension of ERC-20 token standard with cross-chain transfer capabilities, built on top of SocketDL. Universal ERC-20 has cross-chain transfers built-in. When sending the token between chains, it gets burnt on the sending chain and minted on the destination chain.

You can find the example on [GitHub](https://github.com/SocketDotTech/socketDL-examples/tree/feat/universal-token/src/universalTokens/uniERC20).

```javascript
    /* Burns user tokens on source chain and sends mint message on destination chain */
    function uniTransfer(
        uint256 _destChainSlug,
        address _destReceiver,
        uint256 _amount
    ) external payable {
        _burn(msg.sender, _amount);

        bytes memory payload = abi.encode(msg.sender, _destReceiver, _amount);

        ISocket(socket).outbound(
            _destChainSlug,
            destGasLimits[_destChainSlug],
            payload
        );

        emit UniTransfer(_destChainSlug, _destReceiver, _amount);
    }

    /* Decodes destination data and mints equivalent tokens burnt on source chain */
    function _uniReceive(
        uint256 siblingChainSlug_,
        bytes calldata payload_
    ) internal {
        (address _sender, address _receiver, uint256 _amount) = abi.decode(
            payload_,
            (address, address, uint256)
        );

        _mint(_receiver, _amount);

        emit UniReceive(_sender, _receiver, _amount, siblingChainSlug_);
    }
```