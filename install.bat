@echo off
echo ========================================
echo Stakeback Platform - Installation
echo ========================================
echo.

echo [1/3] Installing dependencies...
call npm install

if errorlevel 1 (
    echo.
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/3] Checking for .env file...
if not exist .env (
    echo .env file not found. Creating from .env.example...
    copy .env.example .env
    echo.
    echo IMPORTANT: Please edit .env file and add your Firebase credentials
    echo.
) else (
    echo .env file already exists
)

echo.
echo [3/3] Installation complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Edit .env file with your Firebase credentials
echo 2. Set up Firebase project (see SETUP_GUIDE.md)
echo 3. Run "npm start" to start the development server
echo ========================================
echo.
pause






