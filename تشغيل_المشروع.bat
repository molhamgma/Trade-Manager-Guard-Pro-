@echo off
setlocal

echo ==========================================
echo    TRADE MANAGER - PORTABLE LAUNCHER
echo ==========================================
echo.

set "NODE_DIR=C:\Users\Mohmmad Molhem\Downloads\node_portable\node-v20.10.0-win-x64"
set "NODE_EXE=%NODE_DIR%\node.exe"
set "NPM_CMD=%NODE_DIR%\npm.cmd"

echo [DEBUG] Checking Node paths...
if not exist "%NODE_EXE%" (
    echo [ERROR] Node.exe not found at: %NODE_EXE%
    pause
    exit /b
)
if not exist "%NPM_CMD%" (
    echo [ERROR] NPM not found at: %NPM_CMD%
    pause
    exit /b
)

echo [OK] Node found.
"%NODE_EXE%" -v
echo.

echo [DEBUG] Setting PATH...
set "PATH=%NODE_DIR%;%PATH%"

echo [DEBUG] Navigate to project folder...
cd /d "%~dp0"
if %errorlevel% NEQ 0 (
    echo [ERROR] Could not find project folder!
    pause
    exit /b
)

echo [OK] Inside Project Folder: %CD%
echo.

if not exist "node_modules" (
    echo [ACTION] Installing dependencies...
    echo (This usually takes 1-2 minutes. Please wait.)
    call "%NPM_CMD%" install
    if %errorlevel% NEQ 0 (
        echo [ERROR] npm install failed!
        pause
        exit /b
    )
) else (
    echo [INFO] node_modules exists. Skipping install.
)

echo.
echo ==========================================
echo      STARTING APPLICATION...
echo ==========================================
echo [INFO] Your browser will open shortly.
echo [INFO] Keep this black window OPEN.
echo.

call "%NPM_CMD%" run dev

echo.
echo [WARN] App stopped.
pause
