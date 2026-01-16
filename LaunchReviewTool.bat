@echo off
title Scenario Review Tool
echo ====================================
echo   UE5 Scenario Review Tool
echo ====================================
echo.
echo Starting local server on port 8080...
echo.

:: Start the server in the background
start /B python -m http.server 8080

:: Wait a moment for server to start
timeout /t 2 /nobreak >nul

:: Open the review tool in default browser
echo Opening review tool in browser...
start http://localhost:8080/tools/review/index.html

echo.
echo Server running at: http://localhost:8080
echo Review tool at: http://localhost:8080/tools/review/index.html
echo.
echo Press any key to stop the server...
pause >nul

:: Kill the Python server
taskkill /F /IM python.exe /FI "WINDOWTITLE eq *http.server*" >nul 2>&1
echo Server stopped.
