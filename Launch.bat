@echo off
echo Stopping any local web servers...
taskkill /F /IM python.exe 2>nul
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

echo.
echo Opening in browser...
start "" "file:///C:/Users/Sam Deiter/Documents/GitHub/UE5ScenarioTracker/index.html"

echo.
echo Application opened in browser with file:// protocol (no server needed)