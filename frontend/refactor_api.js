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
      if (content.includes('http://127.0.0.1:8000')) {
        // Add import if not exists
        if (!content.includes('import { API_BASE_URL } from')) {
          // Calculate relative path to config.ts
          const depth = fullPath.split(path.sep).length - 2;
          const relativePath = depth === 0 ? './config' : '../'.repeat(depth) + 'config';
          content = `import { API_BASE_URL } from '${relativePath}';\n` + content;
        }
        
        // Replace absolute URL with template literal
        content = content.replace(/'http:\/\/127\.0\.0\.1:8000\/api'/g, '`${API_BASE_URL}/api`');
        content = content.replace(/'http:\/\/127\.0\.0\.1:8000\/api\//g, '`${API_BASE_URL}/api/');
        content = content.replace(/`http:\/\/127\.0\.0\.1:8000\//g, '`${API_BASE_URL}/');
        content = content.replace(/'http:\/\/127\.0\.0\.1:8000\//g, '`${API_BASE_URL}/');
        
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

// Create config file
fs.writeFileSync('./config.ts', `export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';\n`);

replaceInDir(directory);
replaceInDir(componentsDir);
console.log('Replaced successfully.');
