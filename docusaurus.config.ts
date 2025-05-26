import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import { themes } from "prism-react-renderer";
import type * as Plugin from "@docusaurus/types/src/plugin";
import type * as OpenApiPlugin from "docusaurus-plugin-openapi-docs";

import { customApiMdGenerator } from "./src/template/customMdGenerators";

const config: Config = {
  title: "SOCKET Docs",
  tagline:
    "Chain Abstraction Layer - Build Apps that are chain-agnostic via SOCKET",
  url: "https://docs.socket.tech",
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
          docItemComponent: "@theme/ApiItem", // add @theme/ApiItem here
        },
        blog: false,
        theme: {
          customCss: "/src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],
  headTags: [
    {
      tagName: "meta",
      attributes: {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
    },
    {
      tagName: "meta",
      attributes: {
        name: "theme-color",
        content: "#7F1FFF",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "apple-touch-icon",
        href: "/assets/logo192.png",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "manifest",
        href: "/manifest.json",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "icon",
        href: "/assets/favicon.ico",
      },
    },
  ],
  themeConfig: {
    announcementBar: {
      id: "alpha-release",
      content:
        "<b>🚧 The SOCKET dev release is now live and actively evolving, so some concepts may change. 🚧</b>",
      backgroundColor: "rgb(69, 219, 156)",
      isCloseable: true,
    },
    navbar: {
      title: "SOCKET Protocol",
      logo: {
        alt: "SOCKET Logo",
        src: "img/socketLogo.png",
      },
      items: [
        {
          label: 'Overview',
          position: 'left',
          to: '/introduction',
        },
        {
          label: 'Build Abstracted',
          position: 'left',
          to: '/getting-started',
        },
        {
          label: 'Concepts',
          position: 'left',
          to: '/forwarder-addresses',
        },
        {
          label: 'Tools',
          position: 'left',
          to: '/tools',
        },
        // Keep existing right-side items
        {
          type: 'search',
          position: 'right',
        },
        {
          position: "right",
          html: `<img src="/svg/discord-mark-white.svg" alt="GitHub" style="height: 25px; width: 25px;">`,
          href: "https://discord.gg/KMHEEMw3xU",
        },
        {
          href: "https://github.com/SocketDotTech/socket-protocol",
          position: "right",
          html: `<img src="/svg/github-mark-white.svg" alt="GitHub" style="height: 25px; width: 25px;">`,
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: 'Product',
          items: [
            {
              label: 'Documentation',
              to: '/introduction',
            },
            {
              label: 'Whitepaper',
              href: 'https://media.socket.tech/SocketProtocol_v1.pdf',
            },
            {
              label: 'Brand Assets',
              href: 'https://sockettech.notion.site/SOCKET-Brand-Kit-184818fd285880b3b974e2e957cd70bd',
            },
          ],
        },
        {
          title: 'Developers',
          items: [
            {
              label: 'Getting Started',
              to: '/getting-started',
            },
            {
              label: 'API Reference',
              to: '/api',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/SocketDotTech/socket-protocol',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/KMHEEMw3xU',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/socketprotocol',
            },
            {
              label: 'Blog',
              href: 'https://socket.tech/blog',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Website',
              href: 'https://socket.tech',
            },
            {
              label: 'Terms of Service',
              href: 'https://socket.tech/terms',
            },
            {
              label: 'Privacy Policy',
              href: 'https://socket.tech/privacy',
            },
          ],
        },
      ],
      logo: {
        alt: 'SOCKET Logo',
        src: 'img/socketLogo.png',
        href: 'https://socket.tech',
        width: 160,
      },
      copyright: `Copyright © ${new Date().getFullYear()} SOCKET. All rights reserved.`,
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
      // HTML Meta Tags
      {
        name: "description",
        content: "SOCKET powers chain abstracted applications.",
      },
      // Google / Search Engine Tags
      {
        itemprop: "name",
        content: "It's time to get Plugged into SOCKET Docs | SOCKET Docs",
      },
      {
        itemprop: "description",
        content: "SOCKET powers chain abstracted applications.",
      },
      {
        itemprop: "image",
        content: "https://docs.socket.tech/assets/metaImg.png",
      },
      // Facebook Meta Tags
      {
        property: "og:url",
        content: "https://docs.socket.tech/",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:title",
        content: "It's time to get Plugged into SOCKET Docs | SOCKET Docs",
      },
      {
        property: "og:description",
        content: "SOCKET powers chain abstracted applications.",
      },
      {
        property: "og:image",
        content: "https://docs.socket.tech/assets/metaImg.png",
      },
      // Twitter Meta Tags
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "It's time to get Plugged into SOCKET Docs | SOCKET Docs",
      },
      {
        name: "twitter:description",
        content: "SOCKET powers chain abstracted applications.",
      },
      {
        name: "twitter:image",
        content: "https://docs.socket.tech/assets/metaImg.png",
      },
    ],
    languageTabs: [
      {
        highlight: "bash",
        language: "curl",
        codeSampleLanguage: "Shell",
        logoClass: "bash",
        options: {
          longFormat: false,
          followRedirect: true,
          trimRequestBody: true,
        },
        variant: "cURL",
        variants: ["curl"],
      },
      {
        highlight: "javascript",
        language: "nodejs",
        codeSampleLanguage: "JavaScript",
        logoClass: "nodejs",
        options: {
          ES6_enabled: true,
          followRedirect: true,
          trimRequestBody: true,
        },
        variant: "native",
        variants: ["axios", "native"],
      },
      {
        highlight: "go",
        language: "go",
        codeSampleLanguage: "Go",
        logoClass: "go",
        options: {
          followRedirect: true,
          trimRequestBody: true,
        },
        variant: "native",
        variants: ["native"],
      },
      {
        highlight: "python",
        language: "python",
        codeSampleLanguage: "Python",
        logoClass: "python",
        options: {
          followRedirect: true,
          trimRequestBody: true,
        },
        variant: "requests",
        variants: ["requests", "http.client"],
      },
    ],
  } satisfies Preset.ThemeConfig,
  plugins: [
    [
      "docusaurus-plugin-openapi-docs",
      {
        id: "api",
        docsPluginId: "classic", // e.g. "classic" or the plugin-content-docs id
        config: {
          socket: {
            specPath: "swagger.json", // path or URL to the OpenAPI spec
            outputDir: "docs/api-reference", // output directory for generated *.mdx and sidebar.js files
            version: "1.0.0", // Current version
            label: "v1.0.0", // Current version label
            markdownGenerators: {
              createApiPageMD: customApiMdGenerator, // Custom generator to store the example fields
            },
          } satisfies OpenApiPlugin.Options,
        } satisfies Plugin.PluginOptions,
      },
    ],
    ["docusaurus-lunr-search", { languages: ["en"] }],
  ],
  themes: ["docusaurus-theme-openapi-docs"],
};

export default async function createConfig() {
  return config;
}
