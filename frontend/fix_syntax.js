const fs = require('fs');
const path = require('path');

const directory = './app';
const componentsDir = './components';

function fixInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixInDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let modified = false;

      // 1. Fix imports to use @/config
      const importRegex = /import\s+\{\s*API_BASE_URL\s*\}\s+from\s+'[^']+';/g;
      if (importRegex.test(content)) {
        content = content.replace(importRegex, "import { API_BASE_URL } from '@/config';");
        modified = true;
      }

      // 2. Fix broken string templates like `${API_BASE_URL}/api/logout'
      // Find a backtick followed by ${API_BASE_URL} followed by any non-quote/backtick characters, ending with a single quote.
      const syntaxRegex = /(`\$\{API_BASE_URL\}[^'`]*?)'/g;
      if (syntaxRegex.test(content)) {
        content = content.replace(syntaxRegex, "$1`");
        modified = true;
      }
      
      // Also check if any ends with double quotes
      const syntaxRegexDouble = /(`\$\{API_BASE_URL\}[^'"`]*?)"/g;
      if (syntaxRegexDouble.test(content)) {
        content = content.replace(syntaxRegexDouble, "$1`");
        modified = true;
      }

      // 3. Just in case: `${API_BASE_URL}/api'` -> `${API_BASE_URL}/api`
      const edgeCase = /`\$\{API_BASE_URL\}\/api'/g;
      if (edgeCase.test(content)) {
        content = content.replace(edgeCase, "`${API_BASE_URL}/api`");
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

fixInDir(directory);
fixInDir(componentsDir);
console.log('Syntax errors fixed successfully.');
