// import { themes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import { themes } from "prism-react-renderer";

const config: Config = {
  title: "Socket Docs",
  tagline: "The future of modular interoperability",
  url: "https://socket.tech",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

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
    navbar: {
      title: "Socket",
      logo: {
        alt: "Socket Logo",
        src: "img/socketOC.png",
      },
      items: [
        {
          type: "doc",
          position: "left",
          label: "Get Started",
          docId: "introduction",
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
      copyright: `Copyright © ${new Date().getFullYear()} Socket Technology`,
    },
    prism: {
      theme: themes.vsLight,
      darkTheme: themes.vsDark,
    },
    image: "img/header-bg.png",
    metadata: [
      {
        name: "keywords",
        content:
          "messaging, datalayer, socket, socket.tech, DL, interoperability, Bungee, SocketDL, SocketSurge, Surge",
      },
    ],
  },
  plugins: [["docusaurus-lunr-search", { languages: ["en"] }]],
};

export default async function createConfig() {
  return config;
}
