@echo off
chcp 65001 > nul
title 이나즈마 스테이션 데스크톱 런처
echo ========================================================
echo   ⚡ 이나즈마 스테이션 (Inazuma Station) PC 런처 실행 중...
echo ========================================================
echo.

set TARGET_URL=https://yangjunhyuk333.github.io/victory-road-wiki/

:: 1. Chrome 앱 모드 시도
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --app="%TARGET_URL%"
    exit /b
)
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" --app="%TARGET_URL%"
    exit /b
)
if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" (
    start "" "%LocalAppData%\Google\Chrome\Application\chrome.exe" --app="%TARGET_URL%"
    exit /b
)

:: 2. Microsoft Edge 앱 모드 시도
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --app="%TARGET_URL%"
    exit /b
)
if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" --app="%TARGET_URL%"
    exit /b
)

:: 3. 기본 브라우저로 열기
start "" "%TARGET_URL%"
exit /b
