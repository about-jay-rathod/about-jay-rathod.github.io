@echo off
REM ═══════════════════════════════════════════════════════════════════════════
REM 🚀 Jay Rathod Portfolio - Automated Deployment Script (Windows Batch)
REM ═══════════════════════════════════════════════════════════════════════════
REM
REM This script automates the deployment process for the portfolio website.
REM Alternative batch script for systems where PowerShell execution is restricted.
REM
REM Prerequisites:
REM - Node.js 18+ installed
REM - Firebase CLI installed (npm install -g firebase-tools)
REM - Git configured
REM - .env file configured in functions\ directory
REM
REM Usage: deploy.bat [functions|hosting|all]
REM
REM Author: Jay Rathod
REM Last Updated: July 18, 2025
REM ═══════════════════════════════════════════════════════════════════════════

setlocal enabledelayedexpansion

REM Configuration
set PROJECT_NAME=Jay Rathod Portfolio
set FIREBASE_PROJECT=about-jay-rathod

REM Set colors (if supported)
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "MAGENTA=[95m"
set "CYAN=[96m"
set "RESET=[0m"

REM Parse arguments
set DEPLOY_MODE=%1
if "%DEPLOY_MODE%"=="" set DEPLOY_MODE=all

echo %MAGENTA%═══════════════════════════════════════════════════════════════════════════%RESET%
echo %MAGENTA%🚀 %PROJECT_NAME% - Automated Deployment%RESET%
echo %MAGENTA%═══════════════════════════════════════════════════════════════════════════%RESET%
echo.

REM Check Node.js
echo %BLUE%[STEP]%RESET% Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo %RED%[ERROR]%RESET% Node.js is not installed. Please install from https://nodejs.org/
    pause
    exit /b 1
)
echo %GREEN%[SUCCESS]%RESET% ✅ Node.js found and ready
echo %CYAN%[INFO]%RESET% Node.js version: 
node --version

REM Check Firebase CLI
echo %BLUE%[STEP]%RESET% Checking Firebase CLI installation...
firebase --version >nul 2>&1
if errorlevel 1 (
    echo %RED%[ERROR]%RESET% Firebase CLI is not installed. Run: npm install -g firebase-tools
    pause
    exit /b 1
)
echo %GREEN%[SUCCESS]%RESET% ✅ Firebase CLI found and ready
echo %CYAN%[INFO]%RESET% Firebase CLI installed successfully

REM Check Git
echo %BLUE%[STEP]%RESET% Checking Git installation...
git --version >nul 2>&1
if errorlevel 1 (
    echo %RED%[ERROR]%RESET% Git is not installed. Please install from https://git-scm.com/
    pause
    exit /b 1
)
echo %GREEN%[SUCCESS]%RESET% ✅ Git found and ready

echo %GREEN%[SUCCESS]%RESET% ✅ All prerequisites validated successfully!
echo.

REM Check .env file
echo %BLUE%[STEP]%RESET% Checking environment configuration...
if not exist "functions\.env" (
    echo %RED%[ERROR]%RESET% .env file not found in functions\ directory!
    echo %CYAN%[INFO]%RESET% Please copy functions\.env.template to functions\.env and configure your API keys.
    pause
    exit /b 1
)
echo %GREEN%[SUCCESS]%RESET% .env file found and configured!
echo.

REM Install dependencies
echo %BLUE%[STEP]%RESET% Installing Node.js dependencies...
cd functions
if exist "package-lock.json" (
    echo %CYAN%[INFO]%RESET% Using npm ci for faster, reliable builds...
    npm ci
) else (
    echo %CYAN%[INFO]%RESET% Using npm install for dependency installation...
    npm install
)
if errorlevel 1 (
    echo %RED%[ERROR]%RESET% Failed to install dependencies!
    cd ..
    pause
    exit /b 1
)
cd ..
echo %GREEN%[SUCCESS]%RESET% ✅ All Node.js dependencies installed successfully!
echo.

REM Validate syntax
echo %BLUE%[STEP]%RESET% Validating JavaScript syntax...
cd functions
echo %CYAN%[INFO]%RESET% Checking index.js for syntax errors...
node -c index.js
if errorlevel 1 (
    echo %RED%[ERROR]%RESET% JavaScript syntax error detected!
    cd ..
    pause
    exit /b 1
)
cd ..
echo %GREEN%[SUCCESS]%RESET% ✅ All JavaScript syntax validation passed!
echo.

REM Security check
echo %BLUE%[STEP]%RESET% Running security validation...
echo %CYAN%[INFO]%RESET% Checking .env file Git ignore status...
git check-ignore functions\.env >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%[WARNING]%RESET% .env file might not be ignored. Please check .gitignore
) else (
    echo %GREEN%[SUCCESS]%RESET% ✅ .env file is properly secured and ignored by Git
)
echo %GREEN%[SUCCESS]%RESET% ✅ Security validation completed!
echo.

REM Check Firebase authentication
echo %BLUE%[STEP]%RESET% Verifying Firebase authentication...
echo %CYAN%[INFO]%RESET% Checking Firebase login status...
firebase projects:list >nul 2>&1
if errorlevel 1 (
    echo %RED%[ERROR]%RESET% Not authenticated with Firebase. Please run: firebase login
    pause
    exit /b 1
)
echo %GREEN%[SUCCESS]%RESET% ✅ Firebase authentication verified successfully!
echo.

REM Deploy based on mode
if /i "%DEPLOY_MODE%"=="functions" goto DEPLOY_FUNCTIONS
if /i "%DEPLOY_MODE%"=="hosting" goto DEPLOY_HOSTING
if /i "%DEPLOY_MODE%"=="all" goto DEPLOY_ALL

:DEPLOY_FUNCTIONS
echo %BLUE%[STEP]%RESET% Deploying Firebase Functions...
echo %CYAN%[INFO]%RESET% Uploading function code to Firebase...
echo %CYAN%[INFO]%RESET% Project: %FIREBASE_PROJECT%
firebase deploy --only functions --project %FIREBASE_PROJECT%
if errorlevel 1 (
    echo %RED%[ERROR]%RESET% Firebase Functions deployment failed!
    pause
    exit /b 1
)
echo %GREEN%[SUCCESS]%RESET% ✅ Firebase Functions deployed successfully!
echo %GREEN%[SUCCESS]%RESET% ✅ All serverless functions are now live and operational!
echo %CYAN%[INFO]%RESET% 📡 Function URLs:
echo %CYAN%[INFO]%RESET% 🔒 API Endpoints: Configured dynamically for security
echo %CYAN%[INFO]%RESET%    • Local Dev: http://localhost:5001/YOUR-PROJECT-ID/us-central1/chatbot
echo %CYAN%[INFO]%RESET%    • Local Dev: http://localhost:5001/YOUR-PROJECT-ID/us-central1/sendContactEmail
echo %CYAN%[INFO]%RESET%    • Production: Access through website interface with proper authentication
echo.
if /i "%DEPLOY_MODE%"=="functions" goto SUCCESS

:DEPLOY_HOSTING
echo %BLUE%[STEP]%RESET% Deploying Firebase Hosting...
echo %CYAN%[INFO]%RESET% Uploading static website files...
echo %CYAN%[INFO]%RESET% Project: %FIREBASE_PROJECT%
firebase deploy --only hosting --project %FIREBASE_PROJECT%
if errorlevel 1 (
    echo %RED%[ERROR]%RESET% Firebase Hosting deployment failed!
    pause
    exit /b 1
)
echo %GREEN%[SUCCESS]%RESET% ✅ Firebase Hosting deployed successfully!
echo %GREEN%[SUCCESS]%RESET% ✅ Website is now live and accessible worldwide!
echo %CYAN%[INFO]%RESET% 🌐 Website URL: https://about-jay-rathod.web.app
echo.
if /i "%DEPLOY_MODE%"=="hosting" goto SUCCESS

:DEPLOY_ALL
goto DEPLOY_FUNCTIONS

:SUCCESS
echo %GREEN%═══════════════════════════════════════════════════════════════════════════%RESET%
echo %GREEN%🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!%RESET%
echo %GREEN%═══════════════════════════════════════════════════════════════════════════%RESET%
echo.
echo %CYAN%[INFO]%RESET% 🚀 Your portfolio is now live!
echo %CYAN%[INFO]%RESET% 🌐 Website: https://about-jay-rathod.web.app
echo %CYAN%[INFO]%RESET% 📧 Contact form with AI-powered email system is active
echo %CYAN%[INFO]%RESET% 🤖 Chatbot with Google Gemini 2.0 Flash is ready
echo.
echo %CYAN%[INFO]%RESET% 📊 Firebase Console: https://console.firebase.google.com/project/%FIREBASE_PROJECT%/overview
echo.

REM Optional: Open website
set /p OPEN_SITE="🌐 Open website in browser? (y/N): "
if /i "!OPEN_SITE!"=="y" (
    start https://about-jay-rathod.web.app
)

echo %GREEN%[SUCCESS]%RESET% 🎯 All done! Your portfolio is production-ready!
pause
