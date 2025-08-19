import * as fs from 'fs';
import * as path from 'path';
import ignore from 'ignore';

interface FileNode {
  name: string;
  type: 'dir' | string;
  contents: string | FileNode[];
}

interface ProjectTree {
  name: string;
  type: 'dir';
  contents: FileNode[];
}

class ProjectTreeBuilder {
  private ig: ignore.Ignore;
  private projectRoot: string;
  private projectName: string;

  // Kill list - files to exclude by name (without extension)
  private readonly KILL_LIST = [
    'build-project-tree',
    'package-lock'
  ];

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
    this.projectName = path.basename(projectRoot);
    this.ig = ignore();
    this.loadGitignore();
  }

  private loadGitignore(): void {
    const gitignorePath = path.join(this.projectRoot, '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
      this.ig.add(gitignoreContent);
    }
    // Add default ignore rules
    this.ig.add('context/');
  }

  private shouldIgnore(filePath: string): boolean {
    const relativePath = path.relative(this.projectRoot, filePath);
    return this.ig.ignores(relativePath);
  }

  private isInKillList(filePath: string): boolean {
    const fileName = path.basename(filePath, path.extname(filePath)); // Get name without extension
    return this.KILL_LIST.includes(fileName);
  }

  private getFileType(filePath: string): string {
    const ext = path.extname(filePath);
    if (!ext) return 'file';
    return ext.substring(1); // Remove the dot
  }

  private isBinaryFile(filePath: string): boolean {
    // Check if file is in .git directory (mostly binary)
    if (filePath.includes('.git/')) {
      return true;
    }
    // Check file extension for known binary types
    const binaryExtensions = [
      '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.ico', '.svg',
      '.pdf', '.zip', '.tar', '.gz', '.rar', '.7z',
      '.exe', '.dll', '.so', '.dylib', '.bin',
      '.mp3', '.mp4', '.avi', '.mov', '.wav',
      '.db', '.sqlite', '.sqlite3',
      '.lock', '.log'
    ];
    const ext = path.extname(filePath).toLowerCase();
    return binaryExtensions.includes(ext);
  }



  private readFileContents(filePath: string): string {
    // Skip binary files
    if (this.isBinaryFile(filePath)) {
      return JSON.stringify('[Binary file - content not included]');
    }
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      // Escape the content for JSON
      return JSON.stringify(content);
    } catch (error) {
      console.warn(`Warning: Could not read file ${filePath}:`, error);
      return JSON.stringify(`[Error reading file: ${error}]`);
    }
  }

  private hasUserGeneratedCode(currentPath: string): boolean {
    const stats = fs.statSync(currentPath);
    
    if (stats.isFile()) {
      return this.isUserGeneratedCodeFile(currentPath);
    }
    
    if (stats.isDirectory()) {
      try {
        const entries = fs.readdirSync(currentPath);
        
        for (const entry of entries) {
          const entryPath = path.join(currentPath, entry);
          
          // Skip if should be ignored
          if (this.shouldIgnore(entryPath)) {
            continue;
          }
          
          // Recursively check if this entry or its children contain user-generated code
          if (this.hasUserGeneratedCode(entryPath)) {
            return true;
          }
        }
      } catch (error) {
        console.warn(`Warning: Could not read directory ${currentPath}:`, error);
      }
    }
    
    return false;
  }

  private isUserGeneratedCodeFile(filePath: string): boolean {
    // Exclude .git directory entirely
    if (filePath.includes('.git/')) {
      return false;
    }
    
    // Check if it's a text file with code-like extensions
    const codeExtensions = [
      '.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.h',
      '.cs', '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.scala',
      '.html', '.css', '.scss', '.sass', '.less', '.xml', '.json',
      '.yaml', '.yml', '.toml', '.ini', '.cfg', '.conf', '.md',
      '.txt', '.sh', '.bash', '.zsh', '.fish', '.ps1', '.bat',
      '.sql', '.r', '.m', '.pl', '.lua', '.dart', '.elm', '.hs',
      '.fs', '.clj', '.edn', '.ex', '.exs', '.erl', '.hrl'
    ];
    
    const ext = path.extname(filePath).toLowerCase();
    return codeExtensions.includes(ext) || ext === ''; // Include files without extensions
  }

  private buildNode(currentPath: string): FileNode | null {
    const stats = fs.statSync(currentPath);
    const name = path.basename(currentPath);

    if (stats.isDirectory()) {
      const children: FileNode[] = [];

      try {
        const entries = fs.readdirSync(currentPath);

        for (const entry of entries) {
          const entryPath = path.join(currentPath, entry);

          // Skip if should be ignored
          if (this.shouldIgnore(entryPath)) {
            continue;
          }

          const childNode = this.buildNode(entryPath);
          if (childNode) {
            children.push(childNode);
          }
        }

        // Only include directory if it has children or contains user-generated code
        if (children.length > 0 || this.hasUserGeneratedCode(currentPath)) {
          return {
            name,
            type: 'dir',
            contents: children
          };
        } else {
          // Directory has no relevant content, exclude it
          return null;
        }
      } catch (error) {
        console.warn(`Warning: Could not read directory ${currentPath}:`, error);
        return null;
      }
    } else {
      // It's a file - check kill list first
      if (this.isInKillList(currentPath)) {
        return null; // Exclude files in kill list
      }
      
      // Only include if it's user-generated code
      if (!this.isUserGeneratedCodeFile(currentPath)) {
        return null; // Exclude binary and non-code files
      }
      
      const fileType = this.getFileType(currentPath);
      const contents = this.readFileContents(currentPath);

      return {
        name,
        type: fileType,
        contents
      };
    }
  }

  public buildTree(): ProjectTree {
    console.log(`Building project tree for: ${this.projectName}`);
    console.log(`Project root: ${this.projectRoot}`);

    const contents = this.buildNode(this.projectRoot);

    if (!contents || contents.type !== 'dir') {
      throw new Error('Root should be a directory');
    }

    // Type assertion since we've already checked it's a directory
    const dirContents = contents.contents as FileNode[];

    return {
      name: this.projectName,
      type: 'dir',
      contents: dirContents
    };
  }

  public saveTree(tree: ProjectTree, outputDir: string = 'context/io/tree'): void {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'program-tree.json');
    const jsonContent = JSON.stringify(tree, null, 2);

    fs.writeFileSync(outputPath, jsonContent, 'utf-8');
    console.log(`Project tree saved to: ${outputPath}`);
  }
}

function main(): void {
  const projectRoot = process.cwd();
  const builder = new ProjectTreeBuilder(projectRoot);

  try {
    const tree = builder.buildTree();
    builder.saveTree(tree);
    console.log('Project tree generation completed successfully!');
  } catch (error) {
    console.error('Error building project tree:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { ProjectTreeBuilder, FileNode, ProjectTree }; 