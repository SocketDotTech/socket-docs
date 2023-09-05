As messages get accumulated by the capacitor, transmitters can seal the capacitors whenever it's ready to discharge to seal the Packet and create
SealedPacket. Once the packet is sealed it's ready to be transmitted and submitted to the propose method on the destination Socket. To seal and to propose the msg.sender needs to have the transmitter's signature over the Packet.  

Transmitters are part of the delivery layer and are responsible for only the liveliness of the protocol. Transmitters operations are completely on-chain and publicly visible to everyone, this is a very important property. Transmitters are also a very light-weight and can be extended to any chain quickly. 

Transmitters are managed by TransmitManager contract which takes care of the following:
- Leader selection between multiple transmitters  
- Fee collection and distribution
- Managing the set of transmitters