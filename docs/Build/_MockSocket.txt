---
id: mock-socket
title: Mock Socket
# sidebar_position: 3
---

Once you've integrated Socket / PlugBase into your contract, you'd want to write tests, test the integration works as expected etc.

MockSocket is a contract which simulates the interactions b/w your Plug and Socket. It does this by calling the `inbound` method 

mocks the functioning of Socket's cross-chain message passing. 

Using MockSocket you can write tests to verify your integration with Socket works as expected.

For connecting to MockSocket you do this 

For sending a message you do this 

Here's how receiving works 

If XYZ state change happens as expected, congrats things work as expected.

### How it works 
When a plug calls the `outbound` method on MockSocket, 