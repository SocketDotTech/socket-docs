import React, { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import deployments from "./deployments.json";
import { config } from "./config";
import { PathDropdown } from "./Dropdown";

enum PATH {
  FAST = "FAST",
  NATIVE_BRIDGE = "NATIVE_BRIDGE",
  OPTIMISTIC = "OPTIMISTIC",
}

function SwitchboardAddresses() {
  const [selectedChainId, setSelectedChainId] = useState("10");
  const [selectedDestinationChain, setSelectedDestinationChain] = useState(
    "10"
  );
  const [selectedPath, setSelectedPath] = useState(PATH.FAST);

  useEffect(() => {
    const k = Object.keys(config).filter(
      (id) => id !== selectedChainId.toString()
    );

    selectedChainId === selectedDestinationChain &&
      setSelectedDestinationChain(k[0]);
  }, [selectedChainId]);

  return (
    <div>
      <div className="flex space-x-6 my-4">
        <div className="flex items-center space-x-1">
          <span className="font-semibold text-base"> From : </span>
          <Dropdown
            onChangeAction={setSelectedChainId}
            selectedChainId={selectedChainId}
          />
        </div>

        <div className="flex items-center space-x-1">
          <span className="font-semibold text-base"> To : </span>
          <Dropdown
            excludeChainId={selectedChainId}
            selectedChainId={selectedDestinationChain}
            onChangeAction={setSelectedDestinationChain}
          />
        </div>

        <div className="flex items-center space-x-1">
          <span className="font-semibold text-base"> Type : </span>
          <PathDropdown
            onChangeAction={setSelectedPath}
            paths={[
              {
                name: PATH.FAST,
              },
              {
                name: PATH.OPTIMISTIC,
              },
              {
                name: PATH.NATIVE_BRIDGE,
              },
            ]}
          />
        </div>
      </div>
      <Table
        selectedChainId={selectedChainId}
        selectedDestinationChain={selectedDestinationChain}
        selectedPath={selectedPath}
      />
    </div>
  );
}

function Table({ selectedChainId, selectedDestinationChain, selectedPath }) {
  return (
    <table>
      <thead>
        <tr>
          <th>LocalSlug</th>
          <th>RemoteSlug</th>
          <th>Switchboard</th>
          <th>Contract Address</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>{selectedChainId}</td>
          <td>{selectedDestinationChain}</td>
          <td>{selectedPath}</td>
          <td>
            {deployments[selectedChainId].integrations?.[
              selectedDestinationChain
            ]?.[selectedPath]?.["switchboard"] || "Not Supported"}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default SwitchboardAddresses;
