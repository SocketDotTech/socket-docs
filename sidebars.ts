import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  getStarted: [{ type: "autogenerated", dirName: "." }],
  mySidebar: [
    {
      type: "doc",
      id: "introduction",
      label: "What is SOCKET Protocol?",
    },
    {
      type: "doc",
      id: "getting-started",
      label: "Getting Started",
    },
    {
      type: "category",
      label: "Building on SOCKET",
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: "doc",
          id: "writing-apps",
          label: "Build chain abstracted apps",
        },
        {
          type: "doc",
          id: "call-contracts",
          label: "Write onchain",
        },
        {
          type: "doc",
          id: "read",
          label: "Read onchain",
        },
        {
          type: "doc",
          id: "deploy",
          label: "Deploy contracts onchain",
        },
        {
          type: "doc",
          id: "fees",
          label: "Pay for your transactions",
        },
        {
          type: "doc",
          id: "write-tests",
          label: "Write tests for your app",
        },
        {
          type: "doc",
          id: "api",
          label: "API",
        },
        {
          type: "doc",
          id: "chain-information",
          label: "OffchainVM Information",
        },
      ],
    },
    {
      type: "category",
      label: "Usecases",
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: "doc",
          id: "usecases",
          label: "Key Use Cases",
        },
        {
          type: "doc",
          id: "magicspend",
          label: "MagicSpend on SOCKET",
        },
      ],
    },
    {
      type: "category",
      label: "Learn How SOCKET Works",
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: "doc",
          id: "architecture",
          label: "Architecture",
        },
        {
          type: "doc",
          id: "switchboards",
          label: "Switchboards",
        },
        {
          type: "doc",
          id: "transmitters",
          label: "Transmitters",
        },
        {
          type: "doc",
          id: "watchers",
          label: "Watchers",
        },
        {
          type: "doc",
          id: "forwarder-addresses",
          label: "Forwarder Addresses",
        },
        {
          type: "doc",
          id: "promises",
          label: "Promises",
        },
        {
          type: "link",
          href: "https://media.socket.tech/SocketProtocol_v1.pdf",
          label: "v1 Whitepaper",
        },
      ],
    },
    {
      type: "link",
      href: "https://drive.google.com/drive/folders/1vZVpf2dJvNHx7XSAFCAViSd3ieWk4WWI?usp=sharing",
      label: "Brand Assets",
    },
  ],
};

export default sidebars;
