---
id: magicspend
title: Implement MagicSpend on SOCKET
---

import Link from '@docusaurus/Link';
import CardGrid from '@site/src/components/CardGrid/CardGrid';
import styles from '@site/src/components/CardGrid/CardGrid.module.css';

["MagicSpend: Spend Now, Debit Later"](https://ethresear.ch/t/magicspend-spend-now-debit-later/19678) allows users to spend assets immediately while deferring the debit process. SOCKET's chain-abstraction architecture is well-suited to facilitate this by combining offchain agents and onchain contracts.

## Implementation Steps

### Step 1: Immediate Spending Logic
- The `MagicSpendAppGateway` listens for user spend requests to execute the immediate transaction.
- Returns a confirmation to the user.

<details>
   <summary>Click to expand code snippet</summary>
   ```solidity
   // SPDX-License-Identifier: MIT
   pragma solidity ^0.8.0;

   contract MagicSpendAppGateway {
       (...)
       mapping(address => uint256) public balances;

       event Spend(address indexed user, uint256 amount);

       function spendNow(address user, uint256 amount) external {
           require(balances[user] >= amount, "Insufficient balance");
           balances[user] -= amount;
           emit Spend(user, amount);
       }
   }
   ```
</details>

### Step 2: Deferred Debit Mechanism
- The **AppGateway** schedules the debit in the **EVMx**.
- The **Watcher** monitors the scheduled time.
- When the time arrives, the **Watcher** triggers a proof for the **Switchboard**.
- The **Smart Contract** executes the debit from the user’s account.

<details>
   <summary>Click to expand code snippet</summary>
   ```solidity
   contract MagicSpendAppGateway {
       (...)
       struct DebitSchedule {
           uint256 amount;
           uint256 executeAt;
           bool executed;
       }

       mapping(address => DebitSchedule) public schedules;

       event DebitScheduled(address indexed user, uint256 amount, uint256 executeAt);
       event DebitExecuted(address indexed user, uint256 amount);

       function scheduleDebit(address user, uint256 amount, uint256 delay) external {
           schedules[user] = DebitSchedule(amount, block.timestamp + delay, false);
           emit DebitScheduled(user, amount, block.timestamp + delay);
       }

       function executeDebit(address user) external {
           require(block.timestamp >= schedules[user].executeAt, "Too early");
           require(!schedules[user].executed, "Already executed");

           schedules[user].executed = true;
           emit DebitExecuted(user, schedules[user].amount);
       }
   }
   ```
</details>

## Key Considerations

### Security Measures
- **Onchain State Validation**: Before allowing a spend, [check balances](/read-onchain-from-evmx) using `read()` functions.
- **Fraud Prevention**: Implement signature verifications in [Switchboard](/switchboards).
- **Failover Handling**: Define fail-safe conditions if a scheduled debit fails (e.g., fallback mechanisms, notifications).

### Handling Async Operations
- Use the `async` modifier in `MagicSpendAppGateway` to manage multiple chained operations efficiently.
- Implement [callback-based promises](/promises) to synchronize transactions with user accounts.

## What's next!
By leveraging SOCKET’s architecture, MagicSpend can be implemented securely and efficiently, ensuring users can spend assets immediately while managing debits asynchronously.

<CardGrid cards={[
 {
   title: "Key Use Cases",
   description: "Read more about other usecases SOCKET enables",
   link: "/usecases"
 },
 {
   title: "Take another look",
   description: "Revisit the what is SOCKET protocol",
   link: "/writing-apps"
 },
 {
   title: "Architecture",
   description: "Deep dive into SOCKET Protocol's architecture",
   link: "/architecture"
 },
 {
   title: "App Tutorial",
   description: "Build a chain-abstracted ERC20 app",
   link: "/writing-apps"
 },
]} />
