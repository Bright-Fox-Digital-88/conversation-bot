const tsConfigPaths = require('tsconfig-paths');

// Load tsconfig.json
const tsConfig = require('./tsconfig.json');

// Register path mappings
tsConfigPaths.register({
  baseUrl: tsConfig.compilerOptions.baseUrl,
  paths: tsConfig.compilerOptions.paths,
}); 