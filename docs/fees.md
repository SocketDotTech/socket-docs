---
id: fees
title: Paying fees for transactions
---

# How to pay fees for transactions?

SOCKET works with 2 fee components -

1. The transactions on Offchain VM need to be paid using its native gas token.
2. The on chain transactions that SOCKET makes for your app can be paid on any chain and using any token of your choice.

## 1. Paying for Offchain VM transactions

This part is similar to how you usually make transactions. You specify the `gasPrice` and `gasLimit` while making transactions or you let the libs do the estimation for you.

You can get native tokens for Offchain VM via [the faucet](https://faucet.conduit.xyz/socket-composer-testnet) or you can also deposit ETH from Sepolia using [the bridge](https://socket-composer-testnet-8b802af208e24e82.testnets.rollbridge.app/).

## 2. Sponsoring onchain transactions

To sponsor offchain transactions, we first need to deposit desired tokens to socket on one of the chains.

:::info
Currently the system only works with ETH. It will soon be extended also work with other tokens.
:::

Deposits can be done by calling the deposit function on PayloadDeliveryPlug address on desired chain.

```bash
cast send <PLUG_ADDRESS> "deposit(address,uint256,address)" \
        0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE \
        <AMOUNT> \
        $COUNTER_APPGATEWAY \
        --value <AMOUNT> \
        --rpc-url $SEPOLIA_RPC \
        --private-key $PRIVATE_KEY
```

With the sponsor tokens deposited, you can set proper feesData on your `AppDeployer` and `AppGateway`.

```solidity
struct FeesData {
    uint32 feePoolChain;
    address feePoolToken;
    uint256 maxFees;
}

FeesData feesData = FeesData({
    feePoolChain: <chain_slug>,
    feePoolToken: 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE,
    maxFees: <max_fee_per_tx>
});
```

This `FeesData` can be passed to `AppDeployer` and `AppGateway` constructors they can be set using setter functions.

```solidity
    AppGateway(appGateway).setFees(feesData);
    AppDeployer(appDeployer).setFees(feesData);
```
