import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const docsDir = path.join(__dirname, 'documentation/docs/api-specification/');

function renameReadmeToParentFolder(dir) {
  const readmePath = path.join(dir, 'README.md');
  
  if (fs.existsSync(readmePath)) {
    const parentFolderName = path.basename(dir);
    const newPath = path.join(dir, `${parentFolderName}.md`);
    
    try {
      fs.renameSync(readmePath, newPath);
      console.log(`✓ Renamed: README.md -> ${parentFolderName}.md in ${dir}`);
    } catch (error) {
      console.error(`✗ Error renaming ${readmePath}:`, error.message);
    }
  }
  
  // Recursively check subdirectories
  try {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        renameReadmeToParentFolder(filePath);
      }
    });
  } catch (error) {
    console.error(`✗ Error reading directory ${dir}:`, error.message);
  }
}

function fixLinksInMarkdownFiles(dir) {
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      
      if (fs.statSync(filePath).isDirectory()) {
        fixLinksInMarkdownFiles(filePath);
      } else if (file.endsWith('.md')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // Replace ../README.md with ../api-specification.md (parent folder name)
        if (content.includes('../README.md')) {
          content = content.replace(/\.\.\/README\.md/g, '../api-specification.md');
          modified = true;
        }
        
        // Replace ../../README.md with ../../api-specification.md
        if (content.includes('../../README.md')) {
          content = content.replace(/\.\.\/\.\.\/README\.md/g, '../../api-specification.md');
          modified = true;
        }
        
        // Replace folder/README.md with folder/folder.md
        const regex = /(\w+)\/README\.md/g;
        const newContent = content.replace(regex, (match, folderName) => {
          modified = true;
          return `${folderName}/${folderName}.md`;
        });
        
        if (modified) {
          fs.writeFileSync(filePath, newContent, 'utf8');
          console.log(`✓ Fixed links in: ${filePath}`);
        }
      }
    });
  } catch (error) {
    console.error(`✗ Error processing directory ${dir}:`, error.message);
  }
}

console.log('Renaming README.md files...');
renameReadmeToParentFolder(docsDir);

console.log('\nFixing markdown links...');
fixLinksInMarkdownFiles(docsDir);

console.log('\n✓ Done!');