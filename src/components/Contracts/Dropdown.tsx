import React, { useState } from "react";
import { chainDetails } from "./chainDetails";

function DropdownComponent({
  selectedChainSlug,
  onChangeAction,
  excludeChainSlug = "0",
}) {
  return (
    <div>
      <select
        className="h-10 px-2 rounded text-sm border-gray-300"
        onChange={(e) => onChangeAction(e.target.value)}
      >
        {Object.values(chainDetails).map((item) => {
          if (item.chainSlug.toString() != excludeChainSlug) {
            return item.chainSlug == selectedChainSlug ? (
              <option selected value={item.chainSlug}>
                {item.chainName}
              </option>
            ) : (
              <option value={item.chainSlug}>{item.chainName}</option>
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
