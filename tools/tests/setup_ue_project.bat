@echo off
REM Setup script to copy automation files to UE project
echo ========================================
echo UEScenarioFactory Setup Script
echo ========================================
echo.

set UE_PROJECT=C:\Users\sam.deiter\Documents\Unreal Projects\UEScenarioFactory
set SCRIPTS_SOURCE=C:\Users\sam.deiter\Documents\GitHub\UE5ScenarioTracker\unreal_scripts
set SPEC_FILE=C:\Users\sam.deiter\Documents\GitHub\UE5ScenarioTracker\directional_light_spec.json

echo Creating directories...
if not exist "%UE_PROJECT%\Content\Python" mkdir "%UE_PROJECT%\Content\Python"
if not exist "%UE_PROJECT%\Content\Scenarios" mkdir "%UE_PROJECT%\Content\Scenarios"

echo.
echo Copying Python automation scripts...
copy "%SCRIPTS_SOURCE%\*.py" "%UE_PROJECT%\Content\Python\" /Y
copy "%SCRIPTS_SOURCE%\README.md" "%UE_PROJECT%\Content\Python\" /Y

echo.
echo Copying spec file...
copy "%SPEC_FILE%" "%UE_PROJECT%\" /Y

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Python scripts copied to: %UE_PROJECT%\Content\Python
echo Spec file copied to: %UE_PROJECT%
echo.
echo Next steps:
echo 1. Enable Python plugin in UE Editor (Edit -^> Plugins)
echo 2. Restart UE Editor
echo 3. Create ScenarioCapture_Level with Landscape
echo 4. Run automation test
echo.
pause
