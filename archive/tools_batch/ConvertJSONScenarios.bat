@echo off
pushd %~dp0..\..
echo Converting JSON scenario files to JS format...
echo.

REM Check if raw_data.json exists, if not create it from scenarios folder
if not exist raw_data.json (
    echo Creating raw_data.json from scenarios folder...
    
    REM Find all .js files that look like JSON (start with {)
    echo [ > raw_data.json
    
    set first=1
    for %%f in (scenarios\*.js) do (
        findstr /B /C:"{" "%%f" >nul
        if not errorlevel 1 (
            if !first!==0 echo , >> raw_data.json
            type "%%f" >> raw_data.json
            set first=0
        )
    )
    
    echo ] >> raw_data.json
    echo Created raw_data.json
)

echo.
echo Running converter...
node tools\js\convert_data.js

echo.
echo Done! Check the output_scenarios folder.
popd
pause
