@echo off
chcp 65001 > nul
title 이나즈마 스테이션 실행기

:: 1. 이미 패키징된 .exe 프로그램이 있다면 즉시 독립 실행합니다.
if exist "dist_app\이나즈마 스테이션-win32-x64\이나즈마 스테이션.exe" (
    start "" "dist_app\이나즈마 스테이션-win32-x64\이나즈마 스테이션.exe"
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
