import React, { useState } from "react";
import { config } from "./config";

function DropdownComponent({ setSelectedChainId }) {
  return (
    <div>
      <select
        className="h-10 px-2 rounded text-sm border-gray-300"
        onChange={(e) => setSelectedChainId(e.target.value)}
      >
        {Object.values(config).map((item) => (
          <option value={item.chainId}>{item.chainName}</option>
        ))}
      </select>
    </div>
  );
}

export default DropdownComponent;
