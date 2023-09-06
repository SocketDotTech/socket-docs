import React from "react";
import { config } from "./config";
import deployments from "./deployments.json";

function ChainConfig() {
  return (
    <div>
      <div className="info-card">
        <div className="flex flex-wrap p-1">
          {Object.values(deployments).map((item, index) => (
            <div className="info-card w-80 m-2">
              <div className="flex align-center font-bold text-lg">
                <img
                  src={config[Object.keys(deployments)[index]].logoURI}
                  className="h-6 w-6 rounded-full"
                  alt="chain logo"
                />
                <span className="mx-1">
                  {config[Object.keys(deployments)[index]].chainName}{" "}
                </span>
              </div>
              <div className="">
                <span className="font-semibold"> Chain ID : </span>{" "}
                {config[Object.keys(deployments)[index]].chainId}{" "}
              </div>

              <div>
                <div>
                  {" "}
                  <span className="font-semibold"> Socket : </span>
                  <div> {item["Socket"]} </div>
                </div>
                <div>
                  {" "}
                  <span className="font-semibold">SocketBatcher : </span>
                  <div> {item["SocketBatcher"]}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChainConfig;
