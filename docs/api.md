---
id: api
title: API usage
---

We include a few helper APIs to help developers build effectively, while all data is available publicly these are to help developers build applications seamlessly.

Base URL - [https://api-evmx-devnet.socket.tech/](https://api-evmx-devnet.socket.tech/)

## `/getDetailsByTxHash` - Transaction hash details

This API retrieves transaction details based on the provided transaction hash (txHash). It returns the status of the transaction and any associated payloads, including execution and simulation details. The txHash is of `EVMx`.

### Request Parameters

- `txHash` (string, required): The hash of the transaction for which details are to be retrieved.

### Response Format

The response is a JSON object containing the following fields:

```json
{
  "apiStatus": "SUCCESS",
  "response": [
    {
      "status": "REVERTING",
      "Payloads": [
        {
          "payloadId": "string",
          "chainSlug": "number",
          "target": "string",
          "payload": "string",
          "callType": "string",
          "executeDetails": {
            "executeTxHash": "string or null",
            "executionStatus": "string",
            "returnData": "string",
            "callbackTxHash": "string or null"
          },
          "simulationDetails": {
            "executeSimulationStatus": "string",
            "executeRevertString": "string",
            "callbackSimulationStatus": "string",
            "callbackRevertString": "string"
          }
        }
      ],
      "feesInfo": {
        "feePoolChain": "number",
        "feePoolToken": "string",
        "maxFees": "string",
        "fee": "string"
      }
    }
  ]
}
```

### Response Fields Explanation

| Field | Type | Description |
| --- | --- | --- |
| apiStatus | string | Status of the API call (e.g., "SUCCESS") |
| status | string | Current transaction status (e.g., IN_PROGRESS, REVERTING, COMPLETED) |
| Payloads | array | Array of payload objects for the transaction |
| payloadId | string | Unique identifier for the payload |
| chainSlug | number | Blockchain identifier |
| target | string | Target address for the payload |
| payload | string | Payload data |
| callType | string | Type of call (e.g., “READ”, "WRITE", "DISTRIBUTE_FEE", “WITHDRAW”) |
| executeDetails | object | Execution details of the payload |
| executeDetails.executeTxHash | string or null | Execution transaction hash |
| executeDetails.executionStatus | string | Execution status (e.g., "PROMISE_RESOLVED", etc) |
| executeDetails.returnData | string | Data returned from execution |
| executeDetails.callbackTxHash | string or null | Callback transaction hash |
| simulationDetails | object | Payload simulation details |
| simulationDetails.executeSimulationStatus | string | Simulation status (e.g., "SIMULATION_SUCCESS") |
| simulationDetails.executeRevertString | string | Error message if simulation failed |
| simulationDetails.callbackSimulationStatus | string | Callback simulation status |
| simulationDetails.callbackRevertString | string | Callback simulation error message |
| .feesInfo | object | Transaction fee information |
| .feesInfo.feePoolChain | number | Fee pool chain id |
| .feesInfo.feePoolToken | string | Fee token Address |
| .feesInfo.maxFees | string | Maximum allowed fees for payloads |
| .feesInfo.fee | string | Actual fee charged by transmitter |

### ExecutionStatus Values

- `NO`: Indicates that there is no execution status yet.
- `FINALIZING`: The execution is in the process of being finalized.
- `FINALIZED`: The execution has been finalized by watcher.
- `EXECUTING`: The execution is currently in progress.
- `EXECUTED`: The execution has been completed successfully onchain.
- `PROMISE_RESOLVING`: The promise/callback related to the execution is being resolved.
- `PROMISE_RESOLVED`: The promise/callback has been resolved.

### Status Values

- `IN_PROGRESS`: The payloads are currently being processed.
- `REVERTING`: One of the payloads is reverting. Check individual payload details for more info.
- `COMPLETED`: all payloads are executed.

### Example Request

```json
GET /getDetailsByTxHash?txHash=0x1c1eddc12771a9f9a9d9b2882c0d7012fcf9b8ee2bb85a76fcb77ce4226340b8
```

### Example Response

```json
{
  "apiStatus": "SUCCESS",
  "response": [
    {
      "status": "REVERTING",
      "Payloads": [
        {
          "payloadId": "0x00066eee82dc804b1a84474266d59e1ccd51fae43b4df19b000000000000001f",
          "chainSlug": 421614,
          "target": "0x82dc804b1a84474266d59e1ccd51fae43b4df19b",
          "payload": "0x052c5084...00000",
          "callType": "WRITE",
          "executeDetails": {
            "executeTxHash": "0x0e1b95a6258666ba8ab50ab86891df9b1761b9b55320e1ed18d85f40d59c51ee",
            "executionStatus": "PROMISE_RESOLVED",
            "returnData": "0x",
            "callbackTxHash": "0x0e1b95a6258666ba8ab50ab86891df9b1761b9b55320e1ed18d85f40d59c51ee"
          },
          "simulationDetails": {
            "executeSimulationStatus": "SIMULATION_SUCCESS",
            "executeRevertString": "",
            "callbackSimulationStatus": "SIMULATION_SUCCESS",
            "callbackRevertString": ""
          }
        }
      ],
      "feesInfo": {
        "feePoolChain": 421614,
        "feePoolToken": "ETH",
        "maxFees": "0.001",
        "fee": "0.00001"
      }
    }
  ]
}
```

If the callType is `DEPLOY` , you will see an extra object in payload details as follows -

```json
appGatewayDetails":
  {
    "onChainAddress": "0x120C7763B29c39d6A2A354B73A868Cc19abDcbf0",
    "forwarderAddress": "0xFfc8F5a446647515afd168F9F38772b38e2d0837",
    "isForwarderDeployed": false
  }
```

As soon as onchain deployment is done, we will get the onChainAddress and forwarderAddress. ForwarderAddress is derived from chainSlug and onChainAddress. In the callback, forwarderAddress is deployed and the `isForwarderDeployed` variable will become `true`.  Now you can start using your forwarderAddress.

## `getAddresses` - onchain and forwarder addresses

Retrieves deployed addresses for a specified AppGateway contract. It returns onchain deployed addresses, along with their corresponding forwarderAddresses.

### Endpoint:

GET /getAddresses

### Query Parameters:

| Parameter | Type | Description |
| --- | --- | --- |
| appGatewayAddress | string | offchain address of appGateway contract |
| contractId | string | The contract identifier used in appGateway contract |
| chainSlug | number | The chain id to specify the blockchain. |

### Returns:

A JSON object with these fields:

```json
{
	"onchain": {
		"chainSlug": 421614
		"deployedContract": "0x3e3d9f517De1CA6d41f5A79ED1D9340d8fF3FC7F"
	},
	"offchain": {
		"forwarder": "0x31828eb15fc1F18901b75329AB1d06f4C5dda43D",
		"contractId": "0xbeca3ec2d1dd91b46d9eccba1f77d96f5e4fe32fc344efb846bbf5cbad45e19e"
	}
}
```

### Example Request:

```json
GET /getAddresses?appGatewayAddress=0xD6E4aA932147A3FE5311dA1b67D9e73da06F9cEf&contractId=0xbeca3ec2d1dd91b46d9eccba1f77d96f5e4fe32fc344efb846bbf5cbad45e19e&chainSlug=421614
```

Note: Once you call `deployContracts()` function on your AppGateway, it will take some time to deploy the onchain contract and offchain forwarder contract.

If some of the addresses return as Address(0), wait for some time, as deployment might be in progress. If you get Address(0) after 5 minutes of the initial call, contact the team.

## `getForwarderAddress` - from onchain address

Retrieves the forwarder address for a given onchain address. This address is predicted using create2.

### Endpoint:

GET /getForwarderAddress

### Query Parameters:

| Parameter | Type | Description |
| --- | --- | --- |
| onChainAddress | string | The onchain address |
| chainSlug | number | The chain id to specify the blockchain |

### Returns:

A JSON object with these fields:

```json
{
  "chainSlug": 421614,
  "onChainAddress": "0x3e3d9f517De1CA6d41f5A79ED1D9340d8fF3FC7F",
  "forwarderAddress": "0x31828eb15fc1F18901b75329AB1d06f4C5dda43D",
  "isDeployed": true
}
```

### Example Request:

```json
GET /getForwarderAddress?onChainAddress=0x7Fe1141202de13F6884d2A50612DC7685eC68640&chainSlug=421614"
```

### Example Response:

```json
{
  "chainSlug": 421614,
  "onChainAddress": "0x3e3d9f517De1CA6d41f5A79ED1D9340d8fF3FC7F",
  "forwarderAddress": "0x31828eb15fc1F18901b75329AB1d06f4C5dda43D",
  "isDeployed": true
}
```

:::note
If the onchain contracts are deployed using an AppGateway, they will already have a forwarder contract. However, suppose you wish to use a contract already deployed onchain, for example, UniswapFactory. In that case, you will get `isDeployed` as false, and you can deploy it using [Forwarder Addresses](/forwarder-addresses) and then start using it.
:::
