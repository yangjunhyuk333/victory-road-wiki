// Electron 프리로드(Preload) 스크립트입니다.
// 렌더러 프로세스(React UI)와 메인 프로세스(Node.js) 사이의 안전한 통신 다리 역할을 합니다.

const { contextBridge } = require('electron');

// 렌더러 프로세스(window 객체)에 노출할 안전한 API 정의
contextBridge.exposeInMainWorld('electronAPI', {
  // 현재 데스크톱 앱 모드로 실행 중인지 확인하는 플래그
  isElectron: true,
  platform: process.platform
});
