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
      type: "category",
      label: "Building on SOCKET",
      collapsible: false,
      items: [
        {
          type: "doc",
          id: "getting-started",
          label: "Getting Started",
        },
        {
          type: "doc",
          id: "writing-apps",
          label: "Going chain abstracted",
        },
        {
          type: "doc",
          id: "deploy",
          label: "Deploying onchain smart contracts",
        },
        {
          type: "doc",
          id: "call-contracts",
          label: "Calling onchain smart contracts",
        },
        {
          type: "doc",
          id: "read",
          label: "Reading onchain state",
        },
        {
          type: "doc",
          id: "revert",
          label: "Reverting async transactions",
        },
        {
          type: "doc",
          id: "api",
          label: "API",
        },
        {
          type: "doc",
          id: "usecases",
          label: "Usecases",
        },
        {
          type: "doc",
          id: "chain-information",
          label: "OffchainVM Information",
        },
        {
          type: "doc",
          id: "fees",
          label: "offchainVM Fees",
        },
      ],
    },
    {
      type: "category",
      label: "Learn How SOCKET Works",
      collapsible: false,
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
