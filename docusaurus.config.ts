// import { themes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import { themes } from "prism-react-renderer";

const config: Config = {
  title: "Socket Docs",
  tagline:
    "Chain Abstraction Layer - Build Apps that are chain-agnostic via Socket",
  url: "https://socket.tech",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.png",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "socketdottech", // Usually your GitHub org/user name.
  projectName: "socket-docs", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",

      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl: "https://github.com/SocketDotTech/docs",
          // docLayoutComponent: "@theme/DocPage",
          // docItemComponent: "@theme/ApiItem", // add @theme/ApiItem here
        },
        blog: false,
        theme: {
          customCss: "/src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    announcementBar: {
      id: "alpha-release",
      content:
        "<b>🚧 Socket dev release is live. It is under active development and has known vulnerabilities. 🚧</b>",
      backgroundColor: "rgb(69, 219, 156)",
      isCloseable: true,
    },
    navbar: {
      title: "Socket",
      logo: {
        alt: "Socket Logo",
        src: "img/socketLogo.png",
      },
      items: [
        {
          type: "doc",
          position: "left",
          label: "Get Started",
          docId: "introduction",
        },
        {
          position: "left",
          label: "Bungee Docs",
          href: "https://docs.bungee.exchange",
        },
        {
          href: "https://github.com/SocketDotTech",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      copyright: `Copyright © ${new Date().getFullYear()} Socket`,
    },
    colorMode: {
      defaultMode: "dark",
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    prism: {
      theme: themes.vsLight,
      darkTheme: themes.vsDark,
      defaultLanguage: "solidity",
      additionalLanguages: ["solidity"],
    },
    // image: "img/header-bg.png",
    metadata: [
      {
        name: "keywords",
        content:
          "messaging, datalayer, socket, socket.tech, DL, interoperability, Bungee, chain abstraction, chain-agnostic, cross-chain, messaging infrastructure",
      },
    ],
  },
  plugins: [["docusaurus-lunr-search", { languages: ["en"] }]],
};

export default async function createConfig() {
  return config;
}
