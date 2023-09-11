import React, { useState } from "react";
import Dropdown from "./Dropdown";
import deployments from "./deployments.json";
import { config } from "./config";

function SwitchboardAddresses() {
  const [selectedChainId, setSelectedChainId] = useState(10);

  return (
    <div>
      <div className="my-4">
        <Dropdown setSelectedChainId={setSelectedChainId} />
      </div>
      <Table selectedChainId={selectedChainId} />
    </div>
  );
}

function Table({ selectedChainId }) {
  console.log(selectedChainId);
  return (
    <table>
      <tr>
        <th>Chain</th>
        <th>Type</th>
        <th>Contract Address</th>
      </tr>
      {Object.values(deployments[selectedChainId].integrations).map(
        (item, index) =>
          Object.values(item).map((switchboardInfo, index2) => (
            <tr>
              <td>
                {" "}
                {
                  Object.keys(deployments[selectedChainId].integrations)[index]
                }{" "}
              </td>
              <td> {Object.keys(item)[index2]}</td>
              <td> {switchboardInfo.switchboard}</td>
            </tr>
          ))
      )}
    </table>
  );
}

export default SwitchboardAddresses;
