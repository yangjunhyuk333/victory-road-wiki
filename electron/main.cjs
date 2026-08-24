// Electron 메인 프로세스 진입점 파일입니다.
// 이 파일은 윈도우 창(GUI)을 띄우고 로컬에 빌드된 React 웹사이트(dist/index.html)를 로드합니다.

const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

// 윈도우 창 인스턴스를 저장할 변수
let mainWindow = null;

function createWindow() {
  // 1. 데스크톱 윈도우 창 생성 및 옵션 설정
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 850,
    minWidth: 1000,
    minHeight: 650,
    title: '이나즈마 스테이션 - 빅토리 로드 대백과',
    // 창 아이콘 설정
    icon: path.join(__dirname, '../public/logo.png'),
    // 상단 기본 메뉴바 숨김 (깔끔한 UI 유지)
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false, // 보안을 위해 Node 통합 비활성화
      contextIsolation: true, // 보안 격리 활성화
      webSecurity: false // 로컬 파일(file://) 프로토콜에서 리소스 로딩을 허용하기 위해 비활성화
    }
  });

  // 2. 로컬 빌드 결과물(dist/index.html)을 윈도우 창에 직접 로드합니다.
  // 서버를 켜지 않아도 file:// 프로토콜로 완전히 독립적으로 작동합니다.
  const indexPath = path.join(__dirname, '../dist/index.html');
  mainWindow.loadFile(indexPath);

  // 3. 외부 링크(http, https)를 클릭할 경우 일렉트론 창 내부가 아닌 기본 웹 브라우저로 엽니다.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  // 창이 닫힐 때 참조 해제
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Electron 앱이 준비되면 윈도우 창을 생성합니다.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // macOS 등에서 독 아이콘 클릭 시 창이 없으면 다시 생성
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 모든 창이 닫히면 앱을 완전히 종료합니다 (Windows/Linux 기준)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
