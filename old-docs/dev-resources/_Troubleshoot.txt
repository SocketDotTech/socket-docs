---
id: troubleshoot
title: Troubleshooting Integration
# sidebar_position: 3
---

Packet not sealed on Source Chain 

Packet not proposed on Destination chain (You can do this directly, yay!)

Packet not executed yet 
    - see if gasLimit is insufficient 
    - or message itself is reverting 
    - Put hash in tenderly, debug
    - cache stuff (see how stargate does this) and retry 