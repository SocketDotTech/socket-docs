import React from "react";
import { config } from "./config";
import deployments from "./deployments.json";
import { shortenAddress } from "../../utils/shortenAddress";

function ChainConfig() {
  return (
    <div>
      <div className="flex flex-wrap">
        {Object.values(deployments).map((item, index) => (
          <div className="info-card w-80 m-2">
            <div className="flex align-center font-bold text-lg p-1">
              <img
                src={config[Object.keys(deployments)[index]].logoURI}
                className="h-6 w-6 rounded-full"
                alt="chain logo"
              />
              <span className="mx-1">
                {config[Object.keys(deployments)[index]].chainName}{" "}
              </span>
            </div>

            <div className="pl-1 mt-2">
              {" "}
              <div className="">
                <span className="font-semibold"> Chain Slug : </span>{" "}
                {config[Object.keys(deployments)[index]].chainId}{" "}
              </div>
              <div>
                <div>
                  {" "}
                  <span className="font-semibold"> Socket : </span>
                  <a
                    href={`${
                      config[Object.keys(deployments)[index]].blockExplorerUrl
                    }/address/${item["Socket"]}`}
                    target="_blank"
                  >
                    {" "}
                    {shortenAddress(item["Socket"])}{" "}
                  </a>
                </div>
              </div>{" "}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChainConfig;
