const tsConfigPaths = require('tsconfig-paths');
const { compilerOptions } = require('./tsconfig.json');

// Register path aliases for ts-node
tsConfigPaths.register({
  baseUrl: compilerOptions.baseUrl,
  paths: compilerOptions.paths,
}); 