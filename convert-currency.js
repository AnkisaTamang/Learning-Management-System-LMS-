const fs = require('fs');
const path = require('path');

const componentsDir = 'c:\\Users\\Ankisha\\Desktop\\LMS0\\client\\src';

function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Replace $ with रु in various contexts
    content = content.replace(/\$\{/g, 'रु{');
    content = content.replace(/\$([0-9])/g, 'रु$1');
    content = content.replace(/\${parseFloat\(/g, 'रु{parseFloat(');
    content = content.replace(/\${course\.price}/g, 'रु{course.price}');
    content = content.replace(/\${.*?\.price.*?}/g, (match) => match.replace('$', 'रु'));
    content = content.replace(/Price: \$/g, 'Price: रु');
    content = content.replace(/"Free"/g, '"Free"'); // Keep Free as is
    content = content.replace(/\$\d+/g, (match) => match.replace('$', 'रु'));
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

function findAndReplaceInDirectory(dir) {
  const files = fs.readdirSync(dir);
  let updatedCount = 0;
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      updatedCount += findAndReplaceInDirectory(filePath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      if (replaceInFile(filePath)) {
        updatedCount++;
      }
    }
  });
  
  return updatedCount;
}

console.log('Converting $ to रु in all React components...');
const totalUpdated = findAndReplaceInDirectory(componentsDir);
console.log(`✅ Conversion complete! Updated ${totalUpdated} files.`);