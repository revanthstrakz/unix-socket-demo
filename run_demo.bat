@echo off
REM Script to run the Unix Socket Demo

echo === Unix Socket Demo Setup ===
echo.
echo This script will start both the Go backend and Next.js frontend

REM Check if Go is installed
go version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Error: Go is not installed or not in PATH
    echo Please install Go from https://golang.org/dl/
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    exit /b 1
)

REM Start the Go backend in a new terminal
echo Starting Go backend...
start cmd /k "cd backend && go run main.go"

REM Give the backend a moment to start
echo Waiting for backend to initialize...
timeout /t 3 /nobreak >nul

REM Install frontend dependencies if needed
echo Checking frontend dependencies...
if not exist frontend\node_modules (
    echo Installing frontend dependencies...
    cd frontend && npm install && cd ..
)

REM Start the Next.js frontend
echo Starting Next.js frontend...
cd frontend && npm run dev

echo Both services should now be running.
echo Access the demo at http://localhost:3000
