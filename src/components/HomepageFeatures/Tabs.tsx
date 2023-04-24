import React from "react";
import Link from "@docusaurus/Link";

export const Tabs = ({ title, description, buttonTitle, buttonLink }) => {
  return (
    <div>
      <div className="flex flex-col h-64 w-80 border-solid border-3 border-slate-200 rounded-[10px] mx-10 hover:border-slate-400 cursor">
        <div className="ml-4 my-3 p-2 w-10 h-10 bg-[#8633F2] rounded-md">
          <img src="./svg/learn.svg" alt="Learn" className="fill-red-300" />
        </div>

        <h2 className="pl-4 text-2xl"> {title} </h2>
        <div className="pl-4 text-base">{description}</div>

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
