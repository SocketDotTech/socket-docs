import React, { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import deployments from "./deployments.json";
import { chainDetails } from "./chainDetails";
import { PathDropdown } from "./Dropdown";

enum PATH {
  FAST = "FAST",
  NATIVE_BRIDGE = "NATIVE_BRIDGE",
  OPTIMISTIC = "OPTIMISTIC",
}

function SwitchboardAddresses() {
  const [selectedChainSlug, setSelectedChainSlug] = useState("10");
  const [selectedDestinationChain, setSelectedDestinationChain] = useState(
    "10"
  );
  const [selectedPath, setSelectedPath] = useState(PATH.FAST);

  useEffect(() => {
    const k = Object.keys(chainDetails).filter(
      (id) => id !== selectedChainSlug.toString()
    );

    selectedChainSlug === selectedDestinationChain &&
      setSelectedDestinationChain(k[0]);
  }, [selectedChainSlug]);

  return (
    <div>
      <span>
        FAST is the standard integration type, choose FAST unless you're
        building a custom usecase
      </span>
      <div className="flex space-x-6 my-4">
        <div className="flex items-center space-x-1">
          <span className="font-semibold text-base"> Local : </span>
          <Dropdown
            onChangeAction={setSelectedChainSlug}
            selectedChainSlug={selectedChainSlug}
          />
        </div>

        <div className="flex items-center space-x-1">
          <span className="font-semibold text-base"> Sibling : </span>
          <Dropdown
            excludeChainSlug={selectedChainSlug}
            selectedChainSlug={selectedDestinationChain}
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
        selectedChainSlug={selectedChainSlug}
        selectedDestinationChain={selectedDestinationChain}
        selectedPath={selectedPath}
      />
    </div>
  );
}

function Table({ selectedChainSlug, selectedDestinationChain, selectedPath }) {
  return (
    <table>
      <thead>
        <tr>
          <th>LocalSlug</th>
          <th>SiblingSlug</th>
          <th>Type</th>
          <th>Switchboard Address</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>{selectedChainSlug}</td>
          <td>{selectedDestinationChain}</td>
          <td>{selectedPath}</td>
          <td>
            {deployments[selectedChainSlug].integrations?.[
              selectedDestinationChain
            ]?.[selectedPath]?.["switchboard"] || "Not Supported"}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default SwitchboardAddresses;
