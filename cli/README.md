# Compoder CLI

Compoder CLI - AI-Powered Component Code Generator Command Line Interface

## Installation

The CLI is automatically built when you install the main Compoder project:

```bash
npm install
```

## Usage

### Initialize Project

Initialize Compoder configuration for your project:

```bash
npx compoder init
```

This command will:

1. **Select a Codegen**: Choose from available code generators with an interactive list
2. **Select AI Clients**: Choose which AI clients to configure (Cursor, Claude Code)
3. **Generate Configuration**: Create `.compoderrc` file in your project root
4. **Setup AI Rules**: Generate rule files for selected AI clients

#### Generated Files

**For all projects:**

- `.compoderrc`: Project configuration file containing selected codegen and AI clients

**For Cursor:**

- `.cursor/rules/compoder/[codegen-name]/index.mdc`: Main orchestration file
- `.cursor/rules/compoder/[codegen-name]/step1.md`: Component design phase rules
- `.cursor/rules/compoder/[codegen-name]/step2.md`: Component implementation phase rules

#### Options

- `--api-base-url <url>`: Base URL for the Compoder API (default: http://localhost:3000)

#### Example

```bash
# Initialize with custom API URL
npx compoder init --api-base-url http://localhost:3001
```

#### Using the Generated Rules

After initialization, you can reference the generated rules in your AI client:

**In Cursor:**

1. Open your project in Cursor
2. Reference the rule: `@compoder/[codegen-name]`
3. The AI will follow the two-step workflow:
   - Step 1: Design the component (extract requirements, identify needed components)
   - Step 2: Implement the component (generate code files)

### Update Rules

Update Compoder rules based on the `.compoderrc` configuration:

```bash
npx compoder update
```

This command will:

1. **Check Configuration**: Verify that `.compoderrc` exists in the current directory
2. **Read Configuration**: Load the codegen and AI clients from `.compoderrc`
3. **Fetch Latest Rules**: Get the latest codegen configuration from the API
4. **Regenerate Rule Files**: Update all rule files for configured AI clients

#### When to Use Update

Use `compoder update` when:

- The codegen configuration has been updated on the server
- You want to sync your local rules with the latest version
- Rule files were accidentally modified or deleted

#### Options

- `--api-base-url <url>`: Base URL for the Compoder API (default: http://localhost:3000)

#### Example

```bash
# Update with default API URL
npx compoder update

# Update with custom API URL
npx compoder update --api-base-url http://localhost:3001
```

### MCP Server Commands

Start an MCP (Model Context Protocol) server for Compoder components:

```bash
npx compoder mcp server
```

#### Options

- `--api-base-url <url>`: Base URL for the Compoder API (default: http://localhost:3000)
- `--debug`: Enable debug logging

#### Example

```bash
# Start MCP server with custom API URL and debug logging
npx compoder mcp server --api-base-url http://localhost:3001 --debug
```

### MCP Client Configuration

To use the MCP server with an MCP client, add the following configuration:

```json
{
  "mcpServers": {
    "compoder": {
      "command": "npx",
      "args": ["compoder", "mcp", "server"]
    }
  }
}
```

## Available Tools

The MCP server exposes three tools:

### 1. codegen-list

Get a list of all available codegens with their titles and descriptions.

**Parameters:** None

**Returns:** Markdown formatted list of all available code generators with their names and descriptions.

### 2. component-list

Get a list of all components for the specified codegen in markdown format.

**Parameters:**

- `codegenName` (string): Name of the codegen to get components for

**Returns:** Markdown formatted list of all available components organized by library.

### 3. component-detail

Get detailed API documentation for specific components.

**Parameters:**

- `codegenName` (string): Name of the codegen
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
│   │   ├── init/            # Init command
│   │   │   └── index.ts     # Init command implementation
│   │   ├── update/          # Update command
│   │   │   └── index.ts     # Update command implementation
│   │   └── mcp/             # MCP related commands
│   │       ├── index.ts     # MCP command definitions
│   │       ├── server.ts    # MCP server implementation
│   │       └── tools/       # MCP tools
│   ├── shared/              # Shared utilities
│   │   ├── types.ts         # Type definitions
│   │   ├── api-client.ts    # API client
│   │   ├── utils.ts         # Utility functions
│   │   ├── file-utils.ts    # File operation utilities
│   │   └── prompt-generator.ts  # Rule file generators
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

## Commands Summary

| Command               | Description                                        |
| --------------------- | -------------------------------------------------- |
| `compoder init`       | Initialize Compoder configuration for your project |
| `compoder update`     | Update rules based on .compoderrc configuration    |
| `compoder mcp server` | Start MCP server for component documentation       |

## Future Extensions

The CLI architecture supports easy extension with additional commands:

- `compoder generate` - Code generation commands
- `compoder deploy` - Deployment commands
- `compoder config` - Configuration management
