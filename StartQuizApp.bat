@echo off
echo Opening UE5 Scenario Quiz Application...
cd /d "%~dp0"

echo.
echo Opening in browser with file:// protocol (no server needed)...
start "" "file:///%CD:\=/%/index.html"

echo.
echo Quiz application opened!
echo This is the main training/quiz tool where users take scenarios.
