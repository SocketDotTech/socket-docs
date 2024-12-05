# Switchboards

Switchboards are onchain verifiers to coordinate with watchers, switchboards are:

- **Permission-less to register**: Anyone can write a switchboard and register it with SOCKET
- **Lightweight Interface:** The interface is super simple, switchboards accept proofs and reply with a boolean of acceptance or rejection
- **Application Defined:**  Application developers can select any switchboard allowing them to accept their required security, cost and latency profiles.
- **Proof-agnostic:** Switchboards just accept proofs, these proofs could be of any kind, attestations from oracles, zk-proofs or even optimistic submissions.

Think about switchboards as the connective tissue between watchers and application-builders, enabling application-builders to coordinate effectively with these offchain operators.

![image.png](../static/img/switchboards.png)

Switchboards are smart-contracts that acccept proofs, of whatever kind, zkproofs, msig proofs and reply back with a boolen of true/false. Developers can write any condition necessary in these contracts and those will be executed onchain before the application onchain smart contract is called.
