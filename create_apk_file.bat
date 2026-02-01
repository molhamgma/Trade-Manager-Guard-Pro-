@echo off
setlocal
chcp 65001 > nul
echo ===================================================
echo   Trade Manager Pro - APK Generator
echo   منشئ ملفات تطبيقات الأندرويد
echo ===================================================

cd /d "%~dp0"

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

:: Check for Java
where java >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Java is not installed. You need Java JDK 17 to build Android apps.
    echo [ERROR] جافا غير مثبتة. تحتاج إلى تثبيت Java JDK لبناء التطبيق.
    pause
    exit /b
)

echo.
echo [1/4] Install & Build Web Project...
echo [1/4] جاري بناء ملفات الموقع...
call npm install
call npm run build

echo.
echo [2/4] Initializing Android Project...
echo [2/4] جاري تجهيز بيئة الأندرويد...
if not exist "android" (
    call npx cap add android
)
call npx cap sync

echo.
echo [3/4] Building APK File (Gradle)...
echo [3/4] جاري إنشاء ملف التطبيق APK...
echo This process downloads build tools and may take 5-10 minutes for the first time.
echo هذه العملية قد تستغرق بضع دقائق...
cd android
call gradlew.bat assembleDebug
cd ..

echo.
echo [4/4] Finalizing...
if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
    copy /Y "android\app\build\outputs\apk\debug\app-debug.apk" "TradeManager_Mobile.apk"
    echo.
    echo **********************************************************
    echo * SUCCESS!                                               *
    echo * تم إنشاء التطبيق بنجاح!                               *
    echo *                                                        *
    echo * Your Android App File (APK) is ready:                  *
    echo * الملف جاهز في المجلد الحالي باسم:                      *
    echo * "TradeManager_Mobile.apk"                              *
    echo *                                                        *
    echo * Copy this file to your phone and install it.           *
    echo * انقل هذا الملف لجوالك وقم بتثبيته.                   *
    echo **********************************************************
) else (
    echo.
    echo [ERROR] Could not generate APK.
    echo [ERROR] فشل إنشاء الملف.
    echo Possible reasons:
    echo  - Android SDK is missing (Install Android Studio Command Line Tools)
    echo  - Java JAVA_HOME is not set correctly
    echo.
    echo Try running "build_mobile_app.bat" instead to debug in Android Studio.
    echo جرب تشغيل الملف build_mobile_app.bat لفتح أندرويد ستوديو وحل المشكلة.
)

pause
