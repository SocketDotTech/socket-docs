import React from "react";

export const Tabs = ({ title, description }) => {
  return (
    <div>
      <div className="h-80 w-80 border-solid border-2 border-slate-200 rounded-lg mx-10">
        <h2 className="p-4 text-3xl"> {title} </h2>
        <div className="pl-4">{description}</div>
      </div>
    </div>
  );
};
