import React from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";

export const HeaderBadges = () => {
  return (
    <BrowserOnly>
      {() => (
        <div className="flex justify-end">
          <a
            href={`https://github.com/SocketDotTech/datalayer-docs/issues/new?title=Docs update request: ${
              new URL(window.location.href).pathname
            }&body=Source: ${
              window.location.href
            }%0A%0ARequest: (how can we help?)%0A%0AUse this issue to add suggestions for how we can improve this documentation page.`}
            style={{ textDecoration: "none" }}
            className="bg-update cursor-pointer text-sm p-2 rounded-full"
          >
            <span className="badge-avatar emoji-avatar mx-1">✏️</span>
            <span className="badge-label">Request an update</span>
          </a>
        </div>
      )}
    </BrowserOnly>
  );
};

/*debt: some components and css (eg header badges) are duplicated between repos */
