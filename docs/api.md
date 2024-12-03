---
id: api
title: API
sidebar_position: 10
---

# API usage

The Socket Protocol API provides developers with a comprehensive set of tools to build chain-abstracted applications. This guide covers the essential endpoints and authentication methods needed to get started.

## API Documentation

Base URL - [https://apiv2.dev.socket.tech](https://apiv2.dev.socket.tech/)

### 1. `getDeployedAddresses`

**Description:**

Retrieves deployed addresses for a specified deployer contract. It returns on-chain deployed addresses, along with their corresponding forwarderAddresses.

contract name is the variable name you used in your App Deployer contract.
Once you call `deployContracts()` function on your app deployer, it will take some time to deploy the on-chain contract and off-chain forwarder contract.
If some of the addresses return as Address(0), wait for some time, as deployment might be in progress. If you get Address(0) after 5 minutes of the initial call, contact the team.

**Endpoint:**

GET /getAddresses

**Query Parameters:**

| Parameter | Type | Description |
| --- | --- | --- |
| appDeployerAddress | string | The address of the app deployer. |
| contractName | string | The name of the contract to query. |
| chainSlug | number | The chain id to specify the blockchain. |

**Returns:**

A JSON object with these fields:

```json
{
	"onchain": {
		"chainSlug": 421614
		"deployedContract": "0x3e3d9f517De1CA6d41f5A79ED1D9340d8fF3FC7F"
	},
	"offchain": {
		"forwarder": "0x31828eb15fc1F18901b75329AB1d06f4C5dda43D",
		"referenceContract": "0x72298A2135626db89D26db639c151C3fa64889aF"
	}
}
```

**Errors:**

Throws an error if the reference contract address is undefined or zero.

- Check if the `contractName` matches the variable name in deployerContract

**Example Request:**

```json
GET /getAddresses?appDeployerAddress=0x1234567890abcdef&contractName=counter&chainSlug=421614
```

### 2. `getForwarderAddress`

**Description:**

Retrieves the forwarder address for a given on-chain address. This address is predicted using create2.

If the on-chain contracts are deployed using an app deployer, they will already have a forwarder contract. However, suppose you wish to use a contract already deployed on-chain, for example, UniswapFactory. In that case, you will get `isDeployed` as false, and you can deploy it using the [forwarder address documentation](https://www.example.com) and then start using it.



**Endpoint:**

GET /getForwarderAddress

**Query Parameters:**

| Parameter | Type | Description |
| --- | --- | --- |
| onChainAddress | string | The on-chain address |
| chainSlug | number | The chain id to specify the blockchain |

**Returns:**

A JSON object with these fields:

```json
{
  "chainSlug": 421614,
  "onChainAddress": "0x3e3d9f517De1CA6d41f5A79ED1D9340d8fF3FC7F",
  "forwarderAddress": "0x31828eb15fc1F18901b75329AB1d06f4C5dda43D",
  "isDeployed": true
}
```

**Example Request:**

```json
GET /getForwarderAddress?onChainAddress=0x3e3d9f517De1CA6d41f5A79ED1D9340d8fF3FC7F&chainSlug=421614
```

**Example Response:**

```json
{
  "chainSlug": 421614,
  "onChainAddress": "0x3e3d9f517De1CA6d41f5A79ED1D9340d8fF3FC7F",
  "forwarderAddress": "0x31828eb15fc1F18901b75329AB1d06f4C5dda43D",
  "isDeployed": true
}
```

### 3. `Tx Details`

/detailsByTx

**Description**

This API retrieves transaction details based on the provided transaction hash (txHash). It returns the status of the transaction and any associated payloads, including execution and simulation details.  The txHash is of `OffchainVM`.

**Request Parameters**

- **txHash** (string, required): The hash of the transaction for which details are to be retrieved.

**Response Format**

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

**Response Fields Explanation**

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

**ExecutionStatus Values**

- **NO**: Indicates that there is no execution status yet.
- **FINALIZING**: The execution is in the process of being finalized.
- **FINALIZED**: The execution has been finalized by watcher.
- **EXECUTING**: The execution is currently in progress.
- **EXECUTED**: The execution has been completed successfully on-chain.
- **PROMISE_RESOLVING**: The promise/callback related to the execution is being resolved.
- **PROMISE_RESOLVED**: The promise/callback has been resolved.

**Status Values**

- **IN_PROGRESS**: The payloads are currently being processed.
- **REVERTING**: One of the payloads is reverting. Check individual payload details for more info.
- **COMPLETED**: all payloads are executed.

**Example Request**

```json
GET /detailsByTx?txHash=0x1c1eddc12771a9f9a9d9b2882c0d7012fcf9b8ee2bb85a76fcb77ce4226340b8
```

**Example Response**

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
