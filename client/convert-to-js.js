import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to convert TypeScript to JavaScript
function convertTsToJs(content) {
  // Remove TypeScript-specific syntax
  let jsContent = content
    // Remove type annotations from function parameters
    .replace(/: [A-Za-z<>\[\]{}|&, ]+/g, '')
    // Remove interface and type definitions
    .replace(/interface\s+\w+\s*{[^}]*}/g, '')
    .replace(/type\s+\w+\s*=\s*[^;]+;/g, '')
    // Remove React.FC type
    .replace(/React\.FC<[^>]*>/g, '')
    // Remove generic type parameters
    .replace(/<[A-Za-z<>\[\]{}|&, ]+>/g, '')
    // Remove explicit return types
    .replace(/:\s*[A-Za-z<>\[\]{}|&, ]+\s*=>/g, ' =>')
    // Remove variable type annotations
    .replace(/:\s*[A-Za-z<>\[\]{}|&, ]+(?=\s*[=,;\)])/g, '')
    // Remove import type statements
    .replace(/import\s+type\s+.*?from\s+['"][^'"]+['"];?\n?/g, '')
    // Remove @typescript-eslint comments
    .replace(/\/\* eslint-disable @typescript-eslint\/[^*]*\*\/\n?/g, '')
    .replace(/\/\/ eslint-disable-next-line @typescript-eslint\/[^\n]*\n?/g, '')
    // Remove TypeScript-specific comments
    .replace(/\/\* eslint-disable react-refresh\/only-export-components \*\/\n?/g, '')
    .replace(/\/\/ eslint-disable-next-line react-refresh\/only-export-components\n?/g, '')
    // Convert .tsx and .ts imports to .jsx and .js
    .replace(/from\s+['"]([^'"]+)\.tsx['"]/g, "from '$1.jsx'")
    .replace(/from\s+['"]([^'"]+)\.ts['"]/g, "from '$1.js'")
    // Remove @/ alias and replace with relative paths
    .replace(/from\s+['"]@\/([^'"]+)['"]/g, (match, importPath) => {
      return `from '../${importPath}'`;
    });

  return jsContent;
}

// Function to process a file
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const jsContent = convertTsToJs(content);
    
    // Determine new file extension
    const ext = path.extname(filePath);
    const newExt = ext === '.tsx' ? '.jsx' : '.js';
    const newPath = filePath.replace(ext, newExt);
    
    // Write the converted content
    fs.writeFileSync(newPath, jsContent);
    console.log(`Converted: ${filePath} -> ${newPath}`);
    
    // Delete the original file
    fs.unlinkSync(filePath);
    console.log(`Deleted: ${filePath}`);
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Function to recursively find and convert files
function convertDirectory(dir) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && item !== 'node_modules') {
      convertDirectory(fullPath);
    } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.ts'))) {
      processFile(fullPath);
    }
  }
}

// Start conversion
console.log('Starting TypeScript to JavaScript conversion...');
convertDirectory('./src');
console.log('Conversion completed!'); 