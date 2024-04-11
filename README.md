# Socket Docs

Official documentation for Socket, hosted at [docs.socket.tech](https://docs.socket.tech).

## Getting Started

These docs are built using [Docusaurus](https://docusaurus.io/), with plugin for [Docusaurus Lunr Search](https://github.com/daldridge/docusaurus-plugin-lunr).

### Installation

```bash
git clone https://github.com/SocketDotTech/socket-docs.git
cd bungee-docs
yarn install
```

### Local Development

```bash
yarn start
```

### Build

```bash
yarn build
```

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
