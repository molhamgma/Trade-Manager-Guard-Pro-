@echo off
chcp 65001
cd /d "%~dp0"
echo جاري تحضير تطبيق الجوال...
echo Preparing Mobile App...

:: --- SETUP PORTABLE NODE (From Run Project script) ---
set "NODE_DIR=C:\Users\Mohmmad Molhem\Downloads\node_portable\node-v20.10.0-win-x64"
set "NODE_EXE=%NODE_DIR%\node.exe"
set "NPM_CMD=%NODE_DIR%\npm.cmd"

echo [DEBUG] Checking Node paths...
if exist "%NODE_EXE%" (
    echo [OK] Using Portable Node: %NODE_EXE%
    set "PATH=%NODE_DIR%;%PATH%"
) else (
    echo [WARN] Portable Node not found. Trying global Node...
    set "NPM_CMD=npm"
)
:: ---------------------------

:: Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js first.
    pause
    exit /b
)

:: Install Dependencies
echo [1/5] Installing Dependencies...
call npm install

:: Build Web App
echo [2/5] Building Web App...
call npm run build

:: Initialize Capacitor (if needed)
if not exist "capacitor.config.json" (
    echo [INFO] capacitor.config.json missing, recreating...
    call npx cap init "TradeGuard" "com.trademanager.guardpro" --web-dir dist --npm-client npm
)

:: Add Android Platform
if not exist "android" (
    echo [3/5] Adding Android Platform...
    call npx cap add android
)

:: Sync
echo [4/5] Syncing with Android...
call npx cap sync

:: Open Android Studio
echo [5/5] Opening Android Studio...
echo Please wait for Android Studio to open, then click the "Run" (Play) button to launch on your emulator or connected device.
call npx cap open android

pause
