#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('🚀 Building Smart Weather Advisory API...');

// Create build directory
const buildDir = path.join(rootDir, 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Copy package.json
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
packageJson.scripts = {
  start: 'node index.js'
};
fs.writeFileSync(
  path.join(buildDir, 'package.json'), 
  JSON.stringify(packageJson, null, 2)
);

// Copy source files (simplified for demo)
const srcDir = path.join(rootDir, 'src');
const buildSrcDir = path.join(buildDir, 'src');

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(src);
  
  files.forEach(file => {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);
    
    if (fs.statSync(srcFile).isDirectory()) {
      copyDirectory(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  });
}

copyDirectory(srcDir, buildSrcDir);

// Copy other necessary files
const filesToCopy = ['.env.example', 'README.md', 'vercel.json'];
filesToCopy.forEach(file => {
  const srcFile = path.join(rootDir, file);
  const destFile = path.join(buildDir, file);
  
  if (fs.existsSync(srcFile)) {
    fs.copyFileSync(srcFile, destFile);
  }
});

console.log('✅ Build completed successfully!');
console.log(`📝 Build output: ${buildDir}`);
