# SOCKET Protocol Documentation

Official documentation for SOCKET Protocol - The First Chain-Abstraction Protocol.
Hosted at [docs.socket.tech](https://docs.socket.tech).

## What is SOCKET Protocol?

SOCKET Protocol enables developers to build chain-abstracted applications to compose users, accounts, and applications across 300+ rollups and chains. It provides a new computing paradigm that lets developers leverage chains as servers/databases while delivering a consistent monolithic experience to end users.

## Key Features

- **Chain-Abstracted Composability**: Call any function on any contract on any chain via plain Solidity
- **Pre-Execution Logic**: Execute additional logic before onchain contracts are executed
- **Horizontal Scaling**: Deploy multiple instances across chains with built-in load balancing
- **Security-First Design**: Run security checks before transaction execution

## Core Components

- **Watchers**: Offchain operators running specialized VMs
- **Transmitters**: Smart operators performing onchain actions
- **Switchboards**: Onchain contracts for validation
- **AppGateway**: Custom contracts for composing smart contracts

## Getting Started

### Prerequisites
- Node.js and yarn installed
- Basic understanding of Solidity and blockchain development

### Installation

```bash
git clone https://github.com/SocketDotTech/socket-docs.git
cd socket-docs
yarn install
```

### Local Development

```bash
yarn start
```

This command starts a local development server and opens a browser window. Most changes are reflected live without having to restart the server.

### Build

```bash
yarn build
```

This command generates static content into the `build` directory.

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

## Documentation Structure

- `introduction.md`: Protocol overview and core concepts
- `architecture.md`: Detailed system architecture
- `getting-started.md`: Step-by-step tutorial
- `usecases.md`: Example applications and use cases

## Contributing

We welcome contributions! Please see our contributing guidelines for more details.

## Additional Resources

- [Official Website](https://socket.tech)
- [SOCKET protocol GitHub Repository](https://github.com/SocketDotTech/socket-protocol)
