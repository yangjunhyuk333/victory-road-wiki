@echo off
chcp 65001 > nul
title 이나즈마 스테이션 실행기

:: 1. 이미 빌드된 독립 실행 파일(InazumaStation.exe)이 있다면 즉시 실행합니다.
if exist "InazumaStation_App\InazumaStation-win32-x64\InazumaStation.exe" (
    start "" "InazumaStation_App\InazumaStation-win32-x64\InazumaStation.exe"
    exit
)

:: 2. 만약 dist 빌드가 없다면 빌드 후 실행합니다.
if not exist "dist\index.html" (
    echo [안내] 최초 실행을 위한 빌드를 진행합니다...
    call npm run build
)

:: 3. Electron 데스크톱 앱 실행
npx electron .
exit
