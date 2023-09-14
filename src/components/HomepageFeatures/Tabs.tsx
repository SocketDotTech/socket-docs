import React from "react";
import Link from "@docusaurus/Link";
import { Tab } from "../Tab";

export const Tabs = ({ title, description, buttonLink, tabIcon }: any) => {
  return (
    <div className="my-3">
      <Link
        style={{ textDecoration: "none", color: "inherit" }}
        to={buttonLink}
      >
        <div className="flex flex-col h-56 w-80 border-solid border border-slate-200 rounded-[10px] mx-10 hover:border-slate-400 cursor-pointer">
          <div className="ml-4 my-3 p-2 w-10 h-10 bg-light-purple rounded-md">
            <tabIcon.buttonIcon className="stroke-primary" />
          </div>

          <h2 className="pl-4 text-2xl"> {title} </h2>
          <div className="pl-4 text-base text-secondary">{description}</div>
        </div>
      </Link>
    </div>
  );
};
