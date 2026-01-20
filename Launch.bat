@echo off
title UE5 Scenario Tracker Launcher
color 0A

:MENU
cls
echo ========================================
echo   UE5 Scenario Tracker - Launcher
echo ========================================
echo.
echo   [1] Launch Scenario Tracker (Main App)
echo   [2] Launch Review Tool
echo   [3] Launch Both
echo   [4] Exit
echo.
set /p choice="Select option (1-4): "

if "%choice%"=="1" goto TRACKER
if "%choice%"=="2" goto REVIEW
if "%choice%"=="3" goto BOTH
if "%choice%"=="4" exit
goto MENU

:TRACKER
echo.
echo Starting Scenario Tracker on port 8080...
start /B python -m http.server 8080
timeout /t 2 /nobreak >nul
start http://localhost:8080/index.html
echo.
echo Scenario Tracker running at: http://localhost:8080
echo Press any key to return to menu...
pause >nul
goto MENU

:REVIEW
echo.
echo Starting Review Tool on port 8080...
start /B python -m http.server 8080
timeout /t 2 /nobreak >nul
start http://localhost:8080/tools/review/index.html
echo.
echo Review Tool running at: http://localhost:8080/tools/review/
echo Press any key to return to menu...
pause >nul
goto MENU

:BOTH
echo.
echo Starting server on port 8080...
start /B python -m http.server 8080
timeout /t 2 /nobreak >nul
echo Opening Scenario Tracker...
start http://localhost:8080/index.html
timeout /t 1 /nobreak >nul
echo Opening Review Tool...
start http://localhost:8080/tools/review/index.html
echo.
echo Both tools running!
echo - Tracker: http://localhost:8080
echo - Review:  http://localhost:8080/tools/review/
echo.
echo Press any key to stop server and return to menu...
pause >nul
taskkill /F /IM python.exe /FI "WINDOWTITLE eq *http.server*" >nul 2>&1
goto MENU