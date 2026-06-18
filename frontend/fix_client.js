const fs = require('fs');
const path = require('path');

const directory = './app';
const componentsDir = './components';

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix 'use client' position
      if (content.includes("import { API_BASE_URL }") && content.includes("'use client';")) {
        const importMatch = content.match(/import \{ API_BASE_URL \} from '[^']+';\n/);
        if (importMatch && content.indexOf("'use client';") > content.indexOf(importMatch[0])) {
          content = content.replace(importMatch[0], '');
          content = content.replace(/'use client';\n/g, "'use client';\n" + importMatch[0]);
          fs.writeFileSync(fullPath, content);
        }
      }
    }
  }
}

replaceInDir(directory);
replaceInDir(componentsDir);
console.log('Fixed use client successfully.');
