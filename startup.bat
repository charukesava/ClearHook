@echo off
echo.
echo =========================================
echo   ClearHook - Phishing Analyzer
echo   One-Click Startup
echo =========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Node.js not found!
    echo Please install Node.js from: https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version
echo.

REM Start Backend
echo 📦 Starting Backend (Port 3001)...
start cmd /k "cd backend && npm install && npm run dev"
timeout /t 5 /nobreak
echo.

REM Start Frontend
echo 🎨 Starting Frontend (Port 5173)...
start cmd /k "cd frontend && npm install && npm run dev"
timeout /t 3 /nobreak
echo.

echo =========================================
echo ✅ ClearHook is starting!
echo.
echo 📍 Frontend: http://localhost:5173
echo 📍 Backend:  http://localhost:3001
echo.
echo ⚠️  IMPORTANT: Set GEMINI_API_KEY in backend/.env
echo.
echo Paste phishing SMS in frontend to test
echo =========================================
echo.
pause
