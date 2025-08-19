# Project Tree Builder

A TypeScript script that traverses project folders and builds a nested tree JSON representation of the file structure, respecting `.gitignore` patterns.

## Features

- **Gitignore Support**: Automatically reads and respects `.gitignore` patterns
- **Nested Structure**: Creates a hierarchical tree representation of files and directories
- **Content Inclusion**: Includes escaped file contents for all readable files
- **Type Safety**: Written in TypeScript with proper type definitions
- **Cross-Platform**: Works on any Node.js-supported platform

## Usage

### Prerequisites

- Node.js (>= 20.0.0)
- TypeScript and ts-node installed

### Running the Script

1. Navigate to the project directory you want to analyze
2. Run the script:

```bash
npx ts-node build-project-tree.ts
```

### Output

The script will:
1. Create a `context/out` directory if it doesn't exist
2. Generate a JSON file named `{project-name}.json` containing the project tree
3. Log progress information to the console

## Output Format

The generated JSON has the following structure:

```typescript
interface FileNode {
  name: string;           // File or directory name
  type: 'dir' | string;   // 'dir' for directories, file extension for files
  contents: string | FileNode[]; // File content (escaped) or array of child nodes
}

interface ProjectTree {
  name: string;           // Project name (directory name)
  type: 'dir';           // Always 'dir' for root
  contents: FileNode[];   // Array of root-level files/directories
}
```

## Example Output

```json
{
  "name": "my-project",
  "type": "dir",
  "contents": [
    {
      "name": "src",
      "type": "dir",
      "contents": [
        {
          "name": "index.ts",
          "type": "ts",
          "contents": "\"console.log('Hello World');\\n\""
        }
      ]
    },
    {
      "name": "package.json",
      "type": "json",
      "contents": "\"{\\\"name\\\": \\\"my-project\\\"}\""
    }
  ]
}
```

## Files Ignored

The script automatically ignores files and directories specified in `.gitignore`, including:
- `node_modules/`
- `dist/` and `build/`
- `.DS_Store` and other OS files
- IDE files (`.vscode/`, `.idea/`)
- Log files
- Environment files (`.env`)

## Customization

You can modify the script to:
- Change the output directory by modifying the `outputDir` parameter in `saveTree()`
- Add additional ignore patterns
- Modify the file content handling logic
- Add filtering for specific file types

## Dependencies

- `ignore`: For parsing `.gitignore` patterns
- `@types/node`: TypeScript definitions for Node.js
- Built-in Node.js modules: `fs`, `path` 