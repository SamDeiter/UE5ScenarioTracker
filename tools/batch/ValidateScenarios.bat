@echo off
pushd %~dp0..\..
echo UE5 Scenario Time Validation
echo =============================
echo.
echo Checking all scenarios for time estimate mismatches...
echo.
node tools\js\validate_scenarios.js
echo.
popd
pause
