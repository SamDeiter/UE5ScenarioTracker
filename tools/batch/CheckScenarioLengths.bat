@echo off
pushd %~dp0..\..
echo UE5 Scenario Analysis
echo =====================
echo.
node tools\js\analyze_scenarios.js
echo.
popd
pause
