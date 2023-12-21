import React, { useState } from "react";
import { chainDetails } from "./chainDetails";

function DropdownComponent({
  selectedChainId,
  onChangeAction,
  excludeChainId = "0",
}) {
  return (
    <div>
      <select
        className="h-10 px-2 rounded text-sm border-gray-300"
        onChange={(e) => onChangeAction(e.target.value)}
      >
        {Object.values(chainDetails).map((item) => {
          if (item.chainId.toString() != excludeChainId) {
            return item.chainId == selectedChainId ? (
              <option selected value={item.chainId}>
                {item.chainName}
              </option>
            ) : (
              <option value={item.chainId}>{item.chainName}</option>
            );
          }
        })}
      </select>
    </div>
  );
}

export const PathDropdown = ({ onChangeAction, paths }) => {
  return (
    <div>
      <select
        className="h-10 px-2 rounded text-sm border-gray-300"
        onChange={(e) => onChangeAction(e.target.value)}
      >
        {Object.values(paths).map((item) => {
          return <option value={item.name}>{item.name}</option>;
        })}
      </select>
    </div>
  );
};

export default DropdownComponent;
