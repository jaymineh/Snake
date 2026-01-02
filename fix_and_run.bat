@echo off
set "NODE_PATH=C:\Program Files\nodejs"
set "PATH=%NODE_PATH%;%PATH%"
echo PATH is %PATH% > startup_debug.log
echo Checking Node version... >> startup_debug.log
node --version >> startup_debug.log 2>&1
echo Checking NPM version... >> startup_debug.log
call npm --version >> startup_debug.log 2>&1
echo Installing dependencies... >> startup_debug.log
call npm install >> startup_debug.log 2>&1
echo Starting server... >> startup_debug.log
call npm run dev >> startup_debug.log 2>&1
