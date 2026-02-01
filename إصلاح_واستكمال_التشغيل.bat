@echo off
setlocal
chcp 65001 > nul
echo ==========================================
echo      Trade Manager - System Fixer
echo      أداة إصلاح مشاكل التشغيل
echo ==========================================
echo.

:: --- SETUP PORTABLE NODE (From Run Project script) ---
set "NODE_DIR=C:\Users\Mohmmad Molhem\Downloads\node_portable\node-v20.10.0-win-x64"
set "NODE_EXE=%NODE_DIR%\node.exe"
set "NPM_CMD=%NODE_DIR%\npm.cmd"

echo [1/3] Stopping stuck processes...
echo [1/3] إغلاق العمليات المعلقة...
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM adb.exe /T 2>nul

echo.
echo [2/3] Cleaning Cache (Vite)...
echo [2/3] تنظيف الملفات المؤقتة...
cd /d "%~dp0"
if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite"
)

if exist "node_modules\.vite" (
    echo.
    echo [ERROR] Could not delete hidden files. 
    echo [ERROR] فشل حذف الملفات العالقة.
    echo.
    echo SOLUTION: Restart your computer and try again.
    echo الحل: أعد تشغيل الجهاز وحاول مرة أخرى.
    pause
    exit /b
)

echo.
echo [3/3] Fix Complete! Starting App...
echo [3/3] تم الإصلاح! جاري التشغيل...
echo.

:: Run the app directly
call "%NPM_CMD%" run dev

pause
