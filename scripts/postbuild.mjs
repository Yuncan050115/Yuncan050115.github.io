// scripts/postbuild.mjs - 构建后处理：复制 .nojekyll 和 .github 到 dist
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');

console.log('postbuild: 开始处理 dist 目录...');

// 1. 创建 .nojekyll 空文件
const nojekyllPath = path.join(dist, '.nojekyll');
fs.writeFileSync(nojekyllPath, '');
console.log(`postbuild: 已创建 ${path.relative(root, nojekyllPath)}`);

// 2. 复制 .github 目录到 dist
const srcGithub = path.join(root, '.github');
const destGithub = path.join(dist, '.github');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(srcGithub, destGithub);
console.log(`postbuild: 已复制 .github/ 到 dist/`);

console.log('postbuild: 完成');
