// 更新store导入脚本
import fs from 'fs';
import path from 'path';

// 需要查找和替换的文件扩展名
const extensions = ['.vue', '.js'];

// 查找文件中的导入语句
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 替换 import { mainStore } from "@/store"; 为 import { useMainStore } from "@/store/main";
    let updatedContent = content.replace(
      /import\s*{\s*mainStore\s*}\s*from\s*["']@\/store["']/g,
      'import { useMainStore } from "@/store/main"'
    );
    
    // 替换 const store = mainStore(); 为 const store = useMainStore();
    updatedContent = updatedContent.replace(
      /const\s+store\s*=\s*mainStore\(\);/g,
      'const store = useMainStore();'
    );
    
    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`Updated: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return false;
  }
}

// 递归查找目录中的文件
function processDirectory(directory) {
  let totalUpdated = 0;
  
  const items = fs.readdirSync(directory, { withFileTypes: true });
  
  for (const item of items) {
    const itemPath = path.join(directory, item.name);
    
    if (item.isDirectory() && item.name !== 'node_modules' && item.name !== 'dist') {
      // 递归处理子目录
      totalUpdated += processDirectory(itemPath);
    } else if (item.isFile() && extensions.includes(path.extname(item.name))) {
      // 处理匹配的文件
      if (processFile(itemPath)) {
        totalUpdated++;
      }
    }
  }
  
  return totalUpdated;
}

// 主入口
function main() {
  const srcDir = path.resolve('./src');
  console.log(`Starting to process files in: ${srcDir}`);
  
  const updatedFiles = processDirectory(srcDir);
  console.log(`Completed! Updated ${updatedFiles} files.`);
}

main(); 