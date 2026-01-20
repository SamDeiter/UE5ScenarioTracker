@echo off
echo Stopping any existing servers...
taskkill /F /IM python.exe 2>nul
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

echo.
echo Starting Scenario Generator API Server...
cd /d "%~dp0"
start "Scenario Generator API" python tools/python/api_server.py

timeout /t 3 >nul

echo.
echo Opening GUI in browser...
start "" "http://localhost:5000/tools/generator_ui/index.html"

echo.
echo Scenario Generator GUI is running!
echo API Server: http://localhost:5000
echo GUI: http://localhost:5000/tools/generator_ui/index.html
echo.
echo Press any key to stop the server...
pause >nul

echo.
echo Stopping server...
taskkill /F /IM python.exe 2>nul
echo Server stopped.
