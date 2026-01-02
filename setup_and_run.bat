@echo off
setlocal enabledelayedexpansion

echo ===========================================
echo      Snake Game Setup and Runner
echo ===========================================

REM 1. Set Node.js Path (fallback to common location if not in PATH)
set "NODE_PATH=C:\Program Files\nodejs"
if exist "!NODE_PATH!\node.exe" (
    set "PATH=!NODE_PATH!;%PATH%"
    echo [INFO] Added Node.js to PATH from !NODE_PATH!
) else (
    echo [INFO] Using system PATH for Node.js
)

REM 2. Check Node Version
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found! Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
for /f "delims=" %%v in ('node --version') do echo [INFO] Found Node.js %%v

REM 3. Check and Install Dependencies
if not exist "node_modules" (
    echo [INFO] node_modules not found. Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
) else (
    echo [INFO] Dependencies already installed. Skipping npm install.
)

REM 4. Start the Application
echo [INFO] Starting the development server...
echo [INFO] The game will be available at http://localhost:5173/
call npm run dev

pause
