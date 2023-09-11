import React from "react";
import Link from "@docusaurus/Link";
import { ArrowUpRightIcon } from "@heroicons/react/24/solid";

export function Tab({ heading, description, linkUrl }) {
  return (
    <Link style={{ textDecoration: "none", color: "inherit" }} to={linkUrl}>
      <div className="flex flex-row justify-center justify-between border border-solid border-slate-200 rounded-lg p-3 hover:border-[#7720e9] hover:text-[#7720e9]">
        <div className="text-xl font-semibold">{heading}</div>{" "}
        <ArrowUpRightIcon className="w-5" />
      </div>
    </Link>
  );
}

export default Tab;
