// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Socket Data Layer',
  tagline: 'The future of modular interoperability',
  url: 'https://socket.tech',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  plugins: [
    async function myPlugin(context, options) {
      return {
        name: "docusaurus-tailwindcss",
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(require("tailwindcss"));
          postcssOptions.plugins.push(require("autoprefixer"));
          return postcssOptions;
        },
      };
    },

    require.resolve('docusaurus-lunr-search')
  ],

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'socketdottech', // Usually your GitHub org/user name.
  projectName: 'socketdottech', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',

          // sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  // themes: ['@docusaurus/theme-search-algolia'],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'SocketDL',
        logo: {
          alt: 'My Site Logo',
          src: 'img/socketOC.png',
        },
        items: [
          // {
          //   type: 'doc',
          //   docId: 'Learn/protocol-design',
          //   position: 'left',
          //   label: 'Learn',
          // },
          // {
          //   type: 'doc',
          //   docId: '',
          //   position: 'left',
          //   label: 'Build',
          // },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} Socket Technology`,
      },
      prism: {
        additionalLanguages: ["solidity"],
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      image: 'img/header-bg.png',
      metadata: [{ name: 'keywords', content: 'messaging, datalayer, socket, socket.tech, DL, interoperability, Bungee, SocketDL, SocketSurge, Surge' }],
      // algolia: {
      //   // The application ID provided by Algolia
      //   appId: '',

      //   // Public API key: it is safe to commit it
      //   apiKey: '',

      //   indexName: 'socketDL-docs',

      //   // Optional: see doc section below
      //   contextualSearch: true,

      //   // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
      //   externalUrlRegex: 'external\\.com|domain\\.com',

      //   // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
      //   replaceSearchResultPathname: {
      //     from: '/docs/', // or as RegExp: /\/docs\//
      //     to: '/',
      //   },

      //   // Optional: Algolia search parameters
      //   searchParameters: {},

      //   // Optional: path for search page that enabled by default (`false` to disable it)
      //   searchPagePath: 'search',

      //   //... other Algolia params
      // },
    }),
};

module.exports = config;
