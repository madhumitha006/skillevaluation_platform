@echo off
echo Starting SkillNexus Platform...
echo.

REM Kill any existing processes on ports 5001 and 5177
echo Killing existing processes...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5001') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5177') do taskkill /f /pid %%a >nul 2>&1

echo.
echo Starting Backend Server...
start "Backend" cmd /k "cd backend && npm run dev"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo Starting Frontend Server...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo SkillNexus Platform is starting...
echo Backend: http://localhost:5001
echo Frontend: http://localhost:5177
echo.
echo Press any key to stop all servers...
pause >nul

REM Kill processes when user presses a key
echo Stopping servers...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5001') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5177') do taskkill /f /pid %%a >nul 2>&1
echo Servers stopped.