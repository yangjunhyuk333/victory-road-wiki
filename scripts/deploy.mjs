import { execSync } from 'child_process';
import path from 'path';

import fs from 'fs';

// 현재 프로젝트 루트 기준 dist 폴더 경로
const distPath = path.join(process.cwd(), 'dist');

console.log('🚀 [1/3] 프로덕션 빌드 시작...');
execSync('npm run build', { stdio: 'inherit' });

console.log('📦 [2/3] GitHub Pages(gh-pages) 배포 준비 중...');

// dist 폴더 내 이전 .git 제거하여 깨끗한 단일 커밋 상태 보장
const distGit = path.join(distPath, '.git');
if (fs.existsSync(distGit)) {
  fs.rmSync(distGit, { recursive: true, force: true });
}

function run(cmd, cwd = distPath) {
  try {
    execSync(cmd, { cwd, stdio: 'pipe' });
  } catch (e) {
    // git commit에서 변경사항이 없다는 오류 등은 무시
    if (!cmd.includes('commit') && !cmd.includes('remote add')) {
      throw e;
    }
  }
}

// Jekyll 처리 비활성화 (.nojekyll) 및 SPA 404 리다이렉트 (404.html) 보장
fs.writeFileSync(path.join(distPath, '.nojekyll'), '', 'utf8');
if (fs.existsSync(path.join(distPath, 'index.html'))) {
  fs.copyFileSync(path.join(distPath, 'index.html'), path.join(distPath, '404.html'));
}

try {
  run('git init');
  run('git checkout -B gh-pages');
  run('git lfs install');
  run('git lfs track "*.zip"');
  if (fs.existsSync(path.join(process.cwd(), '.gitattributes'))) {
    fs.copyFileSync(path.join(process.cwd(), '.gitattributes'), path.join(distPath, '.gitattributes'));
  }
  run('git add -A');
  const timestamp = new Date().toISOString();
  run(`git commit -m "Deploy to GitHub Pages at ${timestamp}"`);
  run('git remote add origin https://github.com/yangjunhyuk333/victory-road-wiki.git');
  run('git remote set-url origin https://github.com/yangjunhyuk333/victory-road-wiki.git');
  run('git push -f origin gh-pages');
  
  console.log('🎉 [3/3] 배포가 성공적으로 완료되었습니다!');
  console.log('👉 라이브 주소: https://yangjunhyuk333.github.io/victory-road-wiki/');
} catch (error) {
  console.error('❌ 배포 중 오류 발생:', error.message);
  process.exit(1);
}
