@echo off
pushd %~dp0..\..
echo UE5 Scenario Data Converter
echo ============================
echo.
echo Please ensure your raw data is in 'raw_data.json'
echo.
node tools\js\convert_data.js
echo.
popd
pause
