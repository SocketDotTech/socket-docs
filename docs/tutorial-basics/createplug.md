# Let's send messages!

Socket allows developers to write various kinds of Plugs that when plugged into Socket become the cross-chain adapters for your application. 

There are 3 functionalities that you will be exposed to as a developer:
- Outbound() - The function you need to call to send a payload(data) to other chains
- Inbound() - The function that Socket will call to give your Plug payload(data) from other chains
- setPlugConfig() - The function you need to call on each chain to connect your plug to the Socket

