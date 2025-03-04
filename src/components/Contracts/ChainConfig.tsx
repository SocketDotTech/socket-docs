import React from "react";
import { chainDetails } from "./chainDetails";
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
                src={chainDetails[Object.keys(deployments)[index]]?.logoURI}
                className="h-6 w-6 rounded-full my-auto text-center border border-solid text-sm"
                alt={chainDetails[Object.keys(deployments)[index]]?.chainName?.slice(0, 1) || "X"}
              />
              <span className="mx-1 my-auto">
                {chainDetails[Object.keys(deployments)[index]]?.chainName}{" "}
              </span>
            </div>

            <div className="pl-1 mt-2">
              {" "}
              <div className="">
                <span className="font-semibold"> Chain Slug : </span>{" "}
                {Object.keys(deployments)[index]}{" "}
              </div>
              <div>
                <div>
                  {" "}
                  <span className="font-semibold"> Socket : </span>
                  <a
                    href={`${chainDetails[Object.keys(deployments)[index]]?.blockExplorerUrl
                      }/address/${item["Socket"]}`}
                    target="_blank"
                  >
                    {" "}
                    {shortenAddress(item["Socket"])}{" "}
                  </a>
                </div>
              </div>{" "}
              <div>
                <div>
                  {" "}
                  <span className="font-semibold"> Switchboard : </span>
                  <a
                    href={`${chainDetails[Object.keys(deployments)[index]]?.blockExplorerUrl
                      }/address/${item["FastSwitchboard"]}`}
                    target="_blank"
                  >
                    {" "}
                    {shortenAddress(item["FastSwitchboard"])}{" "}
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
