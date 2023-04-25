import React from "react";
import Link from "@docusaurus/Link";
import Learn from "../../../static/svg/learn.svg";

export const Tabs = ({ title, description, buttonLink }) => {
  return (
    <div>
      <div className="flex flex-col h-56 w-80 border-solid border-3 border-slate-200 rounded-[10px] mx-10 hover:border-slate-400 cursor bg-white bg-opacity-30">
        <div className="ml-4 my-3 p-2 w-10 h-10 bg-light-purple rounded-md">
          {/* <img src="./svg/learn.svg" alt="Learn" className="fill-[]" /> */}
          <Learn stroke="#6711d7" />
        </div>

        <h2 className="pl-4 text-2xl"> {title} </h2>
        <div className="pl-4 text-base text-slate-500">{description}</div>

        <div className="p-3 border-4 border-indigo-200 flex justify-end align-bottom">
          {/* <Link
            className="button button--secondary button--lg"
            to={`${buttonLink}`}
          >
            {buttonTitle}
          </Link> */}
        </div>
      </div>
    </div>
  );
};
