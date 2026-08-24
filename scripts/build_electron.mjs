import { packager } from '@electron/packager';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

async function buildDesktopApp() {
  const rootDir = process.cwd();
  const tempDir = path.join(rootDir, 'temp_electron_build');
  const distAppDir = path.join(rootDir, 'dist_app');

  console.log('🚀 [1/4] React 최신 웹 프로젝트 빌드 중 (npm run build)...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('📦 [2/4] 초경량 배포용 패키지 스테이징 중...');
  // 이전 임시 폴더 및 빌드 폴더 정리
  if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
  if (fs.existsSync(distAppDir)) fs.rmSync(distAppDir, { recursive: true, force: true });

  fs.mkdirSync(tempDir, { recursive: true });

  // 필수 파일들만 복사 (소스코드 및 node_modules 제외로 초고속 패키징)
  fs.cpSync(path.join(rootDir, 'dist'), path.join(tempDir, 'dist'), { recursive: true });
  fs.cpSync(path.join(rootDir, 'electron'), path.join(tempDir, 'electron'), { recursive: true });
  fs.cpSync(path.join(rootDir, 'public'), path.join(tempDir, 'public'), { recursive: true });

  // 간소화된 실행 전용 package.json 작성
  const appPackageJson = {
    name: 'inazuma-station',
    version: '1.0.0',
    description: '이나즈마 스테이션 - 빅토리 로드 대백과 및 전술판',
    author: 'yangjunhyuk333',
    main: 'electron/main.cjs'
  };
  fs.writeFileSync(path.join(tempDir, 'package.json'), JSON.stringify(appPackageJson, null, 2), 'utf-8');

  console.log('⚡ [3/4] 윈도우 독립 실행 파일(.exe) 패키징 중...');
  try {
    const appPaths = await packager({
      dir: tempDir,
      name: '이나즈마 스테이션',
      platform: 'win32',
      arch: 'x64',
      out: distAppDir,
      overwrite: true,
      icon: path.join(rootDir, 'public/logo.png')
    });

    // 임시 폴더 삭제
    fs.rmSync(tempDir, { recursive: true, force: true });

    console.log('🎉 [4/4] 윈도우 데스크톱 프로그램 패키징 완료!');
    console.log('👉 프로그램 폴더:', appPaths[0]);
    console.log('👉 실행 파일(.exe):', path.join(appPaths[0], '이나즈마 스테이션.exe'));
  } catch (error) {
    console.error('❌ 패키징 중 오류 발생:', error);
    process.exit(1);
  }
}

buildDesktopApp();
