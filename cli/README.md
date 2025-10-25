# Compoder CLI

Compoder CLI - AI-Powered Component Code Generator Command Line Interface

## Installation

The CLI is automatically built when you install the main Compoder project:

```bash
npm install
```

## Usage

### MCP Server Commands

Start an MCP (Model Context Protocol) server for a specific codegen:

```bash
npx compoder mcp server "My Company Private Component Codegen"
```

#### Options

- `--api-base-url <url>`: Base URL for the Compoder API (default: http://localhost:3000)
- `--debug`: Enable debug logging

#### Example

```bash
# Start MCP server with custom API URL and debug logging
npx compoder mcp server "My Codegen" --api-base-url http://localhost:3001 --debug
```

### MCP Client Configuration

To use the MCP server with an MCP client, add the following configuration:

```json
{
  "mcpServers": {
    "compoder": {
      "command": "npx",
      "args": ["compoder", "mcp", "server", "Your Codegen Name"]
    }
  }
}
```

## Available Tools

The MCP server exposes two tools:

### 1. component-list

Get a list of all components for the specified codegen in markdown format.

**Parameters:** None (codegen name is automatically injected)

**Returns:** Markdown formatted list of all available components organized by library.

### 2. component-detail

Get detailed API documentation for specific components.

**Parameters:**

- `libraryName` (string): Name of the component library
- `componentNames` (array): Array of component names to get details for

**Returns:** Detailed API documentation for the requested components.

## Development

### Building the CLI

```bash
npm run cli:build
```

### Development Mode

```bash
npm run cli:dev
```

### Project Structure

```
cli/
├── src/
│   ├── index.ts              # CLI entry point
│   ├── commands/             # Command implementations
│   │   └── mcp/             # MCP related commands
│   │       ├── index.ts     # MCP command definitions
│   │       ├── server.ts    # MCP server implementation
│   │       └── tools/       # MCP tools
│   ├── shared/              # Shared utilities
│   │   ├── types.ts         # Type definitions
│   │   ├── api-client.ts    # API client
│   │   └── utils.ts         # Utility functions
│   └── config/              # Configuration
│       └── default.ts       # Default configuration
├── dist/                    # Compiled output
├── package.json             # CLI dependencies
└── tsconfig.json           # TypeScript configuration
```

## Environment Variables

- `COMPODER_API_URL`: Base URL for the Compoder API
- `COMPODER_MCP_PORT`: Default port for MCP server
- `COMPODER_MCP_HOST`: Default host for MCP server
- `DEBUG`: Enable debug logging

## Error Handling

The CLI includes comprehensive error handling:

- API connection errors
- Invalid codegen names
- Missing component libraries
- Network timeouts

All errors are logged with appropriate context and exit codes.

## Future Extensions

The CLI architecture supports easy extension with additional commands:

- `compoder generate` - Code generation commands
- `compoder deploy` - Deployment commands
- `compoder config` - Configuration management
