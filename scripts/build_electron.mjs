import { packager } from '@electron/packager';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

async function buildDesktopApp() {
  const rootDir = process.cwd();
  const tempDir = path.join(rootDir, 'temp_electron_build');
  const outAppDir = path.join(rootDir, 'InazumaStation_App');

  console.log('🚀 [1/4] React 최신 웹 프로젝트 빌드 중 (npm run build)...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('📦 [2/4] 초경량 배포용 패키지 스테이징 중...');
  if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
  if (fs.existsSync(outAppDir)) {
    try { fs.rmSync(outAppDir, { recursive: true, force: true }); } catch (e) {}
  }

  fs.mkdirSync(tempDir, { recursive: true });

  // 필수 파일들 복사
  fs.cpSync(path.join(rootDir, 'dist'), path.join(tempDir, 'dist'), { recursive: true });
  fs.cpSync(path.join(rootDir, 'electron'), path.join(tempDir, 'electron'), { recursive: true });
  fs.cpSync(path.join(rootDir, 'public'), path.join(tempDir, 'public'), { recursive: true });

  // 영문 식별자 기반의 안전한 package.json 작성
  const appPackageJson = {
    name: 'inazuma-station',
    version: '1.0.0',
    description: 'Inazuma Station Desktop App',
    author: 'yangjunhyuk333',
    main: 'electron/main.cjs'
  };
  fs.writeFileSync(path.join(tempDir, 'package.json'), JSON.stringify(appPackageJson, null, 2), 'utf-8');

  console.log('⚡ [3/4] 윈도우 독립 실행 프로그램 패키징 중 (InazumaStation.exe)...');
  try {
    const appPaths = await packager({
      dir: tempDir,
      name: 'InazumaStation', // 인코딩 깨짐을 원천 차단하는 안전한 영문 식별자
      platform: 'win32',
      arch: 'x64',
      out: outAppDir,
      overwrite: true,
      icon: path.join(rootDir, 'public/logo.png')
    });

    // 임시 폴더 삭제
    fs.rmSync(tempDir, { recursive: true, force: true });

    const targetExe = path.join(appPaths[0], 'InazumaStation.exe');

    console.log('🎉 [4/4] 윈도우 데스크톱 프로그램 패키징 완료!');
    console.log('👉 완성 폴더:', appPaths[0]);
    console.log('👉 실행 파일(.exe):', targetExe);

    // 윈도우 한글 바로가기 (.lnk) 자동 생성
    try {
      const shortcutScript = `
        $ws = New-Object -ComObject WScript.Shell;
        $s = $ws.CreateShortcut('${path.join(rootDir, '이나즈마 스테이션.lnk').replace(/'/g, "''")}');
        $s.TargetPath = '${targetExe.replace(/'/g, "''")}';
        $s.WorkingDirectory = '${appPaths[0].replace(/'/g, "''")}';
        $s.IconLocation = '${path.join(rootDir, 'public/logo.png').replace(/'/g, "''")}';
        $s.Description = '이나즈마 스테이션 실행기';
        $s.Save();
      `;
      execSync(`powershell -NoProfile -Command "${shortcutScript.replace(/\n/g, ' ')}"`, { stdio: 'pipe' });
      console.log('✨ 루트 폴더에 한글 바로가기 [이나즈마 스테이션.lnk] 생성 완료!');
    } catch (scErr) {
      // 바로가기 생성 실패 시 무시
    }
  } catch (error) {
    console.error('❌ 패키징 중 오류 발생:', error);
    process.exit(1);
  }
}

buildDesktopApp();
